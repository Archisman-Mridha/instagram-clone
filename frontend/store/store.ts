import { create } from "zustand"

interface Store {
	userId?: Number
	setUserId: (userId: Number) => void
}

export const useStore = create<Store>((set) => ({
	setUserId: (userId: Number) => {
		set(() => ({ userId }))
	}
}))
