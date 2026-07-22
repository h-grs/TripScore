import { useState } from "react";

const KEY = "tripscore:favoris";

export function useFavoris() {
  const [favoris, setFavoris] = useState<string[]>(() => {
    try {
      const brut = JSON.parse(localStorage.getItem(KEY) ?? "[]");
      return Array.isArray(brut)
        ? brut.filter((x) => typeof x === "string")
        : [];
    } catch {
      return [];
    }
  });

  function toggle(id: string) {
    setFavoris((prev) => {
      const maj = prev.includes(id)
        ? prev.filter((f) => f !== id)
        : [...prev, id];
      localStorage.setItem(KEY, JSON.stringify(maj));
      return maj;
    });
  }

  return { favoris, toggle, estFavori: (id: string) => favoris.includes(id) };
}
