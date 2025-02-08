"use client"
import Image from 'next/image'
import {motion} from 'motion/react'

const HeroImage = () => {
  return (
    <motion.div className="relative hidden md:block"
        whileInView={{opacity : 1 , scale : 1 ,}}
        initial= {{opacity : 0 ,  scale : 0.75}}
        transition={{ease : "easeInOut" , duration : 0.4 , type : "spring" , stiffness : 100 , }}
    >
    <Image className="object-contain" src="/pizza.png" alt="pizza" fill loading="eager" priority />
</motion.div>
  )
}

export default HeroImage