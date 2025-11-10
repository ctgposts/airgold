function UmrahPackages({ currentUser }) {
  try {
    const [showBookingForm, setShowBookingForm] = React.useState(false);
    const [selectedPackage, setSelectedPackage] = React.useState(null);
    const [packages, setPackages] = React.useState([
      {
        id: 'UMR001',
        name: 'Premium Umrah Package',
        duration: '14 days',
        price: 150000,
        includes: ['Round-trip flights', '4-star hotel in Makkah', '3-star hotel in Madinah', 'Visa processing', 'Transportation'],
        status: 'active',
        availableSlots: 25
      },
      {
        id: 'UMR002',
        name: 'Economy Umrah Package',
        duration: '10 days',
        price: 95000,
        includes: ['Round-trip flights', '3-star hotel in Makkah', '2-star hotel in Madinah', 'Visa processing'],
        status: 'active',
        availableSlots: 40
      }
    ]);

    const canManage = AuthService.canManageUmrah(currentUser);

    const handleBookPackage = (customerName) => {
      const updatedPackages = packages.map(pkg => 
        pkg.id === selectedPackage.id 
          ? { ...pkg, availableSlots: pkg.availableSlots - 1 }
          : pkg
      );
      setPackages(updatedPackages);
      setShowBookingForm(false);
      setSelectedPackage(null);
    };

    return (
      <div className="flex flex-col h-screen" data-name="umrah-packages" data-file="components/UmrahPackages.js">
        <header className="bg-white shadow-sm border-b px-4 md:px-6 py-3 md:py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between space-y-2 md:space-y-0">
            <div>
              <h1 className="text-xl md:text-2xl font-heading font-bold text-[hsl(var(--foreground))]">Umrah Packages</h1>
              <p className="text-sm md:text-base text-[hsl(var(--muted-foreground))] mt-1">Manage Umrah pilgrimage packages for customers</p>
            </div>
            {canManage && (
              <button className="luxury-btn flex items-center space-x-2 w-full md:w-auto justify-center">
                <div className="icon-plus text-lg"></div>
                <span>Create Package</span>
              </button>
            )}
          </div>
        </header>
        
        <div className="flex-1 overflow-auto px-4 md:px-6 py-4 md:py-6">
          <div className="animate-luxury-fade">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            {packages.map((pkg, index) => (
              <div key={pkg.id} className="luxury-card animate-velvet-slide" style={{animationDelay: `${index * 200}ms`}}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-[var(--luxury-dark)] mb-1">{pkg.name}</h3>
                    <p className="text-gray-600 text-sm">{pkg.duration} • {pkg.availableSlots} slots available</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-[var(--luxury-gold)]">৳{pkg.price.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">per person</div>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Package Includes:</h4>
                  <ul className="space-y-2">
                    {pkg.includes.map((item, i) => (
                      <li key={i} className="flex items-center space-x-2 text-sm text-gray-600">
                        <div className="icon-check text-green-500"></div>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex justify-between items-center">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                    pkg.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {pkg.status}
                  </span>
                  <div className="flex space-x-2">
                    <button onClick={() => {setSelectedPackage(pkg); setShowBookingForm(true);}} 
                      className="luxury-btn-secondary text-sm px-4 py-2">Book Now</button>
                    {canManage && (
                      <button className="luxury-btn-secondary text-sm px-4 py-2">
                        <div className="icon-edit text-sm"></div>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 luxury-card">
            <h3 className="text-lg font-semibold text-[var(--luxury-dark)] mb-4">Package Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-[var(--luxury-gold)] mb-1">2</div>
                <div className="text-sm text-gray-600">Active Packages</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[var(--luxury-gold)] mb-1">65</div>
                <div className="text-sm text-gray-600">Total Slots</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[var(--luxury-gold)] mb-1">18</div>
                <div className="text-sm text-gray-600">Bookings This Month</div>
              </div>
            </div>
          </div>

          {/* Package Booking Form */}
          {showBookingForm && selectedPackage && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="luxury-card w-full max-w-md mx-4 animate-luxury-fade">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-[var(--luxury-dark)]">Book Package</h2>
                  <button onClick={() => setShowBookingForm(false)} className="text-gray-400 hover:text-gray-600">
                    <div className="icon-x text-xl"></div>
                  </button>
                </div>
                <div className="mb-4">
                  <h3 className="font-medium text-gray-900">{selectedPackage.name}</h3>
                  <p className="text-sm text-gray-600">{selectedPackage.duration}</p>
                  <p className="text-lg font-bold text-[var(--luxury-gold)]">৳{selectedPackage.price.toLocaleString()}</p>
                </div>
                <div className="space-y-3">
                  <button onClick={() => handleBookPackage('Mohammad Hassan')} 
                    className="w-full luxury-btn-secondary text-left p-3">
                    <div className="font-medium">Mohammad Hassan</div>
                    <div className="text-sm text-gray-600">CUST001 • +8801712345678</div>
                  </button>
                  <button onClick={() => handleBookPackage('Ayesha Rahman')} 
                    className="w-full luxury-btn-secondary text-left p-3">
                    <div className="font-medium">Ayesha Rahman</div>
                    <div className="text-sm text-gray-600">CUST002 • +8801798765432</div>
                  </button>
                </div>
              </div>
            </div>
          )}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('UmrahPackages component error:', error);
    return null;
  }
}