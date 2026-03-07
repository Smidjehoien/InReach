/** @type {import('eslint').ESLint.ConfigData} */
const config = {
	extends: ['./base.js'],
	// This correctly merges the plugins from base.js with the 'import' plugin.
	plugins: ['codegen', 'turbo', 'node', 'deprecation', 'i18next', '@tanstack/query', 'import'],
	rules: {
		'no-useless-catch': 'warn',
	},
}
module.exports = config
