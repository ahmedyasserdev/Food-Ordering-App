import EditUserForm from '@/components/shared/EditUserForm'
import { Routes } from '@/constants/enums'
import { Locale } from '@/i18n'
import getTrans from '@/lib/translation'
import { authOptions } from '@/server/auth'
import { UserRole } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import React from 'react'

type Props = {
  params : Promise<{locale : Locale}>
}

const ProfilePage = async({params } : Props ) => {
  const locale =  (await params).locale
    const session = await getServerSession(authOptions)
    const translations = await getTrans(locale);
    if (session && session.user.role === UserRole.ADMIN) {
      redirect(`/${locale}/${Routes.ADMIN}`)
    }

 

    return (
      <section className="section-gap">
      <div className="container">
        <h1 className="text-primary text-center font-bold text-4xl italic mb-10">
          {translations.profile.title}
        </h1>
        <EditUserForm user={session?.user!} translations={translations} />
      </div>
    </section>

  )
}

export default ProfilePage


