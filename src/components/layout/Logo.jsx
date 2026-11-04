// لوگوی برند با ماسک؛ رنگش از currentColor می‌آید و با هر زمینه‌ای هماهنگ می‌شود
// kind: "fa" = «کیکا» فارسی، "latin" = Keeka لاتین. با height یا width (یکی از دو) اندازه بدهید.
const LOGOS = { fa: { file: "keeka-fa.png", ratio: 789 / 630 }, latin: { file: "keeka-latin.png", ratio: 828 / 258 } };

export default function Logo({ kind = "fa", height, width, className = "", style }) {
  const { file, ratio } = LOGOS[kind];
  const url = `url(${import.meta.env.BASE_URL}brand/${file})`;
  const size = width ? { width, aspectRatio: String(ratio) } : { height, width: height * ratio };
  return (
    <span
      role="img"
      aria-label="کیکا"
      className={`block bg-current ${className}`}
      style={{ ...size, WebkitMaskImage: url, maskImage: url, WebkitMaskSize: "contain", maskSize: "contain", WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat", WebkitMaskPosition: "center", maskPosition: "center", ...style }}
    />
  );
}
