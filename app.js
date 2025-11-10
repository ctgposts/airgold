class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h1>
            <p className="text-gray-600 mb-4">We're sorry, but something unexpected happened.</p>
            <button
              onClick={() => window.location.reload()}
              className="btn btn-black"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  try {
    const [currentUser, setCurrentUser] = React.useState(null);
    const [currentView, setCurrentView] = React.useState('dashboard');
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
      // Check for existing session
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      }
      setIsLoading(false);
    }, []);

    const handleLogin = (user) => {
      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
    };

    const handleLogout = () => {
      setCurrentUser(null);
      localStorage.removeItem('currentUser');
      setCurrentView('dashboard');
    };

    const renderContent = () => {
      switch (currentView) {
        case 'tickets':
          return <TicketManagement currentUser={currentUser} />;
        case 'umrah':
          return <UmrahPackages currentUser={currentUser} />;
        case 'umrah-tickets':
          return <UmrahTicketManagement currentUser={currentUser} />;
        case 'customers':
          return <CustomerManagement currentUser={currentUser} />;
        case 'visa':
          return <VisaManagement currentUser={currentUser} />;
        case 'reports':
          return <Reports currentUser={currentUser} />;
        default:
          return <Dashboard currentUser={currentUser} onViewChange={setCurrentView} />;
      }
    };

    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--luxury-pearl)]">
          <div className="animate-float">
            <div className="w-16 h-16 border-4 border-[var(--luxury-gold)] border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      );
    }

    if (!currentUser) {
      return <LoginForm onLogin={handleLogin} />;
    }

    return (
      <div className="min-h-screen bg-[var(--luxury-pearl)] flex" data-name="app" data-file="app.js">
        <Navigation 
          currentUser={currentUser} 
          currentView={currentView}
          onViewChange={setCurrentView}
          onLogout={handleLogout}
        />
        <main className="flex-1 animate-luxury-fade main-content">
          {renderContent()}
        </main>
      </div>
    );
  } catch (error) {
    console.error('App component error:', error);
    return null;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);