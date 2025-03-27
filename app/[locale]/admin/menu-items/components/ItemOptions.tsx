'use client'
import Dropdown from "@/components/shared/Dropdown";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SelectItem } from "@/components/ui/select";
import { ItemOptionsKeys, Translations } from "@/types";
import { Extra, ExtraIngredients, ProductSizes, Size } from "@prisma/client";
import { Plus, Trash2 } from "lucide-react";
import { motion } from "motion/react"


type ItemOptionsProps = {
  translations: Translations;
  state: Partial<Size>[] | Partial<Extra>[];
  setState:
  | React.Dispatch<React.SetStateAction<Partial<Size>[]>>
  | React.Dispatch<React.SetStateAction<Partial<Extra>[]>>;
  optionsKey: ItemOptionsKeys
}

const sizesNames = [
  ProductSizes.SMALL,
  ProductSizes.MEDIUM,
  ProductSizes.LARGE,
]

const extrasNames = [
  ExtraIngredients.TOMATO,
  ExtraIngredients.CHEESE,
  ExtraIngredients.ONION,
  ExtraIngredients.PEPPER,
  ExtraIngredients.BACON,
]
function handleOptions(setState: ItemOptionsProps['setState']) {
  const addOption = () => {
    setState((prev: any) => {
      return [...prev, { name: "", price: 0 }]
    })
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>, index: number, fieldName: string) => {
    const newValue = e.target.value;
    setState((prev: any) => {
      const newSizes = [...prev]
      newSizes[index][fieldName] = newValue;
      return newSizes
    })
  }

  const removeOption = (indexToRemove: number) => {
    setState((prev: any) => {
      return prev.filter((_: any, index: number) => index !== indexToRemove)
    })
  }


  return {
    addOption,
    onChange,
    removeOption,
  }
}

const ItemOptions = ({ translations, state, setState, optionsKey }: ItemOptionsProps) => {

  const { addOption, removeOption, onChange } = handleOptions(setState)

  const getNames = () => {

    switch (optionsKey) {
      case ItemOptionsKeys.SIZES:
        const filteredSizes = sizesNames.filter((size) => !state.some((s) => s.name === size));
        return filteredSizes;
      case ItemOptionsKeys.EXTRAS:
        const filteredExtras = extrasNames.filter((size) => !state.some((extra) => extra.name === size));
        return filteredExtras


    }

  }
  const names = getNames();

  const isThereAvalibaleOptions = () => {
    switch (optionsKey) {
      case ItemOptionsKeys.SIZES:
        return sizesNames.length > state.length;

      case ItemOptionsKeys.EXTRAS:
        return extrasNames.length > state.length;

    }
  };





  return (
    <>

      {
        state.length > 0 && (
          <ul>
            {state.map((item, index) => (
              <motion.li
                key={index}
                className="flex gap-2 mb-2"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ease: "easeInOut" }}
              >
                <div className="space-y-2 basis-1/2">
                  <Label>
                    name    <span className="!capitalize">

                      {":" +
                        item.name?.toLowerCase()}
                    </span>
                  </Label>
                  <Dropdown
                    placeholder={'Select...'}
                    className="w-full text-black"
                    defaultValue={
                      item.name || 'Select...'}
                    onValueChange={(value) => onChange({
                      //@ts-expect-error
                      target: { value }
                    }, index, "name")}
                  >
                    {names.map((name, i) => (
                      <SelectItem value={name} key={i}>
                        {name}
                      </SelectItem>
                    ))}
                  </Dropdown>
                </div>

                <div className="space-y-2 basis-1/2">
                  <Label>price</Label>
                  <Input
                    onChange={(e) => onChange(e, index, "price")}
                    value={item.price}
                    type="number"
                    name='price'
                    placeholder={'0'}
                    min={0}
                    className="bg-white focus:!ring-0"
                  />
                </div>

                <div className="flex items-end">
                  <Button onClick={() => removeOption(index)} type="button" variant={'outline'}>
                    <Trash2 />
                  </Button>
                </div>
              </motion.li>
            ))}
          </ul>

        )
      }


      {
        isThereAvalibaleOptions() && (

          <Button
            type="button"
            variant={'outline'}
            className="w-full"
            onClick={addOption}
          >
            <Plus className="size-4" /> {optionsKey === ItemOptionsKeys.SIZES
              ? translations.admin["menu-items"].addItemSize
              : translations.admin["menu-items"].addExtraItem}
          </Button>

        )
      }



    </>
  )
}

export default ItemOptions