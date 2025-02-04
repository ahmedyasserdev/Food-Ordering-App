import { Routes } from "@/constants/enums"
import Link from "./Link"
import Navbar from "./Navbar"


const Header = () => {
  return (
    <header className="py-4 md:py-6" >
        <div className="container flex-between">
        
            <Link  className="text-primary font-semibold text-2xl" href={Routes.ROOT} >
            🍕 Pizza 
            </Link>

            <Navbar />


        </div>
    </header>
  )
}

export default Header