import { match as matchLocale } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'

import { NextRequest, NextResponse } from "next/server";
import { i18n, LanguageType, Locale } from './i18n';
import { withAuth } from 'next-auth/middleware'
import { getToken } from 'next-auth/jwt';
import { Pages, Routes } from './constants/enums';
import { UserRole } from '@prisma/client';



function getLocale(request: NextRequest): string | undefined {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  const locales: LanguageType[] = i18n.locales;
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();
  let locale = "";

  try {
    locale = matchLocale(languages, locales, i18n.defaultLocale);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  } catch (error: any) {
    locale = i18n.defaultLocale;
  }
  return locale;
}








export default withAuth(async function middleware(req: NextRequest) {
  const requestHeaders = new Headers(req.headers)
  requestHeaders.set("x-url", req.url);
    const response =  NextResponse.next(
      {
        request: {
          headers: requestHeaders
        }
      }
    )
  const pathname = req.nextUrl.pathname;

  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}`)
  );


  if (pathnameIsMissingLocale) {
    const locale = getLocale(req);
    return NextResponse.redirect(
      new URL(`/${locale}${pathname}`, req.url)
    )
  }
  const currentLocale = req.url.split('/')[3] as Locale
  const isAuth = await getToken({
    req
  })

  const isAuthPage = pathname.startsWith(`/${currentLocale}/${Routes.AUTH}`);
  const protectedRoutes = [
    Routes.PROFILE,
    Routes.ADMIN
  ];
  const isProtectedPage = protectedRoutes.some((route) => pathname.startsWith(`/${currentLocale}/${route}`));
  
  if (!isAuth && isProtectedPage ){
    return NextResponse.redirect(
      new URL(`/${currentLocale}/${Routes.AUTH}/${Pages.LOGIN}`, req.url)
    )
  }

    if (isAuth && isAuthPage) {
      const role = isAuth.role;
      if (role === UserRole.ADMIN) {
        return NextResponse.redirect(
          new URL(`/${currentLocale}/${Routes.ADMIN}`, req.url)
        )
      }
      return NextResponse.redirect(
        new URL(`/${currentLocale}/${Routes.PROFILE}`, req.url)
      )
    }

    if (isAuth && pathname.startsWith(`/${currentLocale}/${Routes.ADMIN}`)) {
      const role = isAuth.role;
      if (role !== UserRole.ADMIN){
        return NextResponse.redirect(
          new URL(`/${currentLocale}/${Routes.PROFILE}`, req.url)
        )
      }
    }

  
  return response
},

  {
    callbacks: {
      authorized(params) {
        return true
      }
    }
  }
)


export const config = {
  // Matcher ignoring `/_next/`, `/api/`, ..etc
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
}