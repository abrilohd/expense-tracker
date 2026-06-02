# Contributing to Expense Tracker

Thank you for your interest in contributing to the Expense Tracker project! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Process](#development-process)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)

---

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inspiring community for all. Please be respectful and constructive in your interactions.

### Expected Behavior

- Be respectful and inclusive
- Welcome newcomers
- Focus on what is best for the community
- Show empathy towards others

### Unacceptable Behavior

- Harassment or discrimination
- Trolling or insulting comments
- Public or private harassment
- Publishing others' private information

---

## Getting Started

### Prerequisites

- Node.js 16+
- Python 3.8+
- Git
- Code editor (VS Code recommended)

### Setup Development Environment

1. **Fork the repository**

```bash
# Click "Fork" on GitHub
# Clone your fork
git clone https://github.com/YOUR_USERNAME/expense-tracker.git
cd expense-tracker
```

2. **Set up backend**

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python scripts/init_db.py
python scripts/migrate.py
```

3. **Set up frontend**

```bash
cd frontend
npm install
```

4. **Create feature branch**

```bash
git checkout -b feature/your-feature-name
```

---

## Development Process

### 1. Choose an Issue

- Browse [open issues](https://github.com/yourusername/expense-tracker/issues)
- Comment on the issue you want to work on
- Wait for assignment before starting work

### 2. Create a Branch

```bash
# Feature branch
git checkout -b feature/add-new-feature

# Bug fix branch
git checkout -b fix/fix-bug-description

# Documentation branch
git checkout -b docs/update-documentation
```

### 3. Make Changes

- Write clean, readable code
- Follow coding standards
- Add tests if applicable
- Update documentation

### 4. Test Your Changes

```bash
# Backend tests
cd backend
pytest

# Frontend type checking
cd frontend
npm run type-check

# Frontend linting
npm run lint
```

### 5. Commit Changes

```bash
git add .
git commit -m "feat: add new feature"
```

### 6. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 7. Create Pull Request

- Go to GitHub
- Click "New Pull Request"
- Fill out the PR template
- Wait for review

---

## Coding Standards

### TypeScript/React

#### File Naming
- Components: `PascalCase.tsx` (e.g., `UserProfile.tsx`)
- Utilities: `camelCase.ts` (e.g., `formatDate.ts`)
- Types: `PascalCase.ts` or `index.ts`

#### Component Structure

```typescript
/**
 * Component description
 */
import React from 'react';
import type { ComponentProps } from '@/types';

interface UserProfileProps {
  userId: number;
  onUpdate?: () => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ 
  userId, 
  onUpdate 
}) => {
  // Hooks
  const [loading, setLoading] = useState(false);
  
  // Effects
  useEffect(() => {
    // Effect logic
  }, [userId]);
  
  // Handlers
  const handleUpdate = () => {
    // Handler logic
  };
  
  // Render
  return (
    <div>
      {/* Component JSX */}
    </div>
  );
};
```

#### TypeScript Rules
- Use `interface` for props and public APIs
- Use `type` for unions and complex types
- Avoid `any` - use `unknown` if needed
- Use strict mode
- Add JSDoc comments for complex functions

#### React Best Practices
- Use functional components
- Use hooks appropriately
- Memoize expensive calculations
- Keep components small and focused
- Extract reusable logic to custom hooks

### Python/FastAPI

#### File Naming
- Modules: `snake_case.py` (e.g., `user_service.py`)
- Classes: `PascalCase`
- Functions: `snake_case`

#### Function Structure

```python
def get_user_expenses(
    user_id: int,
    start_date: date,
    end_date: date,
    db: Session
) -> List[Expense]:
    """
    Get all expenses for a user within a date range.
    
    Args:
        user_id: The user's ID
        start_date: Start of date range
        end_date: End of date range
        db: Database session
        
    Returns:
        List of expenses
        
    Raises:
        ValueError: If date range is invalid
    """
    if start_date > end_date:
        raise ValueError("Start date must be before end date")
    
    return db.query(Expense).filter(
        Expense.user_id == user_id,
        Expense.date >= start_date,
        Expense.date <= end_date
    ).all()
