'use server'

import { Pages, Routes } from "@/constants/enums"
import { Locale } from "@/i18n"
import { getCurrentLocale } from "@/lib/getCurrentLocale"
import { db } from "@/lib/prisma"
import getTrans from "@/lib/translation"
import { loginSchema, signUpSchema } from "@/validations/auth"
import { compare, hash } from 'bcrypt'
import { revalidatePath } from "next/cache"


export const getUserByEmail = async (email: string) => {
    try {
        const user = await db.user.findUnique({
            where: {
                email,
            }
        });

        return user
    } catch {
        return null
    }
}


export const login = async (credentials: Record<"email" | "password", string> | undefined, locale: Locale) => {
    const translations = await getTrans(locale)
    const result = loginSchema(translations).safeParse(credentials);
    if (!result.success) {

        return {
            error: result.error.formErrors.fieldErrors,
            status: 400,
        }
    }

    try {
        const { email, password } = result.data
        const user = await getUserByEmail(email)

        if (!user) {
            return {
                message: translations.messages.userNotFound,
                status: 401,

            }
        }

        const isValidPassword = await compare(password, user.password)

        if (!isValidPassword) {
            return {
                message: translations.messages.incorrectPassword,
                status: 401,
            }
        }


        return {
            user: {
                ...user,
                password: undefined
            },
            status: 200,
            message: translations.messages.loginSuccessful
        }

    } catch (error) {
        console.error(error);
        return {
            status: 500,
            message: translations.messages.unexpectedError,
        };
    }

}


export const signup = async (prevState: unknown, formData: FormData) => {
    const locale = await getCurrentLocale();
    const translations = await getTrans(locale)

    const result = signUpSchema(translations).safeParse(
        Object.fromEntries(formData.entries())
    );

    if (!result.success) {
        return {
            error: result.error.formErrors.fieldErrors,
            formData
        }
    }

    try {
        const { email, confirmPassword, password, name } = result.data
        const user = await getUserByEmail(email)

        if (user) {
            return {
                status: 409,
                message: translations.messages.userAlreadyExists,
                formData
            }
        }

        const hashedPassword = await hash(password, 10);
        const createdUser = await db.user.create({
            data: {
                name,
                email,
                password: hashedPassword
            }
        });



        revalidatePath(`/${locale}/${Routes.ADMIN}/${Pages.USERS}`);
        revalidatePath(`/${locale}/${Routes.ADMIN}/${Pages.USERS}/${createdUser.id}/${Pages.EDIT}`);


        return {
            status: 201,
            message: translations.messages.accountCreated,
            user: {
                id: createdUser.id,
                email: createdUser.email,
                name: createdUser.name
            }
        }


    } catch (error) {
        console.error(error);
        return {
            status: 500,
            message: translations.messages.unexpectedError,
        };
    }

}