import { createTRPCRouter } from "~/server/api/trpc";
import { dockerRouter } from "~/server/api/routers/docker";
import { foldersRouter } from "~/server/api/routers/folders";

export const appRouter = createTRPCRouter({
  docker: dockerRouter,
  folders: foldersRouter,
});

export type AppRouter = typeof appRouter;