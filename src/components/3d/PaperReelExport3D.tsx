import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { createPaperReelLabelTexture } from '../../utils/textureGenerators';
import { Globe2 } from 'lucide-react';

export const PaperReelExport3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [paperGrade, setPaperGrade] = useState<'virgin-woodfree' | 'kraft-liner' | 'duplex-board' | 'coated-art'>('virgin-woodfree');
  const [reelDiameterMm, setReelDiameterMm] = useState(1150); // 800 - 1500
  const [webWidthMm, setWebWidthMm] = useState(1200); // 600 - 2000
  const coreSize: 3 | 6 = 3; // 3 inch standard
  const [wrappingMode] = useState<'poly-shrink' | 'kraft-wrap' | 'pallet-crated'>('poly-shrink');
  const containerType: '20ft' | '40ft' = '20ft';

  const rootGroupRef = useRef<THREE.Group | null>(null);

  // Math Calculations for Export Cargo
  const R = reelDiameterMm / 2000;
  const r = (coreSize * 0.0254) / 2;
  const W = webWidthMm / 1000;
  const density = paperGrade === 'kraft-liner' ? 0.72 : paperGrade === 'duplex-board' ? 0.82 : 0.78;

  const volumeM3 = Math.PI * (R * R - r * r) * W;
  const singleReelWeightKg = Math.round(volumeM3 * density * 1000);

  const maxPayloadKg = containerType === '20ft' ? 21500 : 26500;
  const maxReelsByWeight = Math.floor(maxPayloadKg / singleReelWeightKg);
  const estimatedReels = Math.min(maxReelsByWeight, containerType === '20ft' ? 18 : 36);
  const totalFclWeightTons = ((estimatedReels * singleReelWeightKg) / 1000).toFixed(1);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene & Camera - Perfectly Centered
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      42,
      container.clientWidth / container.clientHeight,
      0.1,
      50
    );
    camera.position.set(0, 0.1, 4.0);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    container.appendChild(renderer.domElement);

    // 2. Lights
    const ambientLight = new THREE.AmbientLight('#E2E8F0', 0.9);
    scene.add(ambientLight);

    const spotLight = new THREE.SpotLight('#FFF8E7', 3.5);
    spotLight.position.set(0, 3.5, 3.5);
    spotLight.castShadow = true;
    scene.add(spotLight);

    const rimLight = new THREE.DirectionalLight('#C89D56', 2.0);
    rimLight.position.set(-3, -1, 1);
    scene.add(rimLight);

    // 3. Reel 3D Geometry - CENTERED AT (0, 0, 0)
    const root = new THREE.Group();
    root.position.set(0, 0, 0);
    root.rotation.set(-0.2, 0.35, 0);
    scene.add(root);
    rootGroupRef.current = root;

    const sceneRadius = (reelDiameterMm / 1200) * 0.85;
    const sceneHeight = (webWidthMm / 1200) * 1.4;

    const gradeLabel =
      paperGrade === 'virgin-woodfree'
        ? '80 GSM VIRGIN WOODFREE UNCOATED'
        : paperGrade === 'kraft-liner'
        ? '150 GSM MULTI-PLY VIRGIN KRAFT LINER'
        : paperGrade === 'duplex-board'
        ? '300 GSM GREY BACK DUPLEX BOARD'
        : '130 GSM GLOSS COATED ART PAPER';

    const labelTex = createPaperReelLabelTexture(gradeLabel, webWidthMm, singleReelWeightKg);

    let wrapperColor = '#B08855';
    let wrapperRoughness = 0.85;
    let wrapperMetalness = 0.05;

    if (wrappingMode === 'poly-shrink') {
      wrapperColor = '#D1D5DB';
      wrapperRoughness = 0.25;
      wrapperMetalness = 0.1;
    }

    const wrapperMat = new THREE.MeshStandardMaterial({
      map: labelTex,
      color: wrapperColor,
      roughness: wrapperRoughness,
      metalness: wrapperMetalness,
    });

    const endFaceMat = new THREE.MeshStandardMaterial({
      color: paperGrade === 'kraft-liner' ? '#8C673D' : '#EDE8DC',
      roughness: 0.95,
    });

    const cylinderGeo = new THREE.CylinderGeometry(sceneRadius, sceneRadius, sceneHeight, 48);
    const cylinderMesh = new THREE.Mesh(cylinderGeo, [
      wrapperMat,
      endFaceMat,
      endFaceMat,
    ]);
    cylinderMesh.castShadow = true;
    root.add(cylinderMesh);

    // Inner Core Tube
    const coreRadius = (coreSize / 3) * 0.11;
    const coreGeo = new THREE.CylinderGeometry(coreRadius, coreRadius, sceneHeight + 0.02, 24);
    const coreMat = new THREE.MeshStandardMaterial({ color: '#1F2937', roughness: 0.6 });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    root.add(coreMesh);

    if (wrappingMode === 'pallet-crated') {
      const palletGeo = new THREE.BoxGeometry(sceneRadius * 2.1, 0.1, sceneRadius * 2.1);
      const palletMat = new THREE.MeshStandardMaterial({ color: '#78350F', roughness: 0.9 });
      const palletMesh = new THREE.Mesh(palletGeo, palletMat);
      palletMesh.position.y = -sceneHeight / 2 - 0.07;
      root.add(palletMesh);
    }

    // 4. Orbit Drag
    let isDragging = false;
    let prevX = 0;
    let prevY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevX = e.clientX;
      prevY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - prevX;
      const dy = e.clientY - prevY;
      prevX = e.clientX;
      prevY = e.clientY;

      root.rotation.y += dx * 0.008;
      root.rotation.x += dy * 0.008;
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // 5. Animation
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (!isDragging) {
        root.rotation.y += 0.003;
      }

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
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [paperGrade, reelDiameterMm, webWidthMm, coreSize, wrappingMode, singleReelWeightKg]);

  return (
    <div className="bg-[#12161F] rounded-3xl border border-[#232B3B] p-6 lg:p-8 shadow-xl">
      <div className="flex flex-col lg:flex-row items-start justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#C89D56]/15 border border-[#C89D56]/30 text-[#C89D56] text-xs font-technical font-bold mb-2">
            <Globe2 className="w-3.5 h-3.5" />
            <span>35 YEARS HERITAGE // GLOBAL PAPER EXPORTS</span>
          </div>
          <h3 className="text-2xl font-editorial font-bold text-[#F7F5F0]">
            Export Paper Reels, Woodfree Copier & Duplex Boards
          </h3>
          <p className="text-xs sm:text-sm text-[#858E9B] mt-1 max-w-xl">
            Custom reel diameter slitting and moisture-barrier container loading for global paper importers. FOB & CIF quotes available.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs font-technical bg-[#161B24] px-3 py-1.5 rounded-lg border border-[#232B3B] text-[#C89D56]">
            Export Grade Bulk Paper Supply
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* 3D Viewport - CENTERED with Image 4 Background */}
        <div
          className="lg:col-span-7 relative h-[460px] lg:h-[500px] rounded-2xl overflow-hidden border border-[#232B3B] shadow-inner bg-cover bg-center cursor-grab active:cursor-grabbing"
          style={{ backgroundImage: "linear-gradient(rgba(10, 13, 18, 0.35), rgba(10, 13, 18, 0.55)), url('/grid-bg.jpg')" }}
        >
          <div ref={containerRef} className="w-full h-full" />

          <div className="absolute top-4 left-4 bg-[#0E1116]/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#232B3B] text-xs font-technical text-[#C89D56]">
            DRAG TO ROTATE 360° // CENTERED REEL
          </div>

          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
            <div className="bg-[#0E1116]/90 backdrop-blur-md px-4 py-2 rounded-xl border border-[#232B3B] text-xs text-[#F7F5F0]">
              <div className="text-[#C89D56] font-bold">Single Reel Weight:</div>
              <div className="font-mono text-base font-bold text-white">{singleReelWeightKg.toLocaleString()} KG</div>
            </div>

            <div className="bg-[#0E1116]/90 backdrop-blur-md px-4 py-2 rounded-xl border border-[#232B3B] text-xs text-right">
              <div className="text-[#858E9B]">Container Payload:</div>
              <div className="font-mono text-base font-bold text-[#10B981]">{totalFclWeightTons} MT</div>
            </div>
          </div>
        </div>

        {/* Simplified Logistics Controls */}
        <div className="lg:col-span-5 space-y-4">
          {/* Paper Grade */}
          <div className="bg-[#161B24] p-4 rounded-xl border border-[#232B3B]">
            <label className="text-xs font-technical text-[#F7F5F0] block mb-2 font-bold">
              SELECT PAPER SUBSTRATE
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'virgin-woodfree', label: 'Virgin Woodfree' },
                { id: 'kraft-liner', label: 'Kraft Liner' },
                { id: 'duplex-board', label: 'Duplex Board' },
                { id: 'coated-art', label: 'Art Paper' },
              ].map((g) => (
                <button
                  key={g.id}
                  onClick={() => setPaperGrade(g.id as any)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium border text-left transition-all truncate ${
                    paperGrade === g.id
                      ? 'bg-[#C89D56] text-[#0E1116] border-[#C89D56] font-bold'
                      : 'bg-[#12161F] text-[#858E9B] border-[#232B3B]'
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sliders */}
          <div className="bg-[#161B24] p-4 rounded-xl border border-[#232B3B] space-y-3">
            <div>
              <div className="flex items-center justify-between text-xs font-technical mb-1">
                <span className="text-[#F7F5F0] font-bold">REEL DIAMETER</span>
                <span className="text-[#C89D56] font-mono font-bold">{reelDiameterMm} mm</span>
              </div>
              <input
                type="range"
                min="800"
                max="1500"
                step="25"
                value={reelDiameterMm}
                onChange={(e) => setReelDiameterMm(parseInt(e.target.value))}
                className="w-full accent-[#C89D56] cursor-pointer"
              />
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-technical mb-1">
                <span className="text-[#F7F5F0] font-bold">SLITTING WIDTH</span>
                <span className="text-[#C89D56] font-mono font-bold">{webWidthMm} mm</span>
              </div>
              <input
                type="range"
                min="600"
                max="2000"
                step="50"
                value={webWidthMm}
                onChange={(e) => setWebWidthMm(parseInt(e.target.value))}
                className="w-full accent-[#C89D56] cursor-pointer"
              />
            </div>
          </div>

          {/* RFQ Action */}
          <div className="pt-2">
            <a
              href="#rfq-section"
              className="w-full block text-center py-2.5 px-4 rounded-xl bg-[#C89D56] hover:bg-[#E2BC7A] text-[#0E1116] font-bold text-xs transition-all shadow-lg"
            >
              Get Ocean Freight CIF Quote & Packing Specs
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
