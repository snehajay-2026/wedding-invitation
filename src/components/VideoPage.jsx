import { useEffect, useRef, useState } from "react";

// Page 1: Folded Wedding Card → Left-Right Fold Open → Play Video
export default function VideoPage({ onNext, onBack, onUnlockAudio, onOpenUpload, lang = "mr" }) {
  const coverUrl = `${import.meta.env.BASE_URL}assets/cover.png`;
  const logoTransparentUrl = `${import.meta.env.BASE_URL}assets/SneJay-transparent.png`;
  const logoFallbackUrl = `${import.meta.env.BASE_URL}assets/SneJay.png`;
  const bellUrl = `${import.meta.env.BASE_URL}assets/bell.mp3`;
  const [logoSrc, setLogoSrc] = useState(logoTransparentUrl);
  const [coverStatus, setCoverStatus] = useState("unknown"); // unknown | loaded | missing
  const [opened, setOpened] = useState(false); // controls fold animation
  const [showVideo, setShowVideo] = useState(false); // when true, render video
  const [isOpening, setIsOpening] = useState(false); // guard during bell playback
  const [pearlLift, setPearlLift] = useState(false);
  const videoRef = useRef(null);
  const bellRef = useRef(null);
  const dragRef = useRef({});
  const openTimerRef = useRef(null);
  const copy = {
    mr: {
      logoAlt: "अजय आणि स्नेहा विवाह लोगो",
      invitation: "निमंत्रण",
      openInvitation: "निमंत्रण उघडा",
      skip: "पुढे ➜",
      skipAria: "व्हिडिओ वगळा",
      back: "मागे जा",
    },
    en: {
      logoAlt: "Ajay and Sneha wedding logo",
      invitation: "Invitation",
      openInvitation: "Open invitation",
      skip: "Skip ➜",
      skipAria: "Skip video",
      back: "Go back",
    },
  }[lang];

  // Detect if the cover image exists; if not, we overlay the Invitation mark.
  useEffect(() => {
    let alive = true;
    const img = new Image();
    img.onload = () => alive && setCoverStatus("loaded");
    img.onerror = () => alive && setCoverStatus("missing");
    img.src = coverUrl;
    return () => {
      alive = false;
    };
  }, [coverUrl]);

  // When showVideo becomes true, start playing and wire onended
  useEffect(() => {
    if (showVideo && videoRef.current) {
      const vid = videoRef.current;
      const handleEnded = () => onNext();
      vid.addEventListener("ended", handleEnded);
      vid.play().catch(() => {});

      return () => {
        vid.removeEventListener("ended", handleEnded);
      };
    }
  }, [showVideo, onNext]);

  useEffect(() => {
    return () => {
      if (openTimerRef.current) clearTimeout(openTimerRef.current);
    };
  }, []);

  // Click handler: open the card immediately on first interaction.
  function handleOpen() {
    if (isOpening) return; // ignore repeated clicks while opening
    setIsOpening(true);
    setPearlLift(false);

    if (onUnlockAudio) onUnlockAudio();

    setOpened(true);
    setShowVideo(true);
    setIsOpening(false);

    try {
      const a = new Audio(bellUrl);
      bellRef.current = a;
      a.play().catch(() => {});
    } catch (err) {
      // no-op: opening already happened above
    }
  }

  function handleTouchOpen(e) {
    if (isOpening || opened) return;
    dragRef.current = { triggered: true, id: e.pointerId };
    setIsOpening(true);
    setPearlLift(true);

    if (onUnlockAudio) onUnlockAudio();

    try {
      const a = new Audio(bellUrl);
      bellRef.current = a;
      a.play().catch(() => {});
    } catch (err) {
      // no-op: invitation still opens after lift animation
    }

    if (openTimerRef.current) clearTimeout(openTimerRef.current);
    openTimerRef.current = setTimeout(() => {
      setOpened(true);
      setShowVideo(true);
      setPearlLift(false);
      setIsOpening(false);
    }, 380);
  }

  return (
    <div className="video-page cinematic-bg">
      {/* Floating petals */}
      <div className="petal-layer">
        {[...Array(20)].map((_, i) => (
          <span key={i} className="petal" />
        ))}
      </div>

      <div className="fold-wrapper fade-in">
        {onBack && (
          <button className="back-btn" onClick={onBack} aria-label={copy.back}>
            ←
          </button>
        )}

        <div className="fold-stage">
          {showVideo && (
            <div className="fold-video">
              <div className="video-overlay">
                <button
                  className="skip-btn"
                  onClick={() => {
                    if (onUnlockAudio) onUnlockAudio();
                    onNext();
                  }}
                  aria-label={copy.skipAria}
                >
                  {copy.skip}
                </button>
                <video ref={videoRef} className="intro-video" muted playsInline>
                  <source src={`${import.meta.env.BASE_URL}wedding-intro.mp4`} type="video/mp4" />
                </video>
              </div>
            </div>
          )}

          <div className={`fold-card invitation-cover ${opened ? "open" : ""} ${pearlLift ? "touch-opening" : ""}`} style={{ "--cover-url": `url(${coverUrl})` }}>
            <div className="fold-left" />
            <div className="fold-right" />
            {!opened && (
              <>
                <div className="cover-logo" aria-hidden={false} style={{ pointerEvents: "auto" }}>
                  <img
                    src={logoSrc}
                    alt={copy.logoAlt}
                    loading="eager"
                    decoding="async"
                    draggable={false}
                    onError={() => setLogoSrc(logoFallbackUrl)}
                  />
                </div>

                {coverStatus === "missing" && (
                  <div className="cover-invitation-mark" aria-hidden>
                    <span className="invitation-flourish top" aria-hidden>
                      <svg viewBox="0 0 64 18" width="64" height="18" focusable="false" aria-hidden="true">
                        <path d="M3 9c10-7 16 7 26 0s16 7 26 0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <path d="M18 9c2-3 6-3 8 0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <path d="M38 9c2-3 6-3 8 0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </span>
                    <span className="invitation-text">{copy.invitation}</span>
                    <span className="invitation-flourish bottom" aria-hidden>
                      <svg viewBox="0 0 64 18" width="64" height="18" focusable="false" aria-hidden="true">
                        <path d="M3 9c10-7 16 7 26 0s16 7 26 0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <path d="M18 9c2-3 6-3 8 0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <path d="M38 9c2-3 6-3 8 0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </span>
                  </div>
                )}

                <button
                  type="button"
                  className="cover-pearl"
                  aria-label={copy.openInvitation}
                  disabled={isOpening}
                  onPointerDown={(e) => {
                    if (isOpening) return;

                    if (e.pointerType && e.pointerType !== "mouse") {
                      handleTouchOpen(e);
                      return;
                    }

                    dragRef.current = { startX: e.clientX, startY: e.clientY, moved: false, triggered: false, id: e.pointerId };
                    try {
                      e.currentTarget.setPointerCapture(e.pointerId);
                    } catch {}
                  }}
                  onPointerMove={(e) => {
                    const d = dragRef.current;
                    if (!d || d.id !== e.pointerId) return;
                    const dx = e.clientX - d.startX;
                    const dy = e.clientY - d.startY;
                    if (!d.moved && Math.hypot(dx, dy) > 20) d.moved = true;
                  }}
                  onPointerUp={(e) => {
                    const d = dragRef.current || {};
                    if (d.id === e.pointerId) {
                      const dx = e.clientX - (d.startX || 0);
                      const dy = e.clientY - (d.startY || 0);
                      try {
                        e.currentTarget.releasePointerCapture(e.pointerId);
                      } catch {}
                      // If user dragged beyond threshold, treat as open gesture
                      if (Math.hypot(dx, dy) > 30) {
                        d.triggered = true;
                        handleOpen();
                      }
                    }
                    // clear after short delay
                    setTimeout(() => (dragRef.current = {}), 10);
                  }}
                  onPointerCancel={() => {
                    dragRef.current = {};
                  }}
                  onClick={(e) => {
                    // if a drag already triggered open, suppress click handling
                    if (dragRef.current && dragRef.current.triggered) {
                      dragRef.current.triggered = false;
                      return;
                    }

                    if (opened || pearlLift) return;
                    handleOpen();
                  }}
                >
                  <span className="pearl-core" aria-hidden />
                  <span className="touch-here" aria-hidden>
                    👆
                  </span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}