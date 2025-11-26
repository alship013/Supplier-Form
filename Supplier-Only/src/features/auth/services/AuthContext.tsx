import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role?: 'admin' | 'staff' | 'visitor' | 'supplier';
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: RegisterData) => Promise<boolean>;
  registerSupplier: (userData: SupplierRegisterData) => Promise<boolean>;
  forgotPassword: (email: string) => Promise<boolean>;
  isLoading: boolean;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  fullName: string;
}

interface SupplierRegisterData {
  username: string;
  email: string;
  password: string;
  fullName: string;
  supplierData: any; // Will be typed with supplier data structure
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth data on component mount
    const storedAuth = localStorage.getItem('vsts_auth');
    if (storedAuth) {
      try {
        const authData = JSON.parse(storedAuth);
        if (authData.user && authData.expiresAt && new Date(authData.expiresAt) > new Date()) {
          setUser(authData.user);
        } else {
          // Clear expired session
          localStorage.removeItem('vsts_auth');
        }
      } catch (error) {
        console.error('Error parsing stored auth data:', error);
        localStorage.removeItem('vsts_auth');
      }
    }
    setIsLoading(false);
  }, []);

  // Mock user database for frontend-only authentication
  const mockUsers = [
    {
      id: '1',
      username: 'admin',
      email: 'admin@vsts.com',
      password: 'admin123',
      fullName: 'System Administrator',
      role: 'admin' as const
    },
    {
      id: '2',
      username: 'staff',
      email: 'staff@vsts.com',
      password: 'staff123',
      fullName: 'Staff User',
      role: 'staff' as const
    },
    {
      id: '3',
      username: 'visitor',
      email: 'visitor@vsts.com',
      password: 'visitor123',
      fullName: 'Visitor User',
      role: 'visitor' as const
    }
  ];

  // Supplier data storage
  const getSuppliers = () => {
    const stored = localStorage.getItem('vsts_suppliers');
    return stored ? JSON.parse(stored) : [];
  };

  const saveSuppliers = (suppliers: any[]) => {
    localStorage.setItem('vsts_suppliers', JSON.stringify(suppliers));
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check credentials against mock database and suppliers
    const foundUser = mockUsers.find(
      user => (user.username === username || user.email === username) && user.password === password
    );

    // Check if it's a supplier
    const suppliers = getSuppliers();
    const foundSupplier = suppliers.find(
      (supplier: any) => (supplier.username === username || supplier.email === username) && supplier.password === password
    );

    if (foundUser) {
      const userSession = {
        id: foundUser.id,
        username: foundUser.username,
        email: foundUser.email,
        fullName: foundUser.fullName,
        role: foundUser.role
      };

      // Store session in localStorage (expires in 24 hours)
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);

      localStorage.setItem('vsts_auth', JSON.stringify({
        user: userSession,
        expiresAt: expiresAt.toISOString()
      }));

      setUser(userSession);
      setIsLoading(false);
      return true;
    }

    if (foundSupplier) {
      const userSession = {
        id: foundSupplier.id,
        username: foundSupplier.username,
        email: foundSupplier.email,
        fullName: foundSupplier.supplierName,
        role: 'supplier' as const
      };

      // Store session in localStorage (expires in 24 hours)
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);

      localStorage.setItem('vsts_auth', JSON.stringify({
        user: userSession,
        expiresAt: expiresAt.toISOString()
      }));

      setUser(userSession);
      setIsLoading(false);
      return true;
    }

    setIsLoading(false);
    return false;
  };

  const logout = () => {
    localStorage.removeItem('vsts_auth');
    setUser(null);
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    setIsLoading(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check if user already exists
    const existingUser = mockUsers.find(
      user => user.username === userData.username || user.email === userData.email
    );

    if (existingUser) {
      setIsLoading(false);
      return false; // User already exists
    }

    // Add new user to mock database (in real app, this would be an API call)
    const newUser = {
      id: (mockUsers.length + 1).toString(),
      username: userData.username,
      email: userData.email,
      password: userData.password,
      fullName: userData.fullName,
      role: 'visitor' as const
    };

    mockUsers.push(newUser);

    // Auto-login after registration
    return await login(userData.username, userData.password);
  };

  const registerSupplier = async (userData: SupplierRegisterData): Promise<boolean> => {
    setIsLoading(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check if supplier already exists
    const suppliers = getSuppliers();
    const existingSupplier = suppliers.find(
      (supplier: any) => supplier.username === userData.username || supplier.email === userData.email
    );

    if (existingSupplier) {
      setIsLoading(false);
      return false; // Supplier already exists
    }

    // Create new supplier with generated ID
    const newSupplier = {
      id: `supplier_${Date.now()}`,
      username: userData.username,
      email: userData.email,
      password: userData.password,
      ...userData.supplierData,
      registrationDate: new Date().toISOString(),
      status: 'pending'
    };

    // Save supplier
    suppliers.push(newSupplier);
    saveSuppliers(suppliers);

    // Auto-login after registration
    return await login(userData.username, userData.password);
  };

  const forgotPassword = async (email: string): Promise<boolean> => {
    setIsLoading(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check if email exists
    const foundUser = mockUsers.find(user => user.email === email);

    setIsLoading(false);
    return !!foundUser; // Return true if email exists, false otherwise
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    register,
    registerSupplier,
    forgotPassword,
    isLoading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};