function TicketManagement({ currentUser }) {
  try {
    const [tickets, setTickets] = React.useState([]);
    const [showForm, setShowForm] = React.useState(false);
    const [showSellForm, setShowSellForm] = React.useState(false);
    const [selectedTicket, setSelectedTicket] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [formData, setFormData] = React.useState({
      from: 'Dhaka',
      to: '',
      airline: '',
      flightNumber: '',
      departureDate: '',
      returnDate: '',
      price: '',
      type: 'non-package',
      packageType: ''
    });

    React.useEffect(() => {
      loadTickets();
    }, []);

    const loadTickets = async () => {
      try {
        const ticketData = await TicketService.getTickets();
        setTickets(ticketData);
      } catch (error) {
        console.error('Error loading tickets:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const handlePurchaseTicket = async (e) => {
      e.preventDefault();
      try {
        await TicketService.createTicket({
          ...formData,
          price: parseInt(formData.price),
          purchasedBy: currentUser.name
        });
        setShowForm(false);
        setFormData({
          from: 'Dhaka', to: '', airline: '', flightNumber: '',
          departureDate: '', returnDate: '', price: '', type: 'non-package', packageType: ''
        });
        loadTickets();
      } catch (error) {
        console.error('Error creating ticket:', error);
      }
    };

    const handleSellTicket = async (customerId) => {
      try {
        await TicketService.updateTicketStatus(selectedTicket.id, 'sold', customerId);
        setShowSellForm(false);
        setSelectedTicket(null);
        loadTickets();
      } catch (error) {
        console.error('Error selling ticket:', error);
      }
    };

    const handleStatusChange = async (ticketId, newStatus) => {
      if (newStatus) {
        try {
          const result = await TicketService.updateTicketStatus(ticketId, newStatus);
          if (result?.error) {
            alert(`Status change failed: ${result.error}`);
          } else {
            loadTickets();
          }
        } catch (error) {
          console.error('Error updating ticket status:', error);
        }
      }
    };

    const getStatusColor = (status) => {
      switch (status) {
        case 'available': return 'bg-green-100 text-green-800';
        case 'sold': return 'bg-blue-100 text-blue-800';
        case 'booked': return 'bg-yellow-100 text-yellow-800';
        case 'cancelled': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    };

    const canPurchase = AuthService.canPurchaseTickets(currentUser);
    const canSell = AuthService.canSellTickets(currentUser);

    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="w-8 h-8 border-4 border-[var(--luxury-gold)] border-t-transparent rounded-full animate-spin"></div>
        </div>
      );
    }

    return (
      <div className="flex flex-col h-screen" data-name="ticket-management" data-file="components/TicketManagement.js">
        <header className="bg-white shadow-sm border-b px-4 md:px-6 py-3 md:py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between space-y-2 md:space-y-0">
            <div>
              <h1 className="text-xl md:text-2xl font-heading font-bold text-[hsl(var(--foreground))]">
                {canPurchase ? 'Ticket Management' : 'Ticket Sales'}
              </h1>
              <p className="text-sm md:text-base text-[hsl(var(--muted-foreground))] mt-1">
                {canPurchase ? 'Purchase and manage flight tickets' : 'Sell available tickets to customers'}
              </p>
            </div>
            {canPurchase && (
              <button 
                onClick={() => setShowForm(true)}
                className="luxury-btn flex items-center space-x-2 w-full md:w-auto justify-center"
              >
                <div className="icon-plus text-lg"></div>
                <span className="hidden sm:inline">Purchase Ticket</span>
                <span className="sm:hidden">Purchase</span>
              </button>
            )}
          </div>
        </header>
        
        <div className="flex-1 overflow-auto px-4 md:px-6 py-4 md:py-6">
          <div className="animate-luxury-fade">

          <div className="mobile-card">
            <div className="mb-4 flex flex-wrap gap-2">
              <button className="luxury-btn-secondary text-xs px-3 py-1 animate-shimmer">All Status</button>
              <button className="luxury-btn-secondary text-xs px-3 py-1">Available</button>
              <button className="luxury-btn-secondary text-xs px-3 py-1">Sold</button>
              <button className="luxury-btn-secondary text-xs px-3 py-1">Booked</button>
              <button className="luxury-btn-secondary text-xs px-3 py-1">Cancelled</button>
            </div>
            {/* Mobile Card View */}
            <div className="block md:hidden space-y-3">
              {tickets.map((ticket) => (
                <div key={ticket.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="font-semibold text-gray-900">{ticket.id}</div>
                      <div className="text-sm text-gray-600">{ticket.from} → {ticket.to}</div>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(ticket.status)}`}>
                      {ticket.status}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <div className="icon-plane text-sm text-gray-500"></div>
                      <span>{ticket.airline} {ticket.flightNumber}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-900">৳{ticket.price.toLocaleString()}</span>
                      <div className="flex space-x-2">
                        {ticket.status === 'available' && canSell && (
                          <button 
                            onClick={() => {setSelectedTicket(ticket); setShowSellForm(true);}}
                            className="luxury-btn-secondary text-xs px-3 py-1"
                          >
                            Sell
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
                    <th className="text-left py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm font-semibold text-gray-700">Ticket ID</th>
                    <th className="text-left py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm font-semibold text-gray-700">Route</th>
                    <th className="text-left py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm font-semibold text-gray-700">Airline</th>
                    <th className="text-left py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm font-semibold text-gray-700">Price (BDT)</th>
                    <th className="text-left py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm font-semibold text-gray-700">Status</th>
                    <th className="text-left py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {tickets.map((ticket) => (
                    <tr key={ticket.id} className="hover:bg-gray-50">
                      <td className="py-2 md:py-4 px-2 md:px-4 text-xs md:text-sm font-medium text-gray-900">{ticket.id}</td>
                      <td className="py-2 md:py-4 px-2 md:px-4 text-xs md:text-sm text-gray-600">{ticket.from} → {ticket.to}</td>
                      <td className="py-2 md:py-4 px-2 md:px-4 text-xs md:text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <div className="icon-plane text-xs md:text-sm text-gray-400"></div>
                          <span>{ticket.airline} {ticket.flightNumber}</span>
                        </div>
                      </td>
                      <td className="py-2 md:py-4 px-2 md:px-4 text-xs md:text-sm font-medium text-gray-900">৳{ticket.price.toLocaleString()}</td>
                      <td className="py-2 md:py-4 px-2 md:px-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(ticket.status)}`}>
                          {ticket.status}
                        </span>
                      </td>
                      <td className="py-2 md:py-4 px-2 md:px-4">
                        <div className="flex flex-wrap gap-1">
                          {ticket.status === 'available' && canSell && (
                            <button 
                              onClick={() => {setSelectedTicket(ticket); setShowSellForm(true);}}
                              className="luxury-btn-secondary text-xs px-2 py-1"
                            >
                              Sell
                            </button>
                          )}
                          {canPurchase && (
                            <select 
                              onChange={(e) => handleStatusChange(ticket.id, e.target.value)}
                              className="text-xs border rounded px-2 py-1"
                              value=""
                            >
                              <option value="">Status</option>
                              <option value="available">Available</option>
                              <option value="booked">Booked</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Purchase Ticket Form */}
          {showForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="luxury-card w-full max-w-2xl mx-4 animate-luxury-fade">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-[var(--luxury-dark)]">Purchase New Ticket</h2>
                  <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                    <div className="icon-x text-xl"></div>
                  </button>
                </div>
                <form onSubmit={handlePurchaseTicket} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">From</label>
                      <select className="luxury-input" value={formData.from} 
                        onChange={(e) => setFormData({...formData, from: e.target.value})}>
                        <option value="Dhaka">Dhaka</option>
                        <option value="Chittagong">Chittagong</option>
                        <option value="Sylhet">Sylhet</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">To</label>
                      <input type="text" className="luxury-input" placeholder="Destination" 
                        value={formData.to} onChange={(e) => setFormData({...formData, to: e.target.value})} required />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Airline</label>
                      <input type="text" className="luxury-input" placeholder="Airline Name"
                        value={formData.airline} onChange={(e) => setFormData({...formData, airline: e.target.value})} required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Flight Number</label>
                      <input type="text" className="luxury-input" placeholder="Flight Number"
                        value={formData.flightNumber} onChange={(e) => setFormData({...formData, flightNumber: e.target.value})} required />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Departure Date</label>
                      <input type="date" className="luxury-input"
                        value={formData.departureDate} onChange={(e) => setFormData({...formData, departureDate: e.target.value})} required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Return Date</label>
                      <input type="date" className="luxury-input"
                        value={formData.returnDate} onChange={(e) => setFormData({...formData, returnDate: e.target.value})} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Price (BDT)</label>
                      <input type="number" className="luxury-input" placeholder="Price"
                        value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Type</label>
                      <select className="luxury-input" value={formData.type}
                        onChange={(e) => setFormData({...formData, type: e.target.value})}>
                        <option value="non-package">Non-Package</option>
                        <option value="package">Package</option>
                      </select>
                    </div>
                  </div>
                  {formData.type === 'package' && (
                    <div>
                      <label className="block text-sm font-medium mb-2">Package Type</label>
                      <select className="luxury-input" value={formData.packageType}
                        onChange={(e) => setFormData({...formData, packageType: e.target.value})}>
                        <option value="">Select Package Type</option>
                        <option value="umrah">Umrah</option>
                        <option value="hajj">Hajj</option>
                        <option value="tourist">Tourist</option>
                      </select>
                    </div>
                  )}
                  <div className="flex justify-end space-x-3 pt-4">
                    <button type="button" onClick={() => setShowForm(false)} 
                      className="luxury-btn-secondary">Cancel</button>
                    <button type="submit" className="luxury-btn">Purchase Ticket</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Sell Ticket Form */}
          {showSellForm && selectedTicket && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="luxury-card w-full max-w-md mx-4 animate-luxury-fade">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-[var(--luxury-dark)]">Sell Ticket</h2>
                  <button onClick={() => setShowSellForm(false)} className="text-gray-400 hover:text-gray-600">
                    <div className="icon-x text-xl"></div>
                  </button>
                </div>
                <div className="mb-4">
                  <h3 className="font-medium text-gray-900">{selectedTicket.id}</h3>
                  <p className="text-sm text-gray-600">{selectedTicket.from} → {selectedTicket.to}</p>
                  <p className="text-lg font-bold text-[var(--luxury-gold)]">৳{selectedTicket.price.toLocaleString()}</p>
                </div>
                <div className="space-y-3">
                  <button onClick={() => handleSellTicket('CUST001')} 
                    className="w-full luxury-btn-secondary text-left p-3">
                    <div className="font-medium">Mohammad Hassan</div>
                    <div className="text-sm text-gray-600">CUST001 • +8801712345678</div>
                  </button>
                  <button onClick={() => handleSellTicket('CUST002')} 
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
    console.error('TicketManagement component error:', error);
    return null;
  }
}