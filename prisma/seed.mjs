import crypto from "crypto";
import {
  PrismaClient,
  PlanBillingCycle,
  SubscriptionStatus,
  InstrumentType,
  ProvisionType,
  MappingRelationType,
  UserRole,
} from "@prisma/client";

const prisma = new PrismaClient();

const hashPassword = (password) => {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, 100000, 64, "sha512")
    .toString("hex");
  return `${salt}:${hash}`;
};

async function main() {
  const [monthlyPlan, yearlyPlan] = await prisma.$transaction([
    prisma.plan.upsert({
      where: { name: "Starter Monthly" },
      update: {},
      create: {
        name: "Starter Monthly",
        billingCycle: PlanBillingCycle.MONTHLY,
        limits: {
          explanationRuns: 50,
          chatMessages: 200,
        },
      },
    }),
    prisma.plan.upsert({
      where: { name: "Starter Yearly" },
      update: {},
      create: {
        name: "Starter Yearly",
        billingCycle: PlanBillingCycle.YEARLY,
        limits: {
          explanationRuns: 600,
          chatMessages: 2400,
        },
      },
    }),
  ]);

  const adminUser = await prisma.user.upsert({
    where: { email: "admin@oqanoon.dev" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@oqanoon.dev",
      role: UserRole.ADMIN,
      passwordHash: hashPassword("admin1234"),
      subscriptions: {
        create: {
          status: SubscriptionStatus.ACTIVE,
          planId: monthlyPlan.id,
        },
      },
    },
  });

  const law = await prisma.instrument.create({
    data: {
      type: InstrumentType.LAW,
      title: "OQanoon Commercial Code",
      authority: "Ministry of Justice",
      year: 2022,
      effectiveFrom: new Date("2022-01-01"),
      status: "Published",
      language: "English",
    },
  });

  const regulation = await prisma.instrument.create({
    data: {
      type: InstrumentType.REGULATION,
      title: "OQanoon Executive Regulation",
      authority: "Council of Ministers",
      year: 2022,
      effectiveFrom: new Date("2022-06-01"),
      status: "Published",
      language: "English",
    },
  });

  const lawProvisions = await prisma.$transaction(
    Array.from({ length: 5 }).map((_, index) => {
      const number = `${index + 1}`;
      return prisma.provision.create({
        data: {
          instrumentId: law.id,
          type: ProvisionType.ARTICLE,
          number,
          text: `Article ${number} establishes the baseline obligations for commercial operators, including registration, disclosure, and record-keeping.`,
        },
      });
    })
  );

  const regulationProvisions = await prisma.$transaction(
    Array.from({ length: 8 }).map((_, index) => {
      const number = `${index + 1}`;
      return prisma.provision.create({
        data: {
          instrumentId: regulation.id,
          type: ProvisionType.CLAUSE,
          number,
          text: `Clause ${number} provides the procedural implementation guidance for Article ${Math.min(index + 1, 5)} of the commercial code.`,
        },
      });
    })
  );

  await prisma.mapping.createMany({
    data: [
      {
        sourceProvisionId: lawProvisions[0].id,
        targetProvisionId: regulationProvisions[0].id,
        relationType: MappingRelationType.IMPLEMENTS,
      },
      {
        sourceProvisionId: lawProvisions[1].id,
        targetProvisionId: regulationProvisions[1].id,
        relationType: MappingRelationType.IMPLEMENTS,
      },
      {
        sourceProvisionId: lawProvisions[2].id,
        targetProvisionId: regulationProvisions[2].id,
        relationType: MappingRelationType.EXPLAINS,
      },
    ],
  });

  await prisma.subscription.upsert({
    where: { userId: adminUser.id },
    update: {},
    create: {
      userId: adminUser.id,
      planId: yearlyPlan.id,
      status: SubscriptionStatus.ACTIVE,
    },
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
