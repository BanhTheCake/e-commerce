import * as z from 'zod';

export const loginSchema = z
    .object({
        usernameOrEmail: z
            .string()
            .min(5, { message: 'Tài khoản phải trên 5 kí tự!' }),
        password: z.string().min(5, { message: 'Mật khẩu phải trên 5 kí tự!' }),
    })
    .refine(
        ({ usernameOrEmail }) => {
            if (usernameOrEmail.includes('@')) {
                const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
                console.log(regex.test(usernameOrEmail));
                return regex.test(usernameOrEmail);
            }
            return true;
        },
        {
            message: 'Sai định dạnh email!',
            path: ['usernameOrEmail'],
        }
    );

export type TLoginValidate = z.infer<typeof loginSchema>;
