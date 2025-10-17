# Bussipukki - Jouluinen Nettisivu

## Yleiskatsaus
Bussipukki on jouluteemainen nettisivu Porin linjojen linja-auton kuljettajalle. Sivusto sisältää pelejä bussimatkustajille, TikTok live arvauspeliä sekä mock-verkkokaupan Bussipukki-tuotteille.

## Projektin Tila
**Valmis Tuotantoon** - Kaikki pääominaisuudet toiminnassa ja Vercel-yhteensopiva
- ✅ Jouluinen design (punainen, vihreä, kulta, kermanvärinen)
- ✅ Neljä toimivaa peliä (palapeli, pähkinälajittelu, muistipeli, bussikilpailu) pisteiden tallennuksella
- ✅ Leaderboard -tulostaulut kaikille peleille (top 10 pisteet)
- ✅ TikTok live arvaus -järjestelmä
- ✅ TikTok tilastosivu analytiikalla
- ✅ Admin-näkymä arvausten tarkasteluun
- ✅ Sosiaalinen jakaminen (Twitter/X, Facebook, native share API)
- ✅ Printful-verkkokauppa oikeilla tuotteilla
- ✅ PostgreSQL-tietokanta (Neon) pysyvään tallennukseen
- ✅ Vercel serverless -arkkitehtuuri

## Tekninen Toteutus

### Tech Stack
- **Frontend**: React 18, Wouter (routing), TanStack Query (data fetching), Tailwind CSS
- **Backend**: Express.js serverless functions (Vercel), PostgreSQL (Neon)
- **Database**: Neon serverless PostgreSQL, Drizzle ORM
- **Deployment**: Vercel (frontend + serverless API)
- **UI Components**: Shadcn UI, Lucide Icons
- **Design**: Jouluinen teema mukautetuilla väreillä ja fonteilla

### Arkkitehtuuri

#### Tietomallit (shared/schema.ts)
- `TiktokGuess`: TikTok live arvaukset (playerName, guessedNumber, createdAt)
- `PuzzleScore`: Pelien pisteet (playerName, timeSeconds, gameType, createdAt)
- `Product`: Mock-tuotteet (name, price, image, category)

#### API-endpointit (server/routes.ts)
- `GET /api/tiktok-guesses` - Hae kaikki arvaukset
- `POST /api/tiktok-guesses` - Luo uusi arvaus
- `POST /api/puzzle-scores` - Tallenna pelipistemäärä
- `GET /api/puzzle-scores/:gameType` - Hae parhaat pisteet pelityypille
- `GET /api/printful/store-products` - Hae tuotteet Printful-kaupasta
- `GET /api/printful/products` - Hae kaikki Printful-katalogin tuotteet

#### Sivut (client/src/pages)
1. **Home** (`/`) - Etusivu heroilla, peliesittelyllä ja toimintakehotteilla
2. **Games** (`/pelit`) - Pelihalli neljällä pelillä:
   - Joulupalapeli (palanvaihto)
   - Pähkinälajittelu (järjestyspeli)
   - Muistipeli (korttien muistaminen)
   - Bussikilpailu (tietokilpailu Porin linjoista)
3. **TikTok Guess** (`/arvaus`) - Live-arvauslomake katsojille
4. **TikTok Stats** (`/tilastot`) - Tilastot ja analytiikka TikTok-arvauksista
5. **Shop** (`/kauppa`) - Mock-verkkokauppa Bussipukki-tuotteilla
6. **Admin** (`/admin`) - Dashboard kaikkien arvausten näyttämiseen

### Design System

#### Väripaletti
- **Primary Red**: `0 84% 60%` - Pääväri, painikkeet, korostukset
- **Forest Green**: `140 45% 35%` - Navigaatio, headerit
- **Cream White**: `45 30% 96%` - Taustaväri
- **Gold Accent**: `45 95% 55%` - Korostukset, badget, onnistumiset

#### Fontit
- **Festive**: Mountains of Christmas (brand-elementit)
- **Playful**: Fredoka (otsikot)
- **Sans**: Inter (leipäteksti)

#### Komponentit
- Käyttää Shadcn UI -komponentteja johdonmukaisesti
- Hover/active -tilat `hover-elevate` ja `active-elevate-2` -utilityillä
- Responsiivinen design kaikille näyttöko'oille

## Ominaisuudet

### 1. Joulupalapeli
- 3x3 palapeli jouluisella kuvalla
- Klikkaa kahta palaa vaihtaaksesi niiden paikkoja
- Ajastin ja pistetilastot
- Pisteiden tallennus nimellä

### 2. Pähkinälajittelu
- Lajittele pähkinät oikeassa järjestyksessä
- Neljä eri pähkinätyyppiä (käytetään Lucide Nut -ikonia eri väreillä)
- Ajastin ja pistetilastot
- Pisteiden tallennus nimellä

