'use client'

import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { useTransition } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Translations } from "@/types"
import Loader from "@/components/shared/Loader"
import toast from "react-hot-toast"
import { deleteUser } from "@/server/actions/user.actions"
type DeleteUserButtonProps = {
    userId : string ;
    translations : Translations
}



const DeleteUserButton = ({userId , translations}: DeleteUserButtonProps) => {
        const [isPending ,  startTransition] = useTransition()
    const handleDelete = (userId  :string) => {
        startTransition(async() => {
            try {
        const res = await deleteUser(userId);
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
            <DialogTitle  >{translations["delete-action"].title}</DialogTitle>
            <DialogDescription>
            {translations["delete-action"].description}
            </DialogDescription>
        </DialogHeader>
        <DialogFooter>
            <Button type="submit" disabled= {isPending}  onClick={() => handleDelete(userId)}>
            { isPending ? <Loader />  : translations["delete-action"].confirm  }
            </Button>
        </DialogFooter>
    </DialogContent>




</Dialog>
  )
}

export default DeleteUserButton