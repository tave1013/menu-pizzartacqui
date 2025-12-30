# 🍕 Guida: Come Escludere Prodotti dalla Rimozione Ingredienti

Questa guida spiega come configurare quali prodotti **NON** devono mostrare la sezione "Rimuovi Ingredienti" nel modal.

---

## 📍 Dove modificare

Apri il file:
```
src/components/menu/ItemDetailModal.tsx
```

Cerca la sezione **CONFIGURAZIONE INGREDIENTI RIMOVIBILI** (circa riga 60-90).

---

## 1️⃣ Escludere INTERE CATEGORIE

### Come funziona
Se una categoria (es. Bevande, Birre, Vini) non deve mai mostrare "Rimuovi Ingredienti", aggiungila alla lista.

### Dove modificare
Trova questo codice:
```typescript
const CATEGORIE_SENZA_INGREDIENTI = [
  "bevande",    // Coca Cola, Fanta, Acqua, etc.
  "birre",      // Menabrea, Tuborg, etc.
  "vini",       // Nebbiolo, Arneis, etc.
  // Aggiungi qui nuove categorie
];
```

### Come aggiungere una categoria
Aggiungi l'ID della categoria tra virgolette:
```typescript
const CATEGORIE_SENZA_INGREDIENTI = [
  "bevande",
  "birre",
  "vini",
  "dolci",      // ← AGGIUNTO
  "gelati",     // ← AGGIUNTO
];
```

### Dove trovo l'ID della categoria?
Nel file `src/data/menuData.ts`, cerca la categoria:
```typescript
{
  id: "bevande",  // ← Questo è l'ID da usare
  name: "Bevande",
  items: [...]
}
```

---

## 2️⃣ Escludere DESCRIZIONI SPECIFICHE (Pattern)

### Come funziona
Se alcune descrizioni contengono parole che NON sono ingredienti (es. "33 cl", "Lattina", etc.), vengono automaticamente escluse.

### Dove modificare
Trova questo codice:
```typescript
const BLACKLIST_PATTERNS = [
  /\d+\s*cl/i,           // 33 cl, 50cl, etc.
  /\d+\s*ml/i,           // 500 ml, etc.
  /\d+\s*l\b/i,          // 1 l, 0,5 l, etc.
  /lattina/i,            // Lattina
  /bottiglia/i,          // Bottiglia
  /bottiglietta/i,       // Bottiglietta
  /bicchiere/i,          // Bicchiere
  /calice/i,             // Calice
  /vino\s*(rosso|bianco|rosè)?/i,  // Vino rosso, Vino bianco
  /spumante/i,           // Spumante
  /piemontese/i,         // per vini piemontesi
];
```

### Come aggiungere un nuovo pattern

**Esempio 1 - Parola semplice:**
```typescript
/porzione/i,           // Esclude "Porzione da..."
```

**Esempio 2 - Numero + unità:**
```typescript
/\d+\s*g\b/i,          // Esclude "200g", "150 g", etc.
```

**Esempio 3 - Più parole alternative:**
```typescript
/coppa|coppetta|vaschetta/i,   // Esclude tutte queste parole
```

### Spiegazione della sintassi
- `/parola/i` = cerca "parola" (la `i` significa case-insensitive, ignora maiuscole/minuscole)
- `\d+` = uno o più numeri
- `\s*` = zero o più spazi
- `\b` = fine parola (es. `l\b` trova "l" ma non "latte")
- `|` = oppure (es. `rosso|bianco` trova entrambi)

---

## 📋 Esempi Pratici

### Esempio: Aggiungere categoria "Dolci"
1. Apri `src/components/menu/ItemDetailModal.tsx`
2. Trova `CATEGORIE_SENZA_INGREDIENTI`
3. Aggiungi `"dolci",` alla lista

### Esempio: Escludere descrizioni con "porzione"
1. Apri `src/components/menu/ItemDetailModal.tsx`
2. Trova `BLACKLIST_PATTERNS`
3. Aggiungi `/porzione/i,` alla lista

### Esempio: Escludere grammi (200g, 150g, etc.)
1. Apri `src/components/menu/ItemDetailModal.tsx`
2. Trova `BLACKLIST_PATTERNS`
3. Aggiungi `/\d+\s*g\b/i,` alla lista

---

## ⚠️ Note Importanti

1. **Dopo ogni modifica**, salva il file e verifica che funzioni
2. **Non dimenticare la virgola** alla fine di ogni riga
3. **L'ID categoria** deve essere esattamente uguale a quello in `menuData.ts`
4. **I pattern sono case-insensitive** (non distinguono maiuscole/minuscole)

---

## 🔄 Come testare

1. Salva il file
2. Il browser si aggiorna automaticamente (hot reload)
3. Apri un prodotto della categoria/con quella descrizione
4. Verifica che la sezione "Rimuovi Ingredienti" non appaia

---

*Ultima modifica: 29 Dicembre 2025*
