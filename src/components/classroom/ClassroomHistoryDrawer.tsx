import React, { useState, useEffect } from 'react';
import {
  Clock,
  BookOpen,
  GraduationCap,
  Sparkles,
  ArrowRight,
  ChevronRight,
  X,
  History,
  MessageSquare,
  CheckCircle2,
  Trash2,
} from 'lucide-react';
import { ClassroomLesson } from '../../types/classroom';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { chalkAudio } from '../../utils/chalkAudio';

interface MigratedConversation {
  id: string;
  title: string;
  subject: string;
  updatedAt: number;
  messages: Array<{ role: string; text: string }>;
}

interface ClassroomHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  recentLessons: ClassroomLesson[];
  onSelectLesson: (lesson: ClassroomLesson) => void;
  onStartTopicFromRecord: (subject: string, topic: string) => void;
}

export default function ClassroomHistoryDrawer({
  isOpen,
  onClose,
  recentLessons,
  onSelectLesson,
  onStartTopicFromRecord,
}: ClassroomHistoryDrawerProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'lessons' | 'migrated'>('lessons');
  const [migratedConvos, setMigratedConvos] = useState<MigratedConversation[]>([]);
  const [isLoadingMigrated, setIsLoadingMigrated] = useState(false);
  const [selectedConvoMessages, setSelectedConvoMessages] = useState<MigratedConversation | null>(null);

  // Load existing tutor_conversations from Firestore for migration
  useEffect(() => {
    if (!user || !isOpen) return;

    const loadMigrated = async () => {
      setIsLoadingMigrated(true);
      try {
        const q = query(
          collection(db, 'tutor_conversations'),
          where('uid', '==', user.uid)
        );
        const snapshot = await getDocs(q);
        const list: MigratedConversation[] = [];
        snapshot.forEach((docSnap) => {
          const d = docSnap.data();
          list.push({
            id: docSnap.id,
            title: d.title || 'Study Discussion',
            subject: d.subject || 'General Studies',
            updatedAt: d.updatedAt || Date.now(),
            messages: d.messages || [],
          });
        });
        list.sort((a, b) => b.updatedAt - a.updatedAt);
        setMigratedConvos(list);
      } catch (err) {
        console.warn('Could not load migrated conversations from Firestore:', err);
      } finally {
        setIsLoadingMigrated(false);
      }
    };

    loadMigrated();
  }, [user, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-lg h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col justify-between animate-slideLeft">
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <History size={18} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Classroom History & Records
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Your chalkboard lessons and migrated learning discussions
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 flex gap-2">
          <button
            onClick={() => {
              setActiveTab('lessons');
              setSelectedConvoMessages(null);
            }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'lessons'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <GraduationCap size={15} />
            <span>Classroom Lessons ({recentLessons.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('migrated');
              setSelectedConvoMessages(null);
            }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'migrated'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <MessageSquare size={15} />
            <span>Migrated Records ({migratedConvos.length})</span>
          </button>
        </div>

        {/* Tab 1: Classroom Lessons */}
        {activeTab === 'lessons' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {recentLessons.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No saved lessons yet. Start any lesson to save your learning history.
              </div>
            ) : (
              recentLessons.map((l) => (
                <div
                  key={l.id}
                  onClick={() => {
                    chalkAudio.playChalkTap();
                    onSelectLesson(l);
                    onClose();
                  }}
                  className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/70 hover:border-emerald-500/50 hover:shadow-sm transition-all cursor-pointer group space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-[10px] font-mono font-bold uppercase">
                      {l.subject}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {new Date(l.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {l.topic}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                    {l.summary || l.title}
                  </p>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800/60 text-[11px] text-slate-500">
                    <span>{l.steps?.length || 5} Chalkboard Steps</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                      <span>Resume Lesson</span>
                      <ArrowRight size={12} />
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 2: Migrated Learning Records from AI Tutor */}
        {activeTab === 'migrated' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {selectedConvoMessages ? (
              <div className="space-y-3">
                <button
                  onClick={() => setSelectedConvoMessages(null)}
                  className="text-xs text-blue-600 dark:text-blue-400 font-bold flex items-center gap-1 hover:underline cursor-pointer"
                >
                  ← Back to Records List
                </button>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                      {selectedConvoMessages.title}
                    </h3>
                    <button
                      onClick={() => {
                        onStartTopicFromRecord(
                          selectedConvoMessages.subject,
                          selectedConvoMessages.title
                        );
                        onClose();
                      }}
                      className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs cursor-pointer"
                    >
                      <GraduationCap size={13} />
                      <span>Teach on Board</span>
                    </button>
                  </div>
                  <span className="text-[10px] text-slate-400">{selectedConvoMessages.subject}</span>
                </div>

                <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                  {selectedConvoMessages.messages.map((m, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl text-xs leading-relaxed ${
                        m.role === 'user'
                          ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 ml-4 border border-blue-200'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 mr-4 border border-slate-200'
                      }`}
                    >
                      <div className="font-bold text-[10px] text-slate-400 mb-0.5 uppercase">
                        {m.role === 'user' ? 'Student' : 'Tutor / Teacher'}
                      </div>
                      <p className="whitespace-pre-wrap">{m.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : isLoadingMigrated ? (
              <div className="p-8 text-center text-xs text-slate-400 flex flex-col items-center gap-2">
                <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <span>Checking your saved learning records...</span>
              </div>
            ) : migratedConvos.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 space-y-1">
                <p>No previous chat conversations found.</p>
                <p className="text-[11px] text-slate-500">
                  All new lessons you explore in AI Classroom will automatically be stored here.
                </p>
              </div>
            ) : (
              migratedConvos.map((convo) => (
                <div
                  key={convo.id}
                  className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/70 hover:border-blue-400/50 transition-all space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-[10px] font-bold">
                      {convo.subject}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {convo.messages.length} messages
                    </span>
                  </div>

                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    {convo.title}
                  </h3>

                  <div className="flex items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => {
                        onStartTopicFromRecord(convo.subject, convo.title);
                        onClose();
                      }}
                      className="flex-1 py-1.5 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1 cursor-pointer transition-all shadow-xs"
                    >
                      <GraduationCap size={13} />
                      <span>Teach in Classroom</span>
                    </button>

                    <button
                      onClick={() => setSelectedConvoMessages(convo)}
                      className="py-1.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-100 cursor-pointer"
                    >
                      View Notes
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            LearnDean AI Classroom Engine
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-300 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
