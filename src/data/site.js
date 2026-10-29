// متن‌ها و اطلاعات سایت اینجاست؛ مقدارهای نمونه را با اطلاعات واقعی عوض کنید.
export const BRAND = "کیک‌خانه"; // نام نمونه

export const NAV = [
  { label: "شیرینی‌ها", href: "#menu", id: "menu" },
  { label: "داستان ما", href: "#story", id: "story" },
  { label: "تماس", href: "#contact", id: "contact" },
];

export const CTA = { label: "سفارش کیک", href: "#contact" };

export const MENU = {
  heading: "کیک‌های ما",
  intro: "هر سفارش را همان روز، با مواد تازه و با دست آماده می‌کنیم.",
  // نام‌ها و توضیح‌ها نمونه‌اند؛ id نام فایل عکس در public/cards است
  items: [
    { id: "caramel-cake", name: "کیک کارامل و فندق", note: "کرم نرم، کارامل کره‌ای و فندق برشته", pos: "50% 62%" },
    { id: "cherry-cupcake", name: "کاپ‌کیک شکلاتی", note: "خامهٔ ابریشمی، شکلات رنده‌شده و یک گیلاس", pos: "58% 50%" },
    { id: "keeka-box", name: "جعبهٔ هدیه", note: "هر سفارش در جعبهٔ دست‌دار مخصوص خودش می‌رسد", pos: "50% 50%" },
  ],
};

export const STORY = {
  text: "کیک خوب عجله ندارد. خمیر را می‌گذاریم استراحت کند، فر را گرم نگه می‌داریم و هر کیک را آخر کار با دست تزئین می‌کنیم.",
};

export const CONTACT = {
  heading: "یک شمع، یک کیک، یک مناسبت.",
  note: "برای سفارش و هماهنگی با ما تماس بگیرید.",
  phone: "tel:+98XXXXXXXXXX",     // TODO: شمارهٔ واقعی
  phoneLabel: "تماس تلفنی",
  messageHref: "https://t.me/your_id", // TODO: آیدی واقعی
  messageLabel: "پیام در تلگرام",
};

export const ANNOUNCE = "سفارش کیک‌های مناسبتی را ۴۸ ساعت زودتر ثبت کنید"; // متن نمونه
