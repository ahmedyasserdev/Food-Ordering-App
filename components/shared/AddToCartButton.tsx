'use client'
import Image from "next/image"
import { Button } from "../ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "../ui/label"
import { formatCurrency } from "@/lib/utils"
import { motion } from "motion/react"
import { ProductWithRelations } from "@/types"
import { Extra, Product, ProductSizes, Size } from "@prisma/client"
import { Dispatch, SetStateAction, useState } from "react"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { addItemToCart,  removeCartItem , removeItemFromCart, selectCartItems } from "@/redux/featutures/cart/cartSlice"
import { getItemQuantity } from "@/lib/cart"


type AddToCartButtonProps = {
    item: ProductWithRelations
}



const AddToCartButton = ({ item }: AddToCartButtonProps) => {
    const cart = useAppSelector(selectCartItems)
    const dispatch = useAppDispatch();
    const quantity = getItemQuantity({ itemId: item.id, cart })
    const defaultSize = cart.find((ele) => ele.id === item.id)?.size || item.sizes.find((size) => size.name === ProductSizes.SMALL)
    const [selectedSize, setSelectedSize] = useState<Size>(defaultSize!)
    const defaultExtra = cart.find((ele) => ele.id === item.id)?.extras || []
    const [selectedExtras, setSelectedExtras] = useState<Extra[]>(defaultExtra!)

    let totalPrice: number = item.basePrice;

    if (selectedSize) {
        totalPrice += selectedSize.price;
    }

    if (selectedExtras.length > 0) {
        for (const extra of selectedExtras) {
            totalPrice += extra.price
        }

    }

    const handleAddToCart = () => {
        dispatch(addItemToCart({
            name: item.name,
            id: item.id,
            image: item.image,
            basePrice: item.basePrice,
            size: selectedSize,
            extras: selectedExtras,
        }))
    }


    return (

        <motion.div

        >

            <Dialog>
                <DialogTrigger>
                    <Button
                        type='button'
                        size='lg'
                        className='mt-4 text-white rounded-full !px-8'
                        effect={"shine"}
                    >
                        Add To Cart
                    </Button>


                </DialogTrigger>
                <DialogContent className='sm:max-w-[425px] max-h-[80vh] overflow-y-auto'>
                    <DialogHeader className="flex items-center" >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.75 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ trasition: "easeInOut", duration: 0.4, type: "spring", stiffness: 100, }}
                        >
                            <Image src={item.image} alt="pizza" width={200} height={200} />
                        </motion.div>
                        <DialogTitle  >{item.name}</DialogTitle>
                        <DialogDescription >{item.description}</DialogDescription>
                    </DialogHeader>

                    <div className="space-y-10" >
                        <div className="space-y-4 text-center" >
                            <Label htmlFor="pick-size" className="font-bold ">
                                Pick Your Size
                            </Label>
                            <Sizes sizes={item.sizes} selectedSize={selectedSize} setSelectedSize={setSelectedSize} item={item} />
                        </div>
                        <div className="space-y-4 text-center" >
                            <Label htmlFor="add-extras" className="font-bold ">
                                Any Extras?
                            </Label>

                            <Extras extras={item.extras} item={item}
                                selectedExtras={selectedExtras}
                                setSelectedExtras={setSelectedExtras}
                            />


                        </div>
                    </div>




                    {
                        quantity === 0 ? (
                            <Button
                                type='submit'
                                className='w-full h-10'
                                onClick={handleAddToCart}
                            >
                                Add to cart
                                {formatCurrency(totalPrice)}
                            </Button>
                        ) : (
                            <ChooseQuantity selectedExtras={selectedExtras} selectedSize={selectedSize} item={item} quantity={quantity!} />
                        )
                    }


                </DialogContent>
            </Dialog>

        </motion.div>


    )
}

export default AddToCartButton



function Sizes({ sizes, item, selectedSize, setSelectedSize }: {
    sizes: Size[],
    setSelectedSize: Dispatch<SetStateAction<Size>>,
    selectedSize: Size, item: Product
}) {
    return (
        <RadioGroup defaultValue={selectedSize.id} >
            {
                sizes.map((size: Size) => (
                    <div className="flex items-center space-x-2 border border-gray-100 rounded-md p-4" key={size.id}>
                        <RadioGroupItem onClick={() => setSelectedSize(size)} value={size.name} checked={selectedSize.id === size.id} id={size.id} />
                        <Label htmlFor={size.id}>{size.name} {formatCurrency(size.price + item.basePrice)} </Label>
                    </div>

                ))
            }
        </RadioGroup>
    )
}


function Extras({ extras, item, setSelectedExtras, selectedExtras }: {
    selectedExtras: Extra[], setSelectedExtras: Dispatch<SetStateAction<Extra[]>>,
    extras: Extra[], item: Product
}) {


    const handleExtra = (extra: Extra) => {
        if (selectedExtras.find((e) => e.id === extra.id)) {
            const filteredSelectedExtras = selectedExtras.filter((e) => e.id !== extra.id)
            setSelectedExtras(filteredSelectedExtras)
        } else {
            setSelectedExtras((prev) => [...prev, extra])
        }
    }
    return (
        <div className="mt-2">
            {
                extras.map((extra: any) => (
                    <div className="flex items-center space-x-2 border border-gray-100 rounded-md p-4 " key={extra.id}>
                        <Checkbox
                            onClick={() => handleExtra(extra)}
                            checked={Boolean(selectedExtras.find((item) => item.id === extra.id))} id={extra.id} />
                        <Label htmlFor={extra.id}>{extra.value} {formatCurrency(extra.price)}</Label>
                    </div>
                ))
            }
        </div>
    )
}


function ChooseQuantity({ quantity, item , selectedExtras  , selectedSize ,}: { item: ProductWithRelations, quantity: number , 
    selectedSize: Size,
    selectedExtras: Extra[],}) {
    const dispatch = useAppDispatch()
    return (
        <div className="flex items-center flex-col gap-2 mt-2 w-full">
            <div className="flex-center gap">
                <Button variant={"outline"} 
                    onClick={() => dispatch(removeCartItem({ id: item.id }))}
                >-</Button>
           
                        <div>
                            <span className="text-black"> {quantity} in cart</span>
                        </div>
                        <Button variant={"outline"} 
                            onClick={() => dispatch(addItemToCart( {
                                name : item.name ,
                                id : item.id ,
                                image : item.image ,
                                basePrice : item.basePrice ,
                                size : selectedSize ,
                                extras :  selectedExtras ,
                                              
                            }))}
                        >+</Button>

           
            </div>

            <Button size ='sm'
                onClick={() => dispatch(removeItemFromCart({id : item.id}))}
            >Remove</Button>
        </div >
    )
}