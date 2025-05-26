# Financial Copilot

A modern financial management application built with React, TypeScript, and Vite.

## Features

- 📊 Interactive financial dashboard
- 💰 Transaction management
- 📈 Financial reports and analytics
- 📱 Mobile-responsive design
- 🔒 Offline-first functionality
- 📄 PDF and Excel export capabilities
- ⚡ Global state management with Zustand

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Chart.js
- ExcelJS
- jsPDF
- date-fns
- Zustand (state management)

## Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)

## Getting Started

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd financial-copilot
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file:
   ```bash
   cp .env.example .env
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/          # Page components
├── types/          # TypeScript type definitions
├── utils/          # Utility functions
├── services/       # API calls, global stores (Zustand), business logic
├── hooks/          # Custom React hooks
└── App.tsx         # Root component
```

## State Management with Zustand

This project uses [Zustand](https://github.com/pmndrs/zustand) for global state management.

- The main store for transactions is located at `src/services/useTransactionsStore.ts`.
- Example usage:

```tsx
import { useTransactionsStore } from '../services/useTransactionsStore';

const transactions = useTransactionsStore(state => state.transactions);
const addTransaction = useTransactionsStore(state => state.addTransaction);

// Add a transaction
addTransaction({ /* ...transaction data... */ });
```

## Input Methods for Expenses & Income

Financial Copilot supports three ways to add transactions:

### 1. Manual Input
- Enter transaction details using a standard form.
- Fast and familiar for most users.

### 2. Voice Input
- Add expenses or income by speaking a command (e.g., "Add expense of 50 to groceries").
- **Technology:** Uses the Web Speech API for voice recognition and custom logic to parse commands into transaction data.
- Works best in supported browsers (Chrome, Edge, etc.).

### 3. Image Input (Receipt Scanner)
- Upload a photo of a receipt to extract transaction details automatically.
- **Technology:** Uses [Tesseract.js](https://github.com/naptha/tesseract.js) for client-side Optical Character Recognition (OCR) to read text from images.
- Extracted data is parsed and pre-filled in the transaction form for review.

These input methods make it easy to quickly record financial data in the way that works best for you, whether you're at your desk or on the go.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

