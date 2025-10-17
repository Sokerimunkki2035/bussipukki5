# Bussipukki - Vercel Deployment Ohjeet

## 📋 Edellytykset

1. Vercel-tili
2. GitHub-repository yhdistetty
3. PostgreSQL-tietokanta (2 vaihtoehtoa alla)

## 🗄️ Vaihe 1: Valitse tietokanta

### **VAIHTOEHTO A: Vercel Postgres (SUOSITUS - HELPOIN)**

✅ **Edut:**
- Ei erillistä rekisteröintiä
- Automaattinen integraatio
- Ilmainen (60h compute/kk)

**Ohjeet:**
1. Deployaa ensin ilman tietokantaa (katso Vaihe 2)
2. Vercel Dashboardissa: **Storage → Create Database**
3. Valitse **Postgres** → Anna nimi "bussipukki-db"
4. Ympäristömuuttujat lisätään automaattisesti!
5. Aja migraatiot Storage → Query -välilehdellä (kopioi migrations/*.sql)

### **VAIHTOEHTO B: Neon PostgreSQL**

**Jos Neon ei lähetä aktivointilinkkiä:**
- Ei haittaa! Tili on aktiivinen heti
- Kirjaudu suoraan: **https://console.neon.tech**
- TAI käytä GitHub/Google-kirjautumista

**Ohjeet:**
1. Kirjaudu/rekisteröidy: **https://neon.tech**
2. Luo projekti: **"Bussipukki"**
3. Kopioi connection string (DATABASE_URL)
4. Lisää Vercel ympäristömuuttujiin manuaalisesti

## 🚀 Vaihe 2: Vercel-deployment

### A) Vercel Dashboard:

1. Mene **vercel.com/dashboard**
2. Valitse GitHub-repositorysi (joka on yhdistetty)
3. Klikkaa **"Deploy"**

### B) Environment Variables (Ympäristömuuttujat):

**Jos käytät Vercel Postgres:**
- POSTGRES_URL lisätään automaattisesti ✅
- Lisää vain nämä manuaalisesti:
  ```
  PRINTFUL_API_TOKEN=iKngiV7eEQRCDgJL4qYslo0wmvVP9a5sldafCRy6
  SESSION_SECRET=your-session-secret-here
  NODE_ENV=production
  ```

**Jos käytät Neon tietokantaa:**
- Lisää **Settings → Environment Variables** kohdassa:
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
