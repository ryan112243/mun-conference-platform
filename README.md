# MUN Website Project

A full-stack web application with React frontend and Node.js backend, configured for deployment to Netlify and Render.

## Project Structure

```
mun-site/
├── frontend/             # React + Vite + Tailwind
│   ├── src/              # React source code
│   ├── public/           # Static assets
│   ├── package.json      # Frontend dependencies
│   ├── vite.config.js    # Vite configuration
│   ├── netlify.toml      # Netlify deployment config
│   └── Dockerfile        # Frontend Docker config
├── backend/              # Node.js + Express
│   ├── server.js         # Express server
│   ├── package.json      # Backend dependencies
│   ├── render.yaml       # Render deployment config
│   ├── Procfile          # Process file for deployment
│   └── Dockerfile        # Backend Docker config
├── docker-compose.yml    # Docker Compose for local dev
├── deploy.sh            # Deployment script
└── README.md            # This file
```

## Local Development Setup

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Docker and Docker Compose (for containerized development)

### Option 1: Standard Setup

1. **Clone the repository**

```bash
git clone <repository-url>
cd mun-site
```

2. **Set up environment variables**

```bash
# Frontend
cp frontend/.env.example frontend/.env

# Backend
cp backend/.env.example backend/.env
# Edit the .env file to add your API keys
```

3. **Start the backend**

```bash
cd backend
npm install
npm run dev
```

4. **Start the frontend (in a new terminal)**

```bash
cd frontend
npm install
npm run dev
```

5. **Access the application**

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### Option 2: Docker Setup

1. **Clone the repository**

```bash
git clone <repository-url>
cd mun-site
```

2. **Set up environment variables**

```bash
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env
# Edit the .env files as needed
```

3. **Start the containers**

```bash
docker-compose up
```

4. **Access the application**

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- MongoDB: mongodb://localhost:27017

## Deployment

### Automatic Deployment

You can use the provided deployment script:

```bash
chmod +x deploy.sh
./deploy.sh
```

This script will:
1. Build the frontend
2. Deploy to Netlify
3. Deploy the backend to Render
4. Print the deployment URLs

### Manual Deployment

#### Frontend (Netlify)

1. **Install Netlify CLI**

```bash
npm install netlify-cli -g
netlify login
```

2. **Deploy to Netlify**

```bash
cd frontend
npm run build
netlify deploy --prod
```

3. **Set environment variables in Netlify Dashboard**

Add `VITE_API_URL` pointing to your Render backend URL.

#### Backend (Render)

1. **Push your code to a Git repository**

2. **Create a new Web Service on Render**

- Connect to your repository
- Select the backend directory
- Set build command: `npm install`
- Set start command: `npm start`

3. **Set environment variables in Render Dashboard**

Add all required environment variables from `.env.example`.

## Environment Variables

### Frontend (.env)

```
VITE_API_URL=http://localhost:5000  # URL of the backend API
```

### Backend (.env)

```
PORT=5000                          # Port for the server to listen on
MONGO_URI=mongodb://localhost:27017/mun  # MongoDB connection string
OPENAI_API_KEY=your_key            # OpenAI API key
GEMINI_API_KEY=your_key            # Gemini API key
CLAUDE_API_KEY=your_key            # Claude API key
GOOGLE_OAUTH=your_credentials      # Google OAuth credentials
```

## Additional Information

- The frontend is configured to use environment variables with the `VITE_` prefix
- The backend reads all environment variables from `process.env`
- Both services are configured for easy deployment to their respective platforms
- Docker setup is provided for consistent local development