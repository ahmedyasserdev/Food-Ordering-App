import { Translations } from "@/types"
import * as z from "zod"




export const loginSchema = (translations: Translations) => {
  return z.object({
    email: z.string().trim().email({
      message: translations.validation.validEmail,
    }),
    password: z
      .string()
      .min(6, { message: translations.validation.passwordMinLength })
      .max(40, { message: translations.validation.passwordMaxLength }),
  });
};


export type ValidationErrors = | 
  {
    [key: string]: string[];
  }
  | undefined;