# Deployment Guide

## Deploy to Vercel

### Option 1: Using Vercel CLI (Recommended)

1. Install Vercel CLI (if not already installed):
```bash
npm install -g vercel
```

2. Navigate to the project directory:
```bash
cd mobius-strip
```

3. Deploy to Vercel:
```bash
vercel
```

4. Follow the prompts:
   - Set up and deploy? **Y**
   - Which scope? Select your account
   - Link to existing project? **N**
   - Project name? Press Enter (or customize)
   - Directory? Press Enter (current directory)
   - Override settings? **N**

5. For production deployment:
```bash
vercel --prod
```

### Option 2: Using Vercel Dashboard

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)

2. Go to [vercel.com](https://vercel.com) and sign in

3. Click "Add New Project"

4. Import your repository

5. Vercel will automatically detect Next.js and configure the build settings

6. Click "Deploy"

### Option 3: Deploy Button

Add this to your repository README:

```markdown
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=YOUR_REPO_URL)
```

## Environment Variables

This project doesn't require any environment variables.

## Build Configuration

The project uses the default Next.js build configuration:
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`
- **Development Command**: `npm run dev`

## Troubleshooting

### Build Fails
- Ensure all dependencies are in `package.json`
- Check that Node.js version is compatible (18.x or higher)

### Animation Not Working
- Verify JavaScript is enabled in the browser
- Check browser console for errors
- Ensure the component is client-side rendered (uses "use client" directive)

## Post-Deployment

After deployment, your Möbius strip animation will be available at:
- **Preview**: `https://your-project-name.vercel.app`
- **Production**: Custom domain (if configured)

The animation should start automatically when the page loads.
