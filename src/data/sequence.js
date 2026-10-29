// ویدیوی اصلی: ۱۲۸۰×۷۲۰، ۲۴fps، ۱۰ ثانیه = ۲۴۰ فریم
export const FRAME_COUNT = 240;
// اندازهٔ منطقی قاب (نسبت ۱۶:۹) برای محاسبهٔ چیدمان
export const FRAME_WIDTH = 1280;
export const FRAME_HEIGHT = 720;

// دو نسخه از فریم‌ها: روی صفحه‌های بزرگ نسخهٔ ۱۹۲۰، روی بقیه ۱۶۰۰
export const FRAME_SETS = {
  hd:  { dir: "frames-hd",  width: 1920, height: 1080, window: 8, keep: 10, sparse: 30 },
  mid: { dir: "frames-mid", width: 1600, height: 900,  window: 8, keep: 10, sparse: 24 },
};
export const pickFrameSet = () => (window.innerWidth >= 900 ? FRAME_SETS.hd : FRAME_SETS.mid);
export const frameUrl = (set, i) =>
  `${import.meta.env.BASE_URL}${set.dir}/${String(i + 1).padStart(3, "0")}.webp`;
export const FOCUS_URL = `${import.meta.env.BASE_URL}frames/focus.json`;
// طول اسکرول به‌ازای هر فریم (px)
export const SCROLL_PX_PER_FRAME = 22;
