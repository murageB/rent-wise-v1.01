
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Phone, Mail, Calendar, Edit, DollarSign, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Tenant {
  id: string;
  name: string;
  email: string;
  phone: string;
  property: string;
  unit: string;
  rentAmount: number;
  leaseStart: string;
  leaseEnd: string;
  status: "active" | "late" | "notice" | "inactive";
}

const TenantsTab = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  const [tenants, setTenants] = useState<Tenant[]>([
    {
      id: "1",
      name: "John Smith",
      email: "john.smith@email.com",
      phone: "(555) 123-4567",
      property: "Sunset Apartments",
      unit: "2A",
      rentAmount: 1200,
      leaseStart: "2024-01-01",
      leaseEnd: "2024-12-31",
      status: "active"
    },
    {
      id: "2",
      name: "Sarah Johnson",
      email: "sarah.j@email.com",
      phone: "(555) 987-6543",
      property: "Downtown Loft",
      unit: "1",
      rentAmount: 1800,
      leaseStart: "2024-03-01",
      leaseEnd: "2025-02-28",
      status: "active"
    },
    {
      id: "3",
      name: "Mike Davis",
      email: "mike.davis@email.com",
      phone: "(555) 456-7890",
      property: "Garden View Condos",
      unit: "3B",
      rentAmount: 1300,
      leaseStart: "2023-12-01",
      leaseEnd: "2024-11-30",
      status: "late"
    }
  ]);

  const [newTenant, setNewTenant] = useState({
    name: "",
    email: "",
    phone: "",
    property: "",
    unit: "",
    rentAmount: "",
    leaseStart: "",
    leaseEnd: ""
  });

  const filteredTenants = tenants.filter(tenant =>
    tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.property.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddTenant = () => {
    if (!newTenant.name || !newTenant.email || !newTenant.phone || !newTenant.property || !newTenant.unit || !newTenant.rentAmount || !newTenant.leaseStart || !newTenant.leaseEnd) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const tenant: Tenant = {
      id: Date.now().toString(),
      name: newTenant.name,
      email: newTenant.email,
      phone: newTenant.phone,
      property: newTenant.property,
      unit: newTenant.unit,
      rentAmount: parseFloat(newTenant.rentAmount),
      leaseStart: newTenant.leaseStart,
      leaseEnd: newTenant.leaseEnd,
      status: "active"
    };

    setTenants([...tenants, tenant]);
    setNewTenant({ name: "", email: "", phone: "", property: "", unit: "", rentAmount: "", leaseStart: "", leaseEnd: "" });
    setIsAddDialogOpen(false);
    
    toast({
      title: "Success",
      description: "Tenant added successfully",
    });
  };

  const handleEditTenant = () => {
    if (!editingTenant) return;

    setTenants(tenants.map(t => 
      t.id === editingTenant.id ? editingTenant : t
    ));
    setEditingTenant(null);
    setIsEditDialogOpen(false);
    
    toast({
      title: "Success",
      description: "Tenant updated successfully",
    });
  };

  const handleDeleteTenant = (id: string) => {
    setTenants(tenants.filter(t => t.id !== id));
    toast({
      title: "Success",
      description: "Tenant removed successfully",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "late": return "bg-red-100 text-red-800";
      case "notice": return "bg-yellow-100 text-yellow-800";
      case "inactive": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Tenants</h2>
          <p className="text-muted-foreground">Manage your tenant relationships</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Tenant
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Tenant</DialogTitle>
              <DialogDescription>
                Enter the details for your new tenant.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
              <div className="grid gap-2">
                <Label htmlFor="tenant-name">Full Name</Label>
                <Input
                  id="tenant-name"
                  value={newTenant.name}
                  onChange={(e) => setNewTenant({...newTenant, name: e.target.value})}
                  placeholder="Enter tenant name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tenant-email">Email</Label>
                <Input
                  id="tenant-email"
                  type="email"
                  value={newTenant.email}
                  onChange={(e) => setNewTenant({...newTenant, email: e.target.value})}
                  placeholder="Enter email address"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tenant-phone">Phone</Label>
                <Input
                  id="tenant-phone"
                  value={newTenant.phone}
                  onChange={(e) => setNewTenant({...newTenant, phone: e.target.value})}
                  placeholder="Enter phone number"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tenant-property">Property</Label>
                <Input
                  id="tenant-property"
                  value={newTenant.property}
                  onChange={(e) => setNewTenant({...newTenant, property: e.target.value})}
                  placeholder="Enter property name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tenant-unit">Unit</Label>
                <Input
                  id="tenant-unit"
                  value={newTenant.unit}
                  onChange={(e) => setNewTenant({...newTenant, unit: e.target.value})}
                  placeholder="Enter unit number"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tenant-rent">Monthly Rent</Label>
                <Input
                  id="tenant-rent"
                  type="number"
                  value={newTenant.rentAmount}
                  onChange={(e) => setNewTenant({...newTenant, rentAmount: e.target.value})}
                  placeholder="Enter monthly rent amount"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tenant-lease-start">Lease Start Date</Label>
                <Input
                  id="tenant-lease-start"
                  type="date"
                  value={newTenant.leaseStart}
                  onChange={(e) => setNewTenant({...newTenant, leaseStart: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tenant-lease-end">Lease End Date</Label>
                <Input
                  id="tenant-lease-end"
                  type="date"
                  value={newTenant.leaseEnd}
                  onChange={(e) => setNewTenant({...newTenant, leaseEnd: e.target.value})}
                />
              </div>
            </div>
            <Button onClick={handleAddTenant} className="w-full">
              Add Tenant
            </Button>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search tenants..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Tenants</CardTitle>
          <CardDescription>
            Complete list of tenants across all properties
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tenant</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Property/Unit</TableHead>
                <TableHead>Rent</TableHead>
                <TableHead>Lease Period</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTenants.map((tenant) => (
                <TableRow key={tenant.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{tenant.name}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm">
                        <Mail className="h-3 w-3 mr-1" />
                        {tenant.email}
                      </div>
                      <div className="flex items-center text-sm">
                        <Phone className="h-3 w-3 mr-1" />
                        {tenant.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{tenant.property}</div>
                      <div className="text-sm text-muted-foreground">Unit {tenant.unit}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <DollarSign className="h-3 w-3 mr-1" />
                      ${tenant.rentAmount.toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm">
                      <Calendar className="h-3 w-3 mr-1" />
                      <div>
                        <div>{new Date(tenant.leaseStart).toLocaleDateString()}</div>
                        <div className="text-muted-foreground">to {new Date(tenant.leaseEnd).toLocaleDateString()}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(tenant.status)}>
                      {tenant.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setEditingTenant(tenant);
                          setIsEditDialogOpen(true);
                        }}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.open(`mailto:${tenant.email}`, '_blank')}
                      >
                        <Mail className="h-3 w-3" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeleteTenant(tenant.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Tenant Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Tenant</DialogTitle>
            <DialogDescription>
              Update the tenant details.
            </DialogDescription>
          </DialogHeader>
          {editingTenant && (
            <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Full Name</Label>
                <Input
                  id="edit-name"
                  value={editingTenant.name}
                  onChange={(e) => setEditingTenant({...editingTenant, name: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editingTenant.email}
                  onChange={(e) => setEditingTenant({...editingTenant, email: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-phone">Phone</Label>
                <Input
                  id="edit-phone"
                  value={editingTenant.phone}
                  onChange={(e) => setEditingTenant({...editingTenant, phone: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-property">Property</Label>
                <Input
                  id="edit-property"
                  value={editingTenant.property}
                  onChange={(e) => setEditingTenant({...editingTenant, property: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-unit">Unit</Label>
                <Input
                  id="edit-unit"
                  value={editingTenant.unit}
                  onChange={(e) => setEditingTenant({...editingTenant, unit: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-rent">Monthly Rent</Label>
                <Input
                  id="edit-rent"
                  type="number"
                  value={editingTenant.rentAmount.toString()}
                  onChange={(e) => setEditingTenant({...editingTenant, rentAmount: parseFloat(e.target.value) || 0})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-lease-start">Lease Start Date</Label>
                <Input
                  id="edit-lease-start"
                  type="date"
                  value={editingTenant.leaseStart}
                  onChange={(e) => setEditingTenant({...editingTenant, leaseStart: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-lease-end">Lease End Date</Label>
                <Input
                  id="edit-lease-end"
                  type="date"
                  value={editingTenant.leaseEnd}
                  onChange={(e) => setEditingTenant({...editingTenant, leaseEnd: e.target.value})}
                />
              </div>
            </div>
          )}
          <Button onClick={handleEditTenant} className="w-full">
            Update Tenant
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TenantsTab;
