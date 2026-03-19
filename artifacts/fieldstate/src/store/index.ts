import { create } from 'zustand';

type SummonState = 'closed' | 'open' | 'active' | 'capturing' | 'complete';
type NavState = 'desktop' | 'mobile-closed' | 'mobile-open';
type CursorState = 'default' | 'interactive' | 'hidden';

interface GlobalStore {
  summonState: SummonState;
  ceremonialMode: boolean;
  navState: NavState;
  loadingState: 'initial' | 'ready';
  cursorState: CursorState;
  
  setSummonState: (state: SummonState) => void;
  toggleCeremonial: () => void;
  setNavState: (state: NavState) => void;
  setLoadingState: (state: 'initial' | 'ready') => void;
  setCursorState: (state: CursorState) => void;
  initCeremonial: () => void;
}

export const useStore = create<GlobalStore>((set) => ({
  summonState: 'closed',
  ceremonialMode: false,
  navState: 'desktop',
  loadingState: 'initial',
  cursorState: 'default',
  
  setSummonState: (state) => set({ summonState: state }),
  
  toggleCeremonial: () => set((state) => {
    const next = !state.ceremonialMode;
    localStorage.setItem('ceremonial', next.toString());
    if (next) {
      document.body.classList.add('ceremonial');
    } else {
      document.body.classList.remove('ceremonial');
    }
    return { ceremonialMode: next };
  }),

  initCeremonial: () => set((state) => {
    const isCeremonial = localStorage.getItem('ceremonial') === 'true';
    if (isCeremonial) {
      document.body.classList.add('ceremonial');
    }
    return { ceremonialMode: isCeremonial };
  }),
  
  setNavState: (state) => set({ navState: state }),
  setLoadingState: (state) => set({ loadingState: state }),
  setCursorState: (state) => set({ cursorState: state }),
}));
