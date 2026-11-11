# Mayuri Printers — 35 Years of Printing Excellence & Export
### *Interactive 3D Web Experience & Commercial Print Showcase*

---

## 🌟 Executive Overview
**Mayuri Printers** is an industrial printing factory and global paper export house celebrating **35 years of manufacturing excellence (Established 1991)**.

* **Founder & Managing Director:** Binay Rathi
* **Direct Contact:** `+977 9852020708` (Phone & WhatsApp)
* **Direct Email:** `binayrathi@gmail.com`
* **Core Product Capabilities:**
  1. **Custom Carbonless (NCR) Bill Books & Invoices:** 2-part, 3-part, and 4-part duplicate sets with sequential crash red numbering and micro-perforations.
  2. **Academic Textbooks & Registers:** Smyth-sewn thread signatures (100% lay-flat), thermal PUR perfect binding, and casebound hardcovers.
  3. **Executive Visiting Cards & Stationery:** 600–700 GSM multi-ply cotton boards, 24K hot foil stamping, deep blind deboss, and gold edge-gilding.
  4. **Global Bulk Paper Export:** High-yield virgin woodfree copier reels, multi-ply kraft liner, and grey-back duplex packaging boards shipped in 20ft/40ft FCL ocean containers.

---

## 🎨 Visual Identity & Technical Architecture

* **Aesthetic:** *"Tactile Precision"* — Heavy industrial scale paired with editorial craft.
* **Colors:** Deep Ink Slate (`#0E1116`), Warm Pulp Ivory (`#F7F5F0`), Liquid Bronze (`#C89D56`), and Emerald Green (`#10B981`).
* **3D Background:** The blueprint green precision cutting grid (`/grid-bg.jpg`) applied seamlessly across all 3D viewports.
* **3D Geometry & Alignment:** Every 3D interactive model is centered at `(0, 0, 0)` with balanced camera focal lengths for zero clipping.

### Interactive 3D Modules (Powered by Three.js & WebGL)
1. **Hero 3D Showroom (`HeroShowcase3D.tsx`):**
   * Floating Smyth-sewn textbook with printed leaves, a 600 GSM gold-foiled card, and an invoice book.
   * Mouse-tracking studio spotlight that dynamically casts angle-dependent specular foil reflection.
2. **Bill Book Exploder (`BillBookExploder3D.tsx`):**
   * Symmetrical layer-separation slider that explodes Top White CB, Duplicate Pink CFB, and Triplicate Yellow CF leaves with red crash numbering.
   * "Simulate Tear-Off" button to animate micro-perforation detachment.
3. **Visiting Card Tilt Lab (`VisitingCardTilt3D.tsx`):**
   * 3D card tilt with PBR shaders for 24K Gold, Rose Gold, Holographic Silver, Spot UV, and Blind Deboss.
   * Real-time canvas re-rendering upon typing custom names.
4. **Textbook Binding Switcher (`TextbookBinding3D.tsx`):**
   * Instant toggle between Hardcover Smyth-Sewn, Softcover Perfect Bound, and Saddle-Stitch Wire Staple.
   * Interactive book opening angle slider (0° to 180°).
5. **Paper Reel & Container Logistics (`PaperReelExport3D.tsx`):**
   * Real-time FCL container loading calculator using:
     $$\text{Payload} = \pi (R^2 - r^2) \times W \times \rho \times N$$

---

## 🚀 Quick Start & Development

### 1. Prerequisites
* **Node.js:** v18+ (tested on Node v26)
* **npm:** v9+

### 2. Installation
```powershell
# Clone the repository
git clone https://github.com/your-username/printing-app.git

# Navigate to project folder
cd "printing app"

# Install dependencies
npm install
```

### 3. Run Development Server
```powershell
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Build for Production
```powershell
npm run build
npm run preview
```
The optimized production bundle will be generated in the `dist/` directory.

---

## 🚢 One-Click Deployment

### Deploying to Netlify / Vercel
1. Push your code to GitHub.
2. Link the repository to **Vercel** or **Netlify**.
3. Set the build configuration:
   * **Build Command:** `npm run build`
   * **Output Directory:** `dist`
4. Click **Deploy**.

---

## 📞 Factory & Commercial Coordinates

* **Managing Director:** Binay Rathi
* **Phone / WhatsApp:** [+977 9852020708](tel:+9779852020708)
* **Email:** [binayrathi@gmail.com](mailto:binayrathi@gmail.com)
* **Web:** [www.mayuriprinters.com](http://localhost:5173)
* **Certifications:** ISO 9001:2015 Audited • FSC Certified Paper Stocks
