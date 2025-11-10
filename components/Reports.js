function Reports({ currentUser }) {
  try {
    const [reportType, setReportType] = React.useState('sales');
    const [dateRange, setDateRange] = React.useState('month');

    const canViewReports = AuthService.canViewReports(currentUser);

    if (!canViewReports) {
      return (
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="luxury-card text-center">
            <div className="icon-lock text-4xl text-gray-400 mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Access Restricted</h2>
            <p className="text-gray-600">You don't have permission to view reports.</p>
          </div>
        </div>
      );
    }

    const salesData = {
      totalSales: 2450000,
      ticketsSold: 87,
      umrahBookings: 12,
      visaApplications: 23,
      revenue: [
        { month: 'Jan', amount: 320000 },
        { month: 'Feb', amount: 280000 },
        { month: 'Mar', amount: 350000 },
        { month: 'Apr', amount: 420000 },
        { month: 'May', amount: 380000 },
        { month: 'Jun', amount: 450000 }
      ]
    };

    return (
      <div className="flex flex-col h-screen" data-name="reports" data-file="components/Reports.js">
        <header className="bg-white shadow-sm border-b px-4 md:px-6 py-3 md:py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between space-y-2 md:space-y-0">
            <div>
              <h1 className="text-xl md:text-2xl font-heading font-bold text-[hsl(var(--foreground))]">Reports & Analytics</h1>
              <p className="text-sm md:text-base text-[hsl(var(--muted-foreground))] mt-1">Comprehensive business insights and performance metrics</p>
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <select 
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="luxury-input w-auto"
              >
                <option value="sales">Sales Report</option>
                <option value="customer">Customer Report</option>
                <option value="visa">Visa Report</option>
                <option value="umrah">Umrah Report</option>
              </select>
              <select 
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="luxury-input w-auto"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
                <option value="year">This Year</option>
              </select>
            </div>
          </div>
        </header>
        
        <div className="flex-1 overflow-auto px-4 md:px-6 py-4 md:py-6">
          <div className="animate-luxury-fade">

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
            <div className="luxury-card text-center animate-velvet-slide">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                <div className="icon-banknote text-xl text-white"></div>
              </div>
              <div className="text-2xl font-bold text-[hsl(var(--foreground))]">৳{salesData.totalSales.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Total Revenue</div>
              <div className="text-xs text-green-600 mt-1">↑ 12% from last month</div>
            </div>
            <div className="luxury-card text-center animate-velvet-slide" style={{animationDelay: '100ms'}}>
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                <div className="icon-ticket text-xl text-white"></div>
              </div>
              <div className="text-2xl font-bold text-[hsl(var(--foreground))]">{salesData.ticketsSold}</div>
              <div className="text-sm text-gray-600">Tickets Sold</div>
              <div className="text-xs text-blue-600 mt-1">↑ 8% from last month</div>
            </div>
            <div className="luxury-card text-center animate-velvet-slide" style={{animationDelay: '200ms'}}>
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                <div className="icon-map-pin text-xl text-white"></div>
              </div>
              <div className="text-2xl font-bold text-[hsl(var(--foreground))]">{salesData.umrahBookings}</div>
              <div className="text-sm text-gray-600">Umrah Bookings</div>
              <div className="text-xs text-purple-600 mt-1">↑ 25% from last month</div>
            </div>
            <div className="luxury-card text-center animate-velvet-slide" style={{animationDelay: '300ms'}}>
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                <div className="icon-passport text-xl text-white"></div>
              </div>
              <div className="text-2xl font-bold text-[hsl(var(--foreground))]">{salesData.visaApplications}</div>
              <div className="text-sm text-gray-600">Visa Applications</div>
              <div className="text-xs text-orange-600 mt-1">↑ 15% from last month</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8 mb-6 md:mb-8">
            <div className="luxury-card">
              <h3 className="text-lg font-semibold text-[hsl(var(--foreground))] mb-4">Revenue Trend</h3>
              <div className="space-y-3">
                {salesData.revenue.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">{item.month}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-[var(--luxury-gold)] to-[var(--luxury-bronze)] h-2 rounded-full"
                          style={{ width: `${(item.amount / 450000) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">৳{item.amount.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="luxury-card">
              <h3 className="text-lg font-semibold text-[hsl(var(--foreground))] mb-4">Performance Metrics</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="icon-trending-up text-lg text-green-600"></div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">Conversion Rate</div>
                      <div className="text-xs text-gray-500">Inquiries to Sales</div>
                    </div>
                  </div>
                  <div className="text-lg font-bold text-green-600">68%</div>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="icon-users text-lg text-blue-600"></div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">Customer Satisfaction</div>
                      <div className="text-xs text-gray-500">Based on feedback</div>
                    </div>
                  </div>
                  <div className="text-lg font-bold text-blue-600">4.8/5</div>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="icon-clock text-lg text-yellow-600"></div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">Avg. Processing Time</div>
                      <div className="text-xs text-gray-500">Booking to delivery</div>
                    </div>
                  </div>
                  <div className="text-lg font-bold text-yellow-600">2.3 days</div>
                </div>
              </div>
            </div>
          </div>

          <div className="luxury-card">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-[hsl(var(--foreground))]">Export Reports</h3>
              <div className="text-xs text-gray-500">Last updated: {new Date().toLocaleDateString()}</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="luxury-btn-secondary text-sm p-4 flex items-center justify-center space-x-2">
                <div className="icon-download text-lg text-[var(--luxury-gold)]"></div>
                <span>Download PDF</span>
              </button>
              <button className="luxury-btn-secondary text-sm p-4 flex items-center justify-center space-x-2">
                <div className="icon-file-spreadsheet text-lg text-[var(--luxury-gold)]"></div>
                <span>Export to Excel</span>
              </button>
              <button className="luxury-btn-secondary text-sm p-4 flex items-center justify-center space-x-2">
                <div className="icon-mail text-lg text-[var(--luxury-gold)]"></div>
                <span>Email Report</span>
              </button>
            </div>
          </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Reports component error:', error);
    return null;
  }
}