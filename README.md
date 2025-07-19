# OCDS Releases Viewer

A modern React application for viewing South African Government Procurement Data (OCDS Releases) built with Vite and shadcn/ui components.

## Features

- **Modern UI**: Built with React, TypeScript, and Tailwind CSS
- **shadcn/ui Components**: Beautiful, accessible UI components
- **Responsive Design**: Works on desktop and mobile devices
- **Fast Development**: Powered by Vite for instant hot reload
- **Type Safety**: Full TypeScript support

## Tech Stack

- **Frontend**: React 18, TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Routing**: React Router DOM
- **Icons**: Lucide React

## Getting Started

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Start the development server**:

   ```bash
   npm run dev
   ```

3. **Build for production**:

   ```bash
   npm run build
   ```

4. **Preview production build**:
   ```bash
   npm run preview
   ```

## API Integration

The application expects an API server running on `http://localhost:8080` with the following endpoints:

- `GET /api/OCDSReleases` - List releases with pagination and date filtering
- `GET /api/OCDSReleases/release/{ocid}` - Get detailed release information

The Vite dev server is configured to proxy API requests to avoid CORS issues.

## Project Structure

```
src/
├── components/ui/     # shadcn/ui components
├── lib/              # Utility functions
├── pages/            # Page components
├── types/            # TypeScript type definitions
├── App.tsx           # Main app component
└── main.tsx          # App entry point
```

## Features

### Releases Page

- Filter releases by date range
- Configurable page size
- Pagination support
- Click to view detailed information

### Detail Page

- Complete tender information
- Document downloads
- Responsive layout
- Back navigation

## Development

This project uses modern development practices:

- **ESLint** for code linting
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **shadcn/ui** for consistent UI components
