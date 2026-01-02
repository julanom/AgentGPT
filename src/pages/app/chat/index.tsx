import type { GetServerSideProps, NextPage } from "next";
import Link from "next/link";
import { useEffect, useState } from "react";

import AppLayout from "../../../components/layout/AppLayout";
import { requireAuth } from "../../../server/requireAuth";

type Thread = {
  id: string;
  title: string;
  contextType: string;
  updatedAt: string;
};

const ChatIndex: NextPage = () => {
  const [threads, setThreads] = useState<Thread[]>([]);

  useEffect(() => {
    const loadThreads = async () => {
      const response = await fetch("/api/chat/history");
      if (!response.ok) return;
      const data = (await response.json()) as { threads: Thread[] };
      setThreads(data.threads ?? []);
    };
    void loadThreads();
  }, []);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Chat & discussions</h1>
            <p className="mt-2 text-sm text-slate-600">
              Discuss provisions with an AI assistant. Responses are citation-based and informational.
            </p>
          </div>
          <Link
            href="/app/chat/new"
            className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
          >
            New chat
          </Link>
        </div>
        <div className="space-y-4">
          {threads.length === 0 ? (
            <p className="text-sm text-slate-500">No threads yet. Start a new discussion.</p>
          ) : (
            threads.map((thread) => (
              <Link
                key={thread.id}
                href={`/app/chat/${thread.id}`}
                className="block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <p className="text-xs uppercase text-slate-400">{thread.contextType}</p>
                <h3 className="text-lg font-semibold text-slate-900">{thread.title}</h3>
                <p className="mt-1 text-xs text-slate-500">Updated {thread.updatedAt}</p>
              </Link>
            ))
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default ChatIndex;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const auth = await requireAuth(ctx);
  if ("redirect" in auth) {
    return auth;
  }
  return { props: {} };
};
