"use client"
import { formatCurrency } from '@/lib/utils'
import Image from 'next/image'
import AddToCartButton from './AddToCartButton'
 import {motion} from  "motion/react"	
import { ProductWithRelations } from '@/types'
type MenuItemProps = {
    item: ProductWithRelations
    index : number
}

const MenuItem = ({ item  , index }: MenuItemProps) => {
    return (
        <motion.li
            initial = {{x : -100 , opacity : 0}}
            whileInView = {{ x : 0 , opacity : 1}}
            transition = {{  ease : "easeInOut" , duration : 0.4 * index , type : "spring" , stiffness : 50 , }}
            whileHover={{scale : 1.1 , y : -5 , }} 
        >
            <div className="size-48 relative mx-auto">
                <Image className="object-cover" src={item.image} alt="pizza" fill />
            </div>

            <div className="flex items-center justify-around  mb-4">
                <h4 className="text-xl font-semibold  my-4" >{item.name}</h4>
                <strong className='text-accent'>
                    {formatCurrency(item.basePrice)}
                </strong>

            </div>

            <p className="text-sm line-clamp-3 text-gray-500">
                {item.description}
            </p>

                <AddToCartButton item = {item} />
        </motion.li>
    )
}

export default MenuItem