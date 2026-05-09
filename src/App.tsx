/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  Zap, 
  Search, 
  History, 
  Copy, 
  Check, 
  RefreshCw, 
  Sparkles, 
  LayoutDashboard,
  Youtube,
  Video,
  Hash,
  MessageSquare,
  ChevronRight,
  Menu,
  X,
  Trash2,
  Download,
  Clock,
  ExternalLink,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { RegenerationMode, RegenerationOutput } from './types';
import { regenerateText } from './lib/gemini';
import { exportToPDF } from './lib/export';

export default function App() {
  const [inputText, setInputText] = useState('');
  const [selectedModes, setSelectedModes] = useState<RegenerationMode[]>(['Viral']);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentOutput, setCurrentOutput] = useState<RegenerationOutput | null>(null);
  const [history, setHistory] = useState<RegenerationOutput[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isRegeneratingVariations, setIsRegeneratingVariations] = useState(false);
  const [historySearch, setHistorySearch] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Load history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('regen_history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Failed to parse history', e);
      }
    }
  }, []);

  // Save history to localStorage
  useEffect(() => {
    localStorage.setItem('regen_history', JSON.stringify(history));
  }, [history]);

  const modes: RegenerationMode[] = [
    'Viral', 'SEO', 'Aesthetic', 'Fanpage', 'TikTok', 'YouTube Shorts', 'Clean Professional'
  ];

  const handleRegenerate = async (isVariation = false) => {
    const textToUse = isVariation && currentOutput ? currentOutput.originalText : inputText;
    const modesToUse = isVariation && currentOutput ? currentOutput.modes : selectedModes;

    if (!textToUse.trim()) return;
    
    if (isVariation) setIsRegeneratingVariations(true);
    else setIsGenerating(true);

    try {
      const output = await regenerateText(textToUse, modesToUse);
      setCurrentOutput(output);
      setHistory(prev => [output, ...prev].slice(0, 20));
    } catch (error) {
      alert('Efficiency error: Could not process request.');
    } finally {
      setIsGenerating(false);
      setIsRegeneratingVariations(false);
    }
  };

  const toggleMode = (mode: RegenerationMode) => {
    setSelectedModes(prev => 
      prev.includes(mode) 
        ? (prev.length > 1 ? prev.filter(m => m !== mode) : prev)
        : [...prev, mode]
    );
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const deleteHistoryItem = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  const getRelativeTime = (timestamp: number) => {
    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
    const elapsed = (timestamp - Date.now()) / 1000;
    
    if (Math.abs(elapsed) < 60) return 'just now';
    if (Math.abs(elapsed) < 3600) return rtf.format(Math.round(elapsed / 60), 'minute');
    if (Math.abs(elapsed) < 86400) return rtf.format(Math.round(elapsed / 3600), 'hour');
    return rtf.format(Math.round(elapsed / 86400), 'day');
  };

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleDownloadPDF = async (output: RegenerationOutput) => {
    setIsDownloading(true);
    try {
      await exportToPDF(output);
      showToast('PDF Exported Successfully');
    } catch (error) {
      showToast('Export failed', 'error');
    } finally {
      setIsDownloading(false);
    }
  };

  const filteredHistory = history.filter(item => 
    item.originalText.toLowerCase().includes(historySearch.toLowerCase()) ||
    item.modes.some(m => m.toLowerCase().includes(historySearch.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-black text-slate-100 font-sans selection:bg-teal selection:text-black">
      {/* Sidebar Overlay */}
      <AnimatePresence>
        {showHistory && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowHistory(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* History Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ 
          x: showHistory ? 0 : -320,
        }}
        transition={{ type: 'spring', damping: 20 }}
        className="fixed top-0 left-0 bottom-0 w-80 bg-zinc-950 border-r border-zinc-800 z-50 overflow-y-auto"
      >
        <div className="sticky top-0 bg-zinc-950 z-10 p-6 pb-2 border-b border-zinc-900 mb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-teal" />
              <h2 className="text-lg font-medium tracking-tight">History</h2>
            </div>
            <button 
              onClick={() => setShowHistory(false)}
              className="p-2 hover:bg-zinc-900 rounded-lg lg:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
            <input 
              type="text"
              placeholder="Search history..."
              value={historySearch}
              onChange={(e) => setHistorySearch(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2 pl-10 pr-4 text-xs focus:outline-none focus:border-teal/30 focus:ring-1 focus:ring-teal/20 transition-all"
            />
          </div>
        </div>

        <div className="px-6 pb-6 space-y-4">
          {filteredHistory.length === 0 ? (
            <p className="text-zinc-500 text-sm text-center py-8 italic">No matching results</p>
          ) : (
            filteredHistory.map((item) => (
              <div 
                key={item.id}
                onClick={() => {
                  setCurrentOutput(item);
                  setInputText(item.originalText);
                  setSelectedModes(item.modes);
                  if (window.innerWidth < 1024) setShowHistory(false);
                }}
                className="group relative bg-zinc-900/40 border border-zinc-900 p-4 rounded-xl cursor-pointer hover:border-teal/40 transition-all hover:bg-zinc-900"
              >
                <div className="flex justify-between items-start mb-3 bg-zinc-950/50 -mx-1 -mt-1 p-1 rounded-lg">
                  <div className="flex flex-wrap gap-1">
                    {item.modes.slice(0, 2).map(mode => (
                      <span key={mode} className="text-[8px] uppercase tracking-wider text-teal font-bold px-1.5 py-0.5 bg-teal/10 rounded border border-teal/10">
                        {mode}
                      </span>
                    ))}
                    {item.modes.length > 2 && <span className="text-[8px] text-zinc-600 px-1.5 py-0.5">+{item.modes.length - 2}</span>}
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                     <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(item.originalText, `hist-copy-${item.id}`);
                        showToast('Input copied to clipboard');
                      }}
                      className="p-1.5 bg-zinc-900 hover:bg-teal/10 hover:text-teal rounded-md transition-all"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteHistoryItem(item.id);
                      }}
                      className="p-1.5 bg-zinc-900 hover:bg-red-500/10 hover:text-red-400 rounded-md transition-all"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                
                <p className="text-xs text-zinc-300 font-medium line-clamp-2 mb-3 leading-relaxed">{item.originalText}</p>
                
                <div className="flex items-center justify-between mt-auto pt-2 border-t border-zinc-900/50">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] text-zinc-300 font-bold">
                      {new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="text-[9px] text-zinc-600 font-mono flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" />
                      {getRelativeTime(item.createdAt)}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-700 group-hover:text-teal group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            ))
          )}
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className={`transition-all duration-300 min-h-screen pb-20 ${showHistory ? 'lg:pl-80' : 'pl-0'}`}>
        <nav className="sticky top-0 z-30 bg-black/50 backdrop-blur-md border-b border-zinc-900 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowHistory(!showHistory)}
              className="p-2 hover:bg-zinc-900 rounded-lg text-zinc-400 hover:text-teal transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-teal flex items-center justify-center shadow-[0_0_15px_rgba(0,245,255,0.4)]">
                <RefreshCw className="w-5 h-5 text-black" />
              </div>
              <h1 className="text-2xl font-bold tracking-tighter">REGEN<span className="text-teal text-sm ml-1">AI</span></h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 bg-zinc-900 rounded-full px-3 py-1.5 border border-zinc-800">
              <Zap className="w-3.5 h-3.5 text-teal fill-teal" />
              <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-300">Creator Hub</span>
            </div>
          </div>
        </nav>

        <div className="max-w-5xl mx-auto px-6 py-12">
          {/* Hero Section */}
          {!currentOutput && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal/5 border border-teal/10 mb-6 font-mono text-[10px] uppercase tracking-widest text-teal">
                <Sparkles className="w-3 h-3" />
                Premium Social Intelligence
              </div>
              <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent italic">
                Regenerate for Virality.
              </h2>
              <p className="text-zinc-400 text-lg max-w-2xl mx-auto leading-relaxed">
                Transform weak social text into high-retention content optimized for SEO and retention.
              </p>
            </motion.div>
          )}

          {/* Input Area */}
          <div className="glass-card p-6 mb-12 glow-border">
            <div className="flex flex-wrap gap-2 mb-6 justify-center">
              {modes.map((mode) => (
                <button
                  key={mode}
                  onClick={() => toggleMode(mode)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all ${
                    selectedModes.includes(mode) 
                      ? 'bg-teal text-black shadow-[0_0_15px_rgba(0,245,255,0.3)] border-teal' 
                      : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 border-transparent'
                  } border`}
                >
                  {mode}
                </button>
              ))}
            </div>
            
            <div className="relative group">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste your boring, spammy, or repetitive text here..."
                className="w-full h-48 bg-black/40 border border-zinc-800 rounded-xl p-6 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-teal/30 focus:ring-1 focus:ring-teal/20 transition-all text-lg resize-none"
              />
              <div className="absolute top-4 right-4 flex items-center gap-2 text-zinc-600 font-mono text-[10px] uppercase">
                <MessageSquare className="w-3.5 h-3.5" />
                Input detected
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <button
                disabled={isGenerating || !inputText.trim()}
                onClick={handleRegenerate}
                className="group relative w-full md:w-auto min-w-[240px] bg-teal text-black font-bold py-4 px-8 rounded-xl flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white hover:text-black overflow-hidden"
              >
                <div className="absolute inset-0 bg-teal glow-pulse" />
                {isGenerating ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <Zap className="w-5 h-5 fill-current" />
                )}
                <span className="relative z-10 uppercase tracking-widest text-sm">
                  {isGenerating ? 'Processing...' : 'REGENERATE TEXT'}
                </span>
              </button>
            </div>
          </div>

          {/* Output Section */}
          <AnimatePresence mode="wait">
            {currentOutput && (
              <motion.div
                key={currentOutput.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                className="space-y-12"
              >
                {/* Result Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-8">
                  <div>
                    <h3 className="text-3xl font-bold italic">Generation Report</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {currentOutput.modes.map(mode => (
                        <span key={mode} className="text-teal font-mono text-[10px] bg-teal/10 px-2 py-0.5 rounded border border-teal/20 font-bold uppercase tracking-widest">{mode}</span>
                      ))}
                      <span className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest self-center">• ID: {currentOutput.id.slice(0, 8)}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button 
                      onClick={() => setCurrentOutput(null)}
                      className="px-6 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-sm font-semibold hover:bg-zinc-800 transition-colors"
                    >
                      Clear
                    </button>
                    <button 
                      disabled={isRegeneratingVariations}
                      onClick={() => handleRegenerate(true)}
                      className="px-6 py-3 bg-white text-black rounded-xl text-sm font-bold hover:bg-zinc-200 transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50"
                    >
                      {isRegeneratingVariations ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <Sparkles className="w-4 h-4" />
                      )}
                      Regenerate Variations
                    </button>
                    <button 
                      disabled={isDownloading}
                      onClick={() => currentOutput && handleDownloadPDF(currentOutput)}
                      className="px-6 py-3 bg-zinc-900 border border-teal/20 text-teal rounded-xl text-sm font-bold hover:bg-teal/5 transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50"
                    >
                      {isDownloading ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <Download className="w-4 h-4" />
                      )}
                      Download PDF
                    </button>
                    <button 
                      onClick={() => handleRegenerate(false)}
                      className="px-6 py-3 bg-teal/10 border border-teal/20 text-teal rounded-xl text-sm font-semibold hover:bg-teal/20 transition-colors flex items-center gap-2"
                    >
                      <RefreshCw className="w-4 h-4" />
                      New Fresh Regen
                    </button>
                  </div>
                </div>

                {/* Viral Titles */}
                <section>
                  <div className="flex items-center gap-2 mb-6">
                    <Sparkles className="w-5 h-5 text-teal" />
                    <h4 className="text-xl font-bold tracking-tight uppercase">Viral Title Variations</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-medium">
                    {currentOutput.titles.map((title, idx) => (
                      <div 
                        key={idx}
                        className="group relative bg-zinc-950 border border-zinc-900 p-4 rounded-xl flex items-center justify-between hover:border-teal/20 transition-all hover:bg-zinc-900/50"
                      >
                        <span className="text-zinc-300">{title}</span>
                        <button 
                          onClick={() => copyToClipboard(title, `title-${idx}`)}
                          className="p-2 opacity-0 group-hover:opacity-100 hover:bg-zinc-800 rounded-lg text-zinc-500 hover:text-teal transition-all"
                        >
                          {copiedId === `title-${idx}` ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Captions & SEO */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <section className="space-y-6">
                    <div className="flex items-center gap-2">
                      <Video className="w-5 h-5 text-teal" />
                      <h4 className="text-lg font-bold tracking-tight uppercase">Caption Styles</h4>
                    </div>
                    {currentOutput.captions.map((caption, idx) => (
                      <div key={idx} className="glass-card p-6 relative group">
                        <p className="text-zinc-300 text-sm leading-relaxed mb-4">{caption}</p>
                        <button 
                          onClick={() => copyToClipboard(caption, `caption-${idx}`)}
                          className="absolute bottom-4 right-4 flex items-center gap-2 text-[10px] font-bold text-zinc-500 hover:text-teal opacity-0 group-hover:opacity-100 transition-all uppercase tracking-widest"
                        >
                          {copiedId === `caption-${idx}` ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                          {copiedId === `caption-${idx}` ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                    ))}
                  </section>

                  <section className="space-y-6">
                    <div className="flex items-center gap-2">
                      <Search className="w-5 h-5 text-teal" />
                      <h4 className="text-lg font-bold tracking-tight uppercase">SEO Optimizations</h4>
                    </div>
                    {currentOutput.seoDescriptions.map((desc, idx) => (
                      <div key={idx} className="bg-zinc-900/30 border border-zinc-800/80 rounded-xl p-6 relative group">
                        <p className="text-zinc-400 text-sm italic leading-relaxed mb-4">"{desc}"</p>
                        <button 
                          onClick={() => copyToClipboard(desc, `seo-${idx}`)}
                          className="absolute bottom-4 right-4 flex items-center gap-2 text-[10px] font-bold text-zinc-500 hover:text-teal opacity-0 group-hover:opacity-100 transition-all uppercase tracking-widest"
                        >
                          {copiedId === `seo-${idx}` ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                          {copiedId === `seo-${idx}` ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                    ))}
                  </section>
                </div>

                {/* Hooks & Hashtags */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                   <div className="lg:col-span-1 border-r border-zinc-900 pr-0 lg:pr-8">
                     <div className="flex items-center gap-2 mb-4">
                        <Sparkles className="w-4 h-4 text-teal" />
                        <h4 className="text-sm font-bold uppercase tracking-widest">Hooks</h4>
                     </div>
                     <div className="space-y-3">
                        {currentOutput.hooks.map((hook, idx) => (
                          <div key={idx} className="p-3 bg-zinc-950 rounded-lg border border-zinc-900 text-zinc-400 text-xs font-medium cursor-pointer hover:bg-zinc-900 transition-colors" onClick={() => copyToClipboard(hook, `hook-${idx}`)}>
                            {hook}
                            {copiedId === `hook-${idx}` && <span className="float-right text-green-400"><Check className="w-3 h-3" /></span>}
                          </div>
                        ))}
                     </div>
                   </div>

                   <div className="lg:col-span-2">
                     <div className="flex items-center gap-2 mb-4">
                        <Hash className="w-4 h-4 text-teal" />
                        <h4 className="text-sm font-bold uppercase tracking-widest">SEO Hashtags</h4>
                     </div>
                     <div className="flex flex-wrap gap-2">
                        {currentOutput.hashtags.map((tag, idx) => (
                          <span 
                            key={idx}
                            onClick={() => copyToClipboard(tag, `tag-${idx}`)}
                            className={`px-3 py-1.5 rounded-lg border text-xs font-mono transition-all cursor-pointer ${
                              copiedId === `tag-${idx}` 
                                ? 'bg-teal/20 border-teal text-teal shadow-[0_0_10px_rgba(0,245,255,0.2)]' 
                                : 'bg-zinc-950 border-zinc-900 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300'
                            }`}
                          >
                            {tag}
                          </span>
                        ))}
                     </div>
                   </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Initial State Helper */}
          {!currentOutput && !isGenerating && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
               <div className="glass-card p-8 border-dashed border-zinc-800 flex flex-col items-center text-center group hover:border-teal/30 transition-all">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-950 border border-zinc-900 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                     <Sparkles className="w-6 h-6 text-teal" />
                  </div>
                  <h4 className="text-lg font-bold mb-2 italic">Viral Intelligence</h4>
                  <p className="text-sm text-zinc-500">Optimized for TikTok, Reels, and Shorts algorithms with curiosity-driven hooks.</p>
               </div>
               <div className="glass-card p-8 border-dashed border-zinc-800 flex flex-col items-center text-center group hover:border-teal/30 transition-all">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-950 border border-zinc-900 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                     <Search className="w-6 h-6 text-teal" />
                  </div>
                  <h4 className="text-lg font-bold mb-2 italic">SEO Dominance</h4>
                  <p className="text-sm text-zinc-500">Natural keyword placement to improve discoverability without sounding robotic.</p>
               </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-zinc-900 mt-auto bg-black">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-teal" />
            <span className="font-bold tracking-tighter">REGEN</span>
          </div>
          <p className="text-zinc-600 text-[10px] uppercase tracking-[0.2em] font-medium">
            © 2026 REGEN AI • Premium Social Optimization Interface
          </p>
          <div className="flex gap-4">
            <Zap className="w-4 h-4 text-zinc-800" />
            <Zap className="w-4 h-4 text-zinc-800" />
            <Zap className="w-4 h-4 text-zinc-800" />
          </div>
        </div>
      </footer>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-2xl shadow-xl flex items-center gap-3 border ${
              toast.type === 'success' ? 'bg-zinc-900 border-teal text-teal' : 'bg-red-900/20 border-red-500 text-red-400'
            }`}
          >
            {toast.type === 'success' ? <Check className="w-5 h-5" /> : <Info className="w-5 h-5" />}
            <span className="text-sm font-bold tracking-tight">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
