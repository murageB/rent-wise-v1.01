
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { DollarSign, Wrench, FileText, Home, LogOut } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import TenantWaterTab from "@/components/water-management/TenantWaterTab";

const TenantDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  // Mock tenant data - this would come from the database based on the user's unit
  const tenantData = {
    unit: "Apt 2B",
    property: "Sunset Apartments",
    rentAmount: 120000,
    rentDue: "2024-06-15",
    leaseEnd: "2024-12-31",
    paymentHistory: [
      { date: "2024-05-01", amount: 120000, status: "Paid" },
      { date: "2024-04-01", amount: 120000, status: "Paid" },
    ],
    maintenanceRequests: [
      { id: 1, description: "Leaky faucet", status: "In Progress", date: "2024-06-10" },
      { id: 2, description: "AC not working", status: "Completed", date: "2024-05-20" },
    ]
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome, {user?.name}</h1>
            <p className="text-muted-foreground">{tenantData.unit} - {tenantData.property}</p>
          </div>
          <Button onClick={logout} variant="outline">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="water">Water Bills</TabsTrigger>
            <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Monthly Rent</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">KES {tenantData.rentAmount.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Due: {tenantData.rentDue}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Unit</CardTitle>
                  <Home className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{tenantData.unit}</div>
                  <p className="text-xs text-muted-foreground">{tenantData.property}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Lease End</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{tenantData.leaseEnd}</div>
                  <p className="text-xs text-muted-foreground">6 months remaining</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Maintenance</CardTitle>
                  <Wrench className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{tenantData.maintenanceRequests.filter(r => r.status !== "Completed").length}</div>
                  <p className="text-xs text-muted-foreground">Active requests</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Payments</CardTitle>
                  <CardDescription>Your payment history</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {tenantData.paymentHistory.map((payment, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">{payment.date}</p>
                          <p className="text-xs text-muted-foreground">Monthly Rent</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">KES {payment.amount.toLocaleString()}</p>
                          <p className="text-xs text-green-600">{payment.status}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common tasks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => setActiveTab("payments")}
                  >
                    <DollarSign className="mr-2 h-4 w-4" />
                    Make Payment
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => setActiveTab("maintenance")}
                  >
                    <Wrench className="mr-2 h-4 w-4" />
                    Request Maintenance
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => setActiveTab("documents")}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Download Invoice
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <CardTitle>Payment Management</CardTitle>
                <CardDescription>View and manage your rent payments</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Payment features will be implemented here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="water">
            <TenantWaterTab />
          </TabsContent>

          <TabsContent value="maintenance">
            <Card>
              <CardHeader>
                <CardTitle>Maintenance Requests</CardTitle>
                <CardDescription>Submit and track maintenance requests</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Maintenance request features will be implemented here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <CardTitle>Documents & Invoices</CardTitle>
                <CardDescription>Access your lease documents and payment invoices</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Document access features will be implemented here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TenantDashboard;
