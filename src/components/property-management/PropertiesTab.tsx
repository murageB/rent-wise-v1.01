
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Search, MapPin, Edit, Users, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Property {
  id: string;
  name: string;
  address: string;
  type: string;
  units: number;
  occupied: number;
  monthlyRent: number;
  status: "active" | "maintenance" | "vacant";
}

const PropertiesTab = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [properties, setProperties] = useState<Property[]>([
    {
      id: "1",
      name: "Sunset Apartments",
      address: "123 Main St, City, State 12345",
      type: "Apartment Complex",
      units: 24,
      occupied: 22,
      monthlyRent: 28800,
      status: "active"
    },
    {
      id: "2",
      name: "Downtown Loft",
      address: "456 Oak Ave, City, State 12345",
      type: "Single Family",
      units: 1,
      occupied: 1,
      monthlyRent: 1800,
      status: "active"
    },
    {
      id: "3",
      name: "Garden View Condos",
      address: "789 Pine Rd, City, State 12345",
      type: "Condominium",
      units: 12,
      occupied: 10,
      monthlyRent: 15600,
      status: "maintenance"
    }
  ]);

  const [newProperty, setNewProperty] = useState({
    name: "",
    address: "",
    type: "",
    units: "",
    monthlyRent: ""
  });

  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const filteredProperties = properties.filter(property =>
    property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddProperty = () => {
    if (!newProperty.name || !newProperty.address || !newProperty.type || !newProperty.units || !newProperty.monthlyRent) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const property: Property = {
      id: Date.now().toString(),
      name: newProperty.name,
      address: newProperty.address,
      type: newProperty.type,
      units: parseInt(newProperty.units),
      occupied: 0,
      monthlyRent: parseFloat(newProperty.monthlyRent),
      status: "active"
    };

    setProperties([...properties, property]);
    setNewProperty({ name: "", address: "", type: "", units: "", monthlyRent: "" });
    setIsAddDialogOpen(false);
    
    toast({
      title: "Success",
      description: "Property added successfully",
    });
  };

  const handleEditProperty = () => {
    if (!editingProperty) return;

    setProperties(properties.map(p => 
      p.id === editingProperty.id ? editingProperty : p
    ));
    setEditingProperty(null);
    setIsEditDialogOpen(false);
    
    toast({
      title: "Success",
      description: "Property updated successfully",
    });
  };

  const handleDeleteProperty = (id: string) => {
    setProperties(properties.filter(p => p.id !== id));
    toast({
      title: "Success",
      description: "Property deleted successfully",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "maintenance": return "bg-yellow-100 text-yellow-800";
      case "vacant": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Properties</h2>
          <p className="text-muted-foreground">Manage your property portfolio</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Property
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Property</DialogTitle>
              <DialogDescription>
                Enter the details for your new property.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Property Name</Label>
                <Input
                  id="name"
                  value={newProperty.name}
                  onChange={(e) => setNewProperty({...newProperty, name: e.target.value})}
                  placeholder="Enter property name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={newProperty.address}
                  onChange={(e) => setNewProperty({...newProperty, address: e.target.value})}
                  placeholder="Enter full address"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="type">Property Type</Label>
                <Input
                  id="type"
                  value={newProperty.type}
                  onChange={(e) => setNewProperty({...newProperty, type: e.target.value})}
                  placeholder="e.g., Apartment, Single Family, Condo"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="units">Number of Units</Label>
                <Input
                  id="units"
                  type="number"
                  value={newProperty.units}
                  onChange={(e) => setNewProperty({...newProperty, units: e.target.value})}
                  placeholder="Enter number of units"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="rent">Total Monthly Rent</Label>
                <Input
                  id="rent"
                  type="number"
                  value={newProperty.monthlyRent}
                  onChange={(e) => setNewProperty({...newProperty, monthlyRent: e.target.value})}
                  placeholder="Enter total monthly rent"
                />
              </div>
            </div>
            <Button onClick={handleAddProperty} className="w-full">
              Add Property
            </Button>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search properties..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.map((property) => (
          <Card key={property.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{property.name}</CardTitle>
                  <CardDescription className="flex items-center mt-1">
                    <MapPin className="h-3 w-3 mr-1" />
                    {property.address}
                  </CardDescription>
                </div>
                <Badge className={getStatusColor(property.status)}>
                  {property.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Type:</span>
                <span className="font-medium">{property.type}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Units:</span>
                <span className="font-medium">{property.units}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Occupancy:</span>
                <span className="font-medium">
                  {property.occupied}/{property.units} ({Math.round((property.occupied / property.units) * 100)}%)
                </span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Monthly Revenue:</span>
                <span className="font-medium text-green-600">
                  ${property.monthlyRent.toLocaleString()}
                </span>
              </div>
              
              <div className="flex space-x-2 pt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => {
                    setEditingProperty(property);
                    setIsEditDialogOpen(true);
                  }}
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Users className="h-3 w-3 mr-1" />
                  Tenants
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleDeleteProperty(property.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Property Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Property</DialogTitle>
            <DialogDescription>
              Update the property details.
            </DialogDescription>
          </DialogHeader>
          {editingProperty && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Property Name</Label>
                <Input
                  id="edit-name"
                  value={editingProperty.name}
                  onChange={(e) => setEditingProperty({...editingProperty, name: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-address">Address</Label>
                <Input
                  id="edit-address"
                  value={editingProperty.address}
                  onChange={(e) => setEditingProperty({...editingProperty, address: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-type">Property Type</Label>
                <Input
                  id="edit-type"
                  value={editingProperty.type}
                  onChange={(e) => setEditingProperty({...editingProperty, type: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-units">Number of Units</Label>
                <Input
                  id="edit-units"
                  type="number"
                  value={editingProperty.units.toString()}
                  onChange={(e) => setEditingProperty({...editingProperty, units: parseInt(e.target.value) || 0})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-rent">Total Monthly Rent</Label>
                <Input
                  id="edit-rent"
                  type="number"
                  value={editingProperty.monthlyRent.toString()}
                  onChange={(e) => setEditingProperty({...editingProperty, monthlyRent: parseFloat(e.target.value) || 0})}
                />
              </div>
            </div>
          )}
          <Button onClick={handleEditProperty} className="w-full">
            Update Property
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PropertiesTab;
