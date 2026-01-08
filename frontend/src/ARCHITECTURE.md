# Frontend Architecture Documentation

## Overview

This frontend follows a strict, industry-standard layered architecture that separates concerns and enables scalability, testability, and maintainability.

## Architecture Layers

```
┌─────────────────────────────────────────┐
│         Components & Hooks              │  ← UI Layer (React-specific)
│  (App.jsx, ParticipantCard, etc.)       │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│         Services Layer                  │  ← Business Logic & Domain Models
│  (participants.service.js)              │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│         API Layer                       │  ← HTTP Communication
│  (participants.api.js)                  │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│         Client & Endpoints              │  ← Infrastructure
│  (client.js, endpoints.js)              │
└─────────────────────────────────────────┘
```

## Layer Responsibilities

### 1. API Layer (`src/api/`)

**Purpose:** Pure HTTP communication layer. No business logic, no data transformation, no React dependencies.

#### `api/client.js`
- **Single source of truth** for axios instance
- Base URL configuration
- Request/response interceptors
- Global error handling
- Future-ready for auth tokens, retry logic, etc.

**Why it exists:**
- Centralized HTTP configuration
- Easy to add cross-cutting concerns (auth, logging, metrics)
- Single place to modify request/response behavior
- Prevents duplicate axios instances

#### `api/endpoints.js`
- **Only route path constants** (no baseURL, no HTTP methods)
- Single source of truth for all API routes
- Easy to refactor if backend changes

**Why it exists:**
- Prevents hardcoded URLs scattered across codebase
- Type-safe endpoint references
- Easy to find and update routes

#### `api/participants.api.js`
- **Pure HTTP functions** - make requests, return responses
- No data transformation
- No business logic
- No error message creation for users

**Why it exists:**
- Separation of HTTP concerns from business logic
- Reusable across different service implementations
- Easy to mock for testing
- Can swap axios for fetch or other HTTP clients

**Example:**
```javascript
// ✅ Good - Pure HTTP call
export async function fetchParticipants(searchQuery) {
  return apiClient.get(PARTICIPANT_ENDPOINTS.LIST, { params: { search: searchQuery } });
}

// ❌ Bad - Would include transformation
export async function fetchParticipants(searchQuery) {
  const response = await apiClient.get(...);
  return response.data.map(transform); // NO - this belongs in service layer
}
```

---

### 2. Services Layer (`src/services/`)

**Purpose:** Business logic, data transformation, and domain rules. React-agnostic.

#### `services/participants.service.js`
- **Transforms** backend data models to frontend domain models
- **Applies** business rules and validations
- **Provides** domain-specific error messages
- **Orchestrates** multiple API calls if needed
- **Handles** domain-specific error scenarios

**Why it exists:**
- Separates HTTP layer from business logic
- Centralized data transformation (snake_case → camelCase)
- Domain-specific error handling
- Can be used by hooks, components, or other services
- Easy to test business logic independently

**Key Functions:**
- `transformParticipant()` - Converts backend format to frontend format
- `extractErrorMessage()` - Creates user-friendly error messages
- Service methods that call API layer and transform responses

**Example:**
```javascript
// ✅ Good - Service handles transformation
async getAll(searchQuery) {
  const response = await participantsApi.fetchParticipants(searchQuery);
  return transformParticipants(response.data); // Transform here
}

// ❌ Bad - Would be in API layer
async fetchParticipants() {
  const response = await apiClient.get(...);
  return response.data.map(transform); // NO - API layer shouldn't transform
}
```

---

### 3. Hooks Layer (`src/hooks/`)

**Purpose:** React-specific state management and side effects. UI-facing layer.

#### `hooks/useParticipants.js`
- Manages React state (loading, error, data)
- Calls service layer (not API layer directly)
- Handles React lifecycle (useEffect, useCallback)
- Provides UI-friendly state interface

**Why it exists:**
- Separates React concerns from business logic
- Reusable state management across components
- Can be easily replaced with React Query or other state management
- Testable with React Testing Library

**Consumption Pattern:**
```javascript
// ✅ Good - Hook uses service layer
const { participants, isLoading, error } = useParticipants(searchQuery);

// ❌ Bad - Component uses API layer directly
const [data, setData] = useState([]);
useEffect(() => {
  participantsApi.fetchParticipants().then(...); // NO - use service layer
}, []);
```

#### `hooks/useMediaControls.js`
- React-specific hook for media control operations
- Calls service layer methods
- Manages React state updates

---

### 4. Components Layer (`src/components/`)

**Purpose:** Pure UI rendering. No business logic, no direct API calls.

**Rules:**
- ✅ Use hooks for data fetching
- ✅ Use service layer through hooks
- ✅ Handle UI state only
- ❌ Never call API layer directly
- ❌ Never call service layer directly (use hooks)

**Example:**
```javascript
// ✅ Good - Component uses hook
function App() {
  const { participants, isLoading } = useParticipants();
  // ... render UI
}

// ❌ Bad - Component calls service directly
function App() {
  const [data, setData] = useState([]);
  useEffect(() => {
    participantsService.getAll().then(setData); // NO - use hook instead
  }, []);
}
```

---

## Data Flow

### Fetching Participants

```
Component (App.jsx)
    ↓ calls
Hook (useParticipants)
    ↓ calls
Service (participantsService.getAll)
    ↓ calls
API (participantsApi.fetchParticipants)
    ↓ uses
Client (apiClient.get)
    ↓ returns
API (raw response)
    ↓ returns
Service (transforms data)
    ↓ returns
Hook (updates React state)
    ↓ updates
Component (re-renders with data)
```

### Updating Participant State

```
Component (ParticipantCard)
    ↓ calls
Hook (useMediaControls.toggleMic)
    ↓ calls
Service (participantsService.updateMic)
    ↓ calls
API (participantsApi.updateParticipantMic)
    ↓ uses
Client (apiClient.patch)
    ↓ returns
API (raw response)
    ↓ returns
Service (transforms updated data)
    ↓ returns
Hook (updates React state)
    ↓ updates
Component (re-renders with updated data)
```

---

## Key Principles

### 1. Single Responsibility
Each layer has ONE clear responsibility:
- **API Layer:** HTTP communication
- **Service Layer:** Business logic & transformation
- **Hooks Layer:** React state management
- **Components Layer:** UI rendering

### 2. Dependency Direction
Dependencies flow in ONE direction:
```
Components → Hooks → Services → API → Client
```

Never reverse this flow!

### 3. No Cross-Layer Dependencies
- Components never import from `api/` or `services/` directly
- Services never import from `hooks/` or `components/`
- API layer never imports from `services/`, `hooks/`, or `components/`

### 4. Data Transformation Location
- **Backend → Frontend:** Service layer transforms
- **Frontend → Backend:** Service layer transforms (if needed)

### 5. Error Handling
- **API Layer:** Logs errors, re-throws with context
- **Service Layer:** Creates user-friendly error messages
- **Hooks Layer:** Handles errors for UI display
- **Components Layer:** Displays error states

---

## File Structure

```
src/
├── api/                          # HTTP Communication Layer
│   ├── client.js                 # Axios instance, interceptors
│   ├── endpoints.js              # Route path constants
│   └── participants.api.js       # Participant HTTP calls
│
├── services/                      # Business Logic Layer
│   └── participants.service.js   # Participant business logic & transforms
│
├── hooks/                         # React State Management
│   ├── useParticipants.js        # Participants data hook
│   └── useMediaControls.js       # Media controls hook
│
├── components/                    # UI Components
│   ├── ParticipantCard.jsx
│   ├── ParticipantModal.jsx
│   └── ui/                       # Reusable UI primitives
│
└── utils/                         # Pure utility functions
    ├── cn.js                     # Class name utility
    └── debounce.js               # Debounce utility
    # NO API or HTTP logic here!
```

---

## Future Extensibility

### Adding Authentication

**Where to add:**
- `api/client.js` - Add auth token to request interceptor
- `api/client.js` - Handle 401/403 in response interceptor
- `services/auth.service.js` - Create new service for auth logic

