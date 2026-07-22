import { useState, useEffect, useCallback } from "react";
import type { Offer, OfferScored } from "./types";
import { fetchOffers } from "./api/offers";
import { fetchRecommandations } from "./api/recommandations";
import { useFavoris } from "./hooks/useFavoris";

export default function App() {
  const [offers, setOffers] = useState<(Offer | OfferScored)[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [maxBudget, setMaxBudget] = useState("");
  const [type, setType] = useState("");
  const [sortBy, setSortBy] = useState("score");
  const { favoris, toggle, estFavori } = useFavoris();

  const charger = useCallback(async () => {
    try {
      setError(null);
      // Tri par score personnalisé = pipeline de reco, sinon = listing classique
      if (sortBy === "score" && favoris.length > 0) {
        setOffers(await fetchRecommandations(favoris));
      } else {
        const resultats = await fetchOffers({ maxBudget, type, sortBy });
        if (resultats.length === 0) setError("Aucune offre trouvée");
        setOffers(resultats);
      }
    } catch (e) {
      setError((e as Error).message);
      setOffers([]);
    }
  }, [sortBy, favoris, maxBudget, type]);

  useEffect(() => {
    charger();
  }, [charger]); // re-fetch auto quand les favoris changent

  return (
    <div
      style={{ maxWidth: 700, margin: "2rem auto", fontFamily: "sans-serif" }}
    >
      <h1>TripScore</h1>

      <div
        style={{
          display: "flex",
          gap: "1rem",
          marginBottom: "1rem",
          flexWrap: "wrap",
        }}
      >
        <input
          type="number"
          placeholder="Budget max (€)"
          value={maxBudget}
          onChange={(e) => setMaxBudget(e.target.value)}
        />
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">Tous types</option>
          <option value="flight">Vol</option>
          <option value="hotel">Hôtel</option>
          <option value="package">Forfait</option>
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="score">Recommandé pour moi</option>
          <option value="price">Prix</option>
          <option value="rating">Note</option>
        </select>
        <button onClick={charger}>Filtrer</button>
      </div>

      {sortBy === "score" && favoris.length === 0 && (
        <p style={{ color: "#666" }}>
          Ajoute des favoris ♥ pour obtenir un classement personnalisé — en
          attendant, voici le catalogue complet.
        </p>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}

      <ul style={{ listStyle: "none", padding: 0 }}>
        {offers.map((o) => (
          <li
            key={o.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: 8,
              padding: "1rem",
              marginBottom: "0.5rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <strong>{o.destination}</strong> — {o.type} · {o.category}
              <br />
              💶 {o.price}€ · ⭐ {o.rating} ({o.reviewsCount} avis) ·{" "}
              {o.durationDays}j
              {"score" in o && (
                <span style={{ color: "#666" }}>
                  {" "}
                  · score {o.score.toFixed(3)}
                </span>
              )}
            </div>
            <button
              onClick={() => toggle(o.id)}
              aria-label={
                estFavori(o.id) ? "Retirer des favoris" : "Ajouter aux favoris"
              }
              style={{
                fontSize: "1.4rem",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              {estFavori(o.id) ? "❤️" : "🤍"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
