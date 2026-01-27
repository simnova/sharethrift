import type { Preview } from '@storybook/react-vite';
import "@sthrift/ui-components/src/styles/theme.css";
import '../src/index.css';
import '../src/App.css'

const preview: Preview = {
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
		a11y: {
			test: 'todo',
		},
		options: {
			storySort: {
				order: [
					'Pages', 
            ['Home - Unauthenticated',
            'Login', 
            'Signup', ['Select Account Type', 'Account Setup', 'Profile Setup', 'Terms', 'Payment'],
            'Home - Authenticated',
            'My Listings',
            'My Reservations',
            'Messages',
            'Account', ['Profile', 'Settings']],
					'Components',
          'Containers'
				],
			},
		},
	},
};

// Remove Storybook's default 1rem padding from .sb-show-main.sb-main-padded
const style = document.createElement("style");
style.innerHTML = `
  .sb-show-main.sb-main-padded {
    padding: 0 !important;
  }
`;
document.head.appendChild(style);
export default preview;
