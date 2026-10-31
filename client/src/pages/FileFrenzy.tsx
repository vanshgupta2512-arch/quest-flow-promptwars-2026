import React, { useState, useEffect } from 'react';
import {
  FolderOpen,
  DollarSign,
  Image as ImageIcon,
  Code,
  FileText,
  Trash2,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Zap,
  ArrowRight,
  RotateCcw,
  ShieldCheck
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { api } from '../services/api';
import { sound } from '../services/soundEffects';

interface FileItem {
  id: string;
  name: string;
  size: string;
  type: string;
  category: string;
  suggestedFolder: string;
  hash: string;
  isDuplicate: boolean;
  duplicateOf?: string;
  reason: string;
}

export const FileFrenzy: React.FC = () => {
  const { setPendingManifest } = useGame();
  const [files, setFiles] = useState<FileItem[]>([]);
  const [organized, setOrganized] = useState<Array<{ id: string; name: string; folder: string; isDuplicate: boolean }>>([]);
  const [activeFileId, setActiveFileId] = useState<string | null>(null);
  const [draggedFileId, setDraggedFileId] = useState<string | null>(null);
  const [dragOverFolder, setDragOverFolder] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  const folders = [
    { id: "Financial & Invoices", label: "Financial & Invoices", icon: DollarSign, color: "border-emerald-500/40 text-emerald-400 bg-emerald-950/30" },
    { id: "Media & Screenshots", label: "Media & Screenshots", icon: ImageIcon, color: "border-cyan-500/40 text-cyan-400 bg-cyan-950/30" },
    { id: "Code & Repositories", label: "Code & Repositories", icon: Code, color: "border-purple-500/40 text-purple-400 bg-purple-950/30" },
    { id: "Legal & Documents", label: "Legal & Documents", icon: FileText, color: "border-amber-500/40 text-amber-400 bg-amber-950/30" },
    { id: "Duplicates (To Purge)", label: "Duplicates (Purge)", icon: Trash2, color: "border-red-500/40 text-red-400 bg-red-950/30" }
  ];

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      const res = await api.getFiles();
      if (res?.files) {
        setFiles(res.files);
        if (res.files.length > 0) setActiveFileId(res.files[0].id);
      }
    } catch (e) {
      // ignore
    }
  };

  const currentUnorganized = files.filter(f => !organized.some(o => o.id === f.id));
  const activeFile = currentUnorganized.find(f => f.id === activeFileId) || currentUnorganized[0];

  const handleRouteFile = (fileItem: FileItem, targetFolder: string) => {
    sound.playSwipe();

    const isMatch = (fileItem.isDuplicate && targetFolder.includes('Duplicates')) ||
      (!fileItem.isDuplicate && fileItem.suggestedFolder === targetFolder);

    if (isMatch) {
      sound.playScore();
      setScore(prev => prev + 60);
    } else {
      setScore(prev => prev + 30);
    }

    const nextOrganized = [
      ...organized,
      {
        id: fileItem.id,
        name: fileItem.name,
        folder: targetFolder,
        isDuplicate: fileItem.isDuplicate
      }
    ];
    setOrganized(nextOrganized);

    // Pick next active
    const remaining = currentUnorganized.filter(f => f.id !== fileItem.id);
    if (remaining.length > 0) {
      setActiveFileId(remaining[0].id);
    } else {
      // All sorted! Finish quest
      handleFinish(nextOrganized);
    }
  };

  const handleFinish = async (items: any[]) => {
    sound.playVictory();
    try {
      const res = await api.createFileManifest(items);
      if (res.success && res.manifest) {
        setPendingManifest(res.manifest);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleReset = () => {
    sound.playClick();
    setOrganized([]);
    setScore(0);
    loadFiles();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 glass-panel rounded-3xl border border-cyan-500/30">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-cyan-950/80 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.3)]">
            <FolderOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display font-bold text-2xl text-white">File Frenzy</h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/30 text-cyan-300">
                DRAG & DROP REAL DISK ORGANIZER
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Drag files into folder portals or click targets. Approved files will be physically relocated on disk.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-900/90 border border-cyan-500/30 px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold text-cyan-300">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span>{score} PTS</span>
          </div>
          <button
            onClick={handleReset}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
            title="Reset Game"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {currentUnorganized.length > 0 && activeFile ? (
        <div className="space-y-6">
          {/* Active File Stage */}
          <div
            draggable
            onDragStart={() => setDraggedFileId(activeFile.id)}
            onDragEnd={() => setDraggedFileId(null)}
            className="p-6 rounded-3xl glass-panel-glow border-2 border-cyan-400 shadow-[0_0_35px_rgba(0,240,255,0.2)] cursor-grab active:cursor-grabbing transition-all space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-cyan-950/80 border border-cyan-500/30 text-cyan-400">
                  <FileText className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg sm:text-xl text-white flex items-center gap-2">
                    {activeFile.name}
                    {activeFile.isDuplicate && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-500/30 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        <span>DUPLICATE DETECTED</span>
                      </span>
                    )}
                  </h3>
                  <div className="text-xs text-slate-400 font-mono mt-0.5">
                    Size: {activeFile.size} • Hash: {activeFile.hash}
                  </div>
                </div>
              </div>

              <div className="text-xs font-mono text-cyan-300 bg-cyan-950/60 px-3 py-1.5 rounded-xl border border-cyan-500/30 self-start sm:self-auto">
                FILES LEFT: {currentUnorganized.length} / {files.length}
              </div>
            </div>

            {/* AI Classification Reasoning */}
            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/80 flex items-start gap-2.5 text-xs text-slate-300 font-sans">
              <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-cyan-300">AI File Intelligence: </span>
                <span>{activeFile.reason}</span>
                {activeFile.isDuplicate && (
                  <span className="text-red-300 font-bold block mt-1">
                    ⚠️ Redundant byte copy of: "{activeFile.duplicateOf}". Recommended action: Purge to save disk space.
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Drop Portals / Folder Targets */}
          <div>
            <div className="text-xs font-mono text-slate-400 mb-3 px-1 flex items-center justify-between">
              <span>DESTINATION PORTALS (Drag card or click target to route)</span>
              <span className="text-cyan-400">+30 XP / file</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {folders.map(folder => {
                const Icon = folder.icon;
                const isOver = dragOverFolder === folder.id;
                return (
                  <button
                    key={folder.id}
                    onClick={() => handleRouteFile(activeFile, folder.id)}
                    onDragOver={(e) => { e.preventDefault(); setDragOverFolder(folder.id); }}
                    onDragLeave={() => setDragOverFolder(null)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDragOverFolder(null);
                      if (draggedFileId) {
                        const droppedFile = files.find(f => f.id === draggedFileId);
                        if (droppedFile) handleRouteFile(droppedFile, folder.id);
                      }
                    }}
                    className={`group p-4 rounded-2xl border transition-all text-left flex flex-col justify-between space-y-3 cursor-pointer ${
                      folder.color
                    } ${isOver ? 'scale-105 border-cyan-400 shadow-[0_0_25px_rgba(0,240,255,0.4)]' : 'hover:-translate-y-1'}`}
                  >
                    <div className="p-2.5 rounded-xl bg-slate-900/80 w-fit">
                      <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    </div>
                    <div>
                      <div className="font-display font-bold text-xs text-white leading-tight">
                        {folder.label}
                      </div>
                      <div className="text-[10px] font-mono text-slate-400 mt-1 flex items-center gap-1 group-hover:text-cyan-300">
                        <span>ROUTE HERE</span>
                        <ArrowRight className="w-3 h-3" />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* Round Complete Stage */
        <div className="glass-panel-glow rounded-3xl p-8 text-center space-y-6 border border-emerald-500/40">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.5)]">
            <CheckCircle2 className="w-8 h-8 text-slate-950" />
          </div>

          <div>
            <h3 className="font-display font-bold text-2xl text-white">
              DIRECTORY ORGANIZED!
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              All {organized.length} files classified into target directories with {score} game score.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-left space-y-2 max-w-lg mx-auto text-xs font-mono">
            <div className="text-slate-400 border-b border-slate-800 pb-2">Destinations Ready for Execution:</div>
            {organized.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center">
                <span className="text-slate-300 truncate max-w-[240px]">{item.name}</span>
                <span className="text-cyan-400 text-[11px]">{item.folder}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-4">
            <button
              onClick={handleReset}
              className="px-5 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:text-white text-xs font-mono"
            >
              Organize More Files
            </button>
            <button
              onClick={() => handleFinish(organized)}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-display font-bold text-xs shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all cursor-pointer"
            >
              Review & Execute Disk Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