**Example:**
```javascript
// api/client.js
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Adding React Query

**Where to add:**
- Replace `hooks/useParticipants.js` with React Query hooks
- Service layer remains unchanged
- API layer remains unchanged

**Example:**
```javascript
// hooks/useParticipants.js (with React Query)
export function useParticipants(searchQuery) {
  return useQuery({
    queryKey: ['participants', searchQuery],
    queryFn: () => participantsService.getAll(searchQuery),
  });
}
```

### Adding New API Resource

**Steps:**
1. Add endpoints to `api/endpoints.js`
2. Create `api/{resource}.api.js` with HTTP functions
3. Create `services/{resource}.service.js` with business logic
4. Create `hooks/use{Resource}.js` for React state
5. Use hook in components

---

## Testing Strategy

### Unit Tests
- **API Layer:** Mock axios, test HTTP calls
- **Service Layer:** Mock API layer, test transformations
- **Hooks:** Mock service layer, test React state
- **Components:** Mock hooks, test UI rendering

### Integration Tests
- Test full flow: Component → Hook → Service → API
- Mock only the HTTP client (axios)

---

## Migration Notes

### What Changed
- ✅ Moved axios instance to `api/client.js`
- ✅ Separated endpoints to `api/endpoints.js`
- ✅ Created pure HTTP functions in `api/participants.api.js`
- ✅ Moved transformations to `services/participants.service.js`
- ✅ Updated hooks to use service layer
- ✅ Removed API logic from `utils/`

### What Stayed the Same
- ✅ All functionality preserved
- ✅ Same data transformations
- ✅ Same error handling behavior
- ✅ Same component interfaces

---

## Benefits of This Architecture

1. **Testability:** Each layer can be tested independently
2. **Maintainability:** Clear separation of concerns
3. **Scalability:** Easy to add new features without breaking existing code
4. **Reusability:** Service layer can be used by hooks, components, or other services
5. **Future-ready:** Easy to add auth, React Query, caching, etc.
6. **Team-friendly:** Clear boundaries for different developers to work on

---

## Common Patterns

### Adding a New Endpoint

1. **Add to endpoints.js:**
```javascript
export const PARTICIPANT_ENDPOINTS = {
  // ... existing
  NEW_ENDPOINT: (id) => `/participants/${id}/new-action`,
};
```

2. **Add to participants.api.js:**
```javascript
export async function newAction(id, data) {
  return apiClient.post(PARTICIPANT_ENDPOINTS.NEW_ENDPOINT(id), data);
}
```

3. **Add to participants.service.js:**
```javascript
async newAction(id, data) {
  try {
    const response = await participantsApi.newAction(id, data);
    return transformParticipant(response.data);
  } catch (error) {
    const message = extractErrorMessage(error, 'Failed to perform action');
    throw new Error(message);
  }
}
```

4. **Use in hook or component:**
```javascript
const result = await participantsService.newAction(id, data);
```

---

## Anti-Patterns to Avoid

### ❌ Don't: Call API layer from components
```javascript
// BAD
function Component() {
  useEffect(() => {
    participantsApi.fetchParticipants().then(...);
  }, []);
}
```

### ❌ Don't: Transform data in API layer
```javascript
// BAD
export async function fetchParticipants() {
  const response = await apiClient.get(...);
  return response.data.map(transform); // NO - do this in service layer
}
```

### ❌ Don't: Put business logic in API layer
```javascript
// BAD
export async function updateMic(id, micOn) {
  if (micOn && !hasPermission()) { // NO - business logic in service layer
    throw new Error('No permission');
  }
  return apiClient.patch(...);
}
```

### ❌ Don't: Create multiple axios instances
```javascript
// BAD - in multiple files
const apiClient = axios.create({ baseURL: '...' }); // NO - use api/client.js
```

---

## Summary

This architecture provides:
- ✅ Clear separation of concerns
- ✅ Easy to test and maintain
- ✅ Scalable for future features
- ✅ Industry-standard patterns
- ✅ Ready for production use

