import { z } from 'zod';

const accountIdRegExp = new RegExp(/^[a-zA-Z0-9._]{4,15}$/);

export const accountSchema = z.object({
  profileImageId: z.number(),
  accountId: z.string().regex(accountIdRegExp, '사용할 수 없는 ID입니다.'),
  gender: z.enum(['MALE', 'FEMALE']),
});

export const accountInitializeSchema = accountSchema.pick({
  accountId: true,
  gender: true,
});

export const accountEditSchema = accountSchema.pick({
  profileImageId: true,
  accountId: true,
});

export type AccountSchema = z.infer<typeof accountSchema>;
export type AccountInitializeSchema = z.infer<typeof accountInitializeSchema>;
export type AccountEditSchema = z.infer<typeof accountEditSchema>;
