import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  Camera,
  FileText,
  User,
  Calendar,
  Clock,
  Stethoscope,
  Phone,
  Mail,
  MapPin,
  AlertCircle,
  CheckCircle,
  Image as ImageIcon,
  Paperclip,
  Eye,
  Trash2
} from 'lucide-react';

interface UploadPrescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PrescriptionFile {
  id: string;
  file: File;
  preview: string;
  type: 'image' | 'pdf';
}

const UploadPrescriptionModal: React.FC<UploadPrescriptionModalProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedFiles, setUploadedFiles] = useState<PrescriptionFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  
  const [prescriptionInfo, setPrescriptionInfo] = useState({
    patientName: '',
    patientId: '',
    email: '',
    phone: '',
    doctorName: '',
    hospitalName: '',
    prescriptionDate: '',
    urgency: 'normal',
    notes: ''
  });

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;

    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/') || file.type === 'application/pdf') {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newFile: PrescriptionFile = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            file,
            preview: e.target?.result as string,
            type: file.type.startsWith('image/') ? 'image' : 'pdf'
          };
          setUploadedFiles(prev => [...prev, newFile]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const handleSubmit = () => {
    // Here you would typically send the prescription data to your backend
    console.log('Prescription Upload:', {
      info: prescriptionInfo,
      files: uploadedFiles
    });
    
    alert('Prescription uploaded successfully! You will receive a confirmation email shortly.');
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setCurrentStep(1);
    setUploadedFiles([]);
    setPrescriptionInfo({
      patientName: '',
      patientId: '',
      email: '',
      phone: '',
      doctorName: '',
      hospitalName: '',
      prescriptionDate: '',
      urgency: 'normal',
      notes: ''
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Upload className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Upload Prescription</h2>
              <p className="text-gray-600">Submit your prescription for verification</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {[
              { step: 1, title: 'Upload Files', icon: Upload },
              { step: 2, title: 'Patient Details', icon: User },
              { step: 3, title: 'Review & Submit', icon: CheckCircle }
            ].map((item, index) => (
              <div key={item.step} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  currentStep >= item.step 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  <item.icon className="h-5 w-5" />
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  currentStep >= item.step ? 'text-blue-600' : 'text-gray-500'
                }`}>
                  {item.title}
                </span>
                {index < 2 && (
                  <div className={`w-16 h-1 mx-4 ${
                    currentStep > item.step ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="p-6">
          {/* Step 1: Upload Files */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900">Upload Prescription Files</h3>
              
              {/* Upload Area */}
              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                  isDragging 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="space-y-4">
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                    <Upload className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">Drop files here or click to upload</h4>
                    <p className="text-gray-600">Support for images (JPG, PNG) and PDF files</p>
                  </div>
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors duration-200"
                    >
                      <Paperclip className="h-4 w-4" />
                      Choose Files
                    </button>
                    <button
                      onClick={() => cameraInputRef.current?.click()}
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors duration-200"
                    >
                      <Camera className="h-4 w-4" />
                      Take Photo
                    </button>
                  </div>
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,.pdf"
                onChange={(e) => handleFileUpload(e.target.files)}
                className="hidden"
              />
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={(e) => handleFileUpload(e.target.files)}
                className="hidden"
              />

              {/* Uploaded Files */}
              {uploadedFiles.length > 0 && (
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900">Uploaded Files ({uploadedFiles.length})</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {uploadedFiles.map((file) => (
                      <div key={file.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            {file.type === 'image' ? (
                              <ImageIcon className="h-8 w-8 text-blue-600" />
                            ) : (
                              <FileText className="h-8 w-8 text-red-600" />
                            )}
                            <div>
                              <p className="font-medium text-gray-900 truncate">{file.file.name}</p>
                              <p className="text-sm text-gray-500">{(file.file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                          </div>
                          <button
                            onClick={() => removeFile(file.id)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        {file.type === 'image' && (
                          <img
                            src={file.preview}
                            alt="Prescription preview"
                            className="w-full h-32 object-cover rounded-lg"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Patient Details */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900">Patient Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Patient Name *
                  </label>
                  <input
                    type="text"
                    value={prescriptionInfo.patientName}
                    onChange={(e) => setPrescriptionInfo({ ...prescriptionInfo, patientName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter patient name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Patient ID
                  </label>
                  <input
                    type="text"
                    value={prescriptionInfo.patientId}
                    onChange={(e) => setPrescriptionInfo({ ...prescriptionInfo, patientId: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter patient ID (if available)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={prescriptionInfo.email}
                    onChange={(e) => setPrescriptionInfo({ ...prescriptionInfo, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={prescriptionInfo.phone}
                    onChange={(e) => setPrescriptionInfo({ ...prescriptionInfo, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter phone number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Doctor Name
                  </label>
                  <input
                    type="text"
                    value={prescriptionInfo.doctorName}
                    onChange={(e) => setPrescriptionInfo({ ...prescriptionInfo, doctorName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter prescribing doctor's name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hospital/Clinic Name
                  </label>
                  <input
                    type="text"
                    value={prescriptionInfo.hospitalName}
                    onChange={(e) => setPrescriptionInfo({ ...prescriptionInfo, hospitalName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter hospital or clinic name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prescription Date
                  </label>
                  <input
                    type="date"
                    value={prescriptionInfo.prescriptionDate}
                    onChange={(e) => setPrescriptionInfo({ ...prescriptionInfo, prescriptionDate: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Urgency Level
                  </label>
                  <select
                    value={prescriptionInfo.urgency}
                    onChange={(e) => setPrescriptionInfo({ ...prescriptionInfo, urgency: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="normal">Normal</option>
                    <option value="urgent">Urgent</option>
                    <option value="emergency">Emergency</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    value={prescriptionInfo.notes}
                    onChange={(e) => setPrescriptionInfo({ ...prescriptionInfo, notes: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Any additional information or special instructions"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Review & Submit */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900">Review Your Submission</h3>
              
              <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Patient Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div><strong>Name:</strong> {prescriptionInfo.patientName}</div>
                    <div><strong>Patient ID:</strong> {prescriptionInfo.patientId || 'Not provided'}</div>
                    <div><strong>Email:</strong> {prescriptionInfo.email}</div>
                    <div><strong>Phone:</strong> {prescriptionInfo.phone}</div>
                    <div><strong>Doctor:</strong> {prescriptionInfo.doctorName || 'Not provided'}</div>
                    <div><strong>Hospital:</strong> {prescriptionInfo.hospitalName || 'Not provided'}</div>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Uploaded Files ({uploadedFiles.length})</h4>
                  <div className="space-y-2">
                    {uploadedFiles.map((file) => (
                      <div key={file.id} className="flex items-center gap-3 text-sm">
                        {file.type === 'image' ? (
                          <ImageIcon className="h-4 w-4 text-blue-600" />
                        ) : (
                          <FileText className="h-4 w-4 text-red-600" />
                        )}
                        <span>{file.file.name}</span>
                        <span className="text-gray-500">({(file.file.size / 1024 / 1024).toFixed(2)} MB)</span>
                      </div>
                    ))}
                  </div>
                </div>

                {prescriptionInfo.notes && (
                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Additional Notes</h4>
                    <p className="text-sm text-gray-700">{prescriptionInfo.notes}</p>
                  </div>
                )}
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Important Information:</p>
                    <ul className="space-y-1 text-blue-700">
                      <li>• Your prescription will be reviewed by our licensed pharmacists</li>
                      <li>• You will receive a confirmation email within 2-4 hours</li>
                      <li>• Urgent prescriptions are processed within 1 hour</li>
                      <li>• Please ensure all uploaded images are clear and readable</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200">
          <button
            onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : onClose()}
            className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200"
          >
            {currentStep === 1 ? 'Cancel' : 'Back'}
          </button>
          
          <button
            onClick={() => {
              if (currentStep === 1 && uploadedFiles.length > 0) {
                setCurrentStep(2);
              } else if (currentStep === 2 && prescriptionInfo.patientName && prescriptionInfo.email && prescriptionInfo.phone) {
                setCurrentStep(3);
              } else if (currentStep === 3) {
                handleSubmit();
              }
            }}
            disabled={
              (currentStep === 1 && uploadedFiles.length === 0) ||
              (currentStep === 2 && (!prescriptionInfo.patientName || !prescriptionInfo.email || !prescriptionInfo.phone))
            }
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors duration-200"
          >
            {currentStep === 3 ? 'Submit Prescription' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadPrescriptionModal;