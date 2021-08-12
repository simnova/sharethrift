import '../src/App.css';

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  options: {
    storySort: {
      order: [
        'Getting Started', 
          ['Intro'],
        'Documentation',[
          'Core',[
            'Colors', 
            'Typography',[
              'Intro',
              'Title',
              'Header',
              'Body'
            ],
          ],
        ],
        'Components',[
          'Label Overview',
          'Label'
        ],
        '*', 
        'WIP'],
    },
  },
}