# Mealtracker

**Mealtracker** is a smart meal-tracking web app that helps students and individuals manage tiffin service consumption. Users can track daily meals, avoid overpaying, analyze patterns, and calculate monthly expenses — all in one place.

---

## Features

- ✅ Track received meals (Breakfast, Lunch, Dinner)
- ✅ Meal limit for non-logged-in users (5 meals maximum)
- ✅ Real-time meal tracking with vendor management
- ✅ Calendar-based daily tracking
- ✅ Authentication with Google Sign-In
- ✅ Beautiful, responsive UI using `shadcn/ui`
<!-- - ✅ Add multiple vendors with custom meal pricing
- ✅ Real-time meal count and cost calculation
- ✅ Analyze eating patterns
- ✅ Beautiful, animated landing page with CTA
- ✅ Optimized UI using `shadcn/ui` and `framer-motion` -->

---

## Meal Limit Feature

The app includes a meal limit system for non-logged-in users:

- **Limit**: Non-logged-in users can log a maximum of 5 total meals
- **Visual Indicators**: Users see remaining meal count and warnings
- **Login Prompts**: When the limit is reached, users are prompted to log in
- **Seamless Experience**: Logged-in users have unlimited meal tracking

This encourages user registration while allowing potential users to try the app's core functionality.

---

- **Framework**: [Next.js](https://nextjs.org/) (v14+)
- **Language**: TypeScript

---

## Local Development

### 1. Clone the repository

```bash
git clone https://github.com/Princekashish/mealtracker.git
cd mealtracker
