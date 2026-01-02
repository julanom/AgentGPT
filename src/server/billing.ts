import { prisma } from "./db";
import { ChatRole, SubscriptionStatus } from "@prisma/client";

const trialLimits = {
  explanationRuns: 5,
  chatMessages: 15,
};

export type UsageLimits = typeof trialLimits;

export const getUsageLimits = async (userId: string) => {
  const subscription = await prisma.subscription.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { plan: true },
  });

  if (!subscription) {
    return { status: "NONE", limits: trialLimits, subscription };
  }

  if (subscription.status === SubscriptionStatus.ACTIVE && subscription.plan) {
    return { status: "ACTIVE", limits: subscription.plan.limits as UsageLimits, subscription };
  }

  if (subscription.status === SubscriptionStatus.TRIALING) {
    const isTrialActive = subscription.trialEndsAt
      ? subscription.trialEndsAt > new Date()
      : false;
    return {
      status: isTrialActive ? "TRIAL" : "EXPIRED",
      limits: trialLimits,
      subscription,
    };
  }

  return { status: subscription.status, limits: trialLimits, subscription };
};

export const getUsageCounts = async (userId: string) => {
  const [explanationRuns, chatMessages] = await Promise.all([
    prisma.explanationRun.count({ where: { userId } }),
    prisma.chatMessage.count({ where: { userId, role: ChatRole.USER } }),
  ]);

  return { explanationRuns, chatMessages };
};

export const checkUsageAllowance = async (userId: string) => {
  const { limits, status } = await getUsageLimits(userId);
  const counts = await getUsageCounts(userId);

  const withinLimits = {
    explanationRuns: counts.explanationRuns < limits.explanationRuns,
    chatMessages: counts.chatMessages < limits.chatMessages,
  };

  return { status, limits, counts, withinLimits };
};
