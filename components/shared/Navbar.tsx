'use client'
import { Routes } from '@/constants/enums'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'
import React, { useState } from 'react'
import { Button, } from '../ui/button'
import { motion, useMotionValue, } from "motion/react"
import { useMediaQuery } from '@custom-react-hooks/use-media-query';
import { Menu, X } from 'lucide-react'
import LanguageSwitcher from './LanguageSwitcher'
import AuthButtons from './AuthButtons'
import { Translations } from '@/types'
import { Session } from 'next-auth'
import { useClientSession } from '@/hooks/useClientSession'
import { UserRole } from '@prisma/client'

type NavbarProps = {
    translations: Translations
    initialSession: Session | null
}





const Navbar = ({ translations, initialSession }: NavbarProps) => {

    const links = [
        {
            id: crypto.randomUUID(),
            title: translations.navbar.menu,
            href: Routes.MENU,
        },
        {
            id: crypto.randomUUID(),
            title: translations.navbar.about,
            href: Routes.ABOUT,
        },
        {
            id: crypto.randomUUID(),
            title: translations.navbar.contact,

            href: Routes.CONTACT,
        },


    ]




    const [open, setOpen] = useState(false)
    const { locale } = useParams();
    const pathname = usePathname();
    const x = useMotionValue(0);
    const isTablet = useMediaQuery("(max-width: 991px)");
    const session = useClientSession(initialSession);
    const isAdmin = session.data?.user?.role === UserRole.ADMIN;


    const handleOpen = () => {
        x.set(0);
        setOpen(true);
    }

    const handleClose = () => {
        x.set(-1000);
        setOpen(false);

    }

    const handleClick = () => {
        if (isTablet) {
            if (open) {
                handleClose()
            } else {
                handleOpen()

            }
        }
    }



    return (
        <nav className='lg:order-none z-10 order-last' >
            <Button
                variant="secondary"
                size="sm"
                className="lg:hidden"
                effect={"shine"}
                onClick={handleClick}
            >
                {open ? <X className="!size-6" /> : <Menu className="!size-6" />}
            </Button>
            <motion.ul className={cn(open ? "left-0 w-full h-screen top-0" : "left-[-100%]", '  lg:flex  fixed lg:static items-center gap-4 px-10 py-20 lg:p-0 bg-background  lg:bg-transparent transition-all duration-500 ')}
                style={{ x, }}
            >

                <Button onClick={handleClose} variant={'ghost'} size={"icon"} className='lg:hidden hover:text-white ' >
                    <X className="!size-6 cursor-pointer " />
                </Button>
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
                                    cn("nav-item",

                                        pathname.startsWith(`/${locale}/${link.href}`) ? "text-primary"
                                            : "text-accent",
                                    )
                                }

                            >{link.title}</Link>
                        </motion.li>
                    ))
                }


                {session.data?.user && (
                    <li>
                        <Link
                            href={
                                isAdmin
                                    ? `/${locale}/${Routes.ADMIN}`
                                    : `/${locale}/${Routes.PROFILE}`
                            }
                            className={`${pathname.startsWith(
                                isAdmin
                                    ? `/${locale}/${Routes.ADMIN}`
                                    : `/${locale}/${Routes.PROFILE}`
                            )
                                    ? "text-primary"
                                    : "text-accent"
                                } nav-item`}
                        >
                            {isAdmin
                                ? translations.navbar.admin
                                : translations.navbar.profile}
                        </Link>
                    </li>
                )}


                <li className="flex flex-col gap-4 lg:hidden" onClick={handleClose}>
                    <AuthButtons initialSession={initialSession} translations={translations} />
                    <LanguageSwitcher />
                </li>

            </motion.ul>

        </nav>
    )
}

export default Navbar