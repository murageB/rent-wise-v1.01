import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Check, X } from "lucide-react";
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

interface UnitTypesManagerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  property: Property | null;
  onAddUnitType: (unitType: Omit<UnitType, 'id'>) => void;
  onDeleteUnitType: (unitTypeId: string) => void;
  onUpdateUnitTypePrice: (unitTypeId: string, newPrice: number) => void;
}

const UnitTypesManager = ({ 
  isOpen, 
  onOpenChange, 
  property, 
  onAddUnitType, 
  onDeleteUnitType, 
  onUpdateUnitTypePrice 
}: UnitTypesManagerProps) => {
  const [newUnitType, setNewUnitType] = useState({
    name: "",
    count: "",
    rentPerUnit: ""
  });
  const [editingUnitType, setEditingUnitType] = useState<UnitType | null>(null);
  const [editUnitTypePrice, setEditUnitTypePrice] = useState("");

  const handleAddUnitType = () => {
    if (!newUnitType.name || !newUnitType.count || !newUnitType.rentPerUnit) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const unitType = {
      name: newUnitType.name,
      count: parseInt(newUnitType.count),
      occupied: 0,
      rentPerUnit: parseFloat(newUnitType.rentPerUnit)
    };

    onAddUnitType(unitType);
    setNewUnitType({ name: "", count: "", rentPerUnit: "" });
    
    toast({
      title: "Success",
      description: "Unit type added successfully",
    });
  };

  const handleEditUnitTypePrice = (unitType: UnitType) => {
    setEditingUnitType(unitType);
    setEditUnitTypePrice(unitType.rentPerUnit.toString());
  };

  const handleSaveUnitTypePrice = () => {
    if (!editingUnitType || !editUnitTypePrice) {
      toast({
        title: "Error",
        description: "Please enter a valid price",
        variant: "destructive",
      });
      return;
    }

    const newPrice = parseFloat(editUnitTypePrice);
    if (isNaN(newPrice) || newPrice <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid price",
        variant: "destructive",
      });
      return;
    }

    onUpdateUnitTypePrice(editingUnitType.id, newPrice);
    setEditingUnitType(null);
    setEditUnitTypePrice("");
    
    toast({
      title: "Success",
      description: "Unit type price updated successfully",
    });
  };

  const handleCancelEditUnitTypePrice = () => {
    setEditingUnitType(null);
    setEditUnitTypePrice("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Manage Unit Types - {property?.name}</DialogTitle>
          <DialogDescription>
            Add and manage different unit types with their respective counts and rent prices.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Existing Unit Types */}
          {property && property.unitTypes.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium">Current Unit Types</h4>
              {property.unitTypes.map((unitType) => (
                <div key={unitType.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">{unitType.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {unitType.count} units • {unitType.occupied} occupied • 
                      {editingUnitType?.id === unitType.id ? (
                        <span className="inline-flex items-center gap-2 ml-1">
                          KES 
                          <Input
                            type="number"
                            value={editUnitTypePrice}
                            onChange={(e) => setEditUnitTypePrice(e.target.value)}
                            className="w-24 h-6 px-1 text-xs"
                          />
                          /unit
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0"
                            onClick={handleSaveUnitTypePrice}
                          >
                            <Check className="h-3 w-3 text-green-600" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0"
                            onClick={handleCancelEditUnitTypePrice}
                          >
                            <X className="h-3 w-3 text-red-600" />
                          </Button>
                        </span>
                      ) : (
                        <span 
                          className="cursor-pointer hover:text-blue-600 ml-1"
                          onClick={() => handleEditUnitTypePrice(unitType)}
                        >
                          KES {unitType.rentPerUnit.toLocaleString()}/unit
                        </span>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDeleteUnitType(unitType.id)}
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
  );
};

export default UnitTypesManager;
