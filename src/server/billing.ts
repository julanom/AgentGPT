import { prisma } from "./db";
import { ChatRole, PlanBillingCycle, SubscriptionStatus } from "@prisma/client";

const trialLimits = {
  explanationRuns: 5,
  chatMessages: 15,
};

export type UsageLimits = typeof trialLimits;

type UsageWindow = { start: Date; end: Date } | null;

const addMonths = (date: Date, months: number) => {
  const base = new Date(date);
  const originalDay = base.getDate();
  base.setDate(1);
  base.setMonth(base.getMonth() + months);
  const daysInMonth = new Date(base.getFullYear(), base.getMonth() + 1, 0).getDate();
  base.setDate(Math.min(originalDay, daysInMonth));
  return base;
};

const getBillingWindow = (
  subscription: { createdAt: Date; status: SubscriptionStatus; plan?: { billingCycle: PlanBillingCycle } | null; trialEndsAt?: Date | null } | null
): UsageWindow => {
  if (!subscription) {
    return null;
  }

  const now = new Date();

  if (subscription.status === SubscriptionStatus.ACTIVE && subscription.plan) {
    const monthsPerCycle = subscription.plan.billingCycle === PlanBillingCycle.YEARLY ? 12 : 1;
    const monthsDiff =
      (now.getFullYear() - subscription.createdAt.getFullYear()) * 12 +
      (now.getMonth() - subscription.createdAt.getMonth());
    const cyclesElapsed = Math.max(0, Math.floor(monthsDiff / monthsPerCycle));
    let cycleStart = addMonths(subscription.createdAt, cyclesElapsed * monthsPerCycle);
    if (cycleStart > now) {
      cycleStart = addMonths(cycleStart, -monthsPerCycle);
    }
    return { start: cycleStart, end: now };
  }

  if (subscription.status === SubscriptionStatus.TRIALING) {
    return { start: subscription.createdAt, end: now };
  }

  return null;
};

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

export const getUsageCounts = async (userId: string, window: UsageWindow = null) => {
  const createdAtFilter = window ? { gte: window.start, lt: window.end } : undefined;
  const [explanationRuns, chatMessages] = await Promise.all([
    prisma.explanationRun.count({ where: { userId, createdAt: createdAtFilter } }),
    prisma.chatMessage.count({ where: { userId, role: ChatRole.USER, createdAt: createdAtFilter } }),
  ]);

  return { explanationRuns, chatMessages };
};

export const checkUsageAllowance = async (userId: string) => {
  const { limits, status, subscription } = await getUsageLimits(userId);
  const window = getBillingWindow(subscription);
  const counts = await getUsageCounts(userId, window);

  const withinLimits = {
    explanationRuns: counts.explanationRuns < limits.explanationRuns,
    chatMessages: counts.chatMessages < limits.chatMessages,
  };

  return { status, limits, counts, withinLimits };
};
