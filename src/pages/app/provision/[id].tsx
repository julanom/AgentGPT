import type { GetServerSideProps, NextPage } from "next";
import Link from "next/link";
import { useState } from "react";

import AppLayout from "../../../components/layout/AppLayout";
import { prisma } from "../../../server/db";
import { formatMappingTitle } from "../../../server/mappings.mjs";
import { requireAuth } from "../../../server/requireAuth";

type ProvisionPageProps = {
  provision: {
    id: string;
    number: string;
    text: string;
    instrument: {
      id: string;
      title: string;
      effectiveFrom: string | null;
    };
    mappings: {
      id: string;
      relationType: string;
      targetProvision: {
        id: string;
        number: string;
        instrument: {
          id: string;
          title: string;
          authority: string;
          effectiveFrom: string | null;
        };
      };
    }[];
  };
};

const ProvisionPage: NextPage<ProvisionPageProps> = ({ provision }) => {
  const [explanation, setExplanation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    const response = await fetch(`/api/explain/${provision.id}`, { method: "POST" });
    const data = (await response.json()) as { explanation?: { outputText: string } };
    setExplanation(data.explanation?.outputText ?? null);
    setLoading(false);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              {provision.instrument.title} — Article {provision.number}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Effective date: {provision.instrument.effectiveFrom ?? "Not specified"}
            </p>
          </div>
          <Link
            href={`/app/instrument/${provision.instrument.id}`}
            className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600"
          >
            View instrument
          </Link>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold uppercase text-slate-500">Official text</h2>
            <p className="mt-4 whitespace-pre-line text-sm text-slate-700">{provision.text}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold uppercase text-slate-500">
              Linked instruments
            </h2>
            <div className="mt-4 space-y-3 text-sm">
              {provision.mappings.length === 0 ? (
                <p className="text-slate-500">No linked regulations yet.</p>
              ) : (
                provision.mappings.map((mapping) => (
                  <div key={mapping.id} className="rounded-xl border border-slate-100 p-3">
                    <p className="text-xs uppercase text-slate-400">{mapping.relationType}</p>
                    <Link
                      href={`/app/provision/${mapping.targetProvision.id}`}
                      className="font-semibold text-slate-900"
                    >
                      {formatMappingTitle({
                        instrumentTitle: mapping.targetProvision.instrument.title,
                        number: mapping.targetProvision.number,
                      })}
                    </Link>
                    <p className="text-xs text-slate-500">
                      {mapping.targetProvision.instrument.authority} •{" "}
                      {mapping.targetProvision.instrument.effectiveFrom ?? ""}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase text-slate-500">
                Explanation (AI-assisted)
              </h2>
              <button
                onClick={handleGenerate}
                className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white"
              >
                {loading ? "Generating" : "Regenerate"}
              </button>
            </div>
            <div className="mt-4 whitespace-pre-line text-sm text-slate-700">
              {explanation ?? "Generate a structured explanation with citations."}
            </div>
            <button className="mt-4 text-xs font-semibold text-slate-500 hover:text-slate-700">
              Report issue
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export const getServerSideProps: GetServerSideProps<ProvisionPageProps> = async (
  ctx
) => {
  const auth = await requireAuth(ctx);
  if ("redirect" in auth) {
    return auth;
  }
  const id = ctx.params?.id as string;
  const provision = await prisma.provision.findUnique({
    where: { id },
    include: {
      instrument: true,
      sourceMappings: {
        include: {
          targetProvision: { include: { instrument: true } },
        },
      },
    },
  });

  if (!provision) {
    return { notFound: true };
  }

  return {
    props: {
      provision: {
        id: provision.id,
        number: provision.number,
        text: provision.text,
        instrument: {
          id: provision.instrument.id,
          title: provision.instrument.title,
          effectiveFrom: provision.instrument.effectiveFrom
            ? provision.instrument.effectiveFrom.toISOString().split("T")[0]
            : null,
        },
        mappings: provision.sourceMappings.map((mapping) => ({
          id: mapping.id,
          relationType: mapping.relationType,
          targetProvision: {
            id: mapping.targetProvision.id,
            number: mapping.targetProvision.number,
            instrument: {
              id: mapping.targetProvision.instrument.id,
              title: mapping.targetProvision.instrument.title,
              authority: mapping.targetProvision.instrument.authority,
              effectiveFrom: mapping.targetProvision.instrument.effectiveFrom
                ? mapping.targetProvision.instrument.effectiveFrom
                    .toISOString()
                    .split("T")[0]
                : null,
            },
          },
        })),
      },
    },
  };
};

export default ProvisionPage;
