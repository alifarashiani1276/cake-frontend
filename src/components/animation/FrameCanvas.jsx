import { forwardRef } from "react";

// قاب ۱۶:۹ که اندازه و جایش را هوک useScrollFrames تعیین می‌کند.
// جای قاب با transform می‌آید (left/top صفر است) تا جابه‌جاییِ هر فریم چیدمان صفحه را دوباره نسازد.
const FrameCanvas = forwardRef(function FrameCanvas({ canvasRef }, wrapRef) {
  return (
    <div ref={wrapRef} className="absolute will-change-transform" style={{ width: 0, height: 0, left: 0, top: 0 }}>
      <canvas
        ref={canvasRef}
        className="block h-full w-full"
        role="img"
        aria-label="کیک خامه‌ای با توت‌فرنگی و یک شمع روشن"
      />
      <div className="frame-feather absolute inset-0" />
    </div>
  );
});

export default FrameCanvas;
