'use server'

import { Pages, Routes } from "@/constants/enums";
import { getCurrentLocale } from "@/lib/getCurrentLocale"
import { db } from "@/lib/prisma";
import getTrans from "@/lib/translation";
import { addCategorySchema } from "@/validations/category";
import { revalidatePath } from "next/cache";

export const addCategory = async (prevState: unknown, formData: FormData) => {
    const locale = await getCurrentLocale(); 
    const translations = await getTrans(locale);
    const validatedFields = addCategorySchema(translations).safeParse(Object.fromEntries(formData.entries()))

    if (!validatedFields.success) {
        return {
            error : validatedFields.error.formErrors.fieldErrors,
            status : 400 ,
        }
    }

    const {name} = validatedFields.data
    try {
            const highestOrder = await db.category.findFirst({
                orderBy: {
                    order: 'desc'
                },
                select: {
                    order: true
                }
            });

            const newOrder = highestOrder ? highestOrder.order + 1 : 1;

            await db.category.create({
                data: {
                    name,
                    order: newOrder
                }
            });

            revalidatePath(`/${locale}/${Routes.ADMIN}/${Pages.CATEGORIES}`);
            revalidatePath(`/${locale}/${Routes.MENU}`);
            return {
                status: 201,
                message: translations.messages.categoryAdded,
              };
          
    } catch (error) {
        console.error(error);
        return {
          status: 500,
          message: translations.messages.unexpectedError,
        };
      }
}