'use server'

import { Locale } from "@/i18n"
import { db } from "@/lib/prisma"
import getTrans from "@/lib/translation"
import { loginSchema } from "@/validations/auth"
import { compare } from 'bcrypt'


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
        const user = await db.user.findUnique({
            where: {
                email
            }
        });

        if (!user) {
            return {
                message: translations.messages.userNotFound,
                status: 401,

            }
        }

        const isValidPassword = await compare(password, user.password )

                if (!isValidPassword) {
                    return {
                        message: translations.messages.incorrectPassword,
                        status: 401,
                    }
                }


                return {
                    user : {
                        ...user ,
                        password : undefined
                    } ,
                    status : 200,
                    message : translations.messages.loginSuccessful
                }

    } catch (error) {
        console.error(error);
        return {
            status: 500,
            message: translations.messages.unexpectedError,
        };
    }

}
