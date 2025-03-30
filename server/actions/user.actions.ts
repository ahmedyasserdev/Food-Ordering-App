'use server'
import { revalidatePath } from "next/cache";
import { getCurrentLocale } from "@/lib/getCurrentLocale"
import { db } from "@/lib/prisma";
import getTrans from "@/lib/translation";
import { Pages, Routes } from "@/constants/enums";
export const deleteUser = async (id : string) : Promise<{status : number , message :string}> => {
    const locale = await getCurrentLocale(); 
    const translations = await getTrans(locale);
   
    if (!id) {
        return {
                status : 400 ,
                message: translations.messages.unexpectedError,
        }
    }


    try {
          
         await db.user.delete({
            where : {
                id 
            }
        })


        revalidatePath(`/${locale}`);
        revalidatePath(`/${locale}/${Routes.ADMIN}}`);
        revalidatePath(`/${locale}/${Routes.ADMIN}/${Pages.USERS}`);
        revalidatePath(`/${locale}/${Routes.ADMIN}/${Pages.USERS}/${id}/${Pages.EDIT}`);

            return {
                message :translations.messages.deleteUserSucess ,
                status : 200 ,
            }
    } catch (error) {
        console.error(error);
        return {
          status: 500,
          message: translations.messages.unexpectedError,
        };
    }
}