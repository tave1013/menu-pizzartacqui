# 🧪 GUIDA AL TEST - Coming Soon + Password Login

Questo documento spiega come testare il sistema di accesso durante lo sviluppo.

---

## 🎯 COME TESTARE (Rapido)

### 1️⃣ Avvia il server di sviluppo
```bash
npm run dev
```

### 2️⃣ Apri il browser
```
http://localhost:5173
```

### 3️⃣ Usa il Debug Panel (🛠️ in basso a destra)

Clicca il pulsante **🛠️ Debug** e:
- Seleziona uno dei 3 stati
- Testa il login con la password
- Osserva i cambiamenti

---

## 📋 SCENARI DI TEST

### ✅ Test 1: MODO PUBLIC (Sito Normale)

**Setup:**
- Debug Panel → Click "Public"

**Risultato atteso:**
- ✅ Sito visibile al 100%
- ✅ Menu funziona
- ✅ Carrello visibile
- ✅ Prenotazioni accessibili
- ✅ Nessun cambio al layout

**Verifica:**
```
Il sito deve essere IDENTICO al sito originale
Nemmeno 1 pixel deve essere diverso
```

---

### 🔐 Test 2: MODO PASSWORD-PROTECTED (Login)

**Setup:**
- Debug Panel → Click "Password"

**Pagina Login:**
- ✅ Logo "PizzArt" in alto
- ✅ Titolo "Accesso riservato"
- ✅ Campo password
- ✅ Bottone "Accedi"
- ✅ Design minimalista e pulito

**Test Login (corretto):**
1. Clicca il campo password
2. Digita: `pizzart2025`
3. Clicca "Accedi"
4. **Risultato:** Accedi al sito completo ✅

**Test Login (errato):**
1. Clicca il campo password
2. Digita: `password123`
3. Clicca "Accedi"
4. **Risultato:** Errore rosso "Password non corretta" ✅

**Verifica Sessione:**
1. Accedi con password corretta
2. Ricarica la pagina (F5)
3. **Risultato:** Rimani loggato (sessione persistente) ✅

**Test Logout:**
1. Apri il Debug Panel
2. Clicca "Logout"
3. Ricarica la pagina
4. **Risultato:** Tornato alla pagina login ✅

---

### 🚧 Test 3: MODO MAINTENANCE (Coming Soon)

**Setup:**
- Debug Panel → Click "Maintenance"

**Pagina Coming Soon:**

**Layout:**
- ✅ Logo "PizzArt" in alto a sinistra
- ✅ Forma verde curva al centro
- ✅ Testo "Stiamo finendo di sistemare qualcosa"
- ✅ Descrizione "Stiamo preparando un'esperienza ancora migliore per te"
- ✅ Sfondo neutro (grigio chiaro)

