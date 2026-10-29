import { FRAME_WIDTH, FRAME_HEIGHT } from "../data/sequence";

// اندازه و جای قاب را برحسب صفحه محاسبه می‌کند؛ نسبت ۱۶:۹ هیچ‌وقت کشیده نمی‌شود.
export function computeLayout(vw, vh, focusX = 0.5) {
  const portrait = vw / vh < 1;
  let scale;
  let top;
  if (portrait) {
    // موبایل: حدود ۵۵٪ عرض قاب دیده می‌شود و قاب با کیک به چپ/راست حرکت می‌کند
    scale = vw / (FRAME_WIDTH * 0.55);
    top = vh * 0.56 - (FRAME_HEIGHT * scale) / 2;
  } else {
    // دسکتاپ و تبلت: کل ارتفاع قاب دیده می‌شود
    scale = vh / FRAME_HEIGHT;
    top = 0;
  }
  const width = FRAME_WIDTH * scale;
  const height = FRAME_HEIGHT * scale;
  let left = portrait ? vw / 2 - focusX * width : (vw - width) / 2;
  if (portrait) left = Math.min(0, Math.max(vw - width, left));
  return { width, height, left, top };
}
