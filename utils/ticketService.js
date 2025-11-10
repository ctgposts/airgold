const TicketService = {
  // Demo data storage
  tickets: [
    {
      id: 'TKT001',
      type: 'package',
      from: 'Dhaka',
      to: 'Dubai',
      airline: 'Emirates',
      flightNumber: 'EK582',
      departureDate: '2025-11-15',
      returnDate: '2025-11-22',
      price: 85000,
      status: 'available',
      packageType: 'umrah',
      createdAt: '2025-10-01T10:00:00Z',
      purchasedBy: 'Ahmed Rahman',
      customerId: null
    },
    {
      id: 'TKT002',
      type: 'non-package',
      from: 'Dhaka',
      to: 'Riyadh',
      airline: 'Saudia',
      flightNumber: 'SV804',
      departureDate: '2025-11-20',
      returnDate: null,
      price: 65000,
      status: 'sold',
      packageType: null,
      createdAt: '2025-10-01T11:00:00Z',
      purchasedBy: 'Ahmed Rahman',
      customerId: 'CUST001'
    }
  ],

  customers: [
    {
      id: 'CUST001',
      name: 'Mohammad Hassan',
      phone: '+8801712345678',
      email: 'hassan@example.com',
      address: 'Dhanmondi, Dhaka',
      passportNumber: 'BD1234567',
      createdAt: '2025-09-15T10:00:00Z'
    }
  ],

  async getStats() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const soldTickets = this.tickets.filter(t => t.status === 'sold').length;
        const availableTickets = this.tickets.filter(t => t.status === 'available').length;
        const totalRevenue = this.tickets
          .filter(t => t.status === 'sold')
          .reduce((sum, t) => sum + t.price, 0);
        
        resolve({
          totalTickets: this.tickets.length,
          soldTickets,
          availableTickets,
          totalRevenue,
          umrahPackages: this.tickets.filter(t => t.packageType === 'umrah').length,
          activeCustomers: this.customers.length,
          pendingVisas: 3
        });
      }, 500);
    });
  },

  async getTickets() {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...this.tickets]), 300);
    });
  },

  async createTicket(ticketData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newTicket = {
          id: `TKT${String(this.tickets.length + 1).padStart(3, '0')}`,
          ...ticketData,
          createdAt: new Date().toISOString(),
          status: 'available'
        };
        this.tickets.push(newTicket);
        resolve(newTicket);
      }, 500);
    });
  },

  async updateTicketStatus(ticketId, status, customerId = null) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const ticket = this.tickets.find(t => t.id === ticketId);
        if (ticket) {
          // Validate status transitions
          const validTransitions = {
            'available': ['booked', 'sold', 'cancelled'],
            'booked': ['sold', 'cancelled', 'available'],
            'sold': ['cancelled'],
            'cancelled': ['available']
          };
          
          if (validTransitions[ticket.status]?.includes(status)) {
            ticket.status = status;
            ticket.lastUpdated = new Date().toISOString();
            if (customerId) ticket.customerId = customerId;
            if (status === 'sold') ticket.soldDate = new Date().toISOString();
            resolve(ticket);
          } else {
            resolve({ error: `Invalid transition from ${ticket.status} to ${status}` });
          }
        } else {
          resolve(null);
        }
      }, 300);
    });
  },

  async getTicketHistory(ticketId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const ticket = this.tickets.find(t => t.id === ticketId);
        if (ticket) {
          // Simulate history tracking
          const history = [
            { status: 'purchased', date: ticket.createdAt, user: ticket.purchasedBy },
            { status: 'available', date: ticket.createdAt, user: 'System' }
          ];
          if (ticket.soldDate) {
            history.push({ status: 'sold', date: ticket.soldDate, user: 'Sales Agent' });
          }
          resolve(history);
        } else {
          resolve([]);
        }
      }, 200);
    });
  }
};
