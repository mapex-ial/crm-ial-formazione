# 🚀 GUIDA RAPIDA DEPLOYMENT - SOLO PER MARCO

Segui ESATTAMENTE questi step in ordine. Non saltare niente.

---

## ✅ STEP 1: CREA LA CARTELLA DEL PROGETTO

Apri il tuo PC e crea una cartella:
```
C:\Users\Marco\crm-ial-formazione
```

(O dovunque preferisci)

---

## ✅ STEP 2: SCARICA I FILE

Da questo chat, scarica TUTTI i file e mettili nella cartella creata.

Dovresti avere questi file nella cartella:
```
crm-ial-formazione/
├── src/
│   ├── components/
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── ModalAggiungiAllievo.jsx
│   │   ├── OcrFotoDocumento.jsx
│   │   ├── TabellaAllievi.jsx
│   │   └── Loader.jsx
│   ├── lib/
│   │   └── supabase.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

---

## ✅ STEP 3: INSTALLA NODE.JS (se non ce l'hai)

1. Vai su https://nodejs.org
2. Scarica la versione LTS (Long Term Support)
3. Installa seguendo le istruzioni
4. Chiudi e riapri Terminal/PowerShell

---

## ✅ STEP 4: APRI TERMINAL NELLA CARTELLA

Windows:
1. Vai nella cartella `C:\Users\Marco\crm-ial-formazione`
2. Premi Shift + Click destro
3. Scegli "Apri PowerShell qui"

Mac/Linux:
```bash
cd /percorso/a/crm-ial-formazione
```

---

## ✅ STEP 5: INSTALLA DIPENDENZE

Nel terminal, scrivi:
```bash
npm install
```

Aspetta che finisca (5-10 minuti, potrebbe sembrare lento... è normale!)

---

## ✅ STEP 6: CREA FILE .ENV

Crea un file chiamato `.env.local` nella root della cartella (stessa cartella dove c'è `package.json`).

Copia dentro ESATTAMENTE questo:

```
VITE_SUPABASE_URL=https://mkgcvnlcznixhdwcwkqg.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1rZ2N2bmxjem5peGhkd2N3a3FnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk5MjI0NjgsImV4cCI6MjA5NTQ5ODQ2OH0.DYZTClskPITvNC-Jf8DFG3-hVZBTD91BpMI-PkZWoUQ
```

Salva il file.

---

## ✅ STEP 7: CREA TABELLA SUPABASE

Questo è IMPORTANTE!

1. Vai su https://supabase.com
2. Log in con `marco@innovazionepiemonte.com`
3. Clicca sul progetto "CRM-IAL-Formazione" (o come l'hai chiamato)
4. Nel menu a sinistra, clicca **"SQL Editor"**
5. Clicca **"New Query"**
6. Copia e incolla QUESTO SQL:

```sql
CREATE TABLE allievi (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  num_registro TEXT,
  codice_fiscale TEXT NOT NULL UNIQUE,
  cognome TEXT NOT NULL,
  nome TEXT NOT NULL,
  data_nascita DATE,
  nazione_nascita TEXT,
  provincia_nascita TEXT,
  comune_nascita TEXT,
  sesso TEXT,
  cittadinanza TEXT,
  nazione_residenza TEXT NOT NULL,
  provincia_residenza TEXT NOT NULL,
  comune_residenza TEXT NOT NULL,
  indirizzo_residenza TEXT NOT NULL,
  cap TEXT NOT NULL,
  titolo_studio TEXT,
  email TEXT NOT NULL,
  telefono TEXT NOT NULL,
  profilazione TEXT,
  sal TEXT,
  data_iscrizione DATE NOT NULL DEFAULT CURRENT_DATE,
  id_corso TEXT NOT NULL,
  cod_corso TEXT NOT NULL,
  edizione TEXT,
  corso TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  created_by TEXT
);

