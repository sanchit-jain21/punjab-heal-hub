import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  FileText,
  Plus,
  Search,
  Download,
  Upload,
  Calendar,
  User,
  Heart,
  Pill,
  Activity,
  TestTube,
  Stethoscope,
  Eye,
  Edit,
  Trash2,
  CloudOff,
  Check,
  AlertCircle,
  Save
} from 'lucide-react';

interface HealthRecordsProps {
  isOnline: boolean;
}

interface HealthRecord {
  id: string;
  type: 'consultation' | 'prescription' | 'test' | 'vaccination' | 'vital';
  title: string;
  date: string;
  doctor: string;
  hospital: string;
  description: string;
  files?: string[];
  sync_status: 'synced' | 'pending' | 'offline';
}

export const HealthRecords = ({ isOnline }: HealthRecordsProps) => {
  const { t, speak } = useLanguage();
  const [currentView, setCurrentView] = useState<'list' | 'add' | 'view'>('list');
  const [selectedRecord, setSelectedRecord] = useState<HealthRecord | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | HealthRecord['type']>('all');
  const [records, setRecords] = useState<HealthRecord[]>([]);

  // Load records from localStorage on component mount
  useEffect(() => {
    const savedRecords = localStorage.getItem('nabha-health-records');
    if (savedRecords) {
      setRecords(JSON.parse(savedRecords));
    } else {
      // Initialize with sample data
      const sampleRecords: HealthRecord[] = [
        {
          id: '1',
          type: 'consultation',
          title: 'General Checkup',
          date: '2024-01-15',
          doctor: 'Dr. Rajesh Singh',
          hospital: 'Nabha Civil Hospital',
          description: 'Routine health checkup. Patient reported mild fatigue. Blood pressure and heart rate normal. Recommended vitamin D supplements.',
          sync_status: 'synced'
        },
        {
          id: '2',
          type: 'prescription',
          title: 'Hypertension Management',
          date: '2024-01-10',
          doctor: 'Dr. Amit Kumar',
          hospital: 'Nabha Civil Hospital',
          description: 'Amlodipine 5mg once daily, Metformin 500mg twice daily with meals',
          sync_status: 'synced'
        },
        {
          id: '3',
          type: 'test',
          title: 'Blood Test Results',
          date: '2024-01-08',
          doctor: 'Dr. Priya Sharma',
          hospital: 'Nabha Civil Hospital',
          description: 'CBC, Lipid Profile, HbA1c - All parameters within normal range except slightly elevated cholesterol',
          sync_status: 'pending'
        }
      ];
      setRecords(sampleRecords);
      localStorage.setItem('nabha-health-records', JSON.stringify(sampleRecords));
    }
  }, []);

  // Save records to localStorage whenever records change
  useEffect(() => {
    localStorage.setItem('nabha-health-records', JSON.stringify(records));
  }, [records]);

  const filteredRecords = records.filter(record => {
    const matchesSearch = record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || record.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const recordTypes = [
    { type: 'all', label: 'All Records', icon: FileText },
    { type: 'consultation', label: t('consultation'), icon: Stethoscope },
    { type: 'prescription', label: t('prescriptions'), icon: Pill },
    { type: 'test', label: t('test_results'), icon: TestTube },
    { type: 'vaccination', label: 'Vaccinations', icon: Heart },
    { type: 'vital', label: 'Vital Signs', icon: Activity },
  ];

  const getRecordIcon = (type: HealthRecord['type']) => {
    switch (type) {
      case 'consultation': return Stethoscope;
      case 'prescription': return Pill;
      case 'test': return TestTube;
      case 'vaccination': return Heart;
      case 'vital': return Activity;
      default: return FileText;
    }
  };

  const getStatusColor = (status: HealthRecord['sync_status']) => {
    switch (status) {
      case 'synced': return 'text-success';
      case 'pending': return 'text-warning';
      case 'offline': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  const addNewRecord = (recordData: Partial<HealthRecord>) => {
    const newRecord: HealthRecord = {
      id: Date.now().toString(),
      type: recordData.type || 'consultation',
      title: recordData.title || '',
      date: recordData.date || new Date().toISOString().split('T')[0],
      doctor: recordData.doctor || '',
      hospital: recordData.hospital || 'Nabha Civil Hospital',
      description: recordData.description || '',
      sync_status: isOnline ? 'pending' : 'offline'
    };

    setRecords(prev => [newRecord, ...prev]);
    speak('Health record saved successfully');
    setCurrentView('list');
  };

  // List View
  if (currentView === 'list') {
    return (
      <div className="p-4 lg:p-6 space-y-6 max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl lg:text-3xl font-bold">{t('my_records')}</h1>
          <Button onClick={() => setCurrentView('add')} className="gap-2">
            <Plus className="w-4 h-4" />
            {t('add_record')}
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search records, doctors, or conditions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {recordTypes.map((type) => {
              const Icon = type.icon;
              return (
                <Button
                  key={type.type}
                  variant={filterType === type.type ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterType(type.type as any)}
                  className="gap-2"
                >
                  <Icon className="w-4 h-4" />
                  {type.label}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Offline Status */}
        {!isOnline && (
          <Card className="border-warning bg-warning/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <CloudOff className="w-5 h-5 text-warning" />
                <div>
                  <p className="font-medium text-warning">Offline Mode</p>
                  <p className="text-sm text-muted-foreground">
                    New records will sync when connection is restored. Existing records remain accessible.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Records List */}
        <div className="space-y-4">
          {filteredRecords.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">No Records Found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || filterType !== 'all' 
                    ? 'No records match your current search or filter.'
                    : 'Start by adding your first health record.'}
                </p>
                <Button onClick={() => setCurrentView('add')} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add First Record
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredRecords.map((record) => {
              const Icon = getRecordIcon(record.type);
              return (
                <Card key={record.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold truncate">{record.title}</h3>
                            <Badge variant="outline" className="capitalize text-xs">
                              {record.type}
                            </Badge>
                          </div>
                          
                          <div className="text-sm text-muted-foreground space-y-1">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1">
                                <User className="w-3 h-3" />
                                {record.doctor}
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(record.date).toLocaleDateString()}
                              </div>
                            </div>
                            <p className="line-clamp-2">{record.description}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Sync Status */}
                        <div className={`w-2 h-2 rounded-full ${
                          record.sync_status === 'synced' ? 'bg-success' :
                          record.sync_status === 'pending' ? 'bg-warning' : 'bg-muted-foreground'
                        }`} />
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedRecord(record);
                            setCurrentView('view');
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* Sync Status Summary */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-success" />
                  <span>Synced: {records.filter(r => r.sync_status === 'synced').length}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-warning" />
                  <span>Pending: {records.filter(r => r.sync_status === 'pending').length}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-muted-foreground" />
                  <span>Offline: {records.filter(r => r.sync_status === 'offline').length}</span>
                </div>
              </div>
              
              {isOnline && records.some(r => r.sync_status === 'pending') && (
                <Button variant="outline" size="sm" className="gap-2">
                  <Upload className="w-4 h-4" />
                  Sync Pending Records
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Add Record View
  if (currentView === 'add') {
    const [formData, setFormData] = useState({
      type: 'consultation' as HealthRecord['type'],
      title: '',
      date: new Date().toISOString().split('T')[0],
      doctor: '',
      hospital: 'Nabha Civil Hospital',
      description: ''
    });

    return (
      <div className="p-4 lg:p-6 space-y-6 max-w-2xl mx-auto">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={() => setCurrentView('list')}
            className="gap-2"
          >
            ← Back to Records
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('add_record')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Record Type</label>
              <select 
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as HealthRecord['type'] }))}
                className="mt-1 w-full p-2 border border-input rounded-md bg-background"
              >
                <option value="consultation">Consultation</option>
                <option value="prescription">Prescription</option>
                <option value="test">Test Results</option>
                <option value="vaccination">Vaccination</option>
                <option value="vital">Vital Signs</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Title</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., General Checkup, Blood Test Results"
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Date</label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Doctor</label>
                <Input
                  value={formData.doctor}
                  onChange={(e) => setFormData(prev => ({ ...prev, doctor: e.target.value }))}
                  placeholder="Dr. Name"
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Hospital/Clinic</label>
              <Input
                value={formData.hospital}
                onChange={(e) => setFormData(prev => ({ ...prev, hospital: e.target.value }))}
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Detailed description of the consultation, prescription, or test results..."
                rows={4}
                className="mt-1"
              />
            </div>

            {!isOnline && (
              <div className="flex items-center gap-2 p-3 bg-warning/10 border border-warning/20 rounded-lg">
                <AlertCircle className="w-4 h-4 text-warning" />
                <span className="text-sm text-warning">Record will be saved offline and synced when connection is restored.</span>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button 
                onClick={() => addNewRecord(formData)}
                disabled={!formData.title || !formData.description}
                className="flex-1 gap-2"
              >
                <Save className="w-4 h-4" />
                Save Record
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setCurrentView('list')}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // View Record Detail
  if (currentView === 'view' && selectedRecord) {
    return (
      <div className="p-4 lg:p-6 space-y-6 max-w-3xl mx-auto">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={() => setCurrentView('list')}
            className="gap-2"
          >
            ← Back to Records
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  {React.createElement(getRecordIcon(selectedRecord.type), { 
                    className: "w-6 h-6 text-primary" 
                  })}
                </div>
                <div>
                  <CardTitle>{selectedRecord.title}</CardTitle>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {selectedRecord.doctor}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(selectedRecord.date).toLocaleDateString()}
                    </div>
                    <Badge variant="outline" className="capitalize">
                      {selectedRecord.type}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className={`flex items-center gap-1 text-sm ${getStatusColor(selectedRecord.sync_status)}`}>
                  {selectedRecord.sync_status === 'synced' && <Check className="w-4 h-4" />}
                  {selectedRecord.sync_status === 'pending' && <AlertCircle className="w-4 h-4" />}
                  {selectedRecord.sync_status === 'offline' && <CloudOff className="w-4 h-4" />}
                  {selectedRecord.sync_status}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Hospital/Clinic</h3>
              <p className="text-muted-foreground">{selectedRecord.hospital}</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Details</h3>
              <p className="whitespace-pre-wrap">{selectedRecord.description}</p>
            </div>

            <div className="flex gap-3 pt-4 border-t border-border">
              <Button variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Export PDF
              </Button>
              <Button variant="outline" className="gap-2">
                <Edit className="w-4 h-4" />
                Edit Record
              </Button>
              <Button variant="outline" className="gap-2 text-destructive">
                <Trash2 className="w-4 h-4" />
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
};