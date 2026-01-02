import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

import { authOptions } from "../../../server/auth";
import { prisma } from "../../../server/db";
import { checkUsageAllowance } from "../../../server/billing";
import { buildExplanation } from "../../../server/explanation.mjs";

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
  if (!allowance.withinLimits.explanationRuns) {
    return res.status(402).json({
      message: "Trial or subscription limit reached. Upgrade to continue.",
    });
  }

  const provisionId = req.query.provisionId as string;
  const provision = await prisma.provision.findUnique({
    where: { id: provisionId },
    include: {
      instrument: true,
      sourceMappings: {
        include: { targetProvision: { include: { instrument: true } } },
      },
    },
  });

  if (!provision) {
    return res.status(404).json({ message: "Provision not found" });
  }

  const mappedProvisions = provision.sourceMappings.map((mapping) => mapping.targetProvision);

  const citations = [
    `[${provision.instrument.title} Art ${provision.number}]`,
    ...mappedProvisions.map(
      (mapped) => `[${mapped.instrument.title} Clause ${mapped.number}]`
    ),
  ];

  const outputText = buildExplanation({
    provisionText: provision.text,
    provisionCitation: citations[0],
    mappedCitations: citations.slice(1),
    relatedTitles: mappedProvisions.map(
      (mapped) => `${mapped.instrument.title} Clause ${mapped.number}`
    ),
  });

  const explanationRun = await prisma.explanationRun.create({
    data: {
      provisionId: provision.id,
      userId: session.user.id,
      outputText,
      citations,
    },
  });

  return res.status(200).json({ explanation: explanationRun });
};

export default handler;
