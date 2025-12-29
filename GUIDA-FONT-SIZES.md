# 📏 Guida Font Sizes - Mobile

Questa guida mostra i valori dei font PRIMA e DOPO le modifiche per migliorare la leggibilità su mobile.

---

## 🍕 MenuItemCard (Card prodotti nel menu)

| Elemento | PRIMA | DOPO |
|----------|-------|------|
| Nome prodotto | `text-[15px]` | `text-base` (16px) |
| Descrizione | `text-[13px]` | `text-sm` (14px) |
| Prezzo | `text-[14px]` | `text-base` (16px) |

**File:** `src/components/menu/MenuItemCard.tsx`

---

## 📂 MenuSection (Titoli categorie)

| Elemento | PRIMA | DOPO |
|----------|-------|------|
| Titolo categoria | `text-xl` (20px) | `text-2xl` (24px) |
| Descrizione categoria | `text-sm` (14px) | `text-base` (16px) |

**File:** `src/components/menu/MenuSection.tsx`

---

## 🛒 CartBar (Barra carrello in basso)

| Elemento | PRIMA | DOPO |
|----------|-------|------|
| Badge quantità | `w-6 h-6`, `text-xs` | `w-7 h-7`, `text-sm` |
| Testo "Vedi carrello" | `text-sm` | `text-base` |
| Prezzo totale | `text-sm` | `text-base` |

**File:** `src/components/menu/CartBar.tsx`

---

## 🛍️ CartModal (Modal carrello popup)

| Elemento | PRIMA | DOPO |
|----------|-------|------|
| Nome prodotto | default | `text-base` |
| Variazioni (No pomodoro, etc.) | `text-xs` | `text-sm` |
| Prezzo item | `text-sm` | `text-base` |
| Bottoni +/- | `w-7 h-7`, `gap-1.5` | `w-8 h-8`, `gap-2` |
| Icone +/- | `w-3.5 h-3.5` | `w-4 h-4` |
| Quantità | `text-sm`, `w-5` | `text-base font-semibold`, `w-6` |
| Label "Totale" | `text-base` | `text-lg` |
| Prezzo totale | `text-lg` | `text-xl` |
| Disclaimer | `text-xs` | `text-sm` |
| Padding footer | `p-3` | `p-4` |

**File:** `src/components/menu/CartModal.tsx`

---

## 🛒 CartPage (Pagina carrello completa)

| Elemento | PRIMA | DOPO |
|----------|-------|------|
| Titolo "Carrello" | `text-base` | `text-lg` |
| Frase allergie | `text-sm`, centrata | `text-base`, **allineata sinistra** |
| Nome prodotto | default | `text-base` |
| Variazioni (-No ingrediente) | `text-xs` | `text-sm` |
| Bottoni +/- | `w-6 h-6`, `gap-1` | `w-8 h-8`, `gap-2` |
| Icone +/- | `w-3 h-3` | `w-4 h-4` |
| Quantità | `text-sm`, `w-5` | `text-base font-semibold`, `w-6` |
| Prezzo item | `text-sm` | `text-base` |
| Label "Subtotale" | `text-sm` | `text-base` |
| Label "Totale indicativo" | default | `text-lg` |
| Prezzo totale | `text-lg` | `text-xl` |

**File:** `src/components/menu/CartPage.tsx`

---

## 🔍 SearchOverlay (Risultati ricerca)

| Elemento | PRIMA | DOPO |
|----------|-------|------|
| Nome prodotto | `text-sm` | `text-base` |
| Descrizione | `text-xs` | `text-sm` |
| Badge extra count | `text-[10px]` | `text-xs` |
| Prezzo | `text-sm` | `text-base` |

**File:** `src/components/menu/SearchOverlay.tsx`

---

## ℹ️ InfoModal (Popup informazioni)

| Elemento | PRIMA | DOPO |
|----------|-------|------|
| Titolo modal | `text-lg` | `text-xl` |
| Titolo sezione "Orari" | default | `text-base` |
| Icona sezione | `w-4 h-4` | `w-5 h-5` |
| Tabella orari | `text-sm` | `text-base` |
| Titolo sezione "Contatti" | default | `text-base` |

**File:** `src/components/menu/InfoModal.tsx`

---

## 📋 ItemDetailModal (Modal dettaglio prodotto)

| Elemento | PRIMA | DOPO |
|----------|-------|------|
| Descrizione prodotto | default | `text-base` |
| Box contatto | `text-sm` | `text-base` |
| Titolo "Rimuovi Ingredienti" | `text-lg` | `text-xl` |
| Altezza riga ingrediente | `min-h-[56px]` | `min-h-[60px]` |
| Testo ingrediente | default | `text-base` |
| Checkbox | `w-6 h-6` | `w-7 h-7` |

**File:** `src/components/menu/ItemDetailModal.tsx`

---

## 🏷️ CategoryNav (Pillole categorie) - **NON MODIFICATO**

| Elemento | VALORE |
|----------|--------|
| Testo pillola | `text-sm` |
| Padding | `px-4 py-2` |

**File:** `src/components/menu/CategoryNav.tsx`

---

## 🔧 Come Ripristinare

Se vuoi tornare ai valori precedenti, dimmi:
> "Ripristina i font di [nome componente] come erano prima"

Esempio:
- "Ripristina i font di MenuItemCard come erano prima"
- "Ripristina i font di CartPage come erano prima"
- "Ripristina tutti i font come erano prima"

---

## 📐 Riferimento Tailwind

| Classe | Pixel |
|--------|-------|
| `text-xs` | 12px |
| `text-sm` | 14px |
| `text-base` | 16px |
| `text-lg` | 18px |
| `text-xl` | 20px |
| `text-2xl` | 24px |
| `text-3xl` | 30px |
