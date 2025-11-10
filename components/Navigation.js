function Navigation({ currentUser, currentView, onViewChange, onLogout }) {
  try {
    const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
    
    const getMenuItems = () => {
      const baseItems = [
        { id: 'dashboard', label: 'Dashboard', icon: 'layout-dashboard' }
      ];

      if (currentUser.role === 'admin') {
        return [
          ...baseItems,
          { id: 'tickets', label: 'Ticket Management', icon: 'ticket' },
          { id: 'umrah', label: 'Umrah Packages', icon: 'map-pin' },
          { id: 'umrah-tickets', label: 'Umrah Tickets', icon: 'plane' },
          { id: 'customers', label: 'Customers', icon: 'users' },
          { id: 'visa', label: 'Visa Management', icon: 'passport' },
          { id: 'reports', label: 'Reports & Analytics', icon: 'chart-bar' }
        ];
      }

      if (currentUser.role === 'manager') {
        return [
          ...baseItems,
          { id: 'tickets', label: 'Ticket Sales', icon: 'ticket' },
          { id: 'umrah', label: 'Umrah Packages', icon: 'map-pin' },
          { id: 'umrah-tickets', label: 'Umrah Tickets', icon: 'plane' },
          { id: 'customers', label: 'Customers', icon: 'users' },
          { id: 'reports', label: 'Reports', icon: 'chart-bar' }
        ];
      }

      return [
        ...baseItems,
        { id: 'customers', label: 'Customer Support', icon: 'users' },
        { id: 'visa', label: 'Visa Assistance', icon: 'passport' }
      ];
    };

    const DesktopSidebar = () => (
      <aside className={`sidebar shadow-xl transition-all duration-300 ${sidebarCollapsed ? 'w-16' : 'w-64'} min-h-screen flex-col hidden md:flex`} data-name="navigation" data-file="components/Navigation.js">
        <div className="p-4 border-b border-[hsl(var(--sidebar-border))]">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[var(--luxury-gold)] to-[var(--luxury-bronze)] rounded-lg flex items-center justify-center animate-glow">
                  <div className="icon-plane text-white text-xl"></div>
                </div>
                <div>
                  <div className="text-lg font-heading font-bold text-[hsl(var(--sidebar-foreground))]">Dhaka Airways</div>
                  <div className="text-xs text-[hsl(var(--sidebar-foreground))] opacity-70">Travel Agency</div>
                </div>
              </div>
            )}
            <button 
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 rounded-lg text-[hsl(var(--sidebar-foreground))] hover:bg-[hsl(var(--sidebar-accent))] hover:text-[hsl(var(--sidebar-accent-foreground))] transition-all duration-300"
            >
              <div className={`icon-${sidebarCollapsed ? 'chevron-right' : 'chevron-left'} text-lg`}></div>
            </button>
          </div>
        </div>

        <nav className="flex-1 py-4">
          <div className="space-y-1">
            {getMenuItems().map(item => (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`sidebar-item w-full text-left ${currentView === item.id ? 'active' : ''}`}
                title={sidebarCollapsed ? item.label : ''}
              >
                <div className={`icon-${item.icon} text-lg flex-shrink-0`}></div>
                {!sidebarCollapsed && (
                  <span className="font-body font-medium">{item.label}</span>
                )}
              </button>
            ))}
          </div>
        </nav>

        <div className="p-4 border-t border-[hsl(var(--sidebar-border))]">
          {!sidebarCollapsed ? (
            <div className="space-y-3">
              <div className="flex items-center space-x-3 px-2">
                <div className="w-10 h-10 bg-gradient-to-br from-[var(--luxury-gold)] to-[var(--luxury-bronze)] rounded-full flex items-center justify-center">
                  <div className="icon-user text-white text-lg"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-[hsl(var(--sidebar-foreground))] truncate">{currentUser.name}</div>
                  <div className="text-xs text-[hsl(var(--sidebar-foreground))] opacity-70 capitalize">{currentUser.role}</div>
                </div>
              </div>
              <button
                onClick={onLogout}
                className="sidebar-item w-full text-left hover:bg-red-500 hover:text-white"
              >
                <div className="icon-log-out text-lg"></div>
                <span className="font-body font-medium">Logout</span>
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="w-10 h-10 bg-gradient-to-br from-[var(--luxury-gold)] to-[var(--luxury-bronze)] rounded-full flex items-center justify-center mx-auto">
                <div className="icon-user text-white text-lg"></div>
              </div>
              <button
                onClick={onLogout}
                className="p-2 rounded-lg text-[hsl(var(--sidebar-foreground))] hover:bg-red-500 hover:text-white transition-all duration-300 w-full flex justify-center"
                title="Logout"
              >
                <div className="icon-log-out text-lg"></div>
              </button>
            </div>
          )}
        </div>
      </aside>
    );

    const MobileNavigation = () => (
      <nav className="mobile-nav">
        <div className="flex justify-around py-2">
          {getMenuItems().slice(0, 5).map(item => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`mobile-nav-item ${currentView === item.id ? 'active' : ''}`}
            >
              <div className={`icon-${item.icon} text-lg mb-1`}></div>
              <span className="text-xs">{item.label.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </nav>
    );

    return (
      <>
        <DesktopSidebar />
        <MobileNavigation />
      </>
    );
  } catch (error) {
    console.error('Navigation component error:', error);
    return null;
  }
}
