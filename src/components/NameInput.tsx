import React, { useState, useRef } from 'react';
import Papa from 'papaparse';
import { Upload, UserPlus, Trash2, FileText } from 'lucide-react';
import { Participant } from '../types';

interface NameInputProps {
  participants: Participant[];
  setParticipants: (participants: Participant[]) => void;
  onContinue: () => void;
}

export default function NameInput({ participants, setParticipants, onContinue }: NameInputProps) {
  const [textInput, setTextInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddNames = () => {
    const names = textInput
      .split(/[\n,]+/)
      .map(n => n.trim())
      .filter(n => n.length > 0);
    
    const newParticipants = names.map(name => ({
      id: Math.random().toString(36).substr(2, 9),
      name
    }));

    setParticipants([...participants, ...newParticipants]);
    setTextInput('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      complete: (results) => {
        const names = results.data
          .flat()
          .map((n: any) => String(n).trim())
          .filter(n => n.length > 0);
        
        const newParticipants = names.map(name => ({
          id: Math.random().toString(36).substr(2, 9),
          name
        }));
        setParticipants([...participants, ...newParticipants]);
      },
      header: false
    });
  };

  const clearAll = () => {
    if (confirm('確定要清除所有名單嗎？')) {
      setParticipants([]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-slate-700">貼上姓名 (以換行或逗號分隔)</label>
          <textarea
            className="w-full h-48 p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none bg-white shadow-sm"
            placeholder="例如：&#10;王小明&#10;李小華&#10;張大同"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
          />
          <button
            onClick={handleAddNames}
            disabled={!textInput.trim()}
            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <UserPlus size={20} />
            新增至名單
          </button>
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-semibold text-slate-700">上傳 CSV 檔案</label>
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-48 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/50 transition-all group"
          >
            <div className="p-4 bg-slate-100 rounded-full group-hover:bg-indigo-100 transition-colors">
              <Upload className="text-slate-500 group-hover:text-indigo-600" size={32} />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-slate-600">點擊或拖曳檔案至此</p>
              <p className="text-xs text-slate-400 mt-1">支援 .csv 格式</p>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              accept=".csv" 
              className="hidden" 
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={clearAll}
              className="flex-1 py-3 px-4 border border-red-200 text-red-600 hover:bg-red-50 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <Trash2 size={20} />
              清除全部
            </button>
          </div>
        </div>
      </div>

      {participants.length > 0 && (
        <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <FileText size={20} className="text-indigo-500" />
              目前名單 ({participants.length} 人)
            </h3>
            <button
              onClick={onContinue}
              className="px-6 py-2 bg-slate-900 text-white rounded-full font-medium hover:bg-slate-800 transition-colors shadow-lg"
            >
              下一步
            </button>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="max-h-64 overflow-y-auto p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
              {participants.map((p) => (
                <div 
                  key={p.id} 
                  className="px-3 py-2 bg-slate-50 rounded-lg text-sm text-slate-600 border border-slate-100 flex items-center justify-between group"
                >
                  <span className="truncate">{p.name}</span>
                  <button 
                    onClick={() => setParticipants(participants.filter(x => x.id !== p.id))}
                    className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
