import { useEffect, useState } from "react";
import "./EventsPage.css";

export default function EventsPage({ onNext, onBack, muted, setMuted, lang = "mr" }) {
  const content = {
    mr: {
      audioOn: "शहनाई सुरू करा",
      audioOff: "शहनाई बंद करा",
      heading: "📅 कार्यक्रम",
      countdownHeading: "⏳ Countdown",
      engagementShort: "💍 साखरपुडा",
      haldiShort: "🌼 हळदी",
      labels: { days: "दिवस", hours: "तास", minutes: "मिनिटे", seconds: "सेकंद" },
      venueKicker: "📍 Venue Map",
      venueTitle: "समारंभाचे ठिकाण",
      venueName: "सिद्धनाथ मल्टीपर्पज हॉल",
      venueAddress: "देशिंग रोड, कवठे महांकाळ, महाराष्ट्र ४१६४०५ .",
      openMaps: "🗺️ Open in Maps",
      reminder: "🔔 Reminder",
      googleCalendar: "📅 Google Calendar",
      whatsapp: "💬 WhatsApp Reminder",
      footer: "आपल्या उपस्थितीने हा मंगल सोहळा अधिक सुंदर होईल 🙏",
      whatsAppHeader: "🔔 Wedding Reminder",
      meta: { date: "📅", time: "⏰", place: "📍" },
      events: [
        { kind: "engagement", title: "साखरपुडा समारंभ", date: "5 मे 2026", time: "संध्याकाळी ५:३० वाजता", place: "सिद्धनाथ मल्टीपर्पज हॉल, कवठेमहांकाळ" },
        { kind: "haldi", title: "हळदी समारंभ", date: "5 मे 2026", time: "संध्याकाळी ८:०० वाजता", place: "सिद्धनाथ मल्टीपर्पज हॉल, कवठेमहांकाळ" },
        { kind: "wedding", title: "विवाह मुहूर्त", date: "6 मे 2026", time: "दुपारी १२:३० वाजता", place: "सिद्धनाथ मल्टीपर्पज हॉल, कवठेमहांकाळ" },
        { kind: "bhojan", title: "भोजन समारंभ", date: "6 मे 2026", time: "दुपारी १:०० नंतर", place: "सिद्धनाथ मल्टीपर्पज हॉल, कवठेमहांकाळ" },
      ],
    },
    en: {
      audioOn: "Unmute shehnai",
      audioOff: "Mute shehnai",
      heading: "📅 Events",
      countdownHeading: "⏳ Countdown",
      engagementShort: "💍 Engagement",
      haldiShort: "🌼 Haldi",
      labels: { days: "Days", hours: "Hours", minutes: "Min", seconds: "Sec" },
      venueKicker: "📍 Venue Map",
      venueTitle: "Venue",
      venueName: "Siddhanath Multipurpose Hall",
      venueAddress: "Deshing Road, Kavathe Mahankal, Maharashtra 416405.",
      openMaps: "🗺️ Open in Maps",
      reminder: "🔔 Reminder",
      googleCalendar: "📅 Google Calendar",
      whatsapp: "💬 WhatsApp Reminder",
      footer: "Your presence will make this celebration even more beautiful 🙏",
      whatsAppHeader: "🔔 Wedding Reminder",
      meta: { date: "📅", time: "⏰", place: "📍" },
      events: [
        { kind: "engagement", title: "Engagement Ceremony", date: "5 May 2026", time: "5:30 PM", place: "Siddhanath Multipurpose Hall, Kavathe Mahankal" },
        { kind: "haldi", title: "Haldi Ceremony", date: "5 May 2026", time: "8:00 PM", place: "Siddhanath Multipurpose Hall, Kavathe Mahankal" },
        { kind: "wedding", title: "Wedding Muhurat", date: "6 May 2026", time: "12:30 PM", place: "Siddhanath Multipurpose Hall, Kavathe Mahankal" },
        { kind: "bhojan", title: "Wedding Lunch", date: "6 May 2026", time: "After 1:00 PM", place: "Siddhanath Multipurpose Hall, Kavathe Mahankal" },
      ],
    },
  }[lang];

  const venueName = content.venueName;
  const venueAddress = content.venueAddress;
  const venueQuery = "सिद्धनाथ मल्टीपर्पज हॉल, 2V23+X92, Deshing Rd, Kavathe Mahankal, Maharashtra 416405";
  const venueMapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venueQuery)}`;
  const venueEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(venueQuery)}&z=18&output=embed`;

  function toggleMute() {
    setMuted((m) => !m);
  }

  const events = [
    {
      ...content.events[0],
      mapLink: venueMapLink,
      start: "20260505T173000",
      end: "20260505T193000",
    },
    {
      ...content.events[1],
      mapLink: venueMapLink,
      start: "20260505T200000",
      end: "20260505T220000",
    },
    {
      ...content.events[2],
      mapLink: venueMapLink,
      start: "20260506T123000",
      end: "20260506T143000",
    },
    {
      ...content.events[3],
      mapLink: venueMapLink,
      start: "20260506T130000",
      end: "20260506T160000",
    },
  ];

  const parseEventDate = (str) => {
    const cleaned = str.replace(/T/g, "");
    const year = cleaned.slice(0, 4);
    const month = cleaned.slice(4, 6);
    const day = cleaned.slice(6, 8);
    const hour = cleaned.slice(8, 10);
    const minute = cleaned.slice(10, 12);
    const second = cleaned.slice(12, 14);
    return new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}`);
  };

  const engagementEvent = events.find((e) => e.kind === "engagement");
  const haldiEvent = events.find((e) => e.kind === "haldi");

  const [countdown, setCountdown] = useState({
    engagement: { days: 0, hours: 0, minutes: 0, seconds: 0 },
    haldi: { days: 0, hours: 0, minutes: 0, seconds: 0 },
  });

  useEffect(() => {
    const engagementDate = parseEventDate(engagementEvent.start);
    const haldiDate = parseEventDate(haldiEvent.start);

    function calculateCountdown(target) {
      const now = new Date();
      const diff = target - now;

      if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

      const totalSeconds = Math.floor(diff / 1000);
      return {
        days: Math.floor(totalSeconds / (60 * 60 * 24)),
        hours: Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60)),
        minutes: Math.floor((totalSeconds % (60 * 60)) / 60),
        seconds: totalSeconds % 60,
      };
    }

    function updateCountdown() {
      setCountdown({
        engagement: calculateCountdown(engagementDate),
        haldi: calculateCountdown(haldiDate),
      });
    }

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatEventDay = (dateObj) =>
    dateObj.toLocaleDateString(lang === "mr" ? "mr-IN" : "en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  const currentEvent =
    events.find((e) => parseEventDate(e.end) > new Date()) ||
    events[events.length - 1];

  const themeClass = currentEvent.kind === "engagement"
    ? "theme-engagement"
    : currentEvent.kind === "haldi"
    ? "theme-haldi"
    : "theme-wedding";

  const mainEvent = events.find((e) => e.kind === "wedding") || events[events.length - 1];

  function googleCalendarTemplateUrl({ title, details, location, start, end }) {
    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: title,
      details: details,
      location: location,
      dates: `${start}/${end}`,
    });
    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  }

  const calendarUrl = googleCalendarTemplateUrl({
    title: `💍 ${mainEvent.title}`,
    location: mainEvent.place,
    details: events.map((e) => `${e.title} — ${e.date} — ${e.time}`).join("\n"),
    start: mainEvent.start,
    end: mainEvent.end,
  });

  const whatsAppReminderText =
    `${content.whatsAppHeader}\n\n` +
    events.map((e) => `• ${e.title} — ${e.date} — ${e.time} — ${e.place}`).join("\n");

  const whatsAppReminderUrl = `https://wa.me/?text=${encodeURIComponent(whatsAppReminderText)}`;

  function hapticAndVibrate(e) {
    const el = e.currentTarget;
    if (el && el.classList) {
      el.classList.remove("vibrate");
      el.offsetWidth;
      el.classList.add("vibrate");
      setTimeout(() => el.classList.remove("vibrate"), 260);
    }
    if (navigator.vibrate) navigator.vibrate(12);
  }

  function hapticOnly(e) {
    e.stopPropagation();
    hapticAndVibrate(e);
  }

  function Digit({ value, label }) {
    const [display, setDisplay] = useState(value);
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
      if (value !== display) {
        setAnimate(true);
        setTimeout(() => {
          setDisplay(value);
          setAnimate(false);
        }, 300);
      }
    }, [value]);

    return (
      <div className="digit-box">
        <div className={`digit ${animate ? "slide" : ""}`}>{display}</div>
        <div className="digit-label">{label}</div>
      </div>
    );
  }

  return (
    <div className={`card fade-in events-card ${themeClass}`}>

      <button className={`audio-control ${muted ? "muted" : "playing"}`} onClick={toggleMute} aria-label={muted ? content.audioOn : content.audioOff}>
        {muted ? "🔇" : "🔊"}
      </button>

      <h1>{content.heading}</h1>

      {/* Countdown Card */}
      <div className="countdown-main-card section-anim">
        <h2 className="countdown-heading">{content.countdownHeading}</h2>

        <div className="countdown-row">

          <div className="digital-card engagement-card">
            <h3>{content.engagementShort}</h3>
            <div className="digital-countdown">
              <Digit label={content.labels.days} value={countdown.engagement.days} />
              <Digit label={content.labels.hours} value={countdown.engagement.hours} />
              <Digit label={content.labels.minutes} value={countdown.engagement.minutes} />
              <Digit label={content.labels.seconds} value={countdown.engagement.seconds} />
            </div>
            <div className="countdown-date">
              {formatEventDay(parseEventDate(engagementEvent.start))}
            </div>
          </div>

          <div className="digital-card haldi-card">
            <h3>{content.haldiShort}</h3>
            <div className="digital-countdown">
              <Digit label={content.labels.days} value={countdown.haldi.days} />
              <Digit label={content.labels.hours} value={countdown.haldi.hours} />
              <Digit label={content.labels.minutes} value={countdown.haldi.minutes} />
              <Digit label={content.labels.seconds} value={countdown.haldi.seconds} />
            </div>
            <div className="countdown-date">
              {formatEventDay(parseEventDate(haldiEvent.start))}
            </div>
          </div>

        </div>
      </div>

      {/* Events */}
      {events.map((e, i) => (
        <div className="event event-anim" key={i} onPointerDown={hapticAndVibrate}>
          <h2>{e.title}</h2>
          <div className="event-meta">
            <span className="meta-pill">{content.meta.date} {e.date}</span>
            <span className="meta-pill">{content.meta.time} {e.time}</span>
            <span className="meta-pill">{content.meta.place} {e.place}</span>
          </div>
        </div>
      ))}

      <div className="venue-card section-anim">
        <div className="venue-copy">
          <span className="venue-kicker">{content.venueKicker}</span>
          <h2 className="venue-title">{content.venueTitle}</h2>
          <p className="venue-text">{venueName}</p>
          <p className="venue-address">{venueAddress}</p>
        </div>

        <div className="venue-map-shell">
          <iframe
            className="venue-map-frame"
            src={venueEmbedUrl}
            title={lang === "mr" ? "लग्न स्थळाचा नकाशा" : "Wedding venue map"}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        <div className="venue-actions">
          <a className="reminder-btn touchable" href={venueMapLink} target="_blank" rel="noreferrer" onPointerDown={hapticOnly}>
            {content.openMaps}
          </a>
        </div>
      </div>

      {/* Reminder */}
      <div className="reminder-card section-anim">
        <h2 className="reminder-title">{content.reminder}</h2>
        <div className="reminder-actions">
          <a className="reminder-btn touchable" href={calendarUrl} target="_blank">{content.googleCalendar}</a>
          <a className="reminder-btn touchable" href={whatsAppReminderUrl} target="_blank">{content.whatsapp}</a>
        </div>
      </div>

      <p className="footer">{content.footer}</p>

      <div className="nav-row">
        {onBack ? <button className="nav-btn back-btn" onClick={onBack}>←</button> : <div />}
        {onNext ? <button className="nav-btn forward-btn" onClick={onNext}>→</button> : <div />}
      </div>
    </div>
  );
}