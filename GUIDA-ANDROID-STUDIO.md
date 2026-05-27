# 📱 Guida — Installare Android Studio e generare l'APK

Tempo richiesto: **~45 minuti** (30 min download + 15 min setup).
Spazio disco: **~10 GB** (Android Studio + SDK + emulatore).

---

## 1. Scarica Android Studio

1. Vai su https://developer.android.com/studio
2. Clicca "Download Android Studio" (versione Windows 64-bit)
3. Accetta i termini
4. **Salva il file `.exe`** (~1.2 GB) — magari sul Desktop

## 2. Installa

1. Doppio click sul `.exe` → si apre l'installer
2. Lascia tutte le opzioni di default (Next → Next → Install)
3. **Importante**: durante "Setup Wizard" al primo avvio:
   - Tipo installazione: **Standard** (consigliato)
   - Tema: scegli tu (Dark consigliato 🌙)
   - SDK Components: lascia preselezionati (~7 GB di download in background)
4. Aspetta che scarichi SDK + Emulatore (~15-20 min)

## 3. Apri il progetto What Do You Mean?

Dalla cartella del progetto, esegui in PowerShell o terminale:

```powershell
cd C:\Users\luisc\WhatDoYouMean-App
npx cap open android
```

Si aprirà Android Studio col progetto caricato. La prima apertura impiega **5-10 minuti** per scaricare le dipendenze Gradle — è normale, lascia stare.

## 4. Test su emulatore (consigliato prima)

1. In Android Studio, in alto a destra clicca **Device Manager**
2. Click "Create Device" → scegli **Pixel 6** o **Pixel 8** → Next
3. Scegli system image **Android 13 (API 33)** o superiore → Download → Next → Finish
4. Torna alla finestra principale, in alto seleziona l'emulatore creato
5. Click sul tasto verde **▶ Run 'app'**
6. L'emulatore si avvia (1-2 min) e l'app si installa automaticamente
7. **Concedi il permesso microfono** quando appare il popup
8. Prova SFIDA BOCCALONE (DA SOLO) → ascolta → registra → verdetto

## 5. Test su telefono fisico (più reale)

1. Sul telefono Android: **Impostazioni → Info → tocca 7 volte "Numero build"** (sblocca opzioni sviluppatore)
2. **Impostazioni → Sistema → Opzioni sviluppatore → Attiva "Debug USB"**
3. Collega il telefono al PC con cavo USB
4. Sul telefono accetta il fingerprint del PC
5. In Android Studio, in alto seleziona il tuo telefono come device
6. Click **▶ Run** → l'app si installa sul tuo telefono!

## 6. Generare APK firmato per Play Store

Quando sei pronto per pubblicare:

1. **Build → Generate Signed Bundle / APK** (menu in alto)
2. Scegli **Android App Bundle** (.aab — formato richiesto da Play Store)
3. **Create new keystore** (chiave di firma — TIENILA AL SICURO, sempre la stessa per tutta la vita dell'app):
   - Path: `C:\Users\luisc\WhatDoYouMean-App\wdym-release.keystore`
   - Password: scegline una FORTE e SALVALA (es. in un password manager)
   - Alias: `wdym`
   - Validity: 25 years (default)
   - First & Last Name: Luigi Casto
   - Organization: lasciare vuoto o "Luigi Casto"
4. Build variant: **release**
5. Aspetta la build (~3-5 min)
6. Il file `.aab` finale è in `android/app/release/app-release.aab` — **questo è il file da caricare sul Play Store**

---

## ⚠️ Cose da non perdere mai

- **Il keystore (.keystore)** + le password → se le perdi NON puoi più aggiornare l'app dopo averla pubblicata
- **L'appId** (`com.luigicasto.wdym`) → non si può cambiare dopo la pubblicazione
- **Il file `wdym-release.keystore`** → copialo su Google Drive crittato o password manager
