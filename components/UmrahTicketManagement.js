function UmrahTicketManagement({ currentUser }) {
  try {
    const [selectedPackage, setSelectedPackage] = React.useState('with-transport');
    const [showForm, setShowForm] = React.useState(false);
    const [editingTicket, setEditingTicket] = React.useState(null);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [umrahTickets, setUmrahTickets] = React.useState([]);
    const [packages, setPackages] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    
    const [withTransportForm, setWithTransportForm] = React.useState({
      passengerName: '', pnr: '', passportNumber: '', flightAirline: '',
      departureDate: '', returnDate: '', approvedBy: '', referenceAgency: '',
      emergencyContact: '', passengerMobile: ''
    });

    const [withoutTransportForm, setWithoutTransportForm] = React.useState({
      departureDate: '', returnDate: '', passengerName: '', passportNumber: '',
      entryRecordedBy: '', totalAmount: '', amountPaid: '', lastPaymentDate: '', remarks: ''
    });

    const canManage = currentUser.role === 'admin' || currentUser.role === 'manager';

    React.useEffect(() => {
      loadPackages();
      loadTickets();
    }, []);

    const loadPackages = async () => {
      try {
        const result = await trickleListObjects('umrah_package', 50, false);
        setPackages(result.items || []);
      } catch (error) {
        console.error('Error loading packages:', error);
      }
    };

    const loadTickets = async () => {
      try {
        setIsLoading(true);
        const ticketsResult = await trickleListObjects('umrah_ticket', 100, true);
        const tickets = [];
        
        for (const ticketObj of ticketsResult.items || []) {
          const ticket = ticketObj.objectData;
          
          if (ticket.package_type === 'with-transport') {
            try {
              const transportResult = await trickleListObjects(`umrah_with_transport:${ticket.ticket_id}`, 1);
              const transportData = transportResult.items[0]?.objectData || {};
              tickets.push({ ...ticket, ...transportData, id: ticket.ticket_id });
            } catch (error) {
              tickets.push({ ...ticket, id: ticket.ticket_id });
            }
          } else {
            try {
              const withoutTransportResult = await trickleListObjects(`umrah_without_transport:${ticket.ticket_id}`, 1);
              const withoutTransportData = withoutTransportResult.items[0]?.objectData || {};
              tickets.push({ ...ticket, ...withoutTransportData, id: ticket.ticket_id });
            } catch (error) {
              tickets.push({ ...ticket, id: ticket.ticket_id });
            }
          }
        }
        
        setUmrahTickets(tickets);
      } catch (error) {
        console.error('Error loading tickets:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const getDayOfWeek = (dateString) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { weekday: 'long' });
    };

    const calculateRemaining = () => {
      const total = parseFloat(withoutTransportForm.totalAmount) || 0;
      const paid = parseFloat(withoutTransportForm.amountPaid) || 0;
      return total - paid;
    };

    const resetForms = () => {
      setWithTransportForm({
        passengerName: '', pnr: '', passportNumber: '', flightAirline: '',
        departureDate: '', returnDate: '', approvedBy: '', referenceAgency: '',
        emergencyContact: '', passengerMobile: ''
      });
      setWithoutTransportForm({
        departureDate: '', returnDate: '', passengerName: '', passportNumber: '',
        entryRecordedBy: '', totalAmount: '', amountPaid: '', lastPaymentDate: '', remarks: ''
      });
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const ticketId = editingTicket?.id || `UMR-${Date.now()}`;
        
        const ticketData = {
          ticket_id: ticketId,
          package_type: selectedPackage,
          passenger_name: selectedPackage === 'with-transport' ? withTransportForm.passengerName : withoutTransportForm.passengerName,
          passport_number: selectedPackage === 'with-transport' ? withTransportForm.passportNumber : withoutTransportForm.passportNumber,
          departure_date: selectedPackage === 'with-transport' ? withTransportForm.departureDate : withoutTransportForm.departureDate,
          return_date: selectedPackage === 'with-transport' ? withTransportForm.returnDate : withoutTransportForm.returnDate,
          created_by: currentUser.name,
          status: 'active'
        };

        if (editingTicket) {
          await trickleUpdateObject('umrah_ticket', editingTicket.objectId, ticketData);
        } else {
          await trickleCreateObject('umrah_ticket', ticketData);
        }

        if (selectedPackage === 'with-transport') {
          const transportData = {
            ticket_id: ticketId,
            pnr: withTransportForm.pnr,
            flight_airline: withTransportForm.flightAirline,
            approved_by: withTransportForm.approvedBy,
            reference_agency: withTransportForm.referenceAgency,
            emergency_contact: withTransportForm.emergencyContact,
            passenger_mobile: withTransportForm.passengerMobile
          };

          try {
            const existing = await trickleListObjects(`umrah_with_transport:${ticketId}`, 1);
            if (existing.items.length > 0) {
              await trickleUpdateObject(`umrah_with_transport:${ticketId}`, existing.items[0].objectId, transportData);
            } else {
              await trickleCreateObject(`umrah_with_transport:${ticketId}`, transportData);
            }
          } catch (error) {
            await trickleCreateObject(`umrah_with_transport:${ticketId}`, transportData);
          }
        } else {
          const withoutTransportData = {
            ticket_id: ticketId,
            entry_recorded_by: withoutTransportForm.entryRecordedBy,
            total_amount: parseFloat(withoutTransportForm.totalAmount) || 0,
            amount_paid: parseFloat(withoutTransportForm.amountPaid) || 0,
            remaining_amount: calculateRemaining(),
            last_payment_date: withoutTransportForm.lastPaymentDate,
            remarks: withoutTransportForm.remarks
          };

          try {
            const existing = await trickleListObjects(`umrah_without_transport:${ticketId}`, 1);
            if (existing.items.length > 0) {
              await trickleUpdateObject(`umrah_without_transport:${ticketId}`, existing.items[0].objectId, withoutTransportData);
            } else {
              await trickleCreateObject(`umrah_without_transport:${ticketId}`, withoutTransportData);
            }
          } catch (error) {
            await trickleCreateObject(`umrah_without_transport:${ticketId}`, withoutTransportData);
          }
        }

        await loadTickets();
        setShowForm(false);
        setEditingTicket(null);
        resetForms();
      } catch (error) {
        console.error('Error saving ticket:', error);
        alert('Error saving ticket. Please try again.');
      }
    };

    const handleEdit = (ticket) => {
      setEditingTicket(ticket);
      setSelectedPackage(ticket.type);
      if (ticket.type === 'with-transport') {
        setWithTransportForm({
          passengerName: ticket.passengerName || '', pnr: ticket.pnr || '',
          passportNumber: ticket.passportNumber || '', flightAirline: ticket.flightAirline || '',
          departureDate: ticket.departureDate || '', returnDate: ticket.returnDate || '',
          approvedBy: ticket.approvedBy || '', referenceAgency: ticket.referenceAgency || '',
          emergencyContact: ticket.emergencyContact || '', passengerMobile: ticket.passengerMobile || ''
        });
      } else {
        setWithoutTransportForm({
          departureDate: ticket.departureDate || '', returnDate: ticket.returnDate || '',
          passengerName: ticket.passengerName || '', passportNumber: ticket.passportNumber || '',
          entryRecordedBy: ticket.entryRecordedBy || '', totalAmount: ticket.totalAmount || '',
          amountPaid: ticket.amountPaid || '', lastPaymentDate: ticket.lastPaymentDate || '',
          remarks: ticket.remarks || ''
        });
      }
      setShowForm(true);
    };

    const handleDelete = async (ticket) => {
      if (confirm('Are you sure you want to delete this ticket?')) {
        try {
          await trickleDeleteObject('umrah_ticket', ticket.objectId);
          
          try {
            if (ticket.package_type === 'with-transport') {
              const existing = await trickleListObjects(`umrah_with_transport:${ticket.ticket_id}`, 1);
              if (existing.items.length > 0) {
                await trickleDeleteObject(`umrah_with_transport:${ticket.ticket_id}`, existing.items[0].objectId);
              }
            } else {
              const existing = await trickleListObjects(`umrah_without_transport:${ticket.ticket_id}`, 1);
              if (existing.items.length > 0) {
                await trickleDeleteObject(`umrah_without_transport:${ticket.ticket_id}`, existing.items[0].objectId);
              }
            }
          } catch (error) {
            console.error('Error deleting related data:', error);
          }

          await loadTickets();
        } catch (error) {
          console.error('Error deleting ticket:', error);
          alert('Error deleting ticket. Please try again.');
        }
      }
    };

    const filteredTickets = umrahTickets.filter(ticket =>
      ticket.passengerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.passportNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="flex flex-col h-screen" data-name="umrah-ticket-management">
        <header className="bg-white shadow-sm border-b px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-heading font-bold">Umrah Ticket Management</h1>
              <p className="text-gray-600 mt-1">Manage Umrah tickets with and without transport packages</p>
            </div>
            {canManage && (
              <button onClick={() => {setShowForm(true); setEditingTicket(null); resetForms();}}
                className="luxury-btn flex items-center space-x-2">
                <div className="icon-plus text-lg"></div>
                <span>New Umrah Ticket</span>
              </button>
            )}
          </div>
        </header>

        <div className="flex-1 overflow-auto px-6 py-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-8 h-8 border-4 border-[var(--luxury-gold)] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
          <div>
          <div className="grid grid-cols-4 gap-6 mb-8">
            <div className="stat-card">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                <div className="icon-plane text-xl text-white"></div>
              </div>
              <div className="text-2xl font-bold">{filteredTickets.length}</div>
              <div className="text-sm text-gray-600">Total Tickets</div>
            </div>
            <div className="stat-card">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                <div className="icon-check-circle text-xl text-white"></div>
              </div>
              <div className="text-2xl font-bold">
                {filteredTickets.filter(t => t.type === 'with-transport').length}
              </div>
              <div className="text-sm text-gray-600">With Transport</div>
            </div>
            <div className="stat-card">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                <div className="icon-user text-xl text-white"></div>
              </div>
              <div className="text-2xl font-bold">
                {filteredTickets.filter(t => t.type === 'without-transport').length}
              </div>
              <div className="text-sm text-gray-600">Without Transport</div>
            </div>
            <div className="stat-card">
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                <div className="icon-banknote text-xl text-white"></div>
              </div>
              <div className="text-2xl font-bold">
                ৳{filteredTickets.reduce((sum, t) => sum + (parseFloat(t.totalAmount) || 0), 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total Revenue</div>
            </div>
          </div>

          <div className="mobile-card">
            <div className="flex justify-between items-center mb-4">
              <input type="text" placeholder="Search by name, passport, or ticket ID..."
                className="luxury-input w-80" value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)} />
              <button onClick={() => window.print()} className="luxury-btn-secondary flex items-center space-x-2">
                <div className="icon-download text-sm"></div>
                <span>Export PDF</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Ticket ID</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Passenger</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Type</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Departure</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Amount</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredTickets.map((ticket) => (
                    <tr key={ticket.id} className="hover:bg-gray-50">
                      <td className="py-4 px-4 font-medium text-gray-900">{ticket.id}</td>
                      <td className="py-4 px-4">
                        <div className="font-medium text-gray-900">{ticket.passengerName}</div>
                        <div className="text-sm text-gray-500">{ticket.passportNumber}</div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          ticket.type === 'with-transport' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                        }`}>
                          {ticket.type === 'with-transport' ? 'With Transport' : 'Without Transport'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-gray-600">{ticket.departureDate}</td>
                      <td className="py-4 px-4 font-medium text-gray-900">
                        {ticket.totalAmount ? `৳${parseFloat(ticket.totalAmount).toLocaleString()}` : '-'}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex space-x-2">
                          <button onClick={() => handleEdit(ticket)} className="luxury-btn-secondary text-xs px-3 py-1">
                            <div className="icon-edit text-xs text-blue-600"></div>
                          </button>
                          <button onClick={() => handleDelete(ticket)} className="luxury-btn-secondary text-xs px-3 py-1">
                            <div className="icon-trash text-xs text-red-600"></div>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {showForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="luxury-card w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">
                    {editingTicket ? 'Edit Umrah Ticket' : 'New Umrah Ticket'}
                  </h2>
                  <button onClick={() => {setShowForm(false); setEditingTicket(null);}} 
                    className="text-gray-400 hover:text-gray-600">
                    <div className="icon-x text-xl"></div>
                  </button>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium mb-3">Package Type</label>
                  <div className="grid grid-cols-2 gap-4">
                    <label className={`flex items-center p-4 border rounded-lg cursor-pointer ${
                      selectedPackage === 'with-transport' ? 'border-[var(--luxury-gold)] bg-[var(--luxury-cream-50)]' : 'border-gray-300'
                    }`}>
                      <input type="radio" name="packageType" value="with-transport"
                        checked={selectedPackage === 'with-transport'}
                        onChange={(e) => setSelectedPackage(e.target.value)} className="mr-3" />
                      <div>
                        <div className="font-medium text-gray-900">Umrah With Transport</div>
                        <div className="text-sm text-gray-600">Complete package with flight arrangements</div>
                      </div>
                    </label>
                    <label className={`flex items-center p-4 border rounded-lg cursor-pointer ${
                      selectedPackage === 'without-transport' ? 'border-[var(--luxury-gold)] bg-[var(--luxury-cream-50)]' : 'border-gray-300'
                    }`}>
                      <input type="radio" name="packageType" value="without-transport"
                        checked={selectedPackage === 'without-transport'}
                        onChange={(e) => setSelectedPackage(e.target.value)} className="mr-3" />
                      <div>
                        <div className="font-medium text-gray-900">Umrah Without Transport</div>
                        <div className="text-sm text-gray-600">Service only, customer arranges transport</div>
                      </div>
                    </label>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {selectedPackage === 'with-transport' ? (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Passenger Name *</label>
                        <input type="text" className="luxury-input" value={withTransportForm.passengerName}
                          onChange={(e) => setWithTransportForm({...withTransportForm, passengerName: e.target.value})} required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">PNR *</label>
                        <input type="text" className="luxury-input" value={withTransportForm.pnr}
                          onChange={(e) => setWithTransportForm({...withTransportForm, pnr: e.target.value})} required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Passport Number *</label>
                        <input type="text" className="luxury-input" value={withTransportForm.passportNumber}
                          onChange={(e) => setWithTransportForm({...withTransportForm, passportNumber: e.target.value})} required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Flight / Airline Name *</label>
                        <input type="text" className="luxury-input" value={withTransportForm.flightAirline}
                          onChange={(e) => setWithTransportForm({...withTransportForm, flightAirline: e.target.value})} required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Departure Date *</label>
                        <input type="date" className="luxury-input" value={withTransportForm.departureDate}
                          onChange={(e) => setWithTransportForm({...withTransportForm, departureDate: e.target.value})} required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Return Date *</label>
                        <input type="date" className="luxury-input" value={withTransportForm.returnDate}
                          onChange={(e) => setWithTransportForm({...withTransportForm, returnDate: e.target.value})} required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Approved By</label>
                        <input type="text" className="luxury-input" value={withTransportForm.approvedBy}
                          onChange={(e) => setWithTransportForm({...withTransportForm, approvedBy: e.target.value})} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Reference Agency</label>
                        <input type="text" className="luxury-input" value={withTransportForm.referenceAgency}
                          onChange={(e) => setWithTransportForm({...withTransportForm, referenceAgency: e.target.value})} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Emergency Flight Contact</label>
                        <input type="tel" className="luxury-input" value={withTransportForm.emergencyContact}
                          onChange={(e) => setWithTransportForm({...withTransportForm, emergencyContact: e.target.value})} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Passenger Mobile *</label>
                        <input type="tel" className="luxury-input" value={withTransportForm.passengerMobile}
                          onChange={(e) => setWithTransportForm({...withTransportForm, passengerMobile: e.target.value})} required />
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Flight Departure Date *</label>
                        <input type="date" className="luxury-input" value={withoutTransportForm.departureDate}
                          onChange={(e) => setWithoutTransportForm({...withoutTransportForm, departureDate: e.target.value})} required />
                        {withoutTransportForm.departureDate && (
                          <div className="text-sm text-gray-600 mt-1">Day: {getDayOfWeek(withoutTransportForm.departureDate)}</div>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Return Date *</label>
                        <input type="date" className="luxury-input" value={withoutTransportForm.returnDate}
                          onChange={(e) => setWithoutTransportForm({...withoutTransportForm, returnDate: e.target.value})} required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Passenger Name *</label>
                        <input type="text" className="luxury-input" value={withoutTransportForm.passengerName}
                          onChange={(e) => setWithoutTransportForm({...withoutTransportForm, passengerName: e.target.value})} required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Passport Number *</label>
                        <input type="text" className="luxury-input" value={withoutTransportForm.passportNumber}
                          onChange={(e) => setWithoutTransportForm({...withoutTransportForm, passportNumber: e.target.value})} required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Entry Recorded By</label>
                        <input type="text" className="luxury-input" value={withoutTransportForm.entryRecordedBy}
                          onChange={(e) => setWithoutTransportForm({...withoutTransportForm, entryRecordedBy: e.target.value})} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Total Amount (BDT) *</label>
                        <input type="number" className="luxury-input" value={withoutTransportForm.totalAmount}
                          onChange={(e) => setWithoutTransportForm({...withoutTransportForm, totalAmount: e.target.value})} required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Amount Paid (BDT)</label>
                        <input type="number" className="luxury-input" value={withoutTransportForm.amountPaid}
                          onChange={(e) => setWithoutTransportForm({...withoutTransportForm, amountPaid: e.target.value})} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Remaining Amount (BDT)</label>
                        <input type="number" className="luxury-input bg-gray-50" value={calculateRemaining()} readOnly />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Last Payment Date</label>
                        <input type="date" className="luxury-input" value={withoutTransportForm.lastPaymentDate}
                          onChange={(e) => setWithoutTransportForm({...withoutTransportForm, lastPaymentDate: e.target.value})} />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-medium mb-2">Remarks / Notes</label>
                        <textarea className="luxury-input" rows="3" value={withoutTransportForm.remarks}
                          onChange={(e) => setWithoutTransportForm({...withoutTransportForm, remarks: e.target.value})} />
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end space-x-3 pt-6 border-t">
                    <button type="button" onClick={() => {setShowForm(false); setEditingTicket(null);}}
                      className="luxury-btn-secondary">Cancel</button>
                    <button type="submit" className="luxury-btn">
                      {editingTicket ? 'Update Ticket' : 'Create Ticket'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
          </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error('UmrahTicketManagement component error:', error);
    return null;
  }
}