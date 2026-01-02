import { create } from 'zustand'

type ModalType = 'success' | 'error' | 'info'

interface ModalAction {
  label?: string
  href?: string
}

interface ModalState {
  visible: boolean
  title?: string
  message?: string
  type: ModalType
  action?: ModalAction
  showModal: (title: string, message: string, type?: ModalType, action?: ModalAction) => void
  hideModal: () => void
}

export const useModalStore = create<ModalState>((set) => ({
  visible: false,
  title: undefined,
  message: undefined,
  type: 'info',
  action: undefined,
  showModal: (title: string, message: string, type: ModalType = 'info', action?: ModalAction) =>
    set({ visible: true, title, message, type, action }),
  hideModal: () => set({ visible: false, title: undefined, message: undefined, type: 'info', action: undefined }),
}))
