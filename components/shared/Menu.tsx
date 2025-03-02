
import { Product } from '@prisma/client'
import MenuItem from './MenuItem'
import { ProductWithRelations } from '@/types'
import { getCurrentLocale } from '@/lib/getCurrentLocale'
import getTrans from '@/lib/translation'
type MenuProps = {items : ProductWithRelations[]}

const Menu = async({items}: MenuProps) => {
  const locale= await getCurrentLocale();
  const {noProductsFound ,} = await getTrans(locale);
  return (
    <>
        {
          items.length > 0 ? (
            <ul className='grid grid-cols-1  sm:grid-cols-2 lg:grid-cols-3 ' >
            {
                items?.map((item : any , index : number) => (
                        <MenuItem index = {index} key = {item.id} item= {item} />

                ))
            }
        </ul>
          ) : <>
              <p className="text-accent text-center " >

     {noProductsFound}
              </p>
          </>
        }
    
    </>
  )
}

export default Menu