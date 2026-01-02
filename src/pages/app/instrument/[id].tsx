import type { GetServerSideProps, NextPage } from "next";
import Link from "next/link";

import AppLayout from "../../../components/layout/AppLayout";
import { prisma } from "../../../server/db";
import { requireAuth } from "../../../server/requireAuth";

type InstrumentPageProps = {
  instrument: {
    id: string;
    title: string;
    type: string;
    authority: string;
    year: number;
    provisions: {
      id: string;
      number: string;
      text: string;
    }[];
    reverseMappings: {
      id: string;
      sourceProvision: {
        id: string;
        number: string;
        instrument: { title: string };
      };
    }[];
  };
};

const InstrumentPage: NextPage<InstrumentPageProps> = ({ instrument }) => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <p className="text-xs uppercase text-slate-500">{instrument.type}</p>
          <h1 className="text-2xl font-semibold text-slate-900">{instrument.title}</h1>
          <p className="mt-1 text-sm text-slate-500">
            {instrument.authority} • {instrument.year}
          </p>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold uppercase text-slate-500">Official text</h2>
            <div className="mt-4 space-y-4 text-sm text-slate-700">
              {instrument.provisions.map((provision) => (
                <div key={provision.id}>
                  <Link
                    href={`/app/provision/${provision.id}`}
                    className="font-semibold text-slate-900"
                  >
                    Article {provision.number}
                  </Link>
                  <p className="mt-1 text-slate-600">{provision.text}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold uppercase text-slate-500">
              Implemented law articles
            </h2>
            <div className="mt-4 space-y-3 text-sm">
              {instrument.reverseMappings.length === 0 ? (
                <p className="text-slate-500">No linked law articles yet.</p>
              ) : (
                instrument.reverseMappings.map((mapping) => (
                  <div key={mapping.id} className="rounded-xl border border-slate-100 p-3">
                    <Link
                      href={`/app/provision/${mapping.sourceProvision.id}`}
                      className="font-semibold text-slate-900"
                    >
                      {mapping.sourceProvision.instrument.title} — Article {mapping.sourceProvision.number}
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export const getServerSideProps: GetServerSideProps<InstrumentPageProps> = async (
  ctx
) => {
  const auth = await requireAuth(ctx);
  if ("redirect" in auth) {
    return auth;
  }
  const id = ctx.params?.id as string;
  const instrument = await prisma.instrument.findUnique({
    where: { id },
    include: {
      provisions: true,
    },
  });

  if (!instrument) {
    return { notFound: true };
  }

  const reverseMappings = await prisma.mapping.findMany({
    where: { targetProvision: { instrumentId: instrument.id } },
    include: { sourceProvision: { include: { instrument: true } } },
  });

  return {
    props: {
      instrument: {
        id: instrument.id,
        title: instrument.title,
        type: instrument.type,
        authority: instrument.authority,
        year: instrument.year,
        provisions: instrument.provisions.map((provision) => ({
          id: provision.id,
          number: provision.number,
          text: provision.text,
        })),
        reverseMappings: reverseMappings.map((mapping) => ({
          id: mapping.id,
          sourceProvision: {
            id: mapping.sourceProvision.id,
            number: mapping.sourceProvision.number,
            instrument: { title: mapping.sourceProvision.instrument.title },
          },
        })),
      },
    },
  };
};

export default InstrumentPage;
