import type { AttributNumerique, Critere, Normalise } from "./types";

export function normaliser<T extends Record<AttributNumerique, number>>(
  items: T[],
  criteres: Critere[],
): Normalise<T>[] {
  const bornes = new Map<AttributNumerique, { min: number; max: number }>();
  for (const { attr } of criteres) {
    const valeurs = items.map((i) => i[attr]);
    bornes.set(attr, { min: Math.min(...valeurs), max: Math.max(...valeurs) });
  }

  return items.map((item) => {
    const norm = {} as Record<AttributNumerique, number>;
    for (const { attr, direction } of criteres) {
      const { min, max } = bornes.get(attr)!;
      const ratio = max === min ? 0.5 : (item[attr] - min) / (max - min);
      norm[attr] = direction === "min" ? 1 - ratio : ratio;
    }
    return { ...item, _norm: norm };
  });
}
