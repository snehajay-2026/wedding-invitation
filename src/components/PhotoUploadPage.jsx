import { useEffect, useState } from "react";
import "./PhotoUploadPage.css";

export default function PhotoUploadPage({ onBack, onNext, lang = "mr" }) {
  const copy = {
    mr: {
      heading: "📸 आठवणी जतन करा",
      desc: "कृपया लग्नातील सुंदर क्षण येथे अपलोड करा 🙏",
      upload: "📷 फोटो अपलोड करा",
      preview: "निवडलेल्या फाईलची झलक:",
      continue: "अपलोड सुरू ठेवा",
      cancel: "रद्द करा",
      loading: "लोड करत आहे...",
      error: "गणना मिळाली नाही",
      uploadCountSuffix: "लोकांनी फोटो अपलोड केले",
      liveUploaded: "यांनी आत्ताच फोटो अपलोड केले",
      guestTitle: "📷 फोटो अपलोड केलेले पाहुणे",
      unknown: "अज्ञात",
      photos: "फोटो",
    },
    en: {
      heading: "📸 Save the memories",
      desc: "Please upload beautiful wedding moments here 🙏",
      upload: "📷 Upload Photos",
      preview: "Preview of selected file:",
      continue: "Continue to upload",
      cancel: "Cancel",
      loading: "Loading...",
      error: "Could not load count",
      uploadCountSuffix: "guests uploaded photos",
      liveUploaded: "just uploaded photos",
      guestTitle: "📷 Guests who uploaded photos",
      unknown: "Unknown",
      photos: "photos",
    },
  }[lang];
  const backLabel = lang === "mr" ? "Back" : "Go back";
  const nextLabel = lang === "mr" ? "Wedding Wall" : "Open Wedding Wall";

  const [uploadCount, setUploadCount] = useState(0);
  const [guests, setGuests] = useState([]);
  const [lastGuest, setLastGuest] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pulse, setPulse] = useState(false);

  const [pendingPreview, setPendingPreview] = useState(null);

  const API =
    "https://script.google.com/macros/s/AKfycbzk2xxBI2TFf0GuyP6jIkn2tez4_qntL4yH6VSCF1vcR3PhEO4Hw7DEwgz5KRAih5WMKw/exec";

  const FORM_URL =
    "https://forms.gle/F7yPTgurcQNhdxKX7";


  async function loadUploadData(signal) {

    try {

      const res = await fetch(API, { signal });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();

      if (typeof data.uploads === "number") {

        setUploadCount(data.uploads);
        setError(null);

        const newGuests = data.guests || [];

        if (newGuests.length > guests.length) {
          const latest = newGuests[newGuests.length - 1];
          setLastGuest(latest.name);
        }

        setGuests(newGuests);

      } else {

        throw new Error("Invalid API response");

      }

    } catch (err) {

      if (err.name !== "AbortError") {

        console.error(err);
        setError(copy.error);

      }

    } finally {

      setLoading(false);

    }

  }


  useEffect(() => {

    const controller = new AbortController();

    loadUploadData(controller.signal);

    const interval = setInterval(() => {

      const c = new AbortController();
      loadUploadData(c.signal);

    }, 10000);

    const handleFocus = () => {

      const c = new AbortController();
      loadUploadData(c.signal);

    };

    window.addEventListener("focus", handleFocus);

    return () => {

      controller.abort();
      clearInterval(interval);
      window.removeEventListener("focus", handleFocus);

    };

  }, [lang]);


  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("pendingUploadPreview");
      if (raw) {
        const obj = JSON.parse(raw);
        if (obj && obj.dataUrl) setPendingPreview(obj);
      }
    } catch {}
  }, []);


  useEffect(() => {

    if (!loading && !error) {

      setPulse(true);

      const t = setTimeout(() => setPulse(false), 700);

      return () => clearTimeout(t);

    }

  }, [uploadCount, loading, error]);


  return (

    <div className="card upload-page upload-card fade-in">

      {onBack && (
        <button className="nav-btn back-btn icon-tooltip" data-tooltip="Back" onClick={onBack}>
          ←
        </button>
      )}

      <h1>{copy.heading}</h1>

      <p className="upload-desc">
        {copy.desc}
      </p>

      <a
        href={FORM_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="upload-btn-large"
      >
        {copy.upload}
      </a>

      {pendingPreview && (
        <div className="preview-panel">
          <div className="preview-title">{copy.preview}</div>

          <img
            src={pendingPreview.dataUrl}
            alt={pendingPreview.name || "preview"}
            className="preview-image"
          />
          <div className="preview-actions">

            <button
              className="preview-btn"
              onClick={() => {
                sessionStorage.removeItem("pendingUploadPreview");
                window.open(FORM_URL, "_blank", "noopener");
              }}
            >
              {copy.continue}
            </button>

            <button
              className="preview-btn preview-btn-secondary"
              onClick={() => {
                sessionStorage.removeItem("pendingUploadPreview");
                setPendingPreview(null);
              }}
            >
              {copy.cancel}
            </button>
          </div>
        </div>
      )}
      <div className="upload-count">

        {loading && copy.loading}

        {!loading && error && (
          <>⚠️ {error}</>
        )}

        {!loading && !error && (
          <>
            📊 <strong className={`count-number ${pulse ? "pop" : ""}`}>
              {uploadCount}
            </strong> {copy.uploadCountSuffix}
          </>
        )}

      </div>
      {lastGuest && (
        <div className="live-upload">
          <div className="live-dot" />
          <div className="live-text">{lastGuest} {copy.liveUploaded}</div>
        </div>
      )}

      {guests.length > 0 && (

        <div className="guest-list">

          <h3>{copy.guestTitle}</h3>

          <div className="guest-grid">
            {guests.map((g, i) => {
              const name = g.name || copy.unknown;
              const initials = name
                .split(" ")
                .map((s) => s[0])
                .join("")
                .slice(0, 2)
                .toUpperCase();

              return (
                <div className="guest-card" key={i}>
                  <div className="avatar">{initials}</div>
                  <div className="guest-meta">
                    <div className="guest-name">{name}</div>
                    <div className="guest-count">{g.count} {copy.photos}</div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      )}

      {(onBack || onNext) && (
        <div className="nav-row">
          {onBack ? (
            <button className="nav-btn back-btn icon-tooltip" data-tooltip="Back" onClick={onBack} aria-label={backLabel}>
              {"\u2190"}
            </button>
          ) : (
            <div />
          )}
          <div />
          {onNext ? (
            <button className="nav-btn forward-btn icon-tooltip" data-tooltip="Next" onClick={onNext} aria-label={nextLabel}>
              {"\u2192"}
            </button>
          ) : (
            <div />
          )}
        </div>
      )}

    </div>

  );

}
