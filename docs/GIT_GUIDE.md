# Git & GitHub Guide for Pakistan Halal Investment Platform

## Initial Setup

### 1. Install Git
- **Windows:** Download from [git-scm.com](https://git-scm.com)
- **Mac:** `brew install git`
- **Linux:** `sudo apt-get install git`

### 2. Configure Git
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### 3. Generate SSH Key (Recommended)
```bash
ssh-keygen -t ed25519 -C "your.email@example.com"
# Copy the key to GitHub: Settings → SSH and GPG keys → New SSH key
cat ~/.ssh/id_ed25519.pub
```

---

## Creating Your Repository on GitHub

1. **Log in to GitHub** → [github.com](https://github.com)
2. Click **"+"** icon → **"New repository"**
3. Name: `pakistan-halal-investment`
4. Description: `A halal investment platform for Pakistan with voice control`
5. Choose **Public** (to get contributions)
6. Check **"Add a README file"**
7. Select **".gitignore template: Node"**
8. Choose **"License: MIT"**
9. Click **"Create repository"**

---

## Connect Your Local Project to GitHub

### Option A: Using HTTPS (Simpler for beginners)
```bash
cd d:\finace\ project
git init
git add .
git commit -m "Initial commit: Pakistan Halal Investment Platform"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/pakistan-halal-investment.git
git push -u origin main
```

### Option B: Using SSH (More secure)
```bash
cd d:\finace\ project
git init
git add .
git commit -m "Initial commit: Pakistan Halal Investment Platform"
git branch -M main
git remote add origin git@github.com:YOUR_USERNAME/pakistan-halal-investment.git
git push -u origin main
```

---

## Daily Workflow

### Before you start working:
```bash
# Get latest changes from team
git pull origin main
```

### Making changes:
```bash
# Check status
git status

# Stage changes
git add .                    # All files
git add src/                 # Specific folder
git add src/components/VoiceAgent.tsx  # Specific file

# Commit with meaningful message
git commit -m "Feature: Add voice recognition in Urdu"

# Push to GitHub
git push origin main
```

### Create a Feature Branch (Recommended)
```bash
# Create and switch to new branch
git checkout -b feature/voice-recognition

# Make changes...
git add .
git commit -m "Add voice recognition feature"
git push origin feature/voice-recognition

# On GitHub: Create Pull Request (PR) to merge into main
# Team reviews → Merge → Delete branch
```

---

## Common Commands

| Command | Purpose |
|---------|---------|
| `git status` | See what changed |
| `git add .` | Stage all changes |
| `git commit -m "msg"` | Save changes with message |
| `git push` | Upload to GitHub |
| `git pull` | Download latest changes |
| `git branch` | List branches |
| `git checkout -b name` | Create new branch |
| `git log` | See commit history |
| `git diff` | See changes before committing |
| `git revert HEAD` | Undo last commit |

---

## Commit Message Guidelines

Write clear, descriptive messages:

```
✅ GOOD:
- "Add deposit flow component"
- "Fix voice recognition language bug"
- "Update transaction history display"

❌ BAD:
- "fixed stuff"
- "update"
- "asd"
```

**Format:**
```
[TYPE] Brief description (50 chars max)

Longer explanation if needed
- Bullet points for details
```

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`

Examples:
```
feat: Add voice control for withdrawal
fix: Resolve PIN validation error
docs: Update GitHub integration guide
```

---

## Managing Collaborators

1. Go to repository → **Settings** → **Collaborators**
2. Click **"Add people"**
3. Search for GitHub username
4. Choose permission level:
   - **Pull** - View only
   - **Triage** - Labels, milestones
   - **Push** - Full write access
   - **Admin** - Full access + settings

---

## GitHub Issues & Pull Requests

### Creating an Issue
1. Click **"Issues"** tab
2. Click **"New issue"**
3. Title: Clear description
4. Description: Details, steps, expected vs actual
5. Add labels: `bug`, `enhancement`, `documentation`
6. Add to project/milestone
7. Submit

### Creating a Pull Request (PR)
1. Push your branch
2. Click **"Compare & pull request"** on GitHub
3. Title & description
4. Link related issues: `Closes #123`
5. Request reviewers
6. Wait for approval → Merge
7. Delete branch

---

## Troubleshooting

### "Permission denied (publickey)"
```bash
# Add SSH key to ssh-agent
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519

# Test connection
ssh -T git@github.com
```

### "fatal: origin already exists"
```bash
# Remove old remote
git remote remove origin

# Add new one
git remote add origin https://github.com/USERNAME/REPO.git
```

### "Your branch is ahead of origin"
```bash
# Push changes
git push origin main
```

### "Merge conflicts"
```bash
# Edit conflicted files manually
# Look for: <<<<<<< HEAD ... ======= ... >>>>>>>
# Keep what you want, delete markers
git add .
git commit -m "Resolve merge conflicts"
git push
```

---

## Best Practices

1. ✅ **Commit frequently** - Small, focused commits
2. ✅ **Write clear messages** - Team needs to understand changes
3. ✅ **Pull before push** - Avoid conflicts
4. ✅ **Create branches** - Don't work directly on `main`
5. ✅ **Review PRs** - Get feedback before merging
6. ✅ **Keep main stable** - Only tested code on main
7. ✅ **Use `.gitignore`** - Don't commit node_modules, .env, etc.

---

## Resources

- [GitHub Docs](https://docs.github.com)
- [Git Cheat Sheet](https://git-scm.com/docs)
- [How to Write a Git Commit Message](https://chris.beams.io/posts/git-commit/)
- [GitHub Flow](https://guides.github.com/introduction/flow/)

---

**Ready to code? Start with:**
```bash
git pull origin main
git checkout -b feature/your-feature
# Make changes...
git push origin feature/your-feature
# Open Pull Request!
```
