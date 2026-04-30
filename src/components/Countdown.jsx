import { useEffect, useState } from "react";

export default function Countdown({ lang = "mr" }) {
  const weddingDate = new Date("2026-05-06T10:45:00+05:30");
  const lunchStartDate = new Date("2026-05-06T13:00:00+05:30");
  const ceremonyEndDate = new Date("2026-05-06T14:30:00+05:30");
  const confettiPieces = Array.from({ length: 16 }, (_, index) => index + 1);
  const copy = {
    mr: {
      badge: "💍 Celebration",
      married: "We are married",
      marriedSub: "🎉 आज आमचा शुभ विवाह संपन्न झाला 🎉",
      heading: "⏳ विवाह मुहूर्तास अजून",
      liveBadge: "🎊 Wedding Day Live",
      liveTitle: "आज आमचा शुभ विवाह दिन",
      liveSub: "आनंदाच्या क्षणांसाठी आता अंतिम उलटगणना सुरू आहे 💖",
      liveHeading: "⏳ सोहळ्याची उत्सवी उलटगणना",
      startingBadge: "🟠 Ceremony Starting",
      startingTitle: "विवाह सोहळा सुरू होण्याच्या तयारीत",
      startingSub: "आताच्या क्षणात मंगलमय सोहळ्याची सुंदर सुरुवात होणार आहे ✨",
      startedBadge: "🔴 Ceremony Started",
      startedTitle: "विवाह सोहळा सुरू झाला आहे",
      startedSub: "मंगलाष्टक, आशीर्वाद आणि आनंदसोहळा आता सुरू आहे ✨",
      lunchBadge: "🍽️ Lunch Live",
      lunchTitle: "भोजन समारंभ सुरू आहे",
      lunchSub: "आनंदसोहळ्यासोबत प्रेमळ भोजनाचा आस्वाद सुरू आहे 💛",
      statusNow: "आत्ता",
      statusNext: "पुढे",
      statusDone: "पूर्ण",
      statusStarting: "सोहळा सुरू होणार",
      statusCeremony: "विवाह सुरू",
      statusLunch: "भोजन सुरू",
      statusMarried: "विवाह संपन्न",
      days: "दिवस",
      hours: "तास",
      minutes: "मिनिटे",
      seconds: "सेकंद",
    },
    en: {
      badge: "💍 Celebration",
      married: "We are married",
      marriedSub: "🎉 Our wedding ceremony has been joyfully completed 🎉",
      heading: "⏳ Time left for the wedding ceremony",
      liveBadge: "🎊 Wedding Day Live",
      liveTitle: "Today is our wedding day",
      liveSub: "The final festive countdown to our special moment is on 💖",
      liveHeading: "⏳ Celebration countdown is live",
      startingBadge: "🟠 Ceremony Starting",
      startingTitle: "The ceremony is about to begin",
      startingSub: "The beautiful wedding celebration is about to start any moment ✨",
      startedBadge: "🔴 Ceremony Started",
      startedTitle: "The wedding ceremony has started",
      startedSub: "Blessings, vows and celebration are happening right now ✨",
      lunchBadge: "🍽️ Lunch Live",
      lunchTitle: "Lunch is now being served",
      lunchSub: "Guests are now enjoying the wedding lunch and celebration 💛",
      statusNow: "Now",
      statusNext: "Next",
      statusDone: "Done",
      statusStarting: "Starting",
      statusCeremony: "Ceremony",
      statusLunch: "Lunch",
      statusMarried: "Married",
      days: "Days",
      hours: "Hours",
      minutes: "Minutes",
      seconds: "Seconds",
    },
  }[lang];

  const twoDigits = (value) => String(value).padStart(2, "0");

  const isWeddingDayIST = () => {
    try {
      // en-CA gives YYYY-MM-DD format
      const todayIST = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(new Date());
      return todayIST === "2026-05-06";
    } catch {
      // Fallback: local date comparison (less accurate if viewer isn't in IST)
      const now = new Date();
      return (
        now.getFullYear() === 2026 &&
        now.getMonth() === 4 &&
        now.getDate() === 6
      );
    }
  };

  const calculateTimeLeft = (targetDate) => {
    const now = new Date();
    const difference = targetDate - now;

    if (difference <= 0) {
      return null;
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  const [currentTime, setCurrentTime] = useState(() => new Date());
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(weddingDate));

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      setTimeLeft(calculateTimeLeft(weddingDate));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const weddingDay = isWeddingDayIST();
  const isBeforeCeremony = currentTime < weddingDate;
  const ceremonyStarted = currentTime >= weddingDate && currentTime < lunchStartDate;
  const lunchLive = currentTime >= lunchStartDate && currentTime < ceremonyEndDate;
  const ceremonyCompleted = currentTime >= ceremonyEndDate;
  const liveMode = weddingDay && isBeforeCeremony;
  const currentPhase = ceremonyCompleted
    ? "married"
    : lunchLive
    ? "lunch"
    : ceremonyStarted
    ? "ceremony"
    : weddingDay
    ? "starting"
    : "countdown";

  const statusItems = ceremonyCompleted
    ? [
        { label: copy.statusStarting, state: "done" },
        { label: copy.statusCeremony, state: "done" },
        { label: copy.statusLunch, state: "done" },
        { label: copy.statusMarried, state: "now" },
      ]
    : lunchLive
    ? [
        { label: copy.statusStarting, state: "done" },
        { label: copy.statusCeremony, state: "done" },
        { label: copy.statusLunch, state: "now" },
        { label: copy.statusMarried, state: "next" },
      ]
    : ceremonyStarted
    ? [
        { label: copy.statusStarting, state: "done" },
        { label: copy.statusCeremony, state: "now" },
        { label: copy.statusLunch, state: "next" },
        { label: copy.statusMarried, state: "next" },
      ]
    : [
        { label: copy.statusStarting, state: "now" },
        { label: copy.statusCeremony, state: "next" },
        { label: copy.statusLunch, state: "next" },
        { label: copy.statusMarried, state: "next" },
      ];

  const phaseBanner = {
    countdown: {
      badge: copy.liveBadge,
      title: copy.liveTitle,
      subtitle: copy.liveSub,
      heading: copy.heading,
    },
    starting: {
      badge: copy.startingBadge,
      title: copy.startingTitle,
      subtitle: copy.startingSub,
      heading: copy.liveHeading,
    },
    ceremony: {
      badge: copy.startedBadge,
      title: copy.startedTitle,
      subtitle: copy.startedSub,
      heading: copy.startedTitle,
    },
    lunch: {
      badge: copy.lunchBadge,
      title: copy.lunchTitle,
      subtitle: copy.lunchSub,
      heading: copy.lunchTitle,
    },
    married: {
      badge: copy.badge,
      title: copy.married,
      subtitle: copy.marriedSub,
      heading: copy.married,
    },
  }[currentPhase];

  if (ceremonyCompleted) {
    return (
      <div className={`countdown finished ${weddingDay ? "wedding-day" : ""}`}
        role="status"
        aria-live="polite"
      >
        <div className="countdown-confetti" aria-hidden>
          {confettiPieces.map((piece) => (
            <span key={piece} className={`confetti-piece c${piece}`} />
          ))}
        </div>

        <div className="married-banner">
          <span className="married-badge">{phaseBanner.badge}</span>
          <h2 className="married-title">{phaseBanner.title}</h2>
          <p className="married-subtitle">{phaseBanner.subtitle}</p>
        </div>

        <div className="countdown-status-row married-status" aria-label="Wedding day status">
          {statusItems.map((item) => (
            <span key={item.label} className={`countdown-status-chip ${item.state}`}>
              <strong>
                {item.state === "done" ? copy.statusDone : item.state === "now" ? copy.statusNow : copy.statusNext}
              </strong>
              {item.label}
            </span>
          ))}
        </div>
      </div>
    );
  }

  const secondsProgress = timeLeft ? timeLeft.seconds / 60 : 1;
  const minutesProgress = timeLeft ? timeLeft.minutes / 60 : 1;
  const hoursProgress = timeLeft ? timeLeft.hours / 24 : 1;
  const daysProgress = 1;
  const showCountdownBoxes = Boolean(timeLeft);

  return (
    <div
      className={`countdown circular ${weddingDay ? "wedding-day" : ""} ${liveMode ? "live-mode" : ""} ${ceremonyStarted ? "ceremony-started" : ""} ${lunchLive ? "lunch-live" : ""}`}
      role="timer"
      aria-live="polite"
    >
      {(weddingDay || ceremonyStarted || lunchLive) && (
        <>
          <div className="countdown-confetti subtle" aria-hidden>
            {confettiPieces.map((piece) => (
              <span key={`live-${piece}`} className={`confetti-piece c${piece}`} />
            ))}
          </div>

          <div className={`countdown-live-banner ${ceremonyStarted || lunchLive ? "started" : ""} ${lunchLive ? "lunch" : ""}`}>
            <span className="countdown-live-badge">{phaseBanner.badge}</span>
            <h3 className="countdown-live-title">{phaseBanner.title}</h3>
            <p className="countdown-live-subtitle">{phaseBanner.subtitle}</p>
          </div>

          <div className="countdown-status-row" aria-label="Wedding day status">
            {statusItems.map((item) => (
              <span key={item.label} className={`countdown-status-chip ${item.state}`}>
                <strong>
                  {item.state === "done" ? copy.statusDone : item.state === "now" ? copy.statusNow : copy.statusNext}
                </strong>
                {item.label}
              </span>
            ))}
          </div>
        </>
      )}

      <h2>{weddingDay ? phaseBanner.heading : copy.heading}</h2>

      {weddingDay && (
        <div className="countdown-fireworks" aria-hidden>
          <span className="fw f1" />
          <span className="fw f2" />
          <span className="fw f3" />
          <span className="fw f4" />
          <span className="fw f5" />
        </div>
      )}

      {showCountdownBoxes ? (
        <div className="countdown-boxes">
          <div
            className="countdown-item"
            style={{ "--p": daysProgress }}
            aria-label={`${timeLeft.days} ${copy.days}`}
          >
            <span
              key={`days-${timeLeft.days}`}
              className="countdown-value countdown-animate"
            >
              {timeLeft.days}
            </span>
            <small className="countdown-label">{copy.days}</small>
          </div>

          <div
            className="countdown-item"
            style={{ "--p": hoursProgress }}
            aria-label={`${timeLeft.hours} ${copy.hours}`}
          >
            <span
              key={`hours-${timeLeft.hours}`}
              className="countdown-value countdown-animate"
            >
              {twoDigits(timeLeft.hours)}
            </span>
            <small className="countdown-label">{copy.hours}</small>
          </div>

          <div
            className="countdown-item"
            style={{ "--p": minutesProgress }}
            aria-label={`${timeLeft.minutes} ${copy.minutes}`}
          >
            <span
              key={`minutes-${timeLeft.minutes}`}
              className="countdown-value countdown-animate"
            >
              {twoDigits(timeLeft.minutes)}
            </span>
            <small className="countdown-label">{copy.minutes}</small>
          </div>

          <div
            className="countdown-item"
            style={{ "--p": secondsProgress }}
            aria-label={`${timeLeft.seconds} ${copy.seconds}`}
          >
            <span
              key={`seconds-${timeLeft.seconds}`}
              className="countdown-value countdown-animate"
            >
              {twoDigits(timeLeft.seconds)}
            </span>
            <small className="countdown-label">{copy.seconds}</small>
          </div>
        </div>
      ) : (
        <div className="countdown-phase-panel" role="status" aria-live="polite">
          <span className="countdown-phase-icon" aria-hidden>{lunchLive ? "🍽️" : "💒"}</span>
          <div className="countdown-phase-copy">
            <strong>{phaseBanner.title}</strong>
            <span>{phaseBanner.subtitle}</span>
          </div>
        </div>
      )}
    </div>
  );
}