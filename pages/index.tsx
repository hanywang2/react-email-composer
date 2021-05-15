import { EmailComposer } from './[page]';

const DUNDER_PLACEHOLDERS = [
  {
    key: 'first',
    text: 'Hello,\n\nWhat is the price of a ream of paper at Dunder Mifflin?\n\nBest,\nTom from Blue Cross',
  },
  {
    key: 'fire',
    text: 'My Sabre printer just started smoking. What should I do?',
  },
  {
    key: 'contact',
    text: "I'm having issues with with my shipment. Can I get in contact with the assistant regional manager?",
  },
];

function App() {
  return (
    <EmailComposer
      path="DUNDER"
      brandName="Dunder Mifflin"
      supportEmail="support@dundermifflin.com"
      placeholders={DUNDER_PLACEHOLDERS}
    />
  );
}

export default App;
