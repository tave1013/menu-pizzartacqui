// Complete list of allergens for product management
export interface Allergen {
  value: string;
  label: string;
}

export const ALLERGENS_LIST: Allergen[] = [
  { value: 'arachidi', label: 'Arachidi' },
  { value: 'cereali_avena', label: 'Cereali contenenti glutine - avena' },
  { value: 'cereali_grano', label: 'Cereali contenenti glutine - grano' },
  { value: 'cereali_orzo', label: 'Cereali contenenti glutine - orzo' },
  { value: 'cereali_segale', label: 'Cereali contenenti glutine - segale' },
  { value: 'crostacei', label: 'Crostacei' },
  { value: 'solfiti', label: 'Diossido di zolfo e solfiti' },
  { value: 'glutine', label: 'Glutine' },
  { value: 'latte', label: 'Latte' },
  { value: 'lupini', label: 'Lupini' },
  { value: 'molluschi', label: 'Molluschi' },
  { value: 'noci', label: 'Noci' },
  { value: 'noci_anacardo', label: 'Noci - anacardo' },
  { value: 'noci_macadamia', label: 'Noci - macadamia' },
  { value: 'noci_mandorla', label: 'Noci - mandorla' },
  { value: 'noci_nocciola', label: 'Noci - nocciola' },
  { value: 'noci_noce', label: 'Noci - noce' },
  { value: 'noci_brasile', label: 'Noci - noce del Brasile' },
  { value: 'noci_pecan', label: 'Noci - noce pecan' },
  { value: 'noci_pistacchio', label: 'Noci - pistacchio' },
  { value: 'pesce', label: 'Pesce' },
  { value: 'sedano', label: 'Sedano' },
  { value: 'soia', label: 'Semi di soia' },
  { value: 'senape', label: 'Senape' },
  { value: 'sesamo', label: 'Sesamo' },
  { value: 'uova', label: 'Uova' },
];

export const getAllergenLabel = (value: string): string => {
  return ALLERGENS_LIST.find(a => a.value === value)?.label || value;
};
