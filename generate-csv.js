const fs = require('fs');

// Leggi il file menuData.ts
const menuDataPath = './src/data/menuData.ts';
const content = fs.readFileSync(menuDataPath, 'utf8');

// Estrai l'array menuCategories usando regex
const match = content.match(/export const menuCategories: Category\[\] = \[([\s\S]*?)\];/);
if (!match) {
  console.log('Errore: impossibile trovare menuCategories');
  process.exit(1);
}

// Converti da TypeScript a JSON (rimuovi commenti e trailing commas)
let jsonString = match[1]
  .replace(/\/\/.*$/gm, '')  // rimuovi commenti
  .replace(/,(\s*[}\]])/g, '$1');  // rimuovi trailing commas

// Aggiungi parentesi quadre
jsonString = '[' + jsonString + ']';

// Valuta il codice per ottenere l'oggetto JavaScript
const categories = eval(jsonString);

// Crea CSV
let csv = 'Categoria,Nome Prodotto,Descrizione,Prezzo (€),Allergeni\n';

categories.forEach(category => {
  if (category.items) {
    category.items.forEach(item => {
      const categoryName = category.name || '';
      const name = (item.name || '').replace(/,/g, ';').replace(/"/g, '""');
      const desc = (item.desc || '').replace(/,/g, ';').replace(/"/g, '""');
      const price = item.price || '';
      const allergens = item.allergens ? item.allergens.join(', ') : '';
      
      csv += `"${categoryName}","${name}","${desc}",${price},"${allergens}"\n`;
    });
  }
});

// Salva il CSV
fs.writeFileSync('./catalogo-completo.csv', csv, 'utf8');
console.log('✓ File CSV creato: catalogo-completo.csv');
console.log('Totale categorie:', categories.length);
console.log('Totale prodotti:', categories.reduce((acc, cat) => acc + (cat.items ? cat.items.length : 0), 0));
