import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import Docker from "dockerode";
import { promises as fs } from "fs";
import path from "path";

const docker = new Docker();

export const dockerRouter = createTRPCRouter({
  getStats: publicProcedure.query(async () => {
    const containers = await docker.listContainers({ all: true });
    const images = await docker.listImages();
    
    const systemInfo = await docker.info();
    
    return {
      containers: {
        running: containers.filter(c => c.State === "running").length,
        total: containers.length,
        list: containers.map(c => ({
          id: c.Id.substring(0, 12),
          name: c.Names[0]?.replace("/", "") || "unnamed",
          image: c.Image,
          state: c.State,
          status: c.Status,
        })),
      },
      images: {
        count: images.length,
        totalSize: images.reduce((acc, img) => acc + img.Size, 0),
        list: images.map(img => ({
          id: img.Id.substring(7, 19),
          tags: img.RepoTags || ["<none>"],
          size: img.Size,
        })),
      },
      system: {
        totalSpace: systemInfo.DockerRootDir ? 0 : 0, // Docker doesn't provide this directly
      },
    };
  }),

  startContainer: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const container = docker.getContainer(input.id);
      await container.start();
      return { success: true };
    }),

  stopContainer: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const container = docker.getContainer(input.id);
      await container.stop();
      return { success: true };
    }),

  removeContainer: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const container = docker.getContainer(input.id);
      await container.remove();
      return { success: true };
    }),
});