# 🗺️ Roadmap — What Do You Mean?

Piano di sviluppo in 3 fasi. Decisione: **ship first, expand later**.

---

## ✅ V2 — FATTO (oggi)

- Single-player "Sfida Boccalone"
- Share virale podio (immagine 1080×1920 generata)
- Confetti su 10/10
- Sound effects (Web Audio API)
- PWA installabile + funziona offline
- Manifest + Service Worker
- 5 parole italiane TOSTE in DB[1]
- Cap difficoltà a 2 parole
- 12 lingue × 35+ parole × 30+ frasi di 2 parole

---

## 🚀 FASE A — LANCIO PLAY STORE (settimana 1)

### Obiettivo
Pubblicare V2 così com'è. Raccogliere primi 1.000 download e dati.

### TODO
- [ ] Installare Android Studio (vedi `GUIDA-ANDROID-STUDIO.md`)
- [ ] Generare PNG icone (apri `icons/generate-icons.html`)
- [ ] Eseguire `npx cap open android` → aprire progetto
- [ ] Test su emulatore: home, solo, share, confetti, sound
- [ ] Generare APK firmato (Build → Generate Signed Bundle)
- [ ] **Salvare keystore** su Google Drive crittato
- [ ] Creare account Play Console ($25 una-tantum)
- [ ] Creare privacy policy (https://app-privacy-policy-generator.firebaseapp.com/)
- [ ] Caricare bundle .aab + screenshot + feature graphic
- [ ] Submission → review Google (3-5 giorni)
- [ ] Day-1 launch: TikTok + IG + Reddit + DM amici (vedi `MARKETING-BRIEF.md`)

### KPI target prime 4 settimane
- 3.000+ downloads
- Rating ≥ 4.3
- 500+ share virali generate
- 200+ install PWA via browser

---

## 📈 FASE B — PvP via WhatsApp + Monete + Shop (settimana 2-3)

### Obiettivo
Trasformare l'app da gioco singolo a **piattaforma sociale** senza server, senza costi.

### Feature 1 — PvP via Link "Sfida un amico su WhatsApp"

**Flusso utente**:
1. Giocatore A in home tocca "⚔️ SFIDA UN AMICO"
2. A inserisce il suo nome
3. App pesca 3 parole random + 3 lingue random (stesso pool per A e B)
4. A registra le sue 3 pronunce → vede i suoi 3 voti (totale es. 24/30)
5. App genera un link tipo:
   ```
   https://luiscasto2000-svg.github.io/What-do-you-mean-/?c=eyJhIjoiTHVpZ2kiLCJzIjoyNCwicCI6WyJGYXJmYWxsYTpkZS1ERSIsLi4uXX0=
   ```
   Il `?c=` contiene state codificato in base64: nome A, punteggio A, lista [parola:lingua].
6. A condivide il link su WhatsApp con messaggio prefilled: *"Ti sfido a What Do You Mean? Ho fatto 24/30. Battimi: [link]"*
7. B apre il link → app rileva il parametro `c=` → mostra schermata "[A] ti sfida! Ha fatto 24/30."
8. B inserisce il SUO nome → registra le SUE 3 pronunce sulle STESSE parole/lingue di A
9. App calcola vincitore (totale B vs totale A) e mostra podio "TU vs A"
10. B può generare un link risposta da rimandare ad A (richiamo)

**Vantaggi**:
- Niente server
- Ogni sfida = link viralizzato su WhatsApp = nuova installazione potenziale
- Stato codificato + checksum HMAC nel link per evitare cheating banali
- Asincrono: A e B non devono essere online contemporaneamente

**Implementazione tecnica**:
- Funzione `encodeChallenge(state)` → JSON → base64url
- Funzione `decodeChallenge(string)` → state + verifica checksum
- All'avvio: `URLSearchParams` → se `c` presente → entra in modalità "rispondi alla sfida"
- Eventi GA: `pvp_challenge_create`, `pvp_challenge_accept`, `pvp_challenge_win`

**Stima**: 3-4 giorni

### Feature 2 — Sistema Monete 🪙

**Regole guadagno (offline)**:
- +10 monete: completi una partita solo
- +20 monete: prendi 10/10 in un round
- +30 monete: vinci una sfida via WhatsApp
- +50 monete: prima volta che batti un record personale
- +5 monete: prima share virale del giorno
- +100 monete bonus: 7 giorni di gioco consecutivi (streak)

**Persistenza**: `localStorage.wdym_coins`

**Visualizzazione**: pillola gialla in alto a destra in Home con `💰 1.250`

**Anti-cheat banale**:
- Hash check del saldo + ultima transazione
- Reset locale = perde monete (deterrente)

**Stima**: 1-2 giorni

### Feature 3 — Shop 🛍️

**8 Avatar sbloccabili** (al posto dei 8 esistenti emoji):
- 🥖 Baguette Boy — 100🪙
- 🌮 Taco Master — 100🪙
- 🍣 Sushi San — 200🪙
- 🐉 Drago Cinese — 300🪙
- 🦅 Aquila Russa — 300🪙
- 🐪 Cammello Arabo — 400🪙
- 🦘 Canguro Australiano — 500🪙
- 👑 Re del Mondo — 1.000🪙 (top tier)

**2 Voci alternative del Maestro Boccalone**:
- 🧑‍🏫 Maestro Severo (più sarcasmo, voti più bassi) — 500🪙
- 😇 Maestro Buono (più dolce, voti più alti) — 500🪙

**Frasi premium** (10 frasi extra "VIP" per LV2):
- "Spaghetti carbonara" "Pizza margherita" ecc. — 200🪙 il pacchetto

**Implementazione**: schermata Shop accessibile dalla Home, persistenza in `localStorage.wdym_unlocked` come array di IDs.

**Stima**: 2 giorni

### TOTALE FASE B
~6-8 giorni di sviluppo, **zero costi infrastrutturali**, massimo impatto su retention.

---

## 🌐 FASE C — PvP ONLINE REAL-TIME (mese 2-3, SE serve)

**Condizione di trigger**: se la FASE A raggiunge >5.000 download e gente lo chiede attivamente.

### Stack proposto
- **Firebase Realtime Database** (gratis fino a 50k utenti/mese)
- **Firebase Authentication** (login Google anonimo)
- **Cloud Functions** per matchmaking + anti-cheat
- **FCM** per push notifications

### Feature
- Login Google anonimo (no account password)
- Matchmaking lobby (cerca giocatore random ELO-based)
- Stanze private con codice (gioca con amici online)
- Leaderboard globale settimanale/mensile
- Trofei + achievement
- Push notification "Mario ti sfida"

### Costi
- Free tier Firebase basta fino a ~10.000 utenti attivi mese
- Oltre: ~5-15€/mese fino a 100k utenti

### Tempi
- 4-6 settimane

---

## Riferimenti
- `GUIDA-ANDROID-STUDIO.md` — installazione + build APK
- `MARKETING-BRIEF.md` — ASO + social + influencer + KPI
- `icons/generate-icons.html` — utility 1-click per PNG
- `npm run sync` — copia file + sincronizza in Android
