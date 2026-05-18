# 🇵🇰 Roziq Halal Wealth OS — Sovereign Edition

![Roziq Banner](https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80&w=1600)

> **Empowering the Ummah with Shariah-Compliant, Autonomous, & Sovereign Financial Intelligence.**

**Roziq** is a state-of-the-art, mobile-first Halal Wealth Operating System designed specifically for the Pakistani and global Islamic financial ecosystem. Built to bridge the gap between cutting-edge AI automation and strict Islamic jurisprudence (Fiqh al-Muamalat), Roziq provides an all-in-one sovereign platform for ethical wealth accumulation, automated purification, and legacy planning.

---

## 🌟 Key Innovations & Architectural Pillars

### 1. 🤖 Master Roziq AI Guardian (Voice & Text)
*   **Unified Intelligence:** Replaces fragmented AI tabs with a single, pervasive AI Guardian accessible via a floating action button across the entire OS.
*   **Context-Aware Advice:** Directly linked to the user's live wallet balance, asset holdings, and transaction history to provide personalized, real-time Shariah rulings and financial strategies.
*   **Multimodal Interaction:** Supports natural language voice input and text chat in both **English** and **Urdu**, breaking down financial literacy barriers.

### 2. 🏛️ Sovereign Zakat Vault & Algorithmic Tathir
*   **National Zakat Vault:** Automates the calculation of 2.5% Zakat on total net worth (cash + portfolio assets) with direct routing to verified state and charitable repositories (Edhi, Indus Hospital, TCF).
*   **Tathir Router (Dividend Purification):** Implements **AAOIFI Standard No. 21** by automatically isolating and purifying impure dividend yields (e.g., 2.8% interest contamination) from corporate holdings before they mix with halal capital.

### 3. 🛡️ Wali AI Autopilot (Premium Elite Tier)
*   **Autonomous Halal Trading:** An elite, algorithmic trading guardian that continuously scans the Pakistan Stock Exchange (PSX) for high-yield, Shariah-compliant equities.
*   **Sovereign Entry Barrier:** To maintain elite stability and prevent market volatility, Wali AI is strictly gated. Users must demonstrate a proven track record of **25 Crore PKR Invested** and **50 Crore PKR Realized Profit** to unlock autonomous execution.
*   **Macroeconomic Alignment:** Evaluates equities not just on profit, but on sovereign GDP impact, job creation, and debt-to-equity ratios (<37%).

### 4. 📱 Mobile-First "Micro-Sizing" UI/UX
*   **Zero-Clutter Navigation:** Eliminated redundant tabs and implemented an elegant 5-pillar bottom navigation bar (Home, Stocks, Assets, Family, Zakat).
*   **Adaptive Fluid Density:** Every component is meticulously engineered with responsive padding (`p-4 sm:p-6`), typography (`text-xs sm:text-sm`), and compact grid layouts to eliminate excessive vertical scrolling and provide a thumb-friendly premium experience.
*   **Bilingual Glassmorphism:** Features stunning dark/light glassmorphic aesthetics with complete bi-directional support (LTR English / RTL Urdu).

---

## 🛠️ Technology Stack

*   **Core Framework:** Next.js 16 (App Router, Server & Client Components)
*   **Language:** TypeScript (Strict Typing & Interface Definitions)
*   **Styling:** Tailwind CSS (Custom utility classes, glassmorphic overlays, responsive micro-sizing)
*   **State Management:** Reactive React Hooks (`useState`, `useEffect`, `useMemo`) + LocalStorage Persistence (Keyed by user CNIC for sovereign demo session management)
*   **AI Engine:** Google Gemini AI API integration (`/api/chat`, `/api/agent/autopilot`)
*   **Security:** Cryptographic 4-Digit PIN Gateways (`PinSecurity.tsx`) for trading authorization and capital transfers.

---

## 🚀 Quick Start & Local Setup

### Prerequisites
*   Node.js (v18.17.0 or higher)
*   npm (v9.0.0 or higher)
*   A valid Google Gemini API Key (`GEMINI_API_KEY`)

### Installation

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/Ahsan-cyberexpert/pakistan-halal-investment.git
   cd pakistan-halal-investment
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the root directory:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   FMP_API_KEY=your_financial_modeling_prep_key_here
   ```

4. **Run the Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

5. **Production Build:**
   ```bash
   npm run build
   npm run start
   ```

---

## 📱 Hackathon Demo Guide

When presenting Roziq Wealth OS to hackathon judges, follow this interactive walkthrough:

1. **Onboarding & Auth Gate:** Launch the app to see the bilingual splash screen. Enter your CNIC and PIN (`1234` default) to unlock your Sovereign Account.
2. **Master AI Guardian:** Click the floating `🤖` button at the bottom right. Ask the AI in Urdu or English: *"What is my current balance and is my portfolio Halal?"* Watch it respond using live wallet data!
3. **Halal Stock Scanner:** Navigate to the **Stocks (`💼`)** tab. View real-time Shariah compliance scores. Click **Buy** on `SYS` (Systems Ltd) to trigger the secure 4-digit PIN confirmation gateway.
4. **Wali AI Autopilot:** Navigate to **Settings (`⚙️`)** -> **Elite Services**. Show the judges the strict **25 Crore / 50 Crore** progress bar that protects the sovereign economy from speculative retail panic.
5. **Purification & Zakat:** Go to the **Zakat (`🕋`)** tab. Demonstrate the **Tathir Router** instantly purifying 2.8% impure dividend earnings with 1-click routing to the Edhi Foundation.

---

## 📜 Shariah Compliance & Governance

Roziq strictly adheres to the governance frameworks established by the **Accounting and Auditing Organization for Islamic Financial Institutions (AAOIFI)**, specifically:
*   **AAOIFI Standard No. 21:** Rules for shares and dividend purification.
*   **PSX Shariah Screening Criteria:** Debt-to-Asset ratio < 37%, Illiquid-to-Total Asset ratio > 25%, Net Liquid Asset vs Share Price screening.

> *"And Allah has permitted trade and forbidden interest."* — Quran 2:275

---

## 📄 License & Hackathon Disclaimer

Developed for the 2026 Advanced AI & FinTech Hackathon. All mock financial data, stock tickers, and sovereign vault simulations are designed for demonstration and architectural evaluation purposes.
