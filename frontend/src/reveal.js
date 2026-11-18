import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const SEL = ".grid > *, .steps > *, .stats > *, .comments > *, .questions > *, .lessons > *, .section > .head, .detail .side";

export function useReveal() {
  const loc = useLocation();
  useEffect(() => {
    let raf = 0;
    function check() {
      raf = 0;
      document.querySelectorAll(SEL).forEach((el) => {
        if (!el.classList.contains("reveal")) el.classList.add("reveal");
      });
      const h = window.innerHeight;
      document.querySelectorAll(".reveal:not(.in)").forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < h * 0.95 && r.bottom > 0) el.classList.add("in");
      });
    }
    function queue() {
      if (!raf) raf = requestAnimationFrame(check);
    }
    queue();
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);
    const mo = new MutationObserver(queue);
    mo.observe(document.getElementById("root"), { childList: true, subtree: true });
    const t = setInterval(check, 600);
    return () => {
      window.removeEventListener("scroll", queue);
      window.removeEventListener("resize", queue);
      mo.disconnect();
      clearInterval(t);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [loc.pathname]);
}
