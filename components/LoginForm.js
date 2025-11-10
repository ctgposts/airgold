function LoginForm({ onLogin }) {
  try {
    const [credentials, setCredentials] = React.useState({ username: '', password: '' });
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState('');

    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsLoading(true);
      setError('');

      // Simulate authentication
      const result = await AuthService.login(credentials.username, credentials.password);
      
      if (result.success) {
        onLogin(result.user);
      } else {
        setError(result.message);
      }
      
      setIsLoading(false);
    };

    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--luxury-pearl)] to-[var(--luxury-cream)]" data-name="login-form" data-file="components/LoginForm.js">
        <div className="w-full max-w-md">
          <div className="luxury-card animate-luxury-fade">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-[var(--luxury-gold)] to-[var(--luxury-bronze)] rounded-full flex items-center justify-center mx-auto mb-4 animate-glow">
                <div className="icon-plane text-3xl text-white"></div>
              </div>
              <h1 className="text-2xl font-heading font-bold text-[hsl(var(--foreground))] mb-2">Dhaka Airways</h1>
              <p className="text-gray-600">Internal Ticketing System</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[hsl(var(--foreground))] mb-2">
                  Username
                </label>
                <input
                  type="text"
                  className="luxury-input"
                  value={credentials.username}
                  onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[hsl(var(--foreground))] mb-2">
                  Password
                </label>
                <input
                  type="password"
                  className="luxury-input"
                  value={credentials.password}
                  onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                  required
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full luxury-btn disabled:opacity-50"
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-8 text-center text-sm text-gray-500">
              <p className="mb-2">Demo Credentials:</p>
              <p><strong>Admin:</strong> admin / admin123</p>
              <p><strong>Manager:</strong> manager / manager123</p>
              <p><strong>Staff:</strong> staff / staff123</p>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs">© 2025 Dhaka Airways. All rights reserved.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('LoginForm component error:', error);
    return null;
  }
}