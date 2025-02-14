import { ShoppingCartIcon } from "lucide-react"
import Link from "./Link"
import { Routes } from "@/constants/enums"

const CartButton = () => {
    return (
        <Link href={`/${Routes.CART}`} className='block relative group'>
            <span className='absolute -top-4 start-4 size-5 text-sm bg-primary rounded-full text-white text-center'> 2</span>
            <ShoppingCartIcon
                className={`text-accent group-hover:text-primary duration-200 transition-colors !size-6`}
            />
        </Link>
    )
}

export default CartButton