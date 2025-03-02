import MainHeading from '@/components/shared/MainHeading'
import Menu from '@/components/shared/Menu'
import { getCurrentLocale } from '@/lib/getCurrentLocale'
import getTrans from '@/lib/translation'
import { getBestSellers } from '@/server/db/products'

import React from 'react'

const BestSellers = async () => {

    const bestSellers = await getBestSellers(3)
    const locale= await getCurrentLocale();
    const {home : {bestSeller}} = await getTrans(locale);
    return (
        <section>

            <div className="container">
                <div className="text-center mb-4">
                    <MainHeading title={bestSeller.OurBestSellers} subTitle={bestSeller.checkOut} />
                </div>


                <Menu items={bestSellers} />

            </div>

        </section>
    )
}

export default BestSellers