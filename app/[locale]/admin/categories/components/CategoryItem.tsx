import { Category } from "@prisma/client"
import EditCategory from "./EditCategory";
import { getCurrentLocale } from "@/lib/getCurrentLocale";
import getTrans from "@/lib/translation";

type CategoryItemProps = {
    category: Category;
}

const CategoryItem = async ({ category }: CategoryItemProps) => {
    const locale = await getCurrentLocale();
    const translations = await getTrans(locale);

    return (
        <li className="bg-gray-200 p-4 rounded-md flex justify-between">
            <h3 className="text-black font-medium text-lg flex-1">{category.name}</h3>

            <div className="flex items-center gap-2">
                <EditCategory translations={translations} category={category} />
            </div>
        </li>
    )
}

export default CategoryItem