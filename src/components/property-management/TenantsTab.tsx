import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Mail, Edit, Trash2, Phone, MapPin } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Tenant {
  id: string;
  name: string;
  email: string;
  phone: string;
  propertyId: string;
  unit: string;
  rent: number;
  status: "active" | "pending" | "inactive";
}

interface TenantsTabProps {
  selectedPropertyFilter?: string;
}

const TenantsTab = ({ selectedPropertyFilter }: TenantsTabProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [propertyFilter, setPropertyFilter] = useState("all");

  const [tenants, setTenants] = useState<Tenant[]>([
    {
      id: "1",
      name: "John Smith",
      email: "john.123@example.com",
      phone: "123-456-7890",
      propertyId: "1",
      unit: "2A",
      rent: 120000,
      status: "active"
    },
    {
      id: "2",
      name: "Alice Johnson",
      email: "alice.johnson@example.com",
      phone: "987-654-3210",
      propertyId: "1",
      unit: "3B",
      rent: 135000,
      status: "pending"
    },
    {
      id: "3",
      name: "Bob Williams",
      email: "bob.williams@example.com",
      phone: "555-123-4567",
      propertyId: "2",
      unit: "Loft",
      rent: 180000,
      status: "active"
    }
  ]);

  const [properties] = useState([
    { id: "1", name: "Sunset Apartments" },
    { id: "2", name: "Downtown Loft" },
    { id: "3", name: "Garden View Condos" }
  ]);

  const [newTenant, setNewTenant] = useState({
    name: "",
    email: "",
    phone: "",
    propertyId: "1",
    unit: "",
    rent: ""
  });

  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Set property filter when navigated from Properties tab
  useEffect(() => {
    if (selectedPropertyFilter) {
      setPropertyFilter(selectedPropertyFilter);
    }
  }, [selectedPropertyFilter]);

  const filteredTenants = tenants.filter(tenant => {
    const matchesSearch = tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tenant.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || tenant.status === statusFilter;
    const matchesProperty = propertyFilter === "all" || tenant.propertyId === propertyFilter;
    
    return matchesSearch && matchesStatus && matchesProperty;
  });

  const handleAddTenant = () => {
    if (!newTenant.name || !newTenant.email || !newTenant.phone || !newTenant.propertyId || !newTenant.unit || !newTenant.rent) {
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
      propertyId: newTenant.propertyId,
      unit: newTenant.unit,
      rent: parseFloat(newTenant.rent),
      status: "active"
    };

    setTenants([...tenants, tenant]);
    setNewTenant({ name: "", email: "", phone: "", propertyId: "1", unit: "", rent: "" });
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
      description: "Tenant deleted successfully",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "inactive": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Tenants</h2>
          <p className="text-muted-foreground">Manage your tenants and their details</p>
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
                Enter the details for the new tenant.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Tenant Name</Label>
                <Input
                  id="name"
                  value={newTenant.name}
                  onChange={(e) => setNewTenant({...newTenant, name: e.target.value})}
                  placeholder="Enter tenant name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={newTenant.email}
                  onChange={(e) => setNewTenant({...newTenant, email: e.target.value})}
                  placeholder="Enter email address"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={newTenant.phone}
                  onChange={(e) => setNewTenant({...newTenant, phone: e.target.value})}
                  placeholder="Enter phone number"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="property">Property</Label>
                <Select onValueChange={(value) => setNewTenant({...newTenant, propertyId: value})}>
                  <SelectTrigger className="w-[220px]">
                    <SelectValue placeholder="Select a property" />
                  </SelectTrigger>
                  <SelectContent>
                    {properties.map((property) => (
                      <SelectItem key={property.id} value={property.id}>
                        {property.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="unit">Unit Number</Label>
                <Input
                  id="unit"
                  value={newTenant.unit}
                  onChange={(e) => setNewTenant({...newTenant, unit: e.target.value})}
                  placeholder="Enter unit number"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="rent">Monthly Rent</Label>
                <Input
                  id="rent"
                  type="number"
                  value={newTenant.rent}
                  onChange={(e) => setNewTenant({...newTenant, rent: e.target.value})}
                  placeholder="Enter monthly rent"
                />
              </div>
            </div>
            <Button onClick={handleAddTenant} className="w-full">
              Add Tenant
            </Button>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex items-center space-x-2 flex-1">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tenants..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>

        <Select value={propertyFilter} onValueChange={setPropertyFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by property" />
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTenants.map((tenant) => (
          <Card key={tenant.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{tenant.name}</CardTitle>
                  <CardDescription className="flex items-center mt-1">
                    <MapPin className="h-3 w-3 mr-1" />
                    Unit {tenant.unit}, {properties.find(p => p.id === tenant.propertyId)?.name}
                  </CardDescription>
                </div>
                <Badge className={getStatusColor(tenant.status)}>
                  {tenant.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Email:</span>
                <a href={`mailto:${tenant.email}`} className="font-medium text-blue-600 hover:underline">
                  {tenant.email}
                </a>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Phone:</span>
                <a href={`tel:${tenant.phone}`} className="font-medium text-blue-600 hover:underline">
                  {tenant.phone}
                </a>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Rent:</span>
                <span className="font-medium text-green-600">
                  KES {tenant.rent.toLocaleString()}
                </span>
              </div>
              
              <div className="flex space-x-2 pt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => {
                    setEditingTenant(tenant);
                    setIsEditDialogOpen(true);
                  }}
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleDeleteTenant(tenant.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

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
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Tenant Name</Label>
                <Input
                  id="edit-name"
                  value={editingTenant.name}
                  onChange={(e) => setEditingTenant({...editingTenant, name: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-email">Email Address</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editingTenant.email}
                  onChange={(e) => setEditingTenant({...editingTenant, email: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-phone">Phone Number</Label>
                <Input
                  id="edit-phone"
                  value={editingTenant.phone}
                  onChange={(e) => setEditingTenant({...editingTenant, phone: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-property">Property</Label>
                  <Select value={editingTenant.propertyId} onValueChange={(value) => setEditingTenant({...editingTenant, propertyId: value})}>
                    <SelectTrigger className="w-[220px]">
                      <SelectValue placeholder="Select a property" />
                    </SelectTrigger>
                    <SelectContent>
                      {properties.map((property) => (
                        <SelectItem key={property.id} value={property.id}>
                          {property.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-unit">Unit Number</Label>
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
                  value={editingTenant.rent.toString()}
                  onChange={(e) => setEditingTenant({...editingTenant, rent: parseFloat(e.target.value) || 0})}
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
