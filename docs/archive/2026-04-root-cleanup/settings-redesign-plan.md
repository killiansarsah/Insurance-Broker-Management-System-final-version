# Settings Redesign Implementation Plan

## 1. Topological Redesign (Vertical Layout)
We will fundamentally alter the layout of `src/app/dashboard/settings/page.tsx`.
- **Remove:** The horizontal scrolling tab strip.
- **Implement:** A **25/75 Asymmetrical Split**. 
  - Left side (25%): A fixed/sticky, sleek vertical sidebar listing all navigation groups (Overview, Profile, Organization, Communication, etc.). 
  - Right side (75%): A high-focus canvas area that displays the active configuration section.
- **Micro-interactions:** Navigation links in the sidebar will feature subtle slide-in indicator bars (`scale-y`) and active state highlights to anchor the user context.

## 2. Re-Imagining Access Control (`settings-access-control.tsx`)
The current layout is a massive vertical stack of white-rounded rows. 
- **Grouping:** Group team members visually based on their hierarchical tier (e.g., Administrators, Supervisors, Agents). This makes scanning 100x easier.
- **Grid Strategy:** Use a fragmented grid representation (similar to a dashboard rather than just a dry list).
- **Consolidation:** The "Roles & Permissions" tab will be blended more smoothly using an inline-expanding row instead of a completely disconnected sub-tab if possible, or refined to match the sharper aesthetic.

## 3. "Administrative" Geometry
The rest of IBMS has soft, rounded aesthetics (friendly). The settings area is a control panel, it should feel more **Technical and Authoritative**:
- Shift away from excessive `rounded-2xl` and `bg-surface-50` padding.
- Move towards crisp `rounded-lg` or `sm`, sharper 1px raw borders, and higher-contrast typography.
- Use **"Layered Depth"** where active sections elevate softly above the grid.

## Next Steps
1. Edit `page.tsx` to build the new Vertical Container layout.
2. Edit `settings-access-control.tsx` to restructure the Teams & Roles management view.
3. Apply modern, performant Tailwind primitives (`will-change: transform`, `transform-gpu`) for any sub-tab transitions.
