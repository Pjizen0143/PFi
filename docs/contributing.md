# Contributing Guidelines

## Branch Naming

Format: `{type}/{description}`

Types:

- `feature/` - New feature
- `fix/` - Bug fix
- `docs/` - Documentation
- `refactor/` - Code refactoring
- `test/` - Tests

Examples:

- `feature/user-authentication`
- `fix/login-bug`
- `docs/api-overview`
- `refactor/service-layer`

## Commit Conventions

Format: `{type}: {description}`

Types:

- `feat:` - Feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Code style (formatting)
- `refactor:` - Refactoring
- `test:` - Tests
- `chore:` - Maintenance

Examples:

```
feat: add user registration endpoint
fix: handle null values in response
docs: update testing guide
refactor: extract auth logic to service
test: add tests for password hashing
```

## Code Style

### Python (Backend)

- PEP 8 compliance
- Type hints required
- Max line length: 100 characters
- Use `black` for formatting

```bash
black apps/api/app
```

- Use `isort` for import ordering

```bash
isort apps/api/app
```

### TypeScript (Frontend)

- ESLint + Prettier
- Type safety required
- Functional components preferred

```bash
npm run lint
npm run format
```
