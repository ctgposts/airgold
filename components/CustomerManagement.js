function CustomerManagement({ currentUser }) {
  try {
    const [customers, setCustomers] = React.useState([
      {
        id: 'CUST001',
        name: 'Mohammad Hassan',
        phone: '+8801712345678',
        email: 'hassan@example.com',
        address: 'Dhanmondi, Dhaka',
        passportNumber: 'BD1234567',
        totalBookings: 3,
        status: 'active',
        createdAt: '2025-09-15'
      },
      {
        id: 'CUST002',
        name: 'Ayesha Rahman',
        phone: '+8801798765432',
        email: 'ayesha@example.com',
        address: 'Gulshan, Dhaka',
        passportNumber: 'BD7654321',
        totalBookings: 1,
        status: 'active',
        createdAt: '2025-10-01'
      }
    ]);

    const [showForm, setShowForm] = React.useState(false);
    const [formData, setFormData] = React.useState({
      name: '', phone: '', email: '', address: '', passportNumber: ''
    });

    const canManage = AuthService.canManageCustomers(currentUser);
    const isStaff = currentUser.role === 'staff';

    const handleCreateCustomer = async (e) => {
      e.preventDefault();
      const newCustomer = {
        id: `CUST${String(customers.length + 1).padStart(3, '0')}`,
        ...formData,
        totalBookings: 0,
        status: 'active',
        createdAt: new Date().toISOString().split('T')[0]
      };
      setCustomers([...customers, newCustomer]);
      setShowForm(false);
      setFormData({ name: '', phone: '', email: '', address: '', passportNumber: '' });
    };

    return (
      <div className="flex flex-col h-screen" data-name="customer-management" data-file="components/CustomerManagement.js">
        <header className="bg-white shadow-sm border-b px-4 md:px-6 py-3 md:py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between space-y-2 md:space-y-0">
            <div>
              <h1 className="text-xl md:text-2xl font-heading font-bold text-[hsl(var(--foreground))]">
                {isStaff ? 'Customer Support' : 'Customer Management'}
              </h1>
              <p className="text-sm md:text-base text-[hsl(var(--muted-foreground))] mt-1">
                {isStaff ? 'Assist customers with their inquiries' : 'Manage customer information and bookings'}
              </p>
            </div>
            <button onClick={() => setShowForm(true)} className="luxury-btn flex items-center space-x-2 w-full md:w-auto justify-center">
              <div className="icon-user-plus text-lg"></div>
              <span>Add Customer</span>
            </button>
          </div>
        </header>
        
        <div className="flex-1 overflow-auto px-4 md:px-6 py-4 md:py-6">
          <div className="animate-luxury-fade">

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
            <div className="luxury-card text-center">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                <div className="icon-users text-xl text-white"></div>
              </div>
              <div className="text-2xl font-bold text-[var(--luxury-dark)]">{customers.length}</div>
              <div className="text-sm text-gray-600">Total Customers</div>
            </div>
            <div className="luxury-card text-center">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                <div className="icon-user-check text-xl text-white"></div>
              </div>
              <div className="text-2xl font-bold text-[var(--luxury-dark)]">
                {customers.filter(c => c.status === 'active').length}
              </div>
              <div className="text-sm text-gray-600">Active Customers</div>
            </div>
            <div className="luxury-card text-center">
              <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                <div className="icon-phone text-xl text-white"></div>
              </div>
              <div className="text-2xl font-bold text-[var(--luxury-dark)]">12</div>
              <div className="text-sm text-gray-600">Pending Inquiries</div>
            </div>
            <div className="luxury-card text-center">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                <div className="icon-calendar text-xl text-white"></div>
              </div>
              <div className="text-2xl font-bold text-[var(--luxury-dark)]">8</div>
              <div className="text-sm text-gray-600">New This Month</div>
            </div>
          </div>

          <div className="mobile-card">
            {/* Mobile Card View */}
            <div className="block md:hidden space-y-3">
              {customers.map((customer) => (
                <div key={customer.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="font-semibold text-gray-900">{customer.name}</div>
                      <div className="text-sm text-gray-600">{customer.id}</div>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      customer.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {customer.status}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm text-gray-600">
                      <div>{customer.phone}</div>
                      <div className="text-xs text-gray-400">{customer.email}</div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Bookings: {customer.totalBookings}</span>
                      <div className="flex space-x-2">
                        <button className="luxury-btn-secondary text-xs px-3 py-1">
                          <div className="icon-eye text-xs text-blue-600"></div>
                        </button>
                        {canManage && (
                          <button className="luxury-btn-secondary text-xs px-3 py-1">
                            <div className="icon-edit text-xs text-blue-600"></div>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full mobile-table">
                <thead className="border-b border-gray-200">
                  <tr>
                    <th className="text-left py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm font-semibold text-gray-700">Customer</th>
                    <th className="text-left py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm font-semibold text-gray-700">Contact</th>
                    <th className="text-left py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm font-semibold text-gray-700">Passport</th>
                    <th className="text-left py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm font-semibold text-gray-700">Bookings</th>
                    <th className="text-left py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm font-semibold text-gray-700">Status</th>
                    <th className="text-left py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {customers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-gray-50">
                      <td className="py-2 md:py-4 px-2 md:px-4">
                        <div>
                          <div className="text-xs md:text-sm font-medium text-gray-900">{customer.name}</div>
                          <div className="text-xs text-gray-500">{customer.id}</div>
                        </div>
                      </td>
                      <td className="py-2 md:py-4 px-2 md:px-4">
                        <div className="text-xs md:text-sm text-gray-600">
                          <div>{customer.phone}</div>
                          <div className="text-xs text-gray-400">{customer.email}</div>
                        </div>
                      </td>
                      <td className="py-2 md:py-4 px-2 md:px-4 text-xs md:text-sm text-gray-600">{customer.passportNumber}</td>
                      <td className="py-2 md:py-4 px-2 md:px-4 text-xs md:text-sm font-medium text-gray-900">{customer.totalBookings}</td>
                      <td className="py-2 md:py-4 px-2 md:px-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          customer.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {customer.status}
                        </span>
                      </td>
                      <td className="py-2 md:py-4 px-2 md:px-4">
                        <div className="flex space-x-2">
                          <button className="luxury-btn-secondary text-xs px-3 py-1">
                            <div className="icon-eye text-xs text-blue-600"></div>
                          </button>
                          {canManage && (
                            <button className="luxury-btn-secondary text-xs px-3 py-1">
                              <div className="icon-edit text-xs text-blue-600"></div>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Add Customer Form */}
          {showForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="luxury-card w-full max-w-2xl mx-4 animate-luxury-fade">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-[var(--luxury-dark)]">Add New Customer</h2>
                  <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                    <div className="icon-x text-xl"></div>
                  </button>
                </div>
                <form onSubmit={handleCreateCustomer} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name</label>
                    <input type="text" className="luxury-input" placeholder="Customer Full Name"
                      value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Phone Number</label>
                      <input type="tel" className="luxury-input" placeholder="+8801XXXXXXXXX"
                        value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email Address</label>
                      <input type="email" className="luxury-input" placeholder="customer@example.com"
                        value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Address</label>
                    <textarea className="luxury-input" rows="3" placeholder="Full address"
                      value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Passport Number</label>
                    <input type="text" className="luxury-input" placeholder="BD1234567"
                      value={formData.passportNumber} onChange={(e) => setFormData({...formData, passportNumber: e.target.value})} required />
                  </div>
                  <div className="flex justify-end space-x-3 pt-4">
                    <button type="button" onClick={() => setShowForm(false)} 
                      className="luxury-btn-secondary">Cancel</button>
                    <button type="submit" className="luxury-btn">Add Customer</button>
                  </div>
                </form>
              </div>
            </div>
          )}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('CustomerManagement component error:', error);
    return null;
  }
}