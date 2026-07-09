# ResumeForge (MERN Stack)
> **Transform Your Resume. Unlock Your Career.**

ResumeForge is a modern, premium, AI-powered web application that serves as a candidate's career workspace. Built entirely on the MERN stack, it analyzes ATS scores, compares resumes with job descriptions using vector similarities, identifies missing keywords, and draft revisions utilizing Gemini AI.

---

## Technical Stack

- **Frontend**: Next.js 16 (App Router), TypeScript, Tailwind CSS, Framer Motion, Axios, Lucide React.
- **Backend**: Node.js & Express.js.
- **Database**: MongoDB Atlas / Local MongoDB via Mongoose ODM.
- **Authentication**: JWT token verification + Bcrypt hashing.
- **AI Integrations**: Google Gemini AI Node SDK with local NLP match fallbacks.

---

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v20+ recommended)
- [MongoDB](https://www.mongodb.com/) (local community edition or Atlas connection string)

### 1. Configure Environment Variables
Copy the template configuration files and fill in your keys:
```bash
cp .env.example .env
```

### 2. Local Installation
You can install and run the client and server locally:

#### Start MongoDB Express Backend
```bash
cd server
npm install
npm run dev
```
The API server will launch at `http://localhost:5000`.

#### Start Next.js Frontend Client
```bash
cd client
npm install
npm run dev
```
The client dashboard will launch at `http://localhost:3000`.

---

## Running with Docker Compose

Launch the entire stack (MongoDB container + Express server + Next.js client) with a single command:
```bash
docker-compose up --build
```
- Frontend UI: `http://localhost:3000`
- Backend API: `http://localhost:5000`
