import type { Metadata } from "next";
import { AppProviders } from "@/components/providers/app-providers";
import { appBrand } from "@/lib/branding";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: appBrand.name,
  description: appBrand.description,
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="pt-BR">
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
