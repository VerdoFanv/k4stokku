import { RootAppContext } from "@contexts/RootAppContext"
import { useContext, useEffect } from "react"

export default function Site({ children }) {
	const { state, dispatch } = useContext(RootAppContext)

	useEffect(() => {
		return () => dispatch({ type: `set_loading`, payload: false })
	}, [ children ])

	return (
		<div className={`app ${state.loading ? `loading` : ``}`}>
			{children}
		</div>
	)
}