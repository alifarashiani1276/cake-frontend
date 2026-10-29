#!/usr/bin/env bash
# فریم‌ها را از ویدیوی اصلی بدون تغییر رزولوشن و نرخ فریم (۱۲۸۰×۷۲۰، ۲۴fps) استخراج می‌کند.
# ابتدا PNG بدون افت، سپس WebP با کیفیت ۹۵ (PSNR حدود ۴۷ تا ۵۲ دسی‌بل نسبت به منبع).
set -e
SRC=source/cake-scroll.mp4
TMP=$(mktemp -d)
mkdir -p public/frames
ffmpeg -y -i "$SRC" -vsync 0 "$TMP/%03d.png"
for f in "$TMP"/*.png; do
  ffmpeg -y -v error -i "$f" -c:v libwebp -quality 95 -compression_level 6 "public/frames/$(basename "${f%.png}").webp"
done
rm -rf "$TMP"
