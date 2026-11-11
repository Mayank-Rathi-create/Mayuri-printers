import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import * as THREE from 'three';
import {
  createPaperGrainTexture,
  createVisitingCardTextures,
  createTextbookCoverTexture,
  createBillBookSheetTexture,
  createCertificateTextures,
} from '../../utils/textureGenerators';
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Search,
  X,
  Send,
} from 'lucide-react';

export interface ProductItem {
  id: string;
  name: string;
  category: 'all' | 'billbooks' | 'textbooks' | 'cards' | 'certificates';
  keywords: string[];
  tagline: string;
  specs: string[];
}

const PRODUCTS: ProductItem[] = [
  {
    id: 'billbook',
    name: 'Carbonless Bill Book',
    category: 'billbooks',
    keywords: ['bill', 'book', 'invoice', 'challan', 'cash memo', 'ncr', 'duplicate', 'triplicate', 'receipt'],
    tagline: 'Multi-part NCR invoice & cash memo books with red serial numbering & micro-perforations',
    specs: ['2-Part & 3-Part Duplicate', 'Consecutive Red Stamping', 'Perforated Tear Line', 'Bound Spine Tape'],
  },
  {
    id: 'textbook',
    name: 'Academic Textbook',
    category: 'textbooks',
    keywords: ['textbook', 'curriculum', 'school book', 'smyth sewn', 'hardcover', 'book', 'notebook', 'casebound'],
    tagline: 'Smyth-sewn 180° lay-flat thread signatures and durable hardbound case binding for curricula',
    specs: ['180° Lay-Flat Smyth Sewing', 'FSC-Certified 70-80 GSM Book Paper', 'Casebound & Softcover Options'],
  },
  {
    id: 'card',
    name: 'Luxury Visiting Card',
    category: 'cards',
    keywords: ['visiting card', 'business card', 'corporate', 'gold foil', 'cotton', 'embossed', 'debossed'],
    tagline: '600+ GSM thick cotton sandwich boards with 24K hot gold foil stamping and tactile deboss',
    specs: ['600–700 GSM Sandwich Core', '24K Metallic Hot Foil', 'Tactile Blind Debossing', 'Velvet Matte Coating'],
  },
  {
    id: 'certificate',
    name: 'Certificates',
    category: 'certificates',
    keywords: ['certificate', 'merit', 'diploma', 'degree', 'award', 'gold seal', 'parchment', 'guilloche'],
    tagline: 'High-security academic diplomas and corporate merit certificates with 24K hot foil stamped seals and guilloche borders',
    specs: ['300–350 GSM Parchment Board', '24K Metallic Gold Foil Seal', 'Intricate Guilloche Border', 'Anti-Counterfeit Watermark'],
  },
];

interface WatercolorParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  color: [number, number, number];
  targetX: number;
  targetY: number;
}

export interface HeroShowcase3DProps {
  externalSelectedId?: string;
  onRequestQuote?: (productId: string) => void;
}

