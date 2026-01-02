import type { GetServerSideProps, NextPage } from "next";
import Link from "next/link";
import { useState } from "react";

import AppLayout from "../../components/layout/AppLayout";
import { requireAuth } from "../../server/requireAuth";

type SearchResult = {
  id: string;
  number: string;
  text: string;
  title: string;
  type: string;
  authority: string;
  year: number;
  score: number;
  snippet: string;
};

const Search: NextPage = () => {
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [authority, setAuthority] = useState("");
  const [year, setYear] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (typeFilter) params.set("type", typeFilter);
    if (authority) params.set("authority", authority);
    if (year) params.set("year", year);

    const response = await fetch(`/api/search?${params.toString()}`);
    const data = (await response.json()) as { results: SearchResult[] };
    setResults(data.results ?? []);
    setLoading(false);
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Search legal content</h1>
          <p className="mt-2 text-sm text-slate-600">
            Search by keyword, article number, law name, regulation name, or topic tags.
          </p>
        </div>
        <form
          onSubmit={handleSearch}
          className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:grid-cols-4"
        >
          <div className="lg:col-span-2">
            <label className="text-xs font-semibold uppercase text-slate-500">
              Keyword or article number
            </label>
            <input
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by keyword, law name, or article number"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase text-slate-500">Type</label>
            <select
              className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value)}
            >
              <option value="">All</option>
              <option value="LAW">Law</option>
              <option value="REGULATION">Regulation</option>
              <option value="DECISION">Decision</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase text-slate-500">Year</label>
            <input
              className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              value={year}
              onChange={(event) => setYear(event.target.value)}
              placeholder="2023"
            />
          </div>
          <div className="lg:col-span-3">
            <label className="text-xs font-semibold uppercase text-slate-500">Authority</label>
            <input
              className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              value={authority}
              onChange={(event) => setAuthority(event.target.value)}
              placeholder="Ministry of Justice"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
        </form>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Results</h2>
          {results.length === 0 ? (
            <p className="text-sm text-slate-500">No results yet. Try a search.</p>
          ) : (
            <div className="space-y-4">
              {results.map((result) => (
                <div
                  key={result.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-xs uppercase text-slate-500">
                        {result.type} • {result.authority} • {result.year}
                      </p>
                      <h3 className="text-lg font-semibold text-slate-900">
                        {result.title} — Article {result.number}
                      </h3>
                    </div>
                    <Link
                      href={`/app/provision/${result.id}`}
                      className="rounded-full border border-slate-300 px-4 py-1 text-xs font-semibold text-slate-600"
                    >
                      View Article
                    </Link>
                  </div>
                  <p className="mt-3 text-sm text-slate-600">{result.snippet}...</p>
                  <p className="mt-2 text-xs text-slate-400">
                    Relevance score: {result.score.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default Search;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const auth = await requireAuth(ctx);
  if ("redirect" in auth) {
    return auth;
  }
  return { props: {} };
};
