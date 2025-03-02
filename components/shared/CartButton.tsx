"use client"
import { ShoppingCartIcon } from "lucide-react"
import Link from "./Link"
import { Routes } from "@/constants/enums"
import { useAppSelector } from "@/redux/hooks"
import { selectCartItems } from "@/redux/featutures/cart/cartSlice"
import { getCartQuantity } from "@/lib/cart"
import { useParams } from "next/navigation"

const CartButton = () => {
    const cart= useAppSelector(selectCartItems)
    const cartLength = getCartQuantity(cart)
    const {locale} = useParams()
  
    return (
        <Link href={`/${locale}/${Routes.CART}`} className='block relative group'>
            <span className='absolute -top-4 start-4 size-5 text-sm bg-primary rounded-full text-white text-center'>{cartLength}</span>
            <ShoppingCartIcon
                className={`text-accent group-hover:text-primary duration-200 transition-colors !size-6`}
            />
        </Link>
    )
}

export default CartButton