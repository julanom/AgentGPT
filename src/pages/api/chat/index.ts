import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { ChatRole } from "@prisma/client";

import { authOptions } from "../../server/auth";
import { prisma } from "../../server/db";
import { checkUsageAllowance } from "../../server/billing";
import { buildAssistantResponse } from "../../server/chat.mjs";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ message: "Method not allowed" });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const allowance = await checkUsageAllowance(session.user.id);
  if (!allowance.withinLimits.chatMessages) {
    return res.status(402).json({
      message: "Trial or subscription limit reached. Upgrade to continue.",
    });
  }

  const { threadId, message, contextType, contextIds } = req.body as {
    threadId?: string;
    message: string;
    contextType: string;
    contextIds?: string[];
  };

  if (!message) {
    return res.status(400).json({ message: "Message is required" });
  }

  const thread = threadId
    ? await prisma.chatThread.findFirst({
        where: { id: threadId, userId: session.user.id },
      })
    : await prisma.chatThread.create({
        data: {
          userId: session.user.id,
          title: message.slice(0, 48),
          contextType,
          contextIds: contextIds ?? [],
        },
      });

  if (!thread) {
    return res.status(404).json({ message: "Thread not found" });
  }

  const provisions = contextIds?.length
    ? await prisma.provision.findMany({
        where: { id: { in: contextIds } },
        include: { instrument: true },
      })
    : [];

  const citations = provisions.map(
    (provision) => `[${provision.instrument.title} Art ${provision.number}]`
  );

  const assistantContent = buildAssistantResponse({ message, citations });

  const [userMessage, assistantMessage] = await prisma.$transaction([
    prisma.chatMessage.create({
      data: {
        threadId: thread.id,
        userId: session.user.id,
        role: ChatRole.USER,
        content: message,
      },
    }),
    prisma.chatMessage.create({
      data: {
        threadId: thread.id,
        userId: session.user.id,
        role: ChatRole.ASSISTANT,
        content: assistantContent,
        citations,
      },
    }),
  ]);

  await prisma.chatThread.update({
    where: { id: thread.id },
    data: { updatedAt: new Date() },
  });

  return res.status(200).json({
    thread,
    messages: [userMessage, assistantMessage],
  });
};

export default handler;
