import { Pages, Routes } from '@/constants/enums'
import { Locale } from '@/i18n'
import { authOptions } from '@/server/auth'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import React from 'react'

type Props = {
  params : Promise<{locale : Locale}>
}

const ProfilePage = async({params } : Props ) => {
  const locale =  (await params).locale
    const session = await getServerSession(authOptions)

      if (!session) redirect(`/${locale}/${Routes.AUTH}/${Pages.LOGIN}`);


    return (
    <section>ProfilePage</section>
  )
}

export default ProfilePage