export type AudienceType = 'corporate' | 'academic' | 'retail' | 'export';

export interface ProductConfig {
  id: string;
  name: string;
  category: string;
  description: string;
  audience: AudienceType[];
  gsmOptions: number[];
  basePrice: number;
  minOrderQty: number;
  leadTimeDays: string;
}

export interface BillBookConfig {
  parts: 2 | 3 | 4;
  size: 'A4' | 'A5' | 'A6' | 'Custom';
  explodeDistance: number;
  isTorn: boolean;
  binding: 'cloth-tape' | 'hardbound' | 'pad-glued';
  showNumbering: boolean;
  sheetsPerBook: number;
}

export interface CardConfig {
  finish: 'gold-foil' | 'rose-gold' | 'holographic' | 'spot-uv' | 'blind-deboss';
  paperStock: 'cotton-black-600' | 'velvet-matte-400' | 'kraft-450' | 'triplex-core-700';
  corners: 'standard' | 'rounded-5mm';
  cardName: string;
  companyName: string;
}

export interface TextbookConfig {
  bindingType: 'saddle-stitch' | 'perfect-bound' | 'hardcover-casebound';
  pageCount: 64 | 128 | 256 | 512;
  pageSpreadProgress: number; // 0 to 1
  coverFinish: 'matte-lamination' | 'gloss-uv' | 'embossed-cloth';
  paperGsm: 54 | 70 | 80;
}

export interface ExportReelConfig {
  paperGrade: 'virgin-woodfree' | 'kraft-linear' | 'duplex-board' | 'coated-art';
  gsm: number;
  reelDiameterMm: number; // 800 - 1500 mm
  webWidthMm: number; // 600 - 2200 mm
  coreDiameterInches: 3 | 6;
  packaging: 'kraft-wrap' | 'poly-shrink' | 'pallet-crated';
  containerType: '20ft' | '40ft';
}

export interface RfqFormData {
  fullName: string;
  company: string;
  email: string;
  phone: string;
  category: string;
  productType: string;
  quantity: number;
  customNotes: string;
  needSampleBox: boolean;
  fileUploaded?: {
    name: string;
    sizeKb: number;
    dpi: number;
    colorSpace: 'CMYK' | 'RGB';
    hasBleed: boolean;
  };
}

