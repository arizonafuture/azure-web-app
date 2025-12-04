# Migration to Next.js App Router - TODO List

## 1. Update package.json
- [ ] Remove react-scripts, react-router-dom
- [ ] Add next, @next/font, @types/node (if needed)
- [ ] Update scripts to Next.js: "dev": "next dev", "build": "next build", "start": "next start"

## 2. Create next.config.js
- [ ] Create next.config.js with basic configuration

## 3. Create app/ directory structure
- [ ] Create app/ directory
- [ ] Move src/components/ to app/components/
- [ ] Move src/layouts/ to app/layouts/
- [ ] Move src/hooks/ to app/hooks/
- [ ] Move src/contexts/ to app/contexts/
- [ ] Move src/config/ to app/config/
- [ ] Move src/types/ to app/types/
- [ ] Move src/utils/ to app/utils/

## 4. Convert App.tsx to layout.tsx and page.tsx
- [ ] Create app/layout.tsx from src/App.tsx (root layout with AuthProvider)
- [ ] Create app/page.tsx (home page component)
- [ ] Create app/[...path]/page.tsx for dynamic Umbraco routes

## 5. Move and adapt pages
- [ ] Move src/pages/Login.tsx to app/login/page.tsx
- [ ] Move src/pages/Register.tsx to app/register/page.tsx
- [ ] Adapt navigation in pages to use Next.js router

## 6. Adapt hooks
- [ ] Update useUmbracoContent.ts: Replace useLocation with usePathname, add 'use client'
- [ ] Update useUmbracoHeader.ts: Add 'use client'
- [ ] Update any other hooks using React Router

## 7. Adapt contexts
- [ ] Update AuthContext.tsx: Add 'use client', adapt logout to use Next.js router

## 8. Add 'use client' to components
- [ ] Add 'use client' to all components using hooks or browser APIs (most of them)

## 9. Update configs and styles
- [ ] Update tsconfig.json for Next.js
- [ ] Update tailwind.config.js content paths to app/
- [ ] Create app/globals.css from src/index.css and src/App.css
- [ ] Update env vars in config files to NEXT_PUBLIC_ prefix

## 10. Handle preview mode
- [ ] Adapt preview logic to use useSearchParams instead of window.location.search

## 11. Clean up
- [ ] Remove src/index.tsx, src/App.test.tsx, public/index.html, etc.
- [ ] Update any remaining imports

## 12. Testing and verification
- [ ] Install dependencies
- [ ] Run dev server
- [ ] Test routing, auth, content rendering, preview mode
- [ ] Fix any import or build errors
