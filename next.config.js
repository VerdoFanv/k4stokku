module.exports = {
	reactStrictMode: true,
	webpack(config) {
		config.module.rules.push({
			test: /\.svg$/,
			issuer: /\.[jt]sx?$/,
			use: {
				loader: `@svgr/webpack`,
				options: {
					svgoConfig: {
						plugins: [
							{
								name: `removeViewBox`,
								active: false
							}
						]
					}
				}
			}
		})

		return config
	},
}
