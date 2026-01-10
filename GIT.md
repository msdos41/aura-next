# Git Repository Information

## Repository Details

- **Owner**: msdos41
- **Repository Name**: Aura-Next
- **Repository URL**: https://github.com/msdos41/aura-next.git
- **Clone URL**: https://github.com/msdos41/aura-next.git
- **Branch**: main

## Git Configuration

```bash
# Current git user
User: msdos41
Email: tjm.mosquito@gmail.com
```

## Commit & Push Workflow

### After Making Changes

1. **Review changes**
   ```bash
   git status
   git diff
   ```

2. **Stage all changes**
   ```bash
   git add .
   ```

3. **Commit changes** (use descriptive commit messages)
   ```bash
   git commit -m "feat: add description of changes"
   ```

4. **Push to GitHub**
   ```bash
   git push
   ```

### Commit Message Format

Use conventional commits:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

Examples:
- `feat: implement window snap layouts`
- `fix: resolve window maximization bug`
- `docs: update README with new features`

### Pull Changes from GitHub

If you've made changes on GitHub directly:
```bash
git pull origin main
```

## Branch Management

### Create New Branch
```bash
git checkout -b feature/your-feature-name
```

### Switch Branch
```bash
git checkout main
```

### Merge Branch
```bash
git checkout main
git merge feature/your-feature-name
git push
```

### Delete Branch (after merge)
```bash
git branch -d feature/your-feature-name
git push origin --delete feature/your-feature-name
```

## Useful Commands

```bash
# View commit history
git log --oneline

# View remote repositories
git remote -v

# Show recent commits
git log -10 --graph --oneline --all

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Discard uncommitted changes
git checkout -- .

# View file changes
git diff <filename>
```

## GitHub Actions

- Repository is configured for automatic checks (if setup)
- Main branch is protected (if configured)
- Pull request requirements (if configured)

## Notes

- Always review changes before committing
- Commit frequently with meaningful messages
- Pull before pushing to avoid conflicts
- Test changes after pulling from remote
