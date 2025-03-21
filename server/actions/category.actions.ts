'use server'

import { Pages, Routes } from "@/constants/enums";
import { getCurrentLocale } from "@/lib/getCurrentLocale"
import { db } from "@/lib/prisma";
import getTrans from "@/lib/translation";
import { addCategorySchema, updateCategorySchema } from "@/validations/category";
import { revalidatePath } from "next/cache";
import { pages } from "next/dist/build/templates/app-page";

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


export const updateCategory = async(id : string ,prevState: unknown, formData: FormData) => {
    const locale = await getCurrentLocale(); 
    const translations = await getTrans(locale);
    const validatedFields = updateCategorySchema(translations).safeParse(Object.fromEntries(formData.entries()))

    if (!validatedFields.success) {
        return {
            error : validatedFields.error.formErrors.fieldErrors,
            status : 400 ,
        }
    }

    try {

        const {categoryName } = validatedFields.data
            await db.category.update({
                where : {
                    id 
                },
                data : {
                    name : categoryName
                }
            })

            revalidatePath(`/${locale}/${Routes.ADMIN}/${Pages.CATEGORIES}`);
            revalidatePath(`/${locale}/${Routes.MENU}`);
        
            return {
              status: 200,
              message: translations.messages.updatecategorySucess,
            };

    }catch (error) {
        console.error(error);
        return {
          status: 500,
          message: translations.messages.unexpectedError,
        };
      }

}



export const deleteCategory = async (id : string) : Promise<{status : number , message :string}> => {
    const locale = await getCurrentLocale(); 
    const translations = await getTrans(locale);
   
    if (!id) {
        return {
                status : 400 ,
                message: translations.messages.unexpectedError,
        }
    }


    try {
          
        await db.category.delete({
            where : {
                id 
            }
        })


        revalidatePath(`/${locale}/${Routes.ADMIN}/${Pages.CATEGORIES}`);
        revalidatePath(`/${locale}/${Routes.MENU}`);

            return {
                message :translations.messages.deleteCategorySucess ,
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