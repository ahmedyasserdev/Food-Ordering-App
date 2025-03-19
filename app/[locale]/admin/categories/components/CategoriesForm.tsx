'use client'

import Loader from "@/components/shared/Loader"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { addCategory } from "@/server/actions/category.actions"
import { InitialStateInterface, Translations } from "@/types"
import { ValidationErrors } from "@/validations/auth"
import { useActionState, useEffect } from "react"
import toast from "react-hot-toast"

type CategoriesFormProps = {
    translations: Translations
}


const initialState: InitialStateInterface = {
    message: "",
    error: {},
    status: null,
}
const CategoriesForm = ({ translations }: CategoriesFormProps) => {
    const [state, action, pending] = useActionState(addCategory, initialState);

    useEffect(() => {
        if (state.message) {
            if (state.status === 201) {
                toast.success(state.message,);

            } else {
                toast.error(state.message,);

            }
        }
    }, [state.message, state.status]);

    return (
        <form action={action}>
            <div className="space-y-2">
                <Label htmlFor="name">
                    {translations.admin.categories.form.name.label}
                </Label>
                <div className="flex items-center gap-4">
                    <Input
                        type="text"
                        name="name"
                        id="name"
                        disabled={pending}
                        placeholder={translations.admin.categories.form.name.placeholder}
                    />
                    <Button type="submit" size="lg" disabled={pending}>
                        {pending ? <Loader /> : translations.create}
                    </Button>
                </div>
                {state.error?.name && (
                    <p className="text-sm text-destructive">{state.error.name}</p>
                )}
            </div>
        </form>
    )
}

export default CategoriesForm