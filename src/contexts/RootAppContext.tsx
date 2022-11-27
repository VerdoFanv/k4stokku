import { createContext, Dispatch, ReactNode, useMemo } from "react"
import { useImmerReducer } from "use-immer"

interface AppState {
	loading: boolean
}

interface RootAppContextProviderProps {
	children: ReactNode
}

type Action =
	| { type: `set_loading`; payload: boolean }

const initialState: AppState = {
	loading: false,
}

function reducer(state: AppState, action: Action) {
	switch (action.type) {
		case `set_loading`:
			state.loading = action.payload
			return
		default:
			return state
	}
}

export const RootAppContext = createContext<{
	state: AppState
	dispatch: Dispatch<Action>
}>({ state: initialState, dispatch: () => {} })

export default function RootAppContextProvider({ children }: RootAppContextProviderProps) {
	const [ state, dispatch ] = useImmerReducer(reducer, initialState)

	return (
		<RootAppContext.Provider value={{ state, dispatch }}>
			{children}
		</RootAppContext.Provider>
	)
}