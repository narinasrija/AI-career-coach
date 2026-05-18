# AI Career Coach - Project Documentation

## 🚀 Overview
**AI Career Coach** is a full-stack, AI-powered web application designed to act as a 24/7 personal career assistant. It helps users optimize their resumes for Applicant Tracking Systems (ATS), practice for interviews using a conversational AI bot, and generate personalized weekly learning roadmaps based on their career goals and current experience levels.

The platform is designed with a premium, modern user interface (Glassmorphism, Dark Theme, Micro-animations) to provide an engaging and intuitive user experience.

---

## ✨ Core Features

### 1. 📄 AI Resume Analyzer
- **Functionality**: Users can drag and drop their PDF resumes into the application.
- **Behind the Scenes**: The backend uses `pdf-parse` to extract raw text from the uploaded PDF. This text is sent to the OpenAI API (GPT-3.5/4) with a specialized system prompt.
- **Output**: The AI returns a structured JSON response containing:
  - An ATS Score (0-100)
  - Missing industry skills
  - Actionable improvement suggestions
  - Rewritten, high-impact bullet points.

### 2. 💬 Mock Interview Bot
- **Functionality**: A real-time chat interface where users can practice Technical, Behavioral, or HR interviews.
- **Behind the Scenes**: The chat history is maintained in the React state and sent back and forth to the backend. The backend constructs a conversational prompt for OpenAI, instructing it to act as a strict but helpful interviewer.
- **Output**: Real-time feedback, follow-up questions, and typing indicators that simulate a real human conversation.

### 3. 🎯 Personalized Roadmap Generator
- **Functionality**: Users select their target career goal (e.g., Frontend Developer, Data Scientist) and their current experience level.
- **Behind the Scenes**: The backend dynamically generates a prompt asking OpenAI for a structured 4-week curriculum.
- **Output**: A timeline view in the UI showing weekly topics and details, complete with interactive checkboxes to track learning progress.

### 4. 🔐 Authentication System
- **Functionality**: Secure user registration, login, and protected routes.
- **Behind the Scenes**: Uses JSON Web Tokens (JWT) for secure session management. *(Note: Currently running in a mock-database mode for demonstration purposes, but fully structured to use MongoDB).*

---

## 🛠️ Technology Stack

### Frontend (Client-Side)
- **Framework**: React.js with Vite (for ultra-fast development and building).
- **Styling**: Tailwind CSS v4 with custom vanilla CSS for advanced Glassmorphism effects and animations.
- **Icons & Animations**: `lucide-react` for scalable SVG icons, `framer-motion` for smooth page transitions and micro-interactions.
- **Routing**: `react-router-dom` for seamless Single Page Application (SPA) navigation.
- **HTTP Client**: `axios` with interceptors for automatic JWT token injection.

### Backend (Server-Side)
- **Runtime**: Node.js
- **Framework**: Express.js (Handles routing and middleware).
- **AI Integration**: Official `openai` Node.js SDK.
- **File Handling**: `multer` (for handling multipart/form-data uploads) and `pdf-parse` (for extracting text from PDFs).
- **Security & Auth**: `jsonwebtoken` (JWT) for auth tokens, `bcryptjs` for password hashing (when DB is active).
- **Database**: MongoDB via `mongoose` (Currently bypassed for seamless local demos, but structurally ready).

---

## 🏗️ Architecture Flow

1. **User Request**: The user interacts with the React frontend (e.g., uploads a resume).
2. **API Call**: Axios sends an HTTP POST request (with the JWT token in the headers) to the Express backend.
3. **Controller Logic**: The backend controller (e.g., `aiController.js`) receives the request, parses the data, and securely communicates with the OpenAI API using the server-side API key.
4. **AI Processing**: OpenAI processes the data and returns a structured JSON response.
5. **Client Render**: The backend forwards the JSON back to the frontend, which triggers React state updates and animations (e.g., the ATS Score ring animates to the calculated number).

---

## 📂 Project Structure

```text
AI-career-coach/
├── frontend/                 # React UI Application
│   ├── src/
│   │   ├── components/       # Reusable UI components (Navbar, ProtectedRoute)
│   │   ├── context/          # React Context (AuthContext for global state)
│   │   ├── pages/            # Main views (Home, Dashboard, ResumeAnalyzer, etc.)
│   │   ├── utils/            # Helper functions (api.js with Axios setup)
│   │   ├── App.jsx           # Main router setup
│   │   └── index.css         # Core Design System (Glassmorphism, animations)
│   ├── tailwind.config.js    # Tailwind configuration
│   └── vite.config.js        # Vite bundler config (includes API proxy)
│
├── backend/                  # Node.js/Express API Server
│   ├── src/
│   │   ├── config/           # Database connections (db.js)
│   │   ├── controllers/      # Core business logic (aiController.js, authController.js)
│   │   ├── middlewares/      # Security layers (authMiddleware.js)
│   │   ├── models/           # Database schemas (User.js)
│   │   ├── routes/           # API Endpoint definitions (aiRoutes.js, authRoutes.js)
│   │   └── server.js         # Main Express application entry point
│   ├── .env                  # Environment variables (OpenAI Key, JWT Secret)
│   └── package.json          # Backend dependencies
```

---

## 🚀 Future Enhancements (Scaling Up)
- **Enable MongoDB**: Switch from the current in-memory mock database to a live MongoDB Atlas cluster to persistently save user progress, roadmaps, and chat histories.
- **OAuth Integration**: Add "Sign in with Google/GitHub" for frictionless onboarding.
- **Export to PDF**: Allow users to export their newly rewritten resumes or generated roadmaps as clean PDFs.
