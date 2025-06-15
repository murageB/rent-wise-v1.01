
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";

interface Property {
  id: string;
  name: string;
  address: string;
}

interface WaterSetting {
  id: string;
  property_id: string;
  unit_price: number;
  property?: Property;
}

const WaterSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [properties, setProperties] = useState<Property[]>([]);
  const [waterSettings, setWaterSettings] = useState<WaterSetting[]>([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>("");
  const [unitPrice, setUnitPrice] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProperties();
      fetchWaterSettings();
    }
  }, [user]);

  const fetchProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('id, name, address')
        .eq('user_id', user?.id);

      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  };

  const fetchWaterSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('water_settings')
        .select(`
          id,
          property_id,
          unit_price,
          properties(id, name, address)
        `)
        .eq('user_id', user?.id);

      if (error) throw error;
      setWaterSettings(data || []);
    } catch (error) {
      console.error('Error fetching water settings:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPropertyId || !unitPrice) {
      toast({
        title: "Error",
        description: "Please select a property and enter a unit price",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('water_settings')
        .upsert({
          property_id: selectedPropertyId,
          user_id: user?.id,
          unit_price: parseFloat(unitPrice),
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Water pricing updated successfully",
      });

      setSelectedPropertyId("");
      setUnitPrice("");
      fetchWaterSettings();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update water pricing",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (settingId: string) => {
    try {
      const { error } = await supabase
        .from('water_settings')
        .delete()
        .eq('id', settingId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Water setting deleted successfully",
      });

      fetchWaterSettings();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete water setting",
        variant: "destructive",
      });
    }
  };

  const availableProperties = properties.filter(
    property => !waterSettings.some(setting => setting.property_id === property.id)
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Set Water Unit Prices</CardTitle>
          <CardDescription>
            Configure the price per unit of water for each property
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="property">Property</Label>
              <Select value={selectedPropertyId} onValueChange={setSelectedPropertyId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a property" />
                </SelectTrigger>
                <SelectContent>
                  {availableProperties.map((property) => (
                    <SelectItem key={property.id} value={property.id}>
                      {property.name} - {property.address}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="unitPrice">Unit Price (KES per unit)</Label>
              <Input
                id="unitPrice"
                type="number"
                step="0.01"
                min="0"
                value={unitPrice}
                onChange={(e) => setUnitPrice(e.target.value)}
                placeholder="Enter price per unit"
              />
            </div>

            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Setting"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current Water Pricing</CardTitle>
          <CardDescription>
            Manage existing water pricing settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          {waterSettings.length === 0 ? (
            <p className="text-muted-foreground">No water pricing settings configured yet.</p>
          ) : (
            <div className="space-y-4">
              {waterSettings.map((setting) => (
                <div
                  key={setting.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <h4 className="font-medium">{setting.property?.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {setting.property?.address}
                    </p>
                    <p className="text-sm font-medium text-green-600">
                      KES {setting.unit_price} per unit
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(setting.id)}
                  >
                    Delete
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WaterSettings;
