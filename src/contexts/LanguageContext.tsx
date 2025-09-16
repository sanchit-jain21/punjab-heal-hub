import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'hi' | 'pa';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  speak: (text: string) => void;
  isListening: boolean;
  startListening: () => void;
  stopListening: () => void;
  transcript: string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    // Navigation
    'dashboard': 'Dashboard',
    'consultation': 'Video Consultation',
    'records': 'Health Records',
    'medicines': 'Medicine Availability',
    'symptoms': 'Symptom Checker',
    'emergency': 'Emergency',
    
    // Common
    'welcome': 'Welcome to Nabha Healthcare',
    'loading': 'Loading...',
    'offline': 'Offline Mode',
    'online': 'Online',
    'save': 'Save',
    'cancel': 'Cancel',
    'submit': 'Submit',
    'search': 'Search',
    'speak': 'Speak',
    'listening': 'Listening...',
    
    // Dashboard
    'quick_access': 'Quick Access',
    'recent_activity': 'Recent Activity',
    'health_stats': 'Health Statistics',
    
    // Video Consultation
    'book_consultation': 'Book Consultation',
    'available_doctors': 'Available Doctors',
    'join_call': 'Join Video Call',
    'connection_poor': 'Poor Connection - Audio Only Mode',
    
    // Health Records
    'my_records': 'My Health Records',
    'add_record': 'Add Record',
    'medical_history': 'Medical History',
    'prescriptions': 'Prescriptions',
    'test_results': 'Test Results',
    
    // Medicine Availability
    'check_availability': 'Check Medicine Availability',
    'nearby_pharmacies': 'Nearby Pharmacies',
    'in_stock': 'In Stock',
    'out_of_stock': 'Out of Stock',
    'limited_stock': 'Limited Stock',
    
    // Symptom Checker
    'describe_symptoms': 'Describe your symptoms',
    'ai_assessment': 'AI Health Assessment',
    'severity_low': 'Low Severity',
    'severity_medium': 'Medium Severity',
    'severity_high': 'High Severity - Seek Immediate Care',
  },
  hi: {
    // Navigation
    'dashboard': 'डैशबोर्ड',
    'consultation': 'वीडियो परामर्श',
    'records': 'स्वास्थ्य रिकॉर्ड',
    'medicines': 'दवा उपलब्धता',
    'symptoms': 'लक्षण जाँच',
    'emergency': 'आपातकाल',
    
    // Common
    'welcome': 'नाभा स्वास्थ्य सेवा में आपका स्वागत है',
    'loading': 'लोड हो रहा है...',
    'offline': 'ऑफलाइन मोड',
    'online': 'ऑनलाइन',
    'save': 'सेव करें',
    'cancel': 'रद्द करें',
    'submit': 'जमा करें',
    'search': 'खोजें',
    'speak': 'बोलें',
    'listening': 'सुन रहा है...',
    
    // Dashboard
    'quick_access': 'त्वरित पहुँच',
    'recent_activity': 'हाल की गतिविधि',
    'health_stats': 'स्वास्थ्य आंकड़े',
    
    // Video Consultation
    'book_consultation': 'परामर्श बुक करें',
    'available_doctors': 'उपलब्ध डॉक्टर',
    'join_call': 'वीडियो कॉल में शामिल हों',
    'connection_poor': 'खराब कनेक्शन - केवल ऑडियो मोड',
    
    // Health Records
    'my_records': 'मेरे स्वास्थ्य रिकॉर्ड',
    'add_record': 'रिकॉर्ड जोड़ें',
    'medical_history': 'चिकित्सा इतिहास',
    'prescriptions': 'नुस्खे',
    'test_results': 'परीक्षा परिणाम',
    
    // Medicine Availability
    'check_availability': 'दवा उपलब्धता जांचें',
    'nearby_pharmacies': 'आस-पास की फार्मेसी',
    'in_stock': 'स्टॉक में',
    'out_of_stock': 'स्टॉक में नहीं',
    'limited_stock': 'सीमित स्टॉक',
    
    // Symptom Checker
    'describe_symptoms': 'अपने लक्षणों का वर्णन करें',
    'ai_assessment': 'एआई स्वास्थ्य मूल्यांकन',
    'severity_low': 'कम गंभीरता',
    'severity_medium': 'मध्यम गंभीरता',
    'severity_high': 'उच्च गंभीरता - तत्काल देखभाल लें',
  },
  pa: {
    // Navigation
    'dashboard': 'ਡੈਸ਼ਬੋਰਡ',
    'consultation': 'ਵੀਡੀਓ ਸਲਾਹ',
    'records': 'ਸਿਹਤ ਰਿਕਾਰਡ',
    'medicines': 'ਦਵਾਈ ਉਪਲਬਧਤਾ',
    'symptoms': 'ਲੱਛਣ ਜਾਂਚ',
    'emergency': 'ਐਮਰਜੈਂਸੀ',
    
    // Common
    'welcome': 'ਨਾਭਾ ਸਿਹਤ ਸੇਵਾ ਵਿੱਚ ਤੁਹਾਡਾ ਸਵਾਗਤ ਹੈ',
    'loading': 'ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...',
    'offline': 'ਔਫਲਾਈਨ ਮੋਡ',
    'online': 'ਔਨਲਾਈਨ',
    'save': 'ਸੇਵ ਕਰੋ',
    'cancel': 'ਰੱਦ ਕਰੋ',
    'submit': 'ਜਮ੍ਹਾ ਕਰੋ',
    'search': 'ਖੋਜੋ',
    'speak': 'ਬੋਲੋ',
    'listening': 'ਸੁਣ ਰਿਹਾ ਹੈ...',
    
    // Dashboard
    'quick_access': 'ਤੇਜ਼ ਪਹੁੰਚ',
    'recent_activity': 'ਹਾਲ ਦੀ ਗਤੀਵਿਧੀ',
    'health_stats': 'ਸਿਹਤ ਅੰਕੜੇ',
    
    // Video Consultation
    'book_consultation': 'ਸਲਾਹ ਬੁੱਕ ਕਰੋ',
    'available_doctors': 'ਉਪਲਬਧ ਡਾਕਟਰ',
    'join_call': 'ਵੀਡੀਓ ਕਾਲ ਵਿੱਚ ਸ਼ਾਮਲ ਹੋਵੋ',
    'connection_poor': 'ਖਰਾਬ ਕਨੈਕਸ਼ਨ - ਸਿਰਫ਼ ਆਡੀਓ ਮੋਡ',
    
    // Health Records
    'my_records': 'ਮੇਰੇ ਸਿਹਤ ਰਿਕਾਰਡ',
    'add_record': 'ਰਿਕਾਰਡ ਜੋੜੋ',
    'medical_history': 'ਮੈਡੀਕਲ ਇਤਿਹਾਸ',
    'prescriptions': 'ਨੁਸਖੇ',
    'test_results': 'ਟੈਸਟ ਨਤੀਜੇ',
    
    // Medicine Availability
    'check_availability': 'ਦਵਾਈ ਉਪਲਬਧਤਾ ਚੈੱਕ ਕਰੋ',
    'nearby_pharmacies': 'ਨੇੜਲੀਆਂ ਫਾਰਮੇਸੀਆਂ',
    'in_stock': 'ਸਟਾਕ ਵਿੱਚ',
    'out_of_stock': 'ਸਟਾਕ ਵਿੱਚ ਨਹੀਂ',
    'limited_stock': 'ਸੀਮਤ ਸਟਾਕ',
    
    // Symptom Checker
    'describe_symptoms': 'ਆਪਣੇ ਲੱਛਣਾਂ ਦਾ ਵਰਣਨ ਕਰੋ',
    'ai_assessment': 'ਏਆਈ ਸਿਹਤ ਮੁਲਾਂਕਣ',
    'severity_low': 'ਘੱਟ ਗੰਭੀਰਤਾ',
    'severity_medium': 'ਦਰਮਿਆਨੀ ਗੰਭੀਰਤਾ',
    'severity_high': 'ਉੱਚ ਗੰਭੀਰਤਾ - ਤੁਰੰਤ ਦੇਖਭਾਲ ਲਵੋ',
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Set language-specific voice settings
      switch (language) {
        case 'hi':
          utterance.lang = 'hi-IN';
          break;
        case 'pa':
          utterance.lang = 'pa-IN';
          break;
        default:
          utterance.lang = 'en-IN';
      }
      
      utterance.rate = 0.8;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    }
  };

  const startListening = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      // Set language for recognition
      switch (language) {
        case 'hi':
          recognition.lang = 'hi-IN';
          break;
        case 'pa':
          recognition.lang = 'pa-IN';
          break;
        default:
          recognition.lang = 'en-IN';
      }
      
      recognition.continuous = false;
      recognition.interimResults = true;
      
      recognition.onstart = () => {
        setIsListening(true);
      };
      
      recognition.onresult = (event) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setTranscript(finalTranscript);
        }
      };
      
      recognition.onerror = () => {
        setIsListening(false);
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognition.start();
    }
  };

  const stopListening = () => {
    setIsListening(false);
  };

  // Load saved language preference
  useEffect(() => {
    const savedLang = localStorage.getItem('nabha-language') as Language;
    if (savedLang && ['en', 'hi', 'pa'].includes(savedLang)) {
      setLanguage(savedLang);
    }
  }, []);

  // Save language preference
  useEffect(() => {
    localStorage.setItem('nabha-language', language);
  }, [language]);

  const value = {
    language,
    setLanguage,
    t,
    speak,
    isListening,
    startListening,
    stopListening,
    transcript,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Type definitions for Speech API
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}