import MainHeading from '@/components/shared/MainHeading'
import Menu from '@/components/shared/Menu'
import { db } from '@/lib/prisma'

import React from 'react'

const BestSellers = async() => {

    const bestSellers  = await db.product.findMany({
        include : {
            extras : true,
            sizes : true
        }
    })

    return (
        <section>

            <div className="container">
                <div className="text-center mb-4">
                    <MainHeading title='Our best sellers' subTitle='Checkout' />
                </div>


                <Menu items = {bestSellers} />

            </div>

        </section>
    )
}

export default BestSellers