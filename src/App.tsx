import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, Trophy, UserPlus, Github } from 'lucide-react';
import NameInput from './components/NameInput';
import LuckyDraw from './components/LuckyDraw';
import AutoGrouping from './components/AutoGrouping';
import { Participant, TabType } from './types';

export default function App() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('input');

  const tabs = [
    { id: 'input', label: '名單管理', icon: UserPlus },
    { id: 'draw', label: '獎品抽籤', icon: Trophy },
    { id: 'group', label: '自動分組', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <Trophy className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 leading-none">HR Event Toolkit</h1>
              <p className="text-xs text-slate-400 font-medium mt-1">專業活動管理工具</p>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${
                  activeTab === tab.id 
                    ? 'bg-white text-indigo-600 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status</span>
              <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                Ready to use
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8">
        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex-shrink-0 px-4 py-3 rounded-2xl text-sm font-bold flex items-center gap-2 transition-all ${
                activeTab === tab.id 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
                  : 'bg-white text-slate-500 border border-slate-200'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="space-y-8">
          {/* Welcome Section if no participants */}
          {participants.length === 0 && activeTab !== 'input' && (
            <div className="bg-indigo-50 border border-indigo-100 rounded-3xl p-8 text-center space-y-4">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                <UserPlus className="text-indigo-600" size={32} />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-slate-900">尚未建立名單</h2>
                <p className="text-slate-500 max-w-md mx-auto">請先在「名單管理」分頁中貼上姓名或上傳 CSV 檔案，即可開始抽籤或分組。</p>
              </div>
              <button
                onClick={() => setActiveTab('input')}
                className="px-6 py-2 bg-indigo-600 text-white rounded-full font-bold hover:bg-indigo-700 transition-colors"
              >
                前往名單管理
              </button>
            </div>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'input' && (
                <NameInput 
                  participants={participants} 
                  setParticipants={setParticipants} 
                  onContinue={() => setActiveTab('draw')}
                />
              )}
              {activeTab === 'draw' && participants.length > 0 && (
                <LuckyDraw participants={participants} />
              )}
              {activeTab === 'group' && participants.length > 0 && (
                <AutoGrouping participants={participants} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-400 font-medium">
            © 2024 HR Event Toolkit. Crafted for professional HR events.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-slate-400 hover:text-slate-600 transition-colors">
              <Github size={20} />
            </a>
            <div className="h-4 w-px bg-slate-200" />
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Version 1.0.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
