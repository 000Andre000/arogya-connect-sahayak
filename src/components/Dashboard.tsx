import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Heart, 
  Phone, 
  Calendar, 
  Activity, 
  Users, 
  MessageCircle, 
  Plus,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  LogOut
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import heroImage from "@/assets/healthcare-hero.jpg";

interface VitalReading {
  id: string;
  type: string;
  value: string;
  unit: string;
  timestamp: Date;
  status: "normal" | "warning" | "critical";
}

interface HealthWorker {
  id: string;
  name: string;
  type: "ASHA" | "Doctor" | "Nurse";
  location: string;
  rating: number;
  available: boolean;
  languages: string[];
}

const Dashboard = () => {
  const { profile, signOut } = useAuth();
  const [vitals] = useState<VitalReading[]>([
    {
      id: "1",
      type: "Blood Pressure",
      value: "140/90",
      unit: "mmHg",
      timestamp: new Date(),
      status: "warning"
    },
    {
      id: "2", 
      type: "Blood Sugar",
      value: "120",
      unit: "mg/dL",
      timestamp: new Date(),
      status: "normal"
    },
    {
      id: "3",
      type: "Heart Rate",
      value: "78",
      unit: "bpm", 
      timestamp: new Date(),
      status: "normal"
    }
  ]);

  const [healthWorkers] = useState<HealthWorker[]>([
    {
      id: "1",
      name: "Dr. Priya Sharma",
      type: "Doctor",
      location: "2.5 km away",
      rating: 4.8,
      available: true,
      languages: ["Hindi", "English"]
    },
    {
      id: "2",
      name: "Sunita Devi",
      type: "ASHA",
      location: "1.2 km away", 
      rating: 4.9,
      available: true,
      languages: ["Hindi", "Bengali"]
    },
    {
      id: "3",
      name: "Nurse Ravi Kumar",
      type: "Nurse",
      location: "3.1 km away",
      rating: 4.7,
      available: false,
      languages: ["Hindi", "English", "Tamil"]
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "normal": return "text-health-green";
      case "warning": return "text-warning";
      case "critical": return "text-emergency";
      default: return "text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "normal": return <CheckCircle className="w-4 h-4 text-health-green" />;
      case "warning": return <AlertTriangle className="w-4 h-4 text-warning" />;
      case "critical": return <AlertTriangle className="w-4 h-4 text-emergency" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-primary">Aarogya Sahayak</h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium">{profile?.full_name || 'User'}</p>
                <Badge variant="outline" className="text-xs">
                  {profile?.role?.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>
              <Button variant="ghost" size="sm" onClick={signOut}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative bg-gradient-hero text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-6 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Aarogya Sahayak
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90">
                आपका स्वास्थ्य, हमारी प्राथमिकता
              </p>
              <p className="text-lg mb-8 opacity-80">
                Connect with local health workers, track vitals, and take control of your health journey
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-white text-primary hover:bg-white/90 shadow-button"
                  onClick={() => window.location.href = '/health-workers'}
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Connect with Health Worker
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white hover:bg-white/10"
                  onClick={() => window.location.href = '/vitals'}
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Log Vitals
                </Button>
              </div>
            </div>
            <div className="hidden lg:block animate-slide-up">
              <img 
                src={heroImage} 
                alt="Healthcare workers helping patients"
                className="rounded-2xl shadow-medium w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard */}
      <div className="container mx-auto px-6 py-12">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="bg-gradient-card shadow-card border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Health Score</p>
                  <p className="text-3xl font-bold text-health-green">85%</p>
                </div>
                <Heart className="w-8 h-8 text-health-green" />
              </div>
              <Progress value={85} className="mt-4" />
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-card border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Workers</p>
                  <p className="text-3xl font-bold text-primary">12</p>
                </div>
                <Users className="w-8 h-8 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground mt-2">Available nearby</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-card border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Vitals Tracked</p>
                  <p className="text-3xl font-bold text-medical-blue">45</p>
                </div>
                <Activity className="w-8 h-8 text-medical-blue" />
              </div>
              <p className="text-sm text-muted-foreground mt-2">This week</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-card border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Appointments</p>
                  <p className="text-3xl font-bold text-warning">3</p>
                </div>
                <Calendar className="w-8 h-8 text-warning" />
              </div>
              <p className="text-sm text-muted-foreground mt-2">Upcoming</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Vitals */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Recent Vitals
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {vitals.map((vital) => (
                <div key={vital.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(vital.status)}
                    <div>
                      <p className="font-medium">{vital.type}</p>
                      <p className="text-sm text-muted-foreground">
                        {vital.timestamp.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold text-lg ${getStatusColor(vital.status)}`}>
                      {vital.value} {vital.unit}
                    </p>
                    <Badge 
                      variant={vital.status === "normal" ? "secondary" : "destructive"}
                      className="text-xs"
                    >
                      {vital.status}
                    </Badge>
                  </div>
                </div>
              ))}
              <Button 
                className="w-full mt-4" 
                variant="outline"
                onClick={() => window.location.href = '/vitals'}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New Reading
              </Button>
            </CardContent>
          </Card>

          {/* Available Health Workers */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Available Health Workers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {healthWorkers.map((worker) => (
                <div key={worker.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${worker.available ? "bg-health-green animate-pulse-gentle" : "bg-muted-foreground"}`}></div>
                    <div>
                      <p className="font-medium">{worker.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {worker.type} • {worker.location}
                      </p>
                      <div className="flex gap-1 mt-1">
                        {worker.languages.slice(0, 2).map((lang) => (
                          <Badge key={lang} variant="outline" className="text-xs">
                            {lang}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-medium">★ {worker.rating}</span>
                    </div>
                    <Button 
                      size="sm" 
                      disabled={!worker.available}
                      className="shadow-button"
                    >
                      <Phone className="w-3 h-3 mr-1" />
                      {worker.available ? "Connect" : "Busy"}
                    </Button>
                  </div>
                </div>
              ))}
              <Button 
                className="w-full mt-4" 
                variant="outline"
                onClick={() => window.location.href = '/health-workers'}
              >
                View All Workers
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mt-8 shadow-card">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button 
                className="h-20 flex flex-col gap-2 bg-gradient-primary shadow-button"
                onClick={() => window.location.href = '/health-workers'}
              >
                <MessageCircle className="w-6 h-6" />
                <span className="text-sm">Chat with ASHA</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col gap-2">
                <Calendar className="w-6 h-6" />
                <span className="text-sm">Book Appointment</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col gap-2"
                onClick={() => window.location.href = '/vitals'}
              >
                <Activity className="w-6 h-6" />
                <span className="text-sm">Record Vitals</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col gap-2 bg-gradient-health text-white border-0">
                <AlertTriangle className="w-6 h-6" />
                <span className="text-sm">Emergency</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;