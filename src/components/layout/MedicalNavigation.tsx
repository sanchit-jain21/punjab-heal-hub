import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Heart, 
  Video, 
  FileText, 
  Pill, 
  Stethoscope,
  Phone,
  Wifi,
  WifiOff,
  Mic,
  MicOff,
  Globe,
  Menu,
  X
} from 'lucide-react';

interface NavigationProps {
  currentView: string;
  onViewChange: (view: string) => void;
  isOnline: boolean;
}

export const MedicalNavigation = ({ currentView, onViewChange, isOnline }: NavigationProps) => {
  const { t, language, setLanguage, speak, isListening, startListening } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigationItems = [
    { id: 'dashboard', icon: Heart, label: t('dashboard') },
    { id: 'consultation', icon: Video, label: t('consultation') },
    { id: 'records', icon: FileText, label: t('records') },
    { id: 'medicines', icon: Pill, label: t('medicines') },
    { id: 'symptoms', icon: Stethoscope, label: t('symptoms') },
  ];

  const languages = [
    { code: 'en', label: 'English', flag: '🇮🇳' },
    { code: 'hi', label: 'हिंदी', flag: '🇮🇳' },
    { code: 'pa', label: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
  ];

  const handleVoiceCommand = () => {
    if (isListening) {
      return;
    }
    
    speak(t('listening'));
    startListening();
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-card border-b border-border">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-primary" />
            <span className="font-semibold text-foreground">Nabha Health</span>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Connection Status */}
            <Badge variant={isOnline ? "default" : "destructive"} className="gap-1">
              {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
              {t(isOnline ? 'online' : 'offline')}
            </Badge>
            
            {/* Voice Input */}
            <Button
              variant={isListening ? "default" : "outline"}
              size="sm"
              onClick={handleVoiceCommand}
              className="gap-1"
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </Button>
            
            {/* Menu Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-background/80 backdrop-blur-sm">
          <Card className="fixed top-16 right-4 left-4 p-4 max-h-[calc(100vh-6rem)] overflow-y-auto">
            {/* Language Selector */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Language / भाषा / ਭਾਸ਼ਾ
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {languages.map((lang) => (
                  <Button
                    key={lang.code}
                    variant={language === lang.code ? "default" : "outline"}
                    size="sm"
                    onClick={() => setLanguage(lang.code as any)}
                    className="h-auto p-2 flex-col gap-1"
                  >
                    <span className="text-lg">{lang.flag}</span>
                    <span className="text-xs">{lang.label}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={currentView === item.id ? "default" : "ghost"}
                    className="w-full justify-start gap-3 h-12"
                    onClick={() => {
                      onViewChange(item.id);
                      setIsMenuOpen(false);
                    }}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </Button>
                );
              })}
            </div>

            {/* Emergency Button */}
            <Button 
              variant="destructive" 
              className="w-full mt-6 gap-2"
              onClick={() => {
                speak('Emergency services activated');
                // Emergency action would go here
              }}
            >
              <Phone className="w-4 h-4" />
              {t('emergency')}
            </Button>
          </Card>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:z-50 lg:w-72">
        <Card className="flex flex-col flex-grow h-full border-r border-border rounded-none">
          {/* Header */}
          <div className="flex items-center gap-3 p-6 border-b border-border">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg">Nabha Health</h1>
              <p className="text-sm text-muted-foreground">Rural Healthcare</p>
            </div>
          </div>

          {/* Status Bar */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between mb-3">
              <Badge variant={isOnline ? "default" : "destructive"} className="gap-1">
                {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                {t(isOnline ? 'online' : 'offline')}
              </Badge>
              <Button
                variant={isListening ? "default" : "outline"}
                size="sm"
                onClick={handleVoiceCommand}
                className="gap-1"
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                {t('speak')}
              </Button>
            </div>
            
            {/* Language Selector */}
            <div className="grid grid-cols-3 gap-1">
              {languages.map((lang) => (
                <Button
                  key={lang.code}
                  variant={language === lang.code ? "default" : "outline"}
                  size="sm"
                  onClick={() => setLanguage(lang.code as any)}
                  className="h-auto p-1 flex-col"
                >
                  <span className="text-sm">{lang.flag}</span>
                  <span className="text-xs">{lang.label}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={currentView === item.id ? "default" : "ghost"}
                  className="w-full justify-start gap-3 h-12"
                  onClick={() => onViewChange(item.id)}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Button>
              );
            })}
          </nav>

          {/* Emergency Button */}
          <div className="p-4 border-t border-border">
            <Button 
              variant="destructive" 
              className="w-full gap-2"
              onClick={() => {
                speak('Emergency services activated');
                // Emergency action would go here
              }}
            >
              <Phone className="w-4 h-4" />
              {t('emergency')}
            </Button>
          </div>
        </Card>
      </div>
    </>
  );
};