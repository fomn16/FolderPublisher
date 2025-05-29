import { toast } from "react-toastify";
import { create } from "zustand";

export type ActiveModal = "CreateProject" | "EditProject" | null

type AppStateStore = {
    isLoading: boolean
    startLoading: () => void
    stopLoading: () => void

    notifyError: (message: string) => void

    activeModal: ActiveModal
    setActiveModal: (modal: ActiveModal) => void
    closeModal: () => void    
}

const useAppStateStore = create<AppStateStore>()(set => ({
    isLoading: true,
    startLoading: () => set({isLoading: true}),
    stopLoading: () => set({isLoading: false}),

    notifyError: (message) => toast.error(message),

    activeModal: null,
    setActiveModal: (modal) => set({activeModal: modal}),
    closeModal: () => set({activeModal:null})
}));

export default useAppStateStore