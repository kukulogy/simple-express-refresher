import * as z from 'zod';

export enum Status {
  Pending = 'PENDING',
  Paid = 'PAID',
  Cancelled = 'CANCELLED',
}

export const orderSchema = z.object({
  id: z.string(),
  productId: z.string(),
  quantity: z.number(),
  price: z.number(),
  status: z.enum(Status),
});

export const storedOrderSchema = orderSchema.extend({
  total: z.number(),
});

export const orderPatchSchema = z.object({
  status: z.enum(Status)
})

export type StoredOrder = z.infer<typeof storedOrderSchema>;
export type Order = z.infer<typeof orderSchema>;
export type OrderPatch = z.infer<typeof orderPatchSchema>;