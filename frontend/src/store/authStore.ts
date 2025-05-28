import { create } from 'zustand';
import { mountStoreDevtool } from 'simple-zustand-devtools';
import { fetchMe } from '@/utils/users';
import { co } from 'node_modules/@fullcalendar/core/internal-common';
import { setUser } from '@/utils/auth';
import { UserData } from '@/types/user';



type AuthState = {
    user: UserData | null;
    isLoading: boolean;
    fetchUser: () => Promise<void>
    updateUser: (user: Partial<UserData>) => void
    setUser: (user: UserData) => void;
    setLoading: (loading: boolean) => void;
};

const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    isLoading: false,
    fetchUser: async () => {
        try {
            set({ isLoading: true })
            const user = await fetchMe()
            
            console.log("Fetched user data:", user);

            set((state) => ({
            user: {
                ...state.user,
                ...user,
                profile: {
                    ...state.user?.profile,
                    ...user.profile
                }
            }
        }))

        } catch (err) {
            console.error("Error fetching user data:", err);   
            set({ user: null })     
        } finally {
            set({ isLoading: false })
        }
    },
    updateUser: (user) => {
        set((state) => ({
            user: {
                ...state.user,
                ...user,
                profile: {
                    ...state.user?.profile,
                    ...user.profile
                }
            }
        }))
    },
    setUser: (user) => set({user}),
    setLoading: (isLoading) => set({ isLoading }),
}));

export { useAuthStore };
