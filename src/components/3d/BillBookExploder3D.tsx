import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { createBillBookSheetTexture, createPaperGrainTexture } from '../../utils/textureGenerators';
import { Layers, Scissors, RotateCcw } from 'lucide-react';

export const BillBookExploder3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [explodeVal, setExplodeVal] = useState(0.4); // 0 to 1
  const [parts, setParts] = useState<2 | 3 | 4>(3);
  const [isTorn, setIsTorn] = useState(false);
  const [binding, setBinding] = useState<'cloth-tape' | 'hardbound' | 'pad-glued'>('cloth-tape');
  const [activeSheetInfo, setActiveSheetInfo] = useState('Top Leaf: 56 GSM White CB (Original)');

  const sceneRef = useRef<THREE.Scene | null>(null);
  const sheetsRef = useRef<THREE.Group[]>([]);
  const rootGroupRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene & Camera Setup - Perfectly Centered
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      42,
      container.clientWidth / container.clientHeight,
      0.1,
      50
    );
    // Camera placed directly in front of the center
    camera.position.set(0, 0.05, 3.9);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    container.appendChild(renderer.domElement);

    // 2. Lights
    const ambientLight = new THREE.AmbientLight('#FFFFFF', 0.95);
    scene.add(ambientLight);

    const spotLight = new THREE.SpotLight('#FFFBEB', 3.5);
    spotLight.position.set(0, 3.5, 3.5);
    spotLight.castShadow = true;
    scene.add(spotLight);

    const rimLight = new THREE.DirectionalLight('#C89D56', 1.8);
    rimLight.position.set(-3, -1, 1);
    scene.add(rimLight);

    const greenFill = new THREE.DirectionalLight('#10B981', 1.0);
    greenFill.position.set(3, -2, -1);
    scene.add(greenFill);

    // 3. Build Bill Book assembly - Centered at (0, 0, 0)
    const rootGroup = new THREE.Group();
    rootGroup.position.set(0, 0, 0);
    rootGroup.rotation.set(-0.25, 0.35, 0.05);
    scene.add(rootGroup);
    rootGroupRef.current = rootGroup;

    const paperBump = createPaperGrainTexture();

    // Sheet Textures
    const texWhite = createBillBookSheetTexture('white', '№ 084192', 'TAX INVOICE - ORIGINAL');
    const texPink = createBillBookSheetTexture('pink', '№ 084192', 'TAX INVOICE - DUPLICATE');
    const texYellow = createBillBookSheetTexture('yellow', '№ 084192', 'TAX INVOICE - TRIPLICATE');

    const sheetColors = [
      { name: 'Top Leaf: 56 GSM White CB (Original Buyer Copy)', tex: texWhite },
      { name: 'Duplicate: 53 GSM Pink CFB (Transporter Copy)', tex: texPink },
      { name: 'Triplicate: 57 GSM Yellow CF (Accounts Copy)', tex: texYellow },
      { name: 'Quadruplicate: 53 GSM Blue CF (Store Audit)', tex: texWhite },
    ];

    sheetsRef.current = [];

    // Backing Board (Base)
    const boardGeo = new THREE.BoxGeometry(1.5, 2.1, 0.06);
    const boardMat = new THREE.MeshStandardMaterial({
      color: binding === 'hardbound' ? '#1F2937' : '#92400E',
      roughness: 0.85,
    });
    const backingBoard = new THREE.Mesh(boardGeo, boardMat);
    backingBoard.position.set(0, 0, -0.06);
    backingBoard.receiveShadow = true;
    rootGroup.add(backingBoard);

    // Cloth spine on the left edge
    const spineColor = binding === 'cloth-tape' ? '#881337' : binding === 'hardbound' ? '#111827' : '#CBD5E1';
    const spineGeo = new THREE.BoxGeometry(0.18, 2.12, 0.22);
    const spineMat = new THREE.MeshStandardMaterial({
      color: spineColor,
      roughness: 0.6,
      bumpMap: paperBump,
      bumpScale: 0.005,
    });
    const spine = new THREE.Mesh(spineGeo, spineMat);
    spine.position.set(-0.7, 0, 0.04);
    rootGroup.add(spine);

    // Generate Leaves centered around z = 0
    for (let i = 0; i < parts; i++) {
      const sheetGroup = new THREE.Group();

      const leafGeo = new THREE.PlaneGeometry(1.42, 2.05);
      const leafMat = new THREE.MeshStandardMaterial({
        map: sheetColors[i].tex,
        bumpMap: paperBump,
        bumpScale: 0.002,
        roughness: 0.85,
        side: THREE.DoubleSide,
      });

      const leafMesh = new THREE.Mesh(leafGeo, leafMat);
      leafMesh.castShadow = true;
      leafMesh.receiveShadow = true;
      sheetGroup.add(leafMesh);

      rootGroup.add(sheetGroup);
      sheetsRef.current.push(sheetGroup);
    }

    // 4. Mouse Drag / Orbit logic
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      rootGroup.rotation.y += deltaX * 0.008;
      rootGroup.rotation.x += deltaY * 0.008;
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // 5. Animation loop with centered explosion
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Symmetrically explode leaves from center
      sheetsRef.current.forEach((grp, idx) => {
        const centerOffset = (parts - 1 - idx) - (parts - 1) / 2;
        const targetZ = centerOffset * explodeVal * 0.55 + (isTorn && idx === 0 ? 0.35 : 0);
        const targetY = centerOffset * explodeVal * 0.1;
        grp.position.z = THREE.MathUtils.lerp(grp.position.z, targetZ, 0.1);
        grp.position.y = THREE.MathUtils.lerp(grp.position.y, targetY, 0.1);

        if (idx === 0 && isTorn) {
          grp.position.x = THREE.MathUtils.lerp(grp.position.x, 0.35, 0.08);
          grp.rotation.z = THREE.MathUtils.lerp(grp.rotation.z, -0.12, 0.08);
        } else if (idx === 0) {
          grp.position.x = THREE.MathUtils.lerp(grp.position.x, 0, 0.1);
          grp.rotation.z = THREE.MathUtils.lerp(grp.rotation.z, 0, 0.1);
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
  }, [parts, binding, isTorn]);

  const resetView = () => {
    if (rootGroupRef.current) {
      rootGroupRef.current.rotation.set(-0.25, 0.35, 0.05);
    }
    setExplodeVal(0.4);
    setIsTorn(false);
  };

  return (
    <div className="bg-[#12161F] rounded-3xl border border-[#232B3B] p-6 lg:p-8 shadow-xl">
      <div className="flex flex-col lg:flex-row items-start justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#C89D56]/15 border border-[#C89D56]/30 text-[#C89D56] text-xs font-technical font-bold mb-2">
            <Layers className="w-3.5 h-3.5" />
            <span>35 YEARS HERITAGE // CARBONLESS BILL BOOKS & INVOICES</span>
          </div>
          <h3 className="text-2xl font-editorial font-bold text-[#F7F5F0]">
            Custom Bill Books, Cash Memos & Delivery Challans
          </h3>
          <p className="text-xs sm:text-sm text-[#858E9B] mt-1 max-w-xl">
            Directly manufactured by Mayuri Printers. Rotate and separate layers below to inspect carbonless duplicate transfer and perforated leaves.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs font-technical bg-[#161B24] px-3 py-1.5 rounded-lg border border-[#232B3B] text-[#C89D56]">
            35 Years Continuous Press Production
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* 3D Canvas Viewport - CENTERED with Image 4 Background */}
        <div
          className="lg:col-span-7 relative h-[460px] lg:h-[500px] rounded-2xl overflow-hidden border border-[#232B3B] shadow-inner bg-cover bg-center"
          style={{ backgroundImage: "linear-gradient(rgba(10, 13, 18, 0.35), rgba(10, 13, 18, 0.55)), url('/grid-bg.jpg')" }}
        >
          <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

          {/* Top Info */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
            <div className="bg-[#0E1116]/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#232B3B] text-xs font-technical text-[#C89D56] pointer-events-auto">
              DRAG TO ROTATE // SCROLL TO ZOOM
            </div>
            <button
              onClick={resetView}
              className="bg-[#0E1116]/90 hover:bg-[#1E2535] text-white p-2 rounded-lg border border-[#232B3B] pointer-events-auto transition-colors"
              title="Reset Position"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#C89D56]" />
            </button>
          </div>

          {/* Bottom Controls */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
            <div className="bg-[#0E1116]/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-[#232B3B] text-xs text-[#F7F5F0] pointer-events-auto">
              <span className="text-[#C89D56] font-bold">Layer:</span> {activeSheetInfo}
            </div>

            <button
              onClick={() => setIsTorn(!isTorn)}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 pointer-events-auto transition-all shadow-lg ${
                isTorn
                  ? 'bg-[#EF4444] text-white'
                  : 'bg-[#C89D56] hover:bg-[#E2BC7A] text-[#0E1116]'
              }`}
            >
              <Scissors className="w-3.5 h-3.5" />
              <span>{isTorn ? 'Re-Attach Leaf' : 'Simulate Tear-Off'}</span>
            </button>
          </div>
        </div>

        {/* Simplified, Easy-to-Understand Controls */}
        <div className="lg:col-span-5 space-y-4">
          {/* Layer Separation Slider */}
          <div className="bg-[#161B24] p-4 rounded-xl border border-[#232B3B]">
            <div className="flex items-center justify-between text-xs font-technical mb-2">
              <span className="text-[#F7F5F0] font-bold">SEPARATE / EXPLODE LAYERS</span>
              <span className="text-[#C89D56] font-mono font-bold">{Math.round(explodeVal * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={explodeVal}
              onChange={(e) => setExplodeVal(parseFloat(e.target.value))}
              className="w-full accent-[#C89D56] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#7A828A] mt-1 font-mono">
              <span>Closed Book</span>
              <span>Half Open</span>
              <span>Fully Separated</span>
            </div>
          </div>

          {/* Number of Copies */}
          <div className="bg-[#161B24] p-4 rounded-xl border border-[#232B3B]">
            <label className="text-xs font-technical text-[#F7F5F0] block mb-2 font-bold">
              NUMBER OF COPIES (PARTS)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {([2, 3, 4] as const).map((num) => (
                <button
                  key={num}
                  onClick={() => {
                    setParts(num);
                    if (num === 2) setActiveSheetInfo('Top: White CB / Duplicate: Pink CF');
                    if (num === 3) setActiveSheetInfo('Top: White CB / Mid: Pink CFB / Bottom: Yellow CF');
                    if (num === 4) setActiveSheetInfo('Top: White / Mid 1: Pink / Mid 2: Yellow / Bot: Blue');
                  }}
                  className={`py-2 px-3 rounded-lg text-xs font-medium border transition-all ${
                    parts === num
                      ? 'bg-[#C89D56] text-[#0E1116] border-[#C89D56] font-bold shadow-md'
                      : 'bg-[#12161F] text-[#858E9B] border-[#232B3B] hover:text-[#F7F5F0]'
                  }`}
                >
                  {num === 2 && '2-Part Duplicate'}
                  {num === 3 && '3-Part Triplicate'}
                  {num === 4 && '4-Part Quad'}
                </button>
              ))}
            </div>
          </div>

          {/* Binding Style */}
          <div className="bg-[#161B24] p-4 rounded-xl border border-[#232B3B]">
            <label className="text-xs font-technical text-[#F7F5F0] block mb-2 font-bold">
              SPINE BINDING TYPE
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'cloth-tape', label: 'Cloth Spine Tape' },
                { id: 'hardbound', label: 'Hardbound Cover' },
                { id: 'pad-glued', label: 'Glued Pad' },
              ].map((b) => (
                <button
                  key={b.id}
                  onClick={() => setBinding(b.id as any)}
                  className={`py-2 px-2 rounded-lg text-xs text-center border transition-all ${
                    binding === b.id
                      ? 'bg-[#232B3B] text-[#C89D56] border-[#C89D56] font-bold'
                      : 'bg-[#12161F] text-[#858E9B] border-[#232B3B]'
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Specifications Box */}
          <div className="p-4 rounded-xl bg-[#161B24] border border-[#232B3B] space-y-2">
            <div className="text-xs font-bold text-[#F7F5F0]">
              Need Custom Bill Book Formats or Consecutively Numbered Books?
            </div>
            <div className="text-xs text-[#858E9B]">
              Configure custom paper sizes (A4, 1/4th foolscap, 1/6th memo), carbonless NCR color sequences, and micro-perforations.
            </div>
            <div className="pt-1">
              <a
                href="#rfq-section"
                className="inline-flex items-center px-3.5 py-1.5 rounded-lg bg-[#C89D56] hover:bg-[#E2BC7A] text-[#0E1116] font-bold text-xs transition-colors"
              >
                Configure in RFQ &rarr;
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
