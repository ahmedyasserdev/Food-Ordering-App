'use client'
import { InitialStateInterface, Translations } from '@/types';
import { Category } from '@prisma/client'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Edit } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useActionState } from 'react';
import { updateCategory } from '@/server/actions/category.actions';
import Loader from '@/components/shared/Loader';

type EditCategoryProps = {
    category : Category;
    translations : Translations
}

const initialState: InitialStateInterface = {
  message: "",
  error: {},
  status: null,
};

const EditCategory = ({category , translations}: EditCategoryProps) => {
  const {locale} = useParams();
  const [state, action, pending] = useActionState(
    updateCategory.bind(null, category.id),
    initialState
  );

  return (
    <Dialog>
    <DialogTrigger asChild>
      <Button variant="outline">
        <Edit />
      </Button>
    </DialogTrigger>
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle
          className={
          'text-start'
          }
        >
          {translations.admin.categories.form.editName}
        </DialogTitle>
      </DialogHeader>
      <form action={action} className="pt-4">
        <div className="flex items-center gap-4">
          <Label htmlFor="category-name">
            {translations.admin.categories.form.name.label}
          </Label>
          <div className="flex-1 relative">
            <Input
              type="text"
              id="categoryName"
              name="categoryName"
              disabled = {pending}
              defaultValue={category.name}
              placeholder={
                translations.admin.categories.form.name.placeholder
              }
            />
            {state.error?.categoryName && (
              <p className="text-sm text-destructive absolute top-12">
                {state.error?.categoryName}
              </p>
            )}
          </div>
        </div>
        <DialogFooter className="mt-10">
          <Button type="submit" disabled={pending}>
            {pending ? <Loader /> : translations.save}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
  )
}

export default EditCategory