# Bussipukki - Jouluinen Nettisivu

## Yleiskatsaus
Bussipukki on jouluteemainen nettisivu Porin linjojen linja-auton kuljettajalle. Sivusto sisältää pelejä bussimatkustajille, TikTok live arvauspeliä sekä mock-verkkokaupan Bussipukki-tuotteille.

## Projektin Tila
**Valmis MVP** - Kaikki pääominaisuudet toiminnassa
- ✅ Jouluinen design (punainen, vihreä, kulta, kermanvärinen)
- ✅ Kaksi toimivaa peliä (palapeli ja pähkinälajittelu) pisteiden tallennuksella
- ✅ TikTok live arvaus -järjestelmä
- ✅ Admin-näkymä arvausten tarkasteluun
- ✅ Mock-verkkokauppa esimerkkituotteilla

## Tekninen Toteutus

### Tech Stack
- **Frontend**: React 18, Wouter (routing), TanStack Query (data fetching), Tailwind CSS
- **Backend**: Express.js, In-memory storage (MemStorage)
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

#### Sivut (client/src/pages)
1. **Home** (`/`) - Etusivu heroilla, peliesittelyllä ja toimintakehotteilla
2. **Games** (`/pelit`) - Pelihalli kahdella pelillä:
   - Joulupalapeli (drag-and-drop)
   - Pähkinälajittelu (muistipeli)
3. **TikTok Guess** (`/arvaus`) - Live-arvauslomake katsojille
4. **Shop** (`/kauppa`) - Mock-verkkokauppa Bussipukki-tuotteilla
5. **Admin** (`/admin`) - Dashboard kaikkien arvausten näyttämiseen

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

### 3. TikTok Live Arvaus
- Katsojat arvaavat vitsien määrän live-lähetystä varten
- Lomake: nimi/käyttäjätunnus + arvattu numero
- Confetti-efekti onnistuneen lähetyksen jälkeen
- Kaikki arvaukset tallentuvat tietokantaan

### 4. Admin Dashboard
- Näytä kaikki TikTok-arvaukset
- Automaattinen päivitys (5s välein)
- Tilastot: yhteensä, keskiarvo, pienin, suurin
- Taulukkonäkymä ajalla

### 5. Mock Verkkokauppa
- 6 esimerkkituotetta (mukit, t-paidat, hupparit)
- "Esimerkki" badget kaikilla tuotteilla
- Info: Printful-integraatio tulossa
- Disabled "Lisää koriin" -painikkeet

## Kehitysohjeita

### Projektin Ajaminen
```bash
npm run dev
```
Avaa selain: http://localhost:5000

### Tiedon Hallinta
- **In-memory storage**: Kaikki data tallennetaan muistiin (katoaa uudelleenkäynnistyksessä)
- Tuotantoon: Vaihda PostgreSQL-tietokantaan (schema jo määritelty)

### Tulevat Parannukset
1. **Printful API**: Oikean verkkokaupan integraatio kun API-token saadaan toimimaan
2. **Pisteet Leaderboard**: Näytä parhaat pisteet pelisivulla
3. **Lisää Pelejä**: Muistipeli, tietokilpailu bussireiteistä
4. **TikTok Historia**: Aikaisempien pelien tilastot
5. **Sosiaaliset Jaot**: Jaa pelitulokset sosiaaliseen mediaan

## Huomioitavaa

### Tunnetut Rajoitukset
- Mock-verkkokauppa (ei oikeita tuotteita tai ostoskorifunktiota)
- In-memory storage (data katoaa serverin uudelleenkäynnistyksessä)
- Ei autentikointia admin-sivulle (lisää tarvittaessa)

### Seuraavat Askeleet Käyttöönottoon
1. Lisää oikea Printful API -integraatio
2. Vaihda PostgreSQL-tietokantaan pysyvään tallennukseen
3. Lisää admin-autentikointi
4. Optimoi kuvat ja suorituskyky
5. Testaa cross-browser yhteensopivuus

## Yhteystiedot
Projekti luotu Porin linjojen kuljettajalle - Bussipukki
