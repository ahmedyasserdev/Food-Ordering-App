import { Pages, Routes } from "@/constants/enums";
import { Locale } from "@/i18n";
import { getProductById, getProducts } from "@/server/db/products"
import { redirect } from "next/navigation";
import ProductForm from "../../components/ProductForm";
import getTrans from "@/lib/translation";
import { getCategories } from "@/server/db/categories";



export async function generateStaticParams() {
    const products = await getProducts();

    return products.map((product) => ({ productId: product.id }));
}
type EditProductPageParams = {
    params:
    Promise<{ locale: Locale; productId: string }>;

}


const EditProductPage = async ({ params }: EditProductPageParams) => {
    const { locale, productId } = await params;
    const product = await getProductById(productId)
    const translations = await getTrans(locale);
    const categories = await getCategories();

    if (!product) {
        redirect(`/${locale}/${Routes.ADMIN}/${Pages.MENU_ITEMS}`);
    }

    return (
        <section className="py-6" >
            <div className="container">
            <ProductForm  product={product} categories={categories} translations={translations} />
            </div>
        </section>
    )
}

export default EditProductPage