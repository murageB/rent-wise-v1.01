
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Wrench, Building, Users, LogOut, CheckCircle } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import CaretakerWaterTab from "@/components/water-management/CaretakerWaterTab";

const CaretakerDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  // Mock caretaker data - this would come from the database based on assigned properties
  const caretakerData = {
    assignedProperties: ["Sunset Apartments", "Green Valley Complex"],
    pendingRequests: 8,
    completedThisMonth: 15,
    totalTenants: 45,
    maintenanceRequests: [
      { id: 1, property: "Sunset Apartments", unit: "2A", issue: "Leaky faucet", priority: "Medium", date: "2024-06-10" },
      { id: 2, property: "Green Valley Complex", unit: "1B", issue: "AC not working", priority: "High", date: "2024-06-09" },
      { id: 3, property: "Sunset Apartments", unit: "3C", issue: "Light bulb replacement", priority: "Low", date: "2024-06-08" },
    ]
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Caretaker Dashboard</h1>
            <p className="text-muted-foreground">Welcome, {user?.name}</p>
          </div>
          <Button onClick={logout} variant="outline">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
            <TabsTrigger value="water">Water Readings</TabsTrigger>
            <TabsTrigger value="properties">Properties</TabsTrigger>
            <TabsTrigger value="tenants">Tenant Contact</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Assigned Properties</CardTitle>
                  <Building className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{caretakerData.assignedProperties.length}</div>
                  <p className="text-xs text-muted-foreground">Properties under care</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
                  <Wrench className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{caretakerData.pendingRequests}</div>
                  <p className="text-xs text-muted-foreground">Awaiting attention</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completed This Month</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{caretakerData.completedThisMonth}</div>
                  <p className="text-xs text-muted-foreground">+5 from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Tenants</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{caretakerData.totalTenants}</div>
                  <p className="text-xs text-muted-foreground">Across all properties</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Maintenance Requests</CardTitle>
                  <CardDescription>Latest requests that need attention</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {caretakerData.maintenanceRequests.slice(0, 3).map((request) => (
                      <div key={request.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <p className="text-sm font-medium">{request.issue}</p>
                          <p className="text-xs text-muted-foreground">{request.property} - Unit {request.unit}</p>
                        </div>
                        <div className="text-right">
                          <span className={`text-xs px-2 py-1 rounded ${
                            request.priority === 'High' ? 'bg-red-100 text-red-700' :
                            request.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {request.priority}
                          </span>
                          <p className="text-xs text-muted-foreground mt-1">{request.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Assigned Properties</CardTitle>
                  <CardDescription>Properties you're responsible for</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {caretakerData.assignedProperties.map((property, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Building className="h-5 w-5 text-muted-foreground" />
                          <span className="font-medium">{property}</span>
                        </div>
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="maintenance">
            <Card>
              <CardHeader>
                <CardTitle>Maintenance Management</CardTitle>
                <CardDescription>Manage and track maintenance requests</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Maintenance management features will be implemented here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="water">
            <CaretakerWaterTab />
          </TabsContent>

          <TabsContent value="properties">
            <Card>
              <CardHeader>
                <CardTitle>Property Overview</CardTitle>
                <CardDescription>View details of your assigned properties</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Property overview features will be implemented here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tenants">
            <Card>
              <CardHeader>
                <CardTitle>Tenant Communication</CardTitle>
                <CardDescription>Contact information for tenant communication</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Tenant communication features will be implemented here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CaretakerDashboard;
