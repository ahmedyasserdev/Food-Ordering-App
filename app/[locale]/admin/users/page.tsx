import Link from '@/components/shared/Link';
import { buttonVariants } from '@/components/ui/button';
import { Pages, Routes } from '@/constants/enums';
import { Locale } from '@/i18n';
import { getUsers } from '@/server/db/users';
import { Edit } from 'lucide-react';
import DeleteUserButton from './_components/DeleteUserButton';
import getTrans from '@/lib/translation';

type UsersPageParams = {
    params: Promise<{ locale: Locale }>;
}

const UsersPage = async( {params}: UsersPageParams) => {
    const users = await getUsers()
    const locale = (await params).locale;
    const translations =await getTrans(locale)
    return (
    <section className='section-gap'>
            <div className="container">
            <ul className="flex flex-col gap-4">
            {users.map((user) => (
              <li
                key={user.id}
                className="flex-between  gap-4 p-4 rounded-md bg-gray-100"
              >
                <div className="md:flex justify-between flex-1">
                  <h3 className="text-black font-medium text-sm flex-1">
                    {user.name}
                  </h3>
                  <p className="text-accent font-medium text-sm flex-1">
                    {user.email}
                  </p>
                </div>
                <div className="flex gap-4">
                  <Link
                    href={`/${locale}/${Routes.ADMIN}/${Pages.USERS}/${user.id}/${Pages.EDIT}`}
                    className={`${buttonVariants({ variant: "outline" })}`}
                  >
                    <Edit />
                  </Link>
                  <DeleteUserButton  translations={translations} userId={user.id} />
                </div>
              </li>
            ))}
          </ul>
            </div>

    </section>
  )
}

export default UsersPage