```

#### Python Best Practices
- Follow PEP 8
- Use type hints
- Write docstrings
- Keep functions small
- Use meaningful variable names
- Handle errors appropriately

### Code Style

#### Formatting
- **Indentation**: 2 spaces (TypeScript), 4 spaces (Python)
- **Line length**: 100 characters max
- **Quotes**: Single quotes (TypeScript), double quotes (Python)
- **Semicolons**: Optional in TypeScript (be consistent)

#### Naming Conventions
- **Variables**: `camelCase` (TS), `snake_case` (Python)
- **Constants**: `UPPER_SNAKE_CASE`
- **Classes**: `PascalCase`
- **Private**: `_prefixWithUnderscore` (Python)

---

## Commit Guidelines

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

### Examples

```bash
# Feature
git commit -m "feat(expenses): add bulk delete functionality"

# Bug fix
git commit -m "fix(auth): resolve token expiration issue"

# Documentation
git commit -m "docs(api): update endpoint documentation"

# Refactor
git commit -m "refactor(dashboard): improve chart performance"
```

### Commit Best Practices

- Write clear, concise messages
- Use present tense ("add" not "added")
- Keep subject line under 50 characters
- Add body for complex changes
- Reference issues when applicable

---

## Pull Request Process

### Before Submitting

- [ ] Code follows style guidelines
- [ ] Tests pass
- [ ] No TypeScript errors
- [ ] No linting errors
- [ ] Documentation updated
- [ ] Commits are clean and logical

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How has this been tested?

## Screenshots
If applicable, add screenshots

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings
- [ ] Tests added/updated
- [ ] All tests passing
```

### Review Process

1. **Automated Checks**
   - CI/CD pipeline runs
   - Tests must pass
   - Linting must pass

2. **Code Review**
   - At least one approval required
   - Address all comments
   - Make requested changes

3. **Merge**
   - Squash and merge (preferred)
   - Rebase and merge (for clean history)
   - Merge commit (for feature branches)

---

## Reporting Bugs

### Before Reporting

- Check existing issues
- Verify it's reproducible
- Test on latest version

### Bug Report Template

```markdown
## Bug Description
Clear description of the bug

## Steps to Reproduce
1. Go to...
2. Click on...
3. See error

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- OS: [e.g., Windows 11]
- Browser: [e.g., Chrome 120]
- Version: [e.g., 1.0.0]

## Screenshots
If applicable

## Additional Context
Any other relevant information
```

---

## Suggesting Features

### Feature Request Template

```markdown
## Feature Description
Clear description of the feature

## Problem Statement
What problem does this solve?

## Proposed Solution
How should it work?

## Alternatives Considered
Other approaches you've thought about

## Additional Context
Mockups, examples, etc.
```

### Feature Discussion

- Open an issue first
- Discuss with maintainers
- Get approval before implementing
- Consider breaking into smaller PRs

---

## Development Tips

### Useful Commands

```bash
# Backend
cd backend
pytest                          # Run tests
pytest -v                       # Verbose output
pytest --cov=app tests/        # With coverage
python scripts/migrate.py       # Run migrations

# Frontend
cd frontend
npm run dev                     # Start dev server
npm run build                   # Production build
npm run type-check             # Type checking
npm run lint                   # Linting
npm run lint:fix               # Fix linting issues
```

### Debugging

**Backend:**
```python
# Add breakpoint
import pdb; pdb.set_trace()

# Or use debugger in VS Code
```

**Frontend:**
```typescript
// Use browser DevTools
console.log('Debug:', variable);

// React DevTools
// Chrome extension for React debugging
```

### Common Issues

**Issue: Import errors**
```bash
# Backend: Ensure virtual environment is activated
source venv/bin/activate

# Frontend: Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Issue: Database errors**
```bash
# Reset database
rm backend/expenses.db
python backend/scripts/init_db.py
python backend/scripts/migrate.py
```

---

## Documentation

### When to Update Documentation

- Adding new features
- Changing existing behavior
- Fixing bugs that affect usage
- Improving setup process

### Documentation Files

- `README.md` - Project overview
- `DEVELOPMENT.md` - Development guide
- `API.md` - API reference
- `ARCHITECTURE.md` - System design
- Code comments - Complex logic

---

## Community

### Getting Help

- Check documentation first
- Search existing issues
- Ask in discussions
- Be specific and provide context

### Staying Updated

- Watch the repository
- Follow release notes
- Join discussions
- Subscribe to notifications

---

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- CHANGELOG.md

---

## Questions?

If you have questions about contributing:
1. Check this guide
2. Review existing issues/PRs
3. Open a discussion
4. Contact maintainers

---

Thank you for contributing to Expense Tracker!  

Your contributions help make this project better for everyone.
