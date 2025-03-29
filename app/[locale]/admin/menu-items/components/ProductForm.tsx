'use client'

import FormFields from "@/components/shared/form-fields/FormFields"
import { Pages, Routes } from "@/constants/enums"
import { useFormFields } from "@/hooks/useFormFields"
import { IFormField, InitialStateInterface, ProductWithRelations, Translations } from "@/types"
import { CameraIcon } from "lucide-react"
import Image from "next/image"
import { useActionState, useEffect, useState } from "react"
import ProductFormActions from "./ProductFormActions"
import SelectCategory from "./SelectCategory"
import { Category, Extra, Size } from "@prisma/client"
import AddSize from "./AddSize"
import { motion } from "motion/react"
import AddExtras from "./AddExtras"
import { addProduct, updateProduct } from "@/server/actions/product.actions"
import toast from "react-hot-toast"

type ProductFormProps = {
  product?: ProductWithRelations;
  translations: Translations;
  categories: Category[]
}



const initialState: InitialStateInterface & {
  formData?: FormData | null
} = {
  message: "",
  error: {},
  status: null,
  formData: null,
};

const ProductForm = ({ product, translations, categories }: ProductFormProps) => {
  const [selectedImage, setSelectedImage] = useState(product ? product.image : '');
  const [categoryId, setCategoryId] = useState(product ? product.categoryId : categories[0].id)
  const [sizes, setSizes] = useState<Partial<Size>[]>(product ? product.sizes : [])
  const [extras, setExtras] = useState<Partial<Extra>[]>([])

  const [state, action, pending] = useActionState(
    product
      ? updateProduct.bind(null, {
          productId: product.id,
          options: { sizes, extras },
        })
      : addProduct.bind(null, { categoryId, options: { sizes, extras } }),
    initialState
  );
  
  const formData = new FormData()
  Object.entries(product ?? {}).forEach(([key, value]) => {
    if (value !== null && value !== undefined && key !== "image") {
      formData.append(key, value.toString());
    }
  });
  const { getFormFields } = useFormFields({ slug: `${Routes.ADMIN}/${Pages.MENU_ITEMS}`, translations });


  useEffect(() => {
    if (state.message && state.status && !pending) {
      if (state.status === 201 || state.status == 200) {
        toast.success(state.message,);
      } else {
        toast.error(state.message,);

      }
    }
  }, [pending, state.message, state.status]);


  return (
    <form action={action} className="flex flex-col md:flex-row gap-10">
      <UploadImage selectedImage={selectedImage} setSelectedImage={setSelectedImage} />
      <div className="flex-1 space-y-6">
        {getFormFields().map((field: IFormField, index: number) => {
          const fieldValue = state?.formData?.get(field.name) ?? formData.get(field.name);

          return (
            <motion.div key={field.name}
              initial={{ opacity: 0, visibility: 'hidden', x: 100 }}
              animate={{ opacity: 1, visibility: "visible", x: 0 }}
              transition={{ delay: 0.2 * index, duration: 0.2, ease: 'linear' }}
            >
              <FormFields
                {...field}
                error={state?.error}
                disabled={pending}
                defaultValue={fieldValue as string}
              />
            </motion.div>
          );
        })}


        <SelectCategory translations={translations} categories={categories} categoryId={categoryId} setCategoryId={setCategoryId} />


        <AddSize translations={translations} sizes={sizes} setSizes={setSizes} />

        <AddExtras translations={translations} extras={extras} setExtras={setExtras} />

        <ProductFormActions
          translations={translations}
          pending={pending}
          product={product}
        />
      </div>
    </form>
  )
}

export default ProductForm


const UploadImage = ({
  selectedImage,
  setSelectedImage,
}: {
  selectedImage: string;
  setSelectedImage: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSelectedImage(url);
    }
  };
  return (
    <div className="group mx-auto md:mx-0 relative size-[200px] overflow-hidden rounded-full">
      {selectedImage && (
        <Image
          src={selectedImage}
          alt="Add Product Image"
          width={200}
          height={200}
          className="rounded-full object-cover"
        />
      )}
      <div
        className={`${selectedImage
          ? "group-hover:opacity-[1] opacity-0  transition-opacity duration-200"
          : ""
          } absolute top-0 left-0 w-full h-full bg-gray-50/40`}
      >
        <input
          type="file"
          accept="image/*"
          className="hidden"
          id="image-upload"
          onChange={handleImageChange}
          name="image"
        />
        <label
          htmlFor="image-upload"
          className="border rounded-full size-[200px] flex-center cursor-pointer"
        >
          <CameraIcon className="!size-8  text-accent" />
        </label>
      </div>
    </div>
  );
};
