import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';

const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
});

export const usersRouter = router({
  list: protectedProcedure
    .input(z.object({
      page: z.number().min(1).default(1),
      limit: z.number().min(1).max(100).default(20),
    }))
    .query(async ({ ctx, input }) => {
      const users = await ctx.db.user.findMany({
        skip: (input.page - 1) * input.limit,
        take: input.limit,
      });
      const total = await ctx.db.user.count();
      return { users, total, totalPages: Math.ceil(total / input.limit) };
    }),

  byId: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({ where: { id: input.id } });
      if (!user) throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });
      return user;
    }),

  create: protectedProcedure
    .input(z.object({ email: z.string().email(), name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.create({ data: input });
    }),

  update: protectedProcedure
    .input(z.object({ id: z.string(), name: z.string().min(1).optional() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.update({ where: { id: input.id }, data: input });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.delete({ where: { id: input.id } });
    }),
});
