# NexPay — Modern Fintech Wallet Dashboard

A beautiful, fully-functional fintech wallet dashboard built with React and Vite, featuring a modern design with light/dark mode support.

## Features

✨ **Modern Design**
- Clean, professional fintech UI inspired by PayPal and modern financial apps
- Responsive layout that works on desktop and mobile
- Smooth animations and transitions

💰 **Dashboard Components**
- Balance display with portfolio breakdown
- Quick action buttons (Send Money, Request Payment, View History)
- Recent transactions list with detailed information
- Virtual card display with Premier badge
- Monthly financial summary statistics
- Quick send contacts with avatars

🌓 **Light/Dark Mode**
- Toggle between light and dark themes
- Persists user preference in localStorage
- Smooth transitions between themes
- Optimized color schemes for both modes

🔧 **Technical Highlights**
- Built with React 18 + Vite for fast development
- Component-based architecture
- Context API for theme management
- CSS with CSS variables for easy theming
- No external UI libraries (pure CSS)

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will be available at `http://localhost:5173` (or another port if 5173 is in use).

## Project Structure

```
src/
├── components/          # React components
│   ├── ActionButtons.jsx
│   ├── BalanceCard.jsx
│   ├── Dashboard.jsx
│   ├── Navigation.jsx
│   ├── Navigation.css
│   ├── QuickSend.jsx
│   ├── SendModal.jsx
│   ├── SendModal.css
│   ├── StatsSummary.jsx
│   ├── TransactionsList.jsx
│   └── VirtualCard.jsx
├── context/            # React Context
│   └── ThemeContext.jsx
├── App.jsx            # Main App component
├── App.css            # Global app styles
├── index.css          # Global styles & theme variables
└── main.jsx           # React entry point
```

## Usage

### Switching Themes
Click the sun/moon icon in the navigation bar to toggle between light and dark modes.

### Send Money / Request Payment
1. Click on "Send Money" button or a contact avatar
2. Fill in the recipient, amount, and optional note
3. Click "Send Money" or "Send Request" to complete

### View Transactions
Click on "Transaction History" button to scroll to the recent transactions section.

### Notifications
Click the notification bell icon to see sample notifications.

## Customization

### Changing Colors
Edit the CSS variables in `src/index.css`:

```css
:root {
  --bg: #0a0d14;
  --accent: #4f8ef7;
  --accent2: #7b5cf0;
  --green: #22d3a0;
  --red: #f76b6b;
  /* ... other colors ... */
}
```

### Adding Transactions
Edit the `transactions` array in `src/components/TransactionsList.jsx` to add more transactions.

### Adding Quick Send Contacts
Edit the `contacts` array in `src/components/QuickSend.jsx` to modify quick send contacts.

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Performance

- Fast hot module replacement (HMR) during development
- Optimized production build with tree-shaking
- Minimal bundle size due to no external dependencies

## License

MIT

## Author

Created as a modern fintech dashboard example using React + Vite.
