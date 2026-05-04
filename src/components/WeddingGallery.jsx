import { useEffect, useMemo, useState } from "react";
import "./WeddingGallery.css";

export default function WeddingGallery({ onBack, onHome, lang = "mr" }) {
  const copy = {
    mr: {
      heading: "📸 Wedding Memory Wall",
      sub: "आपल्या सुंदर आठवणी येथे पाहा 💖",
      loading: "लोड करत आहे...",
      loadError: "फोटो लोड झाले नाहीत",
      empty: "अद्याप फोटो नाहीत — कृपया अपलोड करा",
      prev: "← मागील",
      next: "पुढे →",
      page: "पृष्ठ",
      of: "पैकी",
      manualRefresh: "मॅन्युअल रीफ्रेश",
      autoRefresh: "ऑटो रीफ्रेश",
      largeAlt: "मोठा फोटो",
      photoMissing: "फोटो उपलब्ध नाही",
      photoFailed: "फोटो लोड झाला नाही",
      memoryAlt: "लग्नातील आठवण",
      unavailable: "फोटो उपलब्ध नाहीत",
	      featuredTitle: "✨ Featured Uploads",
	      featuredSub: "सर्वात आवडत्या आणि खास आठवणी येथे झळकत आहेत",
	      featuredTag: "Featured",
	      newTag: "नवीन",
	      like: "लाईक",
	      liked: "लाईक काढा",
	      favorite: "आवडते ठेवा",
	      favorited: "आवडते काढा",
	      likes: "लाईक्स",
    },
    en: {
      heading: "📸 Wedding Memory Wall",
      sub: "See your beautiful memories here 💖",
      loading: "Loading...",
      loadError: "Photos could not be loaded",
      empty: "No photos yet — please upload",
      prev: "← Prev",
      next: "Next →",
      page: "Page",
      of: "of",
      manualRefresh: "Manual Refresh",
      autoRefresh: "Auto Refresh",
      largeAlt: "Wedding memory large",
      photoMissing: "Photo unavailable",
      photoFailed: "Photo failed to load",
      memoryAlt: "Wedding Memory",
      unavailable: "Photos are unavailable",
	      featuredTitle: "✨ Featured Uploads",
	      featuredSub: "Most loved and handpicked memories shine here",
	      featuredTag: "Featured",
	      newTag: "New",
	      like: "Like photo",
	      liked: "Unlike photo",
	      favorite: "Add favorite",
	      favorited: "Remove favorite",
	      likes: "likes",
    },
  }[lang];
  const homeLabel = lang === "mr" ? "Go to start page" : "Go to start page";

	const STORAGE_KEYS = {
		likes: "wedding-gallery-like-counts",
		liked: "wedding-gallery-liked-photos",
		favorites: "wedding-gallery-favorite-photos",
	};

  const [photos, setPhotos] = useState([]);
  const [highlighted, setHighlighted] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorKey, setErrorKey] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [autoInterval, setAutoInterval] = useState(30);
  const [viewer, setViewer] = useState(null);
  const [isMobileView, setIsMobileView] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth <= 620 : false
  );
  const [currentPage, setCurrentPage] = useState(1);
	const [likeCounts, setLikeCounts] = useState({});
	const [likedPhotos, setLikedPhotos] = useState({});
	const [favoritePhotos, setFavoritePhotos] = useState({});

  const API =
    "https://script.google.com/macros/s/AKfycbwaj-nf2YAC7KqnvSDa5M_B5YzBT0I0fMb_kkf5XyqANr9-CSYoAWFY7dRXwMCcSJ5tPQ/exec";


  async function loadPhotos(signal) {

    try {

      const res = await fetch(API, {
        signal,
        cache: "no-store"
      });

      if (!res.ok) throw new Error(`Network ${res.status}`);

      const data = await res.json();

      if (Array.isArray(data.photos)) {

        // newest first
        const list = data.photos.reverse();

        setPhotos((prev) => {
          // merge new list while avoiding duplicates (preserve newest-first)
          const merged = [...list.filter((p) => !prev.includes(p)), ...prev];
          return merged;
        });

        setErrorKey(null);

      } else {

        setPhotos([]);
        setErrorKey("unavailable");

      }

    } catch (err) {

      if (err.name !== "AbortError") {

        console.error(err);
        setErrorKey("loadError");
        setPhotos([]);

      }

    } finally {

      setLoading(false);

    }

  }


  useEffect(() => {

    function handleResize() {
      setIsMobileView(window.innerWidth <= 620);
    }

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);

  }, [lang]);

  useEffect(() => {
    try {
      const storedCounts = JSON.parse(localStorage.getItem(STORAGE_KEYS.likes) || "{}");
      const storedLiked = JSON.parse(localStorage.getItem(STORAGE_KEYS.liked) || "{}");
      const storedFavorites = JSON.parse(localStorage.getItem(STORAGE_KEYS.favorites) || "{}");
      setLikeCounts(storedCounts && typeof storedCounts === "object" ? storedCounts : {});
      setLikedPhotos(storedLiked && typeof storedLiked === "object" ? storedLiked : {});
      setFavoritePhotos(storedFavorites && typeof storedFavorites === "object" ? storedFavorites : {});
    } catch {
      setLikeCounts({});
      setLikedPhotos({});
      setFavoritePhotos({});
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.likes, JSON.stringify(likeCounts));
      localStorage.setItem(STORAGE_KEYS.liked, JSON.stringify(likedPhotos));
      localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify(favoritePhotos));
    } catch {}
  }, [favoritePhotos, likeCounts, likedPhotos]);

  useEffect(() => {

    const controller = new AbortController();

    loadPhotos(controller.signal);

    return () => controller.abort();

  }, []);

  const photosPerPage = isMobileView ? 8 : 12;
  const totalPages = Math.max(1, Math.ceil(photos.length / photosPerPage));

  useEffect(() => {
    setCurrentPage((prev) => Math.min(prev, totalPages));
  }, [totalPages]);

  const paginatedPhotos = useMemo(() => {
    const start = (currentPage - 1) * photosPerPage;
    return photos.slice(start, start + photosPerPage);
  }, [photos, currentPage, photosPerPage]);

  const visiblePageNumbers = useMemo(() => {
    const pages = [];
    const start = Math.max(1, currentPage - 1);
    const end = Math.min(totalPages, start + 2);

    for (let page = Math.max(1, end - 2); page <= end; page += 1) {
      pages.push(page);
    }

    return pages;
  }, [currentPage, totalPages]);


  useEffect(() => {

    if (!autoRefresh) return;

    const id = setInterval(() => {

      const controller = new AbortController();

      loadPhotos(controller.signal);

    }, autoInterval * 1000);

    return () => clearInterval(id);

  }, [autoRefresh, autoInterval]);


  // WebSocket real-time updates with automatic reconnection
  useEffect(() => {
    const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:4000";
    let ws = null;
    let reconnect = null;

    function start() {
      ws = new WebSocket(WS_URL);

      ws.addEventListener("open", () => console.log("Gallery WS open"));

      ws.addEventListener("message", (ev) => {
        try {
          const msg = JSON.parse(ev.data);
          if (msg?.type === "new_photo" && msg.url) {
            setPhotos((prev) => {
              if (prev.includes(msg.url)) return prev;
              return [msg.url, ...prev];
            });

            setHighlighted((h) => [msg.url, ...h].slice(0, 30));

            setTimeout(() => {
              setHighlighted((h) => h.filter((u) => u !== msg.url));
            }, 3500);
          }
        } catch (e) {
          console.error("Invalid WS message", e);
        }
      });

      ws.addEventListener("close", () => {
        console.log("Gallery WS closed, reconnecting...");
        reconnect = setTimeout(start, 3000);
      });

      ws.addEventListener("error", (err) => {
        console.error("Gallery WS error", err);
        ws.close();
      });
    }

    start();

    return () => {
      if (reconnect) clearTimeout(reconnect);
      if (ws) ws.close();
    };
  }, []);

  function toggleLike(photo) {
    setLikedPhotos((prev) => {
      const alreadyLiked = Boolean(prev[photo]);
      setLikeCounts((counts) => ({
        ...counts,
        [photo]: Math.max(0, (counts[photo] || 0) + (alreadyLiked ? -1 : 1)),
      }));

      if (alreadyLiked) {
        const next = { ...prev };
        delete next[photo];
        return next;
      }

      return { ...prev, [photo]: true };
    });
  }

  function toggleFavorite(photo) {
    setFavoritePhotos((prev) => {
      if (prev[photo]) {
        const next = { ...prev };
        delete next[photo];
        return next;
      }

      return { ...prev, [photo]: true };
    });
  }


  return (

    <div className="card gallery-page gallery-card-shell fade-in">

      {onBack && (
        <button className="nav-btn back-btn icon-tooltip" data-tooltip="Back" onClick={onBack}>
          ←
        </button>
      )}

      <h1>{copy.heading}</h1>

      <p className="gallery-sub">
        {copy.sub}
      </p>


      {loading ? (

        <div className="gallery-sub">{copy.loading}</div>

      ) : errorKey ? (

        <div className="gallery-sub">⚠️ {copy[errorKey]}</div>

      ) : photos.length === 0 ? (

        <div className="gallery-sub">
          {copy.empty}
        </div>

      ) : (

        <>
        <div className="masonry-grid">

          {paginatedPhotos.map((photo, index) => (

            <PhotoItem
              key={photo}
              src={photo}
              index={(currentPage - 1) * photosPerPage + index}
              isNew={highlighted.includes(photo)}
          isLiked={Boolean(likedPhotos[photo])}
          isFavorite={Boolean(favoritePhotos[photo])}
          likeCount={likeCounts[photo] || 0}
              copy={copy}
          onToggleLike={() => toggleLike(photo)}
          onToggleFavorite={() => toggleFavorite(photo)}
              onOpen={(url) => setViewer(url)}
            />

          ))}

        </div>
        {totalPages > 1 && (
          <div className="gallery-pagination" aria-label="Wedding wall pagination">
            <button
              className="gallery-page-btn"
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={currentPage === 1}
            >
              {copy.prev}
            </button>

            <div className="gallery-page-list">
              {visiblePageNumbers.map((page) => (
                <button
                  key={page}
                  className={`gallery-page-number${page === currentPage ? " active" : ""}`}
                  onClick={() => setCurrentPage(page)}
                  aria-current={page === currentPage ? "page" : undefined}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              className="gallery-page-btn"
              onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
              disabled={currentPage === totalPages}
            >
              {copy.next}
            </button>
          </div>
        )}
        <div className="gallery-page-status">
          {copy.page} {currentPage} {copy.of} {totalPages}
        </div>
        </>

      )}
      <div className="gallery-toolbar">

        <button
          className="gallery-refresh"
          onClick={() => {
            const controller = new AbortController();
            loadPhotos(controller.signal);
          }}
        >
          {copy.manualRefresh}
        </button>

        <label className="gallery-toggle">

          <input
            type="checkbox"
            checked={autoRefresh}
            onChange={(e) => setAutoRefresh(e.target.checked)}
          />

          {copy.autoRefresh}

        </label>

        {autoRefresh && (

          <select
            className="gallery-select"
            value={autoInterval}
            onChange={(e) => setAutoInterval(Number(e.target.value))}
          >

            <option value={10}>10s</option>
            <option value={30}>30s</option>
            <option value={60}>60s</option>
            <option value={120}>120s</option>
            <option value={300}>300s</option>

          </select>

        )}

      </div>

      {(onBack || onHome) && (
        <div className="nav-row">
          {onBack ? (
            <button className="nav-btn back-btn icon-tooltip" data-tooltip="Back" onClick={onBack}>
              {"\u2190"}
            </button>
          ) : (
            <div />
          )}
          <div />
          {onHome ? (
            <button
              className="nav-btn forward-btn icon-tooltip"
              data-tooltip="Home"
              onClick={onHome}
              aria-label={homeLabel}
            >
              {"\u2302"}
            </button>
          ) : (
            <div />
          )}
        </div>
      )}


      {viewer && (

        <div
          className="photo-viewer"
          onClick={() => setViewer(null)}
        >

          <img
            src={viewer}
            alt={copy.largeAlt}
          />

        </div>

      )}

    </div>

  );

}


function PhotoItem({
  src,
  index,
  onOpen,
  isNew,
  isLiked,
  isFavorite,
  likeCount,
  copy,
  onToggleLike,
  onToggleFavorite,
}) {

  const [failed, setFailed] = useState(false);

  function showHeart(e) {

    const heart = document.createElement("div");

    heart.className = "heart-burst";
    heart.innerHTML = "❤️";

    heart.style.left = e.clientX + "px";
    heart.style.top = e.clientY + "px";

    document.body.appendChild(heart);

    setTimeout(() => heart.remove(), 700);

  }

  function handleDoubleClick(e) {
    showHeart(e);
    if (!isLiked) onToggleLike();
  }


  if (!src) {

    return (
      <div className="gallery-card">
        {copy.photoMissing}
      </div>
    );

  }


  if (failed) {

    return (
      <div className="gallery-card">
        {copy.photoFailed}
      </div>
    );

  }


  return (
  <div className={`gallery-photo-card${isNew ? " incoming" : ""}${isFavorite ? " favorite" : ""}`}>
    <button
    type="button"
    className="gallery-media-btn"
    onClick={() => onOpen(src)}
    onDoubleClick={handleDoubleClick}
    >
    <img
      src={src}
      alt={`${copy.memoryAlt} ${index + 1}`}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className="masonry-img cinematic"
    />
    </button>

    <div className="gallery-photo-flags">
    {isNew && <span className="gallery-flag new">{copy.newTag}</span>}
    {isFavorite && <span className="gallery-flag featured">{copy.featuredTag}</span>}
    </div>

    <div className="gallery-photo-actions">
    <button
      type="button"
      className={`gallery-react-btn like${isLiked ? " active" : ""}`}
      onClick={onToggleLike}
      aria-label={isLiked ? copy.liked : copy.like}
    >
      <span aria-hidden>❤️</span>
      <span>{likeCount}</span>
    </button>

    <button
      type="button"
      className={`gallery-react-btn favorite${isFavorite ? " active" : ""}`}
      onClick={onToggleFavorite}
      aria-label={isFavorite ? copy.favorited : copy.favorite}
    >
      <span aria-hidden>⭐</span>
    </button>
    </div>
  </div>

  );

}
