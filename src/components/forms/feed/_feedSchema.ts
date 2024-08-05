import { z } from 'zod';

export const outfitItemSchema = z
  .object({
    categoryId: z.number(),
    brandName: z.string(),
    details: z.string(),
  })
  .refine(
    ({ categoryId, brandName }) => {
      const doseNotSelectCategory = categoryId === -1;
      const doseInputBrandName = !doseNotSelectCategory && brandName !== '';

      return doseNotSelectCategory || doseInputBrandName;
    },
    { path: ['brandName'] }
  );

export const feedSchema = z.object({
  attachmentId: z.number().refine((value) => value !== -1, '사진을 선택해주세요.'),
  styleIds: z.array(z.number()), // Optional
  outfits: z.array(outfitItemSchema), // Optional
});

export const uploadFeedSchema = feedSchema.pick({
  attachmentId: true,
  styleIds: true,
  outfits: true,
});

export const editFeedSchema = feedSchema.pick({
  styleIds: true,
  outfits: true,
});

export type OutfitItemSchema = z.infer<typeof outfitItemSchema>;

export type FeedSchema = z.infer<typeof feedSchema>;
export type UploadFeedSchema = z.infer<typeof uploadFeedSchema>;
export type EditFeedSchema = z.infer<typeof editFeedSchema>;
