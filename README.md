# انیمیشن کیک و شمع با اسکرول

React + Vite + Tailwind CSS v4 (جاوااسکریپت ساده، بدون TypeScript و Next.js)

## نصب و اجرا
```bash
npm install
npm run dev        # توسعه
npm run build      # ساخت نسخهٔ نهایی در dist/
npm run preview    # آزمایش نسخهٔ ساخته‌شده
```

## ساختار
- `public/frames-hd/` (۱۹۲۰×۱۰۸۰) و `public/frames-mid/` (۱۶۰۰×۹۰۰): ۲۴۰ فریم ارتقاداده‌شده از ویدیوی اصلی؛ `scripts/upscale-frames.py` آن‌ها را می‌سازد
- `public/frames/focus.json` : مرکز کیک در هر فریم برای موبایل
- `source/cake-scroll.mp4` : ویدیوی اصلی؛ `scripts/extract-frames.sh` فریم‌های خام را از آن می‌سازد
- `src/hooks/useScrollFrames.js` : منطق انیمیشن (اسکرول → فریم → Canvas)
- `src/lib/frameStore.js` : بارگذاری مرحله‌ای و مدیریت حافظهٔ فریم‌ها
- `src/lib/layout.js` : اندازه و جای قاب (بدون کشیدگی)
- `src/data/` : مشخصات توالی و متن‌ها
- `src/components/`, `src/sections/Hero.jsx` : رابط

## فونت Morabba
فونت اصلی سایت اکنون «پیدا» (Peyda) است و از `src/assets/fonts/` بارگذاری می‌شود. برای استفاده از Morabba فایل `woff2` را در `public/fonts/` بگذارید و در `src/styles/index.css` این را اضافه کنید:
```css
@font-face { font-family: "Morabba"; src: url("/fonts/Morabba-Medium.woff2") format("woff2"); font-display: swap; }
```
توکن `--font-display` از قبل Morabba را اول فهرست دارد.
