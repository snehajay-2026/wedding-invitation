import { useState, useEffect } from "react";
import Petals from "./petals";
import swastikSrc from "../assets/swastik.png";
import Countdown from "./Countdown";

export default function CouplePage({ onNext, onBack, muted, setMuted, lang = "mr" }) {
  const BASE_URL = import.meta.env.BASE_URL;
  const [groomImgError, setGroomImgError] = useState(false);
  const [brideImgError, setBrideImgError] = useState(false);
  const [swatikImgError, setSwatikImgError] = useState(false);

  // background candidates (place image in public/assets/)
  const bgCandidates = [
    `${BASE_URL}assets/couple-bg.jpg`,
    `${BASE_URL}assets/couple-bg.jpeg`,
    `${BASE_URL}assets/couple-bg.png`,
    `${BASE_URL}assets/couple-bg.webp`,
  ];
  const [bgSrc, setBgSrc] = useState(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      for (const u of bgCandidates) {
        const ok = await new Promise((res) => {
          const img = new Image();
          img.onload = () => res(true);
          img.onerror = () => res(false);
          img.src = u;
        });
        if (ok && alive) {
          console.debug("CouplePage: found background:", u);
          setBgSrc(u);
          break;
        }
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // Try common filename variants so uploaded pics are preferred.
  const groomCandidates = [`${BASE_URL}avatars/groom.jpg`, `${BASE_URL}avatars/groom.jpeg`, `${BASE_URL}avatars/groom.png`];
  const brideCandidates = [`${BASE_URL}avatars/bride.jpg`, `${BASE_URL}avatars/bride.jpeg`, `${BASE_URL}avatars/bride.png`];
  const [groomIndex, setGroomIndex] = useState(0);
  const [brideIndex, setBrideIndex] = useState(0);
  const groomSrc = groomCandidates[groomIndex] || groomCandidates[0];
  const brideSrc = brideCandidates[brideIndex] || brideCandidates[0];
  const copy = {
    mr: {
      audioOn: "शहनाई सुरू करा",
      audioOff: "शहनाई बंद करा",
      heading: "शुभ विवाह",
      subtitle: "आपल्या सर्वांच्या शुभ आशीर्वादाने",
      groomRole: "🤵 वर",
      brideRole: "👰 वधू",
	      groomHonorific: "चि.",
	      brideHonorific: "चि. सौ. का.",
	      groomName: "अजय",
	      brideName: "डॉ.  स्नेहा",
      groomParents: "सौ. विमल व श्री. पोपट तुकाराम कोडग यांचे सुपुत्र.",
      brideParents: "सौ. संगीता व श्री. शिवाजी व्यंकटराव भोसले यांची सुकन्या.",
      groomPhoto: "वराचा फोटो",
      bridePhoto: "वधूचा फोटो",
      coupleIllustration: "वधू-वर चित्र",
      swastik: "स्वस्तिक चिन्ह",
      back: "मागे जा",
      next: "पुढे जा",
    },
    en: {
      audioOn: "Unmute shehnai",
      audioOff: "Mute shehnai",
      heading: "Wedding Ceremony",
      subtitle: "With the blessings of all our loved ones",
      groomRole: "🤵 Groom",
      brideRole: "👰 Bride",
	      groomHonorific: "Mr.",
	      brideHonorific: "Miss",
	      groomName: "Ajay",
        brideName: "Sneha",
      groomParents: "Beloved son of Mrs. Vimal and Mr. Popat Tukaram Kodag.",
      brideParents: "Beloved daughter of Mrs. Sangeeta and Mr. Shivaji Vyankatrao Bhosale.",
      groomPhoto: "Groom photo",
      bridePhoto: "Bride photo",
      coupleIllustration: "Couple illustration",
      swastik: "Swastik emblem",
      back: "Go back",
      next: "Next",
    },
  }[lang];

  function toggleMute() {
    setMuted((m) => !m);
  }

  return (
    <div
      className="card couple-card fade-in"
      data-bg={bgSrc || ""}
      style={{ position: "relative", "--couple-bg": bgSrc ? `url(${bgSrc})` : "none" }}
    >
      <button
        className={`audio-control ${muted ? "muted" : "playing"}`}
        onClick={toggleMute}
        aria-pressed={muted}
        aria-label={muted ? copy.audioOn : copy.audioOff}
      >
        {muted ? "🔇" : "🔊"}
      </button>
      <Petals />
      {/* Marathi garland / toran (decorative floral string) */}
      <div className="garland" aria-hidden>
        <svg viewBox="0 0 800 80" preserveAspectRatio="none" role="img" aria-hidden>
          <g fill="none" stroke="#9b6b3e" strokeWidth="2">
            <path d="M10,40 Q120,10 240,40 T490,40 T740,40" strokeLinecap="round"/>
          </g>
          {/* marigold beads */}
          <g fill="#f59e0b">
            <circle cx="40" cy="44" r="8"/>
            <circle cx="120" cy="32" r="10"/>
            <circle cx="200" cy="44" r="9"/>
            <circle cx="320" cy="28" r="10"/>
            <circle cx="440" cy="44" r="9"/>
            <circle cx="560" cy="32" r="10"/>
            <circle cx="680" cy="44" r="8"/>
          </g>
        </svg>
      </div>

      <div className="couple-header">
        <div className="couple-header-left">
          <h1 className="marathi-heading">
            <img
              src={`${BASE_URL}assets/couple.png`}
              alt={copy.coupleIllustration}
              className="header-couple"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <span>{copy.heading}</span>
          </h1>
          <p className="subtitle">{copy.subtitle}</p>
        </div>
        <div className="couple-year">✨ 2026</div>
      </div>

      <Countdown lang={lang} />

      <div className="couple-grid enhanced">
        <div className="couple-column groom enter-left">
          <div className="couple-avatar floating" aria-hidden>
            {!groomImgError ? (
              <img
                className="couple-img"
                src={groomSrc}
                alt={copy.groomPhoto}
                onError={() => {
                  const next = groomIndex + 1;
                  if (next < groomCandidates.length) setGroomIndex(next);
                  else setGroomImgError(true);
                }}
              />
            ) : (
              <span aria-label="Groom initial">अ</span>
            )}
          </div>
          <div className="role">{copy.groomRole}</div>
          <span className="honorific">{copy.groomHonorific}</span>
          <h2 className="name gradient-name">{copy.groomName}</h2>
          <p className="parents">{copy.groomParents}</p>
        </div>

        <div className="couple-center" aria-hidden>
          <div className="heart pulse" aria-hidden>❤</div>
          <div className="swatik" aria-hidden>
            {!swatikImgError ? (
              <img
                src={swastikSrc}
                alt={copy.swastik}
                className="swatik-img"
                onError={() => setSwatikImgError(true)}
              />
            ) : (
              <svg viewBox="0 0 24 24" width="36" height="36" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round">
                {/* decorative swatik fallback */}
                <path d="M3 8h4v2H6v2H3V8z" />
                <path d="M17 3h4v4h-2V6h-2V3z" />
                <path d="M3 14h2v2h2v2H3v-4z" />
                <path d="M19 14h2v6h-6v-2h4v-4z" />
              </svg>
            )}
          </div>
        </div>

        <div className="couple-column bride enter-right">
          <div className="couple-avatar floating" aria-hidden>
            {!brideImgError ? (
              <img
                className="couple-img"
                src={brideSrc}
                alt={copy.bridePhoto}
                onError={() => {
                  const next = brideIndex + 1;
                  if (next < brideCandidates.length) setBrideIndex(next);
                  else setBrideImgError(true);
                }}
              />
            ) : (
              <span aria-label="Bride initial">स</span>
            )}
          </div>
          <div className="role">{copy.brideRole}</div>
          <span className="honorific">{copy.brideHonorific}</span>
          <h2 className="name gradient-name">{copy.brideName}</h2>
          <p className="parents">{copy.brideParents}</p>
        </div>
      </div>

      <div className="nav-row" aria-hidden={false}>
        {onBack ? (
          <button className="nav-btn back-btn" onClick={onBack} aria-label={copy.back}>←</button>
        ) : (
          <div />
        )}
        <div />
        {onNext ? (
          <button className="nav-btn forward-btn" onClick={onNext} aria-label={copy.next}>→</button>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
