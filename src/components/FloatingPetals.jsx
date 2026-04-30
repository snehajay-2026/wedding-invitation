import { useEffect } from "react";

export default function FloatingPetals() {

  useEffect(() => {

    const container = document.createElement("div");
    container.className = "petal-container";

    document.body.appendChild(container);

    for (let i = 0; i < 25; i++) {

      const petal = document.createElement("div");
      petal.className = "petal";

      petal.style.left = Math.random() * 100 + "vw";
      petal.style.animationDelay = Math.random() * 10 + "s";
      petal.style.animationDuration = 8 + Math.random() * 8 + "s";

      container.appendChild(petal);
    }

    return () => container.remove();

  }, []);

  return null;
}