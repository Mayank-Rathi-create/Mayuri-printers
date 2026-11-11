import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { createTextbookCoverTexture, createPaperGrainTexture } from '../../utils/textureGenerators';
import { BookOpen, Bookmark } from 'lucide-react';

type BindingType = 'saddle-stitch' | 'perfect-bound' | 'hardcover-casebound';

export const TextbookBinding3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [binding, setBinding] = useState<BindingType>('hardcover-casebound');
  const [pageSpread, setPageSpread] = useState(0.25); // 0 (closed) to 1 (wide open)
  const [paperGsm] = useState<54 | 70 | 80>(70);
  const [viewPreset, setViewPreset] = useState<'cover' | 'spine' | 'open'>('open');

  const rootGroupRef = useRef<THREE.Group | null>(null);

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
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    container.appendChild(renderer.domElement);

    // 2. Lights
    const ambientLight = new THREE.AmbientLight('#FFFFFF', 0.95);
    scene.add(ambientLight);

    const spotLight = new THREE.SpotLight('#FFF8E7', 3.5);
    spotLight.position.set(0, 3.5, 3.5);
    spotLight.castShadow = true;
    scene.add(spotLight);

    const rimLight = new THREE.DirectionalLight('#C89D56', 1.8);
    rimLight.position.set(-3, -1, 1);
    scene.add(rimLight);

    // 3. Book Assembly Centered at (0, 0, 0)
    const bookRoot = new THREE.Group();
    bookRoot.position.set(0, 0, 0);
    bookRoot.rotation.set(-0.25, 0.2, 0);
    scene.add(bookRoot);
    rootGroupRef.current = bookRoot;

    const paperBump = createPaperGrainTexture();
    const coverTex = createTextbookCoverTexture(
      'CURRICULUM TEXTBOOK WORKS',
      '35 Years of Printing Trust // Mayuri Printers',
      binding
    );

    const bookThickness = binding === 'hardcover-casebound' ? 0.35 : binding === 'perfect-bound' ? 0.25 : 0.08;
    const spineColor = binding === 'hardcover-casebound' ? '#0E1724' : binding === 'perfect-bound' ? '#24142D' : '#16283B';

    const halfWidth = 1.35;
    const height = 1.95;

    const pageMat = new THREE.MeshStandardMaterial({
      color: paperGsm === 54 ? '#FAF6ED' : '#FFFFFF',
      roughness: 0.95,
      bumpMap: paperBump,
      bumpScale: 0.001,
      side: THREE.DoubleSide,
    });

    const coverMat = new THREE.MeshStandardMaterial({
      map: coverTex,
      bumpMap: paperBump,
      bumpScale: 0.003,
      roughness: 0.5,
      metalness: 0.1,
    });

    // Left Wing
    const leftWing = new THREE.Group();
    leftWing.position.set(0, 0, 0);

    const leftCoverGeo = new THREE.BoxGeometry(halfWidth, height, bookThickness * 0.4);
    const leftCoverMesh = new THREE.Mesh(leftCoverGeo, [
      new THREE.MeshStandardMaterial({ color: spineColor }),
      new THREE.MeshStandardMaterial({ color: spineColor }),
      pageMat, pageMat,
      pageMat,
      coverMat,
    ]);
    leftCoverMesh.position.set(-halfWidth / 2, 0, -bookThickness * 0.2);
    leftWing.add(leftCoverMesh);
    bookRoot.add(leftWing);

    // Right Wing
    const rightWing = new THREE.Group();
    rightWing.position.set(0, 0, 0);

    const rightCoverGeo = new THREE.BoxGeometry(halfWidth, height, bookThickness * 0.4);
    const rightCoverMesh = new THREE.Mesh(rightCoverGeo, [
      new THREE.MeshStandardMaterial({ color: spineColor }),
      new THREE.MeshStandardMaterial({ color: spineColor }),
      pageMat, pageMat,
      coverMat,
      pageMat,
    ]);
    rightCoverMesh.position.set(halfWidth / 2, 0, -bookThickness * 0.2);
    rightWing.add(rightCoverMesh);
    bookRoot.add(rightWing);

    // Spine Mesh (Clean Vertical Book Spine)
    const spineGeo = new THREE.CylinderGeometry(bookThickness * 0.35, bookThickness * 0.35, height, 24, 1, false, -Math.PI / 2, Math.PI);
    const spineMat = new THREE.MeshStandardMaterial({ color: spineColor, roughness: 0.6 });
    const spineMesh = new THREE.Mesh(spineGeo, spineMat);
    spineMesh.rotation.y = Math.PI / 2;
    spineMesh.position.set(0, 0, -bookThickness * 0.25);
    bookRoot.add(spineMesh);

    // 4. Drag / Rotate Logic
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

      bookRoot.rotation.y += dx * 0.008;
      bookRoot.rotation.x += dy * 0.008;
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

      const angle = pageSpread * (Math.PI * 0.48);
      leftWing.rotation.y = THREE.MathUtils.lerp(leftWing.rotation.y, angle, 0.08);
      rightWing.rotation.y = THREE.MathUtils.lerp(rightWing.rotation.y, -angle, 0.08);

      if (viewPreset === 'spine') {
        camera.position.lerp(new THREE.Vector3(0, 0, -3.6), 0.06);
        camera.lookAt(0, 0, 0);
      } else if (viewPreset === 'cover') {
        camera.position.lerp(new THREE.Vector3(1.1, 0.2, 3.6), 0.06);
        camera.lookAt(0.3, 0, 0);
      } else {
        camera.position.lerp(new THREE.Vector3(0, 0.1, 4.0), 0.06);
        camera.lookAt(0, 0, 0);
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
  }, [binding, pageSpread, paperGsm, viewPreset]);

  return (
    <div className="bg-[#12161F] rounded-3xl border border-[#232B3B] p-6 lg:p-8 shadow-xl">
      <div className="flex flex-col lg:flex-row items-start justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#C89D56]/15 border border-[#C89D56]/30 text-[#C89D56] text-xs font-technical font-bold mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>35 YEARS HERITAGE // EDUCATIONAL TEXTBOOKS & BINDING</span>
          </div>
          <h3 className="text-2xl font-editorial font-bold text-[#F7F5F0]">
            Curriculum Textbooks & High-Volume Academic Publishing
          </h3>
          <p className="text-xs sm:text-sm text-[#858E9B] mt-1 max-w-xl">
            Smyth-sewn thread signatures guaranteed to lay flat. Durable thermal PUR spine squaring built for university curricula.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs font-technical bg-[#161B24] px-3 py-1.5 rounded-lg border border-[#232B3B] text-[#C89D56]">
            Smyth-Sewn & Casebound Hardcover
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

          {/* View angle presets */}
          <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-[#0E1116]/90 backdrop-blur-md p-1 rounded-xl border border-[#232B3B]">
            {[
              { id: 'open', label: 'Open Spread' },
              { id: 'cover', label: 'Front Cover' },
              { id: 'spine', label: 'Spine View' },
            ].map((v) => (
              <button
                key={v.id}
                onClick={() => setViewPreset(v.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  viewPreset === v.id
                    ? 'bg-[#C89D56] text-[#0E1116] font-bold'
                    : 'text-[#858E9B] hover:text-[#F7F5F0]'
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>

          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
            <div className="bg-[#0E1116]/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-[#232B3B] text-xs text-[#F7F5F0]">
              <span className="text-[#C89D56] font-bold">Binding:</span>{' '}
              {binding === 'hardcover-casebound' && 'Hardcover Smyth-Sewn Thread (Lay-Flat)'}
              {binding === 'perfect-bound' && 'Thermal Perfect Bound Softcover'}
              {binding === 'saddle-stitch' && 'Saddle-Stitch Wire Staple'}
            </div>
          </div>
        </div>

        {/* Simplified Controls */}
        <div className="lg:col-span-5 space-y-4">
          {/* Binding Selector */}
          <div className="bg-[#161B24] p-4 rounded-xl border border-[#232B3B]">
            <label className="text-xs font-technical text-[#F7F5F0] block mb-2 font-bold">
              SELECT BINDING METHOD
            </label>
            <div className="space-y-2">
              {[
                {
                  id: 'hardcover-casebound',
                  title: 'Hardcover Smyth-Sewn',
                  desc: 'Thread sewn signatures with hardcover binder board. Lay-flat reading.',
                },
                {
                  id: 'perfect-bound',
                  title: 'Softcover Perfect Bound',
                  desc: 'High-adhesion thermal glue spine for paperbacks.',
                },
                {
                  id: 'saddle-stitch',
                  title: 'Saddle-Stitch Staple',
                  desc: 'Wire stapling for school exercise books and examination booklets.',
                },
              ].map((b) => (
                <button
                  key={b.id}
                  onClick={() => setBinding(b.id as BindingType)}
                  className={`w-full text-left p-2.5 rounded-lg border transition-all ${
                    binding === b.id
                      ? 'bg-[#232B3B] text-[#F7F5F0] border-[#C89D56] font-semibold shadow-md'
                      : 'bg-[#12161F] text-[#858E9B] border-[#232B3B]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#C89D56]">{b.title}</span>
                    {binding === b.id && <Bookmark className="w-3.5 h-3.5 text-[#C89D56]" />}
                  </div>
                  <p className="text-[11px] text-[#858E9B] mt-0.5">{b.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Book Open Spread Slider */}
          <div className="bg-[#161B24] p-4 rounded-xl border border-[#232B3B]">
            <div className="flex items-center justify-between text-xs font-technical mb-2">
              <span className="text-[#F7F5F0] font-bold">FAN OPEN BOOK SPREAD</span>
              <span className="text-[#C89D56] font-mono font-bold">{Math.round(pageSpread * 180)}°</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.02"
              value={pageSpread}
              onChange={(e) => setPageSpread(parseFloat(e.target.value))}
              className="w-full accent-[#C89D56] cursor-pointer"
            />
          </div>

          <div className="pt-2">
            <a
              href="#rfq-section"
              className="w-full block text-center py-2.5 px-4 rounded-xl bg-[#C89D56] hover:bg-[#E2BC7A] text-[#0E1116] font-bold text-xs transition-all shadow-lg"
            >
              Request Textbook & Publication Quote
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
