module.exports = {
  '**/*.{js,ts}': ['prettier --write', 'eslint --fix', 'git add'],
  '**/*.{json,scss,md}': ['prettier --write', 'git add'],
};
