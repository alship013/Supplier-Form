import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/services/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../shared/components/ui/card';
import { Button } from '../../shared/components/ui/button';
import { Label } from '../../shared/components/ui/label';
import { Badge } from '../../shared/components/ui/badge';
import { ArrowLeft, Upload, FileText, Download, Trash2, AlertCircle } from 'lucide-react';

interface UploadedDocument {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadDate: string;
  category: string;
  file: File | null;
}

const DocumentsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Suppress unused variable warning
  void user;

  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [dragActive, setDragActive] = useState(false);

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

  const isImageFile = (fileName: string): boolean => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp'];
    const extension = fileName.toLowerCase().substring(fileName.lastIndexOf('.'));
    return imageExtensions.includes(extension);
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
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files);
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

  const getDocumentIcon = (fileName: string) => {
    return isImageFile(fileName) ? '🖼️' : '📄';
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
                <h1 className="text-xl font-semibold text-gray-900">Documents</h1>
                <p className="text-sm text-gray-500">Manage your supporting documents</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Upload Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Upload Documents</CardTitle>
            <CardDescription>
              Add supporting documents to complete your profile. Images: Max 10MB, Documents: Max 5MB
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Category Selection */}
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

            {/* File Upload Area */}
            {selectedCategory && (
              <div>
                <Label>Upload Files</Label>
                <div
                  className={`mt-1 border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                    dragActive ? 'border-primary-400 bg-primary-50' : 'border-gray-300'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <span className="mt-2 block text-sm font-medium text-gray-900">
                        Drop files here or click to browse
                      </span>
                      <span className="mt-1 block text-xs text-gray-500">
                        Accepted: {acceptedFileTypes[selectedCategory as keyof typeof acceptedFileTypes]?.join(', ') || 'Various formats'}
                      </span>
                      <span className="mt-1 block text-xs text-gray-500">
                        Max size: {formatFileSize(getFileSizeLimit(selectedCategory))}
                      </span>
                    </label>
                    <input
                      ref={fileInputRef}
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      multiple
                      accept={acceptedFileTypes[selectedCategory as keyof typeof acceptedFileTypes]?.join(',')}
                      onChange={(e) => handleFileUpload(e.target.files)}
                    />
                  </div>
                </div>
              </div>
            )}

            </CardContent>
        </Card>

        {/* Documents List */}
        <Card>
          <CardHeader>
            <CardTitle>Uploaded Documents</CardTitle>
            <CardDescription>
              View and manage your uploaded documents
            </CardDescription>
          </CardHeader>
          <CardContent>
            {documents.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No documents</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by uploading your first document.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl">{getDocumentIcon(doc.name)}</div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">{doc.name}</h4>
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <Badge variant="secondary">{doc.category}</Badge>
                          <span>{formatFileSize(doc.size)}</span>
                          <span>•</span>
                          <span>{new Date(doc.uploadDate).toLocaleDateString()}</span>
                        </div>
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
            )}
          </CardContent>
        </Card>

        {/* Information Section */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-blue-400 mt-0.5" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Document Information</h3>
              <div className="mt-2 text-sm text-blue-700">
                <ul className="list-disc list-inside space-y-1">
                  <li>Supported image formats: JPG, JPEG, PNG (Max 10MB)</li>
                  <li>Supported document formats: PDF, DOC, DOCX (Max 5MB)</li>
                  <li>All documents are encrypted and securely stored</li>
                  <li>You can upload multiple documents for each category</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentsPage;