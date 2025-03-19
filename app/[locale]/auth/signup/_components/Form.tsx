"use client"
import { motion } from "motion/react"
import FormFields from "@/components/shared/form-fields/FormFields"
import { Pages, Routes } from "@/constants/enums"
import { useFormFields } from "@/hooks/useFormFields"
import { IFormField, InitialStateInterface, Translations } from "@/types"
import { Button } from "@/components/ui/button"
import Loader from "@/components/shared/Loader"
import { useActionState, useEffect } from "react"
import { signup } from "@/server/actions/auth.actions"
import { ValidationErrors } from "@/validations/auth"
import toast from "react-hot-toast"
import { useParams, useRouter } from "next/navigation"

type SignUpFormProps = {
    translations: Translations
}
const initialState : InitialStateInterface & {
    formData?: FormData | null;

} = {
    message: "",
    error: {},
    status: null,
    formData: null,
};

const Form = ({ translations }: SignUpFormProps) => {
    const { getFormFields } = useFormFields({ slug: Pages.Register, translations })
    const [state, action, pending] = useActionState(signup, initialState);
    const router  = useRouter();
    const {locale} = useParams();

        useEffect(() => {
            if (state.status && state.message) {
                    if (state.status === 201) {
                toast.success(state.message,); 
                router.push(`/${locale}/${Routes.AUTH}/${Pages.LOGIN} `)

                    }else {
                toast.error(state.message,); 

                    }
            }
        }, [state.status, state.message  , locale , router]);
        


    return (
        <form action={action}>

            {getFormFields().map((field: IFormField, index: number) => {
                const fieldValue = state.formData?.get(field.name) as string;
                return (
                    <motion.div key={field.name} className="mb-3"
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
                        <FormFields
                            {...field}
                            error={state.error}
                            defaultValue={fieldValue}
                        />
                    </motion.div>
                );
            })}

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
         <Button type="submit" disabled={pending} className="w-full">
                {pending ? <Loader /> : translations.auth.register.submit}
            </Button>
      </motion.div>


         

        </form>
    )
}

export default Form