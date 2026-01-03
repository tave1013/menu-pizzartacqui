# 🎉 GUIDA ORARI FESTIVI - Stile Google My Business

## 📋 INDICE
1. [Panoramica Sistema](#panoramica-sistema)
2. [Come Funziona](#come-funziona)
3. [Aggiungere/Modificare una Festività](#aggiungeremodificare-una-festività)
4. [Esempi Pratici](#esempi-pratici)
5. [Aggiornamento Date Variabili](#aggiornamento-date-variabili)
6. [Risoluzione Problemi](#risoluzione-problemi)
7. [Formato Date](#formato-date)

---

## 🎯 Panoramica Sistema

Il sistema di **orari festivi intelligente** imita il comportamento di **Google My Business**:

✅ **Mostra automaticamente** le festività nei prossimi 7 giorni  
✅ **Evidenzia con colori brand**: verde per aperti, rosso per chiusi  
✅ **Inserisce nome festività** tra parentesi accanto al giorno  
✅ **Sostituisce orario normale** con orario festivo quando presente  
✅ **Si aggiorna da solo** - non devi fare nulla durante la settimana  

### Esempio Visivo

**Settimana normale (senza festività vicine):**
```
Martedì        18:30 - 22:30
```

**Settimana con Epifania (nei prossimi 7 giorni):**
```
Martedì (Epifania)    18:30 - 22:30
                      Orario festivo
[testo in verde brand]
```

**Festività chiusa:**
```
Lunedì (Capodanno)    Chiuso (Festivo)
[badge rosso]
```

---

## ⚙️ Come Funziona

### File Principale
Il file da modificare è: **`src/data/menuData.ts`**

### Array delle Festività
Cerca questa sezione nel file:

```typescript
export const SPECIAL_OPENING_HOURS: SpecialHoliday[] = [
  // Le tue festività qui
];
```

### Logica Automatica
- Ogni volta che un cliente apre il popup orari, il sistema:
  1. Controlla la data odierna
  2. Calcola i prossimi 7 giorni
  3. Filtra le festività che cadono in questo periodo
  4. Le "inietta" nella tabella orari al giorno corretto
  5. Applica lo styling appropriato (verde/rosso)

### Niente Manutenzione Quotidiana
Non devi:
- ❌ Rimuovere manualmente festività passate
- ❌ Attivare/disattivare festività
- ❌ Aggiornare date ogni settimana

Devi solo:
- ✅ Aggiungere nuove festività una volta all'anno
- ✅ Aggiornare date variabili (Pasqua) ogni anno
- ✅ Modificare orari speciali se cambiano

---

## ➕ Aggiungere/Modificare una Festività

### 1️⃣ Apri il File
Naviga in: **`src/data/menuData.ts`**

### 2️⃣ Trova l'Array
Cerca `SPECIAL_OPENING_HOURS` (circa linea 150-200)

### 3️⃣ Formato Base

#### Festività CHIUSA
```typescript
{ date: '2026-01-01', name: 'Capodanno', closed: true }
```

#### Festività APERTA con orario speciale
```typescript
{ date: '2026-01-06', name: 'Epifania', hours: '18:30 - 22:30' }
```

#### Festività con orario PROLUNGATO
```typescript
{ date: '2026-12-31', name: 'San Silvestro', hours: '18:30 - 01:00' }
```

### 4️⃣ Struttura Completa

```typescript
{
  date: 'YYYY-MM-DD',      // Data esatta (formato ISO)
  name: 'Nome Festività',  // Nome da mostrare tra parentesi
  hours: 'HH:MM - HH:MM',  // Orario (se aperto)
  closed: true             // Oppure closed: true (se chiuso)
}
```

### 5️⃣ Dove Inserire
Aggiungi la nuova festività nell'array, **ordinata per data**:

```typescript
export const SPECIAL_OPENING_HOURS: SpecialHoliday[] = [
  // Gennaio
  { date: '2026-01-01', name: 'Capodanno', closed: true },
  { date: '2026-01-06', name: 'Epifania', hours: '18:30 - 22:30' },
  
  // Marzo - NUOVA AGGIUNTA
  { date: '2026-03-19', name: 'San Giuseppe', hours: '12:00 - 22:30' },
  
  // Aprile
  { date: '2026-04-05', name: 'Pasqua', hours: '12:00 - 22:30' },
  // ... resto festività
];
```

---

## 💡 Esempi Pratici

### Esempio 1: Aggiungere San Valentino Aperto
```typescript
{ date: '2026-02-14', name: 'San Valentino', hours: '19:00 - 23:30' }
```

**Risultato nel popup (se nei prossimi 7 giorni):**
```
Sabato (San Valentino)    19:00 - 23:30
                          Orario festivo
[verde brand]
```

---

### Esempio 2: Ferragosto Chiuso
```typescript
{ date: '2026-08-15', name: 'Ferragosto', closed: true }
```

**Risultato nel popup:**
```
Sabato (Ferragosto)    Chiuso (Festivo)
[badge rosso]
```

---

### Esempio 3: Festa Locale Speciale
```typescript
{ date: '2026-09-13', name: 'Festa Patrono', hours: '11:00 - 15:00, 18:00 - 01:00' }
```

**Risultato:**
```
Domenica (Festa Patrono)    11:00 - 15:00, 18:00 - 01:00
                            Orario festivo
[verde brand]
```

---

### Esempio 4: Capodanno con Orario Esteso
```typescript
{ date: '2026-12-31', name: 'San Silvestro', hours: '18:30 - 02:00' }
```

**Risultato:**
```
Giovedì (San Silvestro)    18:30 - 02:00
                           Orario festivo
[verde brand]
```

---

## 📅 Aggiornamento Date Variabili

### Pasqua e Pasquetta
Pasqua cambia ogni anno. **Devi aggiornare le date** ogni gennaio.

#### Come Trovare la Data di Pasqua 2027
1. Cerca online "Pasqua 2027"
2. Trova la data (esempio: 28 marzo 2027)
3. Pasquetta è sempre il giorno dopo (29 marzo 2027)

#### Modifica l'Array
```typescript
// AGGIORNARE OGNI ANNO
{ date: '2027-03-28', name: 'Pasqua', hours: '12:00 - 22:30' },
{ date: '2027-03-29', name: 'Pasquetta', hours: '12:00 - 22:30' },
```

### Altre Festività Fisse
Queste **non cambiano mai**:
- 1 Gennaio (Capodanno)
- 6 Gennaio (Epifania)
- 25 Aprile (Liberazione)
- 1 Maggio (Festa del Lavoro)
- 2 Giugno (Repubblica)
- 15 Agosto (Ferragosto)
- 1 Novembre (Tutti i Santi)
- 8 Dicembre (Immacolata)
- 25 Dicembre (Natale)
- 26 Dicembre (Santo Stefano)
- 31 Dicembre (San Silvestro)

---

## 🔧 Modificare Orario Esistente

### Scenario: Vuoi Aprire a Ferragosto 2026

**Prima (chiuso):**
```typescript
{ date: '2026-08-15', name: 'Ferragosto', closed: true }
```

**Dopo (aperto con orario speciale):**
```typescript
{ date: '2026-08-15', name: 'Ferragosto', hours: '19:00 - 23:00' }
```

⚠️ **IMPORTANTE**: Rimuovi `closed: true` quando aggiungi `hours`

---

### Scenario: Cambiare Orario San Silvestro

**Prima:**
```typescript
{ date: '2026-12-31', name: 'San Silvestro', hours: '18:30 - 01:00' }
```

**Dopo (nuovo orario):**
```typescript
{ date: '2026-12-31', name: 'San Silvestro', hours: '19:00 - 02:00' }
```

---

## 📅 Formato Date

### Formato Obbligatorio: `YYYY-MM-DD`

#### ✅ CORRETTO
```typescript
'2026-01-06'  // 6 gennaio 2026
'2026-12-25'  // 25 dicembre 2026
'2027-04-18'  // 18 aprile 2027
```

#### ❌ SBAGLIATO
```typescript
'06-01-2026'  // Ordine errato
'2026/01/06'  // Slash invece di trattini
'6-1-2026'    // Senza zero padding
'2026-1-6'    // Senza zero padding
```

### Tabella Conversione Mesi
| Mese      | Numero |
|-----------|--------|
| Gennaio   | 01     |
| Febbraio  | 02     |
| Marzo     | 03     |
| Aprile    | 04     |
| Maggio    | 05     |
| Giugno    | 06     |
| Luglio    | 07     |
| Agosto    | 08     |
| Settembre | 09     |
| Ottobre   | 10     |
| Novembre  | 11     |
| Dicembre  | 12     |

---

## 🚀 Salvare e Deployare

### 1. Salva il File
Dopo le modifiche, salva `menuData.ts` (Cmd/Ctrl + S)

### 2. Commit Git
```bash
git add src/data/menuData.ts
git commit -m "feat: aggiornato orari festivi [nome festività]"
```

### 3. Push
```bash
git push origin main
```

### 4. Attendi Deploy
Il sito si aggiorna automaticamente in **1-2 minuti**.

### 5. Verifica
Apri il menu → Tap su icona "i" → Controlla che la festività appaia correttamente (solo se nei prossimi 7 giorni!)

---

## 🐛 Risoluzione Problemi

### ❓ Problema: Festività Non Appare

#### Causa 1: Festività Troppo Lontana
La festività appare **solo se nei prossimi 7 giorni**.

**Soluzione:** Aspetta che la festività sia vicina, oppure testa cambiando temporaneamente la data.

#### Causa 2: Errore Formato Data
**Soluzione:** Verifica che la data sia nel formato `YYYY-MM-DD` con zero padding.

```typescript
// ❌ SBAGLIATO
{ date: '2026-1-6', name: 'Epifania', hours: '18:30 - 22:30' }

// ✅ CORRETTO
{ date: '2026-01-06', name: 'Epifania', hours: '18:30 - 22:30' }
```

#### Causa 3: Errore TypeScript
Se vedi errori in VS Code, controlla:
- Virgole tra oggetti
- Sintassi corretta
- Parentesi graffe chiuse

---

### ❓ Problema: Orario Sbagliato

#### Causa: hours con Spazi Extra
```typescript
// ❌ SBAGLIATO
{ date: '2026-01-06', name: 'Epifania', hours: '18:30-22:30' } // Manca spazio

// ✅ CORRETTO
{ date: '2026-01-06', name: 'Epifania', hours: '18:30 - 22:30' } // Con spazi
```

---

### ❓ Problema: Colori Sbagliati

I colori sono automatici:
- **Verde**: Se `hours` è presente
- **Rosso**: Se `closed: true`

Se i colori non appaiono, verifica la sintassi:
```typescript
// ✅ APERTO (verde)
{ date: '2026-01-06', name: 'Epifania', hours: '18:30 - 22:30' }

// ✅ CHIUSO (rosso)
{ date: '2026-01-01', name: 'Capodanno', closed: true }

// ❌ SBAGLIATO (non compila)
{ date: '2026-01-06', name: 'Epifania', hours: '18:30 - 22:30', closed: true }
// Non mettere sia hours che closed insieme!
```

---

### ❓ Problema: Nome Festività Troppo Lungo

Se il nome è troppo lungo, accorcialo:

```typescript
// ❌ Troppo lungo
{ date: '2026-04-25', name: 'Festa della Liberazione Nazionale', hours: '18:30 - 22:30' }

// ✅ Più breve
{ date: '2026-04-25', name: 'Liberazione', hours: '18:30 - 22:30' }

// ✅ Alternativa
{ date: '2026-04-25', name: '25 Aprile', hours: '18:30 - 22:30' }
```

---

## 📋 Checklist Annuale

### Inizio Anno (Gennaio)
- [ ] Aggiornare data Pasqua per l'anno corrente
- [ ] Aggiornare data Pasquetta (giorno dopo Pasqua)
- [ ] Verificare che tutte le date abbiano l'anno corretto (2027, 2028, ecc.)
- [ ] Rimuovere festività obsolete (anni precedenti) se presenti

### Prima di Ogni Festività
- [ ] Controllare che l'orario sia corretto (3-4 settimane prima)
- [ ] Decidere se aperto/chiuso
- [ ] Aggiornare `hours` o `closed` se necessario
- [ ] Fare commit e push
- [ ] Verificare sul sito 7 giorni prima

### Dopo Ogni Festività
Niente da fare! Il sistema nasconde automaticamente le festività passate.

---

## 🎨 Stile Brand PizzArt

### Colori Utilizzati

**Verde (Aperti):**
- Testo: `text-green-600` (light mode), `text-green-400` (dark mode)
- Sfondo: `bg-green-500/5` (riga tabella)
- Descrizione: "Orario festivo" sotto orario

**Rosso (Chiusi):**
- Badge: `bg-red-500/15 text-red-600`
- Testo: "Chiuso (Festivo)"

**Formato Nome Festività:**
```
Martedì (Epifania)
        ^^^^^^^^^^
        verde, tra parentesi
```

---

## 🔗 File Coinvolti

### 1. `/src/data/menuData.ts`
Contiene:
- Array `SPECIAL_OPENING_HOURS`
- Interface `SpecialHoliday`
- Tutte le festività con date e orari

### 2. `/src/components/menu/InfoModal.tsx`
Contiene:
- Funzione `getUpcomingHolidays()` (filtra prossimi 7 giorni)
- Logica rendering tabella orari
- Styling festività

**⚠️ NON MODIFICARE `InfoModal.tsx` se non sei sicuro!**  
Tutte le modifiche necessarie vanno in `menuData.ts`.

---

## ✅ Riepilogo Veloce

**Per aggiungere festività:**
1. Apri `src/data/menuData.ts`
2. Trova `SPECIAL_OPENING_HOURS`
3. Aggiungi oggetto con `date`, `name`, e `hours` o `closed`
4. Salva, commit, push
5. Verifica dopo 1-2 minuti

**Per modificare orario:**
1. Trova la festività nell'array
2. Cambia il valore `hours`
3. Salva, commit, push

**Per chiudere in una festività:**
1. Trova la festività
2. Rimuovi `hours`
3. Aggiungi `closed: true`
4. Salva, commit, push

**Ricorda:**
- La festività appare **solo se nei prossimi 7 giorni**
- Formato date: `YYYY-MM-DD` sempre!
- Verde = aperto, Rosso = chiuso
- Aggiorna Pasqua ogni anno

---

## 📞 Supporto

Se hai problemi o domande:
1. Leggi la sezione [Risoluzione Problemi](#risoluzione-problemi)
2. Verifica il formato date
3. Controlla errori TypeScript in VS Code
4. Testa con date vicine (prossimi 7 giorni)

---

**✨ Sistema creato il 3 gennaio 2026**  
**🎯 Stile Google My Business - Brand PizzArt**
