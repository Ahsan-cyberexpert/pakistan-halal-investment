# Pakistan Halal Investment Platform 🕌

A modern, voice-controlled halal investment platform built for Pakistan with Urdu language support.

## Features

✨ **Core Features:**
- 💰 Deposit & Withdraw functionality
- 🎤 Urdu voice control (Speech Recognition API)
- 📊 Real-time dashboard with balance tracking
- 📱 Mobile payment integration (JazzCash, EasyPaisa)
- 🏦 Bank transfer support
- 📈 Transaction history
- 🔐 PIN-based security

## Tech Stack

- **Frontend:** Next.js 14 + React 18 + TypeScript
- **Styling:** Tailwind CSS
- **Language:** Urdu (Right-to-Left support)
- **APIs:** Web Speech API, Speech Synthesis

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/pakistan-halal-investment.git
cd pakistan-halal-investment

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/
│   ├── layout.tsx       # Root layout with RTL support
│   ├── page.tsx         # Main dashboard
│   └── globals.css      # Global styles
├── components/
│   ├── VoiceAgent.tsx   # Voice control component
│   ├── DepositFlow.tsx  # Deposit workflow
│   └── WithdrawFlow.tsx # Withdraw workflow
└── api/                 # API routes (future expansion)
```

## How to Use

### Voice Commands (Urdu)
- **"ڈیپوزٹ"** - Start deposit process
- **"وِڈڈرا"** - Start withdrawal process
- **"بیلنس"** - Check balance

### Manual Process
1. Click 💰 **ڈیپوزٹ** or 💸 **وِڈڈرا** button
2. Enter amount (minimum PKR 100)
3. Select payment method
4. Enter 4-digit PIN
5. Confirm transaction

## GitHub Integration

### Connect Your Account
1. Create a GitHub account at [github.com](https://github.com)
2. Create a new repository named `pakistan-halal-investment`
3. In VS Code: **Ctrl+Shift+P** → "Git: Clone" → paste repo URL
4. Or use terminal:

```bash
git clone https://github.com/yourusername/pakistan-halal-investment.git
```

### Push Code to GitHub

```bash
# Initialize git (if not cloned)
git init
git add .
git commit -m "Initial commit: Pakistan Halal Investment Platform"
git branch -M main
git remote add origin https://github.com/yourusername/pakistan-halal-investment.git
git push -u origin main
```

### Everyday Git Workflow

```bash
# Check status
git status

# Make changes and stage them
git add .

# Commit with a message
git commit -m "Feature: Added portfolio view"

# Push to GitHub
git push
```

## API Endpoints (Future)

- `POST /api/transactions/deposit` - Process deposit
- `POST /api/transactions/withdraw` - Process withdrawal
- `GET /api/transactions` - Get transaction history
- `GET /api/balance` - Get current balance

## Halal Investment Guidelines

This platform follows Islamic Sharia principles:
- ✅ No interest (Riba) based transactions
- ✅ Compliant with Islamic banking standards
- ✅ Halal investment options only
- ✅ Transparent fee structure

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support & Contact

For support, open an issue on GitHub or contact via email.

## Roadmap

- 🔄 Multi-currency support
- 📊 Investment portfolio analytics
- 🤖 AI-powered recommendations
- 📱 Mobile app (React Native)
- 🔗 Blockchain integration for transparency
- 💳 Card integration

---

**Made with ❤️ for Pakistan's Financial Inclusion**

Assalamu Alaikum! اس ہالال سرمایہ کاری پلیٹ فارم کو استعمال کریں۔
