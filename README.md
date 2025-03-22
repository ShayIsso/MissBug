# MissBug 🐞

📎 [View the original project instructions (PDF)](./missBug.pdf)

**MissBug** is a bug-tracking application built as part of a fullstack learning project.  
This repo implements **Phase 1**, which focuses on connecting a **Node.js + Express backend** with a **React frontend** using basic CRUDL operations.

---

## 🚀 Features (Phase 1)

- 🐛 View all bugs
- ➕ Add a new bug
- 📝 Edit existing bugs
- ❌ Delete bugs
- 🔍 Bug filtering by text and severity
- 🍪 Cookie-based view limit (3 unique bugs every 7 seconds)

Each bug includes:
- `title`, `description`, `severity`, `createdAt`

---

## 🛠️ Tech Stack

- **Frontend**: React (with Hooks & React Router)
- **Backend**: Node.js, Express, Cookie-Parser
- **Data Storage**: In-memory (via local JS module or JSON file)
- **State Management**: useState, useEffect (no Redux)

---

## 📁 Project Structure

```
MissBug/
├── backend/
│   ├── server.js             # Express server entry
│   └── services/bugService.js # In-memory bug data service
├── frontend/
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Bug list, details, edit
│   │   └── App.jsx
│   └── public/index.html
└── README.md
```

---

## 🧪 Running Locally

### 1. Clone the project

```bash
git clone https://github.com/ShayIsso/MissBug.git
cd MissBug
```

### 2. Start the backend

```bash
cd backend
npm install
npm start
# Runs on http://localhost:3030
```

### 3. Start the frontend

```bash
cd frontend
npm install
npm start
# Opens http://localhost:5173 or similar
```

---

## 🧠 Purpose

This project demonstrates:
- Creating a REST-like API in Node.js
- Connecting a React frontend to a backend
- Managing client-server communication via Axios
- Handling cookies for rate-limiting
- Practicing component-based frontend design

---

## 📄 License

This project is for educational use – feel free to explore, fork, and build upon it!

---

Made with by [Shay Isso](https://github.com/ShayIsso)
