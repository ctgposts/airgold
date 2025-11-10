function Dashboard({ currentUser, onViewChange }) {
  try {
    const [stats, setStats] = React.useState({
      totalTickets: 0,
      soldTickets: 0,
      availableTickets: 0,
      totalRevenue: 0,
      umrahPackages: 0,
      activeCustomers: 0,
      pendingVisas: 0
    });

    React.useEffect(() => {
      loadDashboardStats();
    }, []);

    const loadDashboardStats = async () => {
      try {
        const ticketStats = await TicketService.getStats();
        setStats(ticketStats);
      } catch (error) {
        console.error('Error loading dashboard stats:', error);
      }
    };

    const getWelcomeMessage = () => {
      const hour = new Date().getHours();
      let greeting = 'Good morning';
      if (hour >= 12 && hour < 18) greeting = 'Good afternoon';
      if (hour >= 18) greeting = 'Good evening';
      
      return `${greeting}, ${currentUser.name}!`;
    };

    const getRoleSpecificStats = () => {
      if (currentUser.role === 'admin') {
        return [
          { label: 'Total Tickets', value: stats.totalTickets, icon: 'ticket', color: 'bg-blue-500' },
          { label: 'Sold Tickets', value: stats.soldTickets, icon: 'check-circle', color: 'bg-green-500' },
          { label: 'Revenue (BDT)', value: `৳${stats.totalRevenue.toLocaleString()}`, icon: 'banknote', color: 'bg-[var(--luxury-gold)]' },
          { label: 'Umrah Packages', value: stats.umrahPackages, icon: 'map-pin', color: 'bg-purple-500' },
          { label: 'Active Customers', value: stats.activeCustomers, icon: 'users', color: 'bg-indigo-500' },
          { label: 'Pending Visas', value: stats.pendingVisas, icon: 'passport', color: 'bg-orange-500' }
        ];
      }

      if (currentUser.role === 'manager') {
        return [
          { label: 'Available Tickets', value: stats.availableTickets, icon: 'ticket', color: 'bg-blue-500' },
          { label: 'Sold Today', value: stats.soldTickets, icon: 'check-circle', color: 'bg-green-500' },
          { label: 'Revenue (BDT)', value: `৳${stats.totalRevenue.toLocaleString()}`, icon: 'banknote', color: 'bg-[var(--luxury-gold)]' },
          { label: 'Umrah Packages', value: stats.umrahPackages, icon: 'map-pin', color: 'bg-purple-500' }
        ];
      }

      return [
        { label: 'Customer Inquiries', value: stats.activeCustomers, icon: 'users', color: 'bg-indigo-500' },
        { label: 'Visa Applications', value: stats.pendingVisas, icon: 'passport', color: 'bg-orange-500' },
        { label: 'Bookings Assisted', value: 24, icon: 'check-circle', color: 'bg-green-500' }
      ];
    };

    return (
      <div className="flex flex-col h-screen" data-name="dashboard" data-file="components/Dashboard.js">
        <header className="bg-white shadow-sm border-b px-4 md:px-6 py-3 md:py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between space-y-2 md:space-y-0">
            <div>
              <h1 className="text-xl md:text-2xl font-heading font-bold text-[hsl(var(--foreground))]">{getWelcomeMessage()}</h1>
              <p className="text-sm md:text-base text-[hsl(var(--muted-foreground))] mt-1">Welcome to your dashboard. Here's what's happening today.</p>
            </div>
            <div className="text-left md:text-right">
              <div className="text-sm text-[hsl(var(--muted-foreground))]">Today</div>
              <div className="text-base md:text-lg font-medium text-[hsl(var(--foreground))]">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
            </div>
          </div>
        </header>
        
        <div className="flex-1 overflow-auto px-4 md:px-6 py-4 md:py-6">
          <div className="animate-luxury-fade">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 lg:gap-6 mb-6 md:mb-8">
              {getRoleSpecificStats().map((stat, index) => (
                <div key={index} className="stat-card animate-velvet-slide animate-pulse-gold" style={{animationDelay: `${index * 100}ms`}}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-xs md:text-sm font-medium text-gray-600">{stat.label}</p>
                      <p className="text-lg md:text-2xl font-bold text-[hsl(var(--foreground))] mt-1">{stat.value}</p>
                    </div>
                    <div className={`w-10 h-10 md:w-12 md:h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                      <div className={`icon-${stat.icon} text-lg md:text-xl text-white`}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
              <div className="luxury-card">
                <h3 className="text-lg font-semibold text-[hsl(var(--foreground))] mb-4">Recent Activities</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <div className="icon-check-circle text-lg text-green-600"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Ticket sold to Dhaka-Dubai</p>
                      <p className="text-xs text-gray-500">2 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <div className="icon-map-pin text-lg text-blue-600"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">New Umrah package booked</p>
                      <p className="text-xs text-gray-500">15 minutes ago</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="luxury-card">
                <h3 className="text-lg font-semibold text-[hsl(var(--foreground))] mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-4">
                  {currentUser.role === 'admin' && (
                    <>
                      <button onClick={() => onViewChange('tickets')} className="luxury-btn-secondary text-sm p-4 flex flex-col items-center space-y-2 hover:animate-bounce-in">
                        <div className="icon-plus text-xl text-[var(--luxury-gold)]"></div>
                        <span>Add Tickets</span>
                      </button>
                      <button onClick={() => onViewChange('umrah')} className="luxury-btn-secondary text-sm p-4 flex flex-col items-center space-y-2 hover:animate-bounce-in">
                        <div className="icon-package text-xl text-[var(--luxury-gold)]"></div>
                        <span>New Package</span>
                      </button>
                    </>
                  )}
                  <button onClick={() => onViewChange('customers')} className="luxury-btn-secondary text-sm p-4 flex flex-col items-center space-y-2 hover:animate-bounce-in">
                    <div className="icon-user-plus text-xl text-[var(--luxury-gold)]"></div>
                    <span>Add Customer</span>
                  </button>
                  <button onClick={() => onViewChange('reports')} className="luxury-btn-secondary text-sm p-4 flex flex-col items-center space-y-2 hover:animate-bounce-in">
                    <div className="icon-file-text text-xl text-[var(--luxury-gold)]"></div>
                    <span>Generate Report</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Dashboard component error:', error);
    return null;
  }
}