#!/usr/bin/env node

/**
 * Script per esportare il menu in formato CSV/Excel
 * Esporta solo i prodotti del menu asporto (escludendo birre alla spina, bicicletta, vini sfusi)
 * 
 * Uso: node scripts/export-menu.js
 * Output: menu-export.csv
 */

const fs = require('fs');
const path = require('path');

// Categorie da escludere (menu locale non asporto)
const EXCLUDED_CATEGORIES = ['birra-alla-spina', 'birra-bicicletta', 'vini-sfusi'];

// Leggi menuData.ts e estrai i dati
const menuDataPath = path.join(__dirname, '../src/data/menuData.ts');
const menuContent = fs.readFileSync(menuDataPath, 'utf8');

// Estrai la sezione export const menuCategories
const match = menuContent.match(/export const menuCategories: Category\[\] = \[([\s\S]*?)\];/);
if (!match) {
  console.error('❌ Impossibile trovare menuCategories in menuData.ts');
  process.exit(1);
}

// Parse manuale dei dati (semplificato per estrarre i valori)
const categoryMatches = menuContent.matchAll(
  /{\s*id:\s*"([^"]+)"[\s\S]*?name:\s*"([^"]+)"[\s\S]*?items:\s*\[([\s\S]*?)\s*\],?\s*},?/g
);

const rows = [
  ['Nome Prodotto', 'Categoria', 'Prezzo', 'Ingredienti', 'Allergeni', 'Tag Dietetici']
];

let productCount = 0;

for (const categoryMatch of categoryMatches) {
  const categoryId = categoryMatch[1];
  const categoryName = categoryMatch[2];
  const itemsStr = categoryMatch[3];

  // Salta categorie escluse
  if (EXCLUDED_CATEGORIES.includes(categoryId)) {
    console.log(`⏭️  Saltando categoria esclusa: ${categoryName}`);
    continue;
  }

  // Estrai i singoli prodotti
  const itemMatches = itemsStr.matchAll(
    /{\s*id:\s*"([^"]+)"[\s\S]*?name:\s*"([^"]+)"[\s\S]*?desc:\s*"([^"]+)"[\s\S]*?price:\s*([\d.]+)[\s\S]*?(?:allergens:\s*\[(.*?)\])?[\s\S]*?(?:dietaryTags:\s*\[(.*?)\])?[\s\S]*?contact:/g
  );

  for (const itemMatch of itemMatches) {
    const productId = itemMatch[1];
    const productName = itemMatch[2];
    const desc = itemMatch[3];
    const price = itemMatch[4];
    const allergensStr = itemMatch[5] || '';
    const tagsStr = itemMatch[6] || '';

    // Parse allergeni
    const allergens = allergensStr
      .split(',')
      .map(a => a.trim().replace(/"/g, ''))
      .filter(a => a)
      .join(', ');

    // Parse tag dietetici
    const tags = tagsStr
      .split(',')
      .map(t => t.trim().replace(/"/g, ''))
      .filter(t => t)
      .join(', ');

    rows.push([
      productName,
      categoryName,
      `€${parseFloat(price).toFixed(2)}`,
      desc,
      allergens,
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
