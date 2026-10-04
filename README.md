# Personalized Content Dashboard

## Project Overview
The Personalized Content Dashboard is a centralized platform that aggregates diverse content (news, movies, and social posts) into a unified, responsive, cinematic dark-mode feed. It offers users high customizability and personalization while abstracting away the complexity of managing multiple content sources.

## Features
- **Unified Feed**: Seamlessly aggregates news, movies, and social content.
- **Cinematic Dark UI**: Immersive, modern dark-mode aesthetics using Tailwind CSS and Framer Motion.
- **Deep Personalization**: "Tune My Feed" allows users to select topics (AI, Tech, Gaming, World News, etc.) they care about.
- **Smart Recommendations**: Explains why content is in the feed (e.g. "Because you follow Technology", "Highly shared").
- **Read Later & Favorites**: Bookmark content to read later or save your absolute favorites.
- **Authentication**: Secure credentials-based signup and login using NextAuth.
- **Drag and Drop**: Custom ordering of content cards.
- **Fully Accessible**: WCAG compliant focus states, ARIA labels, and logical structure.

## Tech Stack
- **Framework**: [Next.js](https://nextjs.org) (App Router)
- **Language**: TypeScript
- **State Management**: Redux Toolkit & RTK Query
- **Authentication**: NextAuth.js (v5) + bcryptjs
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Testing**: Vitest, React Testing Library, Playwright

## Local Setup Instructions
1. **Clone the repository:**
   ```bash
   git clone https://github.com/Hemanshu004/Personalized-Content-Dashboard.git
   cd Personalized-Content-Dashboard
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Configure Environment Variables:**
   Copy the example environment file and fill in the secrets (see required variables below):
   ```bash
   cp .env.example .env.local
   ```
4. **Run the Development Server:**
   ```bash
   npm run dev
   ```

## Required Environment Variables
The application requires the following environment variables to run securely. Do not commit these to source control.

- `AUTH_SECRET`: A random 32-character base64 string used by NextAuth to encrypt session data.

## Testing Commands
Run the following commands to execute tests:
- **Unit & Integration Tests**: `npm run test`
- **End-to-End Tests**: `npm run e2e`

## Production Deployment Instructions
This application is fully optimized for production environments such as Render, Vercel, or standard Node.js servers.

1. Install dependencies: `npm ci`
2. Build the application: `npm run build`
3. Start the production server: `npm start`

Ensure that `AUTH_SECRET` is defined in your platform's environment variables dashboard prior to starting the production server.

## GitHub Repository
[https://github.com/Hemanshu004/Personalized-Content-Dashboard](https://github.com/Hemanshu004/Personalized-Content-Dashboard)
