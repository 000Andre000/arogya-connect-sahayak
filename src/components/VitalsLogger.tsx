import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  Activity, 
  Heart, 
  Droplets, 
  Thermometer,
  Weight,
  Camera,
  Mic,
  Save,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Clock
} from "lucide-react";

interface VitalReading {
  id: string;
  type: "blood_pressure" | "blood_sugar" | "heart_rate" | "temperature" | "weight" | "oxygen_saturation";
  value: string;
  unit: string;
  timestamp: Date;
  status: "normal" | "warning" | "critical";
  notes?: string;
}

interface VitalRange {
  normal: { min: number; max: number };
  warning: { min: number; max: number };
  critical: { min: number; max: number };
}

const VitalsLogger = () => {
  const { toast } = useToast();
  
  const [readings, setReadings] = useState<VitalReading[]>([
    {
      id: "1",
      type: "blood_pressure",
      value: "140/90",
      unit: "mmHg",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: "warning"
    },
    {
      id: "2",
      type: "blood_sugar", 
      value: "120",
      unit: "mg/dL",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      status: "normal"
    },
    {
      id: "3",
      type: "heart_rate",
      value: "78",
      unit: "bpm",
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      status: "normal"
    }
  ]);

  const [currentVital, setCurrentVital] = useState({
    type: "blood_pressure",
    systolic: "",
    diastolic: "",
    value: "",
    notes: ""
  });

  const vitalRanges: Record<string, VitalRange> = {
    blood_pressure_systolic: {
      normal: { min: 90, max: 120 },
      warning: { min: 121, max: 139 },
      critical: { min: 140, max: 180 }
    },
    blood_sugar: {
      normal: { min: 80, max: 140 },
      warning: { min: 141, max: 199 },
      critical: { min: 200, max: 400 }
    },
    heart_rate: {
      normal: { min: 60, max: 100 },
      warning: { min: 101, max: 120 },
      critical: { min: 121, max: 200 }
    }
  };

  const getVitalIcon = (type: string) => {
    switch (type) {
      case "blood_pressure": return <Heart className="w-5 h-5 text-red-500" />;
      case "blood_sugar": return <Droplets className="w-5 h-5 text-blue-500" />;
      case "heart_rate": return <Activity className="w-5 h-5 text-green-500" />;
      case "temperature": return <Thermometer className="w-5 h-5 text-orange-500" />;
      case "weight": return <Weight className="w-5 h-5 text-purple-500" />;
      default: return <Activity className="w-5 h-5" />;
    }
  };

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

  const evaluateReading = (type: string, value: number): "normal" | "warning" | "critical" => {
    const range = vitalRanges[type];
    if (!range) return "normal";
    
    if (value >= range.normal.min && value <= range.normal.max) return "normal";
    if (value >= range.warning.min && value <= range.warning.max) return "warning";
    return "critical";
  };

  const handleSaveReading = () => {
    let value = "";
    let status: "normal" | "warning" | "critical" = "normal";
    
    if (currentVital.type === "blood_pressure") {
      if (!currentVital.systolic || !currentVital.diastolic) {
        toast({
          title: "Incomplete Data",
          description: "Please enter both systolic and diastolic values",
          variant: "destructive"
        });
        return;
      }
      value = `${currentVital.systolic}/${currentVital.diastolic}`;
      status = evaluateReading("blood_pressure_systolic", parseInt(currentVital.systolic));
    } else {
      if (!currentVital.value) {
        toast({
          title: "Missing Value",
          description: "Please enter a value",
          variant: "destructive"
        });
        return;
      }
      value = currentVital.value;
      status = evaluateReading(currentVital.type, parseFloat(currentVital.value));
    }

    const newReading: VitalReading = {
      id: Date.now().toString(),
      type: currentVital.type as any,
      value,
      unit: getUnitForType(currentVital.type),
      timestamp: new Date(),
      status,
      notes: currentVital.notes || undefined
    };

    setReadings([newReading, ...readings]);
    setCurrentVital({
      type: "blood_pressure",
      systolic: "",
      diastolic: "",
      value: "",
      notes: ""
    });

    toast({
      title: "Reading Saved",
      description: `${getVitalName(currentVital.type)} recorded successfully`,
    });
  };

  const getUnitForType = (type: string) => {
    switch (type) {
      case "blood_pressure": return "mmHg";
      case "blood_sugar": return "mg/dL";
      case "heart_rate": return "bpm";
      case "temperature": return "°F";
      case "weight": return "kg";
      case "oxygen_saturation": return "%";
      default: return "";
    }
  };

  const getVitalName = (type: string) => {
    switch (type) {
      case "blood_pressure": return "Blood Pressure";
      case "blood_sugar": return "Blood Sugar";
      case "heart_rate": return "Heart Rate";
      case "temperature": return "Temperature";
      case "weight": return "Weight";
      case "oxygen_saturation": return "Oxygen Saturation";
      default: return type;
    }
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Track Your Vitals
        </h1>
        <p className="text-muted-foreground text-lg">
          Monitor your health with easy vital sign tracking
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Log New Reading */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Log New Reading
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="vital-type">Vital Sign Type</Label>
              <select
                id="vital-type"
                value={currentVital.type}
                onChange={(e) => setCurrentVital({ ...currentVital, type: e.target.value })}
                className="w-full mt-1 px-3 py-2 border rounded-md bg-background"
              >
                <option value="blood_pressure">Blood Pressure</option>
                <option value="blood_sugar">Blood Sugar</option>
                <option value="heart_rate">Heart Rate</option>
                <option value="temperature">Temperature</option>
                <option value="weight">Weight</option>
                <option value="oxygen_saturation">Oxygen Saturation</option>
              </select>
            </div>

            {currentVital.type === "blood_pressure" ? (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="systolic">Systolic (mmHg)</Label>
                  <Input
                    id="systolic"
                    type="number"
                    placeholder="120"
                    value={currentVital.systolic}
                    onChange={(e) => setCurrentVital({ ...currentVital, systolic: e.target.value })}
                    className="text-lg"
                  />
                </div>
                <div>
                  <Label htmlFor="diastolic">Diastolic (mmHg)</Label>
                  <Input
                    id="diastolic"
                    type="number"
                    placeholder="80"
                    value={currentVital.diastolic}
                    onChange={(e) => setCurrentVital({ ...currentVital, diastolic: e.target.value })}
                    className="text-lg"
                  />
                </div>
              </div>
            ) : (
              <div>
                <Label htmlFor="value">{getVitalName(currentVital.type)} ({getUnitForType(currentVital.type)})</Label>
                <Input
                  id="value"
                  type="number"
                  placeholder="Enter value"
                  value={currentVital.value}
                  onChange={(e) => setCurrentVital({ ...currentVital, value: e.target.value })}
                  className="text-lg"
                />
              </div>
            )}

            <div>
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Input
                id="notes"
                placeholder="Add any additional notes..."
                value={currentVital.notes}
                onChange={(e) => setCurrentVital({ ...currentVital, notes: e.target.value })}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={handleSaveReading} className="flex-1" variant="medical">
                <Save className="w-4 h-4 mr-2" />
                Save Reading
              </Button>
              <Button variant="outline" className="flex-1">
                <Camera className="w-4 h-4 mr-2" />
                Photo Scan
              </Button>
              <Button variant="outline" className="flex-1">
                <Mic className="w-4 h-4 mr-2" />
                Voice Input
              </Button>
            </div>

            {/* Quick Tips */}
            <Card className="bg-medical-blue-light border-medical-blue/20">
              <CardContent className="p-4">
                <h4 className="font-medium text-medical-blue mb-2">💡 Quick Tips</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Take readings at the same time daily</li>
                  <li>• Rest for 5 minutes before measuring BP</li>
                  <li>• Use voice input for hands-free logging</li>
                  <li>• Photo scan can read digital displays</li>
                </ul>
              </CardContent>
            </Card>
          </CardContent>
        </Card>

        {/* Recent Readings */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Recent Readings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {readings.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No readings logged yet</p>
                <p className="text-sm">Start tracking your vitals to see trends</p>
              </div>
            ) : (
              readings.slice(0, 6).map((reading) => (
                <div key={reading.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {getVitalIcon(reading.type)}
                    <div>
                      <p className="font-medium">{getVitalName(reading.type)}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        <span>{reading.timestamp.toLocaleDateString()}</span>
                        <Clock className="w-3 h-3 ml-2" />
                        <span>{reading.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-1">
                      {getStatusIcon(reading.status)}
                      <p className={`font-bold text-lg ${getStatusColor(reading.status)}`}>
                        {reading.value} {reading.unit}
                      </p>
                    </div>
                    <Badge 
                      variant={reading.status === "normal" ? "secondary" : "destructive"}
                      className="text-xs"
                    >
                      {reading.status}
                    </Badge>
                  </div>
                </div>
              ))
            )}
            
            {readings.length > 0 && (
              <Button variant="outline" className="w-full mt-4">
                View All Readings
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Health Insights */}
      {readings.length > 0 && (
        <Card className="mt-8 shadow-card">
          <CardHeader>
            <CardTitle>Health Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-health-green mb-2">85%</div>
                <p className="text-sm text-muted-foreground">Overall Health Score</p>
                <Progress value={85} className="mt-2" />
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">7</div>
                <p className="text-sm text-muted-foreground">Day Streak</p>
                <p className="text-xs text-muted-foreground mt-1">Keep it up!</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-warning mb-2">2</div>
                <p className="text-sm text-muted-foreground">Alerts This Week</p>
                <p className="text-xs text-muted-foreground mt-1">Share with doctor</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VitalsLogger;