'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import {
  Sparkles,
  Upload,
  Save,
  Eye,
  Sliders,
  Move,
  Type,
  Maximize2,
  RefreshCw,
  QrCode,
  User,
  Shield,
  Loader2,
  Trash2,
  EyeOff,
  Plus,
} from 'lucide-react';
import { DEFAULT_CARD_TEMPLATE, CardElementConfig } from '@/lib/card-types';

const ASPECT_RATIO_PRESETS = [
  { label: 'CR80 ID Card (85.60 : 53.98)', value: '85.60:53.98', w: 1050, h: 660 },
  { label: 'Standard 16:9', value: '16:9', w: 1280, h: 720 },
  { label: 'Photo 3:2', value: '3:2', w: 1200, h: 800 },
  { label: 'Classic 4:3', value: '4:3', w: 1024, h: 768 },
  { label: 'Square 1:1', value: '1:1', w: 800, h: 800 },
  { label: 'Vertical Story 9:16', value: '9:16', w: 720, h: 1280 },
];

export default function CardStudioPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [tiers, setTiers] = useState<any[]>([]);
  const [selectedTierId, setSelectedTierId] = useState<string>('');

  const [mounted, setMounted] = useState(false);
  const [aspectRatio, setAspectRatio] = useState('85.60:53.98');
  const [canvasWidth, setCanvasWidth] = useState(1050);
  const [canvasHeight, setCanvasHeight] = useState(660);
  const [elements, setElements] = useState<CardElementConfig[]>(DEFAULT_CARD_TEMPLATE.elements);
  const [selectedElementId, setSelectedElementId] = useState<string | null>('name-1');
  const [baseDesignUrl, setBaseDesignUrl] = useState<string | null>(null);

  const [saving, setSaving] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const dragStartRef = useRef<{ startX: number; startY: number; initialElX: number; initialElY: number; initialW?: number; initialH?: number }>({
    startX: 0,
    startY: 0,
    initialElX: 0,
    initialElY: 0,
  });

  const [testMember, setTestMember] = useState({
    name: 'ABEBE KEBEDE',
    code: 'EM-2026-0042',
    tierName: 'Gold',
    issuedDate: 'Sep 11, 2026',
  });

  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    async function checkAuth() {
      const authRes = await fetch('/api/auth/me');
      if (!authRes.ok) {
        router.push('/admin/login');
        return;
      }
      const authData = await authRes.json();
      setCurrentUser(authData.user);

      // Load tiers
      const tRes = await fetch('/api/tiers');
      if (tRes.ok) {
        const d = await tRes.json();
        setTiers(d.tiers || []);
        if (d.tiers?.length > 0) {
          setSelectedTierId(d.tiers[0].id);
        }
      }
    }
    checkAuth();
  }, [router]);

  // Load existing template when tier changes
  useEffect(() => {
    if (!selectedTierId) return;
    async function loadTemplate() {
      try {
        const res = await fetch(`/api/admin/card-templates?tierId=${selectedTierId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.templates?.length > 0) {
            const t = data.templates[0];
            setCanvasWidth(t.width);
            setCanvasHeight(t.height);
            setAspectRatio(t.aspectRatio);
            setBaseDesignUrl(t.baseDesignUrl || null);
            if (Array.isArray(t.layoutConfig)) {
              setElements(t.layoutConfig);
            }
          }
        }
      } catch (err) {
        console.error('Failed to load card template:', err);
      }
    }
    loadTemplate();
  }, [selectedTierId]);

  const selectedElement = elements.find((el) => el.id === selectedElementId);

  const updateElement = (id: string, updates: Partial<CardElementConfig>) => {
    setElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, ...updates } : el))
    );
  };

  const deleteElement = (id: string) => {
    if (confirm('Delete this dynamic element from card?')) {
      setElements((prev) => prev.filter((el) => el.id !== id));
      if (selectedElementId === id) setSelectedElementId(null);
    }
  };

  const addNewElement = (type: CardElementConfig['type'], label: string) => {
    const newId = `${type}-${Date.now()}`;
    const newEl: CardElementConfig = {
      id: newId,
      type,
      label,
      x: 30,
      y: 30,
      fontSize: 20,
      fontWeight: 'bold',
      color: '#FFFFFF',
      width: type === 'qr' || type === 'photo' ? 120 : undefined,
      height: type === 'qr' || type === 'photo' ? 120 : undefined,
      visible: true,
      customText: type === 'customText' ? 'CUSTOM LABEL' : undefined,
    };
    setElements((prev) => [...prev, newEl]);
    setSelectedElementId(newId);
  };

  // Drag-to-Move Mouse Handlers
  const handleMouseDown = (e: React.MouseEvent, el: CardElementConfig) => {
    e.stopPropagation();
    setSelectedElementId(el.id);
    setIsDragging(true);
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialElX: el.x,
      initialElY: el.y,
    };
  };

  // Resize Mouse Handlers
  const handleResizeDown = (e: React.MouseEvent, el: CardElementConfig) => {
    e.stopPropagation();
    setSelectedElementId(el.id);
    setIsResizing(true);
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialElX: el.x,
      initialElY: el.y,
      initialW: typeof el.width === 'number' ? el.width : 25,
      initialH: typeof el.height === 'number' ? el.height : 25,
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!canvasRef.current || !selectedElementId) return;
      const rect = canvasRef.current.getBoundingClientRect();

      if (isDragging) {
        const deltaX = ((e.clientX - dragStartRef.current.startX) / rect.width) * 100;
        const deltaY = ((e.clientY - dragStartRef.current.startY) / rect.height) * 100;

        const newX = Math.max(0, Math.min(85, Math.round(dragStartRef.current.initialElX + deltaX)));
        const newY = Math.max(0, Math.min(85, Math.round(dragStartRef.current.initialElY + deltaY)));

        updateElement(selectedElementId, { x: newX, y: newY });
      } else if (isResizing) {
        const deltaPctX = ((e.clientX - dragStartRef.current.startX) / rect.width) * 100;
        const baseW = dragStartRef.current.initialW || 25;
        const newW = Math.max(5, Math.min(80, Math.round((baseW + deltaPctX) * 10) / 10));
        const newFontSize = Math.max(12, Math.min(64, Math.round(newW * 1.2)));

        updateElement(selectedElementId, {
          width: newW,
          height: newW,
          fontSize: selectedElement?.fontSize ? newFontSize : undefined,
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, selectedElementId, selectedElement]);

  const handlePresetChange = (presetVal: string) => {
    setAspectRatio(presetVal);
    const p = ASPECT_RATIO_PRESETS.find((x) => x.value === presetVal);
    if (p) {
      setCanvasWidth(p.w);
      setCanvasHeight(p.h);
    }
  };

  const handleBaseDesignUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.onload = () => {
        setBaseDesignUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveTemplate = async () => {
    if (!selectedTierId) return;
    setSaving(true);
    try {
      const payload = {
        tierId: selectedTierId,
        width: canvasWidth,
        height: canvasHeight,
        aspectRatio,
        baseDesignUrl,
        layoutConfig: elements,
      };

      const res = await fetch('/api/admin/card-templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save template');

      alert('Card design template successfully saved and published for this tier!');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex">
      <AdminSidebar userRole={currentUser?.role} userName={currentUser?.name} />

      <main className="flex-1 p-6 sm:p-10 overflow-y-auto max-h-screen">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
              Card Editing Studio & Visual Builder
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Drag on canvas to position elements, resize handles, delete or hide layers, and export high-DPI templates.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Select Tier */}
            <select
              suppressHydrationWarning
              value={selectedTierId}
              onChange={(e) => setSelectedTierId(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-amber-400 focus:outline-none focus:border-amber-400"
            >
              {tiers.map((t) => (
                <option key={t.id} value={t.id}>
                  Tier: {t.name}
                </option>
              ))}
            </select>

            <button
              suppressHydrationWarning
              type="button"
              disabled={saving}
              onClick={handleSaveTemplate}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Save & Publish Template</span>
            </button>
          </div>
        </div>

        {/* Studio Workspace Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Visual Card Canvas Preview (3 cols) */}
          <div className="xl:col-span-3 space-y-6">
            {/* Top Toolbar */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-3">
                <span className="text-slate-400 font-semibold uppercase">Aspect Ratio:</span>
                <select
                  suppressHydrationWarning
                  value={aspectRatio}
                  onChange={(e) => handlePresetChange(e.target.value)}
                  className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-amber-400"
                >
                  {ASPECT_RATIO_PRESETS.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Upload Custom Base Graphic */}
              <label className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer border border-slate-700 transition-colors">
                <Upload className="w-3.5 h-3.5 text-amber-400" />
                <span>Upload Custom Artwork (PNG, SVG, JPG)</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBaseDesignUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Live Interactive Drag-and-Drop Canvas Box */}
            <div className="p-8 rounded-3xl bg-slate-950 border-2 border-dashed border-slate-800 flex items-center justify-center overflow-auto min-h-[500px]">
              <div
                ref={canvasRef}
                style={{
                  aspectRatio: aspectRatio.replace(':', '/'),
                  width: '100%',
                  maxWidth: '750px',
                  backgroundImage: baseDesignUrl ? `url(${baseDesignUrl})` : undefined,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
                className={`relative rounded-3xl overflow-hidden shadow-2xl border-2 border-amber-500/40 select-none ${
                  !baseDesignUrl ? 'bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950' : ''
                }`}
              >
                {/* Visual Guidelines */}
                <div className="absolute inset-4 border border-amber-500/20 rounded-2xl pointer-events-none" />

                {/* Render Draggable / Configurable Dynamic Fields */}
                {elements.map((el) => {
                  if (el.visible === false) return null;
                  const isSelected = selectedElementId === el.id;
                  const isCentered = el.align === 'center';
                  const isPhotoOrQr = el.type === 'photo' || el.type === 'qr';
                  const widthStyle = el.width !== undefined
                    ? typeof el.width === 'number' && el.width <= 100
                      ? `${el.width}%`
                      : `${el.width}px`
                    : undefined;
                  const heightStyle = isPhotoOrQr
                    ? undefined
                    : el.height !== undefined
                      ? typeof el.height === 'number' && el.height <= 100
                        ? `${el.height}%`
                        : `${el.height}px`
                      : undefined;

                  return (
                    <div
                      key={el.id}
                      onMouseDown={(e) => handleMouseDown(e, el)}
                      style={{
                        position: 'absolute',
                        left: `${el.x}%`,
                        top: `${el.y}%`,
                        width: widthStyle,
                        height: heightStyle,
                        aspectRatio: isPhotoOrQr ? '1 / 1' : undefined,
                        transform: isCentered ? 'translate(-50%, 0)' : undefined,
                        color: el.color || '#FFFFFF',
                        fontFamily: el.fontFamily || 'sans-serif',
                        fontSize: `${(el.fontSize || 20) * 0.75}px`,
                        fontWeight: el.fontWeight || 'normal',
                        opacity: el.opacity ?? 1,
                        textAlign: el.align || 'left',
                        cursor: isDragging ? 'grabbing' : 'grab',
                        zIndex: isPhotoOrQr ? 10 : 20,
                        whiteSpace: el.type === 'name' || el.type === 'memberId' || el.type === 'tier' ? 'nowrap' : undefined,
                      }}
                      className={`group p-1.5 transition-shadow rounded ${
                        isSelected
                          ? 'ring-2 ring-amber-400 bg-amber-500/15 shadow-xl'
                          : 'hover:ring-1 hover:ring-amber-400/50'
                      }`}
                    >
                      {/* Element Body */}
                      {el.type === 'logo' && (
                        <span className="font-extrabold tracking-wider">{el.customText || 'ESHETU MELESE'}</span>
                      )}
                      {el.type === 'name' && (
                        <span className="font-extrabold tracking-tight">{testMember.name}</span>
                      )}
                      {el.type === 'tier' && (
                        <span className="font-bold uppercase text-amber-400">
                          {tiers.find((t) => t.id === selectedTierId)?.name || 'GOLD'} MEMBER
                        </span>
                      )}
                      {el.type === 'memberId' && (
                        <span className="font-mono">{testMember.code}</span>
                      )}
                      {el.type === 'issueDate' && (
                        <span className="text-xs">ISSUED: {testMember.issuedDate}</span>
                      )}
                      {el.type === 'customText' && (
                        <span className="font-semibold">{el.customText || 'CUSTOM TEXT'}</span>
                      )}
                      {el.type === 'qr' && (
                        <div
                          style={{ width: '100%', height: '100%', aspectRatio: '1 / 1' }}
                          className="bg-white p-2 rounded-2xl shadow-md flex items-center justify-center"
                        >
                          <QrCode className="w-full h-full text-slate-950" />
                        </div>
                      )}
                      {el.type === 'photo' && (
                        <div
                          style={{ width: '100%', height: '100%', aspectRatio: '1 / 1' }}
                          className="rounded-full border-2 border-slate-900/60 bg-slate-800 flex items-center justify-center shadow-lg overflow-hidden"
                        >
                          <User className="w-1/2 h-1/2 text-amber-400" />
                        </div>
                      )}

                      {/* Resize Handle Button */}
                      {isSelected && (
                        <div
                          onMouseDown={(e) => handleResizeDown(e, el)}
                          className="absolute -right-2 -bottom-2 w-5 h-5 bg-amber-500 text-slate-950 rounded-full flex items-center justify-center cursor-se-resize shadow-md"
                          title="Drag to resize"
                        >
                          <Maximize2 className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>&bull; Click and drag any element on the card to move &bull; Drag bottom-right corner to resize</span>
              <span className="font-mono">Canvas: {canvasWidth} &times; {canvasHeight} px</span>
            </div>
          </div>

          {/* Element Inspector & Position Controls (1 col) */}
          <div className="space-y-6">
            {/* Dynamic Elements Selector */}
            <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-amber-400" />
                  <span>Card Elements</span>
                </h3>

                <button
                  suppressHydrationWarning
                  type="button"
                  onClick={() => addNewElement('customText', 'Custom Text Label')}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-xs font-bold"
                  title="Add Custom Text"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>

              <div className="space-y-2">
                {elements.map((el) => {
                  const isSelected = selectedElementId === el.id;
                  return (
                    <div
                      key={el.id}
                      onClick={() => setSelectedElementId(el.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                          : 'bg-slate-950 border border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{el.label}</span>
                        {el.visible === false && (
                          <span className="text-[10px] text-rose-400 font-bold">(Hidden)</span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <button
                          suppressHydrationWarning
                          type="button"
                          onClick={() => updateElement(el.id, { visible: el.visible === false ? true : false })}
                          className={`p-1 rounded ${isSelected ? 'text-slate-950 hover:bg-amber-600/30' : 'text-slate-400 hover:text-white'}`}
                          title={el.visible === false ? 'Show Element' : 'Hide Element'}
                        >
                          {el.visible === false ? <EyeOff className="w-3.5 h-3.5 text-rose-400" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>

                        <button
                          suppressHydrationWarning
                          type="button"
                          onClick={() => deleteElement(el.id)}
                          className={`p-1 rounded ${isSelected ? 'text-slate-950 hover:text-rose-900' : 'text-slate-500 hover:text-rose-400'}`}
                          title="Delete Element"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Position & Typography Sliders for Selected Element */}
            {selectedElement && (
              <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="font-bold text-slate-200">{selectedElement.label}</span>
                  <button
                    suppressHydrationWarning
                    type="button"
                    onClick={() => deleteElement(selectedElement.id)}
                    className="flex items-center gap-1 text-rose-400 hover:text-rose-300 text-[11px] font-bold"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Delete</span>
                  </button>
                </div>

                {selectedElement.type === 'customText' && (
                  <div>
                    <label className="block text-slate-400 mb-1">Custom Text String</label>
                    <input
                      suppressHydrationWarning
                      type="text"
                      value={selectedElement.customText || ''}
                      onChange={(e) => updateElement(selectedElement.id, { customText: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>
                )}

                {/* X Position Slider */}
                <div>
                  <div className="flex justify-between text-slate-400 mb-1">
                    <span>X Position</span>
                    <span className="font-mono font-bold text-amber-400">{selectedElement.x}%</span>
                  </div>
                  <input
                    suppressHydrationWarning
                    type="range"
                    min="0"
                    max="90"
                    value={selectedElement.x}
                    onChange={(e) => updateElement(selectedElement.id, { x: parseInt(e.target.value) })}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>

                {/* Y Position Slider */}
                <div>
                  <div className="flex justify-between text-slate-400 mb-1">
                    <span>Y Position</span>
                    <span className="font-mono font-bold text-amber-400">{selectedElement.y}%</span>
                  </div>
                  <input
                    suppressHydrationWarning
                    type="range"
                    min="0"
                    max="90"
                    value={selectedElement.y}
                    onChange={(e) => updateElement(selectedElement.id, { y: parseInt(e.target.value) })}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>

                {/* Alignment */}
                <div>
                  <label className="block text-slate-400 mb-1">Alignment</label>
                  <select
                    suppressHydrationWarning
                    value={selectedElement.align || 'left'}
                    onChange={(e) => updateElement(selectedElement.id, { align: e.target.value as 'left' | 'center' | 'right' })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-amber-400"
                  >
                    <option value="left">Left</option>
                    <option value="center">Center</option>
                    <option value="right">Right</option>
                  </select>
                </div>

                {/* Size / Width (for photo, qr, or any resizable element) */}
                {selectedElement.width !== undefined && (
                  <div>
                    <div className="flex justify-between text-slate-400 mb-1">
                      <span>Size / Width</span>
                      <span className="font-mono font-bold text-amber-400">{selectedElement.width}%</span>
                    </div>
                    <input
                      suppressHydrationWarning
                      type="range"
                      min="5"
                      max="60"
                      value={selectedElement.width}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        updateElement(selectedElement.id, { width: val, height: val });
                      }}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                  </div>
                )}

                {/* Font Size (if text) */}
                {selectedElement.fontSize !== undefined && (
                  <div>
                    <div className="flex justify-between text-slate-400 mb-1">
                      <span>Font Size</span>
                      <span className="font-mono font-bold text-amber-400">{selectedElement.fontSize}px</span>
                    </div>
                    <input
                      suppressHydrationWarning
                      type="range"
                      min="12"
                      max="64"
                      value={selectedElement.fontSize}
                      onChange={(e) =>
                        updateElement(selectedElement.id, { fontSize: parseInt(e.target.value) })
                      }
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                  </div>
                )}

                {/* Color */}
                {selectedElement.color && (
                  <div>
                    <span className="block text-slate-400 mb-1">Text Color</span>
                    <div className="flex items-center gap-3">
                      <input
                        suppressHydrationWarning
                        type="color"
                        value={selectedElement.color}
                        onChange={(e) => updateElement(selectedElement.id, { color: e.target.value })}
                        className="w-10 h-8 rounded-lg bg-slate-950 border border-slate-700 cursor-pointer"
                      />
                      <span className="font-mono text-slate-300 uppercase">{selectedElement.color}</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
