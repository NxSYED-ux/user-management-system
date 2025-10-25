import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "User Management System",
  description:
    "A simple CRUD-based user management dashboard built with Next.js and Tailwind CSS.",
  keywords: [
    "User Management",
    "CRUD App",
    "Next.js",
    "Tailwind CSS",
    "Daisy UI",
  ],
  authors: [
    {
      name: "NxSYED-ux",
    },
  ],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "User Management System",
    description:
      "Manage users easily — create, read, update, and delete with a clean dashboard built using Next.js and Tailwind.",
    siteName: "User Management System",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="sunset">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <ToastContainer position="top-right" autoClose={3000} />
      </body>
    </html>
  );
}
