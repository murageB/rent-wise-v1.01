import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";

interface WaterReport {
  property_id: string;
  property_name: string;
  total_bills: number;
  total_amount: number;
  total_units: number;
  paid_amount: number;
  pending_amount: number;
}

interface TenantReport {
  tenant_id: string;
  tenant_name: string;
  tenant_email: string;
  property_name: string;
  total_bills: number;
  total_amount: number;
  total_units: number;
  last_bill_date: string;
}

const WaterReports = () => {
  const { user } = useAuth();
  const [propertyReports, setPropertyReports] = useState<WaterReport[]>([]);
  const [tenantReports, setTenantReports] = useState<TenantReport[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<string>("all");
  const [properties, setProperties] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      fetchProperties();
      fetchReports();
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchReports();
    }
  }, [selectedProperty, user]);

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

  const fetchReports = async () => {
    try {
      // Fetch property-wise reports
      let propertyQuery = supabase
        .from('water_bills')
        .select(`
          property_id,
          total_amount,
          units_consumed,
          status,
          properties(name)
        `)
        .eq('user_id', user?.id);

      if (selectedProperty !== "all") {
        propertyQuery = propertyQuery.eq('property_id', selectedProperty);
      }

      const { data: billsData, error: billsError } = await propertyQuery;

      if (billsError) throw billsError;

      // Process property reports
      const propertyReportsMap = new Map<string, WaterReport>();
      
      billsData?.forEach((bill: any) => {
        const propertyId = bill.property_id;
        if (!propertyReportsMap.has(propertyId)) {
          propertyReportsMap.set(propertyId, {
            property_id: propertyId,
            property_name: bill.properties?.name || 'Unknown',
            total_bills: 0,
            total_amount: 0,
            total_units: 0,
            paid_amount: 0,
            pending_amount: 0,
          });
        }

        const report = propertyReportsMap.get(propertyId)!;
        report.total_bills++;
        report.total_amount += bill.total_amount;
        report.total_units += bill.units_consumed;

        if (bill.status === 'paid') {
          report.paid_amount += bill.total_amount;
        } else {
          report.pending_amount += bill.total_amount;
        }
      });

      setPropertyReports(Array.from(propertyReportsMap.values()));

      // Fetch tenant-wise reports
      let tenantQuery = supabase
        .from('water_bills')
        .select(`
          tenant_id,
          total_amount,
          units_consumed,
          bill_date,
          tenants(name, email),
          properties(name)
        `)
        .eq('user_id', user?.id)
        .order('bill_date', { ascending: false });

      if (selectedProperty !== "all") {
        tenantQuery = tenantQuery.eq('property_id', selectedProperty);
      }

      const { data: tenantBillsData, error: tenantBillsError } = await tenantQuery;

      if (tenantBillsError) throw tenantBillsError;

      // Process tenant reports
      const tenantReportsMap = new Map<string, TenantReport>();
      
      tenantBillsData?.forEach((bill: any) => {
        const tenantId = bill.tenant_id;
        if (!tenantReportsMap.has(tenantId)) {
          tenantReportsMap.set(tenantId, {
            tenant_id: tenantId,
            tenant_name: bill.tenants?.name || 'Unknown',
            tenant_email: bill.tenants?.email || '',
            property_name: bill.properties?.name || 'Unknown',
            total_bills: 0,
            total_amount: 0,
            total_units: 0,
            last_bill_date: bill.bill_date,
          });
        }

        const report = tenantReportsMap.get(tenantId)!;
        report.total_bills++;
        report.total_amount += bill.total_amount;
        report.total_units += bill.units_consumed;
        
        // Keep the latest bill date
        if (bill.bill_date > report.last_bill_date) {
          report.last_bill_date = bill.bill_date;
        }
      });

      setTenantReports(Array.from(tenantReportsMap.values()));

    } catch (error) {
      console.error('Error fetching reports:', error);
    }
  };

  return (
    <div className="space-y-6">
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
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Property Water Expense Summary</CardTitle>
          <CardDescription>
            Water billing summary by property
          </CardDescription>
        </CardHeader>
        <CardContent>
          {propertyReports.length === 0 ? (
            <p className="text-muted-foreground">No water billing data found.</p>
          ) : (
            <div className="space-y-4">
              {propertyReports.map((report) => (
                <div
                  key={report.property_id}
                  className="p-4 border rounded-lg"
                >
                  <h4 className="font-medium mb-2">{report.property_name}</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Total Bills</p>
                      <p className="font-medium">{report.total_bills}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Total Units</p>
                      <p className="font-medium">{report.total_units}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Total Amount</p>
                      <p className="font-medium">KES {report.total_amount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Paid/Pending</p>
                      <p className="font-medium text-green-600">KES {report.paid_amount.toLocaleString()}</p>
                      <p className="font-medium text-yellow-600">KES {report.pending_amount.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tenant Water Usage Summary</CardTitle>
          <CardDescription>
            Individual tenant water consumption and billing
          </CardDescription>
        </CardHeader>
        <CardContent>
          {tenantReports.length === 0 ? (
            <p className="text-muted-foreground">No tenant water data found.</p>
          ) : (
            <div className="space-y-4">
              {tenantReports.map((report) => (
                <div
                  key={report.tenant_id}
                  className="p-4 border rounded-lg"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium">{report.tenant_name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {report.property_name} • {report.tenant_email}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Last Bill: {new Date(report.last_bill_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Total Bills</p>
                      <p className="font-medium">{report.total_bills}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Total Units</p>
                      <p className="font-medium">{report.total_units}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Total Amount</p>
                      <p className="font-medium">KES {report.total_amount.toLocaleString()}</p>
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

export default WaterReports;
