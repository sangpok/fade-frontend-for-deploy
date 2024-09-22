import { z } from 'zod';

export const bonSchema = z.object({
  title: z.string().min(1).max(15),
  contents: z.string().min(1).max(200),
  attachmentId: z.number(),
});

export const uploadBoNSchema = bonSchema.pick({
  title: true,
  contents: true,
  attachmentId: true,
});

// export const editBoNSchema = bonSchema.pick({
//   title: true,
//   contents: true,
//   attachmentId: true,
// });

export type BoNSchema = z.infer<typeof bonSchema>;
export type UploadBoNSchema = z.infer<typeof uploadBoNSchema>;
