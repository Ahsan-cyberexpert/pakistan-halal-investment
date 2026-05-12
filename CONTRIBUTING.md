# Contributing to Pakistan Halal Investment Platform

Thank you for considering contributing! 🙏 This document provides guidelines and instructions.

## Code of Conduct

- ✅ Be respectful to all contributors
- ✅ Use Urdu and English comments
- ✅ Follow Islamic principles
- ✅ Test before submitting

## How to Contribute

### 1. Report Issues
- Click **"Issues"** tab
- Use bug report or feature request template
- Provide clear reproduction steps
- Include screenshots/error messages

### 2. Fix Bugs or Add Features

```bash
# 1. Fork repository (click Fork button)
# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/pakistan-halal-investment.git
cd pakistan-halal-investment

# 3. Create feature branch
git checkout -b feature/amazing-feature

# 4. Install and test
npm install
npm run dev

# 5. Make changes
# (Edit files in src/ directory)

# 6. Test your changes
npm run build
npm run lint

# 7. Commit with clear message
git add .
git commit -m "feat: Add amazing feature"

# 8. Push to your fork
git push origin feature/amazing-feature

# 9. Create Pull Request on GitHub
# Add title, description, link issues
```

## Development Setup

```bash
# Install Node.js 18+ from nodejs.org
node --version  # Verify

# Install dependencies
npm install

# Start dev server
npm run dev

# Run tests
npm run lint

# Build for production
npm run build
```

## Project Structure

```
src/
├── app/              # Next.js app router
│   ├── page.tsx      # Main dashboard
│   ├── layout.tsx    # Root layout
│   └── globals.css   # Global styles
├── components/       # React components
│   ├── VoiceAgent.tsx
│   ├── DepositFlow.tsx
│   └── WithdrawFlow.tsx
└── api/              # API routes (future)
```

## Coding Standards

### TypeScript
- Use strict types
- Avoid `any`
- Add JSDoc comments

```typescript
/**
 * Processes a deposit transaction
 * @param amount - Amount in PKR
 * @param method - Payment method
 * @returns Transaction result
 */
export async function processDeposit(
  amount: number,
  method: 'jazzcash' | 'easypaisa' | 'bank'
): Promise<TransactionResult> {
  // Implementation
}
```

### React Components
- Use functional components
- Use hooks (useState, useEffect)
- Add display names for debugging

```typescript
export default function DepositFlow({ onSuccess }: Props) {
  // Component code
}

// For named exports:
function DepositFlow({ onSuccess }: Props) {
  // Component code
}
DepositFlow.displayName = 'DepositFlow';
```

### CSS / Tailwind
- Use Tailwind classes
- Organize with `@apply` for complex styles
- Mobile-first approach

```tsx
<div className="w-full md:w-1/2 lg:w-1/3 p-4">
  Content
</div>
```

### Comments
- Write in Urdu and English
- Explain "why", not "what"
- Use for complex logic only

```typescript
// اردو میں بولی جانے والی کمانڈ کو پروسیس کریں
// Process Urdu speech commands
const command = transcript.toLowerCase();
```

## Git Workflow

1. **Branch naming:**
   - `feature/add-portfolio`
   - `fix/voice-bug`
   - `docs/update-readme`
   - `refactor/deposit-component`

2. **Commit messages:**
   ```
   feat: Add deposit confirmation dialog
   fix: Resolve PIN validation on mobile
   docs: Update API documentation
   style: Format code with Prettier
   ```

3. **Pull Request:**
   - Descriptive title
   - Reference issues: `Closes #42`
   - Explain changes
   - Tag reviewers
   - Wait for approval

## Testing Guidelines

```bash
# Test locally before submitting
npm run dev      # Start dev server
npm run build    # Check build works
npm run lint     # Check code quality
```

### Manual Testing Checklist
- [ ] Feature works on Chrome
- [ ] Feature works on Firefox
- [ ] Feature works on Safari
- [ ] Feature works on mobile
- [ ] No console errors
- [ ] Urdu text displays correctly
- [ ] Voice control works
- [ ] Form validation passes

## Documentation

- Update [README.md](README.md) for new features
- Add JSDoc comments to functions
- Update this file for new processes
- Include examples in documentation

## Translation Guidelines

- Keep UI in **Urdu (ur-PK)**
- Comments in **both Urdu and English**
- Error messages in **Urdu**
- Technical terms can stay in English

```typescript
// ہمیشہ Urdu میں UI کا متن
const labels = {
  deposit: 'ڈیپوزٹ کریں',        // Urdu
  withdraw: 'وِڈڈرا کریں',      // Urdu
  balance: 'بیلنس',             // Urdu
};
```

## Review Process

Your PR will be reviewed by maintainers:

1. **Code Review** - Check quality, style, functionality
2. **Testing** - Verify changes work correctly
3. **Documentation** - Ensure docs are updated
4. **Approval** - Get 1-2 approvals minimum
5. **Merge** - Squash and merge to main

**Expected time:** 1-3 days

## Common Issues

### ESLint Errors
```bash
npm run lint -- --fix  # Auto-fix style issues
```

### Build Fails
```bash
npm run build  # Check error message
# Fix TypeScript errors
# Try: rm -rf .next node_modules && npm install
```

### Git Conflicts
```bash
git pull origin main  # Get latest
# Manually resolve conflicts in editor
git add .
git commit -m "Resolve merge conflicts"
git push
```

## Getting Help

- 💬 **Discussions** - Ask questions
- 🐛 **Issues** - Report bugs
- 💭 **Discussions** - Suggest features
- 📧 **Email** - Contact maintainers

## Recognition

Contributors will be recognized in:
- [README.md](README.md) - Contributor list
- [CHANGELOG.md](CHANGELOG.md) - Release notes
- GitHub contributors graph

## Licensing

By contributing, you agree your code is licensed under MIT License.

---

## Quick Start Checklist

- [ ] Fork repository
- [ ] Clone to local machine
- [ ] Create feature branch
- [ ] Make changes
- [ ] Test locally
- [ ] Commit with clear message
- [ ] Push to GitHub
- [ ] Create Pull Request
- [ ] Wait for review
- [ ] Celebrate! 🎉

**Thank you for contributing to Pakistan's financial inclusion!** 🕌

Shukran! شکریہ!
