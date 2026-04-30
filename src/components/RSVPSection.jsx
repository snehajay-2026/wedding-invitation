export default function RSVPSection({ onBack, onNext, muted, setMuted, lang = "mr" }) {
  const copy = {
    mr: {
      unmute: "शहनाई सुरू करा",
      mute: "शहनाई बंद करा",
      heading: "💌 आपले मनःपूर्वक स्वागत",
      lines: [
        "आमच्या प्रेमाच्या सुंदर प्रवासाची",
        "नव्या अध्यायाला सुरुवात करत आहोत… 💍",
        "आपल्या उपस्थितीने आमचा आनंद द्विगुणित करा.",
      ],
      sign: "— स्नेजय (SneJay) ❤️",
      back: "मागे जा",
      next: "पुढे जा",
    },
    en: {
      unmute: "Unmute shehnai",
      mute: "Mute shehnai",
      heading: "💌 A heartfelt welcome to you",
      lines: [
        "We are beginning a beautiful new chapter",
        "in our journey of love… 💍",
        "Your presence will make our joy even more special.",
      ],
      sign: "— SneJay ❤️",
      back: "Go back",
      next: "Go forward",
    },
  }[lang];

  function toggleMute() {
    if (setMuted) setMuted((m) => !m);
  }

  return (
    <div className="card fade-in rsvp-card">
      {typeof muted === "boolean" && setMuted && (
        <button
          className={`audio-control ${muted ? "muted" : "playing"}`}
          onClick={toggleMute}
          aria-pressed={muted}
          aria-label={muted ? copy.unmute : copy.mute}
        >
          {muted ? "🔇" : "🔊"}
        </button>
      )}

      <h1 className="rsvp-heading">{copy.heading}</h1>

      <div className="rsvp-blessing" role="heading" aria-level={1}>
        {copy.lines.map((line) => (
          <p key={line}>{line}</p>
        ))}
        <p className="rsvp-sign">{copy.sign}</p>
      </div>

      {onBack && (
        <div className="nav-row" aria-hidden={false}>
          <button className="nav-btn back-btn" onClick={onBack} aria-label={copy.back}>
            ←
          </button>
          <div />
          {onNext ? (
            <button className="nav-btn forward-btn" onClick={onNext} aria-label={copy.next}>
              →
            </button>
          ) : (
            <div />
          )}
        </div>
      )}
    </div>
  );
}