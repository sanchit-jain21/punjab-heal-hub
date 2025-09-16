import { useState, useEffect } from 'react';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { MedicalNavigation } from '@/components/layout/MedicalNavigation';
import { Dashboard } from '@/components/views/Dashboard';
import { VideoConsultation } from '@/components/views/VideoConsultation';
import { HealthRecords } from '@/components/views/HealthRecords';
import { MedicineAvailability } from '@/components/views/MedicineAvailability';
import { SymptomChecker } from '@/components/views/SymptomChecker';

const TelemedicineApp = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Monitor network status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Register service worker for offline functionality
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    }
  }, []);

  const renderCurrentView = () => {
    const viewProps = { isOnline, onViewChange: setCurrentView };
    
    switch (currentView) {
      case 'dashboard':
        return <Dashboard {...viewProps} />;
      case 'consultation':
        return <VideoConsultation isOnline={isOnline} />;
      case 'records':
        return <HealthRecords isOnline={isOnline} />;
      case 'medicines':
        return <MedicineAvailability isOnline={isOnline} />;
      case 'symptoms':
        return <SymptomChecker isOnline={isOnline} />;
      default:
        return <Dashboard {...viewProps} />;
    }
  };

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-background">
        {/* Navigation */}
        <MedicalNavigation 
          currentView={currentView}
          onViewChange={setCurrentView}
          isOnline={isOnline}
        />

        {/* Main Content */}
        <div className="lg:ml-72">
          <div className="pt-16 lg:pt-0">
            {renderCurrentView()}
          </div>
        </div>
      </div>
    </LanguageProvider>
  );
};

export default TelemedicineApp;