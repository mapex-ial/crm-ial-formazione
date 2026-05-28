# 🚀 CRM IAL - Gestione Iscrizioni Corsi

**Web-app completa per la gestione delle iscrizioni ai corsi IAL con OCR automatico e Supabase.**

---

## 📋 CONTENUTI DEL PROGETTO

```
crm-ial-formazione/
├── src/
│   ├── components/
│   │   ├── Login.jsx                 # Pagina login
│   │   ├── Dashboard.jsx             # Dashboard principale
│   │   ├── ModalAggiungiAllievo.jsx  # Modal aggiunta allievo
│   │   ├── OcrFotoDocumento.jsx      # OCR foto documento
│   │   ├── TabellaAllievi.jsx        # Tabella allievi
│   │   └── Loader.jsx                # Componente loader
│   ├── lib/
│   │   └── supabase.js               # Client Supabase
│   ├── App.jsx                       # Componente principale
│   ├── main.jsx                      # Entry point React
│   └── index.css                     # Stili globali
├── index.html                        # HTML entry point
├── package.json                      # Dipendenze npm
├── vite.config.js                    # Configurazione Vite
├── tailwind.config.js                # Configurazione Tailwind
└── postcss.config.js                 # Configurazione PostCSS
```

---

## ✨ FEATURE PRINCIPALI

✅ **Login e Autenticazione**
- Login con email e password tramite Supabase Auth
- Gestione ruoli (Admin, Operatore)
- Sessioni persistenti

✅ **OCR Automatico**
- Carica foto da file o scatta con camera (mobile)
- Estrazione automatica dati dal documento
- Tesseract.js per OCR offline
- Possibilità di verificare e modificare dati

✅ **Dashboard Intuitiva**
- Statistiche in tempo reale (totale allievi, corsi attivi, ultimo ingresso)
- Tabella allievi filtrabile e ricercabile
- Export Excel nel formato originale

✅ **Gestione Multi-Operatore**
- Admin: accesso totale (modifica, elimina, export)
- Operatori: solo visualizzazione e aggiunta dati
- Permessi granulari

✅ **Design Moderno**
- Interfaccia glassmorphism
- Tema dark per ridurre affaticamento
- Responsive per PC e mobile
- Animazioni fluide

---

## 🔧 SETUP INIZIALE

