import { create } from "zustand";

const profileToggle = create((set) => ({
  profileStatus: false, 
  toggleProfileStatus: () => set((state) => ({ profileStatus: !state.profileStatus })),
}));

export default profileToggle;
