
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

interface Property {
  id: string;
  name: string;
  address: string;
  type: string;
  unitTypes: any[];
  status: "active" | "maintenance" | "vacant";
}

interface PropertyFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  property?: Property | null;
  onSubmit: (property: any) => void;
  mode: "add" | "edit";
}

const PropertyForm = ({ isOpen, onOpenChange, property, onSubmit, mode }: PropertyFormProps) => {
  const isEditMode = mode === "edit" && property;
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const propertyData = {
      name: formData.get('name') as string,
      address: formData.get('address') as string,
      type: formData.get('type') as string,
    };
    
    if (isEditMode) {
      onSubmit({ ...property, ...propertyData });
    } else {
      onSubmit(propertyData);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {mode === "add" && (
        <DialogTrigger asChild>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Property
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Property" : "Add New Property"}</DialogTitle>
          <DialogDescription>
            {isEditMode 
              ? "Update the property details." 
              : "Enter the basic details for your new property. You can add unit types after creating the property."
            }
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Property Name</Label>
            <Input
              id="name"
              name="name"
              defaultValue={isEditMode ? property.name : ""}
              placeholder="Enter property name"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              name="address"
              defaultValue={isEditMode ? property.address : ""}
              placeholder="Enter full address"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="type">Property Type</Label>
            <Input
              id="type"
              name="type"
              defaultValue={isEditMode ? property.type : ""}
              placeholder="e.g., Apartment, Single Family, Condo"
              required
            />
          </div>
          <Button type="submit" className="w-full">
            {isEditMode ? "Update Property" : "Add Property"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PropertyForm;
