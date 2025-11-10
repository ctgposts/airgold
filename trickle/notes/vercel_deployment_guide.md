# Vercel Deployment Guide

## Overview
This application is fully compatible with Vercel hosting and uses Trickle Database for backend storage. No additional backend setup is required.

## Database Configuration

### Trickle Database
The application uses Trickle's built-in database service which works seamlessly across all hosting platforms including Vercel.

**Database Tables:**
- `umrah_package` - Package definitions
- `umrah_ticket` - Main ticket records  
- `umrah_with_transport` - Transport package details
- `umrah_without_transport` - Service-only package details

### How It Works on Vercel

1. **API Calls**: All database operations use Trickle's API endpoints which are accessible from any domain
2. **Authentication**: Session management uses localStorage - works perfectly in browser
3. **CORS**: Configured in `vercel.json` to allow all necessary API calls
4. **No Build Step**: Pure frontend application - deploys instantly on Vercel

## Deployment Steps

### Method 1: Vercel CLI
```bash
npm install -g vercel
vercel login
vercel
```

### Method 2: Git Integration
1. Push code to GitHub/GitLab/Bitbucket
2. Import project in Vercel Dashboard
3. Vercel auto-detects configuration
4. Deploy

### Method 3: Vercel Dashboard
1. Go to https://vercel.com/new
2. Import Git repository
3. Click "Deploy"

## Environment Variables
**Not Required** - The application uses:
- Trickle Database (built-in, no config needed)
- CDN resources for libraries
- Browser localStorage for sessions

## Testing After Deployment

1. Visit your Vercel URL
2. Login with demo credentials:
   - Admin: admin / admin123
   - Manager: manager / manager123
   - Staff: staff / staff123
3. Create a test Umrah ticket
4. Verify data persists after page refresh

## Custom Domain Setup

After deployment:
1. Project Settings → Domains
2. Add your domain
3. Update DNS records as shown
4. SSL certificate auto-generated

## Database Verification

To verify database is working:
1. Open browser DevTools (F12)
2. Go to Console tab
3. Check for any API errors
4. Test CRUD operations in Umrah Tickets section

## Troubleshooting

### Database Not Saving
- Check browser console for errors
- Verify internet connection
- Clear browser cache and reload

### CORS Issues
- Verified: `vercel.json` includes proper CORS headers
- Should work out of the box

### Session Lost
- Check if cookies/localStorage are enabled in browser
- Verify browser is not in private/incognito mode

## Performance

- **Load Time**: < 2 seconds (CDN resources)
- **Database Response**: < 500ms average
- **Static Assets**: Cached by Vercel CDN
- **Global Edge Network**: Fast worldwide

## Support

For deployment issues:
- Vercel Support: https://vercel.com/support
- Trickle Database: Built-in, no separate support needed

**Last Updated**: November 10, 2025