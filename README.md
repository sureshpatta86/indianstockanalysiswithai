# Indian Stock Analysis

AI-powered fundamental analysis tool for Indian listed stocks (NSE/BSE). Get comprehensive 3-pillar analysis — **Fundamentals**, **Technicals**, and **Sentiment**  — powered by OpenAI or Anthropic LLMs with live market data from Yahoo Finance.

## Features

- **Fast Mode** — Single-call analysis using GPT-5.4 / Claude Sonnet
- **Deep Mode** — Two-step reasoning pipeline (data collection → deep analysis with GPT-5.4-Pro)
- **Live Market Data** — Real-time CMP, 52-week range, volume from Yahoo Finance
- **Streaming Response** — Progressive rendering as analysis is generated
- **Dark Mode** — Default dark theme with toggle support

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **AI SDK**: Vercel AI SDK with OpenAI & Anthropic providers
- **Styling**: Tailwind CSS v4
- **Language**: TypeScript (strict mode)

## Getting Started

### Prerequisites

- Node.js 20+
- An OpenAI API key (or Anthropic API key)

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/sureshpatta86/indianstockanalysis.git
   cd indianstockanalysis
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create your environment file:
   ```bash
   cp .env.example .env
   ```

4. Edit `.env` and add your API keys (see [Environment Variables](#environment-variables)).

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `AI_PROVIDER` | Yes | `"openai"` or `"anthropic"` |
| `OPENAI_API_KEY` | If using OpenAI | Your OpenAI API key |
| `OPENAI_MODEL` | No | Model for fast mode (default: `gpt-5.4`) |
| `OPENAI_DEEP_MODEL` | No | Model for deep mode (default: `gpt-5.4-pro`) |
| `ANTHROPIC_API_KEY` | If using Anthropic | Your Anthropic API key |
| `ANTHROPIC_MODEL` | No | Anthropic model (default: `claude-sonnet-4-20250514`) |

See `.env.example` for a template.

## Deployment (Vercel)

This app is designed for deployment on [Vercel](https://vercel.com).

1. Push code to GitHub
2. Import the repository at [vercel.com/new](https://vercel.com/new)
3. Add all environment variables in Project Settings → Environment Variables
4. Deploy

> **Note:** The API route uses `maxDuration = 300` (5 minutes). This requires a **Vercel Pro plan** or higher. The Hobby (free) plan limits functions to 60 seconds, which is insufficient for LLM-based analysis.

## License

Private
