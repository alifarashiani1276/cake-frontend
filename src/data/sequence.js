// ویدیوی اصلی: ۱۲۸۰×۷۲۰، ۲۴fps، ۱۰ ثانیه = ۲۴۰ فریم
export const FRAME_COUNT = 240;
// اندازهٔ منطقی قاب (نسبت ۱۶:۹) برای محاسبهٔ چیدمان
export const FRAME_WIDTH = 1280;
export const FRAME_HEIGHT = 720;

// سه نسخه از فریم‌ها:
//  hd     = صفحهٔ بزرگ (۲۴۰ فریم ۱۹۲۰×۱۰۸۰)
//  mid    = تبلت (۲۴۰ فریم ۱۶۰۰×۹۰۰)
//  mobile = گوشی (۱۲۰ فریم ۱۲۸۰×۷۲۰: نصف فریم‌ها و حدود نصف حافظه؛ روی گوشی تفاوتش دیده نمی‌شود)
// count: تعداد فایل‌های آن نسخه؛ مدت و طول اسکرول انیمیشن همیشه بر پایهٔ FRAME_COUNT می‌ماند.
// concurrency: تعداد دانلود هم‌زمان؛ window/keep/sparse: چند فریم اطراف آماده باشد.
export const FRAME_SETS = {
  hd:     { dir: "frames-hd",     count: 240, width: 1920, height: 1080, window: 8, keep: 10, sparse: 30, concurrency: 6 },
  mid:    { dir: "frames-mid",    count: 240, width: 1600, height: 900,  window: 8, keep: 10, sparse: 24, concurrency: 4 },
  mobile: { dir: "frames-mobile", count: 120, width: 1280, height: 720,  window: 5, keep: 6,  sparse: 20, concurrency: 3 },
};
export const pickFrameSet = () => {
  const w = window.innerWidth;
  return w >= 900 ? FRAME_SETS.hd : w >= 700 ? FRAME_SETS.mid : FRAME_SETS.mobile;
};
// شمارهٔ فریم نسخه → شمارهٔ فریم در ویدیوی اصلی (برای focus.json و ...)
export const toOriginal = (set, i) => Math.round((i * (FRAME_COUNT - 1)) / Math.max(1, set.count - 1));
export const frameUrl = (set, i) =>
  `${import.meta.env.BASE_URL}${set.dir}/${String(i + 1).padStart(3, "0")}.webp`;
export const FOCUS_URL = `${import.meta.env.BASE_URL}frames/focus.json`;
// طول اسکرول به‌ازای هر فریم (px)
export const SCROLL_PX_PER_FRAME = 22;

// طول مسیر هیرو بعد از انیمیشن: پردهٔ کرم در CURTAIN_VH صفحه بالا می‌آید و بقیه مکث کوتاه است
export const TAIL_SVH = 200;
export const CURTAIN_VH = 1.0;
