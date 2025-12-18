# Spinning Möbius Strip - ASCII Animation

A mesmerizing 3D Möbius strip rendered entirely in ASCII characters with smooth rotation animation.

## Features

- **Real-time 3D rendering**: Parametric Möbius strip equations with proper 3D transformations
- **ASCII art**: Depth-based character mapping for visual depth perception
- **Smooth animation**: Continuous rotation on multiple axes
- **Responsive design**: Adapts to different screen sizes
- **Matrix-style aesthetics**: Green-on-black terminal look with glow effects

## How It Works

The application uses:
1. **Parametric equations** to generate the Möbius strip surface
2. **3D rotation matrices** for X, Y, and Z axis rotations
3. **Perspective projection** to convert 3D coordinates to 2D screen space
4. **Z-buffering** to handle depth and occlusion
5. **Lighting calculations** to determine ASCII character intensity
6. **React hooks** for animation loop management

## Running Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the animation.

## Deploying to Vercel

```bash
vercel
```

Or connect your GitHub repository to Vercel for automatic deployments.

## Technical Details

- **Framework**: Next.js 16 with TypeScript
- **Styling**: Tailwind CSS
- **Animation**: requestAnimationFrame for smooth 60fps rendering
- **Math**: Custom 3D transformation and projection algorithms

## License

MIT
