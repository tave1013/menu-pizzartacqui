# 📦 SISTEMA DI ACCESSIBILITÀ - FILE CREATI

Questo documento elenca tutti i file creati/modificati per il sistema Coming Soon + Password Login.

---

## 📁 STRUTTURA

### Core Context & Logic
```
src/contexts/
├── AccessibilityContextDef.ts      ✅ NEW - Definizione context
└── AccessibilityContext.tsx        ✅ NEW - Provider component

src/hooks/
└── useAccessibility.ts             ✅ NEW - Hook personalizzato
```

### Configurazione
```
src/config/
└── siteConfig.ts                   ✅ NEW - Configurazione centrale
```

### Componenti
```
src/components/
├── AccessibilityWrapper.tsx        ✅ NEW - Wrapper per routing
└── AccessibilityDebugPanel.tsx     ✅ NEW - Debug panel (dev only)
```

### Pagine
```
src/pages/
├── ComingSoon.tsx                  ✅ NEW - Pagina Coming Soon
└── PasswordLogin.tsx               ✅ NEW - Pagina Login
```

### Entry Point
```
src/App.tsx                          ✅ MODIFICATO - Aggiunto provider e wrapper
```

### Documentazione
```
./ACCESSIBILITY-SYSTEM.md            ✅ NEW - Documentazione completa
./GUIDA-RAPIDA-ACCESSO.md           ✅ NEW - Guida cliente
./TESTING-GUIDE.md                  ✅ NEW - Guida test
./FILES-CREATED.md                  ✅ NEW - Questo file
```

---

## 📋 DETTAGLI CREATI

### 1. AccessibilityContextDef.ts
**Scopo:** Definire il context e i tipi

**Contenuto:**
- Type `SiteMode` = "public" | "password-protected" | "maintenance"
- Interface `AccessibilityContextType`
- Context object

**Perché separato:** Evita warning di Fast Refresh su context

---

### 2. AccessibilityContext.tsx
**Scopo:** Provider che gestisce lo stato

**Funzioni:**
- `AccessibilityProvider` - Wrapper component
- Carrica config da `siteConfig.ts`
- Gestisce autenticazione
- Persiste sessione in localStorage

**Logica:**
```
- Legge siteConfig.mode all'avvio
- authenticate(password) → salva in localStorage
- logout() → cancella localStorage
```

---

### 3. useAccessibility.ts
**Scopo:** Hook per accedere al context

**Export:**
```typescript
export const useAccessibility = () => {
  // Ritorna { mode, isAuthenticated, authenticate, logout, setMode }
}
```

**Usage:**
```tsx
const { mode, isAuthenticated, authenticate } = useAccessibility();
```

---

### 4. siteConfig.ts
**Scopo:** Configurazione centralizzata

**Sezioni:**
1. `siteConfig` - mode e password
2. `brandColors` - Colori personalizzabili
3. `comingSoonTexts` - Testi Coming Soon
4. `passwordLoginTexts` - Testi Login
5. `validateConfig()` - Validazione

**Modifica qui per:**
- Cambiare lo stato (public/password-protected/maintenance)
- Cambiare la password
- Personalizzare testi
- Cambiare colori

---

### 5. AccessibilityWrapper.tsx
**Scopo:** Applica le limitazioni di accesso

**Logica:**
```
if (mode === "maintenance") → mostra ComingSoon
if (mode === "password-protected" && !isAuthenticated) → mostra PasswordLogin
else → mostra contenuto originale
```

**Esclusioni:**
- `/admin/*` - Bypass (admin sempre accessibile)
- `/auth/*` - Bypass (auth sempre accessibile)

---

### 6. AccessibilityDebugPanel.tsx
**Scopo:** Pannello di debugging durante lo sviluppo

**Visibilità:** Solo se `import.meta.env.DEV === true`

**Funzioni:**
- Seleziona il modo (buttons)
- Vedi stato autenticazione
- Testa login con password
- Logout button

**Scompare:** In produzione (build)

---

### 7. ComingSoon.tsx
**Scopo:** Pagina Coming Soon

