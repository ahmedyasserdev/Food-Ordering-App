import Menu from '@/components/shared/Menu'
import { TextGenerateEffect } from '@/components/ui/TextGenerateEffect'
import { Locale } from '@/i18n';
import getTrans from '@/lib/translation';
import { getProductsByCategory } from '@/server/db/products'


async function MenuPage({ params }: { params: Promise<{ locale: Locale }> }) {
    const { locale } = await params;
    const translations = await getTrans(locale);
    const categories = await getProductsByCategory();
    return (
        <section>


            {
                categories.length ?

                    categories.map((
                        category
                    ) => (
                        <div className="container section-gap  text-center"
                            key={category.id}
                        >

                            <TextGenerateEffect words={category.name} Tag={'h1'} className="text-4xl text-primary font-bold italic mb-6" filter={false} />


                            <Menu items={category.products} />


                        </div>


                    ))

                    : (<p className="text-accent text-center py-20">
                        {translations.noProductsFound}
                    </p>)
            }

        </section>

    )
}

export default MenuPage