export const HeroShowcase3D: React.FC<HeroShowcase3DProps> = ({ externalSelectedId }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const watercolorCanvasRef = useRef<HTMLCanvasElement>(null);
  const triggerWatercolorsRef = useRef<((mode?: 'both' | 'left' | 'right') => void) | null>(null);

  const [activeProductId, setActiveProductId] = useState<string>(externalSelectedId || 'billbook');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'billbooks' | 'textbooks' | 'cards' | 'certificates'>('all');

  const currentActiveIdRef = useRef('billbook');
  const targetRotationYRef = useRef(0);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  currentActiveIdRef.current = activeProductId;

  // Filter products by category and search keyword
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      if (!query) return matchesCategory;
      const matchesSearch =
        p.name.toLowerCase().includes(query) ||
        p.tagline.toLowerCase().includes(query) ||
        p.keywords.some((k) => k.includes(query));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const activeIndex = PRODUCTS.findIndex((p) => p.id === activeProductId);
  const activeProduct = PRODUCTS[activeIndex >= 0 ? activeIndex : 0];

  const handleSelectProduct = useCallback(
    (productId: string, fromSide?: 'left' | 'right' | 'both') => {
      if (productId !== activeProductId) {
        if (triggerWatercolorsRef.current) {
          triggerWatercolorsRef.current(fromSide || 'both');
        }
        targetRotationYRef.current += fromSide === 'right' ? Math.PI * 2 : -Math.PI * 2;
        setActiveProductId(productId);
      }
    },
    [activeProductId]
  );

  const handleNext = useCallback(() => {
    const nextIdx = (activeIndex + 1) % PRODUCTS.length;
    handleSelectProduct(PRODUCTS[nextIdx].id, 'right');
  }, [activeIndex, handleSelectProduct]);

  const handlePrev = useCallback(() => {
    const prevIdx = (activeIndex - 1 + PRODUCTS.length) % PRODUCTS.length;
    handleSelectProduct(PRODUCTS[prevIdx].id, 'left');
  }, [activeIndex, handleSelectProduct]);

  // ==========================================
  // WATERCOLOR PARTICLES: Merge in the middle behind the product & disappear fast
  // ==========================================
  useEffect(() => {
    const canvas = watercolorCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 600);

    const particles: WatercolorParticle[] = [];

    // Vivid printing watercolor pigments (Cyan, Magenta, Royal Blue, Turquoise, Liquid Gold)
    const WATERCOLOR_PIGMENTS: [number, number, number][] = [
      [0, 210, 255],    // Vivid Cyan
      [255, 30, 138],   // Vibrant Magenta
      [30, 90, 255],    // Royal Cobalt Blue
      [20, 240, 200],   // Luminous Turquoise
      [245, 170, 30],   // Warm Amber Gold
      [147, 51, 234],   // Deep Violet Ink
      [250, 252, 255],  // Ethereal White Mist
    ];

    const triggerBurst = (mode: 'both' | 'left' | 'right' = 'both') => {
      const targetX = width / 2;
      const targetY = height / 2;
      const count = mode === 'both' ? 80 : 55;

      for (let i = 0; i < count; i++) {
        // Decide stream origin: from left, from right, or both sides converging
        let fromLeft = Math.random() > 0.5;
        if (mode === 'left') fromLeft = true;
        if (mode === 'right') fromLeft = false;

        const startX = fromLeft
          ? -20 + Math.random() * 40
          : width + 20 - Math.random() * 40;

        const startY = height * 0.2 + Math.random() * (height * 0.6);

        // Velocity directed strongly into the middle
        const dir = fromLeft ? 1 : -1;
        const speed = 4.5 + Math.random() * 6.5;
        const vx = dir * speed;
        const vy = (targetY - startY) * 0.035 + (Math.random() - 0.5) * 2.0;

        const color = WATERCOLOR_PIGMENTS[Math.floor(Math.random() * WATERCOLOR_PIGMENTS.length)];

        particles.push({
          x: startX,
          y: startY,
          vx,
          vy,
          radius: 35 + Math.random() * 40,
          maxRadius: 130 + Math.random() * 110,
          alpha: 0.8 + Math.random() * 0.2,
          color,
          targetX,
          targetY,
        });
      }
    };

    triggerWatercolorsRef.current = triggerBurst;

    // Initial watercolor converge on first load
    triggerBurst('both');

    let animId: number;

    const render = () => {
      animId = requestAnimationFrame(render);
      ctx.clearRect(0, 0, width, height);

      // 'screen' mode for rich watercolor blending when colors merge
      ctx.globalCompositeOperation = 'screen';

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        p.x += p.vx;
        p.y += p.vy;
        p.radius = Math.min(p.maxRadius, p.radius + 1.4);

        // Distance to the middle point
        const distToCenter = Math.hypot(p.x - p.targetX, p.y - p.targetY);

        // "merge into the moddle behind the product and dissappears fast after reaching the middle"
        if (distToCenter < 130) {
          // Merge in the center: slow down and evaporate rapidly
          p.vx *= 0.88;
          p.vy *= 0.88;
          p.alpha *= 0.85; // Fast disappear!
        } else {
          // Coasting toward the middle
          p.alpha *= 0.985;
        }

        if (p.alpha > 0.015) {
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
          grad.addColorStop(0, `rgba(${p.color[0]}, ${p.color[1]}, ${p.color[2]}, ${p.alpha * 0.75})`);
          grad.addColorStop(0.5, `rgba(${p.color[0]}, ${p.color[1]}, ${p.color[2]}, ${p.alpha * 0.35})`);
          grad.addColorStop(1, `rgba(${p.color[0]}, ${p.color[1]}, ${p.color[2]}, 0)`);

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        } else {
          particles.splice(i, 1);
        }
      }

      ctx.globalCompositeOperation = 'source-over';
    };

    render();

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // ==========================================
  // THREE.JS 3D RENDERER (Clean, Isolated Models, No Stray Pipes/Leaves)
  // ==========================================
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      40,
      container.clientWidth / container.clientHeight,
      0.1,
      50
    );
    camera.position.set(0, 0.1, 4.2);
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

    // 2. Lighting Setup
    const ambientLight = new THREE.AmbientLight('#FFFFFF', 0.95);
    scene.add(ambientLight);

    const yellowSpotlight = new THREE.SpotLight('#FACC15', 5.0);
    yellowSpotlight.position.set(0, 3, 3.5);
    yellowSpotlight.angle = Math.PI / 3.2;
    yellowSpotlight.penumbra = 0.6;
    yellowSpotlight.castShadow = true;
    scene.add(yellowSpotlight);

    const keyLight = new THREE.DirectionalLight('#E2BC7A', 2.2);
    keyLight.position.set(-3, 2, 3);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight('#06B6D4', 1.2);
    rimLight.position.set(3, -2, -2);
    scene.add(rimLight);

    // 3. Build Products Dictionary (Centered at origin, zero detached parts)
    const paperBump = createPaperGrainTexture();
    const productMeshes: Record<string, THREE.Group> = {};

    // ====== PRODUCT 0: Carbonless Bill Book ======
    const billBookGroup = new THREE.Group();
    billBookGroup.position.set(0, 0, 0);
    billBookGroup.rotation.set(-0.25, 0.2, 0);

    const billBookTopTex = createBillBookSheetTexture('white', '№ 084192', 'TAX INVOICE / CASH MEMO');
    const billBookTopMat = new THREE.MeshStandardMaterial({
      map: billBookTopTex,
      bumpMap: paperBump,
      bumpScale: 0.002,
      roughness: 0.88,
    });
    const spineMat = new THREE.MeshStandardMaterial({ color: '#881337', roughness: 0.6 });
    const bookEdgeMat = new THREE.MeshStandardMaterial({ color: '#F4EFE6', roughness: 0.9 });

    const billBookGeo = new THREE.BoxGeometry(1.5, 2.0, 0.16);
    const billBookMats = [
      bookEdgeMat,
      spineMat,
      bookEdgeMat,
      bookEdgeMat,
      billBookTopMat,
      new THREE.MeshStandardMaterial({ color: '#78350F', roughness: 0.85 }),
    ];
    const billBookMesh = new THREE.Mesh(billBookGeo, billBookMats);
    billBookMesh.castShadow = true;
    billBookGroup.add(billBookMesh);

    // Fanned pink duplicate sheet
    const pinkLeafTex = createBillBookSheetTexture('pink', '№ 084192', 'DUPLICATE CHALLAN');
    const pinkLeafMat = new THREE.MeshStandardMaterial({
      map: pinkLeafTex,
      roughness: 0.9,
      side: THREE.DoubleSide,
    });
    const pinkLeafGeo = new THREE.PlaneGeometry(1.46, 1.96);
    const pinkLeaf = new THREE.Mesh(pinkLeafGeo, pinkLeafMat);
    pinkLeaf.position.set(0.08, 0.04, 0.11);
    pinkLeaf.rotation.z = -0.05;
    billBookGroup.add(pinkLeaf);

    scene.add(billBookGroup);
    productMeshes['billbook'] = billBookGroup;

    // ====== PRODUCT 1: Academic Textbook (Clean Solid Volume) ======
    const textbookGroup = new THREE.Group();
    textbookGroup.position.set(0, 0, 0);
    textbookGroup.rotation.set(0.12, 0.35, -0.04);

    const bookCoverTex = createTextbookCoverTexture(
      'MAYURI PRESS',
      '35 Years of Printing Excellence & Publishing',
      'hardcover-casebound'
    );
    const bookCoverMat = new THREE.MeshStandardMaterial({
      map: bookCoverTex,
      bumpMap: paperBump,
      bumpScale: 0.003,
      roughness: 0.45,
      metalness: 0.2,
    });

    const bookGeo = new THREE.BoxGeometry(1.6, 2.2, 0.3);
    const bookMats = [
      bookEdgeMat,
      new THREE.MeshStandardMaterial({ color: '#09101A', roughness: 0.5 }),
      bookEdgeMat,
      bookEdgeMat,
      bookCoverMat,
      new THREE.MeshStandardMaterial({ color: '#09101A', roughness: 0.5 }),
    ];
    const bookMesh = new THREE.Mesh(bookGeo, bookMats);
    bookMesh.castShadow = true;
    textbookGroup.add(bookMesh);

    scene.add(textbookGroup);
    productMeshes['textbook'] = textbookGroup;

    // ====== PRODUCT 2: Luxury Visiting Card ======
    const cardGroup = new THREE.Group();
    cardGroup.position.set(0, 0, 0);
    cardGroup.rotation.set(-0.15, -0.3, 0.05);

    const { diffuseTexture: cardDiff, maskTexture: cardMask } = createVisitingCardTextures(
      'MAYURI PRINTERS',
      'ESTABLISHED 1991',
      'cotton-black-600'
    );
    const cardGeo = new THREE.BoxGeometry(2.1, 1.2, 0.045);
    const cardFaceMat = new THREE.MeshStandardMaterial({
      map: cardDiff,
      roughness: 0.65,
      metalness: 0.25,
      roughnessMap: cardMask,
    });
    const cardGoldEdge = new THREE.MeshStandardMaterial({
      color: '#D6AD61',
      metalness: 0.9,
      roughness: 0.18,
    });
    const cardMats = [
      cardGoldEdge, cardGoldEdge, cardGoldEdge, cardGoldEdge,
      cardFaceMat,
      new THREE.MeshStandardMaterial({ color: '#11151F', roughness: 0.8 }),
    ];
    const cardMesh = new THREE.Mesh(cardGeo, cardMats);
    cardMesh.castShadow = true;
    cardGroup.add(cardMesh);

    scene.add(cardGroup);
    productMeshes['card'] = cardGroup;

    // ====== PRODUCT 3: Beautiful Security & Merit Certificate ======
    const certGroup = new THREE.Group();
    certGroup.position.set(0, 0, 0);
    certGroup.rotation.set(-0.12, 0.22, 0);

    const { diffuseTexture: certDiff, maskTexture: certMask } = createCertificateTextures(
      'ARUN KUMAR SHARMA',
      'CERTIFICATE OF EXCELLENCE',
      'MAYURI ACADEMIC PRESS & EXAMINATION BOARD'
    );

    const certGeo = new THREE.BoxGeometry(2.36, 1.66, 0.035);
    const certFrontMat = new THREE.MeshStandardMaterial({
      map: certDiff,
      roughness: 0.65,
      metalness: 0.22,
      roughnessMap: certMask,
      bumpMap: paperBump,
      bumpScale: 0.002,
    });
    const certGoldEdge = new THREE.MeshStandardMaterial({
      color: '#D6AD61',
      metalness: 0.92,
      roughness: 0.15,
    });
    const certBackMat = new THREE.MeshStandardMaterial({
      color: '#F8F5EC',
      roughness: 0.85,
    });

    const certMats = [
      certGoldEdge, certGoldEdge, certGoldEdge, certGoldEdge,
      certFrontMat,
      certBackMat,
    ];
    const certMesh = new THREE.Mesh(certGeo, certMats);
    certMesh.castShadow = true;
    certGroup.add(certMesh);

    scene.add(certGroup);
    productMeshes['certificate'] = certGroup;

    // 4. Interactive Mouse & Touch Dragging
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
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseNormX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseNormY = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      yellowSpotlight.position.x = mouseNormX * 3.2;
      yellowSpotlight.position.y = 2.2 + mouseNormY * 2.2;

      if (isDragging) {
        const deltaX = e.clientX - prevMouseX;
        const deltaY = e.clientY - prevMouseY;
        manualRotY += deltaX * 0.008;
        manualRotX += deltaY * 0.006;
        manualRotX = Math.max(-0.6, Math.min(0.6, manualRotX));
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
      }
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Touch Swipe Detection
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        prevMouseX = e.touches[0].clientX;
        prevMouseY = e.touches[0].clientY;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const rect = container.getBoundingClientRect();
        mouseNormX = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
        mouseNormY = -((touch.clientY - rect.top) / rect.height) * 2 + 1;
        yellowSpotlight.position.x = mouseNormX * 3.0;

        const deltaX = touch.clientX - prevMouseX;
        manualRotY += deltaX * 0.008;
        prevMouseX = touch.clientX;
        prevMouseY = touch.clientY;
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (touchStartRef.current && e.changedTouches.length > 0) {
        const diffX = e.changedTouches[0].clientX - touchStartRef.current.x;
        const diffY = e.changedTouches[0].clientY - touchStartRef.current.y;
        if (Math.abs(diffX) > 45 && Math.abs(diffX) > Math.abs(diffY)) {
          if (diffX < 0) {
            handleNext();
          } else {
            handlePrev();
          }
        }
      }
      touchStartRef.current = null;
    };

    container.addEventListener('touchstart', onTouchStart, { passive: true });
    container.addEventListener('touchmove', onTouchMove, { passive: true });
    container.addEventListener('touchend', onTouchEnd, { passive: true });

    // 5. Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();
    let currentRotationY = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();
      const currentActiveId = currentActiveIdRef.current;

      currentRotationY += (targetRotationYRef.current - currentRotationY) * 0.08;

      // Dynamic yellow cursor spotlight in 3D
      yellowSpotlight.position.x = mouseNormX * 3.5;
      yellowSpotlight.position.y = mouseNormY * 2.5 + 1.2;

      Object.entries(productMeshes).forEach(([id, group]) => {
        if (id === currentActiveId) {
          group.visible = true;

          const floatY = Math.sin(elapsedTime * 1.4) * 0.03;
          group.position.y = floatY;

          group.rotation.y = currentRotationY + manualRotY + (id === 'card' ? -0.3 : id === 'certificate' ? 0.12 : 0.25);
          group.rotation.x = manualRotX + (id === 'billbook' ? -0.25 : id === 'card' ? -0.15 : id === 'certificate' ? -0.1 : 0.12);
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
      container.removeEventListener('touchstart', onTouchStart);
      container.removeEventListener('touchmove', onTouchMove);
      container.removeEventListener('touchend', onTouchEnd);
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [handleNext, handlePrev]);

  return (
    <div id="showroom" className="w-full space-y-4">
      {/* 1. PRODUCT SEARCH & CATEGORY FILTER BAR */}
      <div className="bg-[#141821] p-3.5 sm:p-4 rounded-2xl border border-[#292F3B] shadow-lg flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Live Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#D6AD61] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              const val = e.target.value;
              setSearchQuery(val);
              // Auto-select first matching product
              const query = val.toLowerCase().trim();
              if (query) {
                const match = PRODUCTS.find(
                  (p) =>
                    p.name.toLowerCase().includes(query) ||
                    p.keywords.some((k) => k.includes(query))
                );
                if (match && match.id !== activeProductId) {
                  handleSelectProduct(match.id, 'both');
                }
              }
            }}
            placeholder="Search products (e.g. Bill Books, Textbooks, Visiting Cards, Paper Export)..."
            className="w-full bg-[#090B10] border border-[#292F3B] rounded-xl pl-10 pr-9 py-2.5 text-xs text-[#F5F3ED] placeholder-[#A1A8B5]/60 focus:border-[#D6AD61] focus:outline-none transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A1A8B5] hover:text-[#F5F3ED] p-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category Filters (Clean, no emoji logos) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: 'all', label: 'All Products (4)' },
            { id: 'billbooks', label: 'Bill Books' },
            { id: 'textbooks', label: 'Textbooks' },
            { id: 'cards', label: 'Visiting Cards' },
            { id: 'certificates', label: 'Certificates' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id as any);
                if (cat.id !== 'all') {
                  const target = PRODUCTS.find((p) => p.category === cat.id);
                  if (target) handleSelectProduct(target.id, 'both');
                }
              }}
              className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#D6AD61] text-[#090B10] shadow-sm'
                  : 'bg-[#1A202B] border border-[#292F3B] text-[#A1A8B5] hover:text-[#F5F3ED]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. MAIN 3D SHOWCASE VIEWPORT: Watercolor merging behind product + 3D Model */}
      <div className="relative w-full h-[520px] sm:h-[580px] lg:h-[640px] rounded-3xl overflow-hidden border border-[#292F3B] shadow-2xl bg-[#090B10] select-none">
        {/* Fluid Watercolors Layer: Merges in middle behind product & dissolves fast */}
        <canvas
          ref={watercolorCanvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
        />

        {/* 3D WebGL Canvas */}
        <div
          ref={containerRef}
          className="relative z-10 w-full h-full cursor-grab active:cursor-grabbing"
        />

        {/* TOP STATUS & ACTIVE PRODUCT PILLS */}
        <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 pointer-events-none z-20">
          <div className="bg-[#141821]/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-[#292F3B] flex items-center gap-2 pointer-events-auto">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            <span className="text-[11px] font-technical text-[#D6AD61] font-semibold tracking-wider uppercase">
              SHOWROOM // {activeProduct.name}
            </span>
          </div>

          {/* Quick Product Tabs (Clean text, no icons) */}
          <div className="bg-[#141821]/90 backdrop-blur-md p-1 rounded-xl border border-[#292F3B] flex items-center gap-1 pointer-events-auto shadow-sm overflow-x-auto max-w-full">
            {filteredProducts.map((p) => (
              <button
                key={p.id}
                onClick={() => handleSelectProduct(p.id, 'both')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  activeProductId === p.id
                    ? 'bg-[#D6AD61] text-[#090B10] font-semibold shadow-sm'
                    : 'text-[#A1A8B5] hover:text-[#F5F3ED] hover:bg-[#1A202B]'
                }`}
              >
                <span>{p.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* SWIPE NAVIGATION: Left & Right Chevrons */}
        <button
          onClick={handlePrev}
          aria-label="Previous product"
          className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#141821]/90 hover:bg-[#D6AD61] text-[#F5F3ED] hover:text-[#090B10] border border-[#292F3B] hover:border-[#D6AD61] backdrop-blur-md flex items-center justify-center transition-all shadow-md hover:scale-105 cursor-pointer z-20"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={handleNext}
          aria-label="Next product"
          className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#141821]/90 hover:bg-[#D6AD61] text-[#F5F3ED] hover:text-[#090B10] border border-[#292F3B] hover:border-[#D6AD61] backdrop-blur-md flex items-center justify-center transition-all shadow-md hover:scale-105 cursor-pointer z-20"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* BOTTOM HUD: Clean Product Specifications & Instant RFQ Link */}
        <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-end justify-between gap-3 pointer-events-none z-20">
          <div className="bg-[#141821]/95 backdrop-blur-md p-4 rounded-2xl border border-[#292F3B] max-w-lg pointer-events-auto shadow-xl space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-technical text-[#D6AD61] font-semibold uppercase tracking-wider">
                {activeProduct.name}
              </span>
              <span className="text-[10px] text-[#A1A8B5] font-technical">
                (Swipe / drag to inspect in 360°)
              </span>
            </div>

            <p className="text-xs text-[#F5F3ED]/90 leading-relaxed">
              {activeProduct.tagline}
            </p>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {activeProduct.specs.map((spec, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded text-[10px] font-technical bg-[#1A202B] border border-[#292F3B] text-[#A1A8B5]"
                >
                  {spec}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 pointer-events-auto">
            <button
              onClick={() => {
                targetRotationYRef.current = 0;
                if (triggerWatercolorsRef.current) triggerWatercolorsRef.current('both');
              }}
              className="bg-[#141821]/90 hover:bg-[#1A202B] text-[#F5F3ED] text-xs px-3.5 py-2.5 rounded-xl border border-[#292F3B] flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#D6AD61]" />
              <span className="hidden sm:inline">Reset View</span>
            </button>

            <a
              href="#rfq-section"
              className="bg-[#D6AD61] hover:bg-[#E0BC74] text-[#090B10] font-semibold text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Request Quote for {activeProduct.name}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
