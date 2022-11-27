import { AnimatePresence, motion } from "framer-motion"
import { useEffect } from "react"
import { FaTimes } from "react-icons/fa"

interface Props {
  visible: boolean
  message: string
  setClose: (visible: boolean) => void
  autoCloseDuration?: number
	type?: `success` | `failed` | string
}

export default function Toast({ visible, setClose, autoCloseDuration, message, type = `success` }: Props) {
	useEffect(() => {
		if (visible) {
			setTimeout(() => {
				setClose(!visible)
			}, autoCloseDuration || 3000)
		}
	}, [ visible, setClose ])

	return (
		<AnimatePresence>
			{visible && (
				<motion.div
					className={`modal-toast ${type} flex items-center`}
					initial={{ opacity: 0, y: -100 }}
					animate={{ opacity: 1, y: 10 }}
					exit={{ opacity: 1, y: -100, transition: { ease: `backIn` } }}
					transition={{
						x: { duration: 0.2 },
						ease: `backOut`
					}}
				>
					<div className="content-left">
						<p className="message">{message}</p>
					</div>
					<div className="content-right pointer" onClick={() => setClose(false)}>
						<FaTimes className="text-xl" />
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	)
}