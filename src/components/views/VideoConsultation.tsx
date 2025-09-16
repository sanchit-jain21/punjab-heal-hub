import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  Settings,
  Users,
  Clock,
  Star,
  Search,
  Calendar,
  Wifi,
  WifiOff,
  Signal,
  Volume2,
  MessageCircle,
  Heart,
  AlertTriangle
} from 'lucide-react';

interface VideoConsultationProps {
  isOnline: boolean;
}

export const VideoConsultation = ({ isOnline }: VideoConsultationProps) => {
  const { t, speak } = useLanguage();
  const [currentView, setCurrentView] = useState<'doctors' | 'booking' | 'call'>('doctors');
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [connectionQuality, setConnectionQuality] = useState<'good' | 'poor' | 'offline'>('good');
  const [searchTerm, setSearchTerm] = useState('');

  const doctors = [
    {
      id: 1,
      name: 'Dr. Rajesh Singh',
      specialty: 'General Medicine',
      experience: '15 years',
      rating: 4.8,
      reviews: 127,
      status: 'online',
      nextSlot: '15 min',
      languages: ['English', 'Hindi', 'Punjabi'],
      image: '/api/placeholder/80/80',
      qualifications: 'MBBS, MD',
      hospital: 'Nabha Civil Hospital',
      fee: 'Free (Government)'
    },
    {
      id: 2,
      name: 'Dr. Priya Sharma',
      specialty: 'Pediatrics',
      experience: '12 years',
      rating: 4.9,
      reviews: 98,
      status: 'online',
      nextSlot: '30 min',
      languages: ['English', 'Hindi'],
      image: '/api/placeholder/80/80',
      qualifications: 'MBBS, DCH',
      hospital: 'Nabha Civil Hospital',
      fee: 'Free (Government)'
    },
    {
      id: 3,
      name: 'Dr. Amit Kumar',
      specialty: 'Cardiology',
      experience: '20 years',
      rating: 4.7,
      reviews: 156,
      status: 'busy',
      nextSlot: '2 hours',
      languages: ['English', 'Hindi', 'Punjabi'],
      image: '/api/placeholder/80/80',
      qualifications: 'MBBS, DM Cardiology',
      hospital: 'Nabha Civil Hospital',
      fee: 'Free (Government)'
    },
    {
      id: 4,
      name: 'Dr. Sunita Kaur',
      specialty: 'Gynecology',
      experience: '18 years',
      rating: 4.8,
      reviews: 89,
      status: 'offline',
      nextSlot: 'Tomorrow 9 AM',
      languages: ['English', 'Hindi', 'Punjabi'],
      image: '/api/placeholder/80/80',
      qualifications: 'MBBS, MS Gynecology',
      hospital: 'Nabha Civil Hospital',
      fee: 'Free (Government)'
    }
  ];

  const filteredDoctors = doctors.filter(doctor => 
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Simulate network quality monitoring
  useEffect(() => {
    if (!isOnline) {
      setConnectionQuality('offline');
    } else {
      const checkConnection = () => {
        const quality = Math.random() > 0.3 ? 'good' : 'poor';
        setConnectionQuality(quality);
      };
      
      const interval = setInterval(checkConnection, 5000);
      return () => clearInterval(interval);
    }
  }, [isOnline]);

  const handleBookConsultation = (doctor: any) => {
    setSelectedDoctor(doctor);
    setCurrentView('booking');
    speak(`Booking consultation with ${doctor.name}`);
  };

  const startCall = () => {
    setIsCallActive(true);
    setCurrentView('call');
    speak('Starting video consultation');
  };

  const endCall = () => {
    setIsCallActive(false);
    setCurrentView('doctors');
    speak('Call ended');
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    speak(isMuted ? 'Unmuted' : 'Muted');
  };

  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn);
    speak(isVideoOn ? 'Video off' : 'Video on');
  };

  // Doctors List View
  if (currentView === 'doctors') {
    return (
      <div className="p-4 lg:p-6 space-y-6 max-w-4xl mx-auto">
        <div className="space-y-4">
          <h1 className="text-2xl lg:text-3xl font-bold">{t('available_doctors')}</h1>
          
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search doctors by name or specialty..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Connection Quality Indicator */}
            <div className="flex items-center gap-2">
              <Badge 
                variant={connectionQuality === 'good' ? 'default' : 
                        connectionQuality === 'poor' ? 'destructive' : 'secondary'}
                className="gap-1"
              >
                {connectionQuality === 'good' && <Signal className="w-3 h-3" />}
                {connectionQuality === 'poor' && <Wifi className="w-3 h-3" />}
                {connectionQuality === 'offline' && <WifiOff className="w-3 h-3" />}
                {connectionQuality === 'good' ? 'Good Connection' :
                 connectionQuality === 'poor' ? 'Poor Connection' : 'Offline'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Doctors Grid */}
        <div className="grid gap-4">
          {filteredDoctors.map((doctor) => (
            <Card key={doctor.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Doctor Avatar */}
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                      <Heart className="w-8 h-8 text-white" />
                    </div>
                  </div>

                  {/* Doctor Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{doctor.name}</h3>
                        <p className="text-primary font-medium">{doctor.specialty}</p>
                        <p className="text-sm text-muted-foreground">
                          {doctor.qualifications} • {doctor.experience} experience
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={doctor.status === 'online' ? 'default' : 
                                  doctor.status === 'busy' ? 'destructive' : 'secondary'}
                          className="capitalize"
                        >
                          {doctor.status}
                        </Badge>
                      </div>
                    </div>

                    {/* Rating and Reviews */}
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-warning fill-current" />
                        <span className="font-medium">{doctor.rating}</span>
                        <span className="text-sm text-muted-foreground">({doctor.reviews} reviews)</span>
                      </div>
                      
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        Next slot: {doctor.nextSlot}
                      </div>
                    </div>

                    {/* Languages and Hospital */}
                    <div className="flex flex-col sm:flex-row gap-2 mb-4">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Languages: </span>
                        {doctor.languages.join(', ')}
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Hospital: </span>
                        {doctor.hospital}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button
                        onClick={() => handleBookConsultation(doctor)}
                        disabled={doctor.status === 'offline' || connectionQuality === 'offline'}
                        className="gap-2"
                      >
                        <Video className="w-4 h-4" />
                        {t('book_consultation')}
                      </Button>
                      
                      {connectionQuality === 'poor' && doctor.status === 'online' && (
                        <Button variant="outline" className="gap-2">
                          <Phone className="w-4 h-4" />
                          Audio Only Call
                        </Button>
                      )}
                    </div>

                    {/* Fee Info */}
                    <p className="text-sm text-success font-medium mt-2">
                      {doctor.fee}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Offline Message */}
        {!isOnline && (
          <Card className="border-warning bg-warning/5">
            <CardContent className="p-4 text-center">
              <WifiOff className="w-8 h-8 text-warning mx-auto mb-2" />
              <h3 className="font-semibold text-warning mb-2">No Internet Connection</h3>
              <p className="text-sm text-muted-foreground">
                Video consultations require internet connection. Please check your network and try again.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  // Booking View
  if (currentView === 'booking' && selectedDoctor) {
    return (
      <div className="p-4 lg:p-6 space-y-6 max-w-2xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={() => setCurrentView('doctors')}
          className="gap-2 mb-4"
        >
          ← Back to Doctors
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Book Consultation with {selectedDoctor.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Doctor Summary */}
            <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold">{selectedDoctor.name}</h3>
                <p className="text-primary">{selectedDoctor.specialty}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Star className="w-4 h-4 text-warning fill-current" />
                  <span className="text-sm">{selectedDoctor.rating} • {selectedDoctor.reviews} reviews</span>
                </div>
              </div>
            </div>

            {/* Patient Information Form */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Chief Complaint</label>
                <Textarea 
                  placeholder="Briefly describe your symptoms or reason for consultation..."
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Age</label>
                  <Input type="number" placeholder="25" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium">Gender</label>
                  <select className="mt-1 w-full p-2 border border-input rounded-md bg-background">
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Medical History</label>
                <Textarea 
                  placeholder="Any relevant medical conditions, allergies, or current medications..."
                  className="mt-1"
                />
              </div>
            </div>

            {/* Connection Quality Warning */}
            {connectionQuality === 'poor' && (
              <div className="flex items-center gap-3 p-3 bg-warning/10 border border-warning/20 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-warning" />
                <div>
                  <p className="font-medium text-warning">Poor Connection Detected</p>
                  <p className="text-sm text-muted-foreground">
                    We recommend using audio-only mode for better call quality.
                  </p>
                </div>
              </div>
            )}

            {/* Call Options */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={startCall} className="flex-1 gap-2">
                <Video className="w-4 h-4" />
                Start Video Call
              </Button>
              
              {connectionQuality === 'poor' && (
                <Button variant="outline" onClick={startCall} className="flex-1 gap-2">
                  <Phone className="w-4 h-4" />
                  Audio Only
                </Button>
              )}
            </div>

            <p className="text-sm text-muted-foreground text-center">
              By proceeding, you confirm the information provided is accurate and consent to the consultation.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Active Call View
  if (currentView === 'call') {
    return (
      <div className="fixed inset-0 bg-background flex flex-col">
        {/* Call Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold">{selectedDoctor?.name}</h3>
              <p className="text-sm text-muted-foreground">{selectedDoctor?.specialty}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="default" className="gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Connected
            </Badge>
          </div>
        </div>

        {/* Video Area */}
        <div className="flex-1 relative bg-muted/30">
          {isVideoOn ? (
            <div className="absolute inset-4 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Video className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Video consultation active</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Doctor will join shortly...
                </p>
              </div>
            </div>
          ) : (
            <div className="absolute inset-4 bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center">
                <VideoOff className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Audio only mode</p>
              </div>
            </div>
          )}

          {/* Connection Quality Indicator */}
          <div className="absolute top-4 right-4">
            <Badge 
              variant={connectionQuality === 'good' ? 'default' : 'destructive'}
              className="gap-1"
            >
              {connectionQuality === 'good' ? 
                <Signal className="w-3 h-3" /> : 
                <AlertTriangle className="w-3 h-3" />
              }
              {connectionQuality === 'good' ? 'Good' : 'Poor'}
            </Badge>
          </div>
        </div>

        {/* Call Controls */}
        <div className="p-6 border-t border-border">
          <div className="flex items-center justify-center gap-4">
            <Button
              variant={isMuted ? "destructive" : "outline"}
              size="lg"
              onClick={toggleMute}
              className="rounded-full w-14 h-14"
            >
              {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
            </Button>

            <Button
              variant={!isVideoOn ? "destructive" : "outline"}
              size="lg"
              onClick={toggleVideo}
              className="rounded-full w-14 h-14"
            >
              {isVideoOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="rounded-full w-14 h-14"
            >
              <MessageCircle className="w-6 h-6" />
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="rounded-full w-14 h-14"
            >
              <Volume2 className="w-6 h-6" />
            </Button>

            <Button
              variant="destructive"
              size="lg"
              onClick={endCall}
              className="rounded-full w-14 h-14"
            >
              <PhoneOff className="w-6 h-6" />
            </Button>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-4">
            Call duration: 00:05:32
          </p>
        </div>
      </div>
    );
  }

  return null;
};