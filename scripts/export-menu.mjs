#!/usr/bin/env node

/**
 * Script per esportare il menu in formato CSV/Excel
 * Esporta solo i prodotti del menu asporto (escludendo birre alla spina, bicicletta, vini sfusi)
 * 
 * Uso: node scripts/export-menu.js
 * Output: menu-asporto.csv
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { menuCategories } from '../src/data/menuData.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Categorie da escludere (menu locale non asporto)
const EXCLUDED_CATEGORIES = ['birra-alla-spina', 'birra-bicicletta', 'vini-sfusi'];

const rows = [
  ['Nome Prodotto', 'Categoria', 'Prezzo', 'Ingredienti', 'Allergeni', 'Tag Dietetici']
];

let productCount = 0;

// Itera sulle categorie
for (const category of menuCategories) {
  // Salta categorie escluse
  if (EXCLUDED_CATEGORIES.includes(category.id)) {
    console.log(`⏭️  Saltando categoria esclusa: ${category.name}`);
    continue;
  }

  // Itera sui prodotti
  for (const product of category.items) {
    const allergens = (product.allergens || []).join(', ');
    const tags = (product.dietaryTags || []).join(', ');

    rows.push([
      product.name,
      category.name,
      `€${product.price.toFixed(2)}`,
      product.desc,
      allergens || '-',
      tags || '-'
    ]);

    productCount++;
  }
}

// Genera CSV
const csv = rows
  .map(row => 
    row.map(cell => {
      // Escappa le virgole e le virgolette nel contenuto
      if (cell.includes(',') || cell.includes('"')) {
        return `"${cell.replace(/"/g, '""')}"`;
      }
      return cell;
    }).join(',')
  )
  .join('\n');

// Scrivi file
const outputPath = path.join(__dirname, '../menu-asporto.csv');
fs.writeFileSync(outputPath, csv, 'utf8');

console.log('');
console.log('✅ Export completato!');
console.log(`📊 File: menu-asporto.csv`);
console.log(`📦 Prodotti esportati: ${productCount}`);
console.log(`📂 Percorso: ${outputPath}`);
console.log('');
console.log('💡 Puoi aprire il file con:');
console.log('   - Microsoft Excel');
console.log('   - Google Sheets (Importa > Carica > Seleziona il file)');
console.log('   - LibreOffice Calc');
console.log('');
