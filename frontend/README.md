# 🧠 Task Generator App

A full-stack task management app that uses **Firebase Auth**, **Gemini AI**, and **Prisma** to generate, store, and manage tasks per user.

---

## ✨ Features

- 🔐 User authentication (Firebase)
- 🧠 Task generation with Gemini AI
- ✏️ Edit, delete, and manage tasks
- 👤 User-specific task storage
- ⚡ Built with Next.js, styled with Tailwind CSS

---

## 🚀 Tech Stack

| Category       | Tech                          |
|----------------|-------------------------------|
| Frontend       | Next.js, Tailwind CSS         |
| Backend        | Node.js, Prisma ORM           |
| Auth           | Firebase Authentication       |
| AI Integration | Gemini (Google Generative AI) |
| DB             | SQLite (development)          |

---



## 📦 Setup Instructions

### 🔧 Prerequisites
- Node.js and npm
- Firebase project (set up Auth)
- Google Gemini API key

---

### 🛠️ Local Setup

```bash
# Clone repo
git clone https://github.com/Adidone/task-manager.git
cd task-manager

# Install dependencies
cd frontend
npm install

cd ../backend
npm install

# Start backend
npm run dev

# Start frontend
cd ../frontend
npm run dev


## 🧠 Edge Cases / Limitations

- Handles blank inputs and prevents empty task generation
- Only authenticated users can generate tasks
- Each user sees only their own tasks
- Basic validation but no rate-limiting or advanced security implemented


## 🌐 Live Demo

Check it out here: [https://task-manager-beige-pi.vercel.app](https://task-manager-beige-pi.vercel.app)
