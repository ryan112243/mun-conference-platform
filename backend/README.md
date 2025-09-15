# MUN Website Backend

This is the backend for the MUN website project built with Node.js and Express.

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## Environment Variables

Create a `.env` file in the backend directory with the following variables:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/mun
OPENAI_API_KEY=your_openai_api_key
GEMINI_API_KEY=your_gemini_api_key
CLAUDE_API_KEY=your_claude_api_key
GOOGLE_OAUTH=your_google_oauth_credentials
```

## Deployment to Render

### Option 1: Render Dashboard

1. Push your code to a Git repository (GitHub, GitLab, etc.)
2. Log in to [Render](https://dashboard.render.com/)
3. Click "New" and select "Web Service"
4. Connect your repository
5. Configure the service:
   - Name: mun-backend
   - Environment: Node
   - Build Command: `npm install`
   - Start Command: `npm start`
6. Add environment variables in the Render dashboard
7. Deploy!

### Option 2: Using render.yaml

With the provided `render.yaml` file, you can use Render's Blueprint feature:

1. Push your code with the `render.yaml` file to a Git repository
2. Log in to Render and navigate to Blueprints
3. Create a new Blueprint pointing to your repository
4. Render will automatically configure the services defined in the YAML file
5. Add your secret environment variables
6. Deploy!