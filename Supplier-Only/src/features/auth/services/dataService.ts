import { supabase } from '../../../lib/supabase'

export interface Visitor {
  id: string
  name: string
  company: string
  email: string
  phone: string
  host: string
  checkInTime?: string
  checkOutTime?: string
  status: 'checked-in' | 'checked-out' | 'pre-registered'
  purpose: string
  badgeNumber?: string
  created_at?: string
  updated_at?: string
}

export interface StaffMember {
  id: string
  name: string
  email: string
  department: string
  role: string
  checkInTime?: string
  checkOutTime?: string
  status: 'checked-in' | 'checked-out' | 'off-site'
  created_at?: string
  updated_at?: string
}

export interface EmergencySession {
  id: string
  type: 'drill' | 'actual'
  status: 'active' | 'completed'
  startTime: string
  endTime?: string
  location?: string
  description?: string
  created_at?: string
  updated_at?: string
}

class DataService {
  private isSupabaseConnected: boolean = false

  constructor() {
    this.checkConnection()
  }

  private async checkConnection() {
    try {
      // Try to connect to Supabase
      const { data, error } = await supabase.from('visitors').select('count').single()
      this.isSupabaseConnected = !error
    } catch {
      this.isSupabaseConnected = false
    }
  }

  // Visitors
  async getVisitors(): Promise<Visitor[]> {
    if (this.isSupabaseConnected) {
      try {
        const { data, error } = await supabase
          .from('visitors')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error
        return data || []
      } catch {
        // Fallback to localStorage
        return this.getVisitorsFromStorage()
      }
    }

    return this.getVisitorsFromStorage()
  }

  async getVisitorsFromStorage(): Promise<Visitor[]> {
    try {
      const stored = JSON.parse(localStorage.getItem('vsts_visitors') || '[]')

      // Convert stored data to Visitor interface format
      const visitors: Visitor[] = stored.map((visitor: any) => ({
        id: visitor.id,
        name: visitor.fullName || visitor.name,
        company: visitor.company,
        email: visitor.email,
        phone: visitor.phoneNumber || visitor.phone,
        host: visitor.hostName || visitor.host,
        checkInTime: visitor.checkInTime || '',
        checkOutTime: visitor.checkOutTime,
        status: visitor.status || 'pre-registered',
        purpose: visitor.purposeOfVisit || visitor.purpose,
        badgeNumber: visitor.badgeNumber
      }))

      // Add mock current visitors for demonstration
      const mockVisitors: Visitor[] = [
        {
          id: 'mock-1',
          name: 'John Smith',
          company: 'Tech Solutions Inc.',
          email: 'john@techsolutions.com',
          phone: '+1 555-0123',
          host: 'Sarah Johnson',
          checkInTime: new Date().toISOString(),
          status: 'checked-in',
          purpose: 'System Integration Meeting',
          badgeNumber: 'V001'
        },
        {
          id: 'mock-2',
          name: 'Maria Garcia',
          company: 'Clean Energy Solutions',
          email: 'maria@cleanenergy.com',
          phone: '+1 555-0126',
          host: 'David Martinez',
          checkInTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
          status: 'checked-in',
          purpose: 'Equipment Installation',
          badgeNumber: 'V003'
        },
        {
          id: 'mock-3',
          name: 'Robert Chen',
          company: 'Security Systems Ltd.',
          email: 'robert@securitysys.com',
          phone: '+1 555-0129',
          host: 'Lisa Wang',
          checkInTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
          status: 'checked-in',
          purpose: 'Security Audit',
          badgeNumber: 'V004'
        }
      ]

      return [...visitors, ...mockVisitors]
    } catch {
      return this.getDefaultVisitors()
    }
  }

