
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type UserType = 'customer' | 'restaurant' | 'driver';

type User = {
  id: string;
  name: string;
  phone: string;
  email?: string; // Adding email field
  type: UserType;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isRestaurant: boolean;
  login: (phone: string, password: string) => void;
  logout: () => void;
  // Adding new function to login as test restaurant account
  loginAsTestRestaurant: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock restaurant account
const TEST_RESTAURANT_ACCOUNT: User = {
  id: 'test-restaurant-1',
  name: 'Test Restaurant',
  phone: '1234567890',
  email: 'test@restaurant.com',
  type: 'restaurant'
};

export function AuthProvider({ children }: { children: ReactNode }) {
  // Check if there's a saved user in localStorage
  const getSavedUser = (): User | null => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      return JSON.parse(savedUser);
    }
    return null;
  };

  const [user, setUser] = useState<User | null>(getSavedUser());

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = (phone: string, password: string) => {
    // This is just a mock login function
    // In a real app, you would validate credentials with a backend
    
    // Check if this is a restaurant account
    const accountType = localStorage.getItem('accountType') || 'customer';
    
    const newUser: User = {
      id: '1',
      name: accountType === 'restaurant' ? 'Restaurant Owner' : 'Demo User',
      phone: phone,
      type: accountType as UserType
    };
    
    setUser(newUser);
    
    // Clear the temporary account type after login
    localStorage.removeItem('accountType');
  };

  // New function to login as the test restaurant account
  const loginAsTestRestaurant = () => {
    setUser(TEST_RESTAURANT_ACCOUNT);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isRestaurant: user?.type === 'restaurant',
        login,
        logout,
        loginAsTestRestaurant
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
