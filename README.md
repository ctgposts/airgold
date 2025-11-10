# Dhaka Airways - Internal Ticketing System

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black)](https://vercel.com)
[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org/)

A comprehensive role-based internal ticketing system designed for Bangladeshi travel agencies, featuring ticket management, Umrah packages, customer management, and visa processing.

## 🚀 Live Demo

[View Live Demo](https://your-app.vercel.app) • [Report Bug](https://github.com/your-username/dhaka-airways-system/issues) • [Request Feature](https://github.com/your-username/dhaka-airways-system/issues)

## Features

- **Role-Based Access Control**: Admin, Manager, and Staff roles with specific permissions
- **Ticket Management**: Purchase and sell both package and non-package tickets
- **Umrah Package Management**: Specialized modules for pilgrimage packages (with and without transport)
- **Customer Management**: Comprehensive customer information and booking history
- **Visa Management**: Application tracking and processing pipeline
- **Reports & Analytics**: Detailed business insights and performance metrics
- **Luxury UI Design**: Premium animations and luxury theme throughout

## Tech Stack

- React 18 (Production build via CDN)
- TailwindCSS for styling
- Lucide Icons
- **Trickle Database** for backend storage (fully compatible with Vercel)
- Pure HTML/CSS/JS (No build step required)

## Trickle Database

The application uses Trickle's built-in database service which works seamlessly on Vercel and all hosting platforms:

- **No Configuration Required**: Database works out of the box
- **API-Based**: All operations via REST API calls
- **Cross-Platform**: Works on any hosting service including Vercel, Netlify, etc.
- **Session Management**: Uses browser localStorage for authentication
- **CORS Enabled**: Properly configured in `vercel.json`

### Database Tables
- `umrah_package` - Package definitions (with/without transport)
- `umrah_ticket` - Main ticket records
- `umrah_with_transport` - Flight and transport details
- `umrah_without_transport` - Service-only booking details

## Demo Credentials

- **Admin**: admin / admin123
- **Manager**: manager / manager123
- **Staff**: staff / staff123

## User Roles & Permissions

### Admin
- Purchase and sell tickets
- Manage Umrah packages (with/without transport)
- Full customer management
- Visa management
- Access to all reports and analytics

### Manager
- Sell tickets (no purchase rights)
- Manage Umrah packages
- Customer management
- Limited reports access

### Staff
- Customer support and assistance
- Visa assistance
- Update customer information
- Basic booking assistance

## Quick Start

### Clone the Repository
```bash
git clone https://github.com/your-username/dhaka-airways-system.git
cd dhaka-airways-system
```

### Run Locally
Simply open `index.html` in your browser, or use a local server:
```bash
npx serve .
```

Then navigate to `http://localhost:3000`

## Deployment to Vercel

### Prerequisites
- Vercel account ([Sign up here](https://vercel.com/signup))
- Git repository with your code

### Deployment Steps

1. **Install Vercel CLI** (Optional):
   ```bash
   npm install -g vercel
   ```

2. **Deploy via Vercel CLI**:
   ```bash
   vercel
   ```
   Follow the prompts to link your project and deploy.

3. **Deploy via Vercel Dashboard**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New" → "Project"
   - Import your Git repository
   - Vercel will auto-detect the configuration from `vercel.json`
   - Click "Deploy"

4. **Deploy via Git Integration**:
   - Push your code to GitHub/GitLab/Bitbucket
   - Connect your repository in Vercel Dashboard
   - Vercel will automatically deploy on every push to main branch

### Environment Configuration

**No environment variables or backend setup required!** The application uses:
- **Trickle Database** (built-in, API-based, works on any hosting)
- CDN resources for React, TailwindCSS, and icons
- Browser localStorage for session management
- All database operations via Trickle's API endpoints

### Vercel + Trickle Database

The Trickle Database is specifically designed to work with static hosting platforms like Vercel:
- No server-side code needed
- No database connection strings required
- No environment variables to configure
- Instant deployment with full database functionality

### Custom Domain Setup

After deployment:
1. Go to your project in Vercel Dashboard
2. Navigate to "Settings" → "Domains"
3. Add your custom domain
4. Update DNS records as instructed by Vercel

## Project Structure

```
dhaka-airways-system/
├── index.html              # Main entry point
├── app.js                  # Main application component
├── vercel.json            # Vercel configuration
├── package.json           # Project metadata
├── components/
│   ├── LoginForm.js       # Login interface
│   ├── Navigation.js      # Sidebar navigation
│   ├── Dashboard.js       # Dashboard view
│   ├── TicketManagement.js       # Ticket CRUD operations
│   ├── UmrahPackages.js          # Package management
│   ├── UmrahTicketManagement.js  # Umrah ticket operations
│   ├── CustomerManagement.js     # Customer CRUD
│   ├── VisaManagement.js         # Visa processing
│   └── Reports.js                # Analytics & reports
├── utils/
│   ├── auth.js            # Authentication service
│   └── ticketService.js   # Ticket operations
└── trickle/
    ├── assets/            # Resource files
    ├── notes/             # Documentation
    └── rules/             # Development rules

```

## Database Schema

### Tables
- `umrah_package`: Package definitions (with/without transport)
- `umrah_ticket`: Main ticket records
- `umrah_with_transport`: Flight and transport details
- `umrah_without_transport`: Service-only booking details

## Development

### Local Development
1. Open `index.html` in a modern web browser
2. Or use a local server:
   ```bash
   npx serve .
   ```

### No Build Required
This is a pure frontend application that runs directly in the browser without any build step.

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)

## License

MIT License - © 2025 Dhaka Airways

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and inquiries, contact: support@dhakaairways.com

## Acknowledgments

- Built with [React](https://reactjs.org/)
- Styled with [TailwindCSS](https://tailwindcss.com/)
- Icons by [Lucide](https://lucide.dev/)
- Powered by [Trickle Database](https://trickle.so)

---

**Last Updated**: November 10, 2025

Made with ❤️ by Dhaka Airways Team
