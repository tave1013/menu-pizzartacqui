# 📱 Guida Rapida - Sistema di Accesso Sito

Benvenuto! Questo documento spiega come usare il sistema di accesso e coming soon del sito PizzArt.

---

## 🚀 QUICK START (3 secondi)

### Per mostrare il sito al cliente:
1. Modifica il file: `src/config/siteConfig.ts`
2. Cambia: `mode: "public"` → `mode: "password-protected"`
3. Salva il file
4. Il sito richiede password (password: `pizzart2025`)

### Per andare in manutenzione:
1. Modifica il file: `src/config/siteConfig.ts`
2. Cambia: `mode: "public"` → `mode: "maintenance"`
3. Salva il file
4. Tutti vedono la pagina Coming Soon

### Per tornare al sito normale:
1. Cambia: `mode: "password-protected"` → `mode: "public"`
2. Salva il file

---

## 📋 I 3 STATI DEL SITO

| Stato | Cosa succede | Quando usarlo |
|-------|-------------|----------------|
| **public** | Sito completamente accessibile | Lancio pubblico |
| **password-protected** | Richiede password per accedere | Mostrare il lavoro al cliente |
| **maintenance** | Mostra pagina Coming Soon | Manutenzione/revisione |

---

## 🔑 PASSWORD

**Password predefinita:** `pizzart2025`

Per cambiarla:
1. Apri: `src/config/siteConfig.ts`
2. Modifica: `password: "pizzart2025"` → `password: "tuapassword"`
3. Salva il file

---

## 🔧 FILE PRINCIPALE

**Dove modificare tutto:**
```
src/config/siteConfig.ts
```

Questo file contiene:
- ✅ La modalità attiva del sito
- ✅ La password
- ✅ I testi della Coming Soon
- ✅ I colori

**NON TOCCARE ALTRI FILE** - Tutto è configurabile da `siteConfig.ts`

---

## 🎨 PERSONALIZZARE I TESTI

Nel file `src/config/siteConfig.ts`, puoi cambiare:

### Titolo della Coming Soon:
```typescript
comingSoonTexts: {
  mainTitle: "Stiamo finendo\ndi sistemare qualcosa",
  // ... cambia qui
}
```

### Descrizione:
```typescript
description: "Stiamo preparando un'esperienza ancora migliore per te",
// cambia qui
```

### Testi della pagina Login:
```typescript
passwordLoginTexts: {
  header: "PizzArt",
  subheader: "Accesso riservato",
  inputPlaceholder: "Inserisci la password",
  submitButton: "Accedi",
  // ... cambia qui
}
```

---

## 🎛️ PANNELLO DI DEBUGGING (Fase di Sviluppo)

Durante lo sviluppo, in basso a destra appare un pulsante **"🛠️ Debug"**.

Cliccandolo puoi:
- ✅ Cambiare il modo senza modificare il codice
- ✅ Testare il login
- ✅ Fare logout
- ✅ Vedere lo stato attuale

**Scompare** quando il sito va in produzione.

---

## ✅ REQUISITI SODDISFATTI

- [x] **Pagina Coming Soon** con forma verde curva
- [x] **Password Login** minimalista e professionale
- [x] **3 stati** facilmente gestibili
- [x] **Responsive** su mobile, tablet, desktop
- [x] **Verde PizzArt** (#82b856)
- [x] **Logo "PizzArt"** in alto a sinistra
- [x] **ZERO modifiche al sito** quando disattivato (100% identico)

---

## 🐛 PROBLEMI COMUNI

### "Non mi fa accedere"
Verifica che la password sia corretta. Default: `pizzart2025`

### "Non vedo la Coming Soon"
Controlla che `mode` sia impostato a `"maintenance"` (non `"public"`)

### "Ho dimenticato la password"
Cambila in `src/config/siteConfig.ts`, linea password

### "Il debug panel scompare"
È normale! Appare solo durante lo sviluppo (quando usi `npm run dev`)

---

## 🔐 SICUREZZA

⚠️ **Importante:** La password è nel codice.

Per produzione, implementare:
- Variabili d'ambiente
- Backend authentication
- Non committare password su Git

---

## 📞 SUPPORTO

Se hai domande, consulta il file completo:
```
ACCESSIBILITY-SYSTEM.md
```

---

**Data:** 30 Dicembre 2025  
**Sito:** menu.pizzartacquiterme.com  
**Brand:** PizzArt
