// src/App.tsx
import { useState, useEffect } from "react";

interface Offer {
  id: string;
  destination: string;
  type: "flight" | "hotel" | "package";
  category: "budget" | "standard" | "luxury";
  price: number;
  rating: number;
  durationDays?: number;
}

const API = "http://localhost:3000";

export default function App() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [maxBudget, setMaxBudget] = useState("");
  const [type, setType] = useState("");
  const [sortBy, setSortBy] = useState("score");

  const fetchOffers = async () => {
    const params = new URLSearchParams();
    if (maxBudget) params.append("maxBudget", maxBudget);
    if (type) params.append("type", type);
    if (sortBy) params.append("sortBy", sortBy);

    const res = await fetch(`${API}/offers?${params}`);
    if (res.status === 404) {
      setError("Aucune offre trouvée");
      setOffers([]);
      return;
    }
    setError(null);
    setOffers(await res.json());
  };

  useEffect(() => {
    fetchOffers();
  }, []);

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
          <option value="score">Score prix/qualité</option>
          <option value="price">Prix</option>
          <option value="rating">Note</option>
        </select>
        <button onClick={fetchOffers}>Filtrer</button>
      </div>

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
            }}
          >
            <strong>{o.destination}</strong> — {o.type} · {o.category}
            <br />
            💶 {o.price}€ · ⭐ {o.rating}
            {o.durationDays ? ` · ${o.durationDays}j` : ""}
          </li>
        ))}
      </ul>
    </div>
  );
}
