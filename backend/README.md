# MUN Site Backend

Node.js backend API for the MUN Site project.

## Development Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mun-site
NODE_ENV=development
```

3. Start the development server:
```bash
npm run dev
```

The API will be available at http://localhost:5000

## Features

- RESTful API endpoints
- MongoDB integration
- AI chat functionality
- File upload/download
- Discussion forum API
- Translation services

## Environment Variables

- `PORT`: Server port (default: 5000)
- `MONGODB_URI`: MongoDB connection string
- `NODE_ENV`: Environment (development/production)

## API Endpoints

- `/api/ai/*` - AI chat and translation endpoints
- `/api/discussions/*` - Discussion forum endpoints
- `/api/files/*` - File management endpoints

## Database

The application uses MongoDB. Make sure you have MongoDB running locally or provide a cloud MongoDB URI in the environment variables.