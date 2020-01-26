module.exports = {
	// parser: 'babel-eslint',
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 2018,
		ecmaFeatures: {
			jsx: true,
		},
		sourceType: 'module',
	},
	extends: [
		'esnext',
		'plugin:prettier/recommended',
		'prettier/standard',
		'plugin:jest/recommended',
		'plugin:@typescript-eslint/recommended',
	],
	env: {
		browser: true,
		node: true,
		'jest/globals': true,
	},
	plugins: ['babel', 'jest', '@typescript-eslint'],
	rules: {
		'@typescript-eslint/explicit-member-accessibility': 'off',
		'@typescript-eslint/explicit-function-return-type': 'off',
		'@typescript-eslint/no-non-null-assertion': 'off',
		'@typescript-eslint/interface-name-prefix': [
			'error',
			{
				prefixWithI: 'always',
			},
		],
		'@typescript-eslint/no-empty-interface': 'off',
		'@typescript-eslint/ban-ts-ignore': 'warn',
		'@typescript-eslint/no-use-before-define': 'off',
		'@typescript-eslint/no-var-requires': 'off',
		'prettier/prettier': 'error',
		// indent: 'off',
		'require-atomic-updates': 'off',
		'import/no-commonjs': 'off',
		'import/no-namespace': 'off',
		'no-console': 'warn',
		'import/no-nodejs-modules': 'off',
		'no-mixed-spaces-and-tabs': 'off',
		'import/no-extraneous-dependencies': 'off',
		'import/no-unresolved': 'off',
		'no-invalid-this': 'off',
		'import/named': 'off',
		'import/prefer-default-export': 'off'
	},
	overrides: [
		{
			files: ['*.ts', '*.tsx'],
			rules: {
				'no-undef': 0,
				'no-use-before-define': 0,
			},
		},
	],
};
