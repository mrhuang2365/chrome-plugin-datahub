module.exports = {
  extends: ['@tencent/eslint-config-tencent', 'plugin:prettier/recommended'],
  overrides: [
    {
      files: ['*.js'],
      rules: {
        'no-useless-constructor': 'off',
        'no-underscore-dangle': 'off',
        camelcase: 'off',
        'no-useless-escape': 'off',
        'no-restricted-syntax': 'off',
        'prefer-destructuring': 'off',
        'no-param-reassign': 'off',
        'import/no-default-export': 'off',
        'import/prefer-default-export': 'off',
        camelcase: 'off',
        'no-param-reassign': 'off',
        'implicit-arrow-linebreak': 0,
        'function-paren-newline': 0,
        'operator-linebreak': 'off',
        // codecc 要求 && 这种放在行首，prettier 则要求放在行末
        // 'operator-linebreak': ['error', 'before', { overrides: { '=': 'none' } }],
        'no-useless-escape': 1,
        'no-useless-constructor': 0,
        'no-prototype-builtins': 0,
        'no-undef': 0,
        // '@typescript-eslint/consistent-type-assertions': 0,
        // 允许使用 require
        // '@typescript-eslint/no-require-imports': 0,
        // '@typescript-eslint/prefer-optional-chain': 0,
        // '@typescript-eslint/explicit-member-accessibility': 0,
        // '@typescript-eslint/member-ordering': 0,
        // '@typescript-eslint/no-useless-constructor': 0,
        // '@typescript-eslint/typedef': 0,
      },
    },
    {
      files: ['*.js'],
      rules: {
        'comma-dangle': [
          'warn',
          {
            arrays: 'only-multiline',
            objects: 'only-multiline',
            imports: 'only-multiline',
            exports: 'only-multiline',
            functions: 'only-multiline',
          },
        ],
      },
    },
  ],
  env: {
    jest: true,
  },
};
