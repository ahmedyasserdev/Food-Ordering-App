'use server'

import { getCurrentLocale } from "@/lib/getCurrentLocale";
import { db } from "@/lib/prisma";
import getTrans from "@/lib/translation";
import { addProductSchema } from "@/validations/product";
import { getImageUrl } from "./utils.actions";
import { revalidatePath } from "next/cache";
import { Pages, Routes } from "@/constants/enums";

export const addProduct = async (args: { categoryId: string }, prevState: unknown, formData: FormData) => {
    const locale = await getCurrentLocale();
    const translations = await getTrans(locale);
    const validatedFields = addProductSchema(translations).safeParse(Object.fromEntries(formData.entries()));


    if (!validatedFields.success) {
        return {
            error: validatedFields.error.formErrors.fieldErrors,
            status: 400,
            formData,
        };
    }


    const numberOfBasePrice = Number(validatedFields.data.basePrice)
    const imageFile = validatedFields.data.image as File
    const imageUrl = Boolean(imageFile.size) ? await getImageUrl(imageFile, "product_images") : undefined;

    try {
        if (imageUrl) {
            const highestOrder = await db.product.findFirst({
                orderBy: {
                    order: 'desc'
                },
                select: {
                    order: true
                }
            });


            const newOrder = highestOrder ? highestOrder.order + 1 : 1;
            await db.product.create({
                data: {
                    ...validatedFields.data,
                    basePrice: numberOfBasePrice,
                    image: imageUrl,
                    order: newOrder,
                }
            })
        }

        revalidatePath(`/${locale}/${Routes.ADMIN}/${Pages.CATEGORIES}`);
        revalidatePath(`/${locale}/${Routes.MENU}`);
        revalidatePath(`/${locale}`);

        return {
            message: translations.messages.productAdded,
            status: 201,
        }
    } catch (error) {
        console.error(error);
        return {
            status: 500,
            message: translations.messages.unexpectedError,
        };
    }
}




