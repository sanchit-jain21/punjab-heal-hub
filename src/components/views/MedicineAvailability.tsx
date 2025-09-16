import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Pill,
  Search,
  MapPin,
  Phone,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Star,
  Navigation,
  Mic,
  MicOff,
  RefreshCw,
  ShoppingCart,
  Info,
  Truck,
  Calendar
} from 'lucide-react';

interface MedicineAvailabilityProps {
  isOnline: boolean;
}

interface Medicine {
  name: string;
  brand?: string;
  composition: string;
  strength: string;
  form: string; // tablet, syrup, injection, etc.
  category: string;
}

interface PharmacyStock {
  pharmacyId: string;
  medicineId: string;
  availability: 'in_stock' | 'limited_stock' | 'out_of_stock' | 'pre_order';
  quantity?: number;
  price: number;
  lastUpdated: string;
  estimatedRestock?: string;
}

interface Pharmacy {
  id: string;
  name: string;
  address: string;
  phone: string;
  distance: number; // in km
  rating: number;
  openHours: string;
  isOpen: boolean;
  services: string[];
  verified: boolean;
}

export const MedicineAvailability = ({ isOnline }: MedicineAvailabilityProps) => {
  const { t, speak, isListening, startListening, transcript } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [stocks, setStocks] = useState<PharmacyStock[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Sample data
  const sampleMedicines: Medicine[] = [
    {
      name: 'Paracetamol',
      brand: 'Crocin',
      composition: 'Acetaminophen',
      strength: '500mg',
      form: 'Tablet',
      category: 'Analgesic'
    },
    {
      name: 'Amoxicillin',
      brand: 'Augmentin',
      composition: 'Amoxicillin + Clavulanate',
      strength: '625mg',
      form: 'Tablet',
      category: 'Antibiotic'
    },
    {
      name: 'Metformin',
      brand: 'Glucophage',
      composition: 'Metformin HCl',
      strength: '500mg',
      form: 'Tablet',
      category: 'Antidiabetic'
    },
    {
      name: 'Amlodipine',
      brand: 'Norvasc',
      composition: 'Amlodipine Besylate',
      strength: '5mg',
      form: 'Tablet',
      category: 'Antihypertensive'
    },
    {
      name: 'Omeprazole',
      brand: 'Prilosec',
      composition: 'Omeprazole',
      strength: '20mg',
      form: 'Capsule',
      category: 'PPI'
    }
  ];

  const samplePharmacies: Pharmacy[] = [
    {
      id: '1',
      name: 'Sharma Medical Store',
      address: 'Near Civil Hospital, Nabha',
      phone: '+91-9876543210',
      distance: 0.5,
      rating: 4.5,
      openHours: '8:00 AM - 10:00 PM',
      isOpen: true,
      services: ['Home Delivery', 'Online Order', 'Insurance'],
      verified: true
    },
    {
      id: '2',
      name: 'New Life Pharmacy',
      address: 'Main Market, Nabha',
      phone: '+91-9876543211',
      distance: 1.2,
      rating: 4.2,
      openHours: '9:00 AM - 9:00 PM',
      isOpen: true,
      services: ['Home Delivery', 'Generic Medicines'],
      verified: true
    },
    {
      id: '3',
      name: 'City Medical Hall',
      address: 'Bus Stand Road, Nabha',
      phone: '+91-9876543212',
      distance: 2.1,
      rating: 4.0,
      openHours: '24 Hours',
      isOpen: true,
      services: ['24x7', 'Emergency Medicines', 'Home Delivery'],
      verified: false
    },
    {
      id: '4',
      name: 'Apollo Pharmacy',
      address: 'Commercial Complex, Nabha',
      phone: '+91-9876543213',
      distance: 1.8,
      rating: 4.7,
      openHours: '8:00 AM - 11:00 PM',
      isOpen: true,
      services: ['Online Order', 'App Delivery', 'Health Checkup'],
      verified: true
    }
  ];

  // Initialize data
  useEffect(() => {
    setPharmacies(samplePharmacies);
  }, []);

  // Handle voice input for medicine search
  useEffect(() => {
    if (transcript) {
      setSearchTerm(transcript);
      handleSearch(transcript);
    }
  }, [transcript]);

  const generateStockData = (medicineId: string): PharmacyStock[] => {
    return samplePharmacies.map(pharmacy => ({
      pharmacyId: pharmacy.id,
      medicineId,
      availability: Math.random() > 0.7 ? 'out_of_stock' : 
                   Math.random() > 0.3 ? 'in_stock' : 'limited_stock',
      quantity: Math.floor(Math.random() * 50) + 1,
      price: Math.floor(Math.random() * 200) + 50,
      lastUpdated: new Date().toISOString(),
      estimatedRestock: Math.random() > 0.5 ? '2024-01-20' : undefined
    }));
  };

  const handleSearch = async (medicine: string) => {
    if (!medicine.trim()) return;

    setIsLoading(true);
    speak(`Searching for ${medicine} availability`);

    // Find medicine
    const found = sampleMedicines.find(m => 
      m.name.toLowerCase().includes(medicine.toLowerCase()) ||
      m.brand?.toLowerCase().includes(medicine.toLowerCase())
    );

    if (found) {
      setSelectedMedicine(found);
      // Generate stock data
      const stockData = generateStockData(found.name);
      setStocks(stockData);
    }

    setTimeout(() => setIsLoading(false), 1000);
  };

  const getAvailabilityColor = (availability: PharmacyStock['availability']) => {
    switch (availability) {
      case 'in_stock': return 'text-success';
      case 'limited_stock': return 'text-warning';
      case 'out_of_stock': return 'text-destructive';
      case 'pre_order': return 'text-primary';
      default: return 'text-muted-foreground';
    }
  };

  const getAvailabilityIcon = (availability: PharmacyStock['availability']) => {
    switch (availability) {
      case 'in_stock': return CheckCircle;
      case 'limited_stock': return AlertTriangle;
      case 'out_of_stock': return XCircle;
      case 'pre_order': return Calendar;
      default: return Info;
    }
  };

  const getAvailabilityText = (availability: PharmacyStock['availability']) => {
    switch (availability) {
      case 'in_stock': return t('in_stock');
      case 'limited_stock': return t('limited_stock');
      case 'out_of_stock': return t('out_of_stock');
      case 'pre_order': return 'Pre-order Available';
      default: return 'Unknown';
    }
  };

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-6xl mx-auto">
      <div className="space-y-4">
        <h1 className="text-2xl lg:text-3xl font-bold">{t('check_availability')}</h1>
        
        {/* Search Section */}
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search medicines by name or brand (e.g., Paracetamol, Crocin)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchTerm)}
                    className="pl-10"
                  />
                </div>
                <Button
                  variant={isListening ? "default" : "outline"}
                  onClick={startListening}
                  className="gap-2 px-4"
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  {isListening ? 'Listening...' : 'Voice'}
                </Button>
                <Button 
                  onClick={() => handleSearch(searchTerm)}
                  disabled={!searchTerm.trim() || isLoading}
                  className="gap-2"
                >
                  {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                  Search
                </Button>
              </div>

              {/* Quick Search Pills */}
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-muted-foreground">Quick search:</span>
                {['Paracetamol', 'Amoxicillin', 'Metformin', 'Amlodipine'].map(medicine => (
                  <Button
                    key={medicine}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchTerm(medicine);
                      handleSearch(medicine);
                    }}
                  >
                    {medicine}
                  </Button>
                ))}
              </div>

              {/* Offline Notice */}
              {!isOnline && (
                <div className="flex items-center gap-2 p-3 bg-warning/10 border border-warning/20 rounded-lg">
                  <AlertTriangle className="w-4 h-4 text-warning" />
                  <span className="text-sm text-warning">
                    Limited to cached data. Real-time availability requires internet connection.
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Medicine Details */}
        {selectedMedicine && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Pill className="w-5 h-5" />
                Medicine Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg">{selectedMedicine.name}</h3>
                    {selectedMedicine.brand && (
                      <p className="text-primary font-medium">Brand: {selectedMedicine.brand}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">Composition:</span> {selectedMedicine.composition}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">Strength:</span> {selectedMedicine.strength}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">Form:</span> {selectedMedicine.form}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Badge variant="outline" className="text-sm">
                    {selectedMedicine.category}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Pharmacy Results */}
        {selectedMedicine && stocks.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">{t('nearby_pharmacies')}</h2>
            <div className="grid gap-4">
              {stocks.map(stock => {
                const pharmacy = pharmacies.find(p => p.id === stock.pharmacyId)!;
                const AvailabilityIcon = getAvailabilityIcon(stock.availability);
                
                return (
                  <Card key={stock.pharmacyId} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                        {/* Pharmacy Info */}
                        <div className="flex-1">
                          <div className="flex items-start gap-3 mb-3">
                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                              <Pill className="w-6 h-6 text-primary" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold">{pharmacy.name}</h3>
                                {pharmacy.verified && (
                                  <Badge variant="default" className="text-xs">Verified</Badge>
                                )}
                                {pharmacy.isOpen ? (
                                  <Badge variant="default" className="text-xs bg-success text-white">Open</Badge>
                                ) : (
                                  <Badge variant="destructive" className="text-xs">Closed</Badge>
                                )}
                              </div>
                              
                              <div className="space-y-1 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  <span>{pharmacy.address} • {pharmacy.distance}km away</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  <span>{pharmacy.openHours}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Phone className="w-3 h-3" />
                                  <span>{pharmacy.phone}</span>
                                </div>
                              </div>

                              {/* Services */}
                              <div className="flex flex-wrap gap-1 mt-2">
                                {pharmacy.services.map(service => (
                                  <Badge key={service} variant="outline" className="text-xs">
                                    {service}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Availability Status */}
                        <div className="lg:w-64 space-y-3">
                          <div className={`flex items-center gap-2 ${getAvailabilityColor(stock.availability)}`}>
                            <AvailabilityIcon className="w-5 h-5" />
                            <span className="font-medium">{getAvailabilityText(stock.availability)}</span>
                          </div>

                          {stock.availability !== 'out_of_stock' && (
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Price:</span>
                                <span className="font-medium">₹{stock.price}</span>
                              </div>
                              {stock.quantity && stock.availability === 'limited_stock' && (
                                <div className="flex justify-between text-sm">
                                  <span>Available:</span>
                                  <span className="font-medium">{stock.quantity} units</span>
                                </div>
                              )}
                            </div>
                          )}

                          {stock.availability === 'out_of_stock' && stock.estimatedRestock && (
                            <div className="text-sm text-muted-foreground">
                              Expected restock: {new Date(stock.estimatedRestock).toLocaleDateString()}
                            </div>
                          )}

                          <div className="text-xs text-muted-foreground">
                            Updated: {new Date(stock.lastUpdated).toLocaleString()}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-2 lg:w-32">
                          <Button 
                            size="sm"
                            disabled={stock.availability === 'out_of_stock'}
                            className="gap-2"
                          >
                            <ShoppingCart className="w-4 h-4" />
                            {stock.availability === 'pre_order' ? 'Pre-order' : 'Order'}
                          </Button>
                          
                          <Button variant="outline" size="sm" className="gap-2">
                            <Navigation className="w-4 h-4" />
                            Direction
                          </Button>
                          
                          <Button variant="outline" size="sm" className="gap-2">
                            <Phone className="w-4 h-4" />
                            Call
                          </Button>
                        </div>
                      </div>

                      {/* Rating */}
                      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-warning fill-current" />
                          <span className="text-sm font-medium">{pharmacy.rating}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          • Delivery available • Cash/UPI accepted
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* No Results */}
        {searchTerm && selectedMedicine === null && !isLoading && (
          <Card>
            <CardContent className="p-12 text-center">
              <Pill className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Medicine Not Found</h3>
              <p className="text-muted-foreground mb-4">
                We couldn't find "{searchTerm}" in our database. Try searching with:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Generic medicine name (e.g., Paracetamol)</li>
                <li>• Brand name (e.g., Crocin)</li>
                <li>• Alternative spellings</li>
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Help Section */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-primary mb-2">How to Use Medicine Availability</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Search by medicine name or brand name</li>
                  <li>• Use voice search for hands-free operation</li>
                  <li>• Check real-time stock levels at nearby pharmacies</li>
                  <li>• Compare prices and delivery options</li>
                  <li>• Get directions and contact information</li>
                  <li>• Set up stock alerts for out-of-stock medicines</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};