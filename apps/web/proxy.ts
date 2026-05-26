import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  locales: ["en", "th"],
  defaultLocale: "en",
});

export const config = {
  // สลับเอาเงื่อนไขล้างแคช/ยกเว้นโฟลเดอร์ขึ้นมาไว้ตัวแรกสุด
  // และเติม |api|api/v1 เข้าไปให้ชัดเจน
  matcher: [
    "/((?!api|_next|.*\\..*).*)", // ย้ายตัวนี้มาอันแรก และสั่ง bypass 'api' ทันที
    "/",
    "/(de|en|th)/:path*",
  ],
};
