'use client'
import { Pages, Routes } from '@/constants/enums'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'
import React, { useState } from 'react'
import { Button, buttonVariants } from '../ui/button'
import { motion, useMotionValue, } from "motion/react"
import { useMediaQuery } from '@custom-react-hooks/use-media-query';
import { Menu, X } from 'lucide-react'
type NavbarProps = {
    translations : {[key : string] : string}
}





const Navbar = ({translations }: NavbarProps) => {
    const [open, setOpen] = useState(false)
    const { locale } = useParams();
    const pathname = usePathname();
    const x = useMotionValue(0);
    const isTablet = useMediaQuery("(max-width: 991px)");


    const links = [
        {
            id: crypto.randomUUID(),
            title: translations.menu,
            href: Routes.MENU,
        },
        {
            id: crypto.randomUUID(),
            title: translations.about,
            href: Routes.ABOUT,
        },
        {
            id: crypto.randomUUID(),
            title: translations.contact,

            href: Routes.CONTACT,
        },
        {
            id: crypto.randomUUID(),
            title: translations.login,

            href: `${Routes.AUTH}/${Pages.LOGIN}`,
        },
    
    ]



    const handleClick = () => {
        if (isTablet) {
            if (open) {
                x.set(-1000);
                setOpen(false);

            } else {
                x.set(0);
                setOpen(true);

            }
        }
    }

    return (
        <nav className='flex-1 flex justify-end  z-10' >
            <Button
                variant="secondary"
                size="sm"
                className="lg:hidden"
                effect={"shine"}
                onClick={handleClick}
            >
               {open  ? <X className="!size-6"/>  : <Menu className="!size-6" />}  
            </Button>
            <motion.ul className={cn(open ? "left-0 w-full h-screen top-0" : "left-[-100%]", '  lg:flex  fixed lg:static items-center gap-4 px-10 py-20 lg:p-0 bg-background  lg:bg-transparent transition-all duration-500 ') }
                style={{ x ,}}
            >
                {
                    links.map((link, index) => (

                        <motion.li key={link.id}
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ delay: index * 0.1, duration: 0.3, ease: "easeInOut" }}
                            className='my-6 lg:my-0 '

                        >
                            <Link href={`/${locale}/${link.href}`}
                                className={
                                    cn("hover:text-primary   duration-200 transition-colors font-semibold",

                                        pathname.startsWith(`/${locale}/${link.href}`) ? "text-primary"
                                            : "text-accent",
                                        link.href === `${Routes.AUTH}/${Pages.LOGIN}` && `${buttonVariants({ variant: "default" ,effect:"shine" })}  !px-8 rounded-full  hover:text-white`
                                    )
                                }

                            >{link.title}</Link>
                        </motion.li>
                    ))
                }

            </motion.ul>

        </nav>
    )
}

export default Navbar