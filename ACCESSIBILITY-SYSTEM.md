# 🎨 Sistema di Accessibilità Sito - Coming Soon + Password Login

## 📋 Panoramica

Sistema completo per gestire 3 stati del sito:
1. **Sito Pubblico** - Accesso libero a tutti
2. **Protetto da Password** - Solo con credenziali valide
3. **Manutenzione** - Pagina Coming Soon visualizzata a tutti

## ⚙️ CONFIGURAZIONE RAPIDA

### Modifica lo stato del sito

File: `src/contexts/AccessibilityContext.tsx` (linee 15-21)

```typescript
const SITE_CONFIG = {
  mode: "public" as SiteMode, // Cambia qui
  password: "pizzart2025",
};
```

**Valori possibili per `mode`:**
- `"public"` - Sito pubblico, accesso libero
- `"password-protected"` - Accesso protetto da password
- `"maintenance"` - Mostra pagina Coming Soon

### Cambiare la password

Modifica il valore `password` nello stesso file:

```typescript
password: "YOUR_NEW_PASSWORD"
```

---

## 🎯 COME FUNZIONA

### Stato 1: Sito Pubblico (`mode: "public"`)

```
┌─────────────────────────────────────┐
│ Sito funziona NORMALMENTE al 100%   │
│ - Menu completo                     │
│ - Carrello                          │
│ - Prenotazioni                      │
│ - Tutto visibile come sempre        │
└─────────────────────────────────────┘
```

✅ **Nessuna modifica al layout**
✅ **Nessun pixel diverso**

---

### Stato 2: Password Protetto (`mode: "password-protected"`)

```
┌──────────────────────────────────┐
│ PAGINA LOGIN                     │
│                                  │
│ PizzArt                          │
│ [Accesso riservato]              │
│                                  │
│ [Password: ___________]          │
│                                  │
│ [Accedi]                         │
└──────────────────────────────────┘
         ↓ (password corretta)
┌──────────────────────────────────┐
│ Sito COMPLETO                    │
│ (come modo public)               │
└──────────────────────────────────┘
```

⏰ **Sessione:** Memorizzata in localStorage
🔓 **Logout:** `localStorage.removeItem("site_authenticated")`

---

### Stato 3: Manutenzione (`mode: "maintenance"`)

```
┌──────────────────────────────────┐
│ PAGINA COMING SOON               │
│                                  │
│ ┌────────────────────────────┐   │
│ │                            │   │
│ │  PizzArt (header)          │   │
│ │                            │   │
│ │    [Forma Verde Grande]    │   │
│ │                            │   │
│ │  "Stiamo finendo di        │   │
│ │   sistemare qualcosa"      │   │
│ │                            │   │
│ └────────────────────────────┘   │
│                                  │
└──────────────────────────────────┘
```

🎨 **Responsive:** Mobile, Tablet, Desktop
🟢 **Colore:** Verde PizzArt (#82b856)

---

## 📁 FILE CREATI

| File | Descrizione |
|------|-------------|
| `src/contexts/AccessibilityContext.tsx` | Context con logica di autenticazione |
| `src/pages/ComingSoon.tsx` | Pagina Coming Soon responsive |
| `src/pages/PasswordLogin.tsx` | Pagina Login con password |
| `src/components/AccessibilityWrapper.tsx` | Componente che applica le limitazioni |
| `src/App.tsx` | Modificato per aggiungere i provider |

---

## 🔧 API DISPONIBILE

### Hook: `useAccessibility()`

```typescript
import { useAccessibility } from "@/contexts/AccessibilityContext";

const { mode, isAuthenticated, authenticate, logout, setMode } = useAccessibility();

// authenticate(password: string) -> boolean
// Autentica l'utente, restituisce true se password corretta

// logout() -> void
// Rimuove autenticazione e localStorage

// setMode(mode: SiteMode) -> void
// Cambia la modalità programmticamente (se necessario)
```

---

## 📱 RESPONSIVENESS

La pagina Coming Soon è perfettamente responsive:

| Device | Behavior |
|--------|----------|
| **Mobile (320px+)** | Forma curva adattata, testo a 1 riga quando possibile |
| **Tablet (768px+)** | Proporzioni bilanciate |
| **Desktop (1024px+)** | Forma grande, testo in 2 righe naturali |

✅ Nessun overflow
✅ Nessun taglio della forma
✅ Proporzioni visive coerenti

---

## 🚀 SCENARI DI USO

### Scenario 1: Mostrare progresso al cliente
```typescript
mode: "password-protected"
password: "client2025"
```

Cliente accede con password → Vede il sito in sviluppo

---

### Scenario 2: Manutenzione pianificata
```typescript
mode: "maintenance"
```

Tutti gli utenti vedono Coming Soon

---

### Scenario 3: Lancio pubblico
```typescript
mode: "public"
```

Sito pubblico al 100%, nessuna limitazione

---

## 🔐 SICUREZZA NOTE

⚠️ **Attenzione:** Password è hardcoded nel codice.

Per produzione:
- Usa variabili d'ambiente (`.env`)
- Implementa un sistema di autenticazione backend
- Non committare password in git

Esempio con `.env`:
```typescript
const SITE_CONFIG = {
  mode: import.meta.env.VITE_SITE_MODE as SiteMode,
  password: import.meta.env.VITE_SITE_PASSWORD,
};
```

---

## 🎨 PERSONALIZZAZIONE

### Cambiare il testo della Coming Soon

File: `src/pages/ComingSoon.tsx`

```tsx
<h2 className="...">
  Stiamo finendo
  <br />
  di sistemare qualcosa
</h2>
```

### Cambiare il colore verde

Usa il colore `#82b856` in `src/pages/ComingSoon.tsx`:
- `fill="#82b856"` (SVG)
- `bg-green-700` → personalizza se necessario

### Cambiare header della login

File: `src/pages/PasswordLogin.tsx`

```tsx
<h1 className="...">PizzArt</h1>
<p className="...">Accesso riservato</p>
```

---

## ✅ CHECKLIST FINALE

- [x] Pagina Coming Soon responsive
- [x] Pagina Password Login funzionante
- [x] 3 stati gestibili facilmente
- [x] SessionStorage per persistenza
- [x] Nessun cambio al sito quando disattivato
- [x] Colore verde PizzArt
- [x] Design minimalista e professionale
- [x] Documentazione completa

---

## 🐛 TROUBLESHOOTING

### "Password non riconosciuta"
Verifica che la password in `AccessibilityContext.tsx` corrisponda a quella che stai usando

### "LocalStorage non cancella l'autenticazione"
Esegui in console:
```javascript
localStorage.removeItem("site_authenticated");
location.reload();
```

### "La forma Coming Soon esce dallo schermo"
È un SVG responsive, controlla che il viewport sia corretto. Se hai problemi, comunica i dettagli del browser/dispositivo.

---

**Creato:** 30 Dicembre 2025
**Per:** menu.pizzartacquiterme.com
**Brand:** PizzArt
