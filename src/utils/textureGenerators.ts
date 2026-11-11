import * as THREE from 'three';

/**
 * Procedurally generates realistic canvas textures for 3D printed artifacts.
 * No external image downloads needed; guarantees zero-latency, crisp rendering.
 */

// Generate realistic paper noise / grain bump map
export function createPaperGrainTexture(width = 512, height = 512, intensity = 0.15): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, width, height);

  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;

  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 255 * intensity;
    const val = Math.min(255, Math.max(0, 128 + noise));
    data[i] = val;
    data[i + 1] = val;
    data[i + 2] = val;
    data[i + 3] = 255;
  }
  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  return texture;
}

// Generate printed book leaf texture with realistic text lines (Page inside)
export function createBookLeafTexture(pageNumber = 1): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1448;
  const ctx = canvas.getContext('2d')!;

  // Warm book paper background
  ctx.fillStyle = '#FAF7F0';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Subtle paper grain
  ctx.fillStyle = 'rgba(0,0,0,0.015)';
  for (let i = 0; i < 3000; i++) {
    ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 2, 2);
  }

  // Running header
  ctx.font = '500 18px "JetBrains Mono", monospace';
  ctx.fillStyle = '#6B7280';
  ctx.fillText('MAYURI PRINTERS — 35 YEARS OF PRINTING EXCELLENCE', 120, 90);
  ctx.fillText(`${pageNumber}`, canvas.width - 140, 90);

  ctx.strokeStyle = '#D1D5DB';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(120, 110);
  ctx.lineTo(canvas.width - 120, 110);
  ctx.stroke();

  // Chapter Title
  ctx.font = 'bold 36px "Playfair Display", Georgia, serif';
  ctx.fillStyle = '#111827';
  ctx.fillText('Chapter 4: Precision Manufacturing', 120, 180);

  // Simulated paragraph text lines
  ctx.fillStyle = '#374151';
  let y = 240;
  for (let p = 0; p < 5; p++) {
    for (let l = 0; l < 6; l++) {
      const lineWidth = l === 5 ? canvas.width - 320 : canvas.width - 240;
      ctx.fillRect(120, y, lineWidth, 8);
      y += 24;
    }
    y += 30; // paragraph gap
  }

  return new THREE.CanvasTexture(canvas);
}

// Generate Book Inside Endpaper & Bookplate Texture (Inside Front Cover)
export function createBookInsideCoverTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1448;
  const ctx = canvas.getContext('2d')!;

  // Warm cream parchment endpaper
  ctx.fillStyle = '#F5EFE1';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Subtle decorative grid pattern
  ctx.strokeStyle = 'rgba(214, 173, 97, 0.12)';
  ctx.lineWidth = 1;
  for (let x = -canvas.height; x < canvas.width; x += 36) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + canvas.height, canvas.height);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x + canvas.height, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }

  // Classic Ex Libris Bookplate in center
  const bpW = 560;
  const bpH = 700;
  const bpX = (canvas.width - bpW) / 2;
  const bpY = (canvas.height - bpH) / 2;

  ctx.fillStyle = '#FAF7EE';
  ctx.fillRect(bpX, bpY, bpW, bpH);

  ctx.strokeStyle = '#D6AD61';
  ctx.lineWidth = 3;
  ctx.strokeRect(bpX, bpY, bpW, bpH);

  ctx.strokeStyle = 'rgba(214, 173, 97, 0.4)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(bpX + 12, bpY + 12, bpW - 24, bpH - 24);

  ctx.fillStyle = '#111827';
  ctx.font = 'italic bold 32px "Playfair Display", serif';
  ctx.textAlign = 'center';
  ctx.fillText('EX LIBRIS', canvas.width / 2, bpY + 95);

  ctx.fillStyle = '#D6AD61';
  ctx.font = 'bold 15px "JetBrains Mono", monospace';
  ctx.fillText('MAYURI ACADEMIC PRESS // EST. 1991', canvas.width / 2, bpY + 135);

  // Press Crest Monogram
  ctx.beginPath();
  ctx.arc(canvas.width / 2, bpY + 260, 68, 0, Math.PI * 2);
  ctx.strokeStyle = '#D6AD61';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(canvas.width / 2, bpY + 260, 56, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(214, 173, 97, 0.5)';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.font = 'bold 62px "Playfair Display", serif';
  ctx.fillStyle = '#111827';
  ctx.fillText('M', canvas.width / 2, bpY + 282);

  ctx.font = 'bold 18px "Playfair Display", serif';
  ctx.fillText('35 YEARS PRINTING GUILD', canvas.width / 2, bpY + 380);

  ctx.font = '500 14px "JetBrains Mono", monospace';
  ctx.fillStyle = '#6B7280';
  ctx.fillText('SMYTH-SEWN CURRICULUM ARCHIVE', canvas.width / 2, bpY + 415);
  ctx.fillText('INSTITUTIONAL MASTER REGISTER', canvas.width / 2, bpY + 440);

  // Allocation lines
  ctx.strokeStyle = '#D1D5DB';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(bpX + 70, bpY + 510);
  ctx.lineTo(bpX + bpW - 70, bpY + 510);
  ctx.moveTo(bpX + 70, bpY + 565);
  ctx.lineTo(bpX + bpW - 70, bpY + 565);
  ctx.stroke();

  ctx.font = '13px "JetBrains Mono", monospace';
  ctx.fillText('CLASS / DIVISION: _________________________', canvas.width / 2, bpY + 500);
  ctx.fillText('STUDENT REGISTRATION: _____________________', canvas.width / 2, bpY + 555);

  ctx.fillStyle = '#9CA3AF';
  ctx.font = '11px "JetBrains Mono", monospace';
  ctx.fillText('GENUINE MAYURI PRESS PRODUCT • VERIFIED EDITION', canvas.width / 2, bpY + 630);

  return new THREE.CanvasTexture(canvas);
}

