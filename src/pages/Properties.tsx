import { useState } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { properties as initialProperties } from "@/data/mockData";
import { Property } from "@/types";
import { Plus, Building2, MapPin, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Properties() {
  const [properties, setProperties] = useState<Property[]>(initialProperties);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newProperty, setNewProperty] = useState({ name: "", address: "" });

  const handleAddProperty = () => {
    if (newProperty.name && newProperty.address) {
      const property: Property = {
        id: Date.now().toString(),
        name: newProperty.name,
        address: newProperty.address,
        units: 0,
      };
      setProperties([...properties, property]);
      setNewProperty({ name: "", address: "" });
      setIsDialogOpen(false);
    }
  };

  const handleDeleteProperty = (id: string) => {
    setProperties(properties.filter((p) => p.id !== id));
  };

  return (
    <PageLayout>
      <div className="flex items-center justify-between mb-6">
        <div className="page-header mb-0">
          <h1 className="page-title">Properties</h1>
          <p className="page-description">Manage your rental properties</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Property
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Property</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <Label htmlFor="name">Property Name</Label>
                <Input
                  id="name"
                  value={newProperty.name}
                  onChange={(e) => setNewProperty({ ...newProperty, name: e.target.value })}
                  placeholder="e.g., Sunset Apartments"
                />
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={newProperty.address}
                  onChange={(e) => setNewProperty({ ...newProperty, address: e.target.value })}
                  placeholder="e.g., 123 Main St, City, State 12345"
                />
              </div>
              <Button onClick={handleAddProperty} className="w-full">
                Add Property
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {properties.map((property) => (
          <div key={property.id} className="property-card">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-primary" />
              </div>
              <button
                onClick={() => handleDeleteProperty(property.id)}
                className="text-muted-foreground hover:text-destructive transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <h3 className="font-semibold text-lg mb-2">{property.name}</h3>
            <div className="flex items-start gap-2 text-sm text-muted-foreground mb-4">
              <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{property.address}</span>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Units</p>
              <p className="text-2xl font-bold">{property.units}</p>
            </div>
          </div>
        ))}
      </div>
    </PageLayout>
  );
}
