# Dhaka Airways - Internal Ticketing System

## Overview
A comprehensive role-based internal ticketing system designed for Bangladeshi travel agencies. The system features a luxury theme with gold, pearl, bronze, and cream colors, providing an elegant user interface for managing tickets, Umrah packages, customer information, and visa applications.

## Features
- **Role-Based Access Control**: Admin, Manager, and Staff roles with specific permissions
- **Ticket Management**: Purchase and sell both package and non-package tickets
- **Umrah Package Management**: Specialized modules for pilgrimage packages
- **Customer Management**: Comprehensive customer information and booking history
- **Visa Management**: Application tracking and processing pipeline
- **Reports & Analytics**: Detailed business insights and performance metrics
- **Luxury UI Design**: Premium animations and luxury theme throughout

## User Roles & Permissions

### Admin
- Purchase and sell tickets
- Manage Umrah packages
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

## Technology Stack
- React 18 with Babel
- TailwindCSS for styling
- Lucide icons
- Local storage for session management
- Responsive design

## Demo Credentials
- **Admin**: admin / admin123
- **Manager**: manager / manager123  
- **Staff**: staff / staff123

## Status Lifecycle
Tickets and visas follow these status transitions:
- **Tickets**: Purchased → Available → Booked → Sold → Cancelled
- **Visas**: Submitted → Processing → Approved/Rejected → Completed

## Last Updated
October 1, 2025

*Note: This system now uses a modern left sidebar navigation layout with header bars for each page section, following the provided Tailwind CSS configuration with Oswald headings and Montserrat body fonts.*
