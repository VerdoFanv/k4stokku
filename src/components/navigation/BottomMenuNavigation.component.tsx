import { useContext, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { useRouter } from "next/router"

import IconMenu from "public/icons/icon-menu.svg"
import { RootAppContext } from "@contexts/RootAppContext"

interface NavsItems {
  link: string
  name: string
}

interface BottomMenuNavigationProps {
  navs: NavsItems[]
}

export default function BottomMenuNavigation({ navs }: BottomMenuNavigationProps) {
	const router = useRouter()
	const { dispatch } = useContext(RootAppContext)
	const [ navMenuPopup, setNavMenuPopup ] = useState(false)

	const handleRouting = (navData: NavsItems) => {
		dispatch({ type: `set_loading`, payload: true })
		router.push(navData.link)
		setNavMenuPopup(!navMenuPopup)
	}

	return (
		<>
			<AnimatePresence>
				{navMenuPopup && (
					<motion.div
						className=""
						initial={{ height: 0, opacity: 0 }}
						animate={{ height: `auto`, opacity: 1 }}
						exit={{ opacity: 0, transition: { ease: `easeOut` } }}
						transition={{
							duration: 0.1,
							ease: `backIn`
						}}
					>
						<div className="fixed bottom-24 right-5">
							<div className="flex flex-col justify-center">
								{navs.map((nav, i) => (
									<div
										key={i}
										className="text-sm px-3 py-1 text-center pointer bg-cyan-700 hover:bg-gray-300 border-b-2 border-black text-white hover:text-black"
										onClick={() => handleRouting(nav)}
									>
										<p className="font-semibold">{nav.name}</p>
									</div>
								))}
							</div>
							{/* <div className="flex justify-center">
								<IconArrowDownMenu style={{ height: `20px` }} />
							</div> */}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
			<div className="fixed bottom-5 right-5 pointer" onClick={() => setNavMenuPopup(!navMenuPopup)}>
				<IconMenu className="w-3/5" />
			</div>
		</>
	)
}