### 3. Muistipeli
- 16 korttia jouluisilla ikoneilla (8 paria)
- 3D flip-animaatiot kortinvaihdossa
- Siirtojen ja ajan seuranta
- Pisteiden tallennus nimellä

### 4. Bussikilpailu (Tietokilpailu)
- 10 kysymystä Porin bussiliikenteestä
- Multiple choice -vastaukset
- Visuaalinen palaute oikeista/vääristä vastauksista
- Pisteet ja ajan seuranta

### 5. Leaderboard (Tulostaulu)
- Top 10 pisteet jokaiselle pelille
- Ranking-ikonit (kruunu, mitalit)
- Näyttää pelaajan nimen ja ajan
- Reaaliaikainen päivitys

### 6. TikTok Live Arvaus
- Katsojat arvaavat vitsien määrän live-lähetystä varten
- Lomake: nimi/käyttäjätunnus + arvattu numero
- Confetti-efekti onnistuneen lähetyksen jälkeen
- Kaikki arvaukset tallentuvat tietokantaan

### 7. TikTok Tilastot
- Kokonais- ja keskiarvolaskut arvauksista
- Arvausten jakauma (top 10 suosituimmat numerot)
- Aikaväli (ensimmäinen - viimeisin arvaus)
- Eri pelaajien ja numeroiden määrä

### 8. Admin Dashboard
- Näytä kaikki TikTok-arvaukset
- Automaattinen päivitys (5s välein)
- Tilastot: yhteensä, keskiarvo, pienin, suurin
- Taulukkonäkymä ajalla

### 9. Sosiaalinen Jakaminen
- Twitter/X -jakaminen pelipistemäärien kanssa
- Facebook -jakaminen
- Native Share API mobiilikäyttöön
- Automaattinen tekstin generointi pelinimellä ja pisteillä

### 10. Printful Verkkokauppa
- Integroitu Printful API -yhteys
- Hakee oikeat tuotteet Printful-kaupasta
- Näyttää tuotetiedot: nimi, kuva, varianttien määrä
- Kolme tilaa: ladataan, virhe, tyhjä/tuotteet
- "Näytä Tuote" -painikkeet jokaiselle tuotteelle

## Kehitysohjeita

### Projektin Ajaminen
```bash
npm run dev
```
Avaa selain: http://localhost:5000

### Tiedon Hallinta
- **PostgreSQL-tietokanta**: Neon serverless PostgreSQL (pysyvä tallennus)
- **Drizzle ORM**: Tyyppiturvallinen tietokannan hallinta
- **Migraatiot**: Drizzle Kit -pohjainen migraatiojärjestelmä
- **Fallback**: MemStorage kehitysympäristöön ilman DATABASE_URL:ia

### Tulevat Parannukset
1. **Ostoskorifunktio**: Lisää ostoskori ja checkout Printful-tuotteille
2. **Admin-autentikointi**: Suojaa admin-sivu
3. **Lisää pelejä**: Mahdolliset uudet pelit tulevaisuudessa
4. **Optimoinnit**: Kuvien ja suorituskyvyn optimointi
5. **Analytics**: Lisää Google Analytics tai vastaava

## Vercel-deployment

### Valmis Deploymenttiin
Sovellus on täysin valmis deploymenttiin Verceliin:
- ✅ Vercel serverless -funktiot (api/index.ts)
- ✅ Neon PostgreSQL -yhteensopivuus
- ✅ Vercel.json -konfiguraatio
- ✅ Migraatioskriptit valmiina

### Deployment-ohjeet
Katso täydelliset ohjeet tiedostosta: **VERCEL_DEPLOY.md**

Lyhyesti:
1. **Luo Neon-tietokanta** (ilmainen): neon.tech
2. **Deployaa Verceliin**: Yhdistä GitHub-repo
3. **Aseta ympäristömuuttujat**: DATABASE_URL, PRINTFUL_API_TOKEN, SESSION_SECRET
4. **Aja migraatiot**: `npm run db:migrate`

## Huomioitavaa

### Tunnetut Rajoitukset
- Ei ostoskorifunktiota (tuotteet näytetään, mutta ei voi ostaa vielä)
- Ei autentikointia admin-sivulle (lisää tarvittaessa)

### Seuraavat Askeleet
1. **Deploy Verceliin** (katso VERCEL_DEPLOY.md)
2. Lisää tuotteita Printful-kauppaan
3. Lisää ostoskorifunktio ja checkout-prosessi
4. Lisää admin-autentikointi
5. Optimoi kuvat ja suorituskyky

## Yhteystiedot
Projekti luotu Porin linjojen kuljettajalle - Bussipukki
