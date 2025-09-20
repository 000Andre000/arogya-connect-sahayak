import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search,
  MapPin,
  Phone,
  Video,
  MessageCircle,
  Star,
  Filter,
  Languages,
  Clock,
  Shield
} from "lucide-react";

interface HealthWorker {
  id: string;
  name: string;
  type: "ASHA" | "Doctor" | "Nurse" | "ANM" | "Specialist";
  specialization?: string;
  location: string;
  distance: number;
  rating: number;
  totalReviews: number;
  available: boolean;
  languages: string[];
  experience: string;
  nextAvailable?: string;
  consultationFee?: number;
  profileImage?: string;
}

const HealthWorkerConnect = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("all");
  const [selectedType, setSelectedType] = useState("all");

  const [healthWorkers] = useState<HealthWorker[]>([
    {
      id: "1",
      name: "Dr. Priya Sharma",
      type: "Doctor",
      specialization: "General Medicine",
      location: "Primary Health Centre, Sector 15",
      distance: 2.5,
      rating: 4.8,
      totalReviews: 245,
      available: true,
      languages: ["Hindi", "English", "Punjabi"],
      experience: "8 years",
      consultationFee: 200
    },
    {
      id: "2", 
      name: "Sunita Devi",
      type: "ASHA",
      location: "Community Health Worker, Ward 12",
      distance: 1.2,
      rating: 4.9,
      totalReviews: 189,
      available: true,
      languages: ["Hindi", "Bengali", "Bhojpuri"],
      experience: "6 years"
    },
    {
      id: "3",
      name: "Nurse Ravi Kumar", 
      type: "Nurse",
      location: "Government Hospital, Main Road",
      distance: 3.1,
      rating: 4.7,
      totalReviews: 156,
      available: false,
      nextAvailable: "2:30 PM",
      languages: ["Hindi", "English", "Tamil"],
      experience: "4 years"
    },
    {
      id: "4",
      name: "Dr. Meera Gupta",
      type: "Specialist", 
      specialization: "Cardiology",
      location: "District Hospital, Medical Complex",
      distance: 5.8,
      rating: 4.9,
      totalReviews: 89,
      available: true,
      languages: ["Hindi", "English"],
      experience: "12 years",
      consultationFee: 500
    },
    {
      id: "5",
      name: "Kavita Sharma",
      type: "ANM",
      location: "Sub Health Centre, Village Rampur",
      distance: 4.2,
      rating: 4.6,
      totalReviews: 203,
      available: true,
      languages: ["Hindi", "Haryanvi"],
      experience: "7 years"
    }
  ]);

  const filteredWorkers = healthWorkers.filter(worker => {
    const matchesSearch = worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         worker.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (worker.specialization && worker.specialization.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesLanguage = selectedLanguage === "all" || worker.languages.some(lang => 
      lang.toLowerCase() === selectedLanguage.toLowerCase()
    );
    
    const matchesType = selectedType === "all" || worker.type.toLowerCase() === selectedType.toLowerCase();
    
    return matchesSearch && matchesLanguage && matchesType;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Doctor": return "bg-medical-blue text-white";
      case "Specialist": return "bg-purple-500 text-white";
      case "ASHA": return "bg-health-green text-white";
      case "Nurse": return "bg-blue-500 text-white";
      case "ANM": return "bg-orange-500 text-white";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Connect with Health Workers
        </h1>
        <p className="text-muted-foreground text-lg">
          Find and connect with qualified health workers in your area
        </p>
      </div>

      {/* Search and Filters */}
      <Card className="mb-8 shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5 text-primary" />
            Find Health Workers
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by name, type, or specialization..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="px-3 py-2 border rounded-md bg-background"
              >
                <option value="all">All Languages</option>
                <option value="hindi">Hindi</option>
                <option value="english">English</option>
                <option value="bengali">Bengali</option>
                <option value="tamil">Tamil</option>
                <option value="punjabi">Punjabi</option>
              </select>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-2 border rounded-md bg-background"
              >
                <option value="all">All Types</option>
                <option value="doctor">Doctor</option>
                <option value="specialist">Specialist</option>
                <option value="asha">ASHA Worker</option>
                <option value="nurse">Nurse</option>
                <option value="anm">ANM</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Health Workers List */}
      <div className="space-y-6">
        {filteredWorkers.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-muted-foreground text-lg">
                No health workers found matching your criteria.
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredWorkers.map((worker) => (
            <Card key={worker.id} className="shadow-card hover:shadow-medium transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Profile Section */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center text-white text-xl font-bold">
                          {worker.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-foreground">{worker.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={getTypeColor(worker.type)}>
                              {worker.type}
                            </Badge>
                            {worker.specialization && (
                              <Badge variant="outline">
                                {worker.specialization}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className={`w-3 h-3 rounded-full ${worker.available ? "bg-health-green animate-pulse-gentle" : "bg-muted-foreground"}`}></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span>{worker.location}</span>
                        <span className="font-medium">({worker.distance} km)</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Shield className="w-4 h-4" />
                        <span>{worker.experience} experience</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{worker.rating}</span>
                        <span className="text-muted-foreground">({worker.totalReviews} reviews)</span>
                      </div>
                      {!worker.available && worker.nextAvailable && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>Next available: {worker.nextAvailable}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <Languages className="w-4 h-4 text-muted-foreground" />
                      <div className="flex gap-1 flex-wrap">
                        {worker.languages.map((lang) => (
                          <Badge key={lang} variant="outline" className="text-xs">
                            {lang}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {worker.consultationFee && (
                      <p className="text-sm text-muted-foreground">
                        Consultation Fee: <span className="font-medium text-foreground">₹{worker.consultationFee}</span>
                      </p>
                    )}
                  </div>

                  {/* Actions Section */}
                  <div className="flex flex-col gap-3 min-w-[200px]">
                    <Button 
                      className="w-full"
                      disabled={!worker.available}
                      variant="medical"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      {worker.available ? "Call Now" : "Unavailable"}
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="w-full"
                      disabled={!worker.available}
                    >
                      <Video className="w-4 h-4 mr-2" />
                      Video Call
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="w-full"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Chat
                    </Button>

                    {worker.type === "Doctor" || worker.type === "Specialist" ? (
                      <Button variant="secondary" className="w-full">
                        Book Appointment
                      </Button>
                    ) : (
                      <Button variant="health" className="w-full">
                        Request Visit
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Emergency Section */}
      <Card className="mt-8 bg-gradient-to-r from-red-50 to-orange-50 border-emergency/20 shadow-card">
        <CardContent className="p-6 text-center">
          <h3 className="text-xl font-bold text-emergency mb-2">Emergency Assistance</h3>
          <p className="text-muted-foreground mb-4">
            Need immediate medical help? Connect with emergency services right away.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="emergency" size="lg">
              <Phone className="w-5 h-5 mr-2" />
              Call Ambulance (108)
            </Button>
            <Button variant="outline" size="lg" className="border-emergency text-emergency">
              <MessageCircle className="w-5 h-5 mr-2" />
              Emergency Chat
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HealthWorkerConnect;