'use client'

import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"
import { removeItemFromCart, selectCartItems } from "@/redux/featutures/cart/cartSlice"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { Trash2 } from "lucide-react"
import Image from "next/image"

type Props = {}

const CartItems = (props: Props) => {
    const cart = useAppSelector(selectCartItems);
    const dispatch = useAppDispatch();
  return (
    <div>
    {cart && cart.length > 0 ? (
      <>
        <ul>
          {cart.map((item) => (
            <li key={item.id}>
              <div className='flex flex-col md:flex-row gap-6 justify-between'>
                <div className='flex items-center gap-2'>
                  <div className='relative w-24 h-24'>
                    <Image
                      src={item.image}
                      className='object-contain'
                      alt={item.name}
                      fill
                    />
                  </div>
                  <div>
                    <h4 className='font-semibold md:text-lg'>{item.name}</h4>
                    <div className='relative'>
                      {item.size && (
                        <span className='text-sm text-accent'>
                          Size: {item.size.name}
                        </span>
                      )}
                      {item.extras && item.extras.length > 0 && (
                        <div className='flex gap-1'>
                          <span>Extras:</span>
                          <ul>
                            {item.extras.map((extra) => (
                              <li key={extra.id}>
                                <span className='text-sm text-accent'>
                                  {extra.name} {formatCurrency(extra.price)}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <span className='absolute right-0 top-0 text-sm text-black'>
                        x{item.quantity}
                      </span>
                    </div>
                  </div>
                </div>
                <div className='flex-1 flex items-center gap-4 justify-end'>
                  <strong className='text-black '>
                    {formatCurrency(item.basePrice)}
                  </strong>
                  <Button
                    onClick={() =>
                      dispatch(removeItemFromCart({ id: item.id }))
                    }
                    variant='secondary'
                    className='border'
                  >
                    <Trash2 />
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
        
      </>
    ) : (
      <p className='text-accent'>There are no items in your cart. Add some</p>
    )}
  </div>

  )
}

export default CartItems