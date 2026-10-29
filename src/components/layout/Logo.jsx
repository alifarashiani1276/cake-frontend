// لوگوی برند با ماسک؛ رنگش از currentColor می‌آید و با هر زمینه‌ای هماهنگ می‌شود
const LOGOS = { fa: { file: "keeka-fa.png", ratio: 700 / 552 }, latin: { file: "keeka-latin.png", ratio: 1000 / 300 } };

export default function Logo({ kind = "fa", height = 36, className = "", style }) {
  const { file, ratio } = LOGOS[kind];
  const url = `url(${import.meta.env.BASE_URL}brand/${file})`;
  return (
    <span
      role="img"
      aria-label="کیکا"
      className={`block bg-current ${className}`}
      style={{ height, width: height * ratio, WebkitMaskImage: url, maskImage: url, WebkitMaskSize: "contain", maskSize: "contain", WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat", WebkitMaskPosition: "center", maskPosition: "center", ...style }}
    />
  );
}
