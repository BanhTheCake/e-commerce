import { UserState } from '@/redux/features/user/userSlice';
import { IResponse } from '@/types/common';
import { api } from '@/utils/ky.config';
import { TForgotValidate } from '@/validate/forgot.validate';
import { TLoginValidate } from '@/validate/login.validate';
import { TResetPasswordValidate } from '@/validate/resetPassword.validate';
import { TSignupValidate } from '@/validate/signup.validate';
import { HTTPError } from 'ky';

export const signupMutation = async (data: TSignupValidate) => {
    try {
        const { confirmPassword, ...body } = data;
        const response = await api
            .post('signup', {
                json: body,
            })
            .json<IResponse<any>>();
        if (response.errCode !== 0) {
            return Promise.reject(response.message);
        }
        return response;
    } catch (error) {
        const isHttpError = error instanceof HTTPError;
        if (!isHttpError) {
            return Promise.reject('Something went wrong');
        }
        const errJson = await error.response.json();
        return Promise.reject(errJson.message);
    }
};

export const activeMutation = async (token: string) => {
    try {
        const response = await api
            .post('active', {
                json: { token },
            })
            .json<IResponse<never>>();
        if (response.errCode !== 0) {
            return Promise.reject(response.message);
        }
        return response;
    } catch (error) {
        const isHttpError = error instanceof HTTPError;
        if (!isHttpError) {
            return Promise.reject('Something went wrong');
        }
        const errJson = await error.response.json();
        return Promise.reject(errJson.message);
    }
};

export const loginMutation = async (data: TLoginValidate) => {
    try {
        const response = await api
            .post('signin', {
                json: data,
                credentials: 'include',
            })
            .json<IResponse<any>>();
        if (response.errCode !== 0) {
            return Promise.reject(response.message);
        }
        return response;
    } catch (error) {
        const isHttpError = error instanceof HTTPError;
        if (!isHttpError) {
            return Promise.reject('Something went wrong');
        }
        const errJson = await error.response.json();
        return Promise.reject(errJson.message);
    }
};

export const logoutMutation = async () => {
    try {
        const response = await api.post('signout').json<IResponse<never>>();
        return response;
    } catch (error) {
        const isHttpError = error instanceof HTTPError;
        if (!isHttpError) {
            return Promise.reject('Something went wrong');
        }
        const errJson = await error.response.json();
        return Promise.reject(errJson.message);
    }
};

export const forgotPasswordMutation = async (data: TForgotValidate) => {
    try {
        const response = await api
            .post('forgot', {
                json: data,
            })
            .json<IResponse<never>>();
        return response;
    } catch (error) {
        const isHttpError = error instanceof HTTPError;
        if (!isHttpError) {
            return Promise.reject('Something went wrong');
        }
        const errJson = await error.response.json();
        return Promise.reject(errJson.message);
    }
};

type TResetForgotPassword = Pick<TResetPasswordValidate, 'password'> & {
    token: string;
    userId: string;
};

export const resetForgotPasswordMutation = async (
    data: TResetForgotPassword
) => {
    try {
        const response = await api
            .post('reset', {
                json: data,
            })
            .json<IResponse<never>>();
        return response;
    } catch (error) {
        const isHttpError = error instanceof HTTPError;
        if (!isHttpError) {
            return Promise.reject('Something went wrong');
        }
        const errJson = await error.response.json();
        return Promise.reject(errJson.message);
    }
};

export const getCurrentUserQuery = async () => {
    try {
        const response = await api.get('me').json<UserState>();
        return response;
    } catch (error) {
        const isHttpError = error instanceof HTTPError;
        if (!isHttpError) {
            return Promise.reject('Something went wrong');
        }
        const errJson = await error.response.json();
        return Promise.reject(errJson.message);
    }
};
