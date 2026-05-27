# 🌐 Roadmap FASE C — App Completa Online

**Status**: Sessione 1 di 6 in corso.
**Target**: App pubblicabile su Play Store con leaderboard mondiale, PvP online, profilo utente.

---

## 📐 Stack tecnico scelto

| Componente | Tecnologia | Costo |
|---|---|---|
| **Backend** | Firebase (Google Cloud) | Free fino a 10k MAU |
| **Database** | Firestore | Free fino a 50k reads/giorno + 20k writes/giorno |
| **Autenticazione** | Firebase Auth Anonymous | Free illimitato |
| **Real-time PvP** | Firestore real-time listeners | Incluso |
| **Hosting (opzionale)** | Firebase Hosting | Free 10GB/mese |
| **Push notifications** | Firebase Cloud Messaging | Free illimitato |

**Perché Firebase invece di server custom**:
- Zero server da gestire (serverless)
- SDK ufficiale per Capacitor → integrazione liscia su Android
- Free tier sufficiente per ~10.000 utenti attivi/mese
- Scaling automatico
- Si paga solo quando si cresce davvero

---

## 🗂️ Schema dati Firebase

### Collection: `users`
```javascript
{
  uid: "abc123XYZ",          // generato da Firebase Auth
  nickname: "Mario",         // scelto dall'utente
  avatar: "fox",             // id dello shop
  coins: 1250,
  totalScore: 8420,          // somma di TUTTI i punti fatti
  gamesPlayed: 45,
  gamesWon: 12,
  bestScore: 28,
  country: "IT",             // dal locale del device
  createdAt: timestamp,
  lastSeen: timestamp
}
```

### Collection: `leaderboard_weekly` (top 100)
```javascript
{
  uid: "abc123XYZ",
  nickname: "Mario",
  avatar: "fox",
  weekScore: 1450,           // resettato ogni settimana
  country: "IT",
  rank: 47
}
```

### Collection: `matches`
```javascript
{
  matchId: "m_abc123",
  player1: { uid, nickname, avatar, ready: false, scores: [] },
  player2: { uid, nickname, avatar, ready: false, scores: [] },
  queue: [{l:1,w:12,g:"de-DE"}, ...],
  state: "waiting" | "playing" | "finished",
  winner: "uid" | "tie" | null,
  createdAt: timestamp
}
```

### Collection: `matchmaking_queue`
```javascript
{
  uid: "abc123XYZ",
  nickname: "Mario",
  joinedAt: timestamp,
  status: "waiting" | "matched"
}
```

---

## 🎯 Sessioni di lavoro

### ✅ Sessione 1 (OGGI) — Mockup UI

- [x] Roadmap dettagliata (questo file)
- [ ] Schermata Profilo (mockup, dati locali)
- [ ] Schermata Leaderboard (mockup, top 10 fake)
- [ ] Schermata Match Online (placeholder "in arrivo")
- [ ] Bottoni in Home per accedere
- [ ] File `firebase-config.js` placeholder con TODO

### 🟡 Sessione 2 — Setup Firebase + Auth + Profilo

**Cosa devi fare TU prima della sessione 2**:
1. Vai su https://console.firebase.google.com/ (con account Google)
2. "Add project" → nome "WhatDoYouMean" → continua
3. Disabilita Google Analytics (lo abbiamo già nostro)
4. "Create project" (~30 sec)
5. Click sull'icona Android → "Register app":
   - Package name: `com.luigicasto.wdym` (deve essere ESATTO)
   - Nickname: "WDYM Android"
   - Skip SHA-1 per ora
6. **Scarica `google-services.json`** e mandalo a me / mettilo in `android/app/`
7. Nel menu sinistro: **Build → Authentication** → Get started → tab "Sign-in method" → abilita **"Anonymous"**
8. Nel menu sinistro: **Build → Firestore Database** → Create database → Production mode → location: `europe-west3` (Francoforte)

