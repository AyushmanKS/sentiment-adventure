# Sentiment Adventure: A Gamified Journey into AI

**Sentiment Adventure** is a full-stack, interactive web application designed to teach the core concepts of Sentiment Analysis to middle school students (and anyone curious about AI!). Through a fun, story-driven game, users help a friendly robot named Gloomy learn to understand human emotions.

**https://sentiment-adventure-three.vercel.app/** <!-- Replace with your live Vercel URL -->


<!-- After you take a great screenshot of your app, upload it to a site like Imgur and paste the URL here. -->

---

## 🚀 About The Project

The goal of this project was to demystify a complex AI topic by breaking it down into simple, engaging, and interactive steps. Instead of reading dry definitions, users actively participate in Gloomy's training, experiencing the entire sentiment analysis pipeline from start to finish.

The game is structured into 8 distinct levels:

*   **Level 1: Data Collection** - Learning to identify messages that contain feelings.
*   **Level 2: Text Preprocessing** - Cleaning up messy text by removing punctuation and "stop words".
*   **Level 3: Feature Extraction** - Turning words into numbers through scoring and word-counting.
*   **Level 4: Sentiment Classification** - Sorting words and sentences into Positive, Negative, and Neutral bins.
*   **Level 5: Analysis & Interpretation** - Understanding sentiment intensity and the challenges of sarcasm.
*   **Level 6: Visualization & Reporting** - Learning how data is presented with charts and colors.
*   **Level 7: Implementation & Iteration** - Reviewing the whole process and seeing how models are used and improved.
*   **Level 8: Play with Gloomy (Sandbox)** - A final, creative level where users can build their own sentences and get an instant sentiment prediction from the fully-trained Gloomy.

---

## 🛠️ Tech Stack

This project was built using the MERN stack and deployed on a modern, scalable infrastructure.

### Frontend
*   **Framework:** [React](https://reactjs.org/) (with Vite)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **Animations:** [Framer Motion](https://www.framer.com/motion/)
*   **API Communication:** [Axios](https://axios-http.com/)

### Backend
*   **Runtime:** [Node.js](https://nodejs.org/)
*   **Framework:** [Express.js](https://expressjs.com/)
*   **Database:** [MongoDB](https://www.mongodb.com/) (with Mongoose)

### Deployment
*   **Frontend:** [Vercel](https://vercel.com/)
*   **Backend:** [Render](https://render.com/)
*   **Database:** [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

---

## ⚙️ Getting Started

To run this project locally, you will need Node.js and MongoDB installed on your system.

### 1. Clone the repository
```bash
git clone https://github.com/your-username/sentiment-adventure.git
cd sentiment-adventure
```

### 2. Set up the Backend
# Navigate to the backend folder
cd backend

# Install dependencies
npm install

# Create a .env file in the /backend directory and add your variables:
# MONGO_URI=your_local_or_atlas_mongodb_connection_string
# PORT=5000

# Start the backend server
npm start
The backend server will be running on http://localhost:5000.

### 3. Set up the Frontend
The frontend will open in your browser, usually on http://localhost:5173. The app will automatically connect to your local backend server.
🌟 Key Features
Interactive Learning: Multiple challenge types, including quizzes, drag-and-drop sorting, word cleanup, and a final sandbox.
Story-Driven Narrative: An engaging story about helping a robot named Gloomy keeps users motivated.
Persistent Progress: User progress is saved to a database, allowing them to continue their adventure later.
Smooth Animations: A polished and responsive UI with animations powered by Framer Motion.
Full-Stack Architecture: A complete separation of concerns between the React frontend and the Node.js backend API.
