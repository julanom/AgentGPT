import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

import { authOptions } from "../../../server/auth";
import { createCheckoutSession } from "../../../server/stripe";
import { prisma } from "../../../server/db";
import { env } from "../../../env/server.mjs";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ message: "Method not allowed" });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { plan } = req.body as { plan: "monthly" | "yearly" };
  const priceId =
    plan === "yearly" ? env.STRIPE_PRICE_YEARLY : env.STRIPE_PRICE_MONTHLY;

  if (!priceId) {
    return res.status(400).json({ message: "Stripe pricing is not configured" });
  }

  const origin = req.headers.origin ?? env.NEXTAUTH_URL ?? "";

  const checkoutSession = await createCheckoutSession({
    customerEmail: session.user.email,
    priceId,
    successUrl: `${origin}/app/billing?status=success`,
    cancelUrl: `${origin}/app/billing?status=cancel`,
  });

  await prisma.subscription.updateMany({
    where: { userId: session.user.id },
    data: { stripeCustomerId: checkoutSession.customer ?? null },
  });

  return res.status(200).json({ url: checkoutSession.url });
};

export default handler;
