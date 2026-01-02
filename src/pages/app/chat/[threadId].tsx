import type { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import AppLayout from "../../../components/layout/AppLayout";
import { requireAuth } from "../../../server/requireAuth";

type ChatMessage = {
  id: string;
  role: string;
  content: string;
  createdAt: string;
};

type ChatThread = {
  id: string;
  title: string;
  contextType: string;
  messages: ChatMessage[];
};

const ChatThreadPage: NextPage = () => {
  const router = useRouter();
  const { threadId } = router.query;
  const [thread, setThread] = useState<ChatThread | null>(null);
  const [message, setMessage] = useState("");

  const loadThread = async () => {
    if (!threadId || typeof threadId !== "string") return;
    const response = await fetch(`/api/chat/${threadId}`);
    if (!response.ok) return;
    const data = (await response.json()) as { thread: ChatThread };
    setThread(data.thread);
  };

  useEffect(() => {
    void loadThread();
  }, [threadId]);

  const handleSend = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!message || !thread) return;

    await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        threadId: thread.id,
        message,
        contextType: thread.contextType,
      }),
    });
    setMessage("");
    await loadThread();
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">{thread?.title}</h1>
          <p className="mt-2 text-sm text-slate-600">Context: {thread?.contextType}</p>
        </div>
        <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          {(thread?.messages ?? []).map((chat) => (
            <div
              key={chat.id}
              className={`rounded-2xl p-4 text-sm ${
                chat.role === "ASSISTANT" ? "bg-slate-50" : "bg-slate-100"
              }`}
            >
              <p className="text-xs font-semibold uppercase text-slate-400">
                {chat.role}
              </p>
              <p className="mt-2 whitespace-pre-line text-slate-700">{chat.content}</p>
            </div>
          ))}
          {thread?.messages?.length === 0 && (
            <p className="text-sm text-slate-500">No messages yet.</p>
          )}
        </div>
        <form onSubmit={handleSend} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <label className="text-sm font-medium text-slate-700">Your message</label>
          <textarea
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm"
            rows={4}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
          />
          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
};

export default ChatThreadPage;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const auth = await requireAuth(ctx);
  if ("redirect" in auth) {
    return auth;
  }
  return { props: {} };
};
