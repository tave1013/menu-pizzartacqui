/**
 * Traduzioni per la pagina di prenotazione
 * Queste traduzioni sono manuali per evitare conflitti con React
 */

import { Language } from "@/i18n";

export const bookingTranslations: Record<Language, Record<string, string>> = {
  it: {
    // Header
    back: "Indietro",
    step1Title: "Seleziona data",
    step2Title: "Dettagli prenotazione",
    step3Title: "I tuoi dati",
    
    // Step 1
    bookingInfo: "È possibile prenotare fino a 20 giorni in anticipo.",
    selectedDate: "Data selezionata:",
    
    // Step 2
    adults: "Adulti",
    children: "Bambini",
    selectTime: "Seleziona orario",
    addNotes: "Aggiungi note",
    notesPlaceholder: "Es. 2 persone intolleranti al glutine; seggiolino per bambino",
    
    // Step 3
    firstName: "Nome",
    lastName: "Cognome",
    phone: "Telefono",
    email: "Email",
    privacyConsent: "Ho letto e accetto l'Informativa Privacy.",
    contactConsent: "Acconsento ad essere ricontattato per comunicazioni inerenti la prenotazione.",
    required: "*",
    
    // Buttons
    next: "Avanti",
    sendWhatsApp: "Invia su WhatsApp",
    
    // Errors
    invalidPhone: "Numero non valido (es. +39 333 1234567)",
    invalidEmail: "Email non valida",
    
    // Dialog
    dialogTitle: "Hai inviato il messaggio?",
    dialogDescription: "Conferma se hai completato l'invio su WhatsApp.",
    confirmSent: "Sì, ho inviato su WhatsApp",
    reopenWhatsApp: "Riapri WhatsApp",
    modifyBooking: "Modifica prenotazione",
    
    // Placeholders
    namePlaceholder: "Mario",
    surnamePlaceholder: "Rossi",
    phonePlaceholder: "+39 333 1234567",
    emailPlaceholder: "mario.rossi@email.it",
  },
  
  en: {
    // Header
    back: "Back",
    step1Title: "Select date",
    step2Title: "Booking details",
    step3Title: "Your info",
    
    // Step 1
    bookingInfo: "You can book up to 20 days in advance.",
    selectedDate: "Selected date:",
    
    // Step 2
    adults: "Adults",
    children: "Children",
    selectTime: "Select time",
    addNotes: "Add notes",
    notesPlaceholder: "E.g. 2 gluten intolerant; high chair needed",
    
    // Step 3
    firstName: "First name",
    lastName: "Last name",
    phone: "Phone",
    email: "Email",
    privacyConsent: "I have read and accept the Privacy Policy.",
    contactConsent: "I agree to be contacted for booking communications.",
    required: "*",
    
    // Buttons
    next: "Next",
    sendWhatsApp: "Send on WhatsApp",
    
    // Errors
    invalidPhone: "Invalid number (e.g. +39 333 1234567)",
    invalidEmail: "Invalid email",
    
    // Dialog
    dialogTitle: "Did you send the message?",
    dialogDescription: "Confirm if you completed the WhatsApp message.",
    confirmSent: "Yes, I sent it on WhatsApp",
    reopenWhatsApp: "Reopen WhatsApp",
    modifyBooking: "Edit booking",
    
    // Placeholders
    namePlaceholder: "John",
    surnamePlaceholder: "Smith",
    phonePlaceholder: "+39 333 1234567",
    emailPlaceholder: "john.smith@email.com",
  },
  
  fr: {
    // Header
    back: "Retour",
    step1Title: "Choisir la date",
    step2Title: "Détails de la réservation",
    step3Title: "Vos coordonnées",
    
    // Step 1
    bookingInfo: "Vous pouvez réserver jusqu'à 20 jours à l'avance.",
    selectedDate: "Date sélectionnée:",
    
    // Step 2
    adults: "Adultes",
    children: "Enfants",
    selectTime: "Choisir l'heure",
    addNotes: "Ajouter des notes",
    notesPlaceholder: "Ex. 2 personnes intolérantes au gluten; chaise haute",
    
    // Step 3
    firstName: "Prénom",
    lastName: "Nom",
    phone: "Téléphone",
    email: "Email",
    privacyConsent: "J'ai lu et j'accepte la Politique de confidentialité.",
    contactConsent: "J'accepte d'être recontacté pour les communications de réservation.",
    required: "*",
    
    // Buttons
    next: "Suivant",
    sendWhatsApp: "Envoyer sur WhatsApp",
    
    // Errors
    invalidPhone: "Numéro invalide (ex. +39 333 1234567)",
    invalidEmail: "Email invalide",
    
    // Dialog
    dialogTitle: "Avez-vous envoyé le message?",
    dialogDescription: "Confirmez si vous avez terminé l'envoi sur WhatsApp.",
    confirmSent: "Oui, j'ai envoyé sur WhatsApp",
    reopenWhatsApp: "Rouvrir WhatsApp",
    modifyBooking: "Modifier la réservation",
    
    // Placeholders
    namePlaceholder: "Jean",
    surnamePlaceholder: "Dupont",
    phonePlaceholder: "+39 333 1234567",
    emailPlaceholder: "jean.dupont@email.fr",
  },
  
  de: {
    // Header
    back: "Zurück",
    step1Title: "Datum wählen",
    step2Title: "Buchungsdetails",
    step3Title: "Ihre Daten",
    
    // Step 1
    bookingInfo: "Sie können bis zu 20 Tage im Voraus buchen.",
    selectedDate: "Ausgewähltes Datum:",
    
    // Step 2
    adults: "Erwachsene",
    children: "Kinder",
    selectTime: "Uhrzeit wählen",
    addNotes: "Notizen hinzufügen",
    notesPlaceholder: "Z.B. 2 Personen glutenintolerant; Kinderstuhl benötigt",
    
    // Step 3
    firstName: "Vorname",
    lastName: "Nachname",
    phone: "Telefon",
    email: "E-Mail",
    privacyConsent: "Ich habe die Datenschutzrichtlinie gelesen und akzeptiere sie.",
    contactConsent: "Ich stimme zu, für Buchungskommunikation kontaktiert zu werden.",
    required: "*",
    
    // Buttons
    next: "Weiter",
    sendWhatsApp: "Auf WhatsApp senden",
    
    // Errors
    invalidPhone: "Ungültige Nummer (z.B. +39 333 1234567)",
    invalidEmail: "Ungültige E-Mail",
    
    // Dialog
    dialogTitle: "Haben Sie die Nachricht gesendet?",
    dialogDescription: "Bestätigen Sie, ob Sie die WhatsApp-Nachricht abgeschlossen haben.",
    confirmSent: "Ja, ich habe auf WhatsApp gesendet",
    reopenWhatsApp: "WhatsApp erneut öffnen",
    modifyBooking: "Buchung bearbeiten",
    
    // Placeholders
    namePlaceholder: "Hans",
    surnamePlaceholder: "Müller",
    phonePlaceholder: "+39 333 1234567",
    emailPlaceholder: "hans.mueller@email.de",
  },
  
  es: {
    // Header
    back: "Atrás",
    step1Title: "Seleccionar fecha",
    step2Title: "Detalles de la reserva",
    step3Title: "Tus datos",
    
    // Step 1
    bookingInfo: "Puedes reservar hasta 20 días de antelación.",
    selectedDate: "Fecha seleccionada:",
    
    // Step 2
    adults: "Adultos",
    children: "Niños",
    selectTime: "Seleccionar hora",
    addNotes: "Añadir notas",
    notesPlaceholder: "Ej. 2 personas intolerantes al gluten; trona para niño",
    
    // Step 3
    firstName: "Nombre",
    lastName: "Apellido",
    phone: "Teléfono",
    email: "Email",
    privacyConsent: "He leído y acepto la Política de Privacidad.",
    contactConsent: "Acepto ser contactado para comunicaciones de la reserva.",
    required: "*",
    
    // Buttons
    next: "Siguiente",
    sendWhatsApp: "Enviar por WhatsApp",
    
    // Errors
    invalidPhone: "Número no válido (ej. +39 333 1234567)",
    invalidEmail: "Email no válido",
    
    // Dialog
    dialogTitle: "¿Enviaste el mensaje?",
    dialogDescription: "Confirma si completaste el envío en WhatsApp.",
    confirmSent: "Sí, lo envié por WhatsApp",
    reopenWhatsApp: "Reabrir WhatsApp",
    modifyBooking: "Modificar reserva",
    
    // Placeholders
    namePlaceholder: "Juan",
    surnamePlaceholder: "García",
    phonePlaceholder: "+39 333 1234567",
    emailPlaceholder: "juan.garcia@email.es",
  },
};

/**
 * Hook per ottenere le traduzioni della prenotazione
 */
export function useBookingTranslations(language: Language) {
  return bookingTranslations[language] || bookingTranslations.it;
}