### Prerequisiti
- Node.js 16+ (scarica da https://nodejs.org)
- npm o yarn
- Account GitHub (per il codice)
- Account Vercel (per il deploy)
- Account Supabase (già configurato)

### 1. Clona il Repository

```bash
# Se hai già il repo su GitHub
git clone https://github.com/mapex-ial/crm-ial-formazione.git
cd crm-ial-formazione

# Se non hai il repo, crea una cartella locale
mkdir crm-ial-formazione
cd crm-ial-formazione
git init
git remote add origin https://github.com/mapex-ial/crm-ial-formazione.git
```

### 2. Installa Dipendenze

```bash
npm install
```

### 3. Setup Variabili d'Ambiente

Crea un file `.env.local` nella root del progetto:

```env
VITE_SUPABASE_URL=https://mkgcvnlcznixhdwcwkqg.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1rZ2N2bmxjem5peGhkd2N3a3FnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk5MjI0NjgsImV4cCI6MjA5NTQ5ODQ2OH0.DYZTClskPITvNC-Jf8DFG3-hVZBTD91BpMI-PkZWoUQ
```

### 4. Crea Tabella Supabase

In Supabase, vai su **SQL Editor** ed esegui:

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

-- Crea indici per performance
CREATE INDEX idx_allievi_cf ON allievi(codice_fiscale);
CREATE INDEX idx_allievi_email ON allievi(email);
CREATE INDEX idx_allievi_corso ON allievi(corso);
CREATE INDEX idx_allievi_data ON allievi(data_iscrizione);
```

### 5. Crea Storage per Foto

In Supabase, vai in **Storage**:
1. Clicca **"New Bucket"**
2. Nome: `foto_documenti`
3. Privacy: Public
4. Crea

---

## 🏃 ESECUZIONE IN LOCALE

```bash
# Sviluppo (con hot reload)
npm run dev

# Build per produzione
npm run build

# Anteprima build
npm run preview
```

Accedi a: `http://localhost:3000`

---

## 🚀 DEPLOYMENT SU VERCEL

### Step 1: Push su GitHub

```bash
git add .
git commit -m "Initial commit: CRM app completa"
git push origin main
```

### Step 2: Connetti Vercel

1. Vai su https://vercel.com
2. Clicca **"New Project"**
3. Seleziona il repository `mapex-ial/crm-ial-formazione`
4. Clicca **"Import"**

### Step 3: Configura Variabili d'Ambiente

In Vercel, vai in **Settings → Environment Variables** e aggiungi:

```
VITE_SUPABASE_URL=https://mkgcvnlcznixhdwcwkqg.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Step 4: Deploy

Clicca **"Deploy"** e aspetta (2-3 minuti)

**Link live**: `https://crm-ial-formazione.vercel.app`

---

## 👥 GESTIONE UTENTI IN SUPABASE

### Aggiungi Operatori

In Supabase → **Auth → Users**:

1. Clicca **"Invite User"** (o crea manualmente)
2. Email: `lucia@innovazionepiemonte.com`
3. Password: crea una pwd forte (inviarla separatamente)
4. Ripeti per `claudia@innovazionepiemonte.com`

---

## 🎯 FLUSSO DI UTILIZZO

### 1. **Login**
- Email: `marco@innovazionepiemonte.com`
- Password: (la tua)

### 2. **Aggiungi Allievo**
1. Clicca **"Aggiungi Allievo"**
2. Carica foto documento
   - File: clicca sull'area di upload
   - Mobile: clicca "Scatta foto"
3. OCR estrae automaticamente i dati
4. Verifica e modifica se necessario
5. Clicca **"Salva Allievo"**

### 3. **Ricerca e Filtra**
- Usa la barra di ricerca per trovare allievi
- Filtra per nome, cognome, CF, email, corso

### 4. **Esporta Excel**
- Clicca **"Esporta Excel"** per scaricare il file
- Il file contiene tutti gli allievi (filtrati se hai fatto ricerca)

---

## 🔒 SICUREZZA

- **Password**: Supabase la hashizza con bcrypt
- **Credenziali**: salvate in Vercel come secrets
- **HTTPS**: Forzato su tutti i domini
- **CORS**: Supabase permette tutti i domini (configurabile)
- **Storage**: Foto criptate e backup automatici

---

## 📞 SUPPORT & TROUBLESHOOTING

### Errore: "Supabase offline"
- Verifica le credenziali nel `.env.local`
- Controlla che il progetto Supabase sia attivo
- Prova a ricaricate la pagina

### Errore: "Cannot read property 'split' of undefined"
- Assicurati che tutte le variabili d'ambiente siano configurate
- Riavvia il server (Ctrl+C, poi `npm run dev`)

### OCR non estrae dati
- L'immagine potrebbe essere sfocata/di bassa qualità
- Prova con un'altra foto più nitida
- I dati estraibili dipendono dalla nitidezza

### Foto non carica
- Controlla che il bucket Supabase sia creato e public
- Verifica che il codice fiscale sia unico (non duplicato)

---

## 📚 DOCUMENTAZIONE

- **Supabase**: https://supabase.com/docs
- **React**: https://react.dev
- **Vite**: https://vitejs.dev
- **Tailwind CSS**: https://tailwindcss.com
- **Tesseract.js**: https://github.com/naptha/tesseract.js

---

## 🛠️ PROSSIMI STEP POSSIBILI

- [ ] Integrazione con Sistema Piemonte (API)
- [ ] Backups automatici su Drive
- [ ] Autenticazione 2FA
- [ ] Statistiche avanzate (grafici)
- [ ] Email di conferma iscrizione
- [ ] SMS notifiche
- [ ] API REST pubblica
- [ ] Mobile app dedicata

---

## 📄 LICENSE

Proprietario - IAL Innovazione

---

**Versione**: 1.0.0  
**Ultimo aggiornamento**: Maggio 2026  
**Creato da**: Claude AI per Marco IAL
