
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { format } from "date-fns";

interface Tenant {
  id: string;
  name: string;
  email: string;
  property_id: string;
  properties: {
    name: string;
  };
}

interface WaterReading {
  id: string;
  tenant_id: string;
  previous_reading: number;
  current_reading: number;
  units_consumed: number;
  reading_date: string;
  tenants: {
    name: string;
  };
  properties: {
    name: string;
  };
}

const CaretakerWaterTab = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [waterReadings, setWaterReadings] = useState<WaterReading[]>([]);
  const [selectedTenant, setSelectedTenant] = useState<string>("");
  const [currentReading, setCurrentReading] = useState<string>("");
  const [readingDate, setReadingDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<string>("all");
  const [properties, setProperties] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      fetchProperties();
      fetchTenants();
      fetchWaterReadings();
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchTenants();
    }
  }, [selectedProperty, user]);

  const fetchProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('id, name');

      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  };

  const fetchTenants = async () => {
    try {
      let query = supabase
        .from('tenants')
        .select(`
          id,
          name,
          email,
          property_id,
          properties(name)
        `)
        .eq('status', 'active');

      if (selectedProperty !== "all") {
        query = query.eq('property_id', selectedProperty);
      }

      const { data, error } = await query;

      if (error) throw error;
      setTenants(data || []);
    } catch (error) {
      console.error('Error fetching tenants:', error);
    }
  };

  const fetchWaterReadings = async () => {
    try {
      const { data, error } = await supabase
        .from('water_readings')
        .select(`
          id,
          tenant_id,
          previous_reading,
          current_reading,
          units_consumed,
          reading_date,
          tenants(name),
          properties(name)
        `)
        .order('reading_date', { ascending: false })
        .limit(50);

      if (error) throw error;
      setWaterReadings(data || []);
    } catch (error) {
      console.error('Error fetching water readings:', error);
    }
  };

  const getLastReading = async (tenantId: string) => {
    try {
      const { data, error } = await supabase
        .from('water_readings')
        .select('current_reading')
        .eq('tenant_id', tenantId)
        .order('reading_date', { ascending: false })
        .limit(1);

      if (error) throw error;
      return data?.[0]?.current_reading || 0;
    } catch (error) {
      console.error('Error fetching last reading:', error);
      return 0;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTenant || !currentReading) {
      toast({
        title: "Error",
        description: "Please select a tenant and enter the current reading",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const previousReading = await getLastReading(selectedTenant);
      const currentReadingNum = parseFloat(currentReading);

      if (currentReadingNum < previousReading) {
        toast({
          title: "Error",
          description: "Current reading cannot be less than previous reading",
          variant: "destructive",
        });
        return;
      }

      // Find the tenant to get property_id
      const tenant = tenants.find(t => t.id === selectedTenant);
      if (!tenant) {
        toast({
          title: "Error",
          description: "Selected tenant not found",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('water_readings')
        .insert({
          tenant_id: selectedTenant,
          property_id: tenant.property_id,
          user_id: user?.id,
          previous_reading: previousReading,
          current_reading: currentReadingNum,
          reading_date: readingDate,
        });

      if (error) throw error;

      // Now generate a water bill
      await generateWaterBill(selectedTenant, tenant.property_id, currentReadingNum - previousReading);

      toast({
        title: "Success",
        description: "Water reading recorded and bill generated successfully",
      });

      setSelectedTenant("");
      setCurrentReading("");
      setReadingDate(new Date().toISOString().split('T')[0]);
      fetchWaterReadings();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to record water reading",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateWaterBill = async (tenantId: string, propertyId: string, unitsConsumed: number) => {
    try {
      // Get the water setting for this property
      const { data: waterSetting, error: settingError } = await supabase
        .from('water_settings')
        .select('unit_price')
        .eq('property_id', propertyId)
        .single();

      if (settingError || !waterSetting) {
        console.warn('No water pricing set for this property');
        return;
      }

      const totalAmount = unitsConsumed * waterSetting.unit_price;
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 30); // 30 days from now

      // Get the reading ID for reference
      const { data: readingData, error: readingError } = await supabase
        .from('water_readings')
        .select('id')
        .eq('tenant_id', tenantId)
        .order('reading_date', { ascending: false })
        .limit(1);

      if (readingError || !readingData?.[0]) {
        console.error('Could not find reading for bill generation');
        return;
      }

      const { error: billError } = await supabase
        .from('water_bills')
        .insert({
          tenant_id: tenantId,
          property_id: propertyId,
          reading_id: readingData[0].id,
          user_id: user?.id,
          units_consumed: unitsConsumed,
          unit_price: waterSetting.unit_price,
          total_amount: totalAmount,
          due_date: dueDate.toISOString().split('T')[0],
        });

      if (billError) throw billError;
    } catch (error) {
      console.error('Error generating water bill:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Water Meter Readings</h2>
        <p className="text-muted-foreground">Record water meter readings for tenants</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Record New Reading</CardTitle>
          <CardDescription>
            Enter the current water meter reading for a tenant
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Label htmlFor="property-filter">Filter by Property</Label>
            <Select value={selectedProperty} onValueChange={setSelectedProperty}>
              <SelectTrigger>
                <SelectValue placeholder="All properties" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Properties</SelectItem>
                {properties.map((property) => (
                  <SelectItem key={property.id} value={property.id}>
                    {property.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tenant">Tenant</Label>
              <Select value={selectedTenant} onValueChange={setSelectedTenant}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a tenant" />
                </SelectTrigger>
                <SelectContent>
                  {tenants.map((tenant) => (
                    <SelectItem key={tenant.id} value={tenant.id}>
                      {tenant.name} - {tenant.properties?.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentReading">Current Reading</Label>
              <Input
                id="currentReading"
                type="number"
                step="0.01"
                min="0"
                value={currentReading}
                onChange={(e) => setCurrentReading(e.target.value)}
                placeholder="Enter current meter reading"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="readingDate">Reading Date</Label>
              <Input
                id="readingDate"
                type="date"
                value={readingDate}
                onChange={(e) => setReadingDate(e.target.value)}
              />
            </div>

            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Recording..." : "Record Reading"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Water Readings</CardTitle>
          <CardDescription>
            History of water meter readings
          </CardDescription>
        </CardHeader>
        <CardContent>
          {waterReadings.length === 0 ? (
            <p className="text-muted-foreground">No water readings recorded yet.</p>
          ) : (
            <div className="space-y-4">
              {waterReadings.map((reading) => (
                <div
                  key={reading.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <h4 className="font-medium">{reading.tenants?.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {reading.properties?.name}
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2 text-sm">
                      <div>
                        <p className="text-muted-foreground">Previous</p>
                        <p className="font-medium">{reading.previous_reading}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Current</p>
                        <p className="font-medium">{reading.current_reading}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Consumed</p>
                        <p className="font-medium">{reading.units_consumed} units</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Date</p>
                        <p className="font-medium">
                          {format(new Date(reading.reading_date), "MMM dd, yyyy")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CaretakerWaterTab;
