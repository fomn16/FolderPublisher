import { toast } from "react-toastify";
import { create } from "zustand";

export type ActiveModal = "EditChat" | null

type AppStateStore = {
    isLoading: boolean
    loadingCounter: number
    startLoading: () => void
    stopLoading: () => void

    notifyError: (message: string) => void

    activeModal: ActiveModal
    modalProps: any
    modalStack: { modal:ActiveModal, props: any }[]
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

    modalStack: [],
    activeModal: null,
    modalProps: undefined,
    setActiveModal: (modal, props) => {
        const {activeModal, modalProps, modalStack} = get();
        modalStack.push({modal:activeModal, props:modalProps})
        set({activeModal: modal, modalProps:props, modalStack:modalStack});
    },
    closeModal: () =>{
        const currStack = get().modalStack;
        const popped = currStack.pop()
        if(popped)
            set({activeModal:popped.modal, modalProps:popped.props, modalStack:currStack});
        else
            set({activeModal:null, modalProps:undefined});
    }
}));

export default useAppStateStore