import type { Metadata } from "next";
import { Roboto , Cairo} from "next/font/google";
import "./globals.css";
import Header from "@/components/shared/Header";
import ReduxProvider from "@/providers/ReduxProvider";
import { Languages } from "@/constants/enums";
import { Locale } from "@/i18n";
import { Toaster } from 'react-hot-toast';
import NextAuthSessionProvider from "@/providers/NextAuthSessionProvider";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  preload: true,
});

const cairo = Cairo({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  preload: true,
});


export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};


export async function generateStaticParams() {
  return [{ locale: Languages.ARABIC }, { locale: Languages.ENGLISH }];
}



export default async function RootLayout({
  children,
  params 
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{locale : Locale}>;
}>) {
  const locale = (await params).locale
  return (
    <html lang={locale} dir = {locale === Languages.ARABIC ? "rtl" : "ltr"} >
      <body

      className  = {locale === Languages.ARABIC ? cairo.className : roboto.className}
      >
      <NextAuthSessionProvider>
      <ReduxProvider>
       <div className="flex flex-col min-h-screen" >
          <Header />
          <main className="flex-1" >
          {children}
          </main>
          <Toaster position={locale === Languages.ARABIC ? "top-left" : "top-right"} />
        </div>
       </ReduxProvider>
      </NextAuthSessionProvider>

      </body>
    </html>
  );
}
