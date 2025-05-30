import { z } from 'zod';

export const SliderSchema = z.object({
  title: z.string().min(1),
  page: z.string().min(1),
  imageURL: z.string().url(), 
});

export const SliderUpdateSchema = z.object({
  title: z.string().optional(),
  page: z.string().optional(),
  imageURL: z.string().url().optional(),
});