import { useEffect, useRef, useState } from "react";
import VideoPage from "./components/VideoPage";
import CouplePage from "./components/CouplePage";
import EventsPage from "./components/EventsPage";
import RSVPSection from "./components/RSVPSection";
import PhotoUploadPage from "./components/PhotoUploadPage";
import WeddingGallery from "./components/WeddingGallery";
import "./WeddingInvitation.css";

export default function WeddingInvitation() {

  const [page, setPage] = useState(1);
  const [audioShouldPlay, setAudioShouldPlay] = useState(false);
  const [muted, setMuted] = useState(false);
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const [lang, setLang] = useState("mr");
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "light";

    try {
      const savedTheme = window.localStorage.getItem("wedding-theme");
      if (savedTheme === "dark" || savedTheme === "light") return savedTheme;
    } catch {}

    try {
      return window.matchMedia?.("(prefers-color-scheme: dark)")?.matches ? "dark" : "light";
    } catch {
      return "light";
    }
  });

  const audioRef = useRef(null);
  const wrapperRef = useRef(null);

  function restartShehnai(nextShouldPlay) {

    const aud = audioRef.current;
    if (!aud) return;

    try {
      aud.currentTime = 0;
    } catch {}

    const shouldBeMuted = !nextShouldPlay || muted;

    aud.muted = shouldBeMuted;

    if (shouldBeMuted) {
      try { aud.pause(); } catch {}
      return;
    }

    try {
      const p = aud.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    } catch {}
  }

  function unlockShehnaiAudio() {

    const aud = audioRef.current;

    if (!aud || audioUnlocked) return;

    try {

      aud.volume = 0.75;
      aud.loop = true;
      aud.muted = true;

      const p = aud.play();

      if (p && typeof p.then === "function") {
        p.then(() => setAudioUnlocked(true)).catch(() => setAudioUnlocked(true));
      } else {
        setAudioUnlocked(true);
      }

    } catch {
      setAudioUnlocked(true);
    }
  }

  useEffect(() => {

    const aud = audioRef.current;
    if (!aud) return;

    aud.muted = !audioShouldPlay || muted;

  }, [audioShouldPlay, muted]);

  useEffect(() => {
    if (page === 6) {
      try {
        console.log("Gallery (page 6) is now visible");
      } catch {}
    }
  }, [page]);

  const quickLabels = {
    mr: {
      gallery: "Wedding Wall",
      upload: "Photo Upload",
      langButton: "English",
      langBadge: "भाषा",
      themeBadge: "थीम",
      themeDark: "डार्क मोड",
      themeLight: "लाईट मोड",
    },
    en: {
      gallery: "Wedding Wall",
      upload: "Photo Upload",
      langButton: "मराठी",
      langBadge: "Language",
      themeBadge: "Theme",
      themeDark: "Dark mode",
      themeLight: "Light mode",
    },
  };

  const copy = quickLabels[lang];

  useEffect(() => {
    if (typeof document === "undefined") return;

    document.documentElement.dataset.theme = theme;
    document.body.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;

    try {
      window.localStorage.setItem("wedding-theme", theme);
    } catch {}
  }, [theme]);

  useEffect(() => {
    let frameId = 0;

    const updateScrollEffects = () => {
      frameId = 0;
      document.documentElement.style.setProperty("--scroll-y", `${window.scrollY}px`);
    };

    const onScroll = () => {
      if (frameId) return;
      frameId = window.requestAnimationFrame(updateScrollEffects);
    };

    updateScrollEffects();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frameId) window.cancelAnimationFrame(frameId);
      document.documentElement.style.setProperty("--scroll-y", "0px");
    };
  }, []);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const selector = [
      ".fold-wrapper",
      ".card",
      ".card > h1",
      ".couple-header",
      ".countdown",
      ".couple-column",
      ".countdown-main-card",
      ".digital-card",
      ".event",
      ".reminder-card",
      ".rsvp-heading",
      ".rsvp-blessing",
      ".guest-card",
      ".gallery-toolbar",
      ".gallery-card",
      ".gallery-pagination"
    ].join(", ");

    const elements = Array.from(wrapper.querySelectorAll(selector)).filter(
      (el, index, arr) => arr.indexOf(el) === index && !el.classList.contains("nav-row") && !el.classList.contains("nav-btn")
    );

    if (!elements.length) return;

    const revealClasses = ["reveal-up", "reveal-zoom", "reveal-left", "reveal-right"];

    elements.forEach((el, index) => {
      el.classList.add("scroll-reveal");

      const revealClass = el.matches(".groom, .enter-left")
        ? "reveal-left"
        : el.matches(".bride, .enter-right")
        ? "reveal-right"
        : el.matches(".digital-card, .event, .gallery-card, .guest-card, .couple-column")
        ? "reveal-zoom"
        : "reveal-up";

      revealClasses.forEach((name) => el.classList.remove(name));
      el.classList.add(revealClass);
      el.style.setProperty("--reveal-delay", `${Math.min(index * 0.08, 0.48)}s`);
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.16,
        rootMargin: "0px 0px -10% 0px",
      }
    );

    elements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
      elements.forEach((el) => {
        el.classList.remove("scroll-reveal", "is-visible", ...revealClasses);
        el.style.removeProperty("--reveal-delay");
      });
    };
  }, [page]);

  return (

    <div ref={wrapperRef} className={`page-wrapper page-${page}`} data-lang={lang} data-theme={theme}>

      <div className="lang-switch" role="group" aria-label={`${copy.langBadge} · ${copy.themeBadge}`}>
        <span className="lang-switch-label">{copy.langBadge}</span>
        <button
          type="button"
          className="lang-switch-btn"
          onClick={() => setLang((current) => (current === "mr" ? "en" : "mr"))}
          aria-label={copy.langButton}
        >
          {copy.langButton}
        </button>
        <button
          type="button"
          className="theme-switch-btn"
          onClick={() => setTheme((current) => (current === "dark" ? "light" : "dark"))}
          aria-label={theme === "dark" ? copy.themeLight : copy.themeDark}
          title={theme === "dark" ? copy.themeLight : copy.themeDark}
        >
          {theme === "dark" ? "☀️" : "🌙"}
        </button>
      </div>

      {/* Background Shehnai Audio */}

      <audio ref={audioRef} preload="auto" loop playsInline>
        <source src={`${import.meta.env.BASE_URL}shehnai.mp3`} type="audio/mpeg" />
      </audio>


      {/* Gallery Quick Button (only on first page) */}

      {page === 1 && (
        <div className="quick-actions">
          <div className="quick-actions-row">
            <button
              className="nav-btn icon-tooltip quick-action-btn"
              data-tooltip={copy.gallery}
              onClick={() => {
                setPage(6);
                setAudioShouldPlay(false);
                restartShehnai(false);
              }}
              aria-label="Open gallery"
            >
              📸
            </button>

            <button
              className="nav-btn icon-tooltip quick-action-btn"
              data-tooltip={copy.upload}
              onClick={() => {
                setPage(5);
                setAudioShouldPlay(false);
                restartShehnai(false);
              }}
              aria-label="Open photo upload"
            >
              📤
            </button>
          </div>
        </div>
      )}


      {/* PAGE 1 — Video Intro */}

      {page === 1 && (

        <VideoPage
          lang={lang}
          onUnlockAudio={unlockShehnaiAudio}
          onNext={() => {
            setPage(2);
            setAudioShouldPlay(true);
            restartShehnai(true);
          }}
          onOpenUpload={() => {
            setPage(5);
            setAudioShouldPlay(false);
            restartShehnai(false);
          }}
        />

      )}


      {/* PAGE 2 — Couple Details */}

      {page === 2 && (

        <CouplePage
          lang={lang}
          onNext={() => setPage(3)}
          onBack={() => {
            setPage(1);
            setAudioShouldPlay(false);
            restartShehnai(false);
          }}
          muted={muted}
          setMuted={setMuted}
        />

      )}


      {/* PAGE 3 — Events */}

      {page === 3 && (

        <EventsPage
          lang={lang}
          onNext={() => setPage(4)}
          onBack={() => {
            setPage(2);
            restartShehnai(true);
          }}
          muted={muted}
          setMuted={setMuted}
        />

      )}


      {/* PAGE 4 — RSVP */}

      {page === 4 && (

        <RSVPSection
          lang={lang}
          onBack={() => setPage(3)}
          onNext={() => setPage(5)}
          muted={muted}
          setMuted={setMuted}
        />

      )}


      {/* PAGE 5 — Photo Upload */}

      {page === 5 && (

        <PhotoUploadPage
          lang={lang}
          onBack={() => {
            setPage(4);
            restartShehnai(true);
          }}
        />

      )}


      {/* PAGE 6 — Wedding Memory Wall */}

      {page === 6 && (

        <WeddingGallery
          key={`gallery-${lang}`}
          lang={lang}
          onBack={() => {
            setPage(5);
            restartShehnai(true);
          }}
        />

      )}

    </div>

  );
}