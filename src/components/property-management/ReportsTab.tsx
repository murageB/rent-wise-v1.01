import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { Download, Calendar, DollarSign, TrendingUp, Building, Users } from "lucide-react";
import { useState } from "react";

const ReportsTab = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("month");

  // Mock data for charts - updated to KES amounts
  const monthlyRevenue = [
    { month: "Jan", revenue: 1240000, expenses: 320000 },
    { month: "Feb", revenue: 1320000, expenses: 280000 },
    { month: "Mar", revenue: 1410000, expenses: 350000 },
    { month: "Apr", revenue: 1380000, expenses: 290000 },
    { month: "May", revenue: 1520000, expenses: 310000 },
    { month: "Jun", revenue: 1540000, expenses: 340000 }
  ];

  // Mock data for charts
  const occupancyData = [
    { name: "Occupied", value: 28, color: "#22c55e" },
    { name: "Vacant", value: 4, color: "#ef4444" }
  ];

  const maintenanceCosts = [
    { category: "Plumbing", amount: 120000 },
    { category: "Electrical", amount: 80000 },
    { category: "HVAC", amount: 150000 },
    { category: "General", amount: 60000 },
    { category: "Appliances", amount: 90000 }
  ];

  const propertyPerformance = [
    { property: "Sunset Apartments", revenue: 2880000, occupancy: 92 },
    { property: "Downtown Loft", revenue: 180000, occupancy: 100 },
    { property: "Garden View Condos", revenue: 1560000, occupancy: 83 },
    { property: "Riverside Complex", revenue: 2240000, occupancy: 95 }
  ];

  const totalRevenue = monthlyRevenue.reduce((sum, month) => sum + month.revenue, 0);
  const totalExpenses = monthlyRevenue.reduce((sum, month) => sum + month.expenses, 0);
  const netIncome = totalRevenue - totalExpenses;
  const avgOccupancy = 92;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Financial Reports</h2>
          <p className="text-muted-foreground">Analyze your property portfolio performance</p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">KES {totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+12% from last period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">KES {netIncome.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((netIncome / totalRevenue) * 100)}% profit margin
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Occupancy</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgOccupancy}%</div>
            <p className="text-xs text-muted-foreground">+2% from last period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">KES {totalExpenses.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((totalExpenses / totalRevenue) * 100)}% of revenue
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue vs Expenses</CardTitle>
            <CardDescription>Monthly comparison of income and expenses</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#22c55e" name="Revenue" />
                <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Occupancy Overview</CardTitle>
            <CardDescription>Current occupancy across all properties</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={occupancyData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {occupancyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Maintenance Costs by Category</CardTitle>
            <CardDescription>Breakdown of maintenance expenses</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={maintenanceCosts} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="category" type="category" width={80} />
                <Tooltip />
                <Bar dataKey="amount" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Property Performance</CardTitle>
            <CardDescription>Revenue and occupancy by property</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {propertyPerformance.map((property, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{property.property}</div>
                    <div className="text-sm text-muted-foreground">
                      {property.occupancy}% occupancy
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">KES {property.revenue.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">monthly</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Section */}
      <Card>
        <CardHeader>
          <CardTitle>Executive Summary</CardTitle>
          <CardDescription>Key insights and recommendations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Performance Highlights</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Revenue increased by 12% compared to last period</li>
                <li>• Average occupancy rate of 92% across all properties</li>
                <li>• Maintenance costs decreased by 8% this month</li>
                <li>• Sunset Apartments showing strongest performance</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Action Items</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Address vacant units in Garden View Condos</li>
                <li>• Consider rent increase for high-performing properties</li>
                <li>• Schedule preventive maintenance to reduce costs</li>
                <li>• Review lease renewals coming up next quarter</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsTab;
