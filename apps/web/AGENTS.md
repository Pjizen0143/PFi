## Web Service Architecture & Guidelines

### 1. Feature Implementation

- **Feature-Driven Architecture**: Business domains (e.g., `auth`, `wallets`) are encapsulated in the `features/` directory.
- Each feature module is self-contained with its own `components/`, `hooks/`, `services/` (API integration), and `types/`.

### 2. Components

- **UI Primitives**: Generic, highly reusable elements (e.g., Button, Input, Card) go in `components/ui/`.
- **Shared Components**: Global or layout elements (e.g., Navbar, LanguageSwitcher) are placed in `components/shared/`.
- **Feature Components**: Domain-specific UI elements reside in `features/<feature-name>/components/`.

### 3. UI Style

- **Tailwind CSS v4**: Built entirely with Tailwind CSS v4.
- **Custom Primitives**: Do not use external component libraries (like shadcn/ui). Rely on custom Tailwind classes with semantic design tokens (e.g., `bg-primary`, `text-foreground`).
- **Theming & i18n**: Support dark/light modes (`@teispace/next-themes`) and localization (`next-intl`) across all components.

### 4. Hooks

- **Feature Hooks**: Business logic and state management are extracted into custom hooks within `features/<feature-name>/hooks/` (e.g., `use-login.ts`).
- Hooks manage client-side state (`loading`, `error`, `success`, `validationErrors`), perform client-side validation, and call API services.
- **Error Handling**: Use the `FormErrorHandler` utility (`@/lib/utils/error-handler`) within hooks to uniformly process server errors.

### 5. API Services (Data Fetching)

- **Service Location**: API integration functions must reside in `features/<feature-name>/services/`.
- **Function Declaration**: Use standard named `export async function` syntax rather than arrow functions.
- **Asynchronous Pattern**: Always use `async/await` and return the outer response layer `response.data` directly from the Axios response. Do not unwrap the inner `.data` layer within the service.
- **Explicit Typing**: Strictly define return types using `Promise<ResponseEnvelopeType>` (e.g., `Promise<WalletResponse>`). Always use `import type` when importing TypeScript types/interfaces to optimize tree-shaking.
- **Naming Conventions**: Use `payload` as the parameter name for any incoming data object (e.g., `payload: CreateWalletPayload`).
- **Path Resolution**: Use relative paths for endpoints (e.g., `"/api/v1/wallets"`) instead of hardcoded absolute URLs. Let the central Axios instance (`@/lib/axios`) handle the base URL.

```typescript
import { api } from "@/lib/axios";
import type { CreateWalletPayload, WalletResponse } from "../types";

export async function createWallet(payload: CreateWalletPayload): Promise<WalletResponse> {
  const response = await api.post<WalletResponse>("/api/v1/wallets", payload);
  return response.data;
}
```

### 6. Custom Hooks & State Sync

- **Response Unwrapping**: Because API services return the entire response envelope (e.g., `{ data: T }`), hooks are responsible for verifying that `res.data` exists before setting local state.
- **TypeScript Safety**: When pushing newly created or updated objects into a state array, extract and strictly type the entity first to avoid `null` or `undefined` assignability errors.

```typescript
const res = await createWallet(payload);
if (res && res.data) {
  const newWallet: Wallet = res.data;
  setWallets((prev) => [...prev, newWallet]);
  return true;
}
```
