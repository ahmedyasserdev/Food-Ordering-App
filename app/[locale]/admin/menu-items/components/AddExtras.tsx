'use client'
import { ItemOptionsKeys, Translations } from '@/types'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
import ItemOptions from './ItemOptions';
import {  Extra,  } from '@prisma/client';

type AddExtrasProps = {
    translations : Translations ;
    extras: Partial<Extra>[] 
    setExtras:
       React.Dispatch<React.SetStateAction<Partial<Extra>[]>>
}
const AddExtras = ({translations , extras , setExtras}: AddExtrasProps) => {
  return (
    <Accordion type="single" collapsible className="w-full md:w-80 px-4 mb-4 bg-gray-100 rounded-md ">
    <AccordionItem value="item-1">
      <AccordionTrigger>
         {translations.extrasIngredients}
      </AccordionTrigger>
      <AccordionContent>
         <ItemOptions  optionsKey={ItemOptionsKeys.EXTRAS} state = {extras} setState = {setExtras} translations={translations} /> 
      </AccordionContent>
    </AccordionItem>
    </Accordion> 
  )
}

export default AddExtras