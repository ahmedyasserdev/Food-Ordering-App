import Link from '@/components/shared/Link';
import Loader from '@/components/shared/Loader';
import { Button, buttonVariants } from '@/components/ui/button';
import { Pages, Routes } from '@/constants/enums';
import {  ProductWithRelations, Translations } from '@/types';
import { useParams } from 'next/navigation';
import React from 'react'

type ProductFormActionsProps = {
    translations: Translations;
    pending: boolean;
    product?: ProductWithRelations;
}




const ProductFormActions = ({translations , pending , product}: ProductFormActionsProps) => {
  const {locale} = useParams()
  return (
   <div >
     <Button type="submit" className='w-full' disabled={pending}>
    {pending ? (
      <Loader />
    ) : product ? (
      translations.save
    ) : (
      translations.create
    )}
  </Button>
 
  <Link
        href={`/${locale}/${Routes.ADMIN}/${Pages.MENU_ITEMS}`}
        className={`w-full mt-4 ${buttonVariants({ variant: "outline" })}`}
      >
        {translations.cancel}
      </Link>



   </div>

  )
}

export default ProductFormActions