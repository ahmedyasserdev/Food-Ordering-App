import Menu from '@/components/shared/Menu'
import { TextGenerateEffect } from '@/components/ui/TextGenerateEffect'
import { getProductsByCategory } from '@/server/db/products'
import React from 'react'


const MenuPage = async () => {
    const categories = await getProductsByCategory()
    return (
        <section>
            {
                categories.map((
                    category
                ) => (
                    <div className="container section-gap  text-center"
                        key={category.id}
                    >

                        <TextGenerateEffect words={category.name} Tag={'h1'} className="text-4xl text-primary font-bold italic mb-6" filter= {false} />


                        <Menu items={category.products} />


                    </div>


                ))
            }

        </section>

    )
}

export default MenuPage

