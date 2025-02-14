import MainHeading from '@/components/shared/MainHeading'
import Menu from '@/components/shared/Menu'
import { getBestSellers } from '@/server/db/products'

import React from 'react'

const BestSellers = async () => {

    const bestSellers = await getBestSellers(3)

    return (
        <section>

            <div className="container">
                <div className="text-center mb-4">
                    <MainHeading title='Our best sellers' subTitle='Checkout' />
                </div>


                <Menu items={bestSellers} />

            </div>

        </section>
    )
}

export default BestSellers