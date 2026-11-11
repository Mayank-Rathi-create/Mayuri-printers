import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import {
  X,
  RotateCcw,
  Send,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Check,
  Box,
} from 'lucide-react';
import {
  createPaperGrainTexture,
  createVisitingCardTextures,
  createVisitingCardBackTexture,
  createTextbookCoverTexture,
  createBookLeafTexture,
  createBookInsideCoverTexture,
  createBillBookSheetTexture,
  createCertificateTextures,
} from '../../utils/textureGenerators';

export type Product3DId = 'billbook' | 'textbook' | 'card' | 'certificate';
export type ViewAngle = 'front' | 'inside' | 'side' | 'detail';

interface ProductVariant {
  id: string;
  name: string;
  description: string;
  swatchColor: string;
  secondarySwatch?: string;
}

interface ProductDetails {
  id: Product3DId;
  name: string;
  category: string;
  subtitle: string;
  story: string;
  specs: { label: string; value: string }[];
  finishingOptions: string[];
  customizations: string[];
  rfqCategory: string;
  variants: ProductVariant[];
}

const SHOWROOM_PRODUCTS: Record<Product3DId, ProductDetails> = {
  billbook: {
    id: 'billbook',
    name: 'Carbonless Triplicate Bill Book',
    category: 'Commercial Bill Books & Invoices',
    subtitle: 'High-Tensile Cloth Spine Tape • Micro-Perforated Stub',
    story:
      'Engineered for high-volume commercial transactions. Chemical micro-capsule NCR paper guarantees instantaneous, legible transfer down to the third copy without carbon ink residue. Hand-bound with industrial buckram spine cloth.',
    specs: [
      { label: 'Paper Stock', value: '56 GSM CB White / 57 GSM CFB Pink / 57 GSM CF Yellow' },
      { label: 'Binding Method', value: 'Stitched with Buckram Binding Cloth Tape' },
      { label: 'Crash Stamping', value: 'Consecutive Red Letterpress Numbering' },
      { label: 'Perforation', value: 'Ultra-Fine Micro-Perforated Tear Stub' },
    ],
    finishingOptions: ['Anti-Smudge Chemical Coating', 'Kraft Board Backing', 'Writing Shield Included', 'Red Crash Numbering'],
    customizations: ['A4, Foolscap, 1/4 & 1/6 Sizes', '2-Part Duplicate or 3-Part Triplicate', 'Custom GST & VAT Column Ruling', 'Sequential 6-Digit Stamping'],
    rfqCategory: 'billbooks',
    variants: [
      {
        id: 'tax-invoice',
        name: 'Tax Invoice & Cash Memo',
        description: 'White CB / Pink CFB / Yellow CF NCR Sequence',
        swatchColor: '#FDFCFA',
        secondarySwatch: '#FDE2E8',
      },
      {
        id: 'challan',
        name: 'Goods Delivery Challan',
        description: 'Sky Blue / Canary / Mint Triplicate NCR',
        swatchColor: '#BAE6FD',
        secondarySwatch: '#FEF08A',
      },
      {
        id: 'retail-receipt',
        name: 'Retail Purchase Order Pad',
        description: 'Linen White & Carmine Pink Duplicate',
        swatchColor: '#FFFFFF',
        secondarySwatch: '#FBCFE8',
      },
    ],
  },
  textbook: {
    id: 'textbook',
    name: 'Academic Curriculum Textbook',
    category: 'Educational Publishing & Monograph',
    subtitle: '180° Lay-Flat Smyth Thread Sewing • 3.0 mm Casebound Hardcover',
    story:
      'Crafted for university presses and educational boards. Smyth-sewn thread signatures allow the volume to open 180° perfectly flat on student desks without spine fatigue. Gold hot foil debossing elevates academic provenance.',
    specs: [
      { label: 'Binding Style', value: '180° Lay-Flat Smyth Thread Sewing' },
      { label: 'Interior Paper', value: '70–80 GSM High-Opacity Maplitho / FSC Certified' },
      { label: 'Hardcover Board', value: '3.0 mm Premium Holland Strawboard' },
      { label: 'Cover Finishing', value: '24K Metallic Hot Gold Foil & Blind Deboss' },
    ],
    finishingOptions: ['Woven Gold Ribbon Bookmark', 'Anti-Scuff Matte Lamination', 'Silk Head & Tail Bands', 'Acid-Free Archival Paper'],
    customizations: ['Crown Quarto, Royal Octavo & A4 Formats', 'Hardcover Casebound or Flexible French Flap', 'High-Screen Color Reproduction', 'Custom Embossed Crest'],
    rfqCategory: 'textbooks',
    variants: [
      {
        id: 'navy-gold',
        name: 'Oxford Midnight Navy & Gold',
        description: 'Curriculum Hardcover with 24K Gold Stamping',
        swatchColor: '#101B2B',
        secondarySwatch: '#D6AD61',
      },
      {
        id: 'crimson-gold',
        name: 'Imperial Crimson & Gilt',
        description: 'Doctoral & Convocation Monograph Edition',
        swatchColor: '#3A0C16',
        secondarySwatch: '#D6AD61',
      },
      {
        id: 'emerald-gold',
        name: 'Royal Emerald Forest & Gold',
        description: 'Secondary Board Heritage Standard',
        swatchColor: '#0C2B1F',
        secondarySwatch: '#D6AD61',
      },
    ],
  },
  card: {
    id: 'card',
    name: '700 GSM Luxury Visiting Card',
    category: 'Executive Identity & Corporate Stationery',
    subtitle: 'Triplex Cotton Sandwich Board • 24K Gold Leaf Gilded Edges',
    story:
      'An assertive tactile identity for company directors and partners. Triple-layered cotton boards create an ultra-rigid 700 GSM profile, crowned with deep heated 24K metallic foil stamping and hand-buffed gilded gold edges.',
    specs: [
      { label: 'Paper Caliper', value: '700 GSM Triplex Cotton Sandwich Board' },
      { label: 'Edge Treatment', value: '24K Gold Leaf Mirror Edge Gilding' },
      { label: 'Foil Stamping', value: 'Deep Heated 24K Metallic Gold Foil' },
      { label: 'Tactile Finish', value: 'Uncoated Velvet Cotton Texture' },
    ],
    finishingOptions: ['24K Metallic Gold Stamping', 'Gilded Edge Gilding', 'Tactile Blind Debossing', 'Dual-Sided Foil Registration'],
    customizations: ['3.5" x 2.0" Standard or European 85x55mm', 'Black, Navy, Crimson or Gold Color Core', 'Matte Silver / Rose Gold / Holographic Foil', 'Embossed Corporate Crest'],
    rfqCategory: 'visiting-cards',
    variants: [
      {
        id: 'obsidian-gold',
        name: 'Obsidian Cotton & 24K Gold',
        description: 'Deep Black Cotton with Gold Foil & Gilded Edge',
        swatchColor: '#14171E',
        secondarySwatch: '#D6AD61',
      },
      {
        id: 'royal-navy-silver',
        name: 'Royal Navy & Platinum Silver',
        description: 'Cobalt Velvet Board with Pure Silver Foil',
        swatchColor: '#0F1A2E',
        secondarySwatch: '#E2E8F0',
      },
      {
        id: 'sandalwood-kraft',
        name: 'Sandalwood Kraft & Deboss',
        description: '500 GSM Natural Kraft with Blind Letterpress',
        swatchColor: '#C4A070',
        secondarySwatch: '#27272A',
      },
    ],
  },
  certificate: {
    id: 'certificate',
    name: 'Certificates',
    category: 'Institutional Degrees & Merit Credentials',
    subtitle: '24K Hot Foil Starburst Seal • Anti-Counterfeit Guilloche Borders',
    story:
      'High-security degree diplomas and national merit certificates with multi-tier counterfeit protection. Featuring 24K metallic starburst medallion seals, authentic guilloche watermark rosettes, and security attestation.',
    specs: [
      { label: 'Parchment Stock', value: '320 GSM Heavy Archival Vellum Board' },
      { label: 'Official Seal', value: '24K Metallic Starburst Embossed Medallion' },
      { label: 'Border Security', value: 'Dual Concentric Guilloche Security Rosettes' },
      { label: 'Attestation', value: 'Anti-Counterfeit Watermark & Micro-Text' },
    ],
    finishingOptions: ['24K Gold Starburst Seal', 'Crimson Silk Ribbon Drapery', 'Anti-Counterfeit Watermark', 'Archival pH-Neutral Board'],
    customizations: ['A4 Landscape or Portrait Orientation', 'Gold, Silver or Holographic Hot Foil Seals', 'Sequential Red Serial Stamping', 'Custom University Guilloche Rosettes'],
    rfqCategory: 'certificates',
    variants: [
      {
        id: 'convocation-degree',
        name: 'University Convocation Degree',
        description: 'Ivory Parchment with Crimson Silk Ribbon Seal',
        swatchColor: '#FCFAF5',
        secondarySwatch: '#991B1B',
      },
      {
        id: 'corporate-merit',
        name: 'Corporate Distinction Award',
        description: 'Sapphire Guilloche with Emerald Silk Ribbon',
        swatchColor: '#FAF8F2',
        secondarySwatch: '#065F46',
      },
      {
        id: 'national-citation',
        name: 'National Honor Citation',
        description: 'Vellum Parchment with Royal Cobalt Ribbon',
        swatchColor: '#FBF9F4',
        secondarySwatch: '#1E3A8A',
      },
    ],
  },
};

