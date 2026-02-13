# Նախագծի տեխզադրանք — borboraqua.am

> Լրացրու՛ այս ֆայլը զարգացումը սկսելուց առաջ։
> Լրացնելուց հետո — ուղարկի՛ր AI-ասիստենտին անալիզի և մեկնարկի համար `21-project-onboarding.mdc`-ի համաձայն։

---

## Նկարագրություն

**borboraqua.am** — e-commerce պլատֆորմ (ինտերնետ-խանութ). Ապրանքների կատալոգ, զամբյուղ, պատվերներ, ադմին-ֆունկցիաներ, որոնում (Meilisearch), JWT-auth։ Հոսթինգ՝ Vercel, DB՝ PostgreSQL (Neon), Prisma։

## Թիրախային լսարան

Գնորդներ (B2C), ադմինիստրատորներ (ապրանքներ/պատվերներ կառավարելու համար)։

## Հիմնական ֆունկցիաներ (առաջնայնացված)

1. Կատալոգ, ապրանքի էջ, զամբյուղ, checkout — բարձր
2. Աուտենտիֆիկացիա, պատվերների պատմություն — բարձր
3. Ադմին: ապրանքներ, պատվերներ, ատրիբուտներ — միջին
4. Որոնում (Meilisearch), ֆիլտրներ — միջին
5. i18n, SEO — միջին

## Stack (որոշված)

- **Frontend:** Next.js 16 (App Router), React 18, Tailwind, packages: @shop/ui, @shop/design-tokens
- **Backend:** Next.js API Routes, Prisma, PostgreSQL (Neon)
- **Monorepo:** Turborepo, workspaces (apps/web, packages/db, packages/ui, packages/design-tokens)
- **Auth:** JWT (bcryptjs, jsonwebtoken)
- **Search:** Meilisearch
- **Deploy:** Vercel

## Դիզայն

- UI Kit / դիզայն-համակարգ. packages/design-tokens, packages/ui

## Ինտեգրացիաներ

- [ ] Վճարային համակարգ (Stripe / YooKassa / այլ)
- [ ] Email (Resend / SendGrid / այլ)
- [x] Աուտենտիֆիկացիա (JWT)
- [ ] Ֆայլերի պահոց (Cloudflare R2 — optional)
- [x] Meilisearch

## Կոնտենտի լեզու

- Ինտերֆեյսի հիմնական լեզու. hy / en (i18n)
- i18n. այո

## Սահմանափակումներ

- Ժամկետներ. առանց դեդլայնի
- Տեխնիկական. Vercel, Neon — ընթացիկ ընտրություն

## Լրացուցիչ

Նախագիծը մաքրվել է մինչև «clean start» (տես docs/CLEANUP_PLAN.md, docs/PROGRESS.md).
