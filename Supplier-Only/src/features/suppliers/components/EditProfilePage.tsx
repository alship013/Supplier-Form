import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/services/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../shared/components/ui/card';
import { Button } from '../../shared/components/ui/button';
import { Label } from '../../shared/components/ui/label';
import { ArrowLeft, FileText, Upload, Download, Trash2 } from 'lucide-react';

interface UploadedDocument {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadDate: string;
  category: string;
  file: File | null;
}

const EditProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Suppress unused variable warning
  void user;

  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  const documentCategories = [
    'ID Document',
    'Land Certificate',
    'Proof of Ownership',
    'Tax Document',
    'Business License',
    'Other'
  ];

  const acceptedFileTypes = {
    'ID Document': ['.pdf', '.jpg', '.jpeg', '.png'],
    'Land Certificate': ['.pdf', '.jpg', '.jpeg', '.png'],
    'Proof of Ownership': ['.pdf', '.jpg', '.jpeg', '.png'],
    'Tax Document': ['.pdf'],
    'Business License': ['.pdf', '.jpg', '.jpeg', '.png'],
    'Other': ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png']
  };

  const getFileSizeLimit = (category: string): number => {
    const imageCategories = ['ID Document', 'Land Certificate', 'Proof of Ownership', 'Business License', 'Other'];
    return imageCategories.includes(category) ? 10 * 1024 * 1024 : 5 * 1024 * 1024; // 10MB for images, 5MB for documents
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateFile = (file: File, category: string): { valid: boolean; error?: string } => {
    const validTypes = acceptedFileTypes[category as keyof typeof acceptedFileTypes] || [];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();

    if (!validTypes.includes(fileExtension)) {
      return {
        valid: false,
        error: `Invalid file type. Accepted types: ${validTypes.join(', ')}`
      };
    }

    const maxSize = getFileSizeLimit(category);
    if (file.size > maxSize) {
      return {
        valid: false,
        error: `File size exceeds limit (${formatFileSize(maxSize)})`
      };
    }

    return { valid: true };
  };

  const handleFileUpload = (files: FileList | null) => {
    if (!files || !selectedCategory) {
      alert('Please select a document category first');
      return;
    }

    const newDocuments: UploadedDocument[] = [];
    let hasError = false;

    Array.from(files).forEach(file => {
      const validation = validateFile(file, selectedCategory);

      if (!validation.valid) {
        alert(`${file.name}: ${validation.error}`);
        hasError = true;
        return;
      }

      const newDoc: UploadedDocument = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: file.type || 'application/octet-stream',
        size: file.size,
        uploadDate: new Date().toISOString(),
        category: selectedCategory,
        file: file
      };

      newDocuments.push(newDoc);
    });

    if (!hasError && newDocuments.length > 0) {
      setDocuments(prev => [...prev, ...newDocuments]);
      // Reset file input
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
    }
  };

  const handleRemoveDocument = (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
  };

  const handleDownload = (doc: UploadedDocument) => {
    if (doc.file) {
      const url = URL.createObjectURL(doc.file);
      const a = document.createElement('a');
      a.href = url;
      a.download = doc.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleSave = () => {
    // Here you would typically save the documents to your backend
    // For now, we'll just show a success message
    alert('Documents updated successfully!');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/dashboard')}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-primary-600" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Edit Profile</h1>
                <p className="text-sm text-gray-500">Update your profile documents</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Profile Document Management</CardTitle>
            <CardDescription>
              Upload and manage supporting documents for your profile
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Document Upload Section */}
            <div>
              <Label htmlFor="category">Document Category</Label>
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              >
                <option value="">Select a category...</option>
                {documentCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {selectedCategory && (
              <div>
                <Label>Upload Files</Label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                      >
                        <span>Upload files</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          multiple
                          accept={acceptedFileTypes[selectedCategory as keyof typeof acceptedFileTypes]?.join(',')}
                          onChange={(e) => handleFileUpload(e.target.files)}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      {acceptedFileTypes[selectedCategory as keyof typeof acceptedFileTypes]?.join(', ') || 'Various formats'} up to {formatFileSize(getFileSizeLimit(selectedCategory))}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Documents List */}
            {documents.length > 0 && (
              <div>
                <Label>Uploaded Documents</Label>
                <div className="mt-2 space-y-3">
                  {documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">{doc.name}</h4>
                        <div className="text-xs text-gray-500">
                          {doc.category} • {formatFileSize(doc.size)} • {new Date(doc.uploadDate).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownload(doc)}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveDocument(doc.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Button
                variant="outline"
                onClick={() => navigate('/dashboard')}
              >
                Cancel
              </Button>
              <Button onClick={handleSave}>
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Information Section */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Document Guidelines</h3>
              <div className="mt-2 text-sm text-blue-700">
                <ul className="list-disc list-inside space-y-1">
                  <li>Upload clear, readable documents</li>
                  <li>Supported image formats: JPG, JPEG, PNG (Max 10MB)</li>
                  <li>Supported document formats: PDF, DOC, DOCX (Max 5MB)</li>
                  <li>Ensure all documents are valid and up-to-date</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage;