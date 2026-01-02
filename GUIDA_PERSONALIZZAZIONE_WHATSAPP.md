# Guida: Personalizzazione Messaggi WhatsApp

## 📱 Dove si trovano i messaggi WhatsApp?

I messaggi che vengono inviati su WhatsApp sono generati nel file:
**`src/components/menu/CartPage.tsx`**

Specificamente, nella funzione: **`buildWhatsAppMessage()`** (circa linea 146)

---

## 🎯 Struttura del messaggio

Quando un cliente invia un ordine, il messaggio WhatsApp contiene:

```
🧾 *Ordine Asporto — PIZZART*
👤 *Nome:* Mario Rossi
📞 *Telefono:* +39 333 123 4567
✉️ *Email:* mario@email.com

🕒 *Ritiro:* 19:30
📍 *Modalità:* Asporto

*Dettagli d'ordine:*
x2 *MARGHERITA* — 16,00 €
x1 [SENZA GLUTINE] *CARONTE* — 13,00 €
_✓ + Bufala_
_❌ No Basilico_

📝 *Note:* Senza pomodoro per favore

💶 *Totale indicativo:* 29,00 €
✅ *Consenso privacy:* Sì
```

---

## ✏️ Come Modificare i Testi

### 1️⃣ **Modificare il Titolo dell'Ordine**

**Riga da trovare (circa 155):**
```typescript
let message = `🧾 *Ordine Asporto — ${restaurantInfo.name.toUpperCase()}*\n`;
```

**Esempi di modifica:**

Aggiungere un emoji diverso:
```typescript
let message = `📦 *Ordine Asporto — ${restaurantInfo.name.toUpperCase()}*\n`;
let message = `🍕 *Ordine da Ritirare — ${restaurantInfo.name.toUpperCase()}*\n`;
let message = `✨ *Nuovo Ordine — ${restaurantInfo.name.toUpperCase()}*\n`;
```

Cambiare il testo:
```typescript
let message = `🧾 *Il tuo ordine per ${restaurantInfo.name.toUpperCase()}*\n`;
```

---

### 2️⃣ **Modificare le Sezioni del Cliente**

**Righe da trovare (156-159):**
```typescript
message += `👤 *Nome:* ${customerData.firstName} ${customerData.lastName}\n`;
message += `📞 *Telefono:* ${customerData.phone}\n`;
message += `✉️ *Email:* ${customerData.email.trim() || "—"}\n\n`;
```

**Esempi di modifica:**

Cambiare emoji:
```typescript
message += `😊 *Intestatario:* ${customerData.firstName} ${customerData.lastName}\n`;
message += `☎️ *Contatto:* ${customerData.phone}\n`;
message += `📧 *Comunicazione:* ${customerData.email.trim() || "—"}\n\n`;
```

Cambiare testo:
```typescript
message += `👤 *Cliente:* ${customerData.firstName} ${customerData.lastName}\n`;
message += `📞 *Telefono da contattare:* ${customerData.phone}\n`;
message += `✉️ *Rispondere via email:* ${customerData.email.trim() || "—"}\n\n`;
```

---

### 3️⃣ **Modificare Orario e Modalità**

**Righe da trovare (160-161):**
```typescript
message += `🕒 *Ritiro:* ${selectedTime}\n`;
message += `📍 *Modalità:* Asporto\n\n`;
```

**Esempi di modifica:**

```typescript
// Con emojis diversi
message += `⏰ *Orario Ritiro:* ${selectedTime}\n`;
message += `🚗 *Da asporto*\n\n`;

// Testo più formale
message += `🕒 *Orario di Ritiro Richiesto:* ${selectedTime}\n`;
message += `📍 *Servizio:* Take Away\n\n`;

// Con descrizioni aggiuntive
message += `🕐 *Vuoi ritirare alle:* ${selectedTime}\n`;
message += `🏪 *Presso:* ${restaurantInfo.name}\n\n`;
```

---

### 4️⃣ **Modificare il Titolo Dettagli Ordine**

**Riga da trovare (162):**
```typescript
message += `*Dettagli d'ordine:*\n`;
```

**Esempi di modifica:**

```typescript
message += `*📋 Cosa hai ordinato:*\n`;
message += `*🍽️ I tuoi piatti:*\n`;
message += `*🛒 Carrello:*\n`;
message += `*📦 Contenuto dell'ordine:*\n`;
```

---

### 5️⃣ **Modificare il Formato dei Prodotti**

**Righe da trovare (164-166):**
```typescript
const glutenFreePrefix = item.glutenFree ? "*[SENZA GLUTINE]* " : "";
const itemPrice = ...
message += `x${item.quantity} ${glutenFreePrefix}*${item.name.toUpperCase()}* — ${formatPrice(itemPrice)}\n`;
```

**Esempi di modifica:**

Formato diverso:
```typescript
message += `🍕 ${item.quantity}x *${item.name.toUpperCase()}* — ${formatPrice(itemPrice)}\n`;
message += `${item.quantity} × *${item.name}* = ${formatPrice(itemPrice)}\n`;
message += `• Quantità: ${item.quantity} - ${item.name} (${formatPrice(itemPrice)})\n`;
```

Senza glutine con icona:
```typescript
const glutenFreePrefix = item.glutenFree ? "🌾 *[SENZA GLUTINE]* " : "";
const glutenFreePrefix = item.glutenFree ? "✅ *GLUTEN FREE* " : "";
const glutenFreePrefix = item.glutenFree ? "🌱 *[SENZA GLUTINE]* " : "";
```

---

### 6️⃣ **Modificare il Formato degli Extra (Ingredienti Aggiunti)**

**Righe da trovare (169-171):**
```typescript
if (item.selectedExtras && item.selectedExtras.length > 0) {
  item.selectedExtras.forEach(extra => {
    message += `_✓ + ${extra}_\n`;
  });
}
```

**Esempi di modifica:**

```typescript
// Icona diversa
message += `➕ ${extra}\n`;
message += `✨ Aggiunto: ${extra}\n`;
message += `🎯 + ${extra}\n`;

// Formato diverso
message += `• +${extra}\n`;
message += `👉 ${extra} (aggiunto)\n`;
message += `✔️ Extra: ${extra}\n`;
```

---

### 7️⃣ **Modificare il Formato delle Rimozioni (Ingredienti Tolti)**

**Righe da trovare (174-177):**
```typescript
if (item.removedIngredients.length > 0) {
  item.removedIngredients.forEach(ingredient => {
    message += `_❌ No ${ingredient}_\n`;
  });
}
```

**Esempi di modifica:**

```typescript
// Icona diversa
message += `🚫 Senza ${ingredient}\n`;
message += `⛔ ${ingredient}\n`;
message += `❌ Tolto: ${ingredient}\n`;

// Formato diverso
message += `• NO ${ingredient}\n`;
message += `(senza ${ingredient})\n`;
message += `🙅 Non aggiungere ${ingredient}\n`;
```

---

### 8️⃣ **Modificare Sezione Note**

**Righe da trovare (181-183):**
```typescript
if (notes.trim().length > 0) {
  message += `📝 *Note:* ${notes.trim()}\n\n`;
}
```

**Esempi di modifica:**

```typescript
if (notes.trim().length > 0) {
  message += `💬 *Richieste Speciali:* ${notes.trim()}\n\n`;
}

if (notes.trim().length > 0) {
  message += `🗣️ *Istruzioni:* ${notes.trim()}\n\n`;
}

if (notes.trim().length > 0) {
  message += `📌 *Note Importanti:* ${notes.trim()}\n\n`;
}
```

---

### 9️⃣ **Modificare Totale Finale**

**Righe da trovare (184-186):**
```typescript
message += `💶 *Totale indicativo:* ${formatPrice(totalPrice)}\n`;
message += `✅ *Consenso privacy:* Sì`;
```

**Esempi di modifica:**

```typescript
// Emoji diversi
message += `💰 *TOTALE:* ${formatPrice(totalPrice)}\n`;
message += `🎟️ *Importo da pagare:* ${formatPrice(totalPrice)}\n`;
message += `💳 *Prezzo finale:* ${formatPrice(totalPrice)}\n`;

// Testo diverso
message += `💶 *Totale indicativo:* ${formatPrice(totalPrice)}\n`;
message += `(soggetto a variazioni)\n`;
message += `✅ *Accettazione:* Sì`;
```

---

## 🎨 Emoji Utili

### Cibo e Bevande
- 🍕 Pizza
- 🍔 Hamburger
- 🍟 Patatine
- 🍝 Pasta
- 🥗 Insalata
- 🥤 Bevanda
- 🍺 Birra
- 🍷 Vino
- 🧃 Succo

### Ordine e Logistica
- 📦 Pacco/Scatola
- 🚗 Auto
- 🏪 Negozio
- 🛒 Carrello
- 📝 Nota
- 📋 Lista
- 🎟️ Biglietto
- 💳 Carta

### Informazioni
- 👤 Persona
- 📞 Telefono
- ✉️ Email
- 🕒 Orologio
- 📍 Posizione
- ✅ Spunta
- ❌ Croce
- ⚠️ Avvertenza

### Simboli Speciali
- 💶 Euro
- ➕ Più
- ➖ Meno
- ✨ Scintille
- 🌟 Stella
- 💥 Esplosione
- 🔥 Fuoco

---

## ⚙️ Come Salvare le Modifiche

1. **Apri il file:** `src/components/menu/CartPage.tsx`
2. **Trova la funzione:** `buildWhatsAppMessage()` (linea ~146)
3. **Modifica il testo** seguendo gli esempi sopra
4. **Salva il file** (Ctrl+S o Cmd+S)
5. **Commit su Git:**
   ```bash
   git add src/components/menu/CartPage.tsx
   git commit -m "personalizzazione: modifica testi WhatsApp"
   git push origin main
   ```
6. **Attendi il deployment** (1-2 minuti)

---

## ⚠️ Regole Importanti

✅ **PUOI FARE:**
- ✓ Cambiare emoji
- ✓ Cambiare testo di etichette
- ✓ Aggiungere newline (`\n`)
- ✓ Fare testo in grassetto con `*testo*`
- ✓ Fare testo in corsivo con `_testo_`

❌ **NON FARE:**
- ✗ Cancellare `${variabili}` - servono per mostrare i dati
- ✗ Cancellare `\n` - servono per andare a capo
- ✗ Modificare nomi di variabili
- ✗ Cambiare la struttura della funzione

---

## 📝 Esempio Personalizzato Completo

Se vuoi un messaggio più informale:

```typescript
function buildWhatsAppMessage(
  items: CartItem[],
  customerData: CustomerData,
  selectedTime: string,
  notes: string,
  totalPrice: number
): string {
  const formatPrice = (price: number) => price.toFixed(2).replace(".", ",") + " €";

  let message = `🍕 *Ciao ${customerData.firstName}!*\n`;
  message += `Ecco il tuo ordine per ${restaurantInfo.name.toUpperCase()}\n\n`;
  
  message += `👤 *Cliente:* ${customerData.firstName} ${customerData.lastName}\n`;
  message += `☎️ *Ti contattiamo al:* ${customerData.phone}\n`;
  message += `📧 *Email:* ${customerData.email.trim() || "—"}\n\n`;
  
  message += `⏰ *Pronto per le:* ${selectedTime}\n\n`;
  
  message += `*🛒 Il tuo ordine:*\n`;
  
  items.forEach((item) => {
    const glutenFreePrefix = item.glutenFree ? "🌱 " : "";
    const itemPrice = (Number(item.price) || 0 + Number(item.extrasPrice) || 0 + Number(item.glutenFreePrice) || 0) * Number(item.quantity || 1);
    message += `${glutenFreePrefix}${item.quantity}x *${item.name}* = ${formatPrice(itemPrice)}\n`;
    
    if (item.selectedExtras && item.selectedExtras.length > 0) {
      item.selectedExtras.forEach(extra => {
        message += `  ✨ +${extra}\n`;
      });
    }
    
    if (item.removedIngredients.length > 0) {
      item.removedIngredients.forEach(ingredient => {
        message += `  🚫 Senza ${ingredient}\n`;
      });
    }
  });
  
  if (notes.trim().length > 0) {
    message += `\n💬 *Note:* ${notes.trim()}\n`;
  }
  
  message += `\n💰 *TOTALE:* ${formatPrice(totalPrice)}\n`;
  message += `✅ Grazie per l'ordine!`;
  
  return message;
}
```

---

**Ultima modifica:** 2 gennaio 2026

