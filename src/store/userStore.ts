import { create } from 'zustand';

type GameUser = {
  id: number;
  username?: string;
  fullname: string;
  user_chat_id: string;
  wallet_address?: string;
  active_point: number;
  blue_stars: number;
  red_stars: number;
  created_at?: any;
  updated_at?: any;
};

type UserStore = {
  currentUser: GameUser | null;
  is_test_mode: boolean;
  setCurrentUser: (user: GameUser) => void;
  setMode: (is_test_mode: boolean) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  // currentUser: null,
  currentUser: {
    id: 1,
    username: 'testuser',
    fullname: 'Test User',
    user_chat_id: '7189498397',
    wallet_address: '',
    active_point: 0,
    blue_stars: 0,
    red_stars: 5000,
  },
  is_test_mode: true,
  // setCurrentUser: (user: GameUser) => set((state) => ({currentUser: user})),
  setCurrentUser: (user: GameUser) => set(() => ({currentUser: user})),
  setMode: (is_test_mode: boolean) => set({is_test_mode})
}));