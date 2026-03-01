import { useState } from 'react';
import { motion } from 'motion/react';
import { Users, LayoutGrid, Shuffle, Download } from 'lucide-react';
import { Participant } from '../types';

interface AutoGroupingProps {
  participants: Participant[];
}

export default function AutoGrouping({ participants }: AutoGroupingProps) {
  const [groupSize, setGroupSize] = useState(3);
  const [groups, setGroups] = useState<Participant[][]>([]);

  const handleGroup = () => {
    if (participants.length === 0) return;

    const shuffled = [...participants].sort(() => Math.random() - 0.5);
    const newGroups: Participant[][] = [];
    
    for (let i = 0; i < shuffled.length; i += groupSize) {
      newGroups.push(shuffled.slice(i, i + groupSize));
    }

    setGroups(newGroups);
  };

  const exportGroups = () => {
    const content = groups.map((group, i) => 
      `第 ${i + 1} 組: ${group.map(p => p.name).join(', ')}`
    ).join('\n');
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '分組結果.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Users size={20} className="text-indigo-500" />
              分組設定
            </h3>
            <p className="text-sm text-slate-400">設定每組人數，系統將自動隨機分配</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-xl border border-slate-200">
              <button 
                onClick={() => setGroupSize(Math.max(2, groupSize - 1))}
                className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-sm transition-all text-slate-600 font-bold"
              >
                -
              </button>
              <div className="w-16 text-center">
                <span className="text-xl font-black text-indigo-600">{groupSize}</span>
                <span className="text-[10px] block text-slate-400 font-bold uppercase">人 / 組</span>
              </div>
              <button 
                onClick={() => setGroupSize(groupSize + 1)}
                className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-sm transition-all text-slate-600 font-bold"
              >
                +
              </button>
            </div>
            
            <button
              onClick={handleGroup}
              className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-100 transition-all active:scale-95"
            >
              <Shuffle size={20} />
              開始分組
            </button>
          </div>
        </div>
      </div>

      {groups.length > 0 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <LayoutGrid size={20} className="text-indigo-500" />
              分組結果 ({groups.length} 組)
            </h3>
            <button
              onClick={exportGroups}
              className="text-sm text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1"
            >
              <Download size={16} />
              匯出結果
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map((group, groupIndex) => (
              <motion.div
                key={groupIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: groupIndex * 0.05 }}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
              >
                <div className="bg-slate-50 px-4 py-3 border-bottom border-slate-100 flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Group {groupIndex + 1}</span>
                  <span className="text-xs font-medium text-slate-400">{group.length} 人</span>
                </div>
                <div className="p-4 space-y-2">
                  {group.map((p, pIndex) => (
                    <div 
                      key={p.id}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center text-[10px] font-bold text-indigo-600">
                        {pIndex + 1}
                      </div>
                      <span className="font-medium text-slate-700">{p.name}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
