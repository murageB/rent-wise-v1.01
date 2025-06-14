import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, DollarSign, Calendar, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface RentPayment {
  id: string;
  tenantName: string;
  property: string;
  unit: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: "paid" | "overdue" | "pending";
  paymentMethod?: string;
}

const RentTab = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [rentPayments, setRentPayments] = useState<RentPayment[]>([
    {
      id: "1",
      tenantName: "John Smith",
      property: "Sunset Apartments",
      unit: "2A",
      amount: 120000,
      dueDate: "2024-01-01",
      paidDate: "2024-01-01",
      status: "paid",
      paymentMethod: "Bank Transfer"
    },
    {
      id: "2",
      tenantName: "Sarah Johnson",
      property: "Downtown Loft",
      unit: "1",
      amount: 180000,
      dueDate: "2024-01-01",
      status: "pending"
    },
    {
      id: "3",
      tenantName: "Mike Davis",
      property: "Garden View Condos",
      unit: "3B",
      amount: 130000,
      dueDate: "2023-12-01",
      status: "overdue"
    }
  ]);

  const [newPayment, setNewPayment] = useState({
    tenantName: "",
    property: "",
    unit: "",
    amount: "",
    paymentMethod: ""
  });

  const filteredPayments = rentPayments.filter(payment => {
    const matchesSearch = payment.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.property.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || payment.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleRecordPayment = () => {
    if (!newPayment.tenantName || !newPayment.property || !newPayment.unit || !newPayment.amount || !newPayment.paymentMethod) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const payment: RentPayment = {
      id: Date.now().toString(),
      tenantName: newPayment.tenantName,
      property: newPayment.property,
      unit: newPayment.unit,
      amount: parseFloat(newPayment.amount),
      dueDate: new Date().toISOString().split('T')[0],
      paidDate: new Date().toISOString().split('T')[0],
      status: "paid",
      paymentMethod: newPayment.paymentMethod
    };

    setRentPayments([payment, ...rentPayments]);
    setNewPayment({ tenantName: "", property: "", unit: "", amount: "", paymentMethod: "" });
    setIsAddDialogOpen(false);
    
    toast({
      title: "Success",
      description: "Payment recorded successfully",
    });
  };

  const markAsPaid = (paymentId: string) => {
    setRentPayments(rentPayments.map(payment => 
      payment.id === paymentId 
        ? { 
            ...payment, 
            status: "paid" as const, 
            paidDate: new Date().toISOString().split('T')[0],
            paymentMethod: payment.paymentMethod || "Cash"
          }
        : payment
    ));
    
    toast({
      title: "Success",
      description: "Payment marked as paid",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid": return "bg-green-100 text-green-800";
      case "overdue": return "bg-red-100 text-red-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid": return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "overdue": return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "pending": return <Clock className="h-4 w-4 text-yellow-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const totalRent = rentPayments.reduce((sum, payment) => sum + payment.amount, 0);
  const paidRent = rentPayments.filter(p => p.status === "paid").reduce((sum, payment) => sum + payment.amount, 0);
  const overdueRent = rentPayments.filter(p => p.status === "overdue").reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Rent Management</h2>
          <p className="text-muted-foreground">Track rent payments and collections</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Record Payment
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Record Rent Payment</DialogTitle>
              <DialogDescription>
                Record a new rent payment from a tenant.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="payment-tenant">Tenant Name</Label>
                <Input
                  id="payment-tenant"
                  value={newPayment.tenantName}
                  onChange={(e) => setNewPayment({...newPayment, tenantName: e.target.value})}
                  placeholder="Enter tenant name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="payment-property">Property</Label>
                <Input
                  id="payment-property"
                  value={newPayment.property}
                  onChange={(e) => setNewPayment({...newPayment, property: e.target.value})}
                  placeholder="Enter property name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="payment-unit">Unit</Label>
                <Input
                  id="payment-unit"
                  value={newPayment.unit}
                  onChange={(e) => setNewPayment({...newPayment, unit: e.target.value})}
                  placeholder="Enter unit number"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="payment-amount">Amount (KES)</Label>
                <Input
                  id="payment-amount"
                  type="number"
                  value={newPayment.amount}
                  onChange={(e) => setNewPayment({...newPayment, amount: e.target.value})}
                  placeholder="Enter payment amount in KES"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="payment-method">Payment Method</Label>
                <Select value={newPayment.paymentMethod} onValueChange={(value) => setNewPayment({...newPayment, paymentMethod: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="check">Check</SelectItem>
                    <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                    <SelectItem value="online">Online Payment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={handleRecordPayment} className="w-full">
              Record Payment
            </Button>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expected</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">KES {totalRent.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Collected</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">KES {paidRent.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {totalRent > 0 ? Math.round((paidRent / totalRent) * 100) : 0}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">KES {overdueRent.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Needs attention</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search payments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Rent Payments</CardTitle>
          <CardDescription>
            Track all rent payments and due dates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Tenant</TableHead>
                <TableHead>Property/Unit</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Paid Date</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(payment.status)}
                      <Badge className={getStatusColor(payment.status)}>
                        {payment.status}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{payment.tenantName}</div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{payment.property}</div>
                      <div className="text-sm text-muted-foreground">Unit {payment.unit}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <DollarSign className="h-3 w-3 mr-1" />
                      KES {payment.amount.toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(payment.dueDate).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    {payment.paidDate ? (
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(payment.paidDate).toLocaleDateString()}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {payment.paymentMethod || <span className="text-muted-foreground">-</span>}
                  </TableCell>
                  <TableCell>
                    {payment.status !== "paid" && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => markAsPaid(payment.id)}
                      >
                        Mark Paid
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default RentTab;
