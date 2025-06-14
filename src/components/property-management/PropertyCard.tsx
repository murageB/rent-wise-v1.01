
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Edit, Users, Trash2, Home } from "lucide-react";

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

interface PropertyCardProps {
  property: Property;
  onEdit: (property: Property) => void;
  onDelete: (id: string) => void;
  onManageUnits: (property: Property) => void;
  onViewTenants: (propertyId: string) => void;
}

const PropertyCard = ({ property, onEdit, onDelete, onManageUnits, onViewTenants }: PropertyCardProps) => {
  const getTotalUnits = (property: Property) => {
    return property.unitTypes.reduce((sum, unitType) => sum + unitType.count, 0);
  };

  const getTotalOccupied = (property: Property) => {
    return property.unitTypes.reduce((sum, unitType) => sum + unitType.occupied, 0);
  };

  const getTotalMonthlyRent = (property: Property) => {
    return property.unitTypes.reduce((sum, unitType) => sum + (unitType.occupied * unitType.rentPerUnit), 0);
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
    <Card className="hover:shadow-lg transition-shadow">
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
            onClick={() => onEdit(property)}
          >
            <Edit className="h-3 w-3 mr-1" />
            Edit
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => onManageUnits(property)}
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
            onClick={() => onViewTenants(property.id)}
          >
            <Users className="h-3 w-3 mr-1" />
            Tenants
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onDelete(property.id)}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyCard;
