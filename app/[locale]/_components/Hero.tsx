import Link from "@/components/shared/Link"
import { buttonVariants } from "@/components/ui/button"
import { TextGenerateEffect } from "@/components/ui/TextGenerateEffect"
import { Languages, Routes } from "@/constants/enums"
import { ArrowRightCircle,  } from "lucide-react"
import HeroImage from "./HeroImage"
import { getCurrentLocale } from "@/lib/getCurrentLocale"
import getTrans from "@/lib/translation"

const Hero =async () => {
  const locale= await getCurrentLocale();
  const {home : {hero}} = await getTrans(locale);
    return (
        <section>
            <div className="container grid grid-cols-1  md:grid-cols-2 section-gap">
                <div className='md:py-12'>
                    <TextGenerateEffect Tag={"h1"} words={hero.title} className="text-4xl font-semibold" />
                    <TextGenerateEffect   filter= {false}
                words  = {hero.description}                     
                     className='text-accent my-4' />
                   
                    <div className='flex items-center gap-4'>
            <Link
              href={`/${Routes.MENU}`}
              className={`${buttonVariants({
                size: 'lg', effect : "gooeyLeft"
              })} space-x-2 !px-4 !rounded-full uppercase`}
            >
              {hero.orderNow}
            
              <ArrowRightCircle
                className={`!w-5 !h-5 $
                   ${
                locale === Languages.ARABIC ? 'rotate-180 ' : ''
                }`}
              />
            </Link>
            <Link
              href={`/${Routes.ABOUT}`}
              className='flex gap-2 items-center text-black hover:text-primary duration-200 transition-colors font-semibold'
            >
              {hero.learnMore}
              <ArrowRightCircle
                className={`!w-5 !h-5 $
                    ${
                  locale === Languages.ARABIC ? 'rotate-180 ' : ''
                }`}
              />
            </Link>
          </div>
                </div>

               <HeroImage />


            </div>

        </section>
    )
}

export default Hero