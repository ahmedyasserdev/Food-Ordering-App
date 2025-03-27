'use client'
import { ItemOptionsKeys, Translations } from '@/types'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
import ItemOptions from './ItemOptions';
import {  Size } from '@prisma/client';

type AddSizeProps = {
    translations : Translations ;
    sizes: Partial<Size>[] 
    setSizes:
       React.Dispatch<React.SetStateAction<Partial<Size>[]>>
}
const AddSize = ({translations , sizes , setSizes}: AddSizeProps) => {
  return (
    <Accordion type="single" collapsible className="w-full md:w-80 px-4 mb-4 bg-gray-100 rounded-md ">
    <AccordionItem value="item-1">
      <AccordionTrigger>
         {translations.sizes}
      </AccordionTrigger>
      <AccordionContent>
         <ItemOptions  optionsKey={ItemOptionsKeys.SIZES} state = {sizes} setState = {setSizes} translations={translations} /> 
      </AccordionContent>
    </AccordionItem>
    </Accordion> 
  )
}

export default AddSize