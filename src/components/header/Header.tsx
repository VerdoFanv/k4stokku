import { ReactElement } from "react"

interface Props {
	link: ReactElement
	action?: ReactElement
	navigation?: ReactElement
}

export default function Header({ link, action, navigation }: Props) {
	return (
		<>
			<header className="main-head">
				<div className="breadcrump">
					<p className="head-legend">Stokku</p>
					<div className="head-link">
						{link}
					</div>
				</div>
				<div className="head-action">
					<div className="form-field-action">
						{action}
					</div>
				</div>
			</header>
			{navigation && (
				<nav className="head-navigation">
					{navigation}
				</nav>
			)}
		</>
	)
}