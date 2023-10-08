import * as z from 'zod';

export const SignupSchema = z
    .object({
        username: z.string().min(5, { message: 'Tài khoản tối thiểu 5 ký tự' }),
        email: z.string().email({ message: 'Email không hợp lệ' }),
        password: z.string().min(5, { message: 'Mật khẩu tối thiểu 5 ký tự' }),
        confirmPassword: z
            .string()
            .min(5, { message: 'Mật khẩu tối thiểu 5 ký tự' }),
    })
    .refine(
        ({ confirmPassword, password }) => {
            return confirmPassword === password;
        },
        {
            message: 'Xác nhận mật khẩu phải giống nhau',
            path: ['confirmPassword'],
        }
    );

export type TSignupValidate = z.infer<typeof SignupSchema>;
