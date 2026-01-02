import type { NextApiRequest, NextApiResponse } from "next";
import { Prisma } from "@prisma/client";

import { prisma } from "../../server/db";
import { normalizeSearchQuery } from "../../server/search-utils.mjs";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { q, type, authority, year } = req.query;
  const query = typeof q === "string" ? normalizeSearchQuery(q) : "";
  const filters: Prisma.Sql[] = [];

  if (typeof type === "string" && type.length > 0) {
    filters.push(Prisma.sql`i."type" = ${type}::"InstrumentType"`);
  }

  if (typeof authority === "string" && authority.length > 0) {
    filters.push(Prisma.sql`i."authority" ILIKE ${`%${authority}%`}`);
  }

  if (typeof year === "string" && year.length > 0) {
    filters.push(Prisma.sql`i."year" = ${Number(year)}`);
  }

  if (query) {
    filters.push(
      Prisma.sql`to_tsvector('simple', p."text" || ' ' || i."title") @@ plainto_tsquery('simple', ${query})`
    );
  }

  const whereClause = filters.length
    ? Prisma.sql`WHERE ${Prisma.join(filters, " AND ")}`
    : Prisma.empty;

  const results = await prisma.$queryRaw<
    {
      id: string;
      number: string;
      text: string;
      title: string;
      type: string;
      authority: string;
      year: number;
      score: number | null;
      snippet: string;
    }[]
  >`
    SELECT
      p.id,
      p."number",
      p."text",
      i."title",
      i."type",
      i."authority",
      i."year",
      CASE
        WHEN ${query} != ''
        THEN ts_rank_cd(
          to_tsvector('simple', p."text" || ' ' || i."title"),
          plainto_tsquery('simple', ${query})
        )
        ELSE 0
      END AS score,
      left(p."text", 180) AS snippet
    FROM "Provision" p
    JOIN "Instrument" i ON p."instrumentId" = i.id
    ${whereClause}
    ORDER BY score DESC, i."year" DESC
    LIMIT 50
  `;

  return res.status(200).json({ results });
};

export default handler;
