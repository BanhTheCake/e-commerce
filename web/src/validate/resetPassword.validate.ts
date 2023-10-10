import * as z from 'zod';

export const resetPasswordSchema = z
    .object({
        password: z
            .string()
            .min(5, { message: 'Mật khẩu không được nhỏ hơn 5 ký tự' }),
        confirmPassword: z
            .string()
            .min(5, { message: 'Xác nhận mật khẩu không chính xác' }),
    })
    .refine(
        ({ password, confirmPassword }) => {
            return password === confirmPassword;
        },
        {
            message: 'Xác nhận mật khẩu không chính xác',
            path: ['confirmPassword'],
        }
    );

export type TResetPasswordValidate = z.infer<typeof resetPasswordSchema>;
