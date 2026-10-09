import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type Theme = 'light' | 'dark';

export type SectionId = 'hero' | 'about' | 'projects' | 'skills' | 'honors' | 'experience' | 'contact';

interface AppState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  scrollProgress: number;
  setScrollProgress: (progress: number) => void;
  activeSection: SectionId;
  setActiveSection: (section: SectionId) => void;
  hoveredProject: string | null;
  setHoveredProject: (slug: string | null) => void;
  selectedProjectSlug: string | null;
  setSelectedProjectSlug: (slug: string | null) => void;
  hoveredSkill: string | null;
  setHoveredSkill: (skill: string | null) => void;
  hoveredExperience: string | null;
  setHoveredExperience: (id: string | null) => void;
  contactSent: boolean;
  setContactSent: (sent: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      theme: 'light',
      setTheme: (theme: Theme) => {
        set({ theme });
        applyDomState(theme);
      },
      toggleTheme: () => {
        const nextTheme: Theme = get().theme === 'light' ? 'dark' : 'light';
        set({ theme: nextTheme });
        applyDomState(nextTheme);
      },
      scrollProgress: 0,
      setScrollProgress: (scrollProgress: number) => set({ scrollProgress }),
      activeSection: 'hero',
      setActiveSection: (activeSection: SectionId) => set({ activeSection }),
      hoveredProject: null,
      setHoveredProject: (hoveredProject: string | null) => set({ hoveredProject }),
      selectedProjectSlug: null,
      setSelectedProjectSlug: (selectedProjectSlug: string | null) => set({ selectedProjectSlug }),
      hoveredSkill: null,
      setHoveredSkill: (hoveredSkill: string | null) => set({ hoveredSkill }),
      hoveredExperience: null,
      setHoveredExperience: (hoveredExperience: string | null) => set({ hoveredExperience }),
      contactSent: false,
      setContactSent: (contactSent: boolean) => set({ contactSent }),
    }),
    {
      name: 'injabin-portfolio-settings',
      partialize: (state) => ({ theme: state.theme }),
      storage: createJSONStorage(() => (typeof window !== 'undefined' ? localStorage : {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
      })),
      onRehydrateStorage: () => (state) => {
        if (state) {
          applyDomState(state.theme);
        }
      },
    }
  )
);

function applyDomState(theme: Theme) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}
