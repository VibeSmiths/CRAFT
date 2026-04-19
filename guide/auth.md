# Authentication & Roles

CRAFT Studio uses Keycloak for single sign-on (SSO) with role-based access control. Authentication is enforced at the infrastructure layer via Traefik ForwardAuth, so the application never handles passwords or session tokens directly.

## Login Flow

1. **User visits the studio URL** (e.g., `https://connect.rudolphhome.com:2083/studio/`)
2. **Traefik ForwardAuth** intercepts the request and forwards it to oauth2-proxy
3. **oauth2-proxy** checks for a valid session cookie. If none exists, it redirects to **Keycloak**
4. **Keycloak login page** prompts for username and password
5. **OIDC callback** — Keycloak issues an authorization code, oauth2-proxy exchanges it for tokens
6. **Session established** — oauth2-proxy sets a session cookie and proxies the original request through to the studio, injecting identity headers

After login, every request to the studio backend includes ForwardAuth headers that identify the user.

## Roles

Keycloak realm roles control what each user can see and do. Four roles are defined:

### Admin

- Full access to all channels regardless of ownership
- All AI models available (Opus, Sonnet, Haiku, Gemini, Ollama)
- Bypasses all authorization guards
- Can manage all users' resources and content
- Automatically qualifies as premium

### Editor

- Read access to all channels
- Write access only to own channels
- Standard model access (upgraded with API keys or premium role)

### Premium

- Access to advanced AI models: Claude Opus, Claude Sonnet, and all MCP tool integrations
- Proposals and Jobs features unlocked (channel-scoped)
- Full Claude Agent SDK capabilities

### Standard / Member

- Own channels only (create, read, update, delete)
- Limited to Ollama local models and Claude Haiku
- No proposals or jobs access
- Basic content creation features

## 3-Tier Model Access

Model availability depends on the user's role and stored API keys:

| Tier | Who qualifies | Available models |
|------|--------------|-----------------|
| **Standard** | All authenticated users | Ollama (local models) + Claude Haiku |
| **API Keys** | Users with stored Gemini/Claude keys | Gemini models + Haiku |
| **Premium** | `premium` role or `admin` role | All Claude models (Opus, Sonnet, Haiku) + Gemini + Ollama + MCP tools |

API keys are stored per-user (encrypted AES-256-GCM in PostgreSQL) and managed via the profile avatar menu, under **API Keys**. The server checks user keys first, then falls back to server-wide `.env` values.

## Password Change

Users can change their Keycloak password without leaving the studio:

1. Click your **avatar** in the top-right of the top chrome
2. Click **Change password** in the dropdown
3. Enter your **current password** for verification (validated against Keycloak)
4. Enter and confirm your **new password**
5. The new password is set via the Keycloak admin API

The current password check prevents unauthorized changes if a session is left open.

## Sign Out

Click your avatar in the top-right of the top chrome, then **Sign out** at the bottom of the dropdown. This clears the oauth2-proxy session, ends the Keycloak session, and returns you to the login flow.

## Multi-Tenant Isolation

CRAFT Studio is multi-tenant by design. Every channel has a `user_id` column that ties it to the user who created it.

- **Admin** — sees and manages all channels from all users
- **Editor** — reads all channels, but can only modify channels they own
- **Standard** — sees only their own channels

The `channelAccess` middleware enforces these rules on every channel-scoped API request. Resources follow a similar pattern: files are owned by `user_id` with optional channel assignment via a junction table.

## ForwardAuth Headers

When Traefik forwards a request through oauth2-proxy, three headers are injected:

| Header | Contents |
|--------|----------|
| `X-Auth-Request-User` | Keycloak username (e.g., `alex`) |
| `X-Auth-Request-Email` | User's email address |
| `X-Auth-Request-Access-Token` | JWT access token from Keycloak |

The auth middleware in `middleware/auth.ts` extracts these on every request and attaches the user identity to the request context.

## JWT Payload

The access token is a standard JWT. The backend decodes it to extract roles:

```json
{
  "realm_access": {
    "roles": ["admin", "premium", "default-roles-home"]
  },
  "preferred_username": "alex",
  "email": "alex@example.com"
}
```

The `realm_access.roles` array determines the user's permissions. Since the JWT comes from a trusted reverse proxy (Traefik + oauth2-proxy), the backend decodes it without cryptographic validation — the proxy has already verified the token with Keycloak.

Role flags derived from the JWT:

- `isAdmin` — `roles` includes `admin`
- `isEditor` — `roles` includes `editor`
- `isPremium` — `roles` includes `premium` **or** `admin` (admin auto-qualifies)

## Dev Mode Bypass

When `NODE_ENV` is not set to `production`, the auth middleware skips ForwardAuth header checks and defaults to a development user:

- **Username**: `dev`
- **Roles**: `admin` + `premium`

This allows local development without running Keycloak or oauth2-proxy. All features are unlocked in dev mode.
