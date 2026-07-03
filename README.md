# TripScore

Comparateur d'offres de voyage — architecture N-tiers · TypeScript · Node/Express · React

## Stack

- **Backend** : Node.js · Express · TypeScript
- **Frontend** : React · Vite · TypeScript
- **Tests** : Jest · ts-jest

## Lancer le projet

### Backend

```bash
cd backend
npm install
npm run dev       # mock data, port 3000
```

### Frontend

```bash
cd frontend
npm install
npm run dev       # port 5173
```

## Endpoints

```
GET /offers                              → toutes les offres (triées par score)
GET /offers?maxBudget=500                → filtre par budget
GET /offers?type=flight                  → filtre par type (flight | hotel | package)
GET /offers?sortBy=price                 → tri (price | rating | score)
GET /offers?maxBudget=500&sortBy=rating  → combinaison
```

## Tests

```bash
cd backend && npm test
```

Teste `OfferService` en isolation via `FakeOfferRepository` — aucune dépendance à la base.

## Architecture

```
backend/src/
  models/         Offer, FilterCriteria
  repositories/   IOfferRepository (contrat), MockOfferRepository, SqlOfferRepository
  services/       OfferService — filtre, score, tri
  controllers/    offerController — thin, HTTP only
  routes/         offerRoutes
  app.ts          composition root
```

Le service dépend uniquement de `IOfferRepository` (interface). `app.ts` injecte l'implémentation concrète selon l'environnement.
