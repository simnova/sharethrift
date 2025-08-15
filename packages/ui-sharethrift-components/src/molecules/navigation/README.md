# Navigation Molecule

A responsive navigation sidebar component following Atomic Design principles, using Ant Design and CSS modules.

- Static left sidebar on large screens, hamburger menu on mobile
- Navigation: Home, My Listings, My Reservations, Messages, Account (with subnav: Profile, Bookmarks, Settings)
- Logout at bottom on desktop, at bottom of menu on mobile
- Responsive to all screen sizes
- Figma reference: [Navigation Design](https://www.figma.com/design/2PO9lrpm2FnGdvAgYPkVTR/Intealth-Team-Library?node-id=15969-24715&t=Vm81gLZ7GHl1y764-4)

## Props
- `isAuthenticated: boolean` — Whether the user is logged in
- `onNavigate?: (route: string) => void` — Handler for navigation
- `onLogout?: () => void` — Handler for Log Out
