import { Pages, Routes } from '@/constants/enums';
import { Locale } from '@/i18n';
import getTrans from '@/lib/translation';
import { authOptions } from '@/server/auth';
import { UserRole } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import React from 'react'
import ProductForm from '../components/ProductForm';
import { getCategories } from '@/server/db/categories';


async function AddNewMenuItemPage({
    params,
}: {
    params: Promise<{ locale: Locale }>;
}) {
    const locale = (await params).locale;
    const translations = await getTrans(locale);
    const session = await getServerSession(authOptions);
    const categories = await getCategories()
    if (!session) {
        redirect(`/${locale}/${Routes.AUTH}/${Pages.LOGIN}`);
    }

    if (session && session.user.role !== UserRole.ADMIN) {
        redirect(`/${locale}/${Routes.PROFILE}`);
    }

    if (!categories || !categories.length) {
        redirect(`/${locale}/${Routes.ADMIN}/${Pages.CATEGORIES}`)
    }

    return (
        <section className='section-gap'>
            <div className="container">
                <ProductForm translations={translations} categories={categories} />
            </div>
        </section>
    )
}

export default AddNewMenuItemPage