CREATE INDEX idx_allievi_cf ON allievi(codice_fiscale);
CREATE INDEX idx_allievi_email ON allievi(email);
CREATE INDEX idx_allievi_corso ON allievi(corso);
CREATE INDEX idx_allievi_data ON allievi(data_iscrizione);
```

7. Clicca **"Run"** (o Ctrl+Enter)
8. Se vedi "Success" ✓, perfetto!

---

## ✅ STEP 8: CREA STORAGE SUPABASE

1. Nel menu Supabase, vai su **"Storage"** (a sinistra)
2. Clicca **"New Bucket"**
3. Nome: `foto_documenti`
4. Privacy: **Public** (importante!)
5. Clicca **"Create Bucket"**

---

## ✅ STEP 9: TESTA IN LOCALE

Nel terminal (dove hai installato le dipendenze):
```bash
npm run dev
```

Dovresti vedere un messaggio tipo:
```
➜  Local:   http://localhost:5173/
```

Clicca sul link o copia l'URL nel browser.

**Dovresti vedere la pagina di LOGIN!** 🎉

Prova a fare login con:
- Email: `marco@innovazionepiemonte.com`
- Password: (la tua password Supabase)

---

## ✅ STEP 10: PUSH SU GITHUB

Una volta che il test locale funziona, vai su GitHub.

### Se non hai un repository GitHub:

1. Vai su https://github.com
2. Log in (o crea account)
3. Clicca **"New Repository"**
4. Nome: `crm-ial-formazione`
5. Descrizione: CRM per gestione iscrizioni IAL
6. Visibility: **Public**
7. Clicca **"Create Repository"**

### Push dei file:

Nel terminal della cartella:

```bash
git init
git add .
git commit -m "Initial commit: CRM app completa"
git branch -M main
git remote add origin https://github.com/mapex-ial/crm-ial-formazione.git
git push -u origin main
```

(Se ti chiede login, usa il tuo account GitHub)

---

## ✅ STEP 11: DEPLOY SU VERCEL

1. Vai su https://vercel.com
2. Clicca **"Sign Up"** o Log in
3. Clicca **"New Project"**
4. **Import** → Seleziona `crm-ial-formazione` da GitHub
5. Clicca **"Import"**
6. **Environment Variables**:
   - Clicca **"Add"**
   - Name: `VITE_SUPABASE_URL`
   - Value: `https://mkgcvnlcznixhdwcwkqg.supabase.co`
   - Ripeti per `VITE_SUPABASE_ANON_KEY` con il tuo API key

7. Clicca **"Deploy"**

Aspetta 2-3 minuti. Dovrebbe dirsi "Ready"! ✅

**Link app**: `https://crm-ial-formazione.vercel.app`

---

## 🎉 FATTO!

La tua app è LIVE!

Accedi con:
- Email: `marco@innovazionepiemonte.com`
- Password: (la tua)

Prova a:
1. Clicca **"Aggiungi Allievo"**
2. Carica una foto di documento
3. L'OCR deve estrarre i dati automaticamente
4. Modifica se serve
5. Clicca **"Salva Allievo"**

---

## 🆘 PROBLEMI?

### "Cannot find module 'react'"
```bash
npm install
```

### "npm: comando non trovato"
Installa Node.js da https://nodejs.org

### "Supabase offline"
- Controlla il `.env.local` (sono le chiavi giuste?)
- Riavvia il server (Ctrl+C, poi `npm run dev`)

### App non appare su Vercel
- Aspetta 5 minuti (Vercel sta compilando)
- Riccarica la pagina Vercel (F5)
- Controlla i "Logs" in Vercel per errori

---

## 📱 COME AGGIUNGERE LUCIA E CLAUDIA

Una volta che tutto funziona:

1. In Supabase → **Auth → Users**
2. Clicca **"Invite User"**
3. Email: `lucia@innovazionepiemonte.com`
4. Password: (generane una forte)
5. Clicca **"Send Invite"**
6. Ripeti per Claudia

Loro riceveranno email con credenziali. Possono loggare su:
```
https://crm-ial-formazione.vercel.app
```

---

## ✨ DALLA PROSSIMA VOLTA

Quando aggiorni il codice:

1. Apri Terminal nella cartella
2. Fai le modifiche ai file
3. ```bash
   git add .
   git commit -m "Descrizione cambio"
   git push
   ```
4. Vercel automaticamente redeploya! (aspetta 1-2 min)

---

**Hai domande? Contattami!**

Buon lavoro! 🚀