  private getDefaultVisitors(): Visitor[] {
    return [
      {
        id: 'default-1',
        name: 'John Smith',
        company: 'Tech Solutions Inc.',
        email: 'john@techsolutions.com',
        phone: '+1 555-0123',
        host: 'Sarah Johnson',
        checkInTime: new Date().toISOString(),
        status: 'checked-in',
        purpose: 'System Integration Meeting',
        badgeNumber: 'V001'
      }
    ]
  }

  // Staff
  async getStaff(): Promise<StaffMember[]> {
    if (this.isSupabaseConnected) {
      try {
        const { data, error } = await supabase
          .from('staff')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error
        return data || []
      } catch {
        return this.getStaffFromStorage()
      }
    }

    return this.getStaffFromStorage()
  }

  private getStaffFromStorage(): StaffMember[] {
    // Generate mock staff data
    return [
      {
        id: 'staff-1',
        name: 'Sarah Johnson',
        email: 'sarah.johnson@company.com',
        department: 'IT',
        role: 'Systems Administrator',
        checkInTime: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        status: 'checked-in'
      },
      {
        id: 'staff-2',
        name: 'David Martinez',
        email: 'david.martinez@company.com',
        department: 'Facilities',
        role: 'Facilities Manager',
        checkInTime: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(),
        status: 'checked-in'
      },
      {
        id: 'staff-3',
        name: 'Lisa Wang',
        email: 'lisa.wang@company.com',
        department: 'Security',
        role: 'Security Officer',
        checkInTime: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        status: 'checked-in'
      },
      {
        id: 'staff-4',
        name: 'Michael Brown',
        email: 'michael.brown@company.com',
        department: 'Operations',
        role: 'Operations Manager',
        status: 'off-site'
      },
      {
        id: 'staff-5',
        name: 'Jennifer Davis',
        email: 'jennifer.davis@company.com',
        department: 'HR',
        role: 'HR Manager',
        checkInTime: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        status: 'checked-in'
      }
    ]
  }

  // Emergency
  async getEmergencySession(): Promise<EmergencySession | null> {
    if (this.isSupabaseConnected) {
      try {
        const { data, error } = await supabase
          .from('emergency_sessions')
          .select('*')
          .eq('status', 'active')
          .single()

        if (error && error.code !== 'PGRST116') throw error // PGRST116 = no rows returned
        return data
      } catch {
        return this.getEmergencyFromStorage()
      }
    }

    return this.getEmergencyFromStorage()
  }

  private getEmergencyFromStorage(): EmergencySession | null {
    try {
      const stored = localStorage.getItem('vsts_emergency_session')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  }

  // Real-time subscription
  subscribeToVisitors(callback: (visitors: Visitor[]) => void) {
    if (this.isSupabaseConnected) {
      return supabase
        .channel('visitors_changes')
        .on('postgres_changes',
          { event: '*', schema: 'public', table: 'visitors' },
          () => this.getVisitors().then(callback)
        )
        .subscribe()
    } else {
      // Fallback: localStorage event listeners
      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === 'vsts_visitors') {
          this.getVisitors().then(callback)
        }
      }
      window.addEventListener('storage', handleStorageChange)
      return { unsubscribe: () => window.removeEventListener('storage', handleStorageChange) }
    }
  }

  subscribeToEmergency(callback: (emergency: EmergencySession | null) => void) {
    if (this.isSupabaseConnected) {
      return supabase
        .channel('emergency_changes')
        .on('postgres_changes',
          { event: '*', schema: 'public', table: 'emergency_sessions' },
          () => this.getEmergencySession().then(callback)
        )
        .subscribe()
    } else {
      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === 'vsts_emergency_session') {
          this.getEmergencySession().then(callback)
        }
      }
      window.addEventListener('storage', handleStorageChange)
      return { unsubscribe: () => window.removeEventListener('storage', handleStorageChange) }
    }
  }

  // Utility methods
  getConnectionStatus() {
    return {
      isConnected: this.isSupabaseConnected,
      type: this.isSupabaseConnected ? 'Supabase' : 'localStorage (Demo Mode)'
    }
  }
}

export const dataService = new DataService()