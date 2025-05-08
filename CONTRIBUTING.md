# Contributing to SONGS Protocol

Thank you for considering contributing to the SONGS Protocol! This document outlines the process for contributing to this project and provides guidelines to ensure a smooth collaboration experience.

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Please read it before contributing.

## How Can I Contribute?

### Reporting Bugs

Bug reports help us improve the project. When you create a bug report, please include as many details as possible:

1. **Use a clear and descriptive title**
2. **Describe the exact steps to reproduce the bug**
3. **Provide specific examples** such as code snippets or links
4. **Describe the behavior you observed and what you expected**
5. **Include screenshots or animated GIFs** if possible
6. **Include your environment details** (OS, Node.js version, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

1. **Use a clear and descriptive title**
2. **Provide a detailed description of the suggested enhancement**
3. **Explain why this enhancement would be useful**
4. **List any relevant examples** if applicable

### Pull Requests

1. **Fork the repository**
2. **Create a new branch** for your feature or bug fix
3. **Make your changes** with clear commit messages
4. **Add or update tests** as necessary
5. **Ensure all tests pass** by running `npm test`
6. **Submit a pull request** with a clear description of the changes

### Development Process

1. **Set up your environment**
   ```bash
   npm install
   ```

2. **Create a new feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes and commit them**
   ```bash
   git commit -m "Description of changes"
   ```

4. **Push your branch**
   ```bash
   git push origin feature/your-feature-name
   ```

## Style Guides

### Git Commit Messages

* Use the present tense ("Add feature" not "Added feature")
* Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
* Limit the first line to 72 characters or less
* Reference issues and pull requests after the first line
* Consider starting the commit message with an applicable emoji:
  * ✨ `:sparkles:` for new features
  * 🐛 `:bug:` for bug fixes
  * 📝 `:memo:` for documentation
  * 🔧 `:wrench:` for configuration changes
  * ♻️ `:recycle:` for refactoring

### JavaScript Style Guide

We use ESLint and Prettier to enforce a consistent code style. Please ensure your code passes linting before submitting:

```bash
npm run lint
```

### Documentation Style Guide

* Use Markdown for documentation
* Follow the [GitHub Flavored Markdown](https://guides.github.com/features/mastering-markdown/) specification
* Reference other documents using relative links
* Document all public APIs and components

## Architecture Decision Records (ADRs)

When making significant architectural decisions, please document them as ADRs:

1. Create a new ADR file using our template:
   ```bash
   npm run adr:new "decision-title"
   ```

2. Fill in the template with your decision details
3. Submit the ADR as part of your pull request

## Releasing Packages

Only maintainers can release new versions. The process uses [Changesets](https://github.com/changesets/changesets):

1. Create a changeset:
   ```bash
   npx changeset
   ```

2. Commit the changeset file
3. When ready to release:
   ```bash
   npm run publish-packages
   ```

## Questions?

Don't hesitate to reach out if you have any questions about contributing. You can contact us at gordo@songs-tools.com.

Thank you for your contributions! 