**Colore:**
- ✅ Verde corretto (#82b856 - PizzArt)

**Nessun elemento:**
- ✅ Niente menu
- ✅ Niente carrello
- ✅ Niente prenotazioni
- ✅ Niente testi secondari

---

## 📱 TEST RESPONSIVE

### Desktop (1920x1080)
```
Forma grande, ben visibile
Testo in 2 righe naturali
Padding comodo
```

### Tablet (768x1024)
```
Forma adattata
Testo centrato
Layout bilanciato
```

### Mobile (375x667)
```
Forma completamente visibile
Nessun overflow orizzontale
Testo leggibile
Padding rimasto (non tagliate)
```

**Come testare:**
1. Apri Chrome DevTools (F12)
2. Seleziona "Toggle device toolbar" (Ctrl+Shift+M)
3. Prova: iPhone 12, iPad, Desktop

---

## 🎨 TEST VISUAL

### Pagina Coming Soon

**SVG Bubble:**
```
Verifica che la forma:
☐ Sia verde (#82b856)
☐ Non esca dallo schermo
☐ Sia al centro
☐ Sia responsive
```

**Testo:**
```
☐ "Stiamo finendo di sistemare qualcosa" è visibile
☐ Font grande e leggibile
☐ Non va a capo stranamente
☐ Ha spacing corretto
```

**Decorazione:**
```
☐ Linea stilizzata sotto il titolo è presente
☐ Ha il colore corretto
```

### Pagina Login

**Card:**
```
☐ Background bianco
☐ Border grigio sottile
☐ Shadow leggero
☐ Border-radius 12px
```

**Input Password:**
```
☐ Placeholder "Inserisci la password" è visibile
☐ Input height corretto (48px)
☐ Focus stato visibile
☐ Font size 16px (senza zoom iOS)
```

**Bottone:**
```
☐ Background verde (#82b856 o variante)
☐ Testo bianco
☐ Hover state funziona
☐ Disabilitato quando campo vuoto
```

---

## 🔄 TEST DI SWITCH RAPIDO

**Procedura:**
1. Sei in "Public" → vedi sito normale
2. Clicca "Password" nel debug panel
3. **Atteso:** Pagina login istantanea
4. Accedi con password
5. **Atteso:** Sei nel sito
6. Clicca "Maintenance" nel debug panel
7. **Atteso:** Pagina Coming Soon istantanea
8. Clicca "Public"
9. **Atteso:** Sito normale di nuovo

✅ Tutto fluido senza lag

---

## 🔐 TEST DI PERSISTENZA

**Test localStorage:**
1. Modo "password-protected"
2. Accedi con password
3. Apri Console (F12)
4. Digita: `localStorage.getItem("site_authenticated")`
5. **Atteso:** Restituisce `"true"`

**Test clear:**
1. Digita in console: `localStorage.removeItem("site_authenticated")`
2. Ricarica pagina
3. **Atteso:** Tornato alla login

---

## ⚙️ TEST DI CONFIGURAZIONE

**Cambia password:**
1. Apri `src/config/siteConfig.ts`
2. Cambia: `password: "pizzart2025"` → `password: "test123"`
3. Salva il file
4. Ricarica browser
5. Prova login con "test123"
6. **Atteso:** Funziona ✅

**Cambia testi:**
1. Apri `src/config/siteConfig.ts`
2. Cambia: `mainTitle: "Nuovo titolo"`
3. Salva il file
4. Vai in "Maintenance"
5. **Atteso:** Vedi il nuovo titolo ✅

---

## 🧠 CHECKLIST FINALE

**Funzionalità:**
- [ ] Public mode: sito 100% identico
- [ ] Password mode: login funziona
- [ ] Maintenance mode: coming soon visibile
- [ ] Debug panel cambia modo istantaneo
- [ ] Persistenza sessione (reload mantiene login)
- [ ] Logout funziona

**Responsive:**
- [ ] Mobile: nessun overflow
- [ ] Tablet: layout bilanciato
- [ ] Desktop: forma grande

**Design:**
- [ ] Colore verde corretto
- [ ] Logo PizzArt presente
- [ ] Testi chiari e leggibili
- [ ] Spacing coerente
- [ ] Nessun elemento strano

**Performance:**
- [ ] Build senza errori
- [ ] Hot reload funziona
- [ ] Nessun lag nei switch

---

## 🐛 DEBUGGING AVANZATO

**Se il password non funziona:**
```javascript
// Apri Console (F12) e digita:
localStorage.clear(); // Pulisci tutto
location.reload(); // Ricarica
```

**Se il coming soon non appare:**
```typescript
// Verifica in browser console:
// 1. Apri DevTools
// 2. Clicca "Maintenance" nel debug panel
// 3. Controlla che `mode` sia "maintenance" nel context
```

**Se il form non accetta input:**
```
- Verifica che il campo non abbia `disabled={true}`
- Controlla che isLoading sia `false`
- Prova F12 → Console → `document.getElementById("password").focus()`
```

---

## 📞 REPORT DI TEST

Se trovi bug, riporta:
1. **Che cosa:** Descrizione del problema
2. **Dove:** Url/pagina
3. **Come:** Passaggi per riprodurre
4. **Atteso:** Cosa dovrebbe succedere
5. **Browser:** Chrome/Safari/Firefox + versione
6. **Device:** Mobile/Tablet/Desktop

---

**Test Date:** 30 Dicembre 2025
**Tester:** [Nome]
**Status:** ✅ READY TO TEST
