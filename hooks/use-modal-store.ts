// See https://docs.pmnd.rs/zustand/getting-started/introduction
import { Server } from "@prisma/client";
import { create } from "zustand";

export type ModalType = "createServer" | "editServer" | "invite" | "members" | "createChannel" | "leaveServer" | "deleteServer";

interface ModalData {
  server?: Server
}

interface ModalStore {
  type: ModalType | null;
  data: ModalData;
  isOpen: boolean;
  onOpen: (type: ModalType, data?: ModalData) => void;
  onClose: () => void;
}

// This hook manages the state of the modal
export const useModal = create<ModalStore>()(set => ({
  type: null,
  data: {},
  isOpen: false,
  onOpen: (type, data = {}) => set({ type, data, isOpen: true }),
  onClose: () => set({ type: null, isOpen: false })
}));