**Quello che farò io in sessione 2**:
- Installo plugin Capacitor Firebase
- Configuro Firebase nell'app
- Auth anonima (genera UID univoco al primo avvio)
- Schermata "Crea profilo" (scegli nickname + avatar)
- Sincronizzazione monete con cloud
- Stat utente (partite, vittorie, record)

### 🟢 Sessione 3 — Leaderboard mondiale LIVE

**Quello che farò io**:
- Scrittura punteggio su `leaderboard_weekly` ad ogni partita
- Lettura top 100 mondiale con paginazione
- Posizione personale ("Tu sei al #47 nel mondo")
- Filtro per nazione (top Italia, top Spagna, etc.)
- Reset settimanale automatico (Cloud Function semplice)
- Animazioni nuova posizione

### 🔵 Sessione 4 — Match Online Random

**Quello che farò io**:
- Lobby di matchmaking via Firestore queue
- Quando 2 giocatori in coda → creazione `matches/m_xxx`
- Listener real-time per sincronizzare round
- Gestione disconnessione (timeout 30s)
- Notifiche "stai per essere matchato"
- Premio extra: vincere online = +50 monete (vs 30 del link WhatsApp)

### 🟣 Sessione 5 — Inviti contatti telefonici

**Quello che farò io**:
- Plugin Capacitor Contacts (permission rubrica Android)
- Picker contatti nativo
- Invio invito via:
  - WhatsApp (se hanno numero + WA installato)
  - SMS (se non hanno WA)
  - Email (fallback)
- Link sfida con `?c=` (riusa logica PvP via link)
- Anti-spam: max 5 inviti al giorno

### 🟠 Sessione 6 — Test + Polish + Submission

**Quello che farò io**:
- Test su emulatore + telefono reale
- Fix bug emersi
- Animazioni e transitions migliorate
- Privacy policy + Terms of Service (template)
- Optimizzazione bundle size
- Build APK signed
- Submission Google Play

**Quello che dovrai fare TU**:
- Account Google Play Console ($25 una tantum)
- Compilare scheda Play Store con materiali da `MARKETING-BRIEF.md`
- Pubblicare e attendere review (3-5 giorni)

---

## 💰 Costi totali stimati FASE C

| Voce | Costo |
|---|---|
| Account Firebase | 0€ (free tier) |
| Account Google Play Console | $25 una tantum (~23€) |
| Hosting + database | 0€ fino a 10.000 utenti/mese |
| Privacy Policy generator | 0-50€ (gratis con app-privacy-policy-generator.firebaseapp.com) |
| **TOTALE iniziale** | **~25-75€** |
| Costi ricorrenti (primi 6 mesi) | **0€/mese** (sotto free tier) |

---

## 🔒 Privacy & GDPR — cosa rispettare

Dato che memorizzeremo dati utenti (UID, nickname, punteggi), serve:

1. **Privacy Policy chiara** (template fornito)
2. **Pulsante "Cancella account"** che cancella tutti i dati da Firestore
3. **Età minima dichiarata**: 13+ (per evitare obblighi COPPA/PEGI Junior)
4. **No dati sensibili**: niente email, telefono, posizione GPS
5. **Cookie banner**: non necessario perché non usiamo cookie tracking (Google Analytics 4 è "consent mode" e non richiede banner se non profila)

Tutto questo è gestibile, non spaventarti.

---

## 🚀 Cosa cambia per l'utente finale

| Prima (V3 attuale) | Dopo (FASE C) |
|---|---|
| Gioca offline da solo | Gioca offline OR online |
| Sfida amici via WhatsApp link | Sfida amici via WA link OR contatti telefonici OR random worldwide |
| Punteggio salvato sul telefono | Punteggio salvato sul telefono + sincronizzato cloud |
| Nessuna classifica | Classifica mondiale + nazionale settimanale |
| Nessun profilo | Profilo personale con stats, livello, achievement |
| Monete locali | Monete sincronizzate (vinci da telefono A, le vedi su telefono B) |
| Devi tenere il link WA | Account auto-restore se reinstalli l'app |
