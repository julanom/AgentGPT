import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

import { authOptions } from "../../../server/auth";
import { prisma } from "../../../server/db";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ message: "Method not allowed" });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const threadId = req.query.threadId as string;
  const thread = await prisma.chatThread.findFirst({
    where: { id: threadId, userId: session.user.id },
    include: { messages: { orderBy: { createdAt: "asc" } } },
  });

  if (!thread) {
    return res.status(404).json({ message: "Thread not found" });
  }

  return res.status(200).json({ thread });
};

export default handler;
