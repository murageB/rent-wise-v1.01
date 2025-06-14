import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import PropertyCard from "./PropertyCard";
import PropertyForm from "./PropertyForm";
import UnitTypesManager from "./UnitTypesManager";

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

  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isUnitTypesDialogOpen, setIsUnitTypesDialogOpen] = useState(false);
  const [selectedPropertyForUnits, setSelectedPropertyForUnits] = useState<Property | null>(null);

  const filteredProperties = properties.filter(property =>
    property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddProperty = (propertyData: any) => {
    const property: Property = {
      id: Date.now().toString(),
      name: propertyData.name,
      address: propertyData.address,
      type: propertyData.type,
      unitTypes: [],
      status: "active"
    };

    setProperties([...properties, property]);
    setIsAddDialogOpen(false);
    
    toast({
      title: "Success",
      description: "Property added successfully. You can now add unit types to this property.",
    });
  };

  const handleEditProperty = (updatedProperty: Property) => {
    setProperties(properties.map(p => 
      p.id === updatedProperty.id ? updatedProperty : p
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

  const handleAddUnitType = (unitTypeData: Omit<UnitType, 'id'>) => {
    if (!selectedPropertyForUnits) return;

    const unitType: UnitType = {
      id: Date.now().toString(),
      ...unitTypeData
    };

    setProperties(properties.map(p => 
      p.id === selectedPropertyForUnits.id 
        ? { ...p, unitTypes: [...p.unitTypes, unitType] }
        : p
    ));

    // Update selectedPropertyForUnits to reflect the new unit type
    setSelectedPropertyForUnits(prev => 
      prev ? { ...prev, unitTypes: [...prev.unitTypes, unitType] } : null
    );
  };

  const handleDeleteUnitType = (unitTypeId: string) => {
    if (!selectedPropertyForUnits) return;

    setProperties(properties.map(p => 
      p.id === selectedPropertyForUnits.id 
        ? { ...p, unitTypes: p.unitTypes.filter(ut => ut.id !== unitTypeId) }
        : p
    ));

    // Update selectedPropertyForUnits to reflect the deletion
    setSelectedPropertyForUnits(prev => 
      prev ? { ...prev, unitTypes: prev.unitTypes.filter(ut => ut.id !== unitTypeId) } : null
    );
    
    toast({
      title: "Success",
      description: "Unit type deleted successfully",
    });
  };

  const handleUpdateUnitTypePrice = (unitTypeId: string, newPrice: number) => {
    if (!selectedPropertyForUnits) return;

    setProperties(properties.map(p => 
      p.id === selectedPropertyForUnits.id 
        ? { 
            ...p, 
            unitTypes: p.unitTypes.map(ut => 
              ut.id === unitTypeId 
                ? { ...ut, rentPerUnit: newPrice }
                : ut
            )
          }
        : p
    ));

    // Update selectedPropertyForUnits to reflect the price change
    setSelectedPropertyForUnits(prev => 
      prev ? { 
        ...prev, 
        unitTypes: prev.unitTypes.map(ut => 
          ut.id === unitTypeId 
            ? { ...ut, rentPerUnit: newPrice }
            : ut
        )
      } : null
    );
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

  const handleEditPropertyClick = (property: Property) => {
    setEditingProperty(property);
    setIsEditDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Properties</h2>
          <p className="text-muted-foreground">Manage your property portfolio</p>
        </div>
        <PropertyForm
          isOpen={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onSubmit={handleAddProperty}
          mode="add"
          showTrigger={true}
        />
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
          <PropertyCard
            key={property.id}
            property={property}
            onEdit={handleEditPropertyClick}
            onDelete={handleDeleteProperty}
            onManageUnits={handleManageUnitTypes}
            onViewTenants={handleViewTenants}
          />
        ))}
      </div>

      <PropertyForm
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        property={editingProperty}
        onSubmit={handleEditProperty}
        mode="edit"
      />

      <UnitTypesManager
        isOpen={isUnitTypesDialogOpen}
        onOpenChange={setIsUnitTypesDialogOpen}
        property={selectedPropertyForUnits}
        onAddUnitType={handleAddUnitType}
        onDeleteUnitType={handleDeleteUnitType}
        onUpdateUnitTypePrice={handleUpdateUnitTypePrice}
      />
    </div>
  );
};

export default PropertiesTab;
