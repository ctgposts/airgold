const AuthService = {
  // Demo user accounts with roles
  users: [
    {
      id: '1',
      username: 'admin',
      password: 'admin123',
      name: 'Ahmed Rahman',
      role: 'admin',
      email: 'admin@dhakaairways.com',
      permissions: ['purchase_tickets', 'sell_tickets', 'manage_umrah', 'manage_visa', 'manage_customers', 'view_reports']
    },
    {
      id: '2',
      username: 'manager',
      password: 'manager123',
      name: 'Fatima Khan',
      role: 'manager',
      email: 'manager@dhakaairways.com',
      permissions: ['sell_tickets', 'manage_umrah', 'manage_customers', 'view_reports']
    },
    {
      id: '3',
      username: 'staff',
      password: 'staff123',
      name: 'Rashid Ali',
      role: 'staff',
      email: 'staff@dhakaairways.com',
      permissions: ['assist_bookings', 'manage_visa', 'update_customers']
    }
  ],

  async login(username, password) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = this.users.find(u => u.username === username && u.password === password);
        
        if (user) {
          const { password: _, ...userWithoutPassword } = user;
          resolve({
            success: true,
            user: userWithoutPassword
          });
        } else {
          resolve({
            success: false,
            message: 'Invalid username or password'
          });
        }
      }, 1000);
    });
  },

  hasPermission(user, permission) {
    return user && user.permissions && user.permissions.includes(permission);
  },

  canPurchaseTickets(user) {
    return this.hasPermission(user, 'purchase_tickets');
  },

  canSellTickets(user) {
    return this.hasPermission(user, 'sell_tickets');
  },

  canManageUmrah(user) {
    return this.hasPermission(user, 'manage_umrah');
  },

  canManageVisa(user) {
    return this.hasPermission(user, 'manage_visa');
  },

  canManageCustomers(user) {
    return this.hasPermission(user, 'manage_customers') || this.hasPermission(user, 'update_customers');
  },

  canViewReports(user) {
    return this.hasPermission(user, 'view_reports');
  }
};