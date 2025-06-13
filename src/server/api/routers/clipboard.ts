import { desc, eq, sql } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { clipboard } from "~/server/db/schema";

export const clipboardRouter = createTRPCRouter({
  addItem: publicProcedure
    .input(
      z.object({
        item: z.string().min(1),
        device: z.enum(["desktop", "mobile"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.db.insert(clipboard).values({
          data: input
        });
        return { success: true }
      } catch (e: unknown) {
        return { success: false, error: e?.toString() };
      }
    }),
  getLastCopiedItem: publicProcedure
    .input(z.object({ device: z.enum(["desktop", "mobile"]) }))
    .query(async ({ ctx, input }) => {
      const result = await ctx.db
        .select()
        .from(clipboard)
        .where(sql`data ->> 'device' = ${input.device}`)
        .orderBy(desc(clipboard.createdAt))
        .limit(1);
      
      return result[0]?.data ?? null;
    }),
});
