'use client'
import { Translations } from "@/types";
import { Category } from "@prisma/client";
import Dropdown from "@/components/shared/Dropdown"; 
import { SelectItem } from "@/components/ui/select";
import { useParams } from "next/navigation";

type SelectCategoryProps = {
  categories: Category[];
  categoryId: string;
  setCategoryId: React.Dispatch<React.SetStateAction<string>>;
  translations: Translations;
};

const SelectCategory = ({ categories, categoryId, translations, setCategoryId }: SelectCategoryProps) => {
  const currentItem = categories.find((item) => item.id === categoryId);
  const {locale} = useParams()
  return (
    <Dropdown
      defaultValue={categoryId}
      onValueChange={(value) => setCategoryId(value)}
      placeholder={currentItem ? currentItem.name : translations.category}
      name="categoryId"
      className = " w-full md:w-[200px]"

    >
       {categories.map((category) => (
        <SelectItem key={category.id} value={category.id}>
          {category.name}
        </SelectItem>
      ))}
      
    </Dropdown>
  );
};

export default SelectCategory;
