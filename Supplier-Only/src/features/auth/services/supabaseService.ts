import { supabase } from '../../../lib/supabase'

// Database table interfaces matching Supabase schema
export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  department: string | null;
  role_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Role {
  id: string;
  name: string;
  description: string | null;
  permissions: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Site {
  id: string;
  name: string;
  address: string | null;
  created_at: string;
}

export interface Zone {
  id: string;
  site_id: string;
  name: string;
  description: string | null;
  zone_type: string;
  max_capacity: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Visitor {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  purpose_of_visit: string | null;
  host_id: string;
  site_id: string;
  photo_url: string | null;
  badge_number: string | null;
  check_in_time: string | null;
  check_out_time: string | null;
  status: 'pre-registered' | 'checked-in' | 'checked-out' | 'denied';
  zone_id: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface StaffAttendance {
  id: string;
  user_id: string;
  site_id: string;
  attendance_type: 'check_in' | 'check_out';
  zone_id: string | null;
  timestamp: string;
  notes: string | null;
  created_at: string;
}

export interface EmergencySession {
  id: string;
  site_id: string;
  initiated_by: string;
  emergency_type: 'fire' | 'medical' | 'security' | 'drill' | 'weather' | 'other';
  severity_level: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'resolved' | 'cancelled';
  title: string;
  description: string | null;
  location_description: string | null;
  start_time: string;
  end_time: string | null;
  evacuation_required: boolean;
  created_at: string;
  updated_at: string;
}

export interface EmergencyMustering {
  id: string;
  emergency_session_id: string;
  person_id: string;
  person_type: 'staff' | 'visitor' | 'contractor';
  person_name: string;
  last_known_zone_id: string | null;
  muster_point_id: string | null;
  status: 'safe' | 'missing' | 'injured' | 'accounted_for';
  check_in_time: string | null;
  checked_in_by: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

// Enhanced Visitor interface with computed properties
export interface VisitorWithDetails extends Visitor {
  full_name: string;
  host_name: string;
  host: User | null;
  zone: Zone | null;
  checkInTime: string | null;
  checkOutTime: string | null;
  purpose: string | null;
}

class SupabaseService {
  private isConnected: boolean = false

  constructor() {
    this.checkConnection()
  }

  private async checkConnection() {
    try {
      const { data, error } = await supabase.from('users').select('count').single()
      if (error) {
        console.warn('Supabase connection failed:', error.message)
        this.isConnected = false
      } else {
        this.isConnected = true
        console.log('Supabase connected successfully')
      }
    } catch (error) {
      console.warn('Supabase connection check failed:', error)
      this.isConnected = false
    }
  }

  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      type: this.isConnected ? 'Supabase' : 'Disconnected'
    }
  }

  // Users
  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      return { user, error }
    } catch (error) {
      return { user: null, error: error as any }
    }
  }

  async signIn(email: string, password: string) {
    return await supabase.auth.signInWithPassword({
      email,
      password,
    })
  }

  async signOut() {
    return await supabase.auth.signOut()
  }

  async getUsers() {
    try {
      const { data, error } = await supabase
        .from('users')
        .select(`
          *,
          roles (id, name, description, permissions)
        `)
        .eq('is_active', true)
      return { data, error }
    } catch (error) {
      return { data: null, error: error as any }
    }
  }

  // Sites
  async getSites() {
    try {
      const { data, error } = await supabase.from('sites').select('*').eq('is_active', true)
      return { data, error }
    } catch (error) {
      return { data: null, error: error as any }
    }
  }

  // Zones
  async getZones(siteId?: string) {
    try {
      let query = supabase.from('zones').select('*').eq('is_active', true)
      if (siteId) {
        query = query.eq('site_id', siteId)
      }
      const { data, error } = await query
      return { data, error }
    } catch (error) {
      return { data: null, error: error as any }
    }
  }

  // Visitors
  async getVisitors(siteId?: string): Promise<VisitorWithDetails[]> {
    try {
      let query = supabase
        .from('visitors')
        .select(`
          *,
          users:host_id (
            first_name,
            last_name,
            email
          ),
          zones:zone_id (
            id,
            name,
            description
          )
        `)
        .order('created_at', { ascending: false })

      if (siteId) {
        query = query.eq('site_id', siteId)
      }

      const { data, error } = await query
      if (error) throw error

      // Transform data to match interface
      const visitorsWithDetails: VisitorWithDetails[] = (data || []).map((visitor: any) => ({
        ...visitor,
        full_name: `${visitor.first_name} ${visitor.last_name}`,
        host_name: visitor.users ? `${visitor.users.first_name} ${visitor.users.last_name}` : 'Unknown',
        checkInTime: visitor.check_in_time,
        checkOutTime: visitor.check_out_time,
        purpose: visitor.purpose_of_visit,
        host: visitor.users,
        zone: visitor.zones
      }))

      return visitorsWithDetails
    } catch (error) {
      console.error('Error fetching visitors:', error)
      return []
    }
  }

  async createVisitor(visitorData: Partial<Visitor>) {
    try {
      const { data, error } = await supabase
        .from('visitors')
        .insert([visitorData])
        .select()
        .single()
      return { data, error }
    } catch (error) {
      return { data: null, error: error as any }
    }
  }

  async updateVisitor(id: string, visitorData: Partial<Visitor>) {
    try {
      const { data, error } = await supabase
        .from('visitors')
        .update(visitorData)
        .eq('id', id)
        .select()
        .single()
      return { data, error }
    } catch (error) {
      return { data: null, error: error as any }
    }
  }

  async checkInVisitor(visitorId: string, badgeNumber: string, zoneId?: string) {
    return await this.updateVisitor(visitorId, {
      status: 'checked-in',
      check_in_time: new Date().toISOString(),
      badge_number: badgeNumber,
      zone_id: zoneId
    })
  }

  async checkOutVisitor(visitorId: string) {
    return await this.updateVisitor(visitorId, {
      status: 'checked-out',
      check_out_time: new Date().toISOString()
    })
  }

  // Staff Attendance
  async getStaffAttendance(siteId?: string) {
    try {
      let query = supabase
        .from('staff_attendance')
        .select(`
          *,
          users:user_id (
            id,
            first_name,
            last_name,
            email,
            department,
            role_id
          ),
          zones:zone_id (
            id,
            name,
            description
          )
        `)
        .order('timestamp', { ascending: false })

      if (siteId) {
        query = query.eq('site_id', siteId)
      }

      const { data, error } = await query
      return { data, error }
    } catch (error) {
      return { data: null, error: error as any }
    }
  }

  async recordStaffAttendance(userId: string, attendanceType: 'check_in' | 'check_out', zoneId?: string, notes?: string) {
    try {
      // Get the user to get their site_id
      const { data: userData } = await supabase
        .from('users')
        .select('site_id')
        .eq('id', userId)
        .single()

      const siteId = userData?.site_id

      if (!siteId) {
        return { data: null, error: new Error('User not associated with any site') }
      }

      const { data, error } = await supabase
        .from('staff_attendance')
        .insert([{
          user_id: userId,
          site_id: siteId,
          attendance_type: attendanceType,
          zone_id: zoneId,
          notes,
          timestamp: new Date().toISOString()
        }])
        .select()
        .single()

      return { data, error }
    } catch (error) {
      return { data: null, error: error as any }
    }
  }

  // Get staff currently on site
  async getStaffOnSite(siteId?: string): Promise<User[]> {
    try {
      // Get users who have checked in but not checked out
      const subquery = supabase
        .from('staff_attendance')
        .select('user_id')
        .eq('attendance_type', 'check_in')
        .not('user_id', 'in',
          supabase
            .from('staff_attendance')
            .select('user_id')
            .eq('attendance_type', 'check_out')
            .gte('timestamp', '2024-01-01') // Since the beginning of this year
        )

      let query = supabase
        .from('users')
        .select(`
          *,
          roles:role_id (
            id,
            name,
            description
          )
        `)
        .eq('is_active', true)
        .in('id', subquery)

      if (siteId) {
        query = query.in('site_id', [siteId, null]) // Include users without site_id
      }

      const { data, error } = await query.order('created_at', { ascending: false })
      return { data, error }
    } catch (error) {
      return { data: null, error: error as any }
    }
  }

  // Emergency Sessions
  async getEmergencySession(siteId?: string): Promise<EmergencySession | null> {
    try {
      let query = supabase
        .from('emergency_sessions')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)

      if (siteId) {
        query = query.eq('site_id', siteId)
      }

      const { data, error } = await query.single()
      return data ? data : null
    } catch (error) {
      console.error('Error fetching emergency session:', error)
      return null
    }
  }

  async createEmergencySession(emergencyData: Partial<EmergencySession>) {
    try {
      const { data, error } = await supabase
        .from('emergency_sessions')
        .insert([emergencyData])
        .select()
        .single()
      return { data, error }
    } catch (error) {
      return { data: null, error: error as any }
    }
  }

  async updateEmergencySession(id: string, emergencyData: Partial<EmergencySession>) {
    try {
      const { data, error } = await supabase
        .from('emergency_sessions')
        .update(emergencyData)
        .eq('id', id)
        .select()
        .single()
      return { data, error }
    } catch (error) {
      return { data: null, error: error as any }
    }
  }

  async resolveEmergencySession(id: string) {
    return await this.updateEmergencySession(id, {
      status: 'resolved',
      end_time: new Date().toISOString()
    })
  }

  // Emergency Mustering
  async getEmergencyMustering(emergencySessionId: string) {
    try {
      const { data, error } = await supabase
        .from('emergency_mustering')
        .select('*')
        .eq('emergency_session_id', emergencySessionId)
        .order('created_at', { ascending: false })
      return { data, error }
    } catch (error) {
      return { data: null, error: error as any }
    }
  }

  async updateMusteringStatus(id: string, status: string, musterPointId?: string, notes?: string) {
    try {
      const updateData: Partial<EmergencyMustering> = {
        status: status as any,
        updated_at: new Date().toISOString()
      }

      if (musterPointId) {
        updateData.muster_point_id = musterPointId
      }

      if (status === 'safe') {
        updateData.check_in_time = new Date().toISOString()
        updateData.checked_in_by = 'system' // This should be updated to actual user ID
      }

      if (notes) {
        updateData.notes = notes
      }

      const { data, error } = await supabase
        .from('emergency_mustering')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()
      return { data, error }
    } catch (error) {
      return { data: null, error: error as any }
    }
  }

  // Real-time subscriptions
  subscribeToVisitors(callback: (visitors: VisitorWithDetails[]) => void) {
    if (!this.isConnected) return { unsubscribe: () => {} }

    return supabase
      .channel('visitors_changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'visitors' },
        async () => {
          const visitors = await this.getVisitors()
          callback(visitors)
        }
      )
      .subscribe()
  }

  subscribeToEmergency(callback: (emergency: EmergencySession | null) => void) {
    if (!this.isConnected) return { unsubscribe: () => {} }

    return supabase
      .channel('emergency_changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'emergency_sessions' },
        async () => {
          const emergency = await this.getEmergencySession()
          callback(emergency)
        }
      )
      .subscribe()
  }

  subscribeToStaffAttendance(callback: (attendance: any[]) => void) {
    if (!this.isConnected) return { unsubscribe: () => {} }

    return supabase
      .channel('staff_attendance_changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'staff_attendance' },
        async () => {
          const attendance = await this.getStaffAttendance()
          callback(attendance)
        }
      )
      .subscribe()
  }

  // Analytics and Reporting
  async getSiteOccupancy(siteId: string) {
    try {
      const [visitors, staffOnSite] = await Promise.all([
        this.getVisitors(siteId),
        this.getStaffOnSite(siteId)
      ])

      const visitorsCheckedIn = visitors.filter(v => v.status === 'checked-in').length
      const totalOnSite = visitorsCheckedIn + staffOnSite.length

      return {
        totalStaff: staffOnSite.length,
        totalVisitors: visitors.length,
        visitorsCheckedIn,
        staffCheckedIn: staffOnSite.length,
        totalOnSite,
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      console.error('Error calculating site occupancy:', error)
      return {
        totalStaff: 0,
        totalVisitors: 0,
        visitorsCheckedIn: 0,
        staffCheckedIn: 0,
        totalOnSite: 0,
        timestamp: new Date().toISOString()
      }
    }
  }

  // Data Migration
  async migrateFromLocalStorage() {
    try {
      // Migrate visitors from localStorage
      const storedVisitors = localStorage.getItem('vsts_visitors')
      if (storedVisitors) {
        const visitors = JSON.parse(storedVisitors)
        const migrationPromises = visitors.map((visitor: any) => {
          // Transform localStorage data to Supabase format
          const supabaseVisitor: Partial<Visitor> = {
            first_name: visitor.fullName?.split(' ')[0] || visitor.name?.split(' ')[0] || '',
            last_name: visitor.fullName?.split(' ').slice(1).join(' ') || visitor.name?.split(' ').slice(1).join(' ') || '',
            email: visitor.email || null,
            phone: visitor.phoneNumber || visitor.phone || null,
            company: visitor.company || null,
            purpose_of_visit: visitor.purposeOfVisit || visitor.purpose || null,
            badge_number: visitor.badgeNumber || null,
            status: visitor.status || 'pre-registered',
            check_in_time: visitor.checkInTime || null,
            check_out_time: visitor.checkOutTime || null,
            notes: visitor.notes || null
          }

          return this.createVisitor(supabaseVisitor)
        })

        await Promise.allSettled(migrationPromises)
      }

      // Migrate emergency sessions
      const storedEmergency = localStorage.getItem('vsts_emergency_session')
      if (storedEmergency) {
        const emergency = JSON.parse(storedEmergency)
        if (emergency.status === 'active') {
          const supabaseEmergency: Partial<EmergencySession> = {
            title: emergency.title || 'Emergency Session',
            emergency_type: emergency.type === 'drill' ? 'drill' : 'other',
            description: emergency.description,
            start_time: emergency.startTime,
            location_description: emergency.location
          }
          await this.createEmergencySession(supabaseEmergency)
        }
      }

      // Clear localStorage after successful migration
      localStorage.removeItem('vsts_visitors')
      localStorage.removeItem('vsts_emergency_session')

      return { success: true, message: 'Data migrated successfully' }
    } catch (error) {
      console.error('Error migrating data from localStorage:', error)
      return { success: false, error: error.message }
    }
  }
}

export const supabaseService = new SupabaseService()