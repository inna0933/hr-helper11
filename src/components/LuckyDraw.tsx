import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Trophy, RotateCcw, UserCheck, Settings2 } from 'lucide-react';
import { Participant } from '../types';

interface LuckyDrawProps {
  participants: Participant[];
}

export default function LuckyDraw({ participants }: LuckyDrawProps) {
  const [isDrawing, setIsDrawing] = useState(false);
  const [winner, setWinner] = useState<Participant | null>(null);
  const [history, setHistory] = useState<Participant[]>([]);
  const [allowDuplicate, setAllowDuplicate] = useState(false);
  const [currentName, setCurrentName] = useState('');
  const [availableParticipants, setAvailableParticipants] = useState<Participant[]>([]);

  useEffect(() => {
    setAvailableParticipants(participants);
  }, [participants]);

  const startDraw = () => {
    if (availableParticipants.length === 0) {
      alert('沒有可抽取的名單了！');
      return;
    }

    setIsDrawing(true);
    setWinner(null);

    let counter = 0;
    const duration = 3000;
    const interval = 80;
    const steps = duration / interval;

    const timer = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * participants.length);
      setCurrentName(participants[randomIndex].name);
      counter++;

      if (counter >= steps) {
        clearInterval(timer);
        finalizeDraw();
      }
    }, interval);
  };

  const finalizeDraw = () => {
    const randomIndex = Math.floor(Math.random() * availableParticipants.length);
    const selected = availableParticipants[randomIndex];

    setWinner(selected);
    setHistory(prev => [selected, ...prev]);
    setIsDrawing(false);

    if (!allowDuplicate) {
      setAvailableParticipants(prev => prev.filter(p => p.id !== selected.id));
    }

    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#6366f1', '#a855f7', '#ec4899']
    });
  };

  const resetDraw = () => {
    if (confirm('確定要重置所有抽獎記錄嗎？')) {
      setWinner(null);
      setHistory([]);
      setAvailableParticipants(participants);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-center justify-center py-12 space-y-8">
        <div className="relative w-full max-w-md aspect-square flex items-center justify-center">
          {/* Decorative Rings */}
          <div className="absolute inset-0 border-4 border-indigo-100 rounded-full animate-pulse" />
          <div className="absolute inset-4 border-2 border-indigo-50 rounded-full" />
          
          <div className="relative z-10 text-center space-y-4">
            <AnimatePresence mode="wait">
              {isDrawing ? (
                <motion.div
                  key="drawing"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="text-5xl font-black text-indigo-600 tracking-wider"
                >
                  {currentName}
                </motion.div>
              ) : winner ? (
                <motion.div
                  key="winner"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="flex justify-center">
                    <div className="p-4 bg-yellow-100 rounded-full text-yellow-600">
                      <Trophy size={48} />
                    </div>
                  </div>
                  <h2 className="text-sm font-bold text-yellow-600 uppercase tracking-widest">中獎者</h2>
                  <div className="text-6xl font-black text-slate-900">{winner.name}</div>
                </motion.div>
              ) : (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-2"
                >
                  <Trophy size={64} className="mx-auto text-slate-200" />
                  <p className="text-slate-400 font-medium">點擊下方按鈕開始抽獎</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex flex-col items-center gap-6 w-full max-w-sm">
          <div className="flex items-center gap-4 w-full p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <Settings2 size={20} className="text-slate-400" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-700">允許重複中獎</p>
              <p className="text-xs text-slate-400">開啟後已中獎者可再次被抽中</p>
            </div>
            <button
              onClick={() => setAllowDuplicate(!allowDuplicate)}
              className={`w-12 h-6 rounded-full transition-colors relative ${allowDuplicate ? 'bg-indigo-600' : 'bg-slate-200'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${allowDuplicate ? 'left-7' : 'left-1'}`} />
            </button>
          </div>

          <button
            onClick={startDraw}
            disabled={isDrawing || availableParticipants.length === 0}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-xl shadow-xl shadow-indigo-200 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDrawing ? '正在抽取...' : '開始抽獎'}
          </button>
          
          <p className="text-xs text-slate-400">
            剩餘可抽取人數：{availableParticipants.length} / {participants.length}
          </p>
        </div>
      </div>

      {history.length > 0 && (
        <div className="space-y-4 animate-in fade-in duration-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <UserCheck size={20} className="text-indigo-500" />
              中獎記錄
            </h3>
            <button
              onClick={resetDraw}
              className="text-sm text-slate-400 hover:text-red-500 flex items-center gap-1 transition-colors"
            >
              <RotateCcw size={14} />
              重置記錄
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {history.map((p, i) => (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                key={`${p.id}-${history.length - i}`}
                className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center gap-3"
              >
                <div className="w-8 h-8 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 font-bold text-xs">
                  {history.length - i}
                </div>
                <span className="font-semibold text-slate-700">{p.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