interface Product3DModalProps {
  isOpen: boolean;
  initialProductId: Product3DId;
  onClose: () => void;
  onRequestQuote: (category: string) => void;
  onOpenSampleKit?: () => void;
}

export const Product3DModal: React.FC<Product3DModalProps> = ({
  isOpen,
  initialProductId,
  onClose,
  onRequestQuote,
  onOpenSampleKit,
}) => {
  const [activeId, setActiveId] = useState<Product3DId>(initialProductId);
  const [activeVariantIndex, setActiveVariantIndex] = useState<number>(0);
  const [activeView, setActiveView] = useState<ViewAngle>('front');
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [isZoomed, setIsZoomed] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Animation & Control Refs
  const currentActiveIdRef = useRef<Product3DId>(initialProductId);
  const currentVariantIndexRef = useRef<number>(0);
  const targetCamZRef = useRef<number>(4.3);
  const targetRotYRef = useRef<number>(0.2);
  const targetRotXRef = useRef<number>(0.1);
  const targetOpenAmountRef = useRef<number>(0);
  const lastInteractionTimeRef = useRef<number>(Date.now());

  currentActiveIdRef.current = activeId;
  currentVariantIndexRef.current = activeVariantIndex;

  // Mark user interaction to pause idle tour
  const registerUserActivity = useCallback(() => {
    lastInteractionTimeRef.current = Date.now();
  }, []);

  // Sync initial product ID when modal opens
  useEffect(() => {
    if (isOpen) {
      setActiveId(initialProductId);
      setActiveVariantIndex(0);
      setActiveView('front');
      setIsZoomed(false);
      setAutoRotate(true);
      targetCamZRef.current = 4.3;
      targetRotYRef.current = 0.2;
      targetRotXRef.current = 0.1;
      targetOpenAmountRef.current = 0;
      lastInteractionTimeRef.current = Date.now();
    }
  }, [isOpen, initialProductId]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Change active view angle (Front / Inside / Side / Detail)
  const handleSelectView = useCallback((view: ViewAngle) => {
    registerUserActivity();
    setActiveView(view);

    if (view === 'front') {
      targetCamZRef.current = 4.3;
      targetRotYRef.current = 0.2;
      targetRotXRef.current = 0.1;
      targetOpenAmountRef.current = 0;
      setIsZoomed(false);
    } else if (view === 'inside') {
      if (activeId === 'card') {
        // Card flips 180° to back face
        targetCamZRef.current = 4.1;
        targetRotYRef.current = Math.PI + 0.15;
        targetRotXRef.current = 0.08;
        targetOpenAmountRef.current = 0;
      } else if (activeId === 'certificate') {
        // Certificates zoom in on attestation & seal
        targetCamZRef.current = 3.3;
        targetRotYRef.current = 0.05;
        targetRotXRef.current = -0.05;
        targetOpenAmountRef.current = 0;
      } else {
        // Book opens 180° / Billbook fans open duplicate sheets
        targetCamZRef.current = 4.1;
        targetRotYRef.current = -0.28;
        targetRotXRef.current = 0.14;
        targetOpenAmountRef.current = 1.0;
      }
      setIsZoomed(false);
    } else if (view === 'side') {
      // Profile view of spine or gilded edge
      targetCamZRef.current = 4.1;
      targetRotYRef.current = Math.PI / 2 - 0.25;
      targetRotXRef.current = 0.04;
      targetOpenAmountRef.current = 0;
      setIsZoomed(false);
    } else if (view === 'detail') {
      // Macro zoom into material finishing
      targetCamZRef.current = 2.85;
      targetRotYRef.current = 0.12;
      targetRotXRef.current = -0.15;
      targetOpenAmountRef.current = 0;
      setIsZoomed(true);
    }
  }, [activeId, registerUserActivity]);

  // Toggle Zoom Macro Mode
  const toggleZoom = useCallback(() => {
    registerUserActivity();
    setIsZoomed((prev) => {
      const next = !prev;
      targetCamZRef.current = next ? 2.85 : 4.3;
      return next;
    });
  }, [registerUserActivity]);

  // Reset to default signature angle
  const handleReset = useCallback(() => {
    registerUserActivity();
    setActiveView('front');
    setIsZoomed(false);
    targetCamZRef.current = 4.3;
    targetRotYRef.current = 0.2;
    targetRotXRef.current = 0.1;
    targetOpenAmountRef.current = 0;
  }, [registerUserActivity]);

  // Change product
  const handleSelectProduct = useCallback((id: Product3DId) => {
    registerUserActivity();
    setActiveId(id);
    setActiveVariantIndex(0);
    setActiveView('front');
    setIsZoomed(false);
    targetRotYRef.current += Math.PI * 2;
    targetOpenAmountRef.current = 0;
  }, [registerUserActivity]);

  // Change variant
  const handleSelectVariant = useCallback((idx: number) => {
    registerUserActivity();
    setActiveVariantIndex(idx);
  }, [registerUserActivity]);

  // ==========================================
  // THREE.JS LUXURY EDITORIAL 3D STUDIO
  // ==========================================
  useEffect(() => {
    if (!isOpen) return;

    const container = containerRef.current;
    if (!container) return;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      36,
      container.clientWidth / container.clientHeight,
      0.1,
      50
    );
    camera.position.set(0, 0.06, 4.3);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      alpha: true,
    });
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;

    container.appendChild(renderer.domElement);

    // 2. Editorial Studio Lighting System
    const ambientLight = new THREE.AmbientLight('#FFFFFF', 1.05);
    scene.add(ambientLight);

    // Warm Key Light (Soft Studio Sun)
    const keyLight = new THREE.DirectionalLight('#FFF3D6', 2.9);
    keyLight.position.set(-3.5, 3.8, 4.0);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.001;
    scene.add(keyLight);

    // Cool Soft Fill Light
    const fillLight = new THREE.DirectionalLight('#93C5FD', 1.25);
    fillLight.position.set(3.5, -1.2, 2.8);
    scene.add(fillLight);

    // Gold Rim Backlight (Accentuates luxury edges)
    const rimLight = new THREE.DirectionalLight('#D6AD61', 2.3);
    rimLight.position.set(0, 2.8, -3.2);
    scene.add(rimLight);

    // Dynamic Specular Cursor Light
    const yellowSpotlight = new THREE.SpotLight('#F5BE37', 3.0, 14, Math.PI / 4, 0.6);
    yellowSpotlight.position.set(0, 2, 4);
    scene.add(yellowSpotlight);

    // Soft Floor Contact Shadow
    const shadowGeo = new THREE.PlaneGeometry(5.5, 5.5);
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const sCtx = shadowCanvas.getContext('2d')!;
    const sGrad = sCtx.createRadialGradient(128, 128, 10, 128, 128, 120);
    sGrad.addColorStop(0, 'rgba(0, 0, 0, 0.5)');
    sGrad.addColorStop(0.5, 'rgba(0, 0, 0, 0.16)');
    sGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    sCtx.fillStyle = sGrad;
    sCtx.fillRect(0, 0, 256, 256);
    const shadowTex = new THREE.CanvasTexture(shadowCanvas);

    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -1.2;
    scene.add(shadowMesh);

    // 3. Realistic Textures & Materials
    const paperBump = createPaperGrainTexture();
    const productMeshes: Record<string, THREE.Group> = {};

    const bookEdgeMat = new THREE.MeshStandardMaterial({ color: '#F4EFE6', roughness: 0.9 });
    const spineClothMat = new THREE.MeshStandardMaterial({ color: '#881337', roughness: 0.55 });
    const darkSpineMat = new THREE.MeshStandardMaterial({ color: '#09101A', roughness: 0.5 });
    const cardGoldEdge = new THREE.MeshStandardMaterial({
      color: '#D6AD61',
      metalness: 0.94,
      roughness: 0.14,
    });

    // ==========================================
    // PRODUCT 1: Carbonless Triplicate Bill Book
    // ==========================================
    const billBookGroup = new THREE.Group();

    const billBookVariants = [
      {
        white: createBillBookSheetTexture('white', '№ 084192', 'TAX INVOICE / CASH MEMO'),
        pink: createBillBookSheetTexture('pink', '№ 084192', 'DUPLICATE CHALLAN'),
        yellow: createBillBookSheetTexture('yellow', '№ 084192', 'TRIPLICATE ACCOUNTS COPY'),
      },
      {
        white: createBillBookSheetTexture('white', '№ 091482', 'GOODS DELIVERY CHALLAN'),
        pink: createBillBookSheetTexture('pink', '№ 091482', 'CONSIGNMENT COPY'),
        yellow: createBillBookSheetTexture('yellow', '№ 091482', 'WAREHOUSE RECORD'),
      },
      {
        white: createBillBookSheetTexture('white', '№ 073910', 'RETAIL PURCHASE RECEIPT'),
        pink: createBillBookSheetTexture('pink', '№ 073910', 'CUSTOMER DUPLICATE'),
        yellow: createBillBookSheetTexture('yellow', '№ 073910', 'ACCOUNTS RECORD'),
      },
    ];

    // Heavy Chipboard Backing
    const bbBackGeo = new THREE.BoxGeometry(1.5, 2.05, 0.06);
    const bbBackMat = new THREE.MeshStandardMaterial({ color: '#683B1B', roughness: 0.85 });
    const bbBackMesh = new THREE.Mesh(bbBackGeo, bbBackMat);
    bbBackMesh.position.set(0, 0, -0.06);
    bbBackMesh.castShadow = true;
    billBookGroup.add(bbBackMesh);

    // Triplicate Yellow Leaf (Bottom NCR sheet)
    const yellowSheetMat = new THREE.MeshStandardMaterial({
      map: billBookVariants[0].yellow,
      roughness: 0.88,
      bumpMap: paperBump,
      bumpScale: 0.002,
    });
    const yellowSheetGeo = new THREE.PlaneGeometry(1.48, 2.03);
    const yellowSheetMesh = new THREE.Mesh(yellowSheetGeo, yellowSheetMat);
    yellowSheetMesh.position.set(0, 0, -0.02);
    billBookGroup.add(yellowSheetMesh);

    // Pink Duplicate Sheet Pivot (Fans open)
    const pinkPivot = new THREE.Group();
    pinkPivot.position.set(-0.74, 0, 0.01);
    const pinkSheetMat = new THREE.MeshStandardMaterial({
      map: billBookVariants[0].pink,
      roughness: 0.88,
      bumpMap: paperBump,
      bumpScale: 0.002,
      side: THREE.DoubleSide,
    });
    const pinkSheetGeo = new THREE.PlaneGeometry(1.48, 2.03);
    pinkSheetGeo.translate(0.74, 0, 0);
    const pinkSheetMesh = new THREE.Mesh(pinkSheetGeo, pinkSheetMat);
    pinkPivot.add(pinkSheetMesh);
    billBookGroup.add(pinkPivot);

    // White Top Sheet Pivot (Flips open)
    const whitePivot = new THREE.Group();
    whitePivot.position.set(-0.74, 0, 0.04);
    const whiteSheetMat = new THREE.MeshStandardMaterial({
      map: billBookVariants[0].white,
      roughness: 0.85,
      bumpMap: paperBump,
      bumpScale: 0.002,
      side: THREE.DoubleSide,
    });
    const whiteSheetGeo = new THREE.PlaneGeometry(1.48, 2.03);
    whiteSheetGeo.translate(0.74, 0, 0);
    const whiteSheetMesh = new THREE.Mesh(whiteSheetGeo, whiteSheetMat);
    whiteSheetMesh.castShadow = true;
    whitePivot.add(whiteSheetMesh);
    billBookGroup.add(whitePivot);

    // Buckram Binding Cloth Spine Strip
    const spineGeo = new THREE.BoxGeometry(0.12, 2.06, 0.12);
    const spineMesh = new THREE.Mesh(spineGeo, spineClothMat);
    spineMesh.position.set(-0.74, 0, 0.02);
    billBookGroup.add(spineMesh);

    scene.add(billBookGroup);
    productMeshes['billbook'] = billBookGroup;

    // ==========================================
    // PRODUCT 2: Academic Curriculum Textbook
    // ==========================================
    const textbookGroup = new THREE.Group();

    const textbookCoverTextures = [
      createTextbookCoverTexture('MAYURI PRESS', '35 Years of Printing Excellence & Publishing', 'hardcover-casebound'),
      createTextbookCoverTexture('UNIVERSITY PRESS', '35 Years Convocation Monograph Edition', 'crimson-gold'),
      createTextbookCoverTexture('ACADEMIC COUNCIL', 'Secondary Education Curriculum Standards', 'emerald-gold'),
    ];

    // Inside Pages Block (Fixed at spine)
    const bookInsideSpreadTex = createBookLeafTexture(1);
    const bookInsideSpreadMat = new THREE.MeshStandardMaterial({
      map: bookInsideSpreadTex,
      roughness: 0.88,
      bumpMap: paperBump,
      bumpScale: 0.002,
    });

    const bookPagesGeo = new THREE.BoxGeometry(1.58, 2.22, 0.22);
    const bookPagesMats = [
      bookEdgeMat,
      darkSpineMat,
      bookEdgeMat,
      bookEdgeMat,
      bookInsideSpreadMat, // Front face reveals printed chapter text
      bookEdgeMat,
    ];
    const bookPagesMesh = new THREE.Mesh(bookPagesGeo, bookPagesMats);
    bookPagesMesh.position.set(0.04, 0, 0);
    bookPagesMesh.castShadow = true;
    textbookGroup.add(bookPagesMesh);

    // Back Cover
    const bookBackGeo = new THREE.BoxGeometry(1.65, 2.26, 0.04);
    const bookBackMesh = new THREE.Mesh(bookBackGeo, darkSpineMat);
    bookBackMesh.position.set(0, 0, -0.13);
    textbookGroup.add(bookBackMesh);

    // Front Cover Pivot (Hinged at left spine x = -0.79)
    const bookCoverPivot = new THREE.Group();
    bookCoverPivot.position.set(-0.79, 0, 0.11);

    const bookCoverMat = new THREE.MeshStandardMaterial({
      map: textbookCoverTextures[0],
      bumpMap: paperBump,
      bumpScale: 0.003,
      roughness: 0.42,
      metalness: 0.22,
    });

    const bookInsideCoverTex = createBookInsideCoverTexture();
    const bookInsideCoverMat = new THREE.MeshStandardMaterial({
      map: bookInsideCoverTex,
      roughness: 0.85,
      bumpMap: paperBump,
      bumpScale: 0.002,
    });

    // Box geometry for front cover: +Z is outside cover, -Z is inside Ex Libris bookplate!
    const frontCoverGeo = new THREE.BoxGeometry(1.62, 2.26, 0.038);
    frontCoverGeo.translate(0.81, 0, 0);
    const frontCoverMats = [
      bookEdgeMat,
      darkSpineMat,
      bookEdgeMat,
      bookEdgeMat,
      bookCoverMat,       // Outside face (+Z)
      bookInsideCoverMat, // Inside face (-Z)
    ];
    const frontCoverMesh = new THREE.Mesh(frontCoverGeo, frontCoverMats);
    frontCoverMesh.castShadow = true;
    bookCoverPivot.add(frontCoverMesh);
    textbookGroup.add(bookCoverPivot);

    // Gold ribbon bookmark tail
    const ribbonGeo = new THREE.PlaneGeometry(0.08, 0.7);
    const ribbonMat = new THREE.MeshStandardMaterial({ color: '#D6AD61', side: THREE.DoubleSide, roughness: 0.3 });
    const ribbonMesh = new THREE.Mesh(ribbonGeo, ribbonMat);
    ribbonMesh.position.set(0.1, -1.25, 0.12);
    ribbonMesh.rotation.z = 0.08;
    textbookGroup.add(ribbonMesh);

    scene.add(textbookGroup);
    productMeshes['textbook'] = textbookGroup;

    // ==========================================
    // PRODUCT 3: 700 GSM Luxury Visiting Card
    // ==========================================
    const cardGroup = new THREE.Group();

    const cardVariants = [
      {
        front: createVisitingCardTextures('BINAY RATHI', 'MAYURI PRINTERS', 'cotton-black-600'),
        back: createVisitingCardBackTexture('obsidian'),
      },
      {
        front: createVisitingCardTextures('BINAY RATHI', 'MAYURI PRINTERS', 'velvet-matte-400'),
        back: createVisitingCardBackTexture('royal-blue'),
      },
      {
        front: createVisitingCardTextures('BINAY RATHI', 'MAYURI PRINTERS', 'kraft-450'),
        back: createVisitingCardBackTexture('kraft'),
      },
    ];

    const cardFaceMat = new THREE.MeshStandardMaterial({
      map: cardVariants[0].front.diffuseTexture,
      roughness: 0.65,
      metalness: 0.25,
      roughnessMap: cardVariants[0].front.maskTexture,
    });

    const cardBackMat = new THREE.MeshStandardMaterial({
      map: cardVariants[0].back,
      roughness: 0.75,
      metalness: 0.2,
    });

    const cardGeo = new THREE.BoxGeometry(2.15, 1.25, 0.048);
    const cardMats = [
      cardGoldEdge, cardGoldEdge, cardGoldEdge, cardGoldEdge,
      cardFaceMat, // Front (+Z)
      cardBackMat, // Back (-Z)
    ];
    const cardMesh = new THREE.Mesh(cardGeo, cardMats);
    cardMesh.castShadow = true;
    cardGroup.add(cardMesh);

    scene.add(cardGroup);
    productMeshes['card'] = cardGroup;

    // ==========================================
    // PRODUCT 4: Certificates
    // ==========================================
    const certGroup = new THREE.Group();

    const certVariants = [
      createCertificateTextures(
        'ARUN KUMAR SHARMA',
        'CERTIFICATE OF EXCELLENCE',
        'MAYURI ACADEMIC PRESS & EXAMINATION BOARD',
        'degree'
      ),
      createCertificateTextures(
        'ARUN KUMAR SHARMA',
        'NATIONAL DISTINCTION AWARD',
        'FEDERATION OF COMMERCE & INDUSTRY',
        'merit'
      ),
      createCertificateTextures(
        'ARUN KUMAR SHARMA',
        'PRESIDENTIAL CITATION OF HONOR',
        'NATIONAL ACCREDITATION COUNCIL',
        'citation'
      ),
    ];

    const certFrontMat = new THREE.MeshStandardMaterial({
      map: certVariants[0].diffuseTexture,
      roughness: 0.65,
      metalness: 0.22,
      roughnessMap: certVariants[0].maskTexture,
      bumpMap: paperBump,
      bumpScale: 0.002,
    });
    const certBackMat = new THREE.MeshStandardMaterial({
      color: '#F8F5EC',
      roughness: 0.85,
    });

    const certGeo = new THREE.BoxGeometry(2.38, 1.68, 0.035);
    const certMats = [
      cardGoldEdge, cardGoldEdge, cardGoldEdge, cardGoldEdge,
      certFrontMat,
      certBackMat,
    ];
    const certMesh = new THREE.Mesh(certGeo, certMats);
    certMesh.castShadow = true;
    certGroup.add(certMesh);

    scene.add(certGroup);
    productMeshes['certificate'] = certGroup;

    // 4. Fluid Drag & Touch Controls
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let manualRotY = 0;
    let manualRotX = 0;
    let mouseNormX = 0;
    let mouseNormY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
      registerUserActivity();
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseNormX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseNormY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      if (!isDragging) return;
      registerUserActivity();
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      manualRotY += deltaX * 0.008;
      manualRotX += deltaY * 0.008;
      manualRotX = Math.max(-0.6, Math.min(0.6, manualRotX));
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      registerUserActivity();
      targetCamZRef.current = Math.max(2.6, Math.min(6.0, targetCamZRef.current + e.deltaY * 0.0025));
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    container.addEventListener('wheel', onWheel, { passive: false });

    // Mobile touch interaction
    let initialPinchDist = 0;
    const onTouchStart = (e: TouchEvent) => {
      registerUserActivity();
      if (e.touches.length === 1) {
        prevMouseX = e.touches[0].clientX;
        prevMouseY = e.touches[0].clientY;
      } else if (e.touches.length === 2) {
        initialPinchDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      registerUserActivity();
      if (e.touches.length === 1) {
        const deltaX = e.touches[0].clientX - prevMouseX;
        const deltaY = e.touches[0].clientY - prevMouseY;
        manualRotY += deltaX * 0.01;
        manualRotX += deltaY * 0.01;
        manualRotX = Math.max(-0.6, Math.min(0.6, manualRotX));
        prevMouseX = e.touches[0].clientX;
        prevMouseY = e.touches[0].clientY;
      } else if (e.touches.length === 2 && initialPinchDist > 0) {
        const dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        const diff = initialPinchDist - dist;
        targetCamZRef.current = Math.max(2.6, Math.min(6.0, targetCamZRef.current + diff * 0.01));
        initialPinchDist = dist;
      }
    };

    container.addEventListener('touchstart', onTouchStart, { passive: true });
    container.addEventListener('touchmove', onTouchMove, { passive: true });

    // 5. Cinematic Render Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();
    let currentRotationY = 0;
    let currentRotationX = 0;
    let currentOpenAmount = 0;
    let appliedVariantIndex = -1;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();
      const currentActiveId = currentActiveIdRef.current;
      const now = Date.now();
      const idleTimeSec = (now - lastInteractionTimeRef.current) / 1000;
      const isIdle = idleTimeSec > 1.5;

      // Camera Z Zoom Interpolation
      camera.position.z += (targetCamZRef.current - camera.position.z) * 0.06;

      // Base target rotation angles
      currentRotationY += (targetRotYRef.current - currentRotationY) * 0.06;
      currentRotationX += (targetRotXRef.current - currentRotationX) * 0.06;

      // Open amount interpolation (swings book cover or fans duplicate leaves)
      currentOpenAmount += (targetOpenAmountRef.current - currentOpenAmount) * 0.07;
      bookCoverPivot.rotation.y = -currentOpenAmount * 2.5;
      whitePivot.rotation.y = -currentOpenAmount * 1.1;
      pinkPivot.rotation.y = -currentOpenAmount * 0.5;

      // Dynamic cursor spotlight positioning
      yellowSpotlight.position.x = mouseNormX * 3.2;
      yellowSpotlight.position.y = mouseNormY * 2.2 + 1.2;

      // Gentle auto-orbit when enabled or during idle showcase
      const orbitAngle = (autoRotate || isIdle) && !isDragging
        ? Math.sin(elapsedTime * 0.5) * 0.18
        : 0;

      // Gentle floating levitation
      const floatY = Math.sin(elapsedTime * 1.2) * 0.03;

      // Material update on variant change
      const activeVariant = currentVariantIndexRef.current;
      if (activeVariant !== appliedVariantIndex) {
        appliedVariantIndex = activeVariant;

        if (billBookVariants[activeVariant]) {
          whiteSheetMat.map = billBookVariants[activeVariant].white;
          pinkSheetMat.map = billBookVariants[activeVariant].pink;
          yellowSheetMat.map = billBookVariants[activeVariant].yellow;
          whiteSheetMat.needsUpdate = true;
          pinkSheetMat.needsUpdate = true;
          yellowSheetMat.needsUpdate = true;
        }

        if (textbookCoverTextures[activeVariant]) {
          bookCoverMat.map = textbookCoverTextures[activeVariant];
          bookCoverMat.needsUpdate = true;
        }

        if (cardVariants[activeVariant]) {
          cardFaceMat.map = cardVariants[activeVariant].front.diffuseTexture;
          cardFaceMat.roughnessMap = cardVariants[activeVariant].front.maskTexture;
          cardBackMat.map = cardVariants[activeVariant].back;
          cardFaceMat.needsUpdate = true;
          cardBackMat.needsUpdate = true;
        }

        if (certVariants[activeVariant]) {
          certFrontMat.map = certVariants[activeVariant].diffuseTexture;
          certFrontMat.roughnessMap = certVariants[activeVariant].maskTexture;
          certFrontMat.needsUpdate = true;
        }
      }

      // Position active product
      Object.entries(productMeshes).forEach(([id, group]) => {
        if (id === currentActiveId) {
          group.visible = true;
          group.position.y = floatY;
          group.rotation.y = currentRotationY + manualRotY + orbitAngle;
          group.rotation.x = currentRotationX + manualRotX;
        } else {
          group.visible = false;
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('wheel', onWheel);
      container.removeEventListener('touchstart', onTouchStart);
      container.removeEventListener('touchmove', onTouchMove);
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isOpen, autoRotate, registerUserActivity]);

  if (!isOpen) return null;

  const product = SHOWROOM_PRODUCTS[activeId];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-[#090B10]/95 backdrop-blur-2xl animate-fadeIn select-none">
      {/* LUXURY EDITORIAL SHOWROOM CONTAINER */}
      <div className="relative w-full max-w-7xl h-[94vh] max-h-[920px] bg-[#0E121A] border border-[#232A38] rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.85)] flex flex-col overflow-hidden">
        
        {/* TOP BRAND & CATEGORY NAVIGATION BAR */}
        <div className="px-5 sm:px-8 py-3.5 border-b border-[#232A38] flex items-center justify-between gap-4 z-20 bg-[#121722]/80 backdrop-blur-md">
          {/* Brand & Collection Label */}
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#D6AD61]" />
            <div className="flex items-baseline gap-2">
              <span className="font-editorial text-sm sm:text-base font-bold text-[#F5F3ED] tracking-wide">
                Mayuri Printers
              </span>
              <span className="hidden sm:inline-block text-[11px] font-technical uppercase tracking-widest text-[#A1A8B5]">
                / 3D Product Exhibition
              </span>
            </div>
          </div>

          {/* Minimalist Product Selector Tabs (Desktop) */}
          <div className="hidden md:flex items-center gap-1.5 p-1 rounded-xl bg-[#090B10] border border-[#232A38]">
            {(['billbook', 'textbook', 'card', 'certificate'] as Product3DId[]).map((pid) => (
              <button
                key={pid}
                onClick={() => handleSelectProduct(pid)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  activeId === pid
                    ? 'bg-[#D6AD61] text-[#090B10] font-semibold shadow-sm'
                    : 'text-[#A1A8B5] hover:text-[#F5F3ED]'
                }`}
              >
                {pid === 'certificate' ? 'Certificates' : SHOWROOM_PRODUCTS[pid].name.split(' ')[0] + ' ' + SHOWROOM_PRODUCTS[pid].name.split(' ')[1]}
              </button>
            ))}
          </div>

          {/* Product Switcher Dropdown (Mobile) */}
          <div className="flex md:hidden items-center">
            <select
              value={activeId}
              onChange={(e) => handleSelectProduct(e.target.value as Product3DId)}
              className="bg-[#090B10] border border-[#232A38] rounded-lg px-2.5 py-1 text-xs text-[#D6AD61] font-technical focus:outline-none"
            >
              <option value="billbook">Bill Book</option>
              <option value="textbook">Textbook</option>
              <option value="card">Visiting Card</option>
              <option value="certificate">Certificates</option>
            </select>
          </div>

          {/* Close Action */}
          <button
            onClick={onClose}
            aria-label="Close Showroom"
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#A1A8B5] hover:text-[#F5F3ED] hover:bg-[#1E2533] border border-[#232A38] transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* MAIN EDITORIAL SPLIT VIEWPORT */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
          
          {/* ========================================================
              LEFT: PRODUCT 3D EXHIBITION STAGE (~60% width)
          ======================================================== */}
          <div className="relative w-full lg:w-[60%] h-[48vh] sm:h-[52vh] lg:h-full bg-gradient-to-b from-[#0B0E14] to-[#070A0F] flex items-center justify-center overflow-hidden border-b lg:border-b-0 lg:border-r border-[#232A38]">
            
            {/* Subtle Studio Radial Glow */}
            <div className="absolute inset-0 bg-radial from-[#D6AD61]/5 via-transparent to-transparent pointer-events-none" />

            {/* Three.js Canvas Container */}
            <div
              ref={containerRef}
              className="relative w-full h-full cursor-grab active:cursor-grabbing z-10"
            />

            {/* TOP FLOATING: PRODUCT VIEW SELECTOR */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 pointer-events-auto">
              <div className="flex items-center gap-1 px-1.5 py-1 rounded-full bg-[#121722]/85 border border-[#232A38] backdrop-blur-xl shadow-lg">
                {[
                  { id: 'front', label: 'Front' },
                  { id: 'inside', label: activeId === 'card' ? 'Back Crest' : activeId === 'certificate' ? 'Attestation' : 'Inside Pages' },
                  { id: 'side', label: 'Profile' },
                  { id: 'detail', label: 'Macro' },
                ].map((v) => (
                  <button
                    key={v.id}
                    onClick={() => handleSelectView(v.id as ViewAngle)}
                    className={`px-3 py-1 rounded-full text-[11px] font-technical uppercase tracking-wider transition-all cursor-pointer ${
                      activeView === v.id
                        ? 'bg-[#D6AD61] text-[#090B10] font-bold shadow-sm'
                        : 'text-[#A1A8B5] hover:text-[#F5F3ED]'
                    }`}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
            </div>

            {/* BOTTOM FLOATING: MINIMAL INTERACTION BAR */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 pointer-events-auto">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#121722]/85 border border-[#232A38] backdrop-blur-xl shadow-2xl">
                {/* Orbit / Auto-Rotate Toggle */}
                <button
                  onClick={() => {
                    registerUserActivity();
                    setAutoRotate(!autoRotate);
                  }}
                  title={autoRotate ? 'Pause 360° Orbit' : 'Resume 360° Orbit'}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-technical transition-all cursor-pointer ${
                    autoRotate
                      ? 'text-[#D6AD61] bg-[#1A2230]'
                      : 'text-[#A1A8B5] hover:text-[#F5F3ED]'
                  }`}
                >
                  <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
                  <span className="text-[10px] hidden sm:inline">Orbit</span>
                </button>

                <div className="w-[1px] h-3.5 bg-[#232A38]" />

                {/* Macro Zoom Toggle */}
                <button
                  onClick={toggleZoom}
                  title={isZoomed ? 'Zoom Out' : 'Zoom In'}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-technical transition-all cursor-pointer ${
                    isZoomed
                      ? 'text-[#D6AD61] bg-[#1A2230]'
                      : 'text-[#A1A8B5] hover:text-[#F5F3ED]'
                  }`}
                >
                  {isZoomed ? <ZoomOut className="w-3.5 h-3.5" /> : <ZoomIn className="w-3.5 h-3.5" />}
                  <span className="text-[10px] hidden sm:inline">Zoom</span>
                </button>

                <div className="w-[1px] h-3.5 bg-[#232A38]" />

                {/* Reset to Signature Angle */}
                <button
                  onClick={handleReset}
                  title="Reset Orientation"
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-technical text-[#A1A8B5] hover:text-[#F5F3ED] transition-all cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-[#D6AD61]" />
                  <span className="text-[10px] hidden sm:inline">Reset</span>
                </button>
              </div>
            </div>

          </div>

          {/* ========================================================
              RIGHT: PRODUCT EDITORIAL DETAILS & CUSTOMIZATION (~40%)
          ======================================================== */}
          <div className="flex-1 overflow-y-auto px-6 sm:px-8 lg:px-10 py-6 sm:py-8 flex flex-col justify-between space-y-6">
            
            {/* 1. Header & Craftsmanship Narrative */}
            <div className="space-y-3">
              <div className="text-[11px] font-technical text-[#D6AD61] uppercase tracking-widest font-semibold">
                {product.category}
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-editorial font-bold text-[#F5F3ED] tracking-tight leading-tight">
                {product.name}
              </h1>

              <p className="text-xs sm:text-sm text-[#A1A8B5] leading-relaxed font-normal pt-1">
                {product.story}
              </p>
            </div>

            {/* 2. Visual Material & Design Variants Selector */}
            <div className="space-y-2.5 border-t border-[#232A38] pt-4">
              <div className="flex items-center justify-between text-xs font-technical">
                <span className="text-[#A1A8B5] uppercase tracking-wider">
                  Select Finish / Design Variant
                </span>
                <span className="text-[#D6AD61] font-medium">
                  {product.variants[activeVariantIndex]?.name}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {product.variants.map((v, idx) => (
                  <button
                    key={v.id}
                    onClick={() => handleSelectVariant(idx)}
                    className={`p-2.5 rounded-xl border text-left transition-all flex items-start gap-2.5 cursor-pointer ${
                      activeVariantIndex === idx
                        ? 'bg-[#1A2230] border-[#D6AD61] text-[#F5F3ED] shadow-sm'
                        : 'bg-[#0E121A] border-[#232A38] text-[#A1A8B5] hover:border-[#D6AD61]/40 hover:text-[#F5F3ED]'
                    }`}
                  >
                    {/* Color Swatch Dot */}
                    <div
                      className="w-4 h-4 rounded-full border border-white/20 shrink-0 mt-0.5 shadow-sm"
                      style={{ backgroundColor: v.swatchColor }}
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-semibold truncate leading-tight">
                        {v.name.split(' ')[0]} {v.name.split(' ')[1]}
                      </div>
                      <div className="text-[10px] text-[#A1A8B5] truncate mt-0.5 opacity-80">
                        {v.description.split('/')[0]}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Core Manufacturing Specifications Grid */}
            <div className="space-y-2 border-t border-[#232A38] pt-4">
              <div className="text-[11px] font-technical uppercase tracking-widest text-[#A1A8B5]">
                Specifications & Provenance
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {product.specs.map((item, i) => (
                  <div key={i} className="p-2.5 rounded-xl bg-[#0B0E14] border border-[#232A38]">
                    <div className="text-[10px] font-technical uppercase text-[#A1A8B5]">{item.label}</div>
                    <div className="text-xs font-medium text-[#F5F3ED] mt-0.5 truncate">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Craftsmanship Features */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {product.finishingOptions.map((f, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-technical bg-[#121722] border border-[#232A38] text-[#A1A8B5]"
                >
                  <Check className="w-3 h-3 text-[#D6AD61]" />
                  <span>{f}</span>
                </span>
              ))}
            </div>

            {/* 5. Direct Action Buttons */}
            <div className="pt-2 border-t border-[#232A38] flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              <button
                onClick={() => {
                  onClose();
                  onRequestQuote(product.rfqCategory);
                }}
                className="flex-1 py-3 px-5 rounded-xl text-xs font-semibold bg-[#D6AD61] hover:bg-[#E5C384] text-[#090B10] flex items-center justify-center gap-2 shadow-sm transition-all duration-200 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Request Custom Quote</span>
              </button>

              {onOpenSampleKit && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenSampleKit();
                  }}
                  className="py-3 px-4 rounded-xl text-xs font-medium bg-[#121722] hover:bg-[#1A2230] border border-[#232A38] text-[#F5F3ED] hover:border-[#D6AD61]/40 flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer"
                >
                  <Box className="w-3.5 h-3.5 text-[#D6AD61]" />
                  <span>Sample Box</span>
                </button>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
