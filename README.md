<div align="center">

```
   ___       _     _ _    ___  _           _
  / _ \ _ __| |__ (_) |_ / __|| |__   __ _| |_
 | | | | '__| '_ \| | __| |   | '_ \ / _` | __|
 | |_| | |  | |_) | | |_| |___| | | | (_| | |_
  \___/|_|  |_.__/|_|\__|\____|_| |_|\__,_|\__|
```

### _Stay in each other's orbit._

[![Live Demo](https://img.shields.io/badge/Live-Demo-0A66C2?style=for-the-badge&logo=render&logoColor=white)](https://orbitchat-38y6.onrender.com/)

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-GridFS-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://mongodb.com)
[![Socket.io](https://img.shields.io/badge/Socket.io-4.7-010101?style=flat-square&logo=socket.io&logoColor=white)](https://socket.io)
[![JWT](https://img.shields.io/badge/Auth-JWT-pink?style=flat-square&logo=jsonwebtokens&logoColor=white)](https://jwt.io)

</div>

---

## What is OrbitChat?

OrbitChat is a full-stack real-time messaging application where conversations happen the moment you type them. Built with a modern glassmorphism UI, WebSocket-powered live updates, and secure JWT authentication — it's everything a chat app should be, without the bloat.

No polling. No refresh. No waiting. Just orbit.

---

## Features

| Feature                    | Description                                                           |
| -------------------------- | --------------------------------------------------------------------- |
| **Real-Time Messaging**    | Instant delivery via Socket.io WebSockets — zero delay, zero refresh  |
| **File Sharing**           | Send PDFs, images, Word docs, ZIPs and more via MongoDB GridFS        |
| **Live Online Status**     | See who's available right now with animated presence indicators       |
| **Last Message Preview**   | Sidebar shows your most recent message per contact, sorted by recency |
| **Date Separators**        | Chat history grouped by Today / Yesterday / full date                 |
| **Message Deletion**       | Delete your sent messages in real time — both sides update instantly  |
| **Resizable Sidebar**      | Drag the panel divider to your preferred width                        |
| **Search Contacts**        | Filter your contact list by name or user ID instantly                 |
| **OTP Email Verification** | Forgot your password? Verify via a 6-digit OTP sent to your email     |
| **Profile Editing**        | Update your display name, email, and profile picture on the fly       |
| **Secure Auth**            | Passwords hashed with bcrypt, sessions protected by JWT               |
| **Responsive Design**      | Clean mobile layout — sidebar and chat panel adapt to screen size     |

---

## Tech Stack

```
Frontend                    Backend                     Infrastructure
─────────────────────       ─────────────────────       ─────────────────────
React 18                    Node.js + Express           MongoDB Atlas
React Router v6             Socket.io 4.7               MongoDB GridFS (files)
React Hook Form             JWT (jsonwebtoken)          Nodemon (dev server)
React Bootstrap             bcryptjs
React Icons                 Multer + GridFS Storage
Socket.io-client            Nodemailer (OTP email)
Axios                       express-async-handler
```

---

## Project Structure

```
OrbitChat/
├── APIs/
│   ├── conversationsAPI.js     # Messages, file upload/download, summaries
│   ├── usersAPI.js             # Auth, registration, OTP, profile update
│   └── sendEmail.js            # Nodemailer OTP helper
├── public/
│   ├── logo.svg                # OrbitChat SVG favicon
│   └── index.html
├── src/
│   ├── components/
│   │   ├── OrbitLogo.js        # SVG logo mark component
│   │   ├── Chat.js             # Root chat layout, summaries state
│   │   ├── AllChats.js         # Sidebar — contacts, search, previews
│   │   ├── Conversation.js     # Active conversation coordinator
│   │   ├── Convo.js            # Message list with date separators
│   │   ├── Footer.js           # Message input, emoji picker, file attach
│   │   ├── Header.js           # Chat header with search toggle
│   │   ├── NavigationBar.js    # Top navbar with auth state
│   │   ├── Login.js            # Sign-in form + illustration
│   │   ├── Register.js         # Sign-up form + illustration
│   │   ├── EditProfile.js      # Profile update modal
│   │   ├── ForgotPass.js       # OTP-based password reset
│   │   ├── Home.js             # Landing page
│   │   ├── EmptyChat.js        # Empty state when no chat selected
│   │   └── RootLayout.js       # Navbar + outlet wrapper
│   ├── socket.js               # Singleton Socket.io client
│   ├── index.css               # Global styles + CSS variables + animations
│   └── index.js                # App entry + router
├── server.js                   # Express + Socket.io server
├── verifyToken.js              # JWT middleware
└── package.json
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- A MongoDB Atlas cluster (or local MongoDB)
- A Gmail account for OTP emails (or any SMTP provider)

### 1. Clone and install

```bash
git clone <your-repo-url>
cd OrbitChat
npm install
```

### 2. Configure environment

Create a `.env` file in the root:

```env
DB=mongodb+srv://<user>:<password>@cluster.mongodb.net/orbitchat
SECRET_KEY=your_jwt_secret_here
EMAIL_USER=your@gmail.com
EMAIL_PASS=your_app_password
PORT=3500
```

> For Gmail, use an [App Password](https://myaccount.google.com/apppasswords) — not your regular password.

### 3. Run

```bash
npm start
```

The server starts on `https://orbitchat-38y6.onrender.com`. Open a second browser tab (or a different browser) to test two-user real-time messaging.

---

## Architecture Highlights

### Real-Time Flow

```
User A types → Footer.js
    → POST /send-message
    → socket.emit("message-sent")
        → Server io.emit("message-sent")          ← broadcasts to ALL clients
            → Conversation.js listener fires
                → setRefreshKey(k+1)              ← triggers Convo.js refetch
                → fetchSummaries()                ← updates sidebar preview
```

### Online Presence

```
Login → socket.emit("new-connection", userid)
    → Server stores in onlineUsers collection
    → io.emit("allusers", [...])                  ← all clients update

socket.on("connect") re-emits "new-connection"    ← survives reconnects

Disconnect → socket.data.username auto-cleans
    → deleteOne from onlineUsers
    → io.emit("allusers", [...])
```

### Last Message Summaries (MongoDB Aggregation)

```js
// Groups all conversations by normalized pair (A↔B = B↔A),
// picks the last message per pair using ObjectId insertion order,
// extracts timestamp from ObjectId for accurate cross-day sorting.
db.conversations.aggregate([
  { $match: { $or: [{ senderId: host }, { receiverId: host }] } },
  { $sort: { _id: 1 } },
  {
    $group: {
      _id: {
        $cond: [
          { $lt: ["$senderId", "$receiverId"] },
          { a: "$senderId", b: "$receiverId" },
          { a: "$receiverId", b: "$senderId" },
        ],
      },
      lastMessage: { $last: "$$ROOT" },
    },
  },
]);
```

---

## Scripts

| Command         | Description                                |
| --------------- | ------------------------------------------ |
| `npm start`     | Start dev server with nodemon on port 3500 |
| `npm run build` | Install deps + production React build      |
| `npm test`      | Run test suite                             |

---

## The Logo

The OrbitChat mark is a custom SVG: a tilted elliptical orbit ring, a central hub (the shared connection), a satellite node on the orbit path (the user in motion), and a trailing dot conveying velocity. Animated on a purple→cyan gradient in the UI.

---

<div align="center">

Built with focus, caffeine, and a genuine love for real-time systems.

**OrbitChat** — _Stay in each other's orbit._

</div>
