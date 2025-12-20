## CandleWise Copilot

- Backend: ASP.NET Core 8 Web API (backend/)
- Frontend: Next.js 15 + React 19 + TypeScript (frontend/)
- Infra: Terraform (infra/) → Azure App Service (F1) + Vercel
- Contract: shared/types/index.ts (TS) between frontend/backend

**Data Flow**
- Frontend → REST API → Backend → Alpaca Markets
- Frontend stores chart history in memory only

**Realtime Prices**
- Auto-update: every 10s (toggle off by default)
- Manual refresh: per holding in `HoldingCard.tsx`
- Chart: keep last 60 points (10 minutes)

**Dev Commands (PowerShell)**
```
npm run dev
npm run dev:backend
npm run dev:frontend
npm run docker:up
```

**Config**
- Backend: `backend/appsettings.Local.json` with Alpaca `ApiKeyId`/`ApiSecretKey`
- Frontend: `NEXT_PUBLIC_API_URL` (defaults to `/api` locally)

**API**
- GET `/api/portfolio/default`
- GET `/api/stock/{symbol}/price`
- POST `/api/stock/prices` → body: `{ "symbols": ["AAPL"] }`
- GET `/health`
- Note: No stock history API; history is client-side

**Conventions**
- Backend: controllers in `backend/Controllers/`, DI services, DTOs with models, `/health` exists
- Frontend: components use `'use client'`; services in `frontend/src/services/`; Tailwind inline
- Shared: edit `shared/types/index.ts` on contract changes; keep C# and TS in sync
- TypeScript: do not use `any` or type assertions; prefer explicit types and safe narrowing
- React: include all hook dependencies; avoid stale closures
- Files: minimal, focused patches; root-cause fixes; no license headers; no one-letter vars; avoid inline comments unless requested
- Imports: split components into files; use default exports for `PortfolioSummaryCard` and `HoldingCard`

**Deployment**
- Backend: Azure App Service via Terraform + GitHub Actions
- Frontend: Vercel on main branch
- Secrets: `AZURE_CREDENTIALS`, `AZURE_SUBSCRIPTION_ID`, `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`

**Testing**
- Backend: xUnit (`dotnet test`)
- Frontend: Jest/RTL (`npm run test`)

**Common Tasks**
- New stock API: `StockController.cs` → `AlpacaMarketDataService.cs` → `stockService.ts`
- Portfolio feature: `Models/Portfolio.cs` → `PortfolioController.cs` → `shared/types/index.ts` → `portfolioService.ts`
- Infra change: `infra/main.tf` → `terraform plan` → CI/CD deploy

**Assistant Rules**
- Follow Microsoft content policies; avoid harmful content
- Use shared types as source of truth; keep contracts in sync
- Avoid `any` and `as` assertions; define `PortfolioHoldingWithUI` for UI fields
- Keep React hooks dependency arrays complete; prefer `useCallback`/`useMemo` when appropriate
- Prefer batch price fetches; cache last successful prices for fallbacks
- PowerShell commands only; join with `;` when needed
- Always append a footer with the current date and time to responses
