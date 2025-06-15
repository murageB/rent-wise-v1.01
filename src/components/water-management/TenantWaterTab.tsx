
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { format } from "date-fns";

interface WaterBill {
  id: string;
  units_consumed: number;
  unit_price: number;
  total_amount: number;
  status: string;
  due_date: string;
  bill_date: string;
  properties: {
    name: string;
  };
}

const TenantWaterTab = () => {
  const { user } = useAuth();
  const [waterBills, setWaterBills] = useState<WaterBill[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchWaterBills();
    }
  }, [user]);

  const fetchWaterBills = async () => {
    try {
      const { data, error } = await supabase
        .from('water_bills')
        .select(`
          id,
          units_consumed,
          unit_price,
          total_amount,
          status,
          due_date,
          bill_date,
          properties(name)
        `)
        .order('bill_date', { ascending: false });

      if (error) throw error;
      setWaterBills(data || []);
    } catch (error) {
      console.error('Error fetching water bills:', error);
    } finally {
      setIsLoading(false);
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

  const totalBills = waterBills.length;
  const totalAmount = waterBills.reduce((sum, bill) => sum + bill.total_amount, 0);
  const paidBills = waterBills.filter(bill => bill.status === 'paid').length;
  const pendingAmount = waterBills
    .filter(bill => bill.status !== 'paid')
    .reduce((sum, bill) => sum + bill.total_amount, 0);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-muted-foreground">Loading water bills...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Water Bills</h2>
        <p className="text-muted-foreground">Track your water consumption and billing history</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Bills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBills}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Paid Bills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{paidBills}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">KES {totalAmount.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              KES {pendingAmount.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Water Bill History</CardTitle>
          <CardDescription>
            Your complete water billing history
          </CardDescription>
        </CardHeader>
        <CardContent>
          {waterBills.length === 0 ? (
            <p className="text-muted-foreground">No water bills found.</p>
          ) : (
            <div className="space-y-4">
              {waterBills.map((bill) => (
                <div
                  key={bill.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium">
                        Bill #{bill.id.slice(-8).toUpperCase()}
                      </h4>
                      <Badge className={getStatusColor(bill.status)}>
                        {bill.status.charAt(0).toUpperCase() + bill.status.slice(1)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {bill.properties?.name}
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Units Consumed</p>
                        <p className="font-medium">{bill.units_consumed}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Rate per Unit</p>
                        <p className="font-medium">KES {bill.unit_price}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Total Amount</p>
                        <p className="font-medium">KES {bill.total_amount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Due Date</p>
                        <p className="font-medium">
                          {format(new Date(bill.due_date), "MMM dd, yyyy")}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Bill Date: {format(new Date(bill.bill_date), "MMM dd, yyyy")}
                    </p>
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

export default TenantWaterTab;
