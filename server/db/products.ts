import { ProductWithRelations } from '@/types';
import { cache } from "@/lib/cache";
import { db } from "@/lib/prisma";

export const getBestSellers = cache( (
    limit?: number | undefined
) => {
    const bestSellers  =   db.product.findMany({
      where : {
       orders : {
        some : {}
       },
      },
      include : {
          extras : true,
          sizes : true,
      },

      orderBy : {
        orders : {
            _count : "desc"
        }
      },

      take : limit 
  });
  
      return bestSellers
  
 } , ["best-sellers"] , {revalidate : 3600}


)

    
  export const getProductsByCategory  = cache(
    () => {
        const products = db.category.findMany({
            include : {
                products : {
                    include : {
                        sizes: true,
                        extras : true ,
                    }
                }
            }
        })

        return products
    },
    ["products"],
    {revalidate : 3600}

  )