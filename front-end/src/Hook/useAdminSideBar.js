import { create } from "zustand";

const useAdminSideBar = create((set) => ({
  collapsed: false,
  setCollapsed: () => set((state) => ({ collapsed: !state.collapsed })),
}));

export default useAdminSideBar;
