export default function Petals() {
  // Generate a few petals with varied positions and delays so CSS animation looks organic
  const petals = Array.from({ length: 12 }).map((_, i) => {
    const left = 6 + (i * 8) % 88; // distribute across width
    const top = -8 - (i % 4) * 6; // start slightly above
    const delay = (i % 6) * 0.6; // staggered animation delay
    return (
      <span
        key={i}
        className="petal"
        style={{ left: `${left}%`, top: `${top}px`, animationDelay: `${delay}s` }}
        aria-hidden
      />
    );
  });

  return <>{petals}</>;
}