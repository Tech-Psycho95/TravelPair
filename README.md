✈️ Travelpair – Autonomous Travel Fare Comparison Agent
🧠 What It Does
Travelpair is an autonomous agent-powered web app that compares flight and train fares across multiple platforms (e.g., IRCTC, Skyscanner, Cleartrip). It uses Composio’s Tool Router to dynamically plan and execute multi-step tasks like searching fares, aggregating results, and presenting the best options — all from a single user query.

Problem Solved: Travelers waste time switching between apps to find the best deal. Travelpair centralizes this process, saving time and money with intelligent automation.

---

🚀 How to Run Locally
🔧 Dependencies
Node.js or Python (depending on backend)

Composio SDK

LangChain or custom agent framework

Frontend: Typescript, Bolt and HTML/CSS/JS

📦 Installation-

git clone https://github.com/your-username/travelpair.git
cd TravelPair

▶️ Run the Project -

npm run dev     # for frontend
python app.py   # or uvicorn main:app --reload for FastAPI backend

---

💡 Why It’s Useful and Innovative
🔄 Multi-tool orchestration: Uses Composio Tool Router to dynamically route tasks across APIs

🧠 Autonomous planning: Agent breaks down user goals into actionable steps

🧭 Real-time comparison: Aggregates and ranks fares from multiple sources

🖥️ Web-first experience: Clean UI built for speed and clarity

---

🔌 Connecting Third-Party Tools via Composio
To demo or test the agent with real data:

Sign up at composio.dev

Generate your Composio API key

Add API keys for travel platforms (Skyscanner, IRCTC, etc.)

Paste all keys into your .env file

Restart the backend to activate tool routing
