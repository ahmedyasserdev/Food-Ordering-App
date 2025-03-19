import EditUserForm from "@/components/shared/EditUserForm";
import { Pages, Routes } from "@/constants/enums";
import { Locale } from "@/i18n";
import getTrans from "@/lib/translation";
import { authOptions } from "@/server/auth";
import { UserRole } from "@prisma/client";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
type AdminPageProps = { params: Promise<{ locale: Locale }> }

async function AdminPage({ params }:AdminPageProps ) {
  const { locale } = await params;
  const translations = await getTrans(locale);
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect(`/${locale}/${Routes.AUTH}/${Pages.LOGIN}`);
  }

  if (session && session.user.role !== UserRole.ADMIN) {
    redirect(`/${locale}/${Routes.PROFILE}`);
  }
  return (
    <main>
      <section className="section-gap">
        <div className="container">
          <EditUserForm user={session?.user} translations={translations} />
        </div>
      </section>
    </main>
  );
}

export default AdminPage