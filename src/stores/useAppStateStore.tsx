import { toast } from "react-toastify";
import { create } from "zustand";

export type ActiveModal = "CreateProject" | "EditProject" | null

type AppStateStore = {
    isLoading: boolean
    loadingCounter: number
    startLoading: () => void
    stopLoading: () => void

    notifyError: (message: string) => void

    activeModal: ActiveModal
    modalProps: any
    setActiveModal: (modal: ActiveModal, props?: any) => void
    closeModal: () => void
}

const useAppStateStore = create<AppStateStore>()((set, get) => ({
    isLoading: false,
    loadingCounter: 0,
    startLoading: () => {
        const newCounter = get().loadingCounter+1;
        set({loadingCounter: newCounter, isLoading: true});
    },
    stopLoading: () => {
        const newCounter = Math.max(0, get().loadingCounter - 1);
        set({loadingCounter: newCounter, isLoading: (newCounter !== 0)})
    },

    notifyError: (message) => toast.error(message),

    activeModal: null,
    modalProps: undefined,
    setActiveModal: (modal, props) => set({activeModal: modal, modalProps:props}),
    closeModal: () => set({activeModal:null, modalProps:undefined})
}));

export default useAppStateStore