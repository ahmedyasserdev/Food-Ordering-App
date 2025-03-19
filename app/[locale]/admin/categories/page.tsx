import { Locale } from "@/i18n"
import getTrans from "@/lib/translation";
import { getCategories } from "@/server/db/categories";
import CategoriesForm from "./components/CategoriesForm";

type CategoriesPageProps = { params: Promise<{ locale: Locale }> }

const CategoriesPage = async({params } : CategoriesPageProps) => {
    const locale= (await params).locale;
    const translations = await getTrans(locale)
    const categories = await getCategories();
    return (
    <section className="section-gap">
        <div className="container ">

          <div className="">

              <CategoriesForm translations = {translations} />


            {
              categories.length > 0 ? ( <ul>
                {
                  categories.map((category) => (
                    <li key = {category.id}>
                      {category.name}
                    </li>
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