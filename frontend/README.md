# Video Participant Dashboard Frontend

A modern React-based frontend application for managing and monitoring video call participants. Built with Vite, Tailwind CSS, and React Router for a fast, responsive user experience.

## Technology Stack

- **Framework**: React 19.2.0
- **Build Tool**: Vite 7.2.4
- **Package Manager**: npm
- **Routing**: React Router DOM 6.30.3
- **Styling**: Tailwind CSS 3.4.0
- **UI Components**: Radix UI (headless components)
- **HTTP Client**: Axios 1.6.0
- **Icons**: Lucide React 0.460.0
- **Utilities**: 
  - `clsx` & `tailwind-merge` for className management
  - `class-variance-authority` for component variants

## Project Structure

```
frontend/
├── src/
│   ├── api/               # API layer
│   │   ├── client.js      # Axios instance with interceptors
│   │   ├── endpoints.js   # API endpoint definitions
│   │   └── participants.api.js  # Participant API functions
│   ├── app/               # Application routing
│   │   └── AppRoutes.jsx  # Route configuration
│   ├── components/        # React components
│   │   ├── ParticipantCard.jsx    # Participant card component
│   │   ├── ParticipantModal.jsx   # Participant detail modal
│   │   └── ui/            # Reusable UI components
│   │       ├── Avatar.jsx
│   │       ├── Badge.jsx
│   │       ├── Button.jsx
│   │       └── Card.jsx
│   ├── hooks/             # Custom React hooks
│   │   ├── useParticipants.js  # Participant data fetching hook
│   │   └── useMediaControls.js # Media control operations hook
│   ├── pages/             # Page components
│   │   └── Participants/
│   │       ├── ParticipantsPage.jsx      # Presentational component
│   │       └── ParticipantsContainer.jsx # Container component (logic)
│   ├── services/          # Business logic layer
│   │   └── participants.service.js  # Participant service with data transformation
│   ├── utils/             # Utility functions
│   │   ├── cn.js          # className utility (clsx + tailwind-merge)
│   │   └── debounce.js    # Debounce utility function
│   ├── App.jsx            # Root component
│   ├── App.css            # Global styles
│   ├── main.jsx           # Application entry point
│   └── index.css          # Tailwind CSS imports and theme variables
├── index.html             # HTML template
├── package.json           # Dependencies and scripts
├── vite.config.js         # Vite configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── postcss.config.js      # PostCSS configuration
└── eslint.config.js       # ESLint configuration
```

## Setup Instructions

### Prerequisites

- Node.js 18.x or higher
- npm (comes with Node.js)

### Installation

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the `frontend` directory (optional):
   ```env
   VITE_API_BASE_URL=http://localhost:8000
   ```
   If not set, the application defaults to `http://localhost:8000`.

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173` (or the next available port).

## Available Scripts

- **`npm run dev`** - Start the development server with hot module replacement (HMR)
- **`npm run build`** - Build the application for production (outputs to `dist/` folder)
- **`npm run preview`** - Preview the production build locally
- **`npm run lint`** - Run ESLint to check code quality

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_API_BASE_URL` | No | `http://localhost:8000` | Base URL for the backend API |

**Note**: All environment variables in Vite must be prefixed with `VITE_` to be accessible in the application code.

## Architecture Overview

### UI Architecture

The application follows a **Container/Presentational** component pattern:

- **Container Components** (`ParticipantsContainer.jsx`): Handle state management, business logic, and data fetching. They pass data and callbacks to presentational components.
- **Presentational Components** (`ParticipantsPage.jsx`): Focus solely on rendering UI based on props. They are stateless and reusable.

### State Management

The application uses **React Hooks** for state management (no external state management library):

- **`useState`**: Local component state (search query, selected participant)
- **`useEffect`**: Side effects and data fetching
- **`useCallback`**: Memoized callbacks to prevent unnecessary re-renders
- **`useMemo`**: Computed values (filtered participants, statistics)

### Custom Hooks

- **`useParticipants`**: Manages participant data fetching, loading states, and error handling. Automatically refetches when search query changes.
- **`useMediaControls`**: Provides functions to toggle microphone, camera, and online status. Handles optimistic updates.

### Data Flow

1. **User Interaction** → Container component receives event
2. **Hook/Service Call** → Custom hook or service function is invoked
3. **API Request** → Axios client sends HTTP request to backend
4. **Data Transformation** → Service layer transforms backend response (snake_case → camelCase)
5. **State Update** → React state is updated with transformed data
6. **UI Re-render** → Components re-render with new data

### Component Hierarchy

```
App
└── AppRoutes
    └── ParticipantsContainer (state & logic)
        └── ParticipantsPage (presentation)
            ├── Search Input
            ├── Statistics Cards
            └── ParticipantCard[] (grid)
                └── ParticipantModal (on click)
```

## Backend Communication

### API Client Configuration

The application uses **Axios** as the HTTP client, configured in `src/api/client.js`:

- **Base URL**: Configurable via `VITE_API_BASE_URL` environment variable
- **Default Timeout**: 10 seconds
- **Request Interceptor**: Logs outgoing requests (can be extended for auth tokens)
- **Response Interceptor**: Handles errors and logs API responses

