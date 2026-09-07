# Aura Fitness — Frontend

A premium, responsive React booking platform for Aura Fitness, built with React 19, React Router, and Tailwind CSS.

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL (usually http://localhost:5173).

To build for production:

```bash
npm run build
npm run preview
```

## Project structure

```
src/
  components/     Reusable UI: Navbar, BottomNav, Avatar, Button, Input, Chip,
                  Icon, ClassCard, Footer, Layout, ProtectedRoute
  pages/          Landing, Login, Register, Home, Classes, Schedule,
                  Bookings, Profile
  context/        AuthContext — mock, localStorage-backed auth state
  data/           Mock class/instructor data
  styles/         Tailwind entry + small global CSS
```

## Routing

| Route        | Page      | Access          |
|--------------|-----------|-----------------|
| `/`          | Landing   | Public          |
| `/login`     | Login     | Public          |
| `/register`  | Register  | Public          |
| `/home`      | Home      | Requires login  |
| `/classes`   | Classes   | Requires login  |
| `/schedule`  | Schedule  | Requires login  |
| `/bookings`  | Bookings  | Requires login  |
| `/profile`   | Profile   | Requires login  |

Unauthenticated visitors hitting a protected route are redirected to `/login`
and sent on to their original destination after logging in. Logging in or
registering redirects to `/home`.

## Auth

`src/context/AuthContext.jsx` is a mock, frontend-only auth implementation
(localStorage-backed) so the full UI/UX works without a live backend. It
exposes `{ user, isAuthenticated, isLoading, login, register, logout }`.
To connect a real backend, replace the bodies of `login`/`register` with API
calls and keep the same return shape — no other file needs to change.

## Profile avatar

`Avatar` (in `src/components/Avatar.jsx`) always derives its initial from
`user.username.charAt(0).toUpperCase()` — there is no photo upload or random
avatar image, per spec.

## Design system

Colors, type scale, spacing and radii in `tailwind.config.js` are taken
directly from the provided `DESIGN.md` design tokens. `ClassCard` mirrors the
provided reference "Classes" screen (card image, category chip, title,
schedule, instructor, spots remaining, Reserve/Waitlist button).

## Notes on icons/images

Icons use the Material Symbols web font (loaded via Google Fonts in
`index.html`) and class photography is loaded from the same CDN URLs used in
the original design reference. Both require normal internet access in the
browser; if you're testing in a fully offline/sandboxed environment, icons
will fall back to their text names and images may not load, but this is
purely a network-access artifact — not an app bug.
