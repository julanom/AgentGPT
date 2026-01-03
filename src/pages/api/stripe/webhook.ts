import type { NextApiRequest, NextApiResponse } from "next";
import { PlanBillingCycle, SubscriptionStatus } from "@prisma/client";

import { verifyStripeSignature } from "../../../server/stripe";
import { prisma } from "../../../server/db";

const getRawBody = (req: NextApiRequest): Promise<string> => {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", (err) => reject(err));
  });
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ message: "Method not allowed" });
  }

  const payload = await getRawBody(req);
  const signature = req.headers["stripe-signature"] as string | undefined;

  if (!verifyStripeSignature({ payload, signatureHeader: signature })) {
    return res.status(400).json({ message: "Invalid signature" });
  }

  const event = JSON.parse(payload) as {
    type: string;
    data: { object: Record<string, unknown> };
  };

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as {
      customer: string | null;
      subscription: string | null;
      customer_email: string | null;
      metadata?: Record<string, string>;
    };

    if (session.customer_email) {
      const planCycle = session.metadata?.plan_cycle;
      const billingCycle =
        planCycle === "yearly"
          ? PlanBillingCycle.YEARLY
          : planCycle === "monthly"
            ? PlanBillingCycle.MONTHLY
            : null;
      const plan = billingCycle
        ? await prisma.plan.findFirst({ where: { billingCycle } })
        : null;
      await prisma.subscription.updateMany({
        where: { user: { email: session.customer_email } },
        data: {
          status: SubscriptionStatus.ACTIVE,
          stripeCustomerId: session.customer,
          stripeSubscriptionId: session.subscription,
          ...(plan ? { planId: plan.id } : {}),
        },
      });
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as { customer: string | null };
    if (subscription.customer) {
      await prisma.subscription.updateMany({
        where: { stripeCustomerId: subscription.customer },
        data: { status: SubscriptionStatus.CANCELED },
      });
    }
  }

  return res.status(200).json({ received: true });
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
