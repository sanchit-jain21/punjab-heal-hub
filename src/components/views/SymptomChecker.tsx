import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Stethoscope,
  Mic,
  MicOff,
  Brain,
  AlertTriangle,
  CheckCircle,
  Clock,
  Heart,
  Thermometer,
  Activity,
  Eye,
  Ear,
  Pill,
  Phone,
  Video,
  FileText,
  Lightbulb,
  Shield,
  RefreshCw,
  MessageCircle,
  Star,
  HelpCircle
} from 'lucide-react';

interface SymptomCheckerProps {
  isOnline: boolean;
}

interface Symptom {
  category: string;
  symptoms: string[];
}

interface Assessment {
  severity: 'low' | 'medium' | 'high' | 'emergency';
  primaryCondition: string;
  possibleCauses: string[];
  recommendations: string[];
  urgency: string;
  disclaimer: string;
  whenToSeekHelp: string[];
}

export const SymptomChecker = ({ isOnline }: SymptomCheckerProps) => {
  const { t, speak, isListening, startListening, transcript } = useLanguage();
  const [currentStep, setCurrentStep] = useState<'input' | 'assessment' | 'results'>('input');
  const [symptoms, setSymptoms] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [additionalQuestions, setAdditionalQuestions] = useState<{question: string, answered: boolean}[]>([]);

  // Common symptom categories for quick selection
  const symptomCategories: Symptom[] = [
    {
      category: 'General',
      symptoms: ['Fever', 'Headache', 'Fatigue', 'Weakness', 'Loss of appetite', 'Weight loss', 'Night sweats']
    },
    {
      category: 'Respiratory',
      symptoms: ['Cough', 'Shortness of breath', 'Chest pain', 'Sore throat', 'Runny nose', 'Sneezing']
    },
    {
      category: 'Gastrointestinal',
      symptoms: ['Nausea', 'Vomiting', 'Diarrhea', 'Constipation', 'Abdominal pain', 'Heartburn']
    },
    {
      category: 'Cardiovascular',
      symptoms: ['Chest pain', 'Palpitations', 'Dizziness', 'Fainting', 'Swelling in legs']
    },
    {
      category: 'Neurological',
      symptoms: ['Headache', 'Dizziness', 'Numbness', 'Tingling', 'Memory problems', 'Confusion']
    },
    {
      category: 'Musculoskeletal',
      symptoms: ['Joint pain', 'Muscle pain', 'Back pain', 'Stiffness', 'Swelling']
    }
  ];

  // Handle voice input
  useEffect(() => {
    if (transcript) {
      setSymptoms(prev => prev + ' ' + transcript);
    }
  }, [transcript]);

  // AI-powered symptom analysis (simulated)
  const analyzeSymptoms = async (symptomText: string, quickSymptoms: string[]) => {
    setIsAnalyzing(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Combine text and quick symptoms
    const allSymptoms = [...quickSymptoms];
    if (symptomText.trim()) {
      allSymptoms.push(symptomText);
    }

    // Simple rule-based assessment (would be replaced by actual AI in production)
    let severity: Assessment['severity'] = 'low';
    let primaryCondition = 'General discomfort';
    let possibleCauses: string[] = [];
    let recommendations: string[] = [];

    // Emergency symptoms
    const emergencySymptoms = ['chest pain', 'severe headache', 'difficulty breathing', 'severe abdominal pain', 'fainting', 'severe bleeding'];
    if (emergencySymptoms.some(emergency => 
      allSymptoms.some(symptom => symptom.toLowerCase().includes(emergency))
    )) {
      severity = 'emergency';
      primaryCondition = 'Medical Emergency';
      possibleCauses = ['Serious medical condition requiring immediate attention'];
      recommendations = [
        'Seek immediate medical attention',
        'Call emergency services (102/108)',
        'Do not delay treatment'
      ];
    }
    // High severity symptoms
    else if (['fever', 'persistent cough', 'severe pain'].some(serious => 
      allSymptoms.some(symptom => symptom.toLowerCase().includes(serious))
    )) {
      severity = 'high';
      primaryCondition = 'Possible infection or acute condition';
      possibleCauses = [
        'Viral or bacterial infection',
        'Inflammatory condition',
        'Acute illness requiring medical attention'
      ];
      recommendations = [
        'Consult a doctor within 24 hours',
        'Monitor symptoms closely',
        'Rest and stay hydrated',
        'Consider teleconsultation if available'
      ];
    }
    // Medium severity
    else if (['headache', 'nausea', 'fatigue', 'joint pain'].some(moderate => 
      allSymptoms.some(symptom => symptom.toLowerCase().includes(moderate))
    )) {
      severity = 'medium';
      primaryCondition = 'Common health concern';
      possibleCauses = [
        'Stress or lifestyle factors',
        'Minor infection',
        'Muscular strain',
        'Dietary issues'
      ];
      recommendations = [
        'Monitor symptoms for 24-48 hours',
        'Try home remedies and rest',
        'Consult doctor if symptoms worsen',
        'Stay hydrated and get adequate sleep'
      ];
    }
    // Low severity
    else {
      severity = 'low';
      primaryCondition = 'Minor health concern';
      possibleCauses = [
        'Lifestyle factors',
        'Mild stress',
        'Minor dietary issues',
        'Temporary discomfort'
      ];
      recommendations = [
        'Self-care and monitoring',
        'Adequate rest and hydration',
        'Healthy diet and exercise',
        'Consult doctor if symptoms persist beyond a week'
      ];
    }

    const newAssessment: Assessment = {
      severity,
      primaryCondition,
      possibleCauses,
      recommendations,
      urgency: severity === 'emergency' ? 'Immediate' : 
               severity === 'high' ? 'Within 24 hours' :
               severity === 'medium' ? 'Within 2-3 days' : 'Self-monitoring',
      disclaimer: 'This is an AI-powered preliminary assessment and should not replace professional medical advice.',
      whenToSeekHelp: [
        'Symptoms worsen or persist',
        'New concerning symptoms develop',
        'You feel unsure about your condition',
        'Emergency symptoms appear'
      ]
    };

    setAssessment(newAssessment);
    setIsAnalyzing(false);
    setCurrentStep('results');

    // Announce results
    speak(`Assessment complete. Severity level: ${severity}. ${primaryCondition}`);
  };

  const getSeverityColor = (severity: Assessment['severity']) => {
    switch (severity) {
      case 'low': return 'text-success';
      case 'medium': return 'text-warning';
      case 'high': return 'text-destructive';
      case 'emergency': return 'text-red-600';
      default: return 'text-muted-foreground';
    }
  };

  const getSeverityIcon = (severity: Assessment['severity']) => {
    switch (severity) {
      case 'low': return CheckCircle;
      case 'medium': return Clock;
      case 'high': return AlertTriangle;
      case 'emergency': return AlertTriangle;
      default: return HelpCircle;
    }
  };

  const getSeverityBadge = (severity: Assessment['severity']) => {
    switch (severity) {
      case 'low': return 'default';
      case 'medium': return 'secondary';
      case 'high': return 'destructive';
      case 'emergency': return 'destructive';
      default: return 'outline';
    }
  };

  // Input Step
  if (currentStep === 'input') {
    return (
      <div className="p-4 lg:p-6 space-y-6 max-w-4xl mx-auto">
        <div className="space-y-2">
          <h1 className="text-2xl lg:text-3xl font-bold">{t('describe_symptoms')}</h1>
          <p className="text-muted-foreground">
            Describe your symptoms in detail or select from common symptoms below. Our AI will provide a preliminary assessment.
          </p>
        </div>

        {/* Text Input */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Describe Your Symptoms
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Describe how you're feeling... e.g., 'I have been experiencing headache and fever since yesterday, along with body aches and fatigue.'"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              rows={4}
              className="resize-none"
            />

            <div className="flex gap-2">
              <Button
                variant={isListening ? "default" : "outline"}
                onClick={startListening}
                className="gap-2"
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                {isListening ? t('listening') : t('speak')}
              </Button>
              
              {symptoms.trim() && (
                <Button onClick={() => setSymptoms('')} variant="outline">
                  Clear
                </Button>
              )}
            </div>

            {!isOnline && (
              <div className="flex items-center gap-2 p-3 bg-warning/10 border border-warning/20 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-warning" />
                <span className="text-sm text-warning">
                  Offline mode: Basic assessment available. Full AI analysis requires internet connection.
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Symptom Selection */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Or Select Common Symptoms</h2>
          
          {symptomCategories.map((category) => (
            <Card key={category.category}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  {category.category === 'General' && <Activity className="w-4 h-4" />}
                  {category.category === 'Respiratory' && <Heart className="w-4 h-4" />}
                  {category.category === 'Gastrointestinal' && <Pill className="w-4 h-4" />}
                  {category.category === 'Cardiovascular' && <Heart className="w-4 h-4" />}
                  {category.category === 'Neurological' && <Brain className="w-4 h-4" />}
                  {category.category === 'Musculoskeletal' && <Activity className="w-4 h-4" />}
                  {category.category}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {category.symptoms.map((symptom) => (
                    <Button
                      key={symptom}
                      variant={selectedSymptoms.includes(symptom) ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        setSelectedSymptoms(prev => 
                          prev.includes(symptom) 
                            ? prev.filter(s => s !== symptom)
                            : [...prev, symptom]
                        );
                      }}
                    >
                      {symptom}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Selected Symptoms Summary */}
        {selectedSymptoms.length > 0 && (
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-primary mb-2">Selected Symptoms</h3>
                  <div className="flex flex-wrap gap-1">
                    {selectedSymptoms.map((symptom) => (
                      <Badge key={symptom} variant="outline" className="text-xs">
                        {symptom}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Analyze Button */}
        <div className="flex justify-center">
          <Button
            onClick={() => analyzeSymptoms(symptoms, selectedSymptoms)}
            disabled={!symptoms.trim() && selectedSymptoms.length === 0}
            size="lg"
            className="gap-2"
          >
            <Brain className="w-5 h-5" />
            {t('ai_assessment')}
          </Button>
        </div>

        {/* Disclaimer */}
        <Card className="bg-muted/50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
              <div className="text-sm text-muted-foreground">
                <p className="font-medium mb-1">Medical Disclaimer</p>
                <p>
                  This AI symptom checker is for informational purposes only and should not replace 
                  professional medical advice, diagnosis, or treatment. Always consult with qualified 
                  healthcare providers for medical concerns.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Analysis Step
  if (currentStep === 'assessment' || isAnalyzing) {
    return (
      <div className="p-4 lg:p-6 space-y-6 max-w-2xl mx-auto">
        <Card>
          <CardContent className="p-12 text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Brain className="w-8 h-8 text-primary animate-pulse" />
              </div>
              <h2 className="text-xl font-semibold">Analyzing Your Symptoms</h2>
              <p className="text-muted-foreground">
                Our AI is processing your information to provide a comprehensive health assessment...
              </p>
              <div className="flex items-center justify-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span className="text-sm">Processing...</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Results Step
  if (currentStep === 'results' && assessment) {
    const SeverityIcon = getSeverityIcon(assessment.severity);
    
    return (
      <div className="p-4 lg:p-6 space-y-6 max-w-4xl mx-auto">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={() => {
              setCurrentStep('input');
              setAssessment(null);
              setSymptoms('');
              setSelectedSymptoms([]);
            }}
            className="gap-2"
          >
            ← New Assessment
          </Button>
        </div>

        {/* Assessment Overview */}
        <Card className={`border-2 ${
          assessment.severity === 'emergency' ? 'border-red-500 bg-red-50' :
          assessment.severity === 'high' ? 'border-destructive bg-destructive/5' :
          assessment.severity === 'medium' ? 'border-warning bg-warning/5' :
          'border-success bg-success/5'
        }`}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                assessment.severity === 'emergency' ? 'bg-red-500' :
                assessment.severity === 'high' ? 'bg-destructive' :
                assessment.severity === 'medium' ? 'bg-warning' :
                'bg-success'
              }`}>
                <SeverityIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="flex items-center gap-2">
                  AI Health Assessment
                  <Badge variant={getSeverityBadge(assessment.severity)} className="capitalize">
                    {assessment.severity === 'low' ? t('severity_low') :
                     assessment.severity === 'medium' ? t('severity_medium') :
                     assessment.severity === 'high' ? t('severity_high') :
                     'EMERGENCY - Seek Immediate Care'}
                  </Badge>
                </CardTitle>
                <p className="text-muted-foreground">{assessment.primaryCondition}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Urgency Level</h3>
                <p className={`font-medium ${getSeverityColor(assessment.severity)}`}>
                  {assessment.urgency}
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Recommended Action</h3>
                <p className="text-muted-foreground">
                  {assessment.severity === 'emergency' ? 'Call emergency services immediately' :
                   assessment.severity === 'high' ? 'Consult doctor within 24 hours' :
                   assessment.severity === 'medium' ? 'Monitor and consult if needed' :
                   'Self-care and monitoring'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Assessment */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Possible Causes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                Possible Causes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {assessment.possibleCauses.map((cause, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <span className="text-sm">{cause}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {assessment.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{rec}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* When to Seek Help */}
        <Card className="border-warning bg-warning/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-warning">
              <AlertTriangle className="w-5 h-5" />
              When to Seek Medical Help
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {assessment.whenToSeekHelp.map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-warning mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button className="gap-2" onClick={() => speak('Booking video consultation')}>
            <Video className="w-4 h-4" />
            Book Video Consultation
          </Button>
          
          <Button variant="outline" className="gap-2">
            <FileText className="w-4 h-4" />
            Save Assessment
          </Button>
          
          {assessment.severity === 'emergency' && (
            <Button variant="destructive" className="gap-2">
              <Phone className="w-4 h-4" />
              Emergency Call
            </Button>
          )}
        </div>

        {/* Disclaimer */}
        <Card className="bg-muted/50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
              <div className="text-sm text-muted-foreground">
                <p className="font-medium mb-1">Important Medical Disclaimer</p>
                <p>{assessment.disclaimer}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
};