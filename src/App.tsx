import React, { useState, useEffect, useRef } from "react";
import ChatMessage from "./components/ChatMessage";
import InputArea from "./components/InputArea";
import PriceChart from "./components/PriceChart";
import { FaInfoCircle } from "react-icons/fa";
import "./index.css";

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: string;
}

interface Portfolio {
  [symbol: string]: number;
}

interface PriceData {
  prices: [number, number][];
}

const coinMap: { [key: string]: string } = {
  eth: "ethereum",
  ethereum: "ethereum",
  btc: "bitcoin",
  bitcoin: "bitcoin",
  bch: "bitcoin-cash",
  "bitcoin cash": "bitcoin-cash",
  ltc: "litecoin",
  litecoin: "litecoin",
  xrp: "ripple",
  ripple: "ripple",
};

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [portfolio, setPortfolio] = useState<Portfolio>({});
  const [chartData, setChartData] = useState<PriceData | null>(null);
  const [isInfoOpen, setIsInfoOpen] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const synthRef = useRef<SpeechSynthesis>(window.speechSynthesis);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    synthRef.current.speak(utterance);
  };

  const addMessage = (text: string, isUser: boolean) => {
    const timestamp = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    setMessages((prev) => [
      ...prev,
      { id: prev.length, text, isUser, timestamp },
    ]);
  };

  const getCoinId = (input: string): string => {
    const lowerInput = input.toLowerCase();
    const coinKey = Object.keys(coinMap).find((key) =>
      lowerInput.includes(key)
    );
    return coinMap[coinKey] || "bitcoin";
  };

  const fetchPrice = async (coin: string) => {
    try {
      const coinId = getCoinId(coin);
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${coinId}`
      );
      if (response.status === 429) throw new Error("API rate limit exceeded");
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      const price = data.market_data.current_price.usd;
      const text = `${data.name} is currently trading at $${price.toFixed(
        2
      )} USD.`;
      addMessage(text, false);
      speak(text);
    } catch (error: any) {
      const errorMessage =
        error.message === "coin not found"
          ? `Coin "${coin}" not found. Try "ETH", "BTC", "LTC", or others.`
          : "Error fetching price. Please try again later.";
      addMessage(errorMessage, false);
    }
  };

  const fetchTrending = async () => {
    try {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/search/trending"
      );
      if (response.status === 429) throw new Error("API rate limit exceeded");
      const data = await response.json();
      const coins = data.coins
        .slice(0, 5)
        .map((coin: any) => coin.item.name)
        .join(", ");
      const text = `Today's trending coins: ${coins}.`;
      addMessage(text, false);
      speak(text);
    } catch (error) {
      addMessage(
        "Error fetching trending coins. Please try again later.",
        false
      );
    }
  };

  const fetchStats = async (coin: string) => {
    try {
      const coinId = getCoinId(coin);
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${coinId}`
      );
      if (response.status === 429) throw new Error("API rate limit exceeded");
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      const text = `
${data.name} (${data.symbol.toUpperCase()}):
Market Cap: $${(data.market_data.market_cap.usd / 1e9).toFixed(2)}B
24h Change: ${data.market_data.price_change_percentage_24h.toFixed(2)}%
Description: ${
        data.description.en.split(".")[0] || "No description available."
      }.
      `;
      addMessage(text, false);
      speak(text);
    } catch (error: any) {
      const errorMessage =
        error.message === "coin not found"
          ? `Coin "${coin}" not found. Try "ETH", "BTC", "LTC", or others.`
          : "Error fetching stats. Please try again later.";
      addMessage(errorMessage, false);
    }
  };

  const fetchChartData = async (coin: string) => {
    try {
      const coinId = getCoinId(coin);
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=7`
      );
      if (response.status === 429) throw new Error("API rate limit exceeded");
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setChartData(data);
      addMessage(`Showing 7-day price chart for ${coin.toUpperCase()}.`, false);
      speak(`Showing 7-day price chart for ${coin.toUpperCase()}.`);
    } catch (error: any) {
      const errorMessage =
        error.message === "coin not found"
          ? `Coin "${coin}" not found. Try "ETH", "BTC", "LTC", or others.`
          : "Error fetching chart data. Please try again later.";
      addMessage(errorMessage, false);
    }
  };

  const handlePortfolio = (input: string) => {
    const match = input.match(/I have (\d+\.?\d*) (\w+)/i);
    if (match) {
      const amount = parseFloat(match[1]);
      const symbol = match[2].toUpperCase();
      setPortfolio((prev) => ({ ...prev, [symbol]: amount }));
      addMessage(`Noted: You have ${amount} ${symbol}.`, false);
      speak(`Noted: You have ${amount} ${symbol}.`);
    }
  };

  const fetchPortfolioValue = async () => {
    try {
      const symbols = Object.keys(portfolio)
        .map((s) => coinMap[s.toLowerCase()] || s.toLowerCase())
        .join(",");
      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${symbols}&vs_currencies=usd`
      );
      if (response.status === 429) throw new Error("API rate limit exceeded");
      const data = await response.json();
      let total = 0;
      const text = Object.entries(portfolio)
        .map(([symbol, amount]: [string, number]) => {
          const price =
            data[coinMap[symbol.toLowerCase()] || symbol.toLowerCase()]?.usd ||
            0;
          const value = price * amount;
          total += value;
          return `${amount} ${symbol}: $${value.toFixed(2)}`;
        })
        .join("\n");
      addMessage(
        `Your portfolio:\n${text}\nTotal Value: $${total.toFixed(2)} USD`,
        false
      );
      speak(`Your portfolio total value is $${total.toFixed(2)} USD`);
    } catch (error) {
      addMessage(
        "Error fetching portfolio value. Please try again later.",
        false
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    addMessage(input, true);
    setInput("");
    setIsLoading(true);

    const lowerInput = input.toLowerCase();
    if (lowerInput.includes("price") || lowerInput.includes("trading at")) {
      const coin =
        lowerInput.match(
          /eth|ethereum|bitcoin|btc|bch|bitcoin cash|ltc|litecoin|xrp|ripple/i
        )?.[0] || "bitcoin";
      await fetchPrice(coin);
    } else if (lowerInput.includes("trending")) {
      await fetchTrending();
    } else if (lowerInput.includes("stats") || lowerInput.includes("info")) {
      const coin =
        lowerInput.match(
          /eth|ethereum|bitcoin|btc|bch|bitcoin cash|ltc|litecoin|xrp|ripple/i
        )?.[0] || "bitcoin";
      await fetchStats(coin);
    } else if (lowerInput.includes("chart")) {
      const coin =
        lowerInput.match(
          /eth|ethereum|bitcoin|btc|bch|bitcoin cash|ltc|litecoin|xrp|ripple/i
        )?.[0] || "bitcoin";
      await fetchChartData(coin);
    } else if (lowerInput.includes("i have")) {
      handlePortfolio(input);
    } else if (lowerInput.includes("portfolio")) {
      await fetchPortfolioValue();
    } else {
      addMessage(
        "Sorry, I can help with crypto prices, trending coins, stats, charts, or portfolio tracking. Try asking about those!",
        false
      );
      speak(
        "Sorry, I can help with crypto prices, trending coins, stats, charts, or portfolio tracking. Try asking about those!"
      );
    }
    setIsLoading(false);
  };

  const handleMicClick = () => {
    const recognition = new (window.SpeechRecognition ||
      window.webkitSpeechRecognition)();
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      handleSubmit({ preventDefault: () => {} } as React.FormEvent);
    };
    recognition.start();
  };

  const toggleInfoWindow = () => {
    setIsInfoOpen((prev) => !prev);
  };

  return (
    <div className="h-screen bg-gradient-to-br from-indigo-950 via-gray-900 to-black text-white flex justify-center font-sans">
      <div className="min-h-screen flex flex-col w-full max-w-lg relative">
        <header className="p-4 bg-gradient-to-r from-indigo-900 to-gray-800 shadow-lg rounded-lg">
          <h1 className="text-2xl font-bold tracking-wide text-center">
            Crypto Chat Bot
          </h1>
        </header>
        <div className="flex-1 p-6 overflow-y-auto space-y-4 scroll-container">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          {isLoading && (
            <div className="text-gray-400 text-center animate-pulse">
              Thinking...
            </div>
          )}
          {chartData && <PriceChart data={chartData} />}
          <div ref={messagesEndRef} />
        </div>
        <InputArea
          input={input}
          setInput={setInput}
          handleSubmit={handleSubmit}
          handleMicClick={handleMicClick}
        />

        <button
          onClick={toggleInfoWindow}
          className="fixed bottom-22  p-3 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 hover:scale-110 transition-all duration-300 z-50"
        >
          <FaInfoCircle className="w-6 h-6" />
        </button>

        {isInfoOpen && (
          <div className="fixed bottom-34  w-72 p-4 bg-gray-800/80 backdrop-blur-md rounded-xl shadow-xl border border-gray-700/50 animate-slideIn z-50">
            <h2 className="text-lg font-semibold mb-2 text-indigo-400">
              Supported Commands
            </h2>
            <ul className="text-sm text-gray-200 space-y-2">
              <li>
                <span className="font-medium text-indigo-300">Price:</span>{" "}
                "What's ETH trading at right now?" or "BTC price"
              </li>
              <li>
                <span className="font-medium text-indigo-300">Trending:</span>{" "}
                "Show trending coins"
              </li>
              <li>
                <span className="font-medium text-indigo-300">Stats:</span> "ETH
                stats" or "BTC info"
              </li>
              <li>
                <span className="font-medium text-indigo-300">Chart:</span> "ETH
                chart" or "BTC chart"
              </li>
              <li>
                <span className="font-medium text-indigo-300">Portfolio:</span>{" "}
                "I have 2 ETH" then "Show portfolio"
              </li>
            </ul>
            <div className="mt-4">
              <p className="text-sm text-gray-400">
                <span className="font-medium text-indigo-300">
                  Supported Coins:
                </span>{" "}
                ETH, BTC, BCH, LTC, XRP
              </p>
              <p className="text-sm text-gray-400 mt-1">
                <span className="font-medium text-indigo-300">Features:</span>{" "}
                Text-to-speech, voice input (mic), 7-day price charts
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
