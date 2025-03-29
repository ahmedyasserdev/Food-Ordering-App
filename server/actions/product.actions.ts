'use server'

import { getCurrentLocale } from "@/lib/getCurrentLocale";
import { db } from "@/lib/prisma";
import getTrans from "@/lib/translation";
import { addProductSchema, updateProductSchema } from "@/validations/product";
import { getImageUrl } from "./utils.actions";
import { revalidatePath } from "next/cache";
import { Pages, Routes } from "@/constants/enums";
import { Extra, ExtraIngredients, ProductSizes, Size } from "@prisma/client";

export const addProduct = async (args: { categoryId: string ,       options: { sizes: Partial<Size>[]; extras: Partial<Extra>[] }; }, prevState: unknown, formData: FormData) => {
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
                    image: imageUrl,
                    basePrice : numberOfBasePrice,
                    categoryId: args.categoryId,
                    order : newOrder ,
                    sizes: {
                      createMany: {
                        data: args.options.sizes.map((size) => ({
                          name: size.name as ProductSizes,
                          price: Number(size.price),
                        })),
                      },
                    },
                    extras: {
                      createMany: {
                        data: args.options.extras.map((extra) => ({
                          name: extra.name as ExtraIngredients,
                          price: Number(extra.price),
                        })),
                      },
                    },
                  },
                });

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

export const deleteProduct = async (id: string): Promise<{ status: number, message: string }> => {
    const locale = await getCurrentLocale();
    const translations = await getTrans(locale);
    try {

        if (!id) {
            return {
                status: 400,
                message: "Missing Product Id"
            };
        }

        await db.product.delete({
            where: {
                id
            }
        })
        revalidatePath(`/${locale}/${Routes.ADMIN}/${Pages.MENU_ITEMS}`);
        revalidatePath(`/${locale}/${Routes.ADMIN}/${Pages.MENU_ITEMS}/${id}/edit`);
        revalidatePath(`/${locale}/${Routes.MENU}`);
        revalidatePath(`/${locale}`);

        return {
            message: translations.messages.deleteProductSucess,
            status: 200,
        }
    } catch (error) {
        console.error("DELETE_PRODUCT_ACTION", error);
        return {
            status: 500,
            message: translations.messages.unexpectedError,
        };
    }
}



export const updateProduct = async (
    args: {
      productId: string;
      options: { sizes: Partial<Size>[]; extras: Partial<Extra>[] };
    },
    prevState: unknown,
    formData: FormData
  ) => {
    const locale = await getCurrentLocale();
    const translations = await getTrans(locale);
    const result = updateProductSchema(translations).safeParse(
      Object.fromEntries(formData.entries())
    );
    if (result.success === false) {
      return {
        error: result.error.formErrors.fieldErrors,
        status: 400,
        formData,
      };
    }
    const data = result.data;
    const basePrice = Number(data.basePrice);
    const imageFile = data.image as File;
    const imageUrl = Boolean(imageFile.size)
      ? await getImageUrl(imageFile , 'product_images')
      : undefined;
  
    const product = await db.product.findUnique({
      where: { id: args.productId },
    });
  
    if (!product) {
      return {
        status: 400,
        message: translations.messages.unexpectedError,
      };
    }
    try {
      const updatedProduct = await db.product.update({
        where: {
          id: args.productId,
        },
        data: {
          ...data,
          basePrice,
          image: imageUrl ?? product.image,
        },
      });
  
      await db.size.deleteMany({
        where: { productId: args.productId },
      });
      await db.size.createMany({
        data: args.options.sizes.map((size) => ({
          productId: args.productId,
          name: size.name as ProductSizes,
          price: Number(size.price),
        })),
      });
  
  
      await db.extra.deleteMany({
        where: { productId: args.productId },
      });
  
      await db.extra.createMany({
        data: args.options.extras.map((extra) => ({
          productId: args.productId,
          name: extra.name as ExtraIngredients,
          price: Number(extra.price),
        })),
      });

      revalidatePath(`/${locale}/${Routes.MENU}`);
      revalidatePath(`/${locale}/${Routes.ADMIN}/${Pages.MENU_ITEMS}`);
      revalidatePath(
        `/${locale}/${Routes.ADMIN}/${Pages.MENU_ITEMS}/${updatedProduct.id}/${Pages.EDIT}`
      );
      revalidatePath(`/${locale}`);
      return {
        status: 200,
        message: translations.messages.updateProductSucess,
      };
    } catch (error : any) {
      console.error(error.message);
      return {
        status: 500,
        message: translations.messages.unexpectedError,
      };
    }
  };