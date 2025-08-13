import "../src/styles/theme.css";

// Remove Storybook's default 1rem padding from .sb-show-main.sb-main-padded
const style = document.createElement('style');
style.innerHTML = `
  .sb-show-main.sb-main-padded {
    padding: 0 !important;
  }
`;
document.head.appendChild(style);

export const parameters = {};
