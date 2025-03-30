'use client'
import Link from '@/components/shared/Link';
import Loader from '@/components/shared/Loader';
import { Button, buttonVariants } from '@/components/ui/button';
import { Pages, Routes } from '@/constants/enums';
import { deleteProduct } from '@/server/actions/product.actions';
import { ProductWithRelations, Translations } from '@/types';
import { useParams, useRouter } from 'next/navigation';
import React, { useTransition } from 'react'
import toast from 'react-hot-toast';

type ProductFormActionsProps = {
  translations: Translations;
  pending: boolean;
  product?: ProductWithRelations;
}




const ProductFormActions = ({ translations, pending, product }: ProductFormActionsProps) => {
  const { locale } = useParams();
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const handleDelete = (productId: string) => {
    startTransition(async () => {
      try {
        const res = await deleteProduct(productId);

        if ( res.status === 200) {
          toast.success(res.message);
          router.push(`/${locale}/${Routes.ADMIN}/${Pages.MENU_ITEMS}`)
        } else {
          toast.error(res.message)

        }

      } catch (error: any) {
        console.log('[HANDLE_DELETE_PRODUCT_CLIENT]', error.message)
      }
    })
  }
  return (
    < >
      <div className={`${product ? "grid grid-cols-2" : "flex flex-col"} gap-4`}>
        <Button
          effect={'shineHover'} type="submit" className='w-full' disabled={pending || isPending}>
          {pending ? (
            <Loader />
          ) : product ? (
            translations.save
          ) : (
            translations.create
          )}
        </Button>

        {product && (
          <Button
            variant="outline"
            disabled={isPending || pending}
            onClick={() => handleDelete(product.id)}
          >
            {isPending ? <Loader /> : translations.delete}
          </Button>
        )}

      </div>
      <Link
        
        href={`/${locale}/${Routes.ADMIN}/${Pages.MENU_ITEMS}`}
        className={`w-full mt-4 ${buttonVariants({ variant: "outline" })}`}
      >
        {translations.cancel}
      </Link>



    </>

  )
}

export default ProductFormActions