**Design:**
- Forma SVG verde curva (#82b856)
- Logo "PizzArt" in alto a sinistra
- Testo principale centrato
- Responsive (mobile, tablet, desktop)
- Sfondo gradient grigio

**Testi:**
- Header: "PizzArt"
- Subtitle: "Novità in arrivo"
- Main: "Stiamo finendo di sistemare qualcosa"
- Description: "Stiamo preparando un'esperienza ancora migliore per te"

**Responsiveness:**
- SVG viewBox="0 0 600 600"
- preserveAspectRatio="xMidYMid slice"
- Aspect ratio responsive
- Nessun overflow

---

### 8. PasswordLogin.tsx
**Scopo:** Pagina di login con password

**Layout:**
- Card bianca centrata
- Logo "PizzArt" in alto
- Sottotitolo "Accesso riservato"
- Input password
- Bottone "Accedi"
- Messaggio di errore

**Logica:**
- `authenticate(password)` al submit
- Mostra errore se password sbagliata
- Reindirizza a "/" se corretta
- Loading state durante validazione

**Responsive:** Mobile-first design

---

### 9. App.tsx (MODIFICATO)
**Cambiamenti:**
```diff
+ import { AccessibilityProvider } from "@/contexts/AccessibilityContext"
+ import { AccessibilityWrapper } from "@/components/AccessibilityWrapper"
+ import { AccessibilityDebugPanel } from "@/components/AccessibilityDebugPanel"

- <AuthProvider>
+ <AccessibilityProvider>
+   <AuthProvider>
      ...
+     <AccessibilityWrapper>
        <Routes> ... </Routes>
+       <AccessibilityDebugPanel />
+     </AccessibilityWrapper>
+   </AuthProvider>
+ </AccessibilityProvider>
```

**Ordine provider:**
1. QueryClientProvider (top)
2. AccessibilityProvider (new)
3. AuthProvider
4. LanguageProvider
5. CartProvider
6. TooltipProvider

---

## 🎯 VARIABILI GLOBALI MODIFICABILI

**File:** `src/config/siteConfig.ts`

### Mode
```typescript
mode: "public" // ← Cambia qui
// Valori: "public" | "password-protected" | "maintenance"
```

### Password
```typescript
password: "pizzart2025" // ← Cambia qui
```

### Colori
```typescript
brandColors: {
  primaryGreen: "#82b856",        // Colore principale
  primaryGreenDark: "#4a5f3f",    // Colore scuro
}
```

### Testi Coming Soon
```typescript
comingSoonTexts: {
  header: "PizzArt",
  subtitle: "Novità in arrivo",
  mainTitle: "Stiamo finendo\ndi sistemare qualcosa",
  description: "Stiamo preparando...",
}
```

### Testi Login
```typescript
passwordLoginTexts: {
  header: "PizzArt",
  subheader: "Accesso riservato",
  inputPlaceholder: "Inserisci la password",
  submitButton: "Accedi",
  errorMessage: "Password non corretta. Riprova.",
  infoText: "Questa pagina è protetta...",
}
```

---

## 🧪 COME TESTARE

1. **Build completa:**
   ```bash
   npm run build
   ```
   ✅ Risultato: Build successful

2. **Dev mode:**
   ```bash
   npm run dev
   ```
   ✅ Risultato: Server avviato, debug panel visibile

3. **Cambia modo:**
   - Clicca 🛠️ Debug (basso destra)
   - Seleziona: Public / Password / Maintenance
   - Vedi il cambio istantaneo

4. **Test login:**
   - Modo: Password
   - Password: pizzart2025
   - ✅ Accedi al sito

---

## ✅ REQUISITI SODDISFATTI

- [x] Pagina Coming Soon con forma verde curva
- [x] Logo "PizzArt" in alto a sinistra
- [x] Testo rassicurante ("Stiamo finendo di sistemare...")
- [x] Design responsive (mobile, tablet, desktop)
- [x] Colore verde PizzArt (#82b856)
- [x] Pagina Login minimalista
- [x] Password input + bottone "Accedi"
- [x] 3 stati gestibili facilmente
- [x] Flag/configurazione semplice
- [x] ZERO modifiche al sito quando disattivato
- [x] Sessione persistente (localStorage)
- [x] Debug panel per sviluppo
- [x] Documentazione completa

---

## 🚀 DEPLOYMENT CHECKLIST

Prima di mandare in produzione:

```
[ ] Verifica mode: "public"
[ ] Verifica che sito sia 100% identico al layout originale
[ ] Test responsive su tutti i device
[ ] Rimuovi siteConfig.ts dai commenti di debug
[ ] Usa variabili d'ambiente per password (opzionale)
[ ] Test completo di tutti i 3 stati in produzione
[ ] Clearare localStorage se necessario
[ ] Verificare che admin/auth siano sempre accessibili
```

---

## 📞 SUPPORTO

**Domande comuni:**
- Vedi: `GUIDA-RAPIDA-ACCESSO.md`

**Test dettagliati:**
- Vedi: `TESTING-GUIDE.md`

**Documentazione completa:**
- Vedi: `ACCESSIBILITY-SYSTEM.md`

---

**Created:** 30 Dicembre 2025
**Status:** ✅ PRODUCTION READY
**Version:** 1.0.0
