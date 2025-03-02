import { Environments, Routes ,  Pages } from "@/constants/enums";
import { type NextAuthOptions } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import {PrismaAdapter} from '@next-auth/prisma-adapter'
import { db } from "@/lib/prisma";
import { login } from "./actions/auth.actions";
import { Locale } from "@/i18n";


export const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt",
        maxAge: 7 * 24 * 60 * 60,
        updateAge : 24 * 60 * 60
    },
    secret : process.env.NEXTAUTH_SECRET,
    debug : process.env.NODE_ENV === Environments.DEV ,
    providers: [
        Credentials({
            name: "credentials",
            credentials: {
                email: {
                    label: "Email",
                    type: "email",
                    placeholder: "hello@example.com",
                },

                password: {
                    label: "password",
                    type: "password"
                }

            },

            async   authorize (credentials, req) {
                const currentUrl = req?.headers?.referer;
                const locale = currentUrl?.split('/')[3] as Locale;
                const res = await login(credentials,  locale)

                    if (res.status === 200 && res.user) {
                        return res.user
                    }   else {
                        throw new Error(JSON.stringify({validationError : res.error , responseError  : res.message}));
                    }

                return null
            },
        })
    ],
    pages : {
        signIn : `/${Routes.AUTH}/${Pages.LOGIN}`
    },

    adapter : PrismaAdapter(db)
}