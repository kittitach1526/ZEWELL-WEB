import type { Metadata } from "next";
import { Prompt, Fugaz_One, Onest } from "next/font/google";
import "./globals.css";

/* ===============================
   GOOGLE FONTS
=============================== */

// ฟอนต์หลัก (ไทย)
const prompt = Prompt({
    weight: ["300", "400", "500", "700"],
    subsets: ["latin", "thai"],
    display: "swap",
    variable: "--font-prompt",
});

// ฟอนต์หัวข้อ / โลโก้
const fugaz = Fugaz_One({
    weight: "400",
    subsets: ["latin"],
    display: "swap",
    variable: "--font-fugaz",
});

// ฟอนต์ UI / อังกฤษ
const onest = Onest({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-onest",
});

/* ===============================
   METADATA
=============================== */

export const metadata: Metadata = {
    title: "ZEWELL OFFICIAL",
    description: "ระบบรายชื่อสมาชิก",
};


/* ===============================
   ROOT LAYOUT
=============================== */
export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html
            lang="th-TH"
            className={`${prompt.variable} ${fugaz.variable} ${onest.variable}`}
        >
            <body className="font-onest antialiased bg-black text-white">
                {children}
            </body>
        </html>
    );
}
