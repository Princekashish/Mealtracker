# 🥗 Mealtracker

> Track your daily meals, tiffin vendors, and expenses effortlessly.

![Mealtracker Banner](public/og-image.png)

Mealtracker is a **Full-stack web app** built with **Next.js**, **Neon Postgres**, and **Tailwind CSS** to help you keep track of your daily tiffins and vendor payments.  
It’s perfect for individuals, small offices, or hostels who want a simple and beautiful way to manage daily meal costs.

---

## ✨ Features

- 🍱 **Meal Logging:** Record each meal with vendor name, price, and date.
- 💰 **Monthly Expense Overview:** See your total spend, meals taken, and cost trend.
- 👨‍🍳 **Vendor Management:** Add, edit, or remove vendors — track which ones are active.
- 📅 **Smart Filters:** Filter meals by vendor, meal type (breakfast/lunch/dinner), and month.
- 📊 **Analytics Dashboard:** Visualize meal and expense data in one place.
- 🌗 **PWA Ready:** Fully responsive, and installable as a mobile app.
- 🔒 **Auth Protected:** Dashboard and data are secured behind authentication.

## 🧩 Tech Stack

| Layer            | Technology                                                                            |
| ---------------- | ------------------------------------------------------------------------------------- |
| Frontend         | [Next.js 15](https://nextjs.org/) + [TypeScript](https://www.typescriptlang.org/)     |
| Styling          | [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)        |
| Database         | [Neon Postgres](https://www.mongodb.com/)                                                   |
| Authentication   | [better-auth](https://github.com/lokeswaran-aj/better-auth)                           |
| State Management | [Zustand](https://zustand-demo.pmnd.rs/)                                              |
| Animations       | [Framer Motion](https://www.framer.com/motion/) + [GSAP](https://greensock.com/gsap/) |
| Charts           | [Recharts](https://recharts.org/en-US/)                                               |
| Hosting          | [Vercel](https://vercel.com/)                                                         |

---

## 🚀 Getting Started

### 1️. Clone the repository

```bash
git clone https://github.com/yourusername/mealtracker.git
cd mealtracker
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Environment Configuration

```bash
.env
```

### 4. Database setup

```bash
Database URI
```

### 4. Database Migration

```bash
#Generate migration files (if schema changes)
npx drizzle-kit generate

# Apply migrations to database
npx drizzle-kit migrate
```

### 5. Run the Development Server

```bash
pnpm dev
```

---
## 🧾 License
This project is licensed under the MIT License — you’re free to use, modify, and distribute it. [LICENSE](https://github.com/Princekashish/Mealtracker/blob/main/LICENCE)

---
<div align="center">
  <sub>Design & Built  ❤️ by <a href="https://princekashish.tech">Prince kashish</a></sub>
</div>