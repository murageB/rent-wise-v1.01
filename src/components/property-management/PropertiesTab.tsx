import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Search, MapPin, Edit, Users, Trash2, Home } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface UnitType {
  id: string;
  name: string;
  count: number;
  occupied: number;
  rentPerUnit: number;
}

interface Property {
  id: string;
  name: string;
  address: string;
  type: string;
  unitTypes: UnitType[];
  status: "active" | "maintenance" | "vacant";
}

interface PropertiesTabProps {
  onNavigateToTenants?: (propertyId?: string) => void;
}

const PropertiesTab = ({ onNavigateToTenants }: PropertiesTabProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [properties, setProperties] = useState<Property[]>([
    {
      id: "1",
      name: "Sunset Apartments",
      address: "123 Main St, City, State 12345",
      type: "Apartment Complex",
      unitTypes: [
        { id: "1a", name: "Studio", count: 8, occupied: 7, rentPerUnit: 80000 },
        { id: "1b", name: "One Bedroom", count: 12, occupied: 11, rentPerUnit: 120000 },
        { id: "1c", name: "Two Bedroom", count: 4, occupied: 4, rentPerUnit: 180000 }
      ],
      status: "active"
    },
    {
      id: "2",
      name: "Downtown Loft",
      address: "456 Oak Ave, City, State 12345",
      type: "Single Family",
      unitTypes: [
        { id: "2a", name: "Loft", count: 1, occupied: 1, rentPerUnit: 180000 }
      ],
      status: "active"
    },
    {
      id: "3",
      name: "Garden View Condos",
      address: "789 Pine Rd, City, State 12345",
      type: "Condominium",
      unitTypes: [
        { id: "3a", name: "Bedsitter", count: 6, occupied: 5, rentPerUnit: 60000 },
        { id: "3b", name: "One Bedroom", count: 4, occupied: 3, rentPerUnit: 100000 },
        { id: "3c", name: "Three Bedroom", count: 2, occupied: 2, rentPerUnit: 250000 }
      ],
      status: "maintenance"
    }
  ]);

  const [newProperty, setNewProperty] = useState({
    name: "",
    address: "",
    type: ""
  });

  const [newUnitType, setNewUnitType] = useState({
    name: "",
    count: "",
    rentPerUnit: ""
  });

  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isUnitTypesDialogOpen, setIsUnitTypesDialogOpen] = useState(false);
  const [selectedPropertyForUnits, setSelectedPropertyForUnits] = useState<Property | null>(null);

  const filteredProperties = properties.filter(property =>
    property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTotalUnits = (property: Property) => {
    return property.unitTypes.reduce((sum, unitType) => sum + unitType.count, 0);
  };

  const getTotalOccupied = (property: Property) => {
    return property.unitTypes.reduce((sum, unitType) => sum + unitType.occupied, 0);
  };

  const getTotalMonthlyRent = (property: Property) => {
    return property.unitTypes.reduce((sum, unitType) => sum + (unitType.occupied * unitType.rentPerUnit), 0);
  };

  const handleAddProperty = () => {
    if (!newProperty.name || !newProperty.address || !newProperty.type) {
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
      unitTypes: [],
      status: "active"
    };

    setProperties([...properties, property]);
    setNewProperty({ name: "", address: "", type: "" });
    setIsAddDialogOpen(false);
    
    toast({
      title: "Success",
      description: "Property added successfully. You can now add unit types to this property.",
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

  const handleAddUnitType = () => {
    if (!selectedPropertyForUnits || !newUnitType.name || !newUnitType.count || !newUnitType.rentPerUnit) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const unitType: UnitType = {
      id: Date.now().toString(),
      name: newUnitType.name,
      count: parseInt(newUnitType.count),
      occupied: 0,
      rentPerUnit: parseFloat(newUnitType.rentPerUnit)
    };

    setProperties(properties.map(p => 
      p.id === selectedPropertyForUnits.id 
        ? { ...p, unitTypes: [...p.unitTypes, unitType] }
        : p
    ));

    setNewUnitType({ name: "", count: "", rentPerUnit: "" });
    
    toast({
      title: "Success",
      description: "Unit type added successfully",
    });
  };

  const handleDeleteUnitType = (propertyId: string, unitTypeId: string) => {
    setProperties(properties.map(p => 
      p.id === propertyId 
        ? { ...p, unitTypes: p.unitTypes.filter(ut => ut.id !== unitTypeId) }
        : p
    ));
    
    toast({
      title: "Success",
      description: "Unit type deleted successfully",
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

  const handleViewTenants = (propertyId: string) => {
    if (onNavigateToTenants) {
      onNavigateToTenants(propertyId);
    }
  };

  const handleManageUnitTypes = (property: Property) => {
    setSelectedPropertyForUnits(property);
    setIsUnitTypesDialogOpen(true);
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
                Enter the basic details for your new property. You can add unit types after creating the property.
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
                <span className="text-muted-foreground">Total Units:</span>
                <span className="font-medium">{getTotalUnits(property)}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Occupancy:</span>
                <span className="font-medium">
                  {getTotalOccupied(property)}/{getTotalUnits(property)} ({getTotalUnits(property) > 0 ? Math.round((getTotalOccupied(property) / getTotalUnits(property)) * 100) : 0}%)
                </span>
              </div>

              {property.unitTypes.length > 0 && (
                <div className="space-y-2">
                  <span className="text-sm text-muted-foreground">Unit Types:</span>
                  {property.unitTypes.map((unitType) => (
                    <div key={unitType.id} className="flex justify-between text-xs bg-muted p-2 rounded">
                      <span>{unitType.name}</span>
                      <span>{unitType.occupied}/{unitType.count} - KES {unitType.rentPerUnit.toLocaleString()}/unit</span>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Monthly Revenue:</span>
                <span className="font-medium text-green-600">
                  KES {getTotalMonthlyRent(property).toLocaleString()}
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
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => handleManageUnitTypes(property)}
                >
                  <Home className="h-3 w-3 mr-1" />
                  Units
                </Button>
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => handleViewTenants(property.id)}
                >
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
            </div>
          )}
          <Button onClick={handleEditProperty} className="w-full">
            Update Property
          </Button>
        </DialogContent>
      </Dialog>

      {/* Unit Types Management Dialog */}
      <Dialog open={isUnitTypesDialogOpen} onOpenChange={setIsUnitTypesDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Manage Unit Types - {selectedPropertyForUnits?.name}</DialogTitle>
            <DialogDescription>
              Add and manage different unit types with their respective counts and rent prices.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Existing Unit Types */}
            {selectedPropertyForUnits && selectedPropertyForUnits.unitTypes.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium">Current Unit Types</h4>
                {selectedPropertyForUnits.unitTypes.map((unitType) => (
                  <div key={unitType.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{unitType.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {unitType.count} units • {unitType.occupied} occupied • KES {unitType.rentPerUnit.toLocaleString()}/unit
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => selectedPropertyForUnits && handleDeleteUnitType(selectedPropertyForUnits.id, unitType.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Add New Unit Type */}
            <div className="space-y-4 border-t pt-4">
              <h4 className="font-medium">Add New Unit Type</h4>
              <div className="grid grid-cols-3 gap-3">
                <div className="grid gap-2">
                  <Label htmlFor="unit-name">Unit Type</Label>
                  <Input
                    id="unit-name"
                    value={newUnitType.name}
                    onChange={(e) => setNewUnitType({...newUnitType, name: e.target.value})}
                    placeholder="e.g., Studio, 1BR, 2BR"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="unit-count">Count</Label>
                  <Input
                    id="unit-count"
                    type="number"
                    value={newUnitType.count}
                    onChange={(e) => setNewUnitType({...newUnitType, count: e.target.value})}
                    placeholder="Number of units"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="unit-rent">Rent per Unit</Label>
                  <Input
                    id="unit-rent"
                    type="number"
                    value={newUnitType.rentPerUnit}
                    onChange={(e) => setNewUnitType({...newUnitType, rentPerUnit: e.target.value})}
                    placeholder="Rent amount"
                  />
                </div>
              </div>
              <Button onClick={handleAddUnitType} className="w-full">
                Add Unit Type
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PropertiesTab;
