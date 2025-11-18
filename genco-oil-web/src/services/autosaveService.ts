interface AutosaveData {
  formId: string;
  fieldName: string;
  value: any;
  timestamp: string;
}

interface AutosaveResponse {
  success: boolean;
  message?: string;
  data?: any;
}

class AutosaveService {
  private storageKey = 'genco_autosave_data';

  // Mock API save function - replace with actual API call
  async saveField(data: AutosaveData): Promise<AutosaveResponse> {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 300));

      // Save to localStorage as backup
      this.saveToLocalStorage(data);

      // Simulate random failures for testing (10% failure rate)
      if (Math.random() < 0.1) {
        throw new Error('Network error: Failed to save data');
      }

      console.log('Autosave successful:', data);

      return {
        success: true,
        message: 'Field saved successfully',
        data: { ...data, savedAt: new Date().toISOString() }
      };
    } catch (error) {
      console.error('Autosave failed:', error);

      // Still save to localStorage even if API fails
      this.saveToLocalStorage(data);

      return {
        success: false,
        message: error instanceof Error ? error.message : 'Save failed'
      };
    }
  }

  // Save to localStorage as backup
  private saveToLocalStorage(data: AutosaveData): void {
    try {
      const existingData = this.getStoredData();
      const updatedData = {
        ...existingData,
        [`${data.formId}_${data.fieldName}`]: {
          ...data,
          savedAt: new Date().toISOString()
        }
      };

      localStorage.setItem(this.storageKey, JSON.stringify(updatedData));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }

  // Get stored data from localStorage
  private getStoredData(): Record<string, AutosaveData> {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Failed to get stored data:', error);
      return {};
    }
  }

  // Get saved value for a specific field
  getSavedValue(formId: string, fieldName: string): any {
    const data = this.getStoredData();
    const fieldData = data[`${formId}_${fieldName}`];
    return fieldData?.value;
  }

  // Get all saved data for a form
  getFormData(formId: string): Record<string, any> {
    const data = this.getStoredData();
    const formData: Record<string, any> = {};

    Object.entries(data).forEach(([key, value]) => {
      if (key.startsWith(`${formId}_`)) {
        const fieldName = key.replace(`${formId}_`, '');
        formData[fieldName] = value.value;
      }
    });

    return formData;
  }

  // Clear saved data for a field
  clearField(formId: string, fieldName: string): void {
    const data = this.getStoredData();
    delete data[`${formId}_${fieldName}`];
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  // Clear all saved data for a form
  clearForm(formId: string): void {
    const data = this.getStoredData();
    Object.keys(data).forEach(key => {
      if (key.startsWith(`${formId}_`)) {
        delete data[key];
      }
    });
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  // Check if a form has any saved data
  hasFormData(formId: string): boolean {
    const data = this.getStoredData();
    return Object.keys(data).some(key => key.startsWith(`${formId}_`));
  }

  // Get the timestamp of the last save for a form
  getLastSaveTime(formId: string): string | null {
    const data = this.getStoredData();
    let lastSaveTime: string | null = null;

    Object.entries(data).forEach(([key, value]) => {
      if (key.startsWith(`${formId}_`)) {
        if (!lastSaveTime || value.timestamp > lastSaveTime) {
          lastSaveTime = value.timestamp;
        }
      }
    });

    return lastSaveTime;
  }
}

export const autosaveService = new AutosaveService();
export default autosaveService;