# Guida: Esclusione Ingredienti Extra per Categoria

## 📋 Come funziona

La sezione **"Ingredienti Extra"** viene mostrata solo per alcune categorie di prodotti. 
Per le categorie come Bevande, Birre e Vini, questa sezione viene automaticamente nascosta.

---

## ⚙️ Come modificare le categorie escluse

### 1️⃣ Apri il file corretto
Vai nel file: **`src/components/menu/ItemDetailModal.tsx`**

### 2️⃣ Trova la costante
Cerca questa sezione (intorno alla riga 97-110):

```typescript
const EXCLUDED_EXTRA_CATEGORIES = [
  "bevande",              // Coca Cola, Fanta, Acqua, etc.
  "birre",                // Menabrea, Tuborg, etc.
  "birre-artigianali",    // Birre artigianali
  "vini",                 // Nebbiolo, Arneis, etc.
  // Aggiungi qui nuove categorie da escludere, es: "dolci", "gelati"
];
```

### 3️⃣ Aggiungi o rimuovi categorie

**Per AGGIUNGERE una categoria** (nascondere gli extra):
```typescript
const EXCLUDED_EXTRA_CATEGORIES = [
  "bevande",
  "birre",
  "birre-artigianali",
  "vini",
  "dolci",        // ← NUOVO: aggiungi questa riga
  "gelati",       // ← NUOVO: aggiungi questa riga
];
```

**Per RIMUOVERE una categoria** (mostrare gli extra):
```typescript
const EXCLUDED_EXTRA_CATEGORIES = [
  "bevande",
  "birre",
  // "vini",      // ← COMMENTATO: ora i vini avranno gli extra
];
```

---

## 🔍 Come trovare l'ID della categoria

Gli ID delle categorie si trovano in **`src/data/menuData.ts`**.

Esempio:
```typescript
export const menuCategories: MenuCategory[] = [
  {
    id: "top-ten",        // ← Questo è l'ID
    name: "Le Top Ten",
    // ...
  },
  {
    id: "bevande",        // ← Questo è l'ID
    name: "Bevande",
    // ...
  },
];
```

**IMPORTANTE:** Usa sempre l'`id` (minuscolo con trattini), NON il `name`.

---

## ✅ Esempi comuni

| Categoria | ID da usare | Esempio |
|-----------|-------------|---------|
| Bevande | `"bevande"` | Coca Cola, Fanta, Acqua |
| Birre | `"birre"` | Menabrea, Tuborg |
| Birre Artigianali | `"birre-artigianali"` | Ichnusa, etc. |
| Vini | `"vini"` | Nebbiolo, Arneis |
| Dolci | `"dolci"` | (se esiste) |
| Le Top Ten | `"top-ten"` | Pizze |
| Le Classiche | `"le-classiche"` | Pizze classiche |

---

## 🚨 Note importanti

1. **Non toccare altre costanti**: Questa modifica riguarda SOLO `EXCLUDED_EXTRA_CATEGORIES`
2. **Non toccare `CATEGORIE_SENZA_INGREDIENTI`**: Quella gestisce la rimozione ingredienti
3. **Non toccare `PIZZA_CATEGORIES`**: Quella gestisce l'opzione senza glutine
4. **Salva e committa**: Dopo la modifica, salva il file e fai commit su Git

---

## 📝 Riepilogo

- **File da modificare**: `src/components/menu/ItemDetailModal.tsx`
- **Costante**: `EXCLUDED_EXTRA_CATEGORIES` (circa riga 104)
- **Azione**: Aggiungi o rimuovi ID di categorie dall'array
- **Effetto**: La sezione "Ingredienti Extra" verrà nascosta per quelle categorie

---

**Ultima modifica:** 2 gennaio 2026
