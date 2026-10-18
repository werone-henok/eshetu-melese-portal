'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import {
  Award,
  Upload,
  Save,
  RotateCcw,
  Eye,
  EyeOff,
  Trash2,
  Plus,
  Loader2,
  User,
  QrCode,
  Calendar,
  Hash,
  Type,
  Maximize2,
  Sparkles,
  Check,
} from 'lucide-react';
import {
  CertificateElementConfig,
  CertificateTemplateConfig,
  CERTIFICATE_PRESETS,
  DEFAULT_CERTIFICATE_TEMPLATE,
} from '@/lib/certificate-types';
import { CertificateCanvas } from '@/components/certificate/CertificateCanvas';

export default function CertificateStudioPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Template State
  const [aspectRatio, setAspectRatio] = useState('1024:712');
  const [canvasWidth, setCanvasWidth] = useState(1024);
  const [canvasHeight, setCanvasHeight] = useState(712);
  const [baseDesignUrl, setBaseDesignUrl] = useState<string | null>(DEFAULT_CERTIFICATE_TEMPLATE.baseDesignUrl || null);
  const [elements, setElements] = useState<CertificateElementConfig[]>(DEFAULT_CERTIFICATE_TEMPLATE.elements);
  const [selectedElementId, setSelectedElementId] = useState<string | null>('name-1');

  // Dragging & Resizing State
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const canvasBoxRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<{
    startX: number;
    startY: number;
    initialElX: number;
    initialElY: number;
    initialW?: number;
    initialH?: number;
  }>({
    startX: 0,
    startY: 0,
    initialElX: 0,
    initialElY: 0,
  });

  // Test Member Data for live preview
  const [testMember, setTestMember] = useState({
    fullName: 'ABEBE KEBEDE',
    membershipCode: 'DT-2026-0042',
    tierName: 'Gold',
    photoUrl: '/donkey-tube-logo.png',
    approvedAt: '2026-09-11',
  });

  // 1. Authenticate & Load Active Template
  useEffect(() => {
    setMounted(true);
    async function init() {
      try {
        const authRes = await fetch('/api/auth/me');
        if (!authRes.ok) {
          router.push('/admin/login');
          return;
        }
        const authData = await authRes.json();
        setCurrentUser(authData.user);

        // Fetch current saved template
        const tplRes = await fetch('/api/admin/certificate-template');
        if (tplRes.ok) {
          const data = await tplRes.json();
          if (data.template) {
            const t = data.template;
            setCanvasWidth(t.width || 1024);
            setCanvasHeight(t.height || 712);
            setAspectRatio(t.aspectRatio || '1024:712');
            setBaseDesignUrl(t.baseDesignUrl || DEFAULT_CERTIFICATE_TEMPLATE.baseDesignUrl);
            if (Array.isArray(t.elements) && t.elements.length > 0) {
              setElements(t.elements);
            }
          }
        }
      } catch (err) {
        console.error('Failed to init Certificate Studio:', err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [router]);

  const selectedElement = elements.find((el) => el.id === selectedElementId);

  const updateElement = (id: string, updates: Partial<CertificateElementConfig>) => {
    setElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, ...updates } : el))
    );
  };

  const deleteElement = (id: string) => {
    if (confirm('Delete this dynamic element from the certificate?')) {
      setElements((prev) => prev.filter((el) => el.id !== id));
      if (selectedElementId === id) setSelectedElementId(null);
    }
  };

  const addNewElement = (type: CertificateElementConfig['type'], label: string) => {
    const newId = `${type}-${Date.now()}`;
    const newEl: CertificateElementConfig = {
      id: newId,
      type,
      label,
      x: 50,
      y: 50,
      fontSize: type === 'name' ? 28 : type === 'photo' ? undefined : 16,
      fontWeight: type === 'name' ? 'bold' : 'normal',
      color: type === 'name' ? '#1E1B18' : '#6B5B4D',
      align: 'center',
      width: type === 'photo' ? 14 : type === 'qr' ? 8 : undefined,
      height: type === 'photo' ? 20 : type === 'qr' ? 10 : undefined,
      borderRadius: type === 'photo' ? 4 : undefined,
      visible: true,
      customText: type === 'customText' ? 'CUSTOM CERTIFICATE TEXT' : undefined,
    };
    setElements((prev) => [...prev, newEl]);
    setSelectedElementId(newId);
  };

  // Mouse Drag Handler
  const handleMouseDown = (e: React.MouseEvent, el: CertificateElementConfig) => {
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

  // Resize Handler
  const handleResizeDown = (e: React.MouseEvent, el: CertificateElementConfig) => {
    e.stopPropagation();
    setSelectedElementId(el.id);
    setIsResizing(true);
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialElX: el.x,
      initialElY: el.y,
      initialW: typeof el.width === 'number' ? el.width : 15,
      initialH: typeof el.height === 'number' ? el.height : 20,
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!canvasBoxRef.current || !selectedElementId) return;
      const rect = canvasBoxRef.current.getBoundingClientRect();

      if (isDragging) {
        const deltaX = ((e.clientX - dragStartRef.current.startX) / rect.width) * 100;
        const deltaY = ((e.clientY - dragStartRef.current.startY) / rect.height) * 100;

        const newX = Math.max(0, Math.min(100, Math.round((dragStartRef.current.initialElX + deltaX) * 10) / 10));
        const newY = Math.max(0, Math.min(100, Math.round((dragStartRef.current.initialElY + deltaY) * 10) / 10));

        updateElement(selectedElementId, { x: newX, y: newY });
      } else if (isResizing) {
        const deltaPctX = ((e.clientX - dragStartRef.current.startX) / rect.width) * 100;
        const deltaPctY = ((e.clientY - dragStartRef.current.startY) / rect.height) * 100;

        const baseW = dragStartRef.current.initialW || 14;
        const baseH = dragStartRef.current.initialH || 20;

        const newW = Math.max(3, Math.min(70, Math.round((baseW + deltaPctX) * 10) / 10));
        const newH = Math.max(3, Math.min(70, Math.round((baseH + deltaPctY) * 10) / 10));

        updateElement(selectedElementId, { width: newW, height: newH });
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
  }, [isDragging, isResizing, selectedElementId]);

  // Template Upload
  const handleTemplateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setBaseDesignUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Save Template
  const handleSave = async () => {
    setSaving(true);
    setSaveSuccess(false);
    try {
      const payload: CertificateTemplateConfig = {
        width: canvasWidth,
        height: canvasHeight,
        aspectRatio,
        baseDesignUrl,
        backgroundColor: '#FFFDF9',
        elements,
      };

      const res = await fetch('/api/admin/certificate-template', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save certificate template');

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  // Reset Template to Tentative Default
  const handleResetToDefault = async () => {
    if (!confirm('Are you sure you want to reset the certificate template back to the original tentative design? Custom coordinates and graphics will be restored to default.')) {
      return;
    }

    setResetting(true);
    try {
      const res = await fetch('/api/admin/certificate-template', {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to reset template');

      setCanvasWidth(DEFAULT_CERTIFICATE_TEMPLATE.width);
      setCanvasHeight(DEFAULT_CERTIFICATE_TEMPLATE.height);
      setAspectRatio(DEFAULT_CERTIFICATE_TEMPLATE.aspectRatio);
      setBaseDesignUrl(DEFAULT_CERTIFICATE_TEMPLATE.baseDesignUrl || null);
      setElements(DEFAULT_CERTIFICATE_TEMPLATE.elements);
      setSelectedElementId('name-1');

      alert('Certificate template has been reset to the default tentative template!');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setResetting(false);
    }
  };

  const handlePresetChange = (presetVal: string) => {
    setAspectRatio(presetVal);
    const p = CERTIFICATE_PRESETS.find((x) => x.value === presetVal);
    if (p) {
      setCanvasWidth(p.w);
      setCanvasHeight(p.h);
    }
  };

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
      </div>
    );
  }

  const currentTemplate: CertificateTemplateConfig = {
    width: canvasWidth,
    height: canvasHeight,
    aspectRatio,
    baseDesignUrl,
    backgroundColor: '#FFFDF9',
    elements,
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex">
      <AdminSidebar userRole={currentUser?.role} userName={currentUser?.name} />

      <main className="flex-1 p-6 sm:p-10 overflow-y-auto max-h-screen">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Award className="w-5 h-5 text-amber-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-amber-500">
                CMS Certificate Builder
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
              Certificate of Acknowledgement Studio
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Drag elements to position, customize fonts & colors, upload replacement certificate artwork, or reset to defaults.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Reset to Default */}
            <button
              type="button"
              disabled={resetting || saving}
              onClick={handleResetToDefault}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900 hover:bg-rose-500/10 hover:border-rose-500/50 text-slate-300 hover:text-rose-400 text-xs font-semibold transition-all"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${resetting ? 'animate-spin' : ''}`} />
              <span>Reset to Default</span>
            </button>

            {/* Save & Publish */}
            <button
              type="button"
              disabled={saving}
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : saveSuccess ? (
                <Check className="w-4 h-4 text-emerald-950" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>{saveSuccess ? 'Saved & Published!' : 'Save & Publish Certificate'}</span>
            </button>
          </div>
        </div>

        {/* Workspace Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Main Visual Canvas (3 cols) */}
          <div className="xl:col-span-3 space-y-6">
            {/* Toolbar */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-3">
                <span className="text-slate-400 font-semibold uppercase">Aspect Ratio:</span>
                <select
                  value={aspectRatio}
                  onChange={(e) => handlePresetChange(e.target.value)}
                  className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-amber-400"
                >
                  {CERTIFICATE_PRESETS.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-3">
                {/* Upload Custom Certificate Artwork */}
                <label className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer border border-slate-700 transition-colors">
                  <Upload className="w-3.5 h-3.5 text-amber-400" />
                  <span>Upload Certificate Artwork (PNG, JPG)</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleTemplateUpload}
                    className="hidden"
                  />
                </label>

                {/* Remove Background / Clear */}
                {baseDesignUrl && (
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('Clear background artwork?')) setBaseDesignUrl(null);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-500/40 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear Graphic</span>
                  </button>
                )}
              </div>
            </div>

            {/* Interactive Visual Canvas Container */}
            <div className="p-6 sm:p-10 rounded-3xl bg-slate-950 border-2 border-dashed border-slate-800 flex items-center justify-center overflow-auto min-h-[550px]">
              <div
                ref={canvasBoxRef}
                className="w-full max-w-[850px] relative transition-all"
                onClick={() => setSelectedElementId(null)}
              >
                <CertificateCanvas
                  member={testMember}
                  template={currentTemplate}
                  interactive={true}
                  selectedElementId={selectedElementId}
                  onSelectElement={(id) => setSelectedElementId(id)}
                  onMouseDownElement={handleMouseDown}
                  onResizeDownElement={handleResizeDown}
                  isDragging={isDragging}
                />
              </div>
            </div>

            {/* Quick Test Member Controls */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Test Member Preview Controls</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Test Full Name</label>
                  <input
                    type="text"
                    value={testMember.fullName}
                    onChange={(e) => setTestMember({ ...testMember, fullName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Test Member Code</label>
                  <input
                    type="text"
                    value={testMember.membershipCode}
                    onChange={(e) => setTestMember({ ...testMember, membershipCode: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Test Tier</label>
                  <input
                    type="text"
                    value={testMember.tierName}
                    onChange={(e) => setTestMember({ ...testMember, tierName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Inspector & Tools Panel (1 col) */}
          <div className="space-y-6">
            {/* Selected Element Inspector */}
            {selectedElement ? (
              <div className="p-5 rounded-2xl bg-slate-900/90 border border-amber-500/30 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
                      Selected Layer
                    </span>
                    <h3 className="text-sm font-bold text-slate-100">{selectedElement.label}</h3>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      title={selectedElement.visible === false ? 'Show Layer' : 'Hide Layer'}
                      onClick={() =>
                        updateElement(selectedElement.id, {
                          visible: selectedElement.visible === false ? true : false,
                        })
                      }
                      className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-amber-400 transition-colors"
                    >
                      {selectedElement.visible === false ? (
                        <EyeOff className="w-4 h-4 text-rose-400" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>

                    <button
                      type="button"
                      title="Delete Layer"
                      onClick={() => deleteElement(selectedElement.id)}
                      className="p-1.5 rounded-lg hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Position Sliders */}
                <div className="space-y-3 text-xs">
                  <div>
                    <div className="flex justify-between text-slate-400 mb-1">
                      <span>Horizontal Position (X)</span>
                      <span className="font-mono text-amber-400">{selectedElement.x}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="0.5"
                      value={selectedElement.x}
                      onChange={(e) =>
                        updateElement(selectedElement.id, { x: parseFloat(e.target.value) })
                      }
                      className="w-full accent-amber-500"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-400 mb-1">
                      <span>Vertical Position (Y)</span>
                      <span className="font-mono text-amber-400">{selectedElement.y}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="0.5"
                      value={selectedElement.y}
                      onChange={(e) =>
                        updateElement(selectedElement.id, { y: parseFloat(e.target.value) })
                      }
                      className="w-full accent-amber-500"
                    />
                  </div>
                </div>

                {/* Size Controls for Photo / QR */}
                {(selectedElement.type === 'photo' || selectedElement.type === 'qr') && (
                  <div className="space-y-3 text-xs pt-2 border-t border-slate-800">
                    <div>
                      <div className="flex justify-between text-slate-400 mb-1">
                        <span>Width (% of canvas)</span>
                        <span className="font-mono text-amber-400">{selectedElement.width || 14}%</span>
                      </div>
                      <input
                        type="range"
                        min="4"
                        max="60"
                        step="0.5"
                        value={selectedElement.width || 14}
                        onChange={(e) =>
                          updateElement(selectedElement.id, { width: parseFloat(e.target.value) })
                        }
                        className="w-full accent-amber-500"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-slate-400 mb-1">
                        <span>Height (% of canvas)</span>
                        <span className="font-mono text-amber-400">{selectedElement.height || 20}%</span>
                      </div>
                      <input
                        type="range"
                        min="4"
                        max="60"
                        step="0.5"
                        value={selectedElement.height || 20}
                        onChange={(e) =>
                          updateElement(selectedElement.id, { height: parseFloat(e.target.value) })
                        }
                        className="w-full accent-amber-500"
                      />
                    </div>

                    {selectedElement.type === 'photo' && (
                      <div>
                        <div className="flex justify-between text-slate-400 mb-1">
                          <span>Frame Corner Radius</span>
                          <span className="font-mono text-amber-400">
                            {selectedElement.borderRadius === 50 ? 'Circle' : `${selectedElement.borderRadius || 4}%`}
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="50"
                          step="1"
                          value={selectedElement.borderRadius ?? 4}
                          onChange={(e) =>
                            updateElement(selectedElement.id, {
                              borderRadius: parseInt(e.target.value),
                            })
                          }
                          className="w-full accent-amber-500"
                        />
                        <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                          <span>Square (0%)</span>
                          <span>Frame (4%)</span>
                          <span>Circle (50%)</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Typography Controls for Text Elements */}
                {selectedElement.type !== 'photo' && selectedElement.type !== 'qr' && (
                  <div className="space-y-3 text-xs pt-2 border-t border-slate-800">
                    <div>
                      <div className="flex justify-between text-slate-400 mb-1">
                        <span>Font Size</span>
                        <span className="font-mono text-amber-400">{selectedElement.fontSize || 24}px</span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="72"
                        step="1"
                        value={selectedElement.fontSize || 24}
                        onChange={(e) =>
                          updateElement(selectedElement.id, { fontSize: parseInt(e.target.value) })
                        }
                        className="w-full accent-amber-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-slate-400 mb-1">Weight</label>
                        <select
                          value={selectedElement.fontWeight || 'bold'}
                          onChange={(e) =>
                            updateElement(selectedElement.id, { fontWeight: e.target.value })
                          }
                          className="w-full px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 text-xs focus:outline-none"
                        >
                          <option value="normal">Normal</option>
                          <option value="600">Semi-Bold</option>
                          <option value="bold">Bold</option>
                          <option value="800">Extra-Bold</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-slate-400 mb-1">Color</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={selectedElement.color || '#1E1B18'}
                            onChange={(e) =>
                              updateElement(selectedElement.id, { color: e.target.value })
                            }
                            className="w-8 h-8 rounded border-0 cursor-pointer bg-transparent"
                          />
                          <input
                            type="text"
                            value={selectedElement.color || '#1E1B18'}
                            onChange={(e) =>
                              updateElement(selectedElement.id, { color: e.target.value })
                            }
                            className="w-full px-2 py-1 rounded bg-slate-950 border border-slate-700 text-[11px] font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1">Text Alignment</label>
                      <div className="grid grid-cols-3 gap-1">
                        {(['left', 'center', 'right'] as const).map((align) => (
                          <button
                            key={align}
                            type="button"
                            onClick={() => updateElement(selectedElement.id, { align })}
                            className={`py-1 text-xs rounded uppercase font-semibold transition-colors ${
                              selectedElement.align === align
                                ? 'bg-amber-500 text-slate-950 font-bold'
                                : 'bg-slate-950 text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            {align}
                          </button>
                        ))}
                      </div>
                    </div>

                    {selectedElement.type === 'customText' && (
                      <div>
                        <label className="block text-slate-400 mb-1">Custom Text Content</label>
                        <textarea
                          rows={2}
                          value={selectedElement.customText || ''}
                          onChange={(e) =>
                            updateElement(selectedElement.id, { customText: e.target.value })
                          }
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 text-xs focus:outline-none"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-center text-xs text-slate-400">
                <Maximize2 className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="font-semibold text-slate-300">No Element Selected</p>
                <p className="text-[11px] mt-1 text-slate-500">
                  Click any element on the certificate canvas or in the layer list below to edit its position, font, or frame.
                </p>
              </div>
            )}

            {/* Add Dynamic Elements */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Add Dynamic Elements
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => addNewElement('name', 'Member Full Name')}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 transition-colors"
                >
                  <Type className="w-3.5 h-3.5 text-amber-400" />
                  <span className="font-semibold">+ Full Name</span>
                </button>

                <button
                  type="button"
                  onClick={() => addNewElement('photo', 'Member Photo')}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 transition-colors"
                >
                  <User className="w-3.5 h-3.5 text-amber-400" />
                  <span className="font-semibold">+ Photo</span>
                </button>

                <button
                  type="button"
                  onClick={() => addNewElement('memberId', 'Member ID')}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 transition-colors"
                >
                  <Hash className="w-3.5 h-3.5 text-amber-400" />
                  <span className="font-semibold">+ Member ID</span>
                </button>

                <button
                  type="button"
                  onClick={() => addNewElement('issueDate', 'Issue Date')}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 transition-colors"
                >
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  <span className="font-semibold">+ Issue Date</span>
                </button>

                <button
                  type="button"
                  onClick={() => addNewElement('qr', 'Verification QR')}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 transition-colors"
                >
                  <QrCode className="w-3.5 h-3.5 text-amber-400" />
                  <span className="font-semibold">+ QR Code</span>
                </button>

                <button
                  type="button"
                  onClick={() => addNewElement('customText', 'Custom Label')}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5 text-amber-400" />
                  <span className="font-semibold">+ Custom Text</span>
                </button>
              </div>
            </div>

            {/* Elements Layer List */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                All Layers ({elements.length})
              </h3>
              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                {elements.map((el) => {
                  const isSelected = selectedElementId === el.id;
                  return (
                    <div
                      key={el.id}
                      onClick={() => setSelectedElementId(el.id)}
                      className={`flex items-center justify-between p-2 rounded-xl text-xs cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                          : 'bg-slate-950/70 text-slate-300 hover:bg-slate-950 border border-slate-800/80'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        {el.type === 'photo' && <User className="w-3 h-3 text-amber-400 shrink-0" />}
                        {el.type === 'qr' && <QrCode className="w-3 h-3 text-amber-400 shrink-0" />}
                        {el.type === 'name' && <Type className="w-3 h-3 text-amber-400 shrink-0" />}
                        {el.type === 'memberId' && <Hash className="w-3 h-3 text-amber-400 shrink-0" />}
                        {el.type === 'issueDate' && <Calendar className="w-3 h-3 text-amber-400 shrink-0" />}
                        {el.type === 'customText' && <Type className="w-3 h-3 text-amber-400 shrink-0" />}
                        <span className="truncate">{el.label}</span>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateElement(el.id, { visible: el.visible === false ? true : false });
                          }}
                          className="p-1 hover:text-amber-400"
                        >
                          {el.visible === false ? (
                            <EyeOff className="w-3 h-3 text-rose-400" />
                          ) : (
                            <Eye className="w-3 h-3 text-slate-500" />
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
