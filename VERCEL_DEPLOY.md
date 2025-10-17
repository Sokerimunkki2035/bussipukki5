# Bussipukki - Vercel Deployment Ohjeet

## 📋 Edellytykset

1. Neon PostgreSQL -tietokanta (ilmainen tier)
2. Vercel-tili
3. GitHub-repository yhdistetty

## 🗄️ Vaihe 1: Neon-tietokanta

1. Mene osoitteeseen: **https://neon.tech**
2. Luo ilmainen tili
3. Luo uusi projekti: **"Bussipukki"**
4. Kopioi connection string (DATABASE_URL)
   - Se näyttää tältä: `postgresql://user:pass@host/dbname`

## 🚀 Vaihe 2: Vercel-deployment

### A) Vercel Dashboard:

1. Mene **vercel.com/dashboard**
2. Valitse GitHub-repositorysi (joka on yhdistetty)
3. Klikkaa **"Deploy"**

### B) Environment Variables (Ympäristömuuttujat):

Lisää nämä **Settings → Environment Variables** kohdassa:

```
DATABASE_URL=postgresql://user:pass@host/dbname
PRINTFUL_API_TOKEN=iKngiV7eEQRCDgJL4qYslo0wmvVP9a5sldafCRy6
SESSION_SECRET=your-session-secret-here
NODE_ENV=production
```

### C) Aja migraatiot:

Kun deployment on valmis ja ympäristömuuttujat asetettu:

1. Avaa **Vercel Dashboard → projektisi**
2. Mene **Settings → General → Git**
3. Tai aja paikallisesti (jos sinulla on Vercel CLI):
   ```bash
   DATABASE_URL="your-neon-url" npm run db:migrate
   ```

## ✅ Tarkistukset

Kun deployment on valmis:

1. **Testaa frontend**: Avaa Vercel-URL
2. **Testaa API**: `https://your-app.vercel.app/api/tiktok-guesses`
3. **Testaa pelit**: Pelaa peli ja tallenna pisteet
4. **Testaa kauppa**: Tarkista että Printful-tuotteet näkyvät

## 🔧 Tärkeää tietoa

- **Tietokanta**: Nyt käytössä PostgreSQL (data säilyy!)
- **API**: Serverless-funktiot (ei app.listen())
- **Rakenne**:
  - Frontend: `/dist` (Vite build)
  - Backend: `/api/index.ts` (Vercel serverless)
  - Migraatiot: `/migrations/*.sql`

## 🐛 Ongelmia?

**Virhe: "Database not configured"**
→ Tarkista DATABASE_URL ympäristömuuttuja

**Virhe: "Table does not exist"**
→ Aja migraatiot: `npm run db:migrate`

**API ei toimi**
→ Tarkista että `/api` -polku ohjautuu oikein vercel.json:ssa

## 📱 Seuraavat askeleet

1. Lisää tuotteita Printful-kauppaan
2. Testaa kaikki pelit ja pisteiden tallennus
3. Jaa sovellus TikTok-yleisölle!

---

**Onnea Bussipukille! 🎄🚌**
