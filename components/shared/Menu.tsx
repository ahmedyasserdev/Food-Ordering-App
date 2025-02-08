
import { Product } from '@prisma/client'
import MenuItem from './MenuItem'
import { ProductWithRelations } from '@/types'
type MenuProps = {items : ProductWithRelations[]}

const Menu = ({items}: MenuProps) => {
  return (
    <ul className='grid grid-cols-1  sm:grid-cols-2 lg:grid-cols-3 ' >
                    {
                        items?.map((item : any , index : number) => (
                                <MenuItem index = {index} key = {item.id} item= {item} />

                        ))
                    }
                </ul>
  )
}

export default Menu