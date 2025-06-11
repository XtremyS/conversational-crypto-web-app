# Crypto Chat

A mobile-friendly React TypeScript web-chat app for querying cryptocurrency data using the CoinGecko API. Features include price queries, trending coins, basic stats, portfolio tracking, 7-day price charts, and text-to-speech responses.

## Features

- **Chat UI**: Bubble-style messages with timestamps, smooth scrolling, and modern glassmorphism styling.
- **Crypto Queries**:
  - Current price (e.g., "What's ETH trading at right now?").
  - Today's trending coins (e.g., "Show trending coins").
  - Basic stats (symbol, market cap, 24h change, description) (e.g., "ETH stats").
  - 7-day price chart (e.g., "ETH chart").
- **Portfolio Tracking**: Note holdings (e.g., "I have 2 ETH") and view live portfolio value (e.g., "Show portfolio").
- **Text-to-Speech**: Responses are spoken aloud using Web Speech API.
- **Mic Input**: Voice input via Web Speech Recognition (browser support required).
- **Error Handling**: Shows "Thinking..." during API calls and clear error messages for rate limits or invalid coins.

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd crypto-chat
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
   or
   ```bash
   yarn install
   ```
3. Install required packages:
   ```bash
   npm install react react-dom typescript tailwindcss chart.js react-chartjs-2 react-icons @types/react @types/react-dom @types/node react-scripts
   ```
4. Initialize Tailwind CSS:
   ```bash
   npx tailwindcss init
   ```
5. Ensure `tailwind.config.js` and `tsconfig.json` are configured as shown below.
6. Start the development server:
   ```bash
   npm run start
   ```
   or
   ```bash
   yarn start
   ```

## Running the App

- Open `http://localhost:5173` in a browser.
- Use commands like:
  - "What's ETH trading at right now?"
  - "Show trending coins"
  - "BTC stats"
  - "ETH chart"
  - "I have 2 ETH"
  - "Show portfolio"
- Click the mic button for voice input (supported browsers only, e.g., Chrome, Edge).

## Notes

- Uses CoinGecko's free API (rate-limited; no API key required).
- Web Speech API requires browser support (Chrome, Edge, etc.).
- Chart.js is used for rendering 7-day price charts.
- Tailwind CSS provides responsive, mobile-friendly styling with animations.
- Supports coins like ETH, BTC, BCH, LTC, XRP (case-insensitive).
- Modern UI with glassmorphism, gradients, and animations.

## Project Structure

```
crypto-chat/
├── public/
│   ├── index.html
├── src/
│   ├── components/
│   │   ├── ChatMessage.tsx
│   │   ├── InputArea.tsx
│   │   ├── PriceChart.tsx
│   ├── App.tsx
│   ├── index.css
│   ├── index.tsx
├── README.md
├── package.json
├── tsconfig.json
├── tailwind.config.js
```
