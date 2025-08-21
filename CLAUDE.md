# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 application called "evolution-game" that appears to be designed for building a game with 3D graphics and blockchain integration. The project uses the App Router architecture and is built with TypeScript.

## Core Technologies

- **Next.js 15** with App Router (React 19)
- **TypeScript** with strict mode enabled  
- **Tailwind CSS v4** for styling with inline theme configuration
- **Three.js** ecosystem via `@react-three/fiber` and `@react-three/drei` for 3D graphics
- **Web3 Integration** via `wagmi`, `viem`, and `ethers` for blockchain functionality
- **State Management** via `zustand`

## Development Commands

```bash
# Start development server with Turbopack
npm run dev
# or
pnpm dev

# Build for production
npm run build

# Start production server
npm run start

# Run ESLint
npm run lint
```

## Project Structure

- `src/app/` - Next.js App Router pages and layouts
- `src/app/layout.tsx` - Root layout with Geist font configuration
- `src/app/page.tsx` - Home page (currently default Next.js template)
- `src/app/globals.css` - Global styles with Tailwind CSS v4 and CSS custom properties

## Configuration

- **TypeScript**: Configured with strict mode, path aliases (`@/*` → `./src/*`)
- **ESLint**: Uses Next.js recommended configs with TypeScript support
- **Tailwind CSS v4**: Configured with inline theme syntax in globals.css
- **Next.js**: Basic configuration with Turbopack enabled for development

## Architecture Notes

The project is set up for a 3D game with blockchain features:
- Three.js integration suggests 3D graphics/game mechanics
- Web3 stack (wagmi/viem/ethers) indicates blockchain integration (likely Ethereum)
- Zustand for client-side state management
- Modern React patterns with App Router

The project is currently in initial setup phase with mostly default Next.js template content that will likely be replaced with actual game implementation.