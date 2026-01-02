import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "../../../server/db";
import { hashPassword } from "../../../server/password.mjs";
import { SubscriptionStatus } from "@prisma/client";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { name, email, password } = req.body as {
    name: string;
    email: string;
    password: string;
  };

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const existing = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (existing) {
    return res.status(409).json({ message: "Account already exists" });
  }

  const trialEndsAt = new Date();
  trialEndsAt.setDate(trialEndsAt.getDate() + 14);

  const user = await prisma.user.create({
    data: {
      name,
      email: email.toLowerCase(),
      passwordHash: hashPassword(password),
      subscriptions: {
        create: {
          status: SubscriptionStatus.TRIALING,
          trialEndsAt,
        },
      },
    },
  });

  return res.status(201).json({ id: user.id, email: user.email });
};

export default handler;
