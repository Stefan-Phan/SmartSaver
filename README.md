# SmartSaver - Your AI-powered Money Tracker

SmartSaver is a full-stack web application developed during a Hackathon by a team of three members. It helps users efficiently manage their personal finances through expense tracking, savings calculation, and AI-driven financial advice. Users can even customize the tone of the AI assistant to make interactions more fun and engaging.

---

## 🚀 Project Overview

SmartSaver was inspired by the need to better understand and control personal spending habits. It combines traditional expense tracking with cutting-edge AI features for a smarter and more interactive money management experience.

**Key Features:**

- 💸 **Expense Tracking:** Categorize and monitor your spending across various categories.
- 🔔 **Daily Notifications:** Stay updated on your financial habits using **Sonner** notifications.
- 📊 **Financial Visualization:** View trends with charts powered by **react-chartjs-2**.
- 🧠 **AI-powered Advice (Google Gemini):** Receive context-aware, personalized financial suggestions powered by Retrieval-Augmented Generation (RAG).
- 🎭 **Tone Modulation:** Choose your AI assistant's personality – serious, friendly, funny, or even angry!
- 💰 **Savings Calculation:** Automatically track your savings based on income and expenses.
- 🔐 **Secure Login System:** Uses **bcrypt** for password hashing and **JWT** for session management.
- ⚙️ **Custom Settings:** Tailor the app to your personal financial goals.
- 🔄 **Socket.IO:** Real-time notifications when spending exceeds set thresholds (e.g., 50% of a weekly category budget).

---

## 🛠 Tech Stack

| Layer      | Technology                 |
| ---------- | -------------------------- |
| Frontend   | React, Next.js             |
| Backend    | Node.js, Express           |
| Database   | MySQL                      |
| AI Service | Google Gemini AI           |
| Realtime   | Socket.IO                  |
| Charts     | react-chartjs-2 + Chart.js |
| Alerts     | Sonner                     |
| Auth       | JWT, bcrypt                |

---

## 📚 What We Learned

- Built a full-stack app from the ground up
- Gained hands-on experience with AI and RAG concepts
- Learned how to design and simplify UI from Figma to code
- Understood the importance of limiting unnecessary backend endpoints
- Strengthened security and visualization features

---

## ❗ Challenges Faced

- **UI Implementation:** Translating complex Figma designs into responsive React components with limited React experience.
- **Backend Overengineering:** Initially created too many endpoints, later cleaned up for simplicity.
- **AI Integration:** Making AI recommendations accurate and relevant to user data required thoughtful implementation.

---

## 📂 Project Structure

## 🧪 How to Set Up and Run Locally

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/smartsaver.git
cd smartsaver
```

### 2. Backend Setup

```bash
cd backend
npm install
node index.js
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
npm run dev
```
