import type { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";

import { authOptions } from "./auth";

export const requireAdmin = async (ctx: GetServerSidePropsContext) => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    } as const;
  }

  if (session.user.role !== "ADMIN") {
    return {
      redirect: {
        destination: "/app/search",
        permanent: false,
      },
    } as const;
  }

  return { session } as const;
};
