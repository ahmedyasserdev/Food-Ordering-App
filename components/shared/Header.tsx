import { Routes } from "@/constants/enums"
import Link from "./Link"
import Navbar from "./Navbar"
import LanguageSwitcher from "./LanguageSwitcher"
import CartButton from "./CartButton"
import { getCurrentLocale } from "@/lib/getCurrentLocale"
import getTrans from "@/lib/translation"


const Header = async() => {
  const locale= await getCurrentLocale();
  const {logo , navbar} = await getTrans(locale);
  return (
    <header className="py-4 md:py-6" >
        <div className="container flex-between">
        
            <Link  className="text-primary font-semibold text-2xl" href={`/${locale}`} >
            🍕 {logo} 
            </Link>

            <Navbar translations={navbar} />

            <LanguageSwitcher />

            <CartButton />


        </div>
    </header>
  )
}

export default Header