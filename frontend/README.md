# 🚗 Resqora — Full Angular Website

India's #1 24/7 Roadside Assistance app built with **Angular 17 (Standalone Components)** + **SCSS** + **Angular Router**.

## 🚀 Setup & Run

### Prerequisites
- Node.js 18+
- Angular CLI 17+

```bash
# 1. Install Angular CLI globally (only once)
npm install -g @angular/cli

# 2. Go into project folder
cd resqora

# 3. Install dependencies
npm install

# 4. Start dev server
ng serve

# 5. Open browser
http://localhost:4200
```

## 📄 Pages & Routes

| Route        | Page                          |
|-------------|-------------------------------|
| `/`          | Full landing/home page        |
| `/login`     | Login page (User / Mechanic)  |
| `/register`  | Register page (User / Mechanic)|

## 📁 Project Structure

```
resqora/
├── src/
│   ├── app/
│   │   ├── app.component.ts       ← Root shell (navbar + router-outlet + footer)
│   │   ├── app.routes.ts          ← Route definitions
│   │   └── components/
│   │       ├── home/              ← Landing page wrapper
│   │       ├── navbar/            ← Sticky nav + Sign In / Book Service links
│   │       ├── hero/              ← Animated hero section
│   │       ├── services/          ← 8 service cards
│   │       ├── how-it-works/      ← 4-step process
│   │       ├── stats/             ← Animated counters
│   │       ├── pricing/           ← Basic / Pro / Elite plans ⭐
│   │       ├── ev-section/        ← EV services block
│   │       ├── coverage/          ← Pan-India city pins
│   │       ├── testimonials/      ← Customer reviews
│   │       ├── awards/            ← Recognition cards
│   │       ├── cta/               ← Call-to-action band
│   │       ├── footer/            ← Full footer
│   │       ├── chat-widget/       ← Live chat support ⭐
│   │       └── auth/              ← Login + Register (role-based) ⭐
│   ├── styles.scss                ← Global Red & Gold theme
│   └── index.html
├── angular.json
├── tsconfig.json
└── package.json
```

## ✨ Features

- 🎨 **Red & Gold** color theme throughout
- 📱 Fully responsive (mobile + desktop)
- 🔀 Angular Router — `/login`, `/register`, `/`
- 🔑 **Role-based Auth** — User & Mechanic login/register
- 💬 **Live Chat Widget** with quick replies & bot
- 💰 **Pricing Plans** — Basic / Pro / Elite
- ⚡ EV Services section
- 🔢 Animated statistics counters
- 🗺️ Pan-India coverage map
- 🏆 Awards & testimonials

## 📞 Customize

Replace these in the code:
- `1800-RESQORA` → your actual helpline
- Logo name `RESQORA` → your brand
- Pricing amounts → your actual prices
