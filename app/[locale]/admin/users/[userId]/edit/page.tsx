import EditUserForm from "@/components/shared/EditUserForm";
import { Locale } from "@/i18n";
import getTrans from "@/lib/translation";
import { getUser, getUsers } from "@/server/db/users";

export async function generateStaticParams() {
  const users = await getUsers();

  return users.map((user) => ({ userId: user.id }));
}
type EditUserPageParams = {
  params:
  Promise<{ locale: Locale; userId: string }>;
}

const EditUserPage = async({ params}: EditUserPageParams) => {
  const {userId , locale} = (await params)
  const user =  await getUser(userId)
  const translations = await getTrans(locale)
  return (
    <section className="section-gap">
      <div className="container">
        <EditUserForm translations={translations}  user={user} />
      </div>
    </section>
  )
}

export default EditUserPage