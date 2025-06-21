
# 🧩 Multilevel Referral and Earning System (with Live Updates)

A Node.js-based backend system with a minimal frontend interface to simulate a real-world referral program with live earnings updates.

---

## 🚀 Features

- 🔗 **Multi-Level Referral Structure**
  - Users can refer up to 8 others.
  - Earnings are shared up to **2 levels**:
    - 5% to Level 1 (direct referrer)
    - 1% to Level 2 (referrer's referrer)

- 💸 **Real-Time Profit Sharing**
  - Earnings are distributed automatically when a purchase is made.
  - Live notifications are delivered using **Socket.IO**.

- 📡 **Live Earnings Dashboard**
  - Users can view real-time updates whenever someone in their referral chain makes a purchase.

---

## 🗂 Project Structure

```
referral-system/
│
├── controllers/         # Business logic
├── models/              # Mongoose schemas
├── routes/              # Express routes
├── utils/               # Earning distribution logic
├── index.html           # Main frontend
├── client.html          # Alternate frontend (optional)
├── server.js            # Server entry point
├── .env.example         # Environment variable example
├── package.json         # Project metadata
```

---

## 🧪 Technologies Used

- Node.js
- Express.js
- MongoDB (Mongoose)
- Socket.IO
- HTML (Basic frontend)

---

## ⚙️ Getting Started

1. **Clone the repository:**

```bash
git clone https://github.com/mayanksangwan19/multi-level-referral-system.git
cd multi-level-referral-system
```

2. **Install dependencies:**

```bash
npm install
```

3. **Create `.env` file (based on `.env.example`):**

```env
MONGO_URI=mongodb://localhost:27017/referral-system
PORT=5000
```

4. **Start the server:**

```bash
node server.js
```

5. **Open frontend:**

Go to `http://localhost:5000` in your browser.

---

## 🔌 API Overview

| Endpoint                  | Method | Description                          |
|---------------------------|--------|--------------------------------------|
| `/api/users/register`     | POST   | Register a new user                  |
| `/api/purchase/buy`       | POST   | Make a purchase                      |
| `socket.emit("join", id)` | WS     | Join socket room for real-time data |
| `socket.on("earning")`    | WS     | Listen for earning updates           |

---

## 💾 MongoDB Collections

### `User`

```js
{
  name: String,
  email: String,
  referredBy: ObjectId, // optional
  referrals: [ObjectId]
}
```

### `Purchase`

```js
{
  user: ObjectId,
  amount: Number
}
```

### `Earning`

```js
{
  user: ObjectId,        // who earns
  sourceUser: ObjectId,  // buyer
  level: 1 | 2,
  amount: Number,
  purchase: ObjectId
}
```

---

## 🔐 .env Setup

Add your connection string and port config in `.env`:

```
MONGO_URI=mongodb://localhost:27017/referral-system
PORT=5000
```

---

## 🙈 .gitignore

```
node_modules/
.env
```

---

## 📎 Project Link

[🔗 GitHub Repository](https://github.com/mayanksangwan19/Multilevel-referral-system)


---

## 🧾 License

MIT License © Mayank Sangwan
