import Link from "./Link"
import Navbar from "./Navbar"
import LanguageSwitcher from "./LanguageSwitcher"
import CartButton from "./CartButton"
import { getCurrentLocale } from "@/lib/getCurrentLocale"
import getTrans from "@/lib/translation"
import AuthButtons from './AuthButtons'
import { getServerSession } from "next-auth"
import { authOptions } from "@/server/auth"


const Header = async () => {
  const locale = await getCurrentLocale();
  const translations = await getTrans(locale);
  const initialSession = await getServerSession(authOptions)
  return (
    <header className="py-4 md:py-6" >
      <div className="container flex-between  gap-6 lg:gap-10">

        <Link className="text-primary font-semibold text-2xl" href={`/${locale}`} >
          🍕 {translations.logo}
        </Link>

        <Navbar translations={translations}  initialSession={initialSession}/>

        <div className="flex-end flex-1 gap-6">
            <div className="hidden lg:flex items-center gap-4">
          <AuthButtons initialSession={initialSession} translations = {translations} />
          <LanguageSwitcher />
            </div>

          <CartButton />
        </div>


      </div>
    </header>
  )
}

export default Header