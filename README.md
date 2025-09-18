# LangLens.ai - Modern Language Translation Application

LangLens.ai is a modern, user-friendly language translation application built with React and TypeScript, featuring real-time translation capabilities and innovative features like camera-based text detection.

## 🌟 Features

- **Real-time Translation**: Instant translation between multiple languages
- **Camera Integration**: Translate text directly from camera input
- **Text-to-Speech**: Listen to translated text with proper pronunciation
- **Modern UI/UX**: Clean, responsive interface with smooth animations
- **Copy & Clear Functions**: Easy text management with copy and clear capabilities
- **Character Counter**: Track your input with a character counter (5000 character limit)

## 🚀 Tech Stack

### Frontend
- React
- TypeScript
- Tailwind CSS
- Vite
- Modern UI components with gradient effects
- Speech Synthesis API

### Backend
- Node.js
- TypeScript
- Express.js
- RESTful API architecture

## 🛠️ Project Structure

```
apps/
├── backend/
│   ├── src/
│   │   ├── index.ts          # Server entry point
│   │   └── routes/
│   │       └── translate.ts   # Translation endpoints
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── CameraComponent.tsx
│   │   ├── services/
│   │   │   └── translate.ts
│   │   ├── App.tsx
│   │   ├── LanguageDropdown.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
│
└── packages/
    └── shared/              # Shared utilities and types
```

## 🌈 Features Breakdown

### Translation Interface
- Language selection dropdowns for source and target languages
- Swap language functionality
- Real-time character counting
- Copy/Clear buttons for both input and output
- Error handling with user feedback

### Camera Integration (Cam LangLens.ai)
- Real-time camera feed
- Text detection from camera input
- Seamless integration with translation service

### Accessibility Features
- Text-to-Speech functionality
- Responsive design for all screen sizes
- Clear visual feedback for all actions

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/machack1512/LangLens.ai.git
   ```

2. **Install dependencies**
   ```bash
   cd LangLens.ai
   pnpm install
   ```

3. **Start the development servers**

   Backend:
   ```bash
   cd apps/backend
   pnpm dev
   ```

   Frontend:
   ```bash
   cd apps/frontend
   pnpm dev
   ```

4. Open http://localhost:5173 in your browser

## 🔒 Environment Setup

Create `.env` files in backend directories:

Backend `.env`:
```env
PORT=5000
NODE_ENV=development
```

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.