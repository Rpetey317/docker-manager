import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { promises as fs } from "fs";
import path from "path";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export const foldersRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.scanFolder.findMany({
      orderBy: { createdAt: "desc" },
    });
  }),

  add: publicProcedure
    .input(z.object({ path: z.string(), name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.scanFolder.create({
        data: {
          path: input.path,
          name: input.name,
        },
      });
    }),

  remove: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.scanFolder.delete({
        where: { id: input.id },
      });
    }),

  scanDockerFiles: publicProcedure
    .input(z.object({ folderId: z.string() }))
    .query(async ({ ctx, input }) => {
      const folder = await ctx.db.scanFolder.findUnique({
        where: { id: input.folderId },
      });

      if (!folder) throw new Error("Folder not found");

      const dockerFiles: Array<{ path: string; type: "dockerfile" | "compose"; name: string }> = [];

      const scanDir = async (dirPath: string) => {
        const entries = await fs.readdir(dirPath, { withFileTypes: true });
        
        for (const entry of entries) {
          const fullPath = path.join(dirPath, entry.name);
          
          if (entry.isDirectory()) {
            await scanDir(fullPath);
          } else if (entry.name.toLowerCase() === "dockerfile") {
            dockerFiles.push({
              path: fullPath,
              type: "dockerfile",
              name: path.basename(path.dirname(fullPath)),
            });
          } else if (entry.name.includes("docker-compose") && entry.name.endsWith(".yml")) {
            dockerFiles.push({
              path: fullPath,
              type: "compose",
              name: entry.name,
            });
          }
        }
      };

      await scanDir(folder.path);
      return dockerFiles;
    }),

  buildDockerfile: publicProcedure
    .input(z.object({ dockerfilePath: z.string(), tag: z.string() }))
    .mutation(async ({ input }) => {
      const dir = path.dirname(input.dockerfilePath);
      const { stdout, stderr } = await execAsync(
        `docker build -t ${input.tag} .`,
        { cwd: dir }
      );
      return { stdout, stderr };
    }),

  runCompose: publicProcedure
    .input(z.object({ composePath: z.string(), action: z.enum(["up", "down"]) }))
    .mutation(async ({ input }) => {
      const dir = path.dirname(input.composePath);
      const { stdout, stderr } = await execAsync(
        `docker-compose ${input.action} -d`,
        { cwd: dir }
      );
      return { stdout, stderr };
    }),
});