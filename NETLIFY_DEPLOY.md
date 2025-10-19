# Bussipukki - Netlify Deployment Ohjeet

## 📋 Edellytykset

1. **Netlify-tili** (ilmainen: https://netlify.com)
2. **GitHub-repository** (pushaa koodi GitHubiin)
3. **Neon PostgreSQL-tietokanta** (ilmainen: https://neon.tech)

---

## 🗄️ Vaihe 1: Luo Neon-tietokanta

### 1. Rekisteröidy Neoniin:
- Mene: **https://neon.tech**
- Kirjaudu GitHub/Google-tilillä (nopein tapa)
- TAI rekisteröidy sähköpostilla

**Huom:** Jos Neon ei lähetä aktivointilinkkiä:
- Ei haittaa! Tili on aktiivinen heti
- Kirjaudu suoraan: **https://console.neon.tech**

### 2. Luo tietokanta:
1. Klikkaa **"Create Project"**
2. Anna nimi: **"Bussipukki"**
3. Valitse region: **EU West** (lähin Suomelle)
4. Klikkaa **"Create Project"**

### 3. Kopioi Connection String:
1. Projektisi Dashboardissa näkyy **Connection Details**
2. Kopioi **Connection string** (alkaa `postgresql://...`)
3. Tallenna tämä turvalliseen paikkaan (tarvitaan kohta!)

**Esimerkki:**
```
postgresql://user:password@ep-cool-name-123456.eu-central-1.aws.neon.tech/neondb
```

---

## 🚀 Vaihe 2: Pushaa koodi GitHubiin

### Jos et ole vielä pushannut GitHubiin:

1. **Luo uusi GitHub-repository:**
   - Mene: https://github.com/new
   - Anna nimi: `bussipukki`
   - Valitse: **Public** (tai Private)
   - ÄLÄ lisää README/gitignore (ne on jo Replitissä)

2. **Pushaa koodi Replitistä GitHubiin:**
   
   Replit Shellissä (tai Git-välilehdessä):
   ```bash
   git remote add origin https://github.com/KÄYTTÄJÄNIMI/bussipukki.git
   git branch -M main
   git push -u origin main
   ```
   
   *Vaihda KÄYTTÄJÄNIMI omaan GitHub-käyttäjänimeesi!*

3. **Päivitä jatkossa:**
   ```bash
   git add .
   git commit -m "Update changes"
   git push
   ```

---

## 🌐 Vaihe 3: Deployaa Netlifyyn

### 1. Kirjaudu Netlifyyn:
- Mene: **https://app.netlify.com**
- Kirjaudu GitHub-tilillä (helpoin tapa)

### 2. Luo uusi site:
1. Klikkaa **"Add new site"** → **"Import an existing project"**
2. Valitse **"Deploy with GitHub"**
3. Anna Netlifylle lupa käyttää GitHub-repositoryjasi
4. Valitse **bussipukki**-repository

### 3. Build-asetukset:
Netlify tunnistaa asetukset automaattisesti `netlify.toml`:sta, mutta varmista:

- **Build command:** `npm run build`
- **Publish directory:** `dist/public`
- **Functions directory:** `netlify/functions`

### 4. Environment Variables (Ympäristömuuttujat):
Ennen deploymentia, lisää ympäristömuuttujat:

1. Klikkaa **"Show advanced"** → **"New variable"**
2. Lisää nämä muuttujat:

```
DATABASE_URL = postgresql://user:password@ep-...neon.tech/neondb
PRINTFUL_API_TOKEN = iKngiV7eEQRCDgJL4qYslo0wmvVP9a5sldafCRy6
SESSION_SECRET = [generoi satunnainen merkkijono]
NODE_ENV = production
```

**SESSION_SECRET generoiminen:**
- Voit käyttää mitä tahansa satunnaista merkkijonoa (vähintään 32 merkkiä)
- Esim: `my-super-secret-bussipukki-2025-key-xyz`
- Tai generoi: https://randomkeygen.com/ (valitse "CodeIgniter Encryption Keys")

### 5. Deployaa:
Klikkaa **"Deploy site"**

Netlify alkaa buildata sovellusta. Tämä kestää 2-5 minuuttia.

---

## 🔧 Vaihe 4: Aja tietokannan migraatiot

Kun deployment on valmis, aja tietokannan migraatiot:

### Vaihtoehto A: Replit Shellissä (HELPOIN)

1. Avaa Replit Shell
2. Aseta DATABASE_URL väliaikaisesti:
   ```bash
   export DATABASE_URL="postgresql://user:password@ep-...neon.tech/neondb"
   ```
3. Aja migraatiot:
   ```bash
   npm run db:migrate
   ```

### Vaihtoehto B: Neon Consolessa (SQL)

1. Mene Neon Dashboardiin: https://console.neon.tech
2. Valitse projektisi → **SQL Editor**
3. Kopioi ja suorita `db/migrations/0000_***.sql` tiedoston sisältö

---

## ✅ Vaihe 5: Testaa sovellus

1. Netlify antaa sinulle URL:n tyyliin:
   ```
   https://random-name-123456.netlify.app
   ```

2. Avaa URL selaimessa

3. Testaa toiminnot:
   - ✅ Etusivu latautuu
   - ✅ Pelit toimivat (Palapeli, Ruuvilajittelu, Muistipeli, Bussikilpailu)
   - ✅ TikTok-arvaus tallentuu
   - ✅ Leaderboardit näkyvät
   - ✅ Kauppa lataa Printful-tuotteet

---

## 🌍 Vaihe 6: Mukautettu domain (VALINNAINEN)

Haluatko oman domainin tyyliin `bussipukki.fi`?

1. Osta domain (esim. Namecheap, Google Domains)
2. Netlifyssa: **Domain settings** → **Add custom domain**
3. Lisää domain ja seuraa Netlifyn ohjeita DNS-asetusten muuttamiseen

Netlify antaa ilmaisen SSL-sertifikaatin (HTTPS) automaattisesti! 🔒

---

## 🔄 Päivitä sovellus tulevaisuudessa

Kun teet muutoksia Replitissä:

1. **Tallenna muutokset:**
   ```bash
   git add .
   git commit -m "Lisätty uusi ominaisuus"
   git push
   ```

2. **Netlify deployaa automaattisesti!** ⚡
   - Jokainen push GitHubiin → automaattinen deployment
   - Näet statuksen: https://app.netlify.com

---

## 🆘 Yleisimmät ongelmat

### ❌ "Build failed"
- Tarkista että `netlify.toml` on oikein
- Tarkista build-komento: `npm run build`
- Katso virheloki Netlify Dashboardista

### ❌ "Function error" tai 500
- Tarkista että kaikki ympäristömuuttujat on asetettu
- Varmista että DATABASE_URL on oikein
- Tarkista että migraatiot on ajettu

### ❌ Tietokanta ei toimi
- Varmista että Neon-tietokanta on päällä
- Tarkista CONNECTION_STRING (kopioi uudelleen Neonista)
- Aja migraatiot uudelleen

### ❌ "API not found"
- Varmista että `netlify/functions/api.ts` on olemassa
- Tarkista redirectit `netlify.toml`:ssa

---

## 📊 Netlify ilmaisen tason rajat

✅ **Ilmainen tier sisältää:**
- 100 GB kaistanleveyttä/kk
- 300 build-minuuttia/kk
- 125,000 serverless function -kutsua/kk
- Automaattiset SSL-sertifikaatit
- Continuous deployment GitHubista

💡 **Riittää hyvin** pienelle/keskikokoiselle liikenteelle!

---

## 🎉 Valmis!

Sovelluksesi on nyt livenä osoitteessa:
```
https://your-site-name.netlify.app
```

Jaa linkki TikTok-livestreameissäsi! 🚌🎄

---

## 📞 Tuki

- Netlify Docs: https://docs.netlify.com
- Neon Docs: https://neon.tech/docs
- Ongelmat? Kysy Replitissä! 😊
