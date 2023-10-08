import * as z from 'zod';

export const forgotSchema = z.object({
    email: z.string().email({ message: 'Email không hợp lệ' }),
});

export type TForgotValidate = z.infer<typeof forgotSchema>;
