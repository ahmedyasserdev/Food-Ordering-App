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
import { Extra, Product, Size } from "@prisma/client"
type AddToCartButtonProps = {
    item: ProductWithRelations
}



const AddToCartButton = ({ item }: AddToCartButtonProps) => {

   

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
                            <Sizes sizes={item.sizes} item={item} />
                        </div>
                        <div className="space-y-4 text-center" >
                            <Label htmlFor="add-extras" className="font-bold ">
                                Any Extras?
                            </Label>

                            <Extras extras={item.extras} item={item} />


                        </div>
                    </div>




                    <Button
                        type='submit'
                        className='w-full h-10'
                    >
                        Add to cart
                    </Button>


                </DialogContent>
            </Dialog>

        </motion.div>


    )
}

export default AddToCartButton



export function Sizes({ sizes, item }: { sizes: Size[], item: Product }) {
    return (
        <RadioGroup defaultValue="small" >
            {
                sizes.map((size: any) => (
                    <div className="flex items-center space-x-2 border border-gray-100 rounded-md p-4" key={size.id}>
                        <RadioGroupItem value={size.value} id={size.id} />
                        <Label htmlFor={size.id}>{size.value} {formatCurrency(size.price + item.basePrice)} </Label>
                    </div>

                ))
            }
        </RadioGroup>
    )
}


function Extras({ extras, item }: { extras: Extra[], item: Product }) {
    return (
        <div className="mt-2">
            {
                extras.map((extra: any) => (
                    <div className="flex items-center space-x-2 border border-gray-100 rounded-md p-4 " key={extra.id}>
                        <Checkbox id={extra.id} />
                        <Label htmlFor={extra.id}>{extra.value} {formatCurrency(extra.price)}</Label>
                    </div>
                ))
            }
        </div>
    )
}