# Contributing to $W3J

Thank you for your interest in contributing to $W3J! This document provides guidelines and instructions for contributing.

## 🎯 Ways to Contribute

- **Report Bugs**: Submit detailed bug reports
- **Suggest Features**: Propose new features or improvements
- **Submit Pull Requests**: Fix bugs or implement features
- **Improve Documentation**: Help us improve our docs
- **Share**: Tell others about $W3J

## 🐛 Reporting Bugs

When reporting bugs, please include:

1. **Description**: Clear description of the issue
2. **Steps to Reproduce**: Detailed steps to reproduce the bug
3. **Expected Behavior**: What you expected to happen
4. **Actual Behavior**: What actually happened
5. **Environment**: 
   - OS (Windows/Mac/Linux)
   - Node.js version
   - Browser (if frontend issue)
6. **Screenshots**: If applicable

## 💡 Suggesting Features

For feature requests, please:

1. Check if the feature already exists or is planned
2. Describe the feature and its use case
3. Explain why it would be valuable
4. Provide examples if possible

## 🔧 Development Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/your-username/w3j.git
   cd w3j
   ```
3. Create a branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. Run the setup script:
   ```bash
   ./setup.sh
   ```
5. Make your changes
6. Test thoroughly
7. Commit with clear messages:
   ```bash
   git commit -m "feat: add new scraper for XYZ platform"
   ```
8. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
9. Create a Pull Request

## 📝 Commit Message Guidelines

Follow these conventions:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

Examples:
- `feat: add LinkedIn scraper support`
- `fix: resolve Telegram posting error`
- `docs: update installation instructions`

## 🧪 Testing

Before submitting a PR:

1. Test the backend:
   ```bash
   cd backend
   npm test  # when tests are available
   ```

2. Test the frontend:
   ```bash
   cd frontend
   npm test  # when tests are available
   ```

3. Manual testing:
   - Test login/logout
   - Test adding/editing sources
   - Test manual scraping
   - Test Telegram posting
   - Check responsive design

## 📋 Pull Request Process

1. **Update Documentation**: If you change functionality, update README.md
2. **Follow Code Style**: Maintain consistent code style
3. **Test Your Changes**: Ensure everything works
4. **Describe Your PR**: 
   - What does it do?
   - Why is it needed?
   - How to test it?
5. **Link Issues**: Reference related issues
6. **Be Patient**: Reviews may take time

## 🎨 Code Style

### JavaScript/React

- Use ES6+ features
- Use functional components and hooks
- Follow React best practices
- Use meaningful variable names
- Add comments for complex logic
- Keep functions small and focused

### CSS

- Use BEM naming when applicable
- Maintain the terminal aesthetic
- Ensure responsive design
- Use CSS variables for theming

## 🏗️ Architecture

### Backend Structure
```
backend/
├── models/       # MongoDB schemas
├── routes/       # API endpoints
├── middleware/   # Express middleware
├── utils/        # Utility functions
└── server.js     # Main server file
```

### Frontend Structure
```
frontend/src/
├── components/   # Reusable components
├── pages/        # Page components
├── utils/        # Utilities (API, helpers)
└── styles/       # Global styles
```

## 🔐 Security

- Never commit sensitive data (.env files, tokens, etc.)
- Use environment variables for secrets
- Follow security best practices
- Report security issues privately

## 📜 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## ❓ Questions?

Feel free to:
- Open an issue for questions
- Join discussions
- Reach out to maintainers

## 🙏 Thank You!

Every contribution, no matter how small, helps make $W3J better for everyone!

---

Happy coding! 🚀
