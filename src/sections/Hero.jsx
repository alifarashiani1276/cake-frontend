import { useCallback, useRef, useState } from "react";
import FrameCanvas from "../components/animation/FrameCanvas";
import Captions from "../components/animation/Captions";
import LoadingBar from "../components/layout/LoadingBar";
import { useScrollFrames } from "../hooks/useScrollFrames";
import { FRAME_COUNT, SCROLL_PX_PER_FRAME, TAIL_SVH } from "../data/sequence";

export default function Hero() {
  const trackRef = useRef(null);
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const captionsRef = useRef(null);
  const barRef = useRef(null);
  const hintRef = useRef(null);
  const lineRef = useRef(null);

  const [ready, setReady] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  // callbackها ثابت‌اند تا افکت هوک دوباره راه نیفتد
  const onProgress = useCallback((p) => {
    captionsRef.current?.update(p);
    if (lineRef.current) lineRef.current.style.transform = `scaleY(${p})`;
    if (hintRef.current) hintRef.current.style.opacity = p > 0.02 ? 0 : 1;
  }, []);
  const onLoad = useCallback((p) => {
    if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
    if (p >= 1) setLoaded(true);
  }, []);
  const onReady = useCallback(() => setReady(true), []);
  const onError = useCallback(() => setError(true), []);

  useScrollFrames({ trackRef, wrapRef, canvasRef, onProgress, onLoad, onReady, onError });

  return (
    <main id="hero" ref={trackRef} className="relative" style={{ height: `calc(${TAIL_SVH}svh + ${FRAME_COUNT * SCROLL_PX_PER_FRAME}px)` }}>
      <div data-tone="light" data-color="#050403" className="sticky top-0 h-svh w-full overflow-hidden bg-night">
        <div className={`transition-opacity duration-1000 ${ready ? "opacity-100" : "opacity-0"}`}>
          <FrameCanvas ref={wrapRef} canvasRef={canvasRef} />
        </div>
        <Captions ref={captionsRef} />
        <div className="pointer-events-none absolute inset-y-[22svh] end-[3vw] hidden w-px bg-cream/15 md:block" aria-hidden="true">
          <div ref={lineRef} className="h-full w-full origin-top scale-y-0 bg-ember" />
        </div>

        <div
          ref={hintRef}
          className="pointer-events-none absolute bottom-[5svh] start-[6vw] flex flex-col items-center gap-3 text-sm text-ember/80 transition-opacity duration-500"
        >
          <span>اسکرول کنید</span>
          <span className="scroll-hint-line block h-10 w-px bg-ember/60" />
        </div>

        {error && (
          <p className="absolute inset-x-0 top-1/2 text-center text-linen">
            بارگذاری تصاویر انیمیشن ممکن نشد. صفحه را دوباره باز کنید.
          </p>
        )}
        <LoadingBar barRef={barRef} visible={!loaded} />
      </div>
    </main>
  );
}
