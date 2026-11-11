import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { createVisitingCardTextures } from '../../utils/textureGenerators';
import { CreditCard, Sparkles } from 'lucide-react';

type FoilFinish = 'gold-foil' | 'rose-gold' | 'holographic' | 'spot-uv' | 'blind-deboss';
type StockType = 'cotton-black-600' | 'velvet-matte-400' | 'kraft-450' | 'triplex-core-700';

export const VisitingCardTilt3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [finish, setFinish] = useState<FoilFinish>('gold-foil');
  const [stock, setStock] = useState<StockType>('cotton-black-600');
  const corners: 'standard' | 'rounded' = 'standard';
  const [cardName, setCardName] = useState('MAYURI PRINTERS');
  const companyName = 'MAYURI PRINTERS';

  const cardMeshRef = useRef<THREE.Mesh | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene & Camera - Perfectly Centered
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      40,
      container.clientWidth / container.clientHeight,
      0.1,
      50
    );
    camera.position.set(0, 0, 3.8);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    // 2. Dynamic Lighting
    const ambientLight = new THREE.AmbientLight('#E2E8F0', 0.8);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight('#FFDF94', 3.5, 10);
    pointLight.position.set(1.5, 2, 2.5);
    scene.add(pointLight);

    const rimLight = new THREE.DirectionalLight('#C89D56', 2.0);
    rimLight.position.set(-3, -2, -1);
    scene.add(rimLight);

    // 3. Textures
    const { diffuseTexture, maskTexture } = createVisitingCardTextures(cardName, companyName, stock);

    let foilEmissive = new THREE.Color('#D4AF37');
    let foilMetalness = 0.95;
    let foilRoughness = 0.12;

    if (finish === 'rose-gold') {
      foilEmissive = new THREE.Color('#E0A899');
      pointLight.color.set('#FFD8CF');
    } else if (finish === 'holographic') {
      foilEmissive = new THREE.Color('#A5F3FC');
      pointLight.color.set('#C7D2FE');
      foilMetalness = 0.98;
    } else if (finish === 'spot-uv') {
      foilEmissive = new THREE.Color('#222834');
      foilMetalness = 0.1;
      foilRoughness = 0.05;
    } else if (finish === 'blind-deboss') {
      foilEmissive = new THREE.Color('#000000');
      foilMetalness = 0.0;
      foilRoughness = 0.8;
    }

    const thickness = stock === 'triplex-core-700' ? 0.07 : stock === 'cotton-black-600' ? 0.05 : 0.035;

    let edgeColor = '#1F242F';
    if (stock === 'triplex-core-700') edgeColor = '#C89D56';
    if (stock === 'kraft-450') edgeColor = '#A17D50';

    const edgeMat = new THREE.MeshStandardMaterial({
      color: edgeColor,
      metalness: stock === 'triplex-core-700' ? 0.85 : 0.1,
      roughness: 0.3,
    });

    const faceMat = new THREE.MeshStandardMaterial({
      map: diffuseTexture,
      roughness: foilRoughness,
      metalness: foilMetalness,
      roughnessMap: maskTexture,
    });

    if (finish !== 'blind-deboss') {
      faceMat.emissive = foilEmissive;
      faceMat.emissiveMap = maskTexture;
      faceMat.emissiveIntensity = 0.45;
    }

    // 4. Centered Card Mesh
    const cardGeo = new THREE.BoxGeometry(2.35, 1.34, thickness);
    const cardMaterials = [
      edgeMat, edgeMat, edgeMat, edgeMat,
      faceMat,
      new THREE.MeshStandardMaterial({ color: edgeColor, roughness: 0.75 })
    ];

    const cardMesh = new THREE.Mesh(cardGeo, cardMaterials);
    cardMesh.position.set(0, 0, 0); // EXACT CENTER
    cardMesh.rotation.set(-0.1, -0.15, 0.02);
    scene.add(cardMesh);
    cardMeshRef.current = cardMesh;

    // 5. Tilt & Mouse tracking
    let targetRotX = -0.1;
    let targetRotY = -0.15;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      targetRotY = x * 0.7;
      targetRotX = -y * 0.5;

      pointLight.position.x = x * 3;
      pointLight.position.y = 2 + y * 2;
    };

    container.addEventListener('mousemove', handleMouseMove);

    // 6. Animation
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      cardMesh.rotation.x = THREE.MathUtils.lerp(cardMesh.rotation.x, targetRotX + Math.sin(t * 1.2) * 0.02, 0.08);
      cardMesh.rotation.y = THREE.MathUtils.lerp(cardMesh.rotation.y, targetRotY + Math.cos(t * 0.9) * 0.03, 0.08);

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
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', handleMouseMove);
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [finish, stock, cardName, companyName, corners]);

  return (
    <div className="bg-[#12161F] rounded-3xl border border-[#232B3B] p-6 lg:p-8 shadow-xl">
      <div className="flex flex-col lg:flex-row items-start justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#C89D56]/15 border border-[#C89D56]/30 text-[#C89D56] text-xs font-technical font-bold mb-2">
            <CreditCard className="w-3.5 h-3.5" />
            <span>35 YEARS HERITAGE // PROFESSIONAL VISITING CARDS</span>
          </div>
          <h3 className="text-2xl font-editorial font-bold text-[#F7F5F0]">
            Executive Visiting Cards & Luxury Foil Stamping
          </h3>
          <p className="text-xs sm:text-sm text-[#858E9B] mt-1 max-w-xl">
            Tilt your cursor over the card to inspect metallic hot foil gleam, embossed relief, and heavy 600–700 GSM sandwich boards.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs font-technical bg-[#161B24] px-3 py-1.5 rounded-lg border border-[#232B3B] text-[#C89D56]">
            600+ GSM Heavy Cotton Boards
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* 3D Viewport - CENTERED with Image 4 Background */}
        <div
          className="lg:col-span-7 relative h-[460px] lg:h-[500px] rounded-2xl overflow-hidden border border-[#232B3B] shadow-inner bg-cover bg-center cursor-crosshair"
          style={{ backgroundImage: "linear-gradient(rgba(10, 13, 18, 0.35), rgba(10, 13, 18, 0.55)), url('/grid-bg.jpg')" }}
        >
          <div ref={containerRef} className="w-full h-full" />

          {/* Badge */}
          <div className="absolute top-4 left-4 bg-[#0E1116]/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#232B3B] text-xs font-technical text-[#C89D56] flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>MOVE CURSOR TO TILT & CATCH FOIL SHINE</span>
          </div>

          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
            <div className="bg-[#0E1116]/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-[#232B3B] text-xs text-[#F7F5F0]">
              <span className="text-[#C89D56] font-bold">Selected Finish:</span>{' '}
              {finish === 'gold-foil' && '24K Liquid Gold Hot Stamping'}
              {finish === 'rose-gold' && 'Rose Gold Metallic Foil'}
              {finish === 'holographic' && 'Holographic Silver Foil'}
              {finish === 'spot-uv' && 'Raised Spot UV Varnish'}
              {finish === 'blind-deboss' && 'Tactile Blind Deboss'}
            </div>
          </div>
        </div>

        {/* Simplified Customization Controls */}
        <div className="lg:col-span-5 space-y-4">
          {/* Finish Selector */}
          <div className="bg-[#161B24] p-4 rounded-xl border border-[#232B3B]">
            <label className="text-xs font-technical text-[#F7F5F0] block mb-2 font-bold">
              FOIL & FINISH EFFECT
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'gold-foil', label: 'Gold Foil', color: '#D4AF37' },
                { id: 'rose-gold', label: 'Rose Gold', color: '#E0A899' },
                { id: 'holographic', label: 'Holo Silver', color: '#A5F3FC' },
                { id: 'spot-uv', label: 'Spot UV', color: '#4B5563' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFinish(f.id as FoilFinish)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium border text-left transition-all ${
                    finish === f.id
                      ? 'bg-[#232B3B] text-[#C89D56] border-[#C89D56] font-bold'
                      : 'bg-[#12161F] text-[#858E9B] border-[#232B3B]'
                  }`}
                >
                  <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: f.color }}
                  />
                  <span>{f.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Paper Stock Selector */}
          <div className="bg-[#161B24] p-4 rounded-xl border border-[#232B3B]">
            <label className="text-xs font-technical text-[#F7F5F0] block mb-2 font-bold">
              CARD PAPER THICKNESS
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'cotton-black-600', label: '600 GSM Cotton' },
                { id: 'triplex-core-700', label: '700 GSM Triplex Core' },
                { id: 'velvet-matte-400', label: '400 GSM Velvet' },
                { id: 'kraft-450', label: '450 GSM Kraft' },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setStock(s.id as StockType)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium border text-left transition-all ${
                    stock === s.id
                      ? 'bg-[#C89D56] text-[#0E1116] border-[#C89D56] font-bold'
                      : 'bg-[#12161F] text-[#858E9B] border-[#232B3B]'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Live Card Name Editor */}
          <div className="bg-[#161B24] p-4 rounded-xl border border-[#232B3B] space-y-3">
            <div>
              <label className="text-xs font-technical text-[#858E9B] block mb-1">
                PREVIEW YOUR NAME ON 3D CARD
              </label>
              <input
                type="text"
                value={cardName}
                onChange={(e) => setCardName(e.target.value.toUpperCase())}
                maxLength={24}
                className="w-full bg-[#12161F] border border-[#232B3B] rounded-lg px-3 py-2 text-xs text-[#F7F5F0] font-editorial focus:border-[#C89D56] focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-2">
            <a
              href="#rfq-section"
              className="w-full block text-center py-2.5 px-4 rounded-xl bg-[#C89D56] hover:bg-[#E2BC7A] text-[#0E1116] font-bold text-xs transition-all shadow-lg"
            >
              Request Custom Visiting Card Quote & Proof
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