### API Layer Structure

1. **`src/api/client.js`**: Axios instance with base configuration
2. **`src/api/endpoints.js`**: Centralized endpoint definitions
3. **`src/api/participants.api.js`**: API functions for participant operations
4. **`src/services/participants.service.js`**: Service layer that:
   - Calls API functions
   - Transforms data (snake_case ↔ camelCase)
   - Handles errors with user-friendly messages

### API Endpoints Used

- **GET** `/participants?search={query}` - Fetch all participants (with optional search)
- **GET** `/participants/{id}` - Fetch participant by ID
- **PATCH** `/participants/{id}/mic` - Update microphone state
- **PATCH** `/participants/{id}/camera` - Update camera state
- **PATCH** `/participants/{id}/status` - Update online status

### Data Transformation

The backend returns data in `snake_case` (e.g., `is_online`, `avatar_url`), while the frontend uses `camelCase` (e.g., `isOnline`, `avatarUrl`). The service layer (`participants.service.js`) handles this transformation automatically.

## Key Features

### Participant Management

- **List View**: Grid layout displaying all participants with their status
- **Search**: Real-time search with debouncing (300ms delay) to filter participants by name
- **Statistics**: Dashboard showing total participants, online count, and active cameras
- **Detail Modal**: Click any participant card to view detailed information and controls

### Media Controls

- **Microphone Toggle**: Enable/disable microphone for participants
- **Camera Toggle**: Turn camera on/off for participants
- **Online Status**: Set participants online or offline
- **Visual Indicators**: Color-coded badges and icons showing current state

### User Experience

- **Loading States**: Skeleton screens and loading spinners during data fetching
- **Error Handling**: User-friendly error messages with retry options
- **Responsive Design**: Mobile-first approach with Tailwind CSS breakpoints
- **Accessibility**: ARIA labels and keyboard navigation support

## Styling

### Tailwind CSS

The application uses **Tailwind CSS** with a custom theme configuration:

- **Design System**: Custom color palette defined in CSS variables
- **Dark Mode**: Theme variables prepared (not currently implemented in UI)
- **Component Variants**: Using `class-variance-authority` for component styling
- **Utility Classes**: Extensive use of Tailwind utility classes

### UI Components

Reusable components built on **Radix UI** primitives:

- **Button**: Multiple variants (default, destructive, outline, secondary, ghost, link)
- **Card**: Container component with header and content sections
- **Avatar**: Image display with fallback initials
- **Badge**: Status indicators with variants

All UI components are located in `src/components/ui/` and follow a consistent API pattern.

## Development Guidelines

### Code Style

- **ESLint**: Configured with React hooks and refresh plugins
- **File Naming**: PascalCase for components, camelCase for utilities
- **Component Structure**: Functional components with hooks
- **Prop Types**: Consider adding PropTypes or TypeScript for type safety

### Best Practices

1. **Separation of Concerns**: Logic in containers, presentation in components
2. **Custom Hooks**: Extract reusable logic into custom hooks
3. **Service Layer**: Keep API calls and data transformation in services
4. **Error Handling**: Always handle errors gracefully with user feedback
5. **Performance**: Use `useMemo` and `useCallback` for expensive operations

## Building for Production

1. **Build the application:**
   ```bash
   npm run build
   ```
   This creates an optimized production build in the `dist/` folder.

2. **Preview the build:**
   ```bash
   npm run preview
   ```
   This serves the production build locally for testing.

3. **Deploy:**
   The `dist/` folder contains static files that can be deployed to any static hosting service:
   - Vercel
   - Netlify
   - AWS S3 + CloudFront
   - GitHub Pages
   - Any web server (nginx, Apache, etc.)

## Browser Support

The application targets modern browsers that support:
- ES2020+ JavaScript features
- CSS Grid and Flexbox
- Fetch API (via Axios)

## Dependencies

### Production Dependencies

- **React Ecosystem**: `react`, `react-dom`, `react-router-dom`
- **UI Libraries**: Multiple `@radix-ui/*` packages for accessible components
- **Styling**: `tailwindcss`, `clsx`, `tailwind-merge`, `class-variance-authority`
- **HTTP**: `axios`
- **Icons**: `lucide-react`
- **Forms**: `react-hook-form` (available but not currently used)

### Development Dependencies

- **Build Tool**: `vite`, `@vitejs/plugin-react`
- **Linting**: `eslint`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`
- **CSS Processing**: `postcss`, `autoprefixer`, `tailwindcss`
- **Type Definitions**: `@types/react`, `@types/react-dom`

## Troubleshooting

### Common Issues

1. **API Connection Errors**: 
   - Verify `VITE_API_BASE_URL` is set correctly
   - Ensure the backend server is running
   - Check CORS configuration on the backend

2. **Build Errors**:
   - Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
   - Clear Vite cache: `rm -rf node_modules/.vite`

3. **Styling Issues**:
   - Ensure Tailwind CSS is properly configured
   - Check that `index.css` is imported in `main.jsx`
