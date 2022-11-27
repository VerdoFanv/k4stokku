import Site from '@components/Site.component'
import RootAppContextProvider from '@contexts/RootAppContext'
import '@styles/app.scss'

export default function App({ Component, pageProps }) {
	return (
		<RootAppContextProvider>
			<Site>
				<Component {...pageProps} />
			</Site>
		</RootAppContextProvider>
	)
}
