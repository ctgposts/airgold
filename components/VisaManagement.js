function VisaManagement({ currentUser }) {
  try {
    const [showForm, setShowForm] = React.useState(false);
    const [formData, setFormData] = React.useState({
      customerName: '', type: 'Tourist Visa', country: 'UAE', fee: ''
    });
    const [visaApplications, setVisaApplications] = React.useState([
      {
        id: 'VISA001',
        customerName: 'Mohammad Hassan',
        customerId: 'CUST001',
        type: 'Umrah Visa',
        country: 'Saudi Arabia',
        status: 'pending',
        submittedDate: '2025-10-01',
        processingTime: '5-7 days',
        fee: 12000
      },
      {
        id: 'VISA002',
        customerName: 'Ayesha Rahman',
        customerId: 'CUST002',
        type: 'Tourist Visa',
        country: 'UAE',
        status: 'approved',
        submittedDate: '2025-09-28',
        processingTime: '3-5 days',
        fee: 8000
      }
    ]);

    const canManage = AuthService.canManageVisa(currentUser);

    const handleCreateApplication = async (e) => {
      e.preventDefault();
      const newApplication = {
        id: `VISA${String(visaApplications.length + 1).padStart(3, '0')}`,
        ...formData,
        customerId: `CUST${String(Math.floor(Math.random() * 100) + 1).padStart(3, '0')}`,
        status: 'pending',
        submittedDate: new Date().toISOString().split('T')[0],
        processingTime: formData.type === 'Umrah Visa' ? '5-7 days' : '3-5 days',
        fee: parseInt(formData.fee)
      };
      setVisaApplications([...visaApplications, newApplication]);
      setShowForm(false);
      setFormData({ customerName: '', type: 'Tourist Visa', country: 'UAE', fee: '' });
    };

    const getStatusColor = (status) => {
      switch (status) {
        case 'pending': return 'bg-yellow-100 text-yellow-800';
        case 'approved': return 'bg-green-100 text-green-800';
        case 'rejected': return 'bg-red-100 text-red-800';
        case 'processing': return 'bg-blue-100 text-blue-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    };

    return (
      <div className="flex flex-col h-screen" data-name="visa-management" data-file="components/VisaManagement.js">
        <header className="bg-white shadow-sm border-b px-4 md:px-6 py-3 md:py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between space-y-2 md:space-y-0">
            <div>
              <h1 className="text-xl md:text-2xl font-heading font-bold text-[hsl(var(--foreground))]">
                {canManage ? 'Visa Management' : 'Visa Assistance'}
              </h1>
              <p className="text-sm md:text-base text-[hsl(var(--muted-foreground))] mt-1">Track and manage visa applications for customers</p>
            </div>
            <button onClick={() => setShowForm(true)} className="luxury-btn flex items-center space-x-2 w-full md:w-auto justify-center">
              <div className="icon-plus text-lg"></div>
              <span>New Application</span>
            </button>
          </div>
        </header>
        
        <div className="flex-1 overflow-auto px-4 md:px-6 py-4 md:py-6">
          <div className="animate-luxury-fade">

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
            <div className="luxury-card text-center animate-velvet-slide">
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                <div className="icon-file-text text-xl text-white"></div>
              </div>
              <div className="text-2xl font-bold text-[var(--luxury-dark)]">{visaApplications.length}</div>
              <div className="text-sm text-gray-600">Total Applications</div>
            </div>
            <div className="luxury-card text-center animate-velvet-slide" style={{animationDelay: '100ms'}}>
              <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                <div className="icon-clock text-xl text-white"></div>
              </div>
              <div className="text-2xl font-bold text-[var(--luxury-dark)]">
                {visaApplications.filter(v => v.status === 'pending').length}
              </div>
              <div className="text-sm text-gray-600">Pending Review</div>
            </div>
            <div className="luxury-card text-center animate-velvet-slide" style={{animationDelay: '200ms'}}>
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                <div className="icon-check-circle text-xl text-white"></div>
              </div>
              <div className="text-2xl font-bold text-[var(--luxury-dark)]">
                {visaApplications.filter(v => v.status === 'approved').length}
              </div>
              <div className="text-sm text-gray-600">Approved</div>
            </div>
            <div className="luxury-card text-center animate-velvet-slide" style={{animationDelay: '300ms'}}>
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                <div className="icon-trending-up text-xl text-white"></div>
              </div>
              <div className="text-2xl font-bold text-[var(--luxury-dark)]">85%</div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </div>
          </div>

          <div className="luxury-card">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Application</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Customer</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Visa Type</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Country</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Fee (BDT)</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {visaApplications.map((visa) => (
                    <tr key={visa.id} className="hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{visa.id}</div>
                          <div className="text-xs text-gray-500">Submitted: {visa.submittedDate}</div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">{visa.customerName}</td>
                      <td className="py-4 px-4 text-sm text-gray-600">{visa.type}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <div className="icon-map-pin text-sm text-gray-400"></div>
                          <span className="text-sm text-gray-600">{visa.country}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(visa.status)}`}>
                          {visa.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm font-medium text-gray-900">৳{visa.fee.toLocaleString()}</td>
                      <td className="py-4 px-4">
                        <div className="flex space-x-2">
                          <button className="luxury-btn-secondary text-xs px-3 py-1">
                            <div className="icon-eye text-xs"></div>
                          </button>
                          {canManage && (
                            <button className="luxury-btn-secondary text-xs px-3 py-1">
                              <div className="icon-edit text-xs"></div>
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

          <div className="mt-8 luxury-card">
            <h3 className="text-lg font-semibold text-[var(--luxury-dark)] mb-4">Visa Processing Pipeline</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <div className="icon-file-plus text-lg text-white"></div>
                </div>
                <div className="text-sm font-medium text-gray-700">Submitted</div>
                <div className="text-xs text-gray-500 mt-1">Application received</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <div className="icon-search text-lg text-white"></div>
                </div>
                <div className="text-sm font-medium text-gray-700">Processing</div>
                <div className="text-xs text-gray-500 mt-1">Under review</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <div className="icon-check text-lg text-white"></div>
                </div>
                <div className="text-sm font-medium text-gray-700">Approved</div>
                <div className="text-xs text-gray-500 mt-1">Ready for collection</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <div className="icon-archive text-lg text-white"></div>
                </div>
                <div className="text-sm font-medium text-gray-700">Completed</div>
                <div className="text-xs text-gray-500 mt-1">Delivered to customer</div>
              </div>
            </div>
          </div>

          {/* New Visa Application Form */}
          {showForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="luxury-card w-full max-w-2xl mx-4 animate-luxury-fade">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-[var(--luxury-dark)]">New Visa Application</h2>
                  <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                    <div className="icon-x text-xl"></div>
                  </button>
                </div>
                <form onSubmit={handleCreateApplication} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Customer Name</label>
                    <input type="text" className="luxury-input" placeholder="Customer Full Name"
                      value={formData.customerName} onChange={(e) => setFormData({...formData, customerName: e.target.value})} required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Visa Type</label>
                      <select className="luxury-input" value={formData.type}
                        onChange={(e) => setFormData({...formData, type: e.target.value})}>
                        <option value="Tourist Visa">Tourist Visa</option>
                        <option value="Umrah Visa">Umrah Visa</option>
                        <option value="Hajj Visa">Hajj Visa</option>
                        <option value="Business Visa">Business Visa</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Country</label>
                      <select className="luxury-input" value={formData.country}
                        onChange={(e) => setFormData({...formData, country: e.target.value})}>
                        <option value="UAE">UAE</option>
                        <option value="Saudi Arabia">Saudi Arabia</option>
                        <option value="Qatar">Qatar</option>
                        <option value="Kuwait">Kuwait</option>
                        <option value="Oman">Oman</option>
                        <option value="Thailand">Thailand</option>
                        <option value="Malaysia">Malaysia</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Processing Fee (BDT)</label>
                    <input type="number" className="luxury-input" placeholder="Processing fee"
                      value={formData.fee} onChange={(e) => setFormData({...formData, fee: e.target.value})} required />
                  </div>
                  <div className="flex justify-end space-x-3 pt-4">
                    <button type="button" onClick={() => setShowForm(false)} 
                      className="luxury-btn-secondary">Cancel</button>
                    <button type="submit" className="luxury-btn">Submit Application</button>
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
    console.error('VisaManagement component error:', error);
    return null;
  }
}
