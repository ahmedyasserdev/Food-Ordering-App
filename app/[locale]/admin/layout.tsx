import { Locale } from '@/i18n';
import AdminTabs from './_components/AdminTabs'
import getTrans from '@/lib/translation';

type AdminLayoutProps = {
    children: React.ReactNode;
    params : Promise<{locale : Locale}>
}

const AdminLayout = async({children , params}: AdminLayoutProps) => {
        const  locale = (await params).locale
        const translations = await getTrans(locale);
  return (
    <>
        <AdminTabs translations = {translations} />
        {children}
    </>
  )
}

export default AdminLayout