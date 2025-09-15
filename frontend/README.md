# MUN Website Frontend

This is the frontend for the MUN website project built with React, Vite, and Tailwind CSS.

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## Environment Variables

Create a `.env` file in the frontend directory with the following variables:

```
VITE_API_URL=http://localhost:5000
```

For production, set this to your deployed backend URL.

## Deployment to Netlify

### Option 1: Netlify UI

1. Push your code to a Git repository (GitHub, GitLab, etc.)
2. Log in to [Netlify](https://app.netlify.com/)
3. Click "New site from Git"
4. Select your repository and branch
5. Set build command to `npm run build`
6. Set publish directory to `dist`
7. Add environment variables in the Netlify UI
8. Deploy!

### Option 2: Netlify CLI

```bash
# Install Netlify CLI
npm install netlify-cli -g

# Login to Netlify
netlify login

# Initialize Netlify site
netlify init

# Deploy to Netlify
netlify deploy --prod
```

### Continuous Deployment

Netlify will automatically deploy when you push to your connected repository.