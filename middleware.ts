import { match as matchLocale } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'

import { NextRequest, NextResponse } from "next/server";
import { i18n, LanguageType } from './i18n';

 
// let headers = { 'accept-language': 'en-US,en;q=0.5' }
// let languages = new Negotiator({ headers }).languages()
// let locales = ['en-US', 'nl-NL', 'nl']
// let defaultLocale = 'en-US'
 
// match(languages, locales, defaultLocale) // -> 'en-US'

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






export async function middleware (req :NextRequest) {
    const requestHeaders = new Headers(  req.headers)
    requestHeaders.set("x-url" , req.url);
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

    return NextResponse.next(
        {
            request : {
                headers : requestHeaders
            }
        }
    )
}




export const config = {
    // Matcher ignoring `/_next/`, `/api/`, ..etc
    matcher: [
      "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
    ],
}