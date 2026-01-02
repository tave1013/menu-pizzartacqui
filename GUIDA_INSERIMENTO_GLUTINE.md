# Guida Inserimento Opzione Senza Glutine

## Panoramica
L'opzione "Impasto senza glutine" (+3,00 €) viene mostrata automaticamente per tutte le pizze, con alcune eccezioni configurabili.

---

## Categorie con Opzione Senza Glutine

L'opzione viene mostrata automaticamente per le seguenti categorie:
- **Le Top Ten** (`top-ten`)
- **Pizzart** (`pizart`)
- **Le Classiche** (`le-classiche`)
- **Baby Pizze** (`baby-pizze`)

---

## Categorie Escluse

L'opzione **NON viene mostrata** per:
- **Le Focacce** (`le-focacce`)

---

## Esclusione Singola per Prodotto

### Come funziona
Per escludere l'opzione senza glutine da un singolo prodotto (anche se appartiene a una categoria pizza), aggiungi la proprietà `excludeGlutenFree: true` nel file `menuData.ts`.

### Esempio Pratico

```typescript
{
  id: "calzone",
  name: "Calzone",
  desc: "Pomodoro, mozzarella, prosciutto cotto, funghi champignon",
  price: 12.0,
  image: calzoneImg,
  excludeGlutenFree: true, // ← AGGIUNGI QUESTA RIGA
  allergens: ["Glutine", "Lattosio"],
  contact: { tel: "+39 3914272540", mail: "info@pizzartacquiterme.com" },
}
```

### Quando usarla
Usa `excludeGlutenFree: true` quando:
- Il prodotto è una pizza ma **non può essere preparato senza glutine** (es. Calzone)
- Il prodotto ha una preparazione speciale incompatibile con l'impasto senza glutine
- Ragioni di sicurezza alimentare o contaminazione crociata

---

## Visualizzazione nel Carrello

### Senza Glutine
Se selezionato, appare sotto il nome del prodotto con uno **sfondo giallo tenue** per attirare l'attenzione:

```
MARGHERITA
[Senza Glutine]  ← con sfondo giallo
```

### Ingredienti Extra
Vengono elencati subito dopo il senza glutine:
```
Extra: Bufala, Prosciutto crudo, Rucola
```

### Ingredienti Rimossi
Mostrati dopo gli extra:
```
No Pomodoro • No Basilico
```

### Prezzo
Il prezzo totale (base + extra + senza glutine) viene mostrato accanto al nome del prodotto, **senza mostrare i singoli costi**.

---

## Messaggio WhatsApp

### Formato Prodotto con Senza Glutine
```
x1 *[SENZA GLUTINE]* *MARGHERITA* — 11,00 €
```
- Il tag `[SENZA GLUTINE]` appare **in grassetto** all'inizio della riga
- Seguito dal nome del prodotto in maiuscolo

### Formato Extra
Gli ingredienti extra vengono mostrati con il simbolo `+`:
```
x1 *[SENZA GLUTINE]* *MARGHERITA* — 16,00 €
_✓ + Bufala_
_✓ + Prosciutto crudo_
_✓ + Rucola_
_❌ No Pomodoro_
```

### Legenda Simboli
- `*[SENZA GLUTINE]*` = Impasto senza glutine selezionato (grassetto)
- `_✓ + Nome_` = Ingrediente extra aggiunto (corsivo)
- `_❌ No Nome_` = Ingrediente rimosso (corsivo)

---

## Logica del Prezzo

### Calcolo Totale
```
Totale = (Prezzo Base + Extra + Senza Glutine) × Quantità
```

### Esempio Pratico
- Margherita base: €8,00
- Bufala (+€2,00)
- Prosciutto crudo (+€3,00)
- Senza glutine (+€3,00)
- **Totale**: (8 + 2 + 3 + 3) × 1 = **€16,00**

---

## File di Configurazione

### Modifiche in `ItemDetailModal.tsx`

Le categorie pizza e le esclusioni sono definite in:
```typescript
const PIZZA_CATEGORIES = ["top-ten", "pizart", "le-classiche", "baby-pizze"];
const EXCLUDED_CATEGORIES = ["le-focacce"];
const GLUTEN_FREE_PRICE = 3.00;
```

Per aggiungere/rimuovere categorie, modifica questi array.

### Modifiche in `menuData.ts`

Per escludere un singolo prodotto, aggiungi `excludeGlutenFree: true`:
```typescript
{
  id: "tuo-prodotto",
  name: "Nome Prodotto",
  // ... altri campi
  excludeGlutenFree: true, // Nasconde opzione senza glutine
  // ... altri campi
}
```

---

## Risoluzione Problemi

### L'opzione non appare per una pizza
1. Verifica che la categoria sia in `PIZZA_CATEGORIES`
2. Verifica che la categoria non sia in `EXCLUDED_CATEGORIES`
3. Verifica che il prodotto non abbia `excludeGlutenFree: true`

### L'opzione appare per le focacce
1. Verifica che `"le-focacce"` sia in `EXCLUDED_CATEGORIES`

### Il prezzo non si aggiorna
1. Verifica che `GLUTEN_FREE_PRICE` sia definito correttamente
2. Controlla che `glutenFreePrice` sia passato a `addItem()`

---

## Avviso Importante

Il box "Intollerante al glutine?" contiene un **avviso di non certificazione**:

> Attenzione: non siamo certificati gluten-free. Pur adottando tutte le accortezze possibili, in ambiente di lavoro possono verificarsi contaminazioni. Ingredienti e condimenti sono gli stessi utilizzati per le altre pizze.

Questo testo è **obbligatorio per legge** e non deve essere rimosso o modificato senza consulto legale.

---

## Supporto

Per domande o problemi tecnici, consulta:
- `ItemDetailModal.tsx` (linee 90-145)
- `CartContext.tsx` (interfaccia `CartItem`)
- `CartPage.tsx` (funzione `buildWhatsAppMessage`)
