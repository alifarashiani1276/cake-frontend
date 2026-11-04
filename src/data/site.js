// متن‌ها و اطلاعات سایت اینجاست؛ مقدارهای نمونه را با اطلاعات واقعی عوض کنید.
export const BRAND = "کیکا";

export const TAGLINE = "طعم اصیل، با حس خوب";
export const SUB = "PERSIAN SWEETS & BITES";

export const NAV = [
  { label: "کیک‌ها", href: "#menu", id: "menu" },
  { label: "داستان ما", href: "#story", id: "story" },
  { label: "چرا کیکا", href: "#why", id: "why" },
  { label: "تماس", href: "#contact", id: "contact" },
];

export const CTA = { label: "سفارش ویژه", href: "#custom" };

export const MENU = {
  heading: "کیک‌های ما",
  intro: "هر سفارش را همان روز، با مواد تازه و با دست آماده می‌کنیم.",
  // نام‌ها، توضیح‌ها و قیمت‌ها نمونه‌اند؛ id نام فایل عکس در public/cards است
  items: [
    { id: "caramel-cake", name: "کیک کارامل و فندق", note: "کرم نرم، کارامل کره‌ای و فندق برشته", pos: "50% 62%", price: 650000, stock: "موجود · ارسال امروز" },
    { id: "cherry-cupcake", name: "کاپ‌کیک شکلاتی (۶ عددی)", note: "خامهٔ ابریشمی، شکلات رنده‌شده و یک گیلاس", pos: "58% 50%", price: 320000, oldPrice: 400000, discount: 20, stock: "موجود · ارسال امروز" },
    { id: "keeka-box", name: "جعبهٔ هدیهٔ کیکا", note: "هر سفارش در جعبهٔ دست‌دار مخصوص خودش می‌رسد", pos: "50% 50%", price: 180000, stock: "موجود · ارسال فردا" },
  ],
};

export const WHY = {
  heading: "چرا کیکا؟",
  items: [
    { title: "مواد تازه، هر روز", text: "کره، خامه و میوه را همان صبحِ پخت تهیه می‌کنیم؛ هیچ کیکی از دیروز نمی‌ماند." },
    { title: "ارسال همان روز", text: "سفارش‌های تا ظهر، همان روز با بسته‌بندی مخصوص و ایمن به دستتان می‌رسد." },
    { title: "سفارش ویژه", text: "برای تولد، نامزدی و مهمانی، طرح و طعم کیک را با هم انتخاب می‌کنیم." },
  ],
};

export const CUSTOM = {
  eyebrow: "سفارش ویژه",
  heading: "کیک رؤیایی‌ات را با هم می‌سازیم",
  text: "طعم، اندازه و طرح را بگویید؛ بقیه‌اش با ما. سفارش‌های مناسبتی را ۴۸ ساعت زودتر ثبت کنید.",
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
