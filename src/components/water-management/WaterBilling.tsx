
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { format } from "date-fns";

interface WaterBill {
  id: string;
  tenant_id: string;
  property_id: string;
  units_consumed: number;
  unit_price: number;
  total_amount: number;
  status: string;
  due_date: string;
  bill_date: string;
  tenants: {
    name: string;
    email: string;
  };
  properties: {
    name: string;
  };
}

const WaterBilling = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [bills, setBills] = useState<WaterBill[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [properties, setProperties] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      fetchBills();
      fetchProperties();
    }
  }, [user]);

  const fetchProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('id, name')
        .eq('user_id', user?.id);

      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  };

  const fetchBills = async () => {
    try {
      let query = supabase
        .from('water_bills')
        .select(`
          id,
          tenant_id,
          property_id,
          units_consumed,
          unit_price,
          total_amount,
          status,
          due_date,
          bill_date,
          tenants(name, email),
          properties(name)
        `)
        .eq('user_id', user?.id)
        .order('bill_date', { ascending: false });

      if (selectedProperty !== "all") {
        query = query.eq('property_id', selectedProperty);
      }

      if (selectedStatus !== "all") {
        query = query.eq('status', selectedStatus);
      }

      const { data, error } = await query;

      if (error) throw error;
      setBills(data || []);
    } catch (error) {
      console.error('Error fetching bills:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchBills();
    }
  }, [selectedProperty, selectedStatus, user]);

  const updateBillStatus = async (billId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('water_bills')
        .update({ status })
        .eq('id', billId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Bill marked as ${status}`,
      });

      fetchBills();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update bill status",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Water Bills Management</CardTitle>
          <CardDescription>
            View and manage water bills for all your properties
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
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

            <div className="flex-1">
              <Label htmlFor="status-filter">Filter by Status</Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {bills.length === 0 ? (
            <p className="text-muted-foreground">No water bills found.</p>
          ) : (
            <div className="space-y-4">
              {bills.map((bill) => (
                <div
                  key={bill.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium">{bill.tenants?.name}</h4>
                      <Badge className={getStatusColor(bill.status)}>
                        {bill.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {bill.properties?.name} • {bill.tenants?.email}
                    </p>
                    <div className="flex gap-4 mt-2 text-sm">
                      <span>Units: {bill.units_consumed}</span>
                      <span>Rate: KES {bill.unit_price}/unit</span>
                      <span className="font-medium">Total: KES {bill.total_amount}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Bill Date: {format(new Date(bill.bill_date), "MMM dd, yyyy")} • 
                      Due: {format(new Date(bill.due_date), "MMM dd, yyyy")}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    {bill.status === 'pending' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateBillStatus(bill.id, 'paid')}
                      >
                        Mark Paid
                      </Button>
                    )}
                    {bill.status === 'paid' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateBillStatus(bill.id, 'pending')}
                      >
                        Mark Pending
                      </Button>
                    )}
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

export default WaterBilling;
