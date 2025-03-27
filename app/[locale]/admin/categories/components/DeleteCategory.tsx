'use client'

import { Button } from "@/components/ui/button";
import { Translations } from "@/types";
import { Trash2 } from "lucide-react";
import { useState, useTransition } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import Loader from "@/components/shared/Loader";
import { deleteCategory } from "@/server/actions/category.actions";
import toast from "react-hot-toast";


type DeleteCategoryProps = {
    categoryId: string;
    translations: Translations;
}


const DeleteCategory = ({ categoryId , translations }: DeleteCategoryProps) => {
    const [isPending , startTransition] = useTransition()

    const handleDelete = () => {
         startTransition(async() => {
                try {
            const res = await deleteCategory(categoryId);
                        if (res.status === 200) {
                            toast.success(res.message);

                        }else {
                            toast.error(res.message)
                        }
                } catch (error) {
                        console.error("ERROR DELETEING CATEGORY CLIENT" , error)
                }
        })
    }

    return (
        <Dialog >
            <DialogTrigger>
                <Button variant="outline"  >
                    <Trash2 />

                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader className="!text-start"  >
                    <DialogTitle  >{translations.admin.categories.delete.title}</DialogTitle>
                    <DialogDescription>
                    {translations.admin.categories.delete.description}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button type="submit" disabled= {isPending}  onClick={handleDelete}>
                    { isPending ? <Loader />  : translations.admin.categories.delete.confirm  }
                    </Button>
                </DialogFooter>
            </DialogContent>




        </Dialog>
    )
}

export default DeleteCategory


