
# AI Interview Coach

AI Interview Coach is a web application designed to help users prepare for interviews using AI-powered coaching, feedback, and progress tracking. It features interactive interview sessions, domain selection, analysis reports, and user authentication.

## Features
- AI-driven interview simulation and feedback
- Domain-specific question selection
- Progress tracking and analysis reports
- User authentication and profile management
- Modern UI built with React and Vite

## Prerequisites
- Node.js (v16 or higher recommended)
- npm (comes with Node.js)

## Getting Started

1. **Clone the repository:**
   ```powershell
   git clone https://github.com/VedantPingale/Interview-Coach.git
   cd Interview-Coach
   ```

2. **Install dependencies:**
   ```powershell
   npm install
   ```



3. **Start the backend server (connects to AI model):**
   ```powershell
   cd server
   node index.js
   ```

4. **Run the development server:**
   ```powershell
   npm run dev
   ```
   The app will be available at `http://localhost:3000`.

**Note:**

This project uses a local OLLAMA model for AI features. Before starting the app:

1. Install Ollama from [https://ollama.com/download](https://ollama.com/download)
2. Pull your desired model (replace `Model_name` with the actual model name):
   ```powershell
   ollama pull "Model_name"
   ```
3. Make sure your OLLAMA model is running locally before starting the backend and frontend servers.

No environment variables are required for setup.

## Project Structure
- `components/` - React components for UI, authentication, interview, layout, etc.
- `hooks/` - Custom React hooks
- `pages/` - Main application pages
- `server/` - Backend server and database files
- `services/` - Service modules for AI, authentication, and Supabase

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License
This project is licensed under the MIT License.
