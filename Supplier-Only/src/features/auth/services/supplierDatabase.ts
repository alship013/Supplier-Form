import { supabase, checkSupabaseConnection } from '../../../lib/supabase';
import type { SupplierData, SupplierCreateInput, SupplierUpdateInput, Plot } from '../../shared';

/**
 * Supplier Database Service
 * Handles all CRUD operations for supplier data using Supabase
 * Falls back to localStorage if Supabase is not available
 */

class SupplierDatabaseService {
  private isUsingLocalStorage = false;
  private readonly LOCAL_STORAGE_KEY = 'supplierData';

  constructor() {
    this.initializeConnection();
  }

  private async initializeConnection() {
    const isConnected = await checkSupabaseConnection();
    this.isUsingLocalStorage = !isConnected;

    if (this.isUsingLocalStorage) {
      console.warn('Supplier Database: Using localStorage fallback');
      this.initializeLocalStorage();
    }
  }

  private initializeLocalStorage() {
    if (!localStorage.getItem(this.LOCAL_STORAGE_KEY)) {
      localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify([]));
    }
  }

  private getLocalStorageData(): SupplierData[] {
    try {
      const data = localStorage.getItem(this.LOCAL_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return [];
    }
  }

  private setLocalStorageData(data: SupplierData[]) {
    try {
      localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  }

  private generateId(): string {
    return `supplier_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateFormId(): string {
    return `FORM-${Date.now()}`;
  }

  private generateUniqueSupplierId(): string {
    return `SUP-${Date.now().toString().slice(-8)}`;
  }

  // CREATE operations
  async createSupplier(supplierData: SupplierCreateInput): Promise<SupplierData> {
    try {
      const newSupplier: SupplierData = {
        ...supplierData,
        id: this.generateId(),
        formId: supplierData.formId || this.generateFormId(),
        uniqueSupplierId: supplierData.uniqueSupplierId || this.generateUniqueSupplierId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      if (this.isUsingLocalStorage) {
        const currentData = this.getLocalStorageData();
        const updatedData = [...currentData, newSupplier];
        this.setLocalStorageData(updatedData);
        return newSupplier;
      }

      const { data, error } = await supabase
        .from('suppliers')
        .insert(newSupplier)
        .select()
        .single();

      if (error) {
        console.error('Error creating supplier:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in createSupplier:', error);
      throw error;
    }
  }

  // READ operations
  async getAllSuppliers(): Promise<SupplierData[]> {
    try {
      if (this.isUsingLocalStorage) {
        return this.getLocalStorageData();
      }

      const { data, error } = await supabase
        .from('suppliers')
        .select('*')
        .order('createdAt', { ascending: false });

      if (error) {
        console.error('Error fetching suppliers:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getAllSuppliers:', error);
      throw error;
    }
  }

  async getSupplierById(id: string): Promise<SupplierData | null> {
    try {
      if (this.isUsingLocalStorage) {
        const data = this.getLocalStorageData();
        return data.find(supplier => supplier.id === id) || null;
      }

      const { data, error } = await supabase
        .from('suppliers')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // No rows returned
        }
        console.error('Error fetching supplier:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in getSupplierById:', error);
      throw error;
    }
  }

  async getSuppliersByStatus(status: string): Promise<SupplierData[]> {
    try {
      if (this.isUsingLocalStorage) {
        const data = this.getLocalStorageData();
        return data.filter(supplier => supplier.status === status);
      }

      const { data, error } = await supabase
        .from('suppliers')
        .select('*')
        .eq('status', status)
        .order('createdAt', { ascending: false });

      if (error) {
        console.error('Error fetching suppliers by status:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getSuppliersByStatus:', error);
      throw error;
    }
  }

  async searchSuppliers(query: string): Promise<SupplierData[]> {
    try {
      if (this.isUsingLocalStorage) {
        const data = this.getLocalStorageData();
        const lowercaseQuery = query.toLowerCase();
        return data.filter(supplier =>
          supplier.supplierName.toLowerCase().includes(lowercaseQuery) ||
          supplier.email.toLowerCase().includes(lowercaseQuery) ||
          supplier.phoneNumber.includes(query) ||
          supplier.uniqueSupplierId.toLowerCase().includes(lowercaseQuery)
        );
      }

      const { data, error } = await supabase
        .from('suppliers')
        .select('*')
        .or(`supplierName.ilike.%${query}%,email.ilike.%${query}%,phoneNumber.ilike.%${query}%,uniqueSupplierId.ilike.%${query}%`)
        .order('createdAt', { ascending: false });

      if (error) {
        console.error('Error searching suppliers:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in searchSuppliers:', error);
      throw error;
    }
  }

  // UPDATE operations
  async updateSupplier(id: string, updates: SupplierUpdateInput): Promise<SupplierData> {
    try {
      const updateData = {
        ...updates,
        updatedAt: new Date().toISOString()
      };

      if (this.isUsingLocalStorage) {
        const currentData = this.getLocalStorageData();
        const index = currentData.findIndex(supplier => supplier.id === id);

        if (index === -1) {
          throw new Error('Supplier not found');
        }

        const updatedSupplier = { ...currentData[index], ...updateData };
        currentData[index] = updatedSupplier;
        this.setLocalStorageData(currentData);
        return updatedSupplier;
      }

      const { data, error } = await supabase
        .from('suppliers')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating supplier:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in updateSupplier:', error);
      throw error;
    }
  }

  // DELETE operations
  async deleteSupplier(id: string): Promise<void> {
    try {
      if (this.isUsingLocalStorage) {
        const currentData = this.getLocalStorageData();
        const filteredData = currentData.filter(supplier => supplier.id !== id);
        this.setLocalStorageData(filteredData);
        return;
      }

      const { error } = await supabase
        .from('suppliers')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting supplier:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in deleteSupplier:', error);
      throw error;
    }
  }

  // PLOT operations
  async addPlotToSupplier(supplierId: string, plot: Omit<Plot, 'id'>): Promise<SupplierData> {
    try {
      const newPlot: Plot = {
        ...plot,
        id: `plot_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };

      const supplier = await this.getSupplierById(supplierId);
      if (!supplier) {
        throw new Error('Supplier not found');
      }

      const updatedPlots = [...(supplier.plots || []), newPlot];

      return await this.updateSupplier(supplierId, { plots: updatedPlots });
    } catch (error) {
      console.error('Error adding plot to supplier:', error);
      throw error;
    }
  }

  async updatePlot(supplierId: string, plotId: string, updates: Partial<Plot>): Promise<SupplierData> {
    try {
      const supplier = await this.getSupplierById(supplierId);
      if (!supplier) {
        throw new Error('Supplier not found');
      }

      const updatedPlots = (supplier.plots || []).map(plot =>
        plot.id === plotId ? { ...plot, ...updates } : plot
      );

      return await this.updateSupplier(supplierId, { plots: updatedPlots });
    } catch (error) {
      console.error('Error updating plot:', error);
      throw error;
    }
  }

  async removePlotFromSupplier(supplierId: string, plotId: string): Promise<SupplierData> {
    try {
      const supplier = await this.getSupplierById(supplierId);
      if (!supplier) {
        throw new Error('Supplier not found');
      }

      const updatedPlots = (supplier.plots || []).filter(plot => plot.id !== plotId);

      return await this.updateSupplier(supplierId, { plots: updatedPlots });
    } catch (error) {
      console.error('Error removing plot from supplier:', error);
      throw error;
    }
  }

  // Utility methods
  async getSupplierCount(): Promise<number> {
    try {
      if (this.isUsingLocalStorage) {
        return this.getLocalStorageData().length;
      }

      const { count, error } = await supabase
        .from('suppliers')
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.error('Error counting suppliers:', error);
        return 0;
      }

      return count || 0;
    } catch (error) {
      console.error('Error in getSupplierCount:', error);
      return 0;
    }
  }

  async getSuppliersByType(type: 'supplier' | 'farmer'): Promise<SupplierData[]> {
    try {
      if (this.isUsingLocalStorage) {
        const data = this.getLocalStorageData();
        return data.filter(supplier => supplier.type === type);
      }

      const { data, error } = await supabase
        .from('suppliers')
        .select('*')
        .eq('type', type)
        .order('createdAt', { ascending: false });

      if (error) {
        console.error('Error fetching suppliers by type:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getSuppliersByType:', error);
      throw error;
    }
  }

  // Check if service is using localStorage fallback
  isLocalStorageMode(): boolean {
    return this.isUsingLocalStorage;
  }
}

export const supplierDb = new SupplierDatabaseService();
export default supplierDb;