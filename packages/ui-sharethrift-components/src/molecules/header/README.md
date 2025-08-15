# Header Molecule

A responsive header component following Atomic Design principles, using Ant Design and CSS modules.

- Left-aligned logo (with text on large screens, logo only on small screens)
- Right-aligned authentication actions: Sign Up | Log In or Log Out
- Responsive to all screen sizes
- Figma reference: [Header Design](https://www.figma.com/design/2PO9lrpm2FnGdvAgYPkVTR/Intealth-Team-Library?node-id=15968-190943&t=Vm81gLZ7GHl1y764-4)

## Props
- `isAuthenticated: boolean` — Whether the user is logged in
- `onLogin?: () => void` — Handler for Log In
- `onSignUp?: () => void` — Handler for Sign Up
- `onLogout?: () => void` — Handler for Log Out
