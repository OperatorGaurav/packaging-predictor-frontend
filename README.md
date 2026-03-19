# 📦 Packaging Success Predictor

An AI-powered full-stack web application that analyzes product packaging and predicts its market success likelihood — powered by real data from 2,000 packaging products.

---

## 🌐 Live Demo

- **Frontend:** [packaging-frontend-v3.vercel.app](https://packaging-frontend-v3.vercel.app)
- **Backend API:** [packaging-backend-v3.onrender.com](https://packaging-backend-v3.onrender.com)

---

## 🏗 Architecture

```
Frontend (React + Vite)          → Vercel
        |
Backend API (Node.js + Express)  → Render
        |
Database (MongoDB Atlas)          → Free Cloud DB
        |
AI Layer (OpenRouter - Free)
   |              |
Dataset RAG      LLM Vision
(2000 products)  (Analysis)
```

---

## ✨ Features

- 📦 **Packaging Analysis** — Upload image + fill product details → get instant AI analysis
- 📊 **Dataset-Powered** — Results benchmarked against 2,000 real packaging products
- 💡 **Improvement Recommendations** — AI suggests specific fixes based on top performers
- 📋 **History** — All analyzed products saved to MongoDB
- 🎯 **5 Scoring Dimensions** — Visual Appeal, Brand Clarity, Shelf Impact, Audience Fit, Trust Signals
- 🔍 **RAG System** — Retrieves similar successful products as context for better recommendations

---

## 🧠 How the AI Works

```
User uploads packaging
        ↓
System searches 2000-product CSV dataset
        ↓
Finds similar successful products by category + brand tier
        ↓
Extracts benchmarks (avg engagement, CTR, contrast ratio, top palettes)
        ↓
AI analyzes packaging using dataset as context
        ↓
Results reference real data numbers
```

---

## 📊 Dataset Columns Used

| Column | Used For |
|---|---|
| `category` + `brand_tier` | Finding similar products |
| `engagement_score` | Benchmarking success |
| `palette_name` | Recommending best colors |
| `typography_style` | Recommending best fonts |
| `contrast_ratio` | Visual appeal scoring |
| `readability_score` | Brand clarity scoring |
| `click_through_rate` | Predicting shelf impact |
| `emotion_label` | Audience fit scoring |
| `successful_design` | Filtering only winners |

---

## 🚀 Local Setup

### Prerequisites
- Node.js 20+
- MongoDB Atlas account (free)
- OpenRouter API key (free)

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Fill in your API keys in .env
npm run dev
```

Backend runs on: `http://localhost:5000`

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: `http://localhost:5173`

---

## ⚙️ Environment Variables

### Backend `.env`

```
OPENROUTER_API_KEY=sk-or-xxxxxxxxxx
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/packaging_predictor
PORT=5000
```

---

## 📁 Project Structure

```
packaging-predictor/
├── backend/
│   ├── ai/
│   │   ├── aiLayer.js          # LLM analysis + recommendations
│   │   └── datasetLoader.js    # CSV dataset search + benchmarks
│   ├── data/
│   │   └── dataset.csv         # 2000 product dataset
│   ├── models/
│   │   └── Product.js          # MongoDB schema
│   ├── routes/
│   │   └── products.js         # API endpoints
│   ├── server.js               # Express server
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx             # Main UI with 3 tabs
│   │   ├── ScoreRing.jsx       # Animated score ring SVG
│   │   ├── api.js              # Backend API calls
│   │   └── main.jsx            # React entry point
│   ├── index.html
│   └── package.json
└── README.md
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/products/analyze` | Analyze packaging with AI |
| `POST` | `/api/products/recommend` | Get improvement recommendations |
| `GET` | `/api/products` | Get all analyzed products |
| `GET` | `/api/products/dataset-stats` | Get dataset statistics |
| `GET` | `/api/products/category-benchmarks/:category` | Get category benchmarks |
| `GET` | `/health` | Health check |

---

## 🏆 Verdict Levels

| Score | Verdict |
|---|---|
| 75–100 | ✅ Strong Contender |
| 50–74 | 🟡 Market Ready |
| 30–49 | 🟠 Needs Work |
| 0–29 | 🔴 High Risk |

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, CSS-in-JS |
| Backend | Node.js, Express |
| Database | MongoDB Atlas |
| AI | OpenRouter (free), RAG pipeline |
| Dataset | CSV with 2,000 packaging products |
| Deployment | Vercel (frontend), Render (backend) |

---

## 💰 Cost

Everything is **100% free**:
- MongoDB Atlas M0: Free forever
- OpenRouter free models: Free
- Vercel: Free tier
- Render: Free tier

---

## 🔐 Security Notes

- Never commit `.env` files to GitHub
- Keep backend repo **private**
- Store all API keys in Render environment variables
- `.gitignore` includes `node_modules`, `dist`, `.env`

---

## 📈 Future Improvements

- [ ] Add more product categories to dataset
- [ ] User authentication
- [ ] Export analysis as PDF report
- [ ] Compare multiple products side by side
- [ ] Add competitor analysis feature

---

## 👨‍💻 Author

Built with ❤️ using React, Node.js, MongoDB and OpenRouter AI
