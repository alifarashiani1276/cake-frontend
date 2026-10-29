import { forwardRef } from "react";

// قاب ۱۶:۹ که اندازه و جایش را هوک useScrollFrames تعیین می‌کند
const FrameCanvas = forwardRef(function FrameCanvas({ canvasRef }, wrapRef) {
  return (
    <div ref={wrapRef} className="absolute" style={{ width: 0, height: 0 }}>
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
