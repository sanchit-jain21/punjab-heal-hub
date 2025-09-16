import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Heart,
  Video,
  FileText,
  Pill,
  Stethoscope,
  Activity,
  Users,
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Calendar,
  MapPin,
  Phone,
  Star
} from 'lucide-react';

interface DashboardProps {
  onViewChange: (view: string) => void;
  isOnline: boolean;
}

export const Dashboard = ({ onViewChange, isOnline }: DashboardProps) => {
  const { t, speak } = useLanguage();

  const quickActions = [
    {
      id: 'consultation',
      icon: Video,
      title: t('book_consultation'),
      subtitle: '5 doctors available',
      color: 'bg-primary',
      textColor: 'text-primary-foreground'
    },
    {
      id: 'symptoms',
      icon: Stethoscope,
      title: t('symptoms'),
      subtitle: 'AI-powered assessment',
      color: 'bg-secondary',
      textColor: 'text-secondary-foreground'
    },
    {
      id: 'medicines',
      icon: Pill,
      title: t('medicines'),
      subtitle: 'Check availability',
      color: 'bg-accent',
      textColor: 'text-accent-foreground'
    },
    {
      id: 'records',
      icon: FileText,
      title: t('records'),
      subtitle: 'View health history',
      color: 'bg-muted',
      textColor: 'text-muted-foreground'
    }
  ];

  const healthStats = [
    { label: 'Blood Pressure', value: '120/80', status: 'normal', icon: Activity },
    { label: 'Heart Rate', value: '72 bpm', status: 'normal', icon: Heart },
    { label: 'Last Checkup', value: '2 weeks ago', status: 'recent', icon: Calendar },
    { label: 'Medications', value: '2 active', status: 'active', icon: Pill }
  ];

  const recentActivity = [
    {
      type: 'consultation',
      title: 'Video call with Dr. Singh',
      time: '2 hours ago',
      icon: Video,
      status: 'completed'
    },
    {
      type: 'prescription',
      title: 'New prescription uploaded',
      time: '1 day ago',
      icon: FileText,
      status: 'new'
    },
    {
      type: 'medicine',
      title: 'Paracetamol - In stock at Sharma Pharmacy',
      time: '3 days ago',
      icon: Pill,
      status: 'available'
    }
  ];

  const availableDoctors = [
    {
      name: 'Dr. Rajesh Singh',
      specialty: 'General Medicine',
      rating: 4.8,
      status: 'online',
      nextSlot: '30 min'
    },
    {
      name: 'Dr. Priya Sharma',
      specialty: 'Pediatrics',
      rating: 4.9,
      status: 'online',
      nextSlot: '45 min'
    },
    {
      name: 'Dr. Amit Kumar',
      specialty: 'Cardiology',
      rating: 4.7,
      status: 'busy',
      nextSlot: '2 hours'
    }
  ];

  const handleActionClick = (actionId: string, title: string) => {
    speak(`Opening ${title}`);
    onViewChange(actionId);
  };

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Welcome Header */}
      <div className="space-y-2">
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
          {t('welcome')}
        </h1>
        <p className="text-muted-foreground">
          Rural Healthcare Access Platform for 173 Villages
        </p>
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Nabha Civil Hospital, Punjab</span>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div>
        <h2 className="text-xl font-semibold mb-4">{t('quick_access')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Card 
                key={action.id}
                className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                onClick={() => handleActionClick(action.id, action.title)}
              >
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center mb-4`}>
                    <Icon className={`w-6 h-6 ${action.textColor}`} />
                  </div>
                  <h3 className="font-semibold mb-1">{action.title}</h3>
                  <p className="text-sm text-muted-foreground">{action.subtitle}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Health Statistics */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                {t('health_stats')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {healthStats.map((stat, index) => {
                  const Icon = stat.icon;
                  const statusColor = stat.status === 'normal' || stat.status === 'recent' || stat.status === 'active' 
                    ? 'text-success' : 'text-warning';
                  
                  return (
                    <div key={index} className="p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className={`w-4 h-4 ${statusColor}`} />
                        <span className="text-sm text-muted-foreground">{stat.label}</span>
                      </div>
                      <p className="font-semibold text-lg">{stat.value}</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                {t('recent_activity')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => {
                  const Icon = activity.icon;
                  const statusIcon = activity.status === 'completed' ? CheckCircle : 
                                   activity.status === 'new' ? AlertCircle : Pill;
                  const StatusIcon = statusIcon;
                  
                  return (
                    <div key={index} className="flex items-start gap-3 p-3 hover:bg-muted/50 rounded-lg transition-colors">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium truncate">{activity.title}</p>
                          <StatusIcon className="w-4 h-4 text-success flex-shrink-0" />
                        </div>
                        <p className="text-sm text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Available Doctors */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                {t('available_doctors')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {availableDoctors.map((doctor, index) => (
                  <div key={index} className="p-3 border border-border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium">{doctor.name}</h4>
                        <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                      </div>
                      <Badge 
                        variant={doctor.status === 'online' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {doctor.status}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-warning fill-current" />
                        <span className="text-sm">{doctor.rating}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Next slot</p>
                        <p className="text-sm font-medium">{doctor.nextSlot}</p>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full mt-3" 
                      size="sm"
                      disabled={doctor.status !== 'online'}
                      onClick={() => handleActionClick('consultation', t('consultation'))}
                    >
                      <Video className="w-4 h-4 mr-2" />
                      {t('book_consultation')}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Emergency Contact */}
          <Card className="mt-6 border-destructive/20 bg-destructive/5">
            <CardContent className="p-4">
              <div className="text-center">
                <AlertCircle className="w-8 h-8 text-destructive mx-auto mb-2" />
                <h3 className="font-semibold text-destructive mb-2">{t('emergency')}</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  24/7 Emergency Services
                </p>
                <Button variant="destructive" className="w-full gap-2">
                  <Phone className="w-4 h-4" />
                  Call 102 / 108
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Network Status Banner */}
      {!isOnline && (
        <Card className="border-warning bg-warning/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-warning" />
              <div>
                <p className="font-medium text-warning">Limited Connectivity Detected</p>
                <p className="text-sm text-muted-foreground">
                  Some features may be limited. Critical health data is still accessible offline.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};