// Generate Bill Book Sheet Texture (Top White, Duplicate Pink, Triplicate Yellow)
export function createBillBookSheetTexture(
  type: 'white' | 'pink' | 'yellow',
  serial = '№ 084192',
  title = 'TAX INVOICE / BILL'
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1448; // A-format ratio
  const ctx = canvas.getContext('2d')!;

  // Base paper tint
  let bgColor = '#FDFCFA'; // Crisp White CB
  let tintBadge = 'ORIGINAL - BUYER COPY';
  let badgeColor = '#1e3a8a';
  if (type === 'pink') {
    bgColor = '#FDE2E8'; // Carbonless Pink CFB
    tintBadge = 'DUPLICATE - TRANSPORTER COPY';
    badgeColor = '#be185d';
  } else if (type === 'yellow') {
    bgColor = '#FEF9C3'; // Carbonless Yellow CF
    tintBadge = 'TRIPLICATE - ACCOUNTS COPY';
    badgeColor = '#a16207';
  }

  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Subtle paper grain
  ctx.fillStyle = 'rgba(0,0,0,0.015)';
  for (let i = 0; i < 4000; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    ctx.fillRect(x, y, 2, 2);
  }

  // Left binding / stub area with perforation line
  ctx.fillStyle = 'rgba(0,0,0,0.03)';
  ctx.fillRect(0, 0, 110, canvas.height);

  // Micro-perforation dash line at x = 110
  ctx.strokeStyle = '#6b7280';
  ctx.lineWidth = 3;
  ctx.setLineDash([8, 8]);
  ctx.beginPath();
  ctx.moveTo(110, 0);
  ctx.lineTo(110, canvas.height);
  ctx.stroke();
  ctx.setLineDash([]); // reset

  // Perforation text
  ctx.save();
  ctx.translate(60, canvas.height / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.font = 'bold 18px "JetBrains Mono", monospace';
  ctx.fillStyle = '#6B7280';
  ctx.textAlign = 'center';
  ctx.fillText('◄ TEAR ALONG PERFORATION ◄', 0, 0);
  ctx.restore();

  // Header Box
  ctx.strokeStyle = '#1f2937';
  ctx.lineWidth = 3;
  ctx.strokeRect(150, 60, canvas.width - 210, 180);

  // Company Name
  ctx.font = 'bold 36px "Playfair Display", Georgia, serif';
  ctx.fillStyle = '#111827';
  ctx.fillText('MAYURI PRINTERS', 180, 120);

  ctx.font = 'bold 18px "Inter", sans-serif';
  ctx.fillStyle = '#C89D56';
  ctx.fillText('35+ YEARS OF EXCELLENCE IN PRINTING', 180, 155);

  ctx.font = '500 16px "JetBrains Mono", monospace';
  ctx.fillStyle = '#4b5563';
  ctx.fillText('GOVT. REGD HIGH-SECURITY COMMERCIAL PRESS // EST. 1991', 180, 185);

  // Title and Copy Badge
  ctx.fillStyle = '#111827';
  ctx.font = 'bold 26px "Inter", sans-serif';
  ctx.fillText(title, 180, 290);

  ctx.fillStyle = badgeColor;
  ctx.font = 'bold 18px "JetBrains Mono", monospace';
  ctx.fillText(`[ ${tintBadge} ]`, 180, 325);

  // High-Security Red Crash Numbering
  ctx.fillStyle = '#dc2626'; // Deep letterpress red
  ctx.font = 'bold 38px "JetBrains Mono", monospace';
  ctx.textAlign = 'right';
  ctx.fillText(serial, canvas.width - 80, 295);

  ctx.font = '500 16px "JetBrains Mono", monospace';
  ctx.fillStyle = '#4b5563';
  ctx.fillText('Date: ____/____/2026', canvas.width - 80, 330);
  ctx.textAlign = 'left';

  // Table Grid
  const startY = 370;
  const tableHeight = 850;
  const tableWidth = canvas.width - 230;

  ctx.strokeStyle = '#374151';
  ctx.lineWidth = 2;
  ctx.strokeRect(150, startY, tableWidth, tableHeight);

  // Table Header row
  ctx.fillStyle = 'rgba(0,0,0,0.04)';
  ctx.fillRect(150, startY, tableWidth, 50);
  ctx.fillStyle = '#111827';
  ctx.font = 'bold 16px "JetBrains Mono", monospace';
  ctx.fillText('SR.', 165, startY + 32);
  ctx.fillText('DESCRIPTION OF GOODS / PUBLICATION', 230, startY + 32);
  ctx.fillText('HSN CODE', 680, startY + 32);
  ctx.fillText('QTY', 785, startY + 32);
  ctx.fillText('RATE', 850, startY + 32);
  ctx.fillText('TOTAL', 940, startY + 32);

  // Vertical column dividers
  const cols = [210, 660, 770, 835, 925];
  cols.forEach(x => {
    ctx.beginPath();
    ctx.moveTo(x, startY);
    ctx.lineTo(x, startY + tableHeight);
    ctx.stroke();
  });

  // Table sample rows
  ctx.font = '16px "JetBrains Mono", monospace';
  ctx.fillStyle = '#374151';
  for (let r = 1; r <= 12; r++) {
    const rowY = startY + 50 + (r * 60);
    ctx.fillText(`${r}.`, 175, rowY - 20);
    ctx.beginPath();
    ctx.moveTo(150, rowY);
    ctx.lineTo(150 + tableWidth, rowY);
    ctx.stroke();
  }

  // Footer Signature & Stamp area
  ctx.fillStyle = '#1f2937';
  ctx.font = '500 16px "Inter", sans-serif';
  ctx.fillText("Receiver's Signature & Seal", 180, canvas.height - 80);
  ctx.fillText('For MAYURI PRINTERS (Authorized Signatory)', canvas.width - 450, canvas.height - 80);

  // Stamp circle simulation
  ctx.strokeStyle = 'rgba(200, 157, 86, 0.4)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(canvas.width - 240, canvas.height - 110, 50, 0, Math.PI * 2);
  ctx.stroke();

  return new THREE.CanvasTexture(canvas);
}

// Generate Visiting Card Front & Mask Textures with Binay Rathi defaults
export function createVisitingCardTextures(
  cardName = 'BINAY RATHI',
  companyName = 'MAYURI PRINTERS',
  stock: 'cotton-black-600' | 'velvet-matte-400' | 'kraft-450' | 'triplex-core-700' = 'cotton-black-600'
) {
  const width = 1050; // 3.5 inches at 300 DPI
  const height = 600;  // 2.0 inches at 300 DPI

  const diffCanvas = document.createElement('canvas');
  diffCanvas.width = width;
  diffCanvas.height = height;
  const dCtx = diffCanvas.getContext('2d')!;

  const maskCanvas = document.createElement('canvas');
  maskCanvas.width = width;
  maskCanvas.height = height;
  const mCtx = maskCanvas.getContext('2d')!;

  // Background color based on paper stock
  let baseColor = '#14171E'; // Cotton black
  let foilColor = '#D6AD61';
  if (stock === 'velvet-matte-400') {
    baseColor = '#0F1A2E'; // Royal Navy Velvet
    foilColor = '#E2E8F0'; // Platinum Silver Foil
  } else if (stock === 'kraft-450') {
    baseColor = '#C29F6E'; // Sandalwood Kraft
    foilColor = '#27272A'; // Charcoal Deboss
  } else if (stock === 'triplex-core-700') {
    baseColor = '#090B10';
    foilColor = '#D6AD61';
  }

  dCtx.fillStyle = baseColor;
  dCtx.fillRect(0, 0, width, height);

  mCtx.fillStyle = '#000000'; // All paper starts 0% foil
  mCtx.fillRect(0, 0, width, height);

  // Add subtle tactile fibers
  dCtx.fillStyle = 'rgba(255,255,255,0.03)';
  for (let i = 0; i < 3000; i++) {
    dCtx.fillRect(Math.random() * width, Math.random() * height, 2, 2);
  }

  // Draw Card Border (Embossed & Foiled)
  dCtx.strokeStyle = foilColor;
  dCtx.lineWidth = 4;
  dCtx.strokeRect(40, 40, width - 80, height - 80);

  mCtx.strokeStyle = '#FFFFFF';
  mCtx.lineWidth = 4;
  mCtx.strokeRect(40, 40, width - 80, height - 80);

  // Company Emblem / Monogram
  dCtx.beginPath();
  dCtx.arc(140, 150, 45, 0, Math.PI * 2);
  dCtx.fillStyle = foilColor;
  dCtx.fill();

  mCtx.beginPath();
  mCtx.arc(140, 150, 45, 0, Math.PI * 2);
  mCtx.fillStyle = '#FFFFFF';
  mCtx.fill();

  // Letter M inside circle
  dCtx.fillStyle = baseColor;
  dCtx.font = 'bold 44px "Playfair Display", serif';
  dCtx.textAlign = 'center';
  dCtx.fillText('M', 140, 165);

  mCtx.fillStyle = '#000000';
  mCtx.font = 'bold 44px "Playfair Display", serif';
  mCtx.textAlign = 'center';
  mCtx.fillText('M', 140, 165);

  // Company Name
  dCtx.fillStyle = foilColor;
  dCtx.font = 'bold 30px "Playfair Display", serif';
  dCtx.textAlign = 'left';
  dCtx.fillText(companyName.toUpperCase(), 215, 145);

  mCtx.fillStyle = '#FFFFFF';
  mCtx.font = 'bold 30px "Playfair Display", serif';
  mCtx.textAlign = 'left';
  mCtx.fillText(companyName.toUpperCase(), 215, 145);

  dCtx.fillStyle = '#A3AAB5';
  dCtx.font = 'bold 15px "JetBrains Mono", monospace';
  dCtx.fillText('35 YEARS OF PRINTING EXCELLENCE & EXPORT', 215, 175);

  // Personal Name: Binay Rathi
  dCtx.fillStyle = '#FFFFFF';
  dCtx.font = 'bold 44px "Playfair Display", serif';
  dCtx.fillText(cardName, 100, 335);

  mCtx.fillStyle = '#FFFFFF';
  mCtx.font = 'bold 44px "Playfair Display", serif';
  mCtx.fillText(cardName, 100, 335);

  // Title
  dCtx.fillStyle = foilColor;
  dCtx.font = '600 20px "Inter", sans-serif';
  dCtx.fillText('FOUNDER & MANAGING DIRECTOR', 100, 375);

  mCtx.fillStyle = '#FFFFFF';
  mCtx.font = '600 20px "Inter", sans-serif';
  mCtx.fillText('FOUNDER & MANAGING DIRECTOR', 100, 375);

  // Direct Corporate Details (No raw phone numbers here)
  dCtx.font = 'bold 18px "JetBrains Mono", monospace';
  dCtx.fillStyle = '#E2E8F0';
  dCtx.fillText('COMMERCIAL PRINTING & GLOBAL PAPER SUPPLY', 100, 475);
  dCtx.fillText('35 YEARS OF PRINTING EXCELLENCE • EST. 1991', 100, 510);
  dCtx.fillText('WEB: www.mayuriprinters.com', width - 420, 510);

  const diffuseTexture = new THREE.CanvasTexture(diffCanvas);
  const maskTexture = new THREE.CanvasTexture(maskCanvas);
  return { diffuseTexture, maskTexture };
}

// Generate Visiting Card Back Texture (Luxury Minimalist Crest & Contact)
export function createVisitingCardBackTexture(theme: 'obsidian' | 'royal-blue' | 'kraft' = 'obsidian'): THREE.CanvasTexture {
  const width = 1050;
  const height = 600;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  let bg = '#14171E';
  let gold = '#D6AD61';
  let sub = '#A1A8B5';

  if (theme === 'royal-blue') {
    bg = '#0F1A2E';
    gold = '#E2E8F0'; // Platinum Silver Foil
    sub = '#94A3B8';
  } else if (theme === 'kraft') {
    bg = '#C4A070';
    gold = '#27272A'; // Charcoal letterpress deboss
    sub = '#52525B';
  }

  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  // Micro tactile fibers
  ctx.fillStyle = 'rgba(255,255,255,0.03)';
  for (let i = 0; i < 3000; i++) {
    ctx.fillRect(Math.random() * width, Math.random() * height, 2, 2);
  }

  // Border frame
  ctx.strokeStyle = gold;
  ctx.lineWidth = 3.5;
  ctx.strokeRect(40, 40, width - 80, height - 80);

  ctx.strokeStyle = 'rgba(214, 173, 97, 0.3)';
  ctx.lineWidth = 1;
  ctx.strokeRect(52, 52, width - 104, height - 104);

  // Central Gold Foil Monogram Emblem
  const cx = width / 2;
  const cy = height / 2 - 35;

  ctx.beginPath();
  ctx.arc(cx, cy, 68, 0, Math.PI * 2);
  ctx.strokeStyle = gold;
  ctx.lineWidth = 2.5;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(cx, cy, 56, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(214, 173, 97, 0.4)';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.font = 'bold 64px "Playfair Display", Georgia, serif';
  ctx.fillStyle = gold;
  ctx.textAlign = 'center';
  ctx.fillText('M', cx, cy + 24);

  ctx.font = 'bold 22px "Playfair Display", Georgia, serif';
  ctx.fillText('MAYURI PRINTERS', cx, cy + 130);

  ctx.font = '600 13px "JetBrains Mono", monospace';
  ctx.fillStyle = sub;
  ctx.fillText('OFFSET & LETTERPRESS GUILD • 35 YEARS HERITAGE', cx, cy + 160);
  ctx.fillText('ISO 9001:2015 CERTIFIED COMMERCIAL PRODUCTION', cx, cy + 185);

  return new THREE.CanvasTexture(canvas);
}

// Generate Textbook Book Cover Texture
export function createTextbookCoverTexture(
  title = 'TEXTBOOK & BILL BOOK WORKS',
  subtitle = '35 Years of Printing Heritage // Quality Assured',
  bindingType = 'hardcover-casebound'
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1448;
  const ctx = canvas.getContext('2d')!;

  // Book cover background
  const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  if (bindingType === 'crimson' || bindingType === 'crimson-gold') {
    grad.addColorStop(0, '#3A0C16');
    grad.addColorStop(1, '#180408');
  } else if (bindingType === 'emerald' || bindingType === 'emerald-gold') {
    grad.addColorStop(0, '#0C2B1F');
    grad.addColorStop(1, '#05140E');
  } else if (bindingType === 'saddle-stitch') {
    grad.addColorStop(0, '#1C3144');
    grad.addColorStop(1, '#2B4A6F');
  } else {
    // Default Midnight Navy & Gold
    grad.addColorStop(0, '#101B2B');
    grad.addColorStop(1, '#080E17');
  }

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Gold ornamental geometric border
  ctx.strokeStyle = '#D6AD61';
  ctx.lineWidth = 4;
  ctx.strokeRect(60, 60, canvas.width - 120, canvas.height - 120);

  ctx.strokeStyle = 'rgba(214, 173, 97, 0.4)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(75, 75, canvas.width - 150, canvas.height - 150);

  // 35 Years Heritage Badge
  ctx.fillStyle = '#D6AD61';
  ctx.fillRect(canvas.width / 2 - 200, 140, 400, 45);
  ctx.fillStyle = '#0E1116';
  ctx.font = 'bold 18px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('35 YEARS OF PRINTING EXCELLENCE', canvas.width / 2, 168);

  // Main Book Title
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 50px "Playfair Display", Georgia, serif';
  const words = title.split(' ');
  if (words.length > 2) {
    ctx.fillText(words.slice(0, 2).join(' '), canvas.width / 2, 400);
    ctx.fillText(words.slice(2).join(' '), canvas.width / 2, 470);
  } else {
    ctx.fillText(title, canvas.width / 2, 430);
  }

  // Divider
  ctx.fillStyle = '#D6AD61';
  ctx.fillRect(canvas.width / 2 - 120, 530, 240, 4);

  // Subtitle
  ctx.fillStyle = '#D1D5DB';
  ctx.font = '500 24px "Inter", sans-serif';
  ctx.fillText(subtitle, canvas.width / 2, 600);

  // Tagline
  ctx.font = 'bold 20px "JetBrains Mono", monospace';
  ctx.fillStyle = '#D6AD61';
  ctx.fillText('ACADEMIC CURRICULUM EDITION', canvas.width / 2, canvas.height - 210);

  // Publisher Crest
  ctx.font = 'bold 24px "Playfair Display", Georgia, serif';
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText('MAYURI PRINTERS // EST. 1991', canvas.width / 2, canvas.height - 165);

  ctx.font = '500 16px "JetBrains Mono", monospace';
  ctx.fillStyle = '#9CA3AF';
  ctx.fillText('FSC CERTIFIED • SMYTH-SEWN • HIGHEST OPACITY', canvas.width / 2, canvas.height - 125);

  return new THREE.CanvasTexture(canvas);
}

// Generate Realistic Security & Merit Certificate Textures with 24K Gold Foil Embossed Seal
export function createCertificateTextures(
  recipientName = 'ARUN KUMAR SHARMA',
  awardTitle = 'CERTIFICATE OF EXCELLENCE',
  institution = 'MAYURI ACADEMIC PRESS & EXAMINATION BOARD',
  styleTheme: 'degree' | 'merit' | 'citation' = 'degree'
) {
  const width = 1800;
  const height = 1270; // A4 Landscape ratio

  const diffCanvas = document.createElement('canvas');
  diffCanvas.width = width;
  diffCanvas.height = height;
  const ctx = diffCanvas.getContext('2d')!;

  const maskCanvas = document.createElement('canvas');
  maskCanvas.width = width;
  maskCanvas.height = height;
  const mCtx = maskCanvas.getContext('2d')!;

  // 1. Parchment paper background
  let paperBg = '#FCFAF5';
  let innerBorder = '#292F3B';
  let ribbonColor = '#991B1B'; // Deep Crimson Red
  let ribbonSec = '#B91C1C';

  if (styleTheme === 'merit') {
    paperBg = '#FAF8F2';
    innerBorder = '#065F46'; // Deep emerald
    ribbonColor = '#065F46'; // Forest Green
    ribbonSec = '#047857';
  } else if (styleTheme === 'citation') {
    paperBg = '#FBF9F4';
    innerBorder = '#1E3A8A'; // Deep Cobalt
    ribbonColor = '#1E3A8A'; // Royal Blue
    ribbonSec = '#2563EB';
  }

  ctx.fillStyle = paperBg;
  ctx.fillRect(0, 0, width, height);

  mCtx.fillStyle = '#000000';
  mCtx.fillRect(0, 0, width, height);

  // Subtle paper grain fibers
  ctx.fillStyle = 'rgba(0,0,0,0.015)';
  for (let i = 0; i < 4000; i++) {
    ctx.fillRect(Math.random() * width, Math.random() * height, 2, 2);
  }

  // 2. Dual Gold Guilloche Security Borders
  // Outer frame
  ctx.strokeStyle = '#D6AD61';
  ctx.lineWidth = 6;
  ctx.strokeRect(50, 50, width - 100, height - 100);

  mCtx.strokeStyle = '#FFFFFF';
  mCtx.lineWidth = 6;
  mCtx.strokeRect(50, 50, width - 100, height - 100);

  // Secondary thin gold frame
  ctx.strokeStyle = 'rgba(214, 173, 97, 0.5)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(65, 65, width - 130, height - 130);

  // Inner ornate patterned border
  ctx.strokeStyle = innerBorder;
  ctx.lineWidth = 2;
  ctx.strokeRect(80, 80, width - 160, height - 160);

  // Corner rosettes
  const corners = [
    { x: 80, y: 80 },
    { x: width - 80, y: 80 },
    { x: 80, y: height - 80 },
    { x: width - 80, y: height - 80 },
  ];
  corners.forEach((c) => {
    ctx.beginPath();
    ctx.arc(c.x, c.y, 24, 0, Math.PI * 2);
    ctx.fillStyle = '#D6AD61';
    ctx.fill();

    mCtx.beginPath();
    mCtx.arc(c.x, c.y, 24, 0, Math.PI * 2);
    mCtx.fillStyle = '#FFFFFF';
    mCtx.fill();

    ctx.beginPath();
    ctx.arc(c.x, c.y, 16, 0, Math.PI * 2);
    ctx.strokeStyle = paperBg;
    ctx.lineWidth = 2;
    ctx.stroke();
  });

  // 3. Central Guilloche Rosette Watermark (Subtle Anti-Counterfeit Background)
  ctx.save();
  ctx.translate(width / 2, height / 2);
  ctx.strokeStyle = 'rgba(214, 173, 97, 0.08)';
  ctx.lineWidth = 1.2;
  for (let a = 0; a < 36; a++) {
    ctx.beginPath();
    ctx.ellipse(0, 0, 260, 110, (a * Math.PI) / 18, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();

  // 4. Header & Serial
  ctx.textAlign = 'center';
  ctx.font = '600 16px "JetBrains Mono", monospace';
  ctx.fillStyle = '#78716C';
  ctx.fillText(`★  ${institution}  ★`, width / 2, 135);

  ctx.textAlign = 'right';
  ctx.font = 'bold 16px "JetBrains Mono", monospace';
  ctx.fillStyle = '#DC2626';
  ctx.fillText('№ CERT-084192', width - 110, 135);

  // 5. Main Title: CERTIFICATE OF EXCELLENCE
  ctx.textAlign = 'center';
  ctx.font = 'bold 56px "Playfair Display", Georgia, serif';
  ctx.fillStyle = '#111827';
  ctx.fillText(awardTitle, width / 2, 235);

  ctx.font = 'bold 18px "JetBrains Mono", monospace';
  ctx.fillStyle = '#D6AD61';
  ctx.fillText('★ FOR HIGHEST SCHOLASTIC MERIT & DISTINCTION ★', width / 2, 275);

  mCtx.textAlign = 'center';
  mCtx.font = 'bold 18px "JetBrains Mono", monospace';
  mCtx.fillStyle = '#FFFFFF';
  mCtx.fillText('★ FOR HIGHEST SCHOLASTIC MERIT & DISTINCTION ★', width / 2, 275);

  // Gold divider
  ctx.fillStyle = '#D6AD61';
  ctx.fillRect(width / 2 - 160, 305, 320, 3);
  mCtx.fillStyle = '#FFFFFF';
  mCtx.fillRect(width / 2 - 160, 305, 320, 3);

  // 6. Presentation text
  ctx.font = 'italic 500 24px "Playfair Display", serif';
  ctx.fillStyle = '#4B5563';
  ctx.fillText('This is to formally certify and attest that', width / 2, 365);

  // 7. Recipient Name
  ctx.font = 'bold 52px "Playfair Display", Georgia, serif';
  ctx.fillStyle = '#111827';
  ctx.fillText(recipientName, width / 2, 450);

  // Name underline
  ctx.strokeStyle = '#D6AD61';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(width / 2 - 280, 475);
  ctx.lineTo(width / 2 + 280, 475);
  ctx.stroke();

  mCtx.strokeStyle = '#FFFFFF';
  mCtx.lineWidth = 2;
  mCtx.beginPath();
  ctx.moveTo(width / 2 - 280, 475);
  ctx.lineTo(width / 2 + 280, 475);
  ctx.stroke();

  // 8. Body Citation
  ctx.font = '400 20px "Inter", sans-serif';
  ctx.fillStyle = '#374151';
  ctx.fillText(
    'Has demonstrated exemplary dedication, academic rigor, and outstanding performance',
    width / 2,
    540
  );
  ctx.fillText(
    'in the National Curriculum Examination with First-Class Honors and Institutional Distinction.',
    width / 2,
    575
  );

  ctx.font = '500 16px "Inter", sans-serif';
  ctx.fillStyle = '#6B7280';
  ctx.fillText(
    'Issued on this 15th Day of October, 2026 • Verified Under 35 Years Press Manufacturing Heritage',
    width / 2,
    630
  );

  // 9. Authentic Signatures
  // Left: University Council
  ctx.textAlign = 'left';
  ctx.strokeStyle = '#1E3A8A';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(220, 780);
  ctx.bezierCurveTo(250, 750, 270, 810, 300, 760);
  ctx.bezierCurveTo(320, 730, 340, 790, 370, 755);
  ctx.stroke();

  ctx.strokeStyle = '#9CA3AF';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(200, 800);
  ctx.lineTo(440, 800);
  ctx.stroke();

  ctx.font = 'bold 15px "JetBrains Mono", monospace';
  ctx.fillStyle = '#111827';
  ctx.fillText('DR. R. RAMANATHAN', 200, 825);
  ctx.font = '400 13px "Inter", sans-serif';
  ctx.fillStyle = '#6B7280';
  ctx.fillText('Director of Academic Examinations', 200, 845);

  // Right: Factory MD (Binay Rathi)
  ctx.textAlign = 'right';
  ctx.strokeStyle = '#1E3A8A';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(width - 400, 780);
  ctx.bezierCurveTo(width - 370, 740, width - 350, 810, width - 320, 755);
  ctx.bezierCurveTo(width - 300, 730, width - 270, 795, width - 240, 760);
  ctx.stroke();

  ctx.strokeStyle = '#9CA3AF';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(width - 440, 800);
  ctx.lineTo(width - 200, 800);
  ctx.stroke();

  ctx.font = 'bold 15px "JetBrains Mono", monospace';
  ctx.fillStyle = '#111827';
  ctx.fillText('BINAY RATHI', width - 200, 825);
  ctx.font = '400 13px "Inter", sans-serif';
  ctx.fillStyle = '#6B7280';
  ctx.fillText('Managing Director, Mayuri Printers', width - 200, 845);

  // 10. Official 24K Gold Foil Embossed Medallion Seal (Center-Bottom)
  const sealX = width / 2;
  const sealY = 820;
  const sealR = 72;

  // Ribbon tails hanging below seal
  ctx.fillStyle = ribbonColor;
  ctx.beginPath();
  ctx.moveTo(sealX - 25, sealY + 40);
  ctx.lineTo(sealX - 45, sealY + 160);
  ctx.lineTo(sealX - 25, sealY + 140);
  ctx.lineTo(sealX - 5, sealY + 160);
  ctx.lineTo(sealX - 5, sealY + 40);
  ctx.fill();

  ctx.fillStyle = ribbonSec;
  ctx.beginPath();
  ctx.moveTo(sealX + 5, sealY + 40);
  ctx.lineTo(sealX + 5, sealY + 160);
  ctx.lineTo(sealX + 25, sealY + 140);
  ctx.lineTo(sealX + 45, sealY + 160);
  ctx.lineTo(sealX + 25, sealY + 40);
  ctx.fill();

  // Serrated Starburst Gold Teeth
  ctx.beginPath();
  for (let i = 0; i < 48; i++) {
    const angle = (i * Math.PI) / 24;
    const r = i % 2 === 0 ? sealR + 10 : sealR;
    const px = sealX + Math.cos(angle) * r;
    const py = sealY + Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fillStyle = '#D6AD61';
  ctx.fill();

  mCtx.beginPath();
  for (let i = 0; i < 48; i++) {
    const angle = (i * Math.PI) / 24;
    const r = i % 2 === 0 ? sealR + 10 : sealR;
    const px = sealX + Math.cos(angle) * r;
    const py = sealY + Math.sin(angle) * r;
    if (i === 0) mCtx.moveTo(px, py);
    else mCtx.lineTo(px, py);
  }
  mCtx.closePath();
  mCtx.fillStyle = '#FFFFFF';
  mCtx.fill();

  // Inner Gold Rings
  ctx.beginPath();
  ctx.arc(sealX, sealY, sealR - 8, 0, Math.PI * 2);
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(sealX, sealY, sealR - 16, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(255,255,255,0.7)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Seal Center 5-Pointed Star
  ctx.beginPath();
  for (let s = 0; s < 5; s++) {
    const a = (s * Math.PI * 2) / 5 - Math.PI / 2;
    const rOuter = 20;
    const rInner = 9;
    const sx = sealX + Math.cos(a) * rOuter;
    const sy = sealY + Math.sin(a) * rOuter;
    const aInner = a + Math.PI / 5;
    const six = sealX + Math.cos(aInner) * rInner;
    const siy = sealY + Math.sin(aInner) * rInner;
    if (s === 0) ctx.moveTo(sx, sy);
    else ctx.lineTo(sx, sy);
    ctx.lineTo(six, siy);
  }
  ctx.closePath();
  ctx.fillStyle = '#FFFFFF';
  ctx.fill();

  ctx.textAlign = 'center';
  ctx.font = 'bold 11px "JetBrains Mono", monospace';
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText('MAYURI PRESS • 1991', sealX, sealY + 38);

  const diffuseTexture = new THREE.CanvasTexture(diffCanvas);
  const maskTexture = new THREE.CanvasTexture(maskCanvas);
  return { diffuseTexture, maskTexture };
}

// Generate Industrial Paper Reel Cylinder Edge & Label Texture
export function createPaperReelLabelTexture(
  grade = '80 GSM VIRGIN WOODFREE UNCOATED',
  widthMm = 1200,
  netWeightKg = 920
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Kraft brown wrapping surface
  ctx.fillStyle = '#B08855';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Wrapping overlaps and tape bands
  ctx.fillStyle = 'rgba(0,0,0,0.12)';
  ctx.fillRect(0, 40, canvas.width, 35);
  ctx.fillRect(0, canvas.height - 75, canvas.width, 35);

  // Shipping Export Barcode Label
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(150, 100, canvas.width - 300, 310);
  ctx.strokeStyle = '#1F2937';
  ctx.lineWidth = 2;
  ctx.strokeRect(150, 100, canvas.width - 300, 310);

  ctx.fillStyle = '#111827';
  ctx.font = 'bold 24px "Playfair Display", Georgia, serif';
  ctx.fillText('MAYURI PRINTERS — 35 YEARS OF EXCELLENCE', 180, 145);

  ctx.font = 'bold 18px "JetBrains Mono", monospace';
  ctx.fillText(`GRADE: ${grade}`, 180, 190);
  ctx.fillText(`REEL WIDTH: ${widthMm} MM  |  CORE: 76 MM (3")`, 180, 225);
  ctx.fillText(`NET WEIGHT: ${netWeightKg} KG  |  CONTAINERIZED EXPORT SHIPMENT`, 180, 260);
  ctx.fillText('QUALITY ASSURANCE: ISO 9001:2015 CERTIFIED', 180, 295);

  // Simulated Barcode
  ctx.fillStyle = '#111827';
  let barX = 180;
  for (let i = 0; i < 48; i++) {
    const w = (i % 3 === 0) ? 6 : (i % 2 === 0) ? 3 : 2;
    ctx.fillRect(barX, 325, w, 45);
    barX += w + 4;
  }
  ctx.font = '14px "JetBrains Mono", monospace';
  ctx.fillText('*MP-35YRS-EXPORT-2026*', 540, 355);

  return new THREE.CanvasTexture(canvas);
}
