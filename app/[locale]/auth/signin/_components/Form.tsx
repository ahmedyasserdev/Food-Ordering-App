"use client"

import FormFields from "@/components/shared/form-fields/FormFields"
import { Button } from "@/components/ui/button"
import { Pages, Routes } from "@/constants/enums"
import { useFormFields } from "@/hooks/useFormFields"
import { IFormField } from "@/types"
import Loader from "@/components/shared/Loader"
import { motion } from "motion/react"
import { signIn } from "next-auth/react"
import { useParams, useRouter } from "next/navigation"
import { useRef, useState } from "react"
import { toast } from "react-hot-toast"
type FormProps = {
  translations: any
}



const Form = ({ translations }: FormProps) => {
  const { getFormFields } = useFormFields({ slug: Pages.LOGIN, translations });
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { locale } = useParams();
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;
    const formData = new FormData(formRef.current);
    const data: Record<string, string> = {};
    formData.forEach((value, key) => {
      data[key] = value.toString();
    });
    try {
      setIsLoading(true);
      const res = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });
      if (res?.error) {
        const validationError = JSON.parse(res?.error).validationError;
        setError(validationError);
        const responseError = JSON.parse(res?.error).responseError;
        if (responseError) {
          toast.error(responseError,{
            className: "text-destructive",
          });
        }
      }
      if (res?.ok) {
        toast.success(translations.messages.loginSuccessful,{
          className: "text-green-400",
        });
        router.replace(`/${locale}/${Routes.PROFILE}`);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <motion.form
      ref={formRef}
      onSubmit={handleSubmit}
      className="space-y-6"
      initial={{
        opacity: 0,
        visibility: 'hidden',

      }}
      animate={{
        opacity: 1,
        visibility: 'visible',
      }}

      transition={{
        duration: 0.6,
        ease: "easeIn"
      }}

    >

      {
        getFormFields().map((field: IFormField, index) => (
          <motion.div
            key={field.id}

            initial={{
              x: -20,
              opacity: 0,
              visibility: "hidden"
            }}

            animate={{
              x: 0,
              opacity: 1,
              visibility: "visible"
            }}

            transition={{
              duration: 0.4,
              delay: 0.2 * index,
            }}
          >
            <FormFields error={error} {...field} />
          </motion.div>
        ))
      }


      <motion.div
        initial={{
          y: 20
          , opacity: 0,
          visibility: "hidden",
        }}

        animate={{
          y: 0
          , opacity: 1,
          visibility: "visible",
        }}

        transition={{
          duration: 0.4,
          ease: "easeInOut"

        }}
      >
        <Button type="submit" disabled={isLoading}  className="w-full">
          {
            isLoading ? <Loader  /> : translations.auth.login.submit
          }
        </Button>
      </motion.div>
    </motion.form>
  )
}

export default Form