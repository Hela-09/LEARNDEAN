import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { ViewType } from '../types';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { navigateToRootSection, getSectionForPath } from '../utils/navigationHistory';
import { useAuth } from '../contexts/AuthContext';
import Logo, { LearnDeanEmblem } from './Logo';
import {
  Home,
  BookOpen,
  GraduationCap,
  FileUp,
  Search,
  Download,
  Settings,
} from 'lucide-react';
import UserAvatar from './UserAvatar';

interface SidebarProps {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
}

export default function Sidebar({ currentView, setCurrentView }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, userProfile } = useAuth();
  const { isInstallable, triggerInstall } = usePWAInstall();

  const currentSection = getSectionForPath(location.pathname);

  // EXACT SPECIFICATION FOR DESKTOP:
  // 5 MAIN ITEMS: Home, Learn, AI Tutor, Upload, Study
  // AI Tutor item uses the LearnDean logo instead of generic AI icon
  const navItems = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      rootPath: '/home',
      isActive: currentSection === 'home',
      isTutor: false,
    },
    {
      id: 'learn',
      label: 'Learn',
      icon: BookOpen,
      rootPath: '/learn',
      isActive: currentSection === 'learn',
      isTutor: false,
    },
    {
      id: 'classroom',
      label: 'AI Classroom',
      icon: null, // Uses distinctive LearnDean AI logo
      rootPath: '/classroom',
      isActive: currentSection === 'classroom',
      isClassroom: true,
    },
    {
      id: 'upload',
      label: 'Upload',
      icon: FileUp,
      rootPath: '/upload-notes',
      isActive: currentSection === 'upload',
      isTutor: false,
    },
    {
      id: 'study',
      label: 'Study',
      icon: GraduationCap,
      rootPath: '/study',
      isActive: currentSection === 'study',
      isTutor: false,
    },
  ];

  const handleNavClick = (rootPath: string) => {
    navigateToRootSection(navigate, rootPath);
  };

  return (
    <aside
      className="w-64 h-full bg-neutral-950 dark:bg-black text-white flex flex-col shrink-0 border-r border-neutral-800 dark:border-neutral-800 select-none"
      role="navigation"
      aria-label="Desktop main navigation"
    >
      {/* Brand Header */}
      <div className="p-4 pb-3 flex items-center justify-between shrink-0 border-b border-neutral-800">
        <div
          onClick={() => handleNavClick('/home')}
          className="flex items-center space-x-3 cursor-pointer group min-w-0"
          title="LearnDean Home"
        >
          <Logo variant="icon" className="w-9 h-9 shrink-0 group-hover:scale-105 transition-transform" />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h2 className="text-base font-bold text-white leading-tight truncate">LearnDean</h2>
              <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-neutral-800 text-neutral-200 border border-neutral-700 leading-tight">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 leading-tight truncate">Smart Prep System</p>
          </div>
        </div>
      </div>

      {/* Global Search Bar */}
      <div className="px-3.5 py-2.5 shrink-0">
        <button
          type="button"
          id="sidebar-search-btn"
          onClick={() => window.dispatchEvent(new CustomEvent('open-zetadu-search'))}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-neutral-400 hover:text-white text-xs transition-all cursor-pointer group"
          title="Search LearnDean (⌘K)"
        >
          <div className="flex items-center gap-2">
            <Search size={15} className="group-hover:text-white transition-colors" />
            <span className="font-medium">Search...</span>
          </div>
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-neutral-950 text-neutral-400 rounded border border-neutral-800">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Main Navigation Items (Icon beside label, consistent outlined style) */}
      <nav className="flex-1 px-3 py-1 space-y-1.5 overflow-y-auto overscroll-contain">
        <p className="px-2 pt-1 pb-1 text-[10px] font-black uppercase tracking-wider text-neutral-500">
          Navigation
        </p>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.isActive;
          const isClassroom = (item as any).isClassroom;

          return (
            <button
              key={item.id}
              id={`sidebar-nav-${item.id}-btn`}
              onClick={() => handleNavClick(item.rootPath)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all duration-150 relative group cursor-pointer border ${
                isActive
                  ? 'bg-neutral-850 text-white font-bold border-neutral-700 shadow-xs'
                  : 'text-neutral-400 hover:bg-neutral-900 hover:text-white font-medium border-transparent'
              }`}
              title={item.label}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className="flex items-center space-x-3.5 truncate">
                {isClassroom ? (
                  /* LearnDean AI Logo Emblem for AI Classroom */
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-transform ${
                      isActive
                        ? 'text-white scale-105'
                        : 'text-neutral-300 group-hover:scale-105'
                    }`}
                  >
                    <LearnDeanEmblem className="w-5 h-5" active={isActive} monochrome={false} />
                  </div>
                ) : (
                  Icon && (
                    <Icon
                      size={22}
                      strokeWidth={isActive ? 2.3 : 1.85}
                      className={`shrink-0 transition-transform duration-150 ${
                        isActive
                          ? 'text-white scale-[1.04]'
                          : 'text-neutral-400 group-hover:text-neutral-200'
                      }`}
                    />
                  )
                )}

                {/* Text Label is ALWAYS visible! */}
                <span className="text-sm font-semibold truncate">{item.label}</span>
              </div>

              {/* Active Indicator Dot on Desktop */}
              {isActive && (
                <motion.div
                  layoutId="sidebarActiveDot"
                  className="w-1.5 h-1.5 rounded-full bg-white ml-auto shrink-0"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer: User Account / Profile & PWA Install */}
      <div className="p-3 shrink-0 border-t border-slate-800/80 space-y-2">
        {/* User Profile Quick Link */}
        <button
          type="button"
          id="sidebar-profile-btn"
          onClick={() => {
            localStorage.removeItem('zetadu_profile_section');
            window.dispatchEvent(new CustomEvent('open-profile-section', { detail: { section: null } }));
            handleNavClick('/profile');
          }}
          className={`w-full flex items-center justify-between p-2 rounded-xl border transition-all cursor-pointer group ${
            location.pathname.startsWith('/profile') || location.pathname.startsWith('/settings')
              ? 'bg-neutral-850 border-neutral-700 text-white'
              : 'bg-neutral-900 hover:bg-neutral-850 border-neutral-800 text-neutral-300'
          }`}
          title="Account & Profile Settings"
          aria-label="Account Settings"
        >
          <div className="flex items-center space-x-2.5 min-w-0">
            <UserAvatar
              photoURL={userProfile?.photoURL || user?.photoURL}
              displayName={userProfile?.name || user?.displayName}
              email={user?.email}
              size="sm"
              className="w-7 h-7 text-xs shrink-0"
            />
            <div className="text-left min-w-0 truncate">
              <p className="text-xs font-bold text-white truncate leading-tight">
                {userProfile?.name || user?.displayName || 'Student Profile'}
              </p>
              <p className="text-[10px] text-neutral-400 truncate leading-tight">
                {user?.email || 'Account Settings'}
              </p>
            </div>
          </div>
          <Settings size={15} className="text-neutral-400 group-hover:text-white shrink-0 transition-colors" />
        </button>

        {isInstallable && (
          <button
            type="button"
            onClick={triggerInstall}
            className="w-full flex items-center justify-center space-x-2 bg-neutral-800 hover:bg-neutral-700 text-white font-semibold py-2 px-3 rounded-xl transition-all shadow-xs text-xs cursor-pointer border border-neutral-700"
            title="Install LearnDean App"
            aria-label="Install App"
          >
            <Download size={15} />
            <span>Install App</span>
          </button>
        )}
      </div>
    </aside>
  );
}
