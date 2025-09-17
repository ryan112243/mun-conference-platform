# MUN Site Frontend

React frontend application for the MUN Site project.

## Development Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file:
```env
VITE_API_URL=http://localhost:5000
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at http://localhost:5173

## Features

- Meeting creation and joining interface
- AI chat with translation and text-to-speech
- Discussion forum
- File management
- Reading feature with text selection

## Environment Variables

- `VITE_API_URL`: Backend API URL (default: http://localhost:5000)

## Build

To build for production:
```bash
npm run build
```

The built files will be in the `dist` directory.