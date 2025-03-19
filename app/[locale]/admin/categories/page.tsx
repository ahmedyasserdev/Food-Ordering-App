import { Locale } from "@/i18n"
import getTrans from "@/lib/translation";
import { getCategories } from "@/server/db/categories";
import CategoriesForm from "./components/CategoriesForm";
import CategoryItem from "./components/CategoryItem";
import { Category } from "@prisma/client";

type CategoriesPageProps = { params: Promise<{ locale: Locale }> }

const CategoriesPage = async({params } : CategoriesPageProps) => {
    const locale= (await params).locale;
    const translations = await getTrans(locale)
    const categories = await getCategories();
    return (
    <section className="section-gap">
        <div className="container ">

          <div className="sm:max-w-[625px] mx-auto space-y-6">

              <CategoriesForm translations = {translations} />


            {
              categories.length > 0 ? ( <ul className="space-y-3">
                {
                  categories.map((category : Category) => (
                     <CategoryItem category = {category} key = {category.id} />
                  ))
                }
              </ul> ) : (
                <p className="text-accent text-center py-10">{translations.noCategoriesFound}</p>
              )
            }

          </div>



        </div>
    </section>
  )
}

export default CategoriesPage