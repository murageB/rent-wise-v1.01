import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Wrench, AlertTriangle, Clock, CheckCircle, Calendar, User, Edit } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface MaintenanceRequest {
  id: string;
  title: string;
  description: string;
  tenant: string;
  property: string;
  unit: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "pending" | "in-progress" | "completed" | "cancelled";
  dateCreated: string;
  dateCompleted?: string;
  assignedTo?: string;
  cost?: number;
}

const MaintenanceTab = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingRequest, setEditingRequest] = useState<MaintenanceRequest | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>([
    {
      id: "1",
      title: "Leaky Faucet",
      description: "Kitchen faucet is dripping constantly",
      tenant: "John Smith",
      property: "Sunset Apartments",
      unit: "2A",
      priority: "medium",
      status: "pending",
      dateCreated: "2024-01-15"
    },
    {
      id: "2",
      title: "Broken AC Unit",
      description: "AC unit not cooling properly",
      tenant: "Sarah Johnson",
      property: "Downtown Loft",
      unit: "1",
      priority: "high",
      status: "in-progress",
      dateCreated: "2024-01-14",
      assignedTo: "HVAC Tech"
    },
    {
      id: "3",
      title: "Clogged Drain",
      description: "Bathroom sink drain is completely blocked",
      tenant: "Mike Davis",
      property: "Garden View Condos",
      unit: "3B",
      priority: "urgent",
      status: "completed",
      dateCreated: "2024-01-10",
      dateCompleted: "2024-01-12",
      assignedTo: "Plumber",
      cost: 150
    }
  ]);

  const [newRequest, setNewRequest] = useState({
    title: "",
    description: "",
    tenant: "",
    property: "",
    unit: "",
    priority: "medium"
  });

  const filteredRequests = maintenanceRequests.filter(request => {
    const matchesSearch = request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.tenant.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.property.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || request.status === filterStatus;
    const matchesPriority = filterPriority === "all" || request.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleAddRequest = () => {
    if (!newRequest.title || !newRequest.description || !newRequest.tenant || !newRequest.property || !newRequest.unit) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const request: MaintenanceRequest = {
      id: Date.now().toString(),
      title: newRequest.title,
      description: newRequest.description,
      tenant: newRequest.tenant,
      property: newRequest.property,
      unit: newRequest.unit,
      priority: newRequest.priority as "low" | "medium" | "high" | "urgent",
      status: "pending",
      dateCreated: new Date().toISOString().split('T')[0]
    };

    setMaintenanceRequests([request, ...maintenanceRequests]);
    setNewRequest({ title: "", description: "", tenant: "", property: "", unit: "", priority: "medium" });
    setIsAddDialogOpen(false);
    
    toast({
      title: "Success",
      description: "Maintenance request added successfully",
    });
  };

  const updateRequestStatus = (id: string, status: MaintenanceRequest['status']) => {
    setMaintenanceRequests(maintenanceRequests.map(request => 
      request.id === id 
        ? { 
            ...request, 
            status,
            dateCompleted: status === 'completed' ? new Date().toISOString().split('T')[0] : request.dateCompleted
          }
        : request
    ));
    
    toast({
      title: "Success",
      description: `Request marked as ${status}`,
    });
  };

  const assignRequest = (id: string, assignedTo: string) => {
    setMaintenanceRequests(maintenanceRequests.map(request => 
      request.id === id 
        ? { 
            ...request, 
            assignedTo,
            status: assignedTo ? 'in-progress' : 'pending'
          }
        : request
    ));
    
    toast({
      title: "Success",
      description: "Request assigned successfully",
    });
  };

  const handleEditRequest = () => {
    if (!editingRequest) return;

    setMaintenanceRequests(maintenanceRequests.map(request => 
      request.id === editingRequest.id ? editingRequest : request
    ));
    setEditingRequest(null);
    setIsEditDialogOpen(false);
    
    toast({
      title: "Success",
      description: "Request updated successfully",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "in-progress": return "bg-blue-100 text-blue-800";
      case "completed": return "bg-green-100 text-green-800";
      case "cancelled": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low": return "bg-green-100 text-green-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "high": return "bg-orange-100 text-orange-800";
      case "urgent": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return <Clock className="h-4 w-4 text-yellow-500" />;
      case "in-progress": return <Wrench className="h-4 w-4 text-blue-500" />;
      case "completed": return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "cancelled": return <AlertTriangle className="h-4 w-4 text-gray-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const pendingCount = maintenanceRequests.filter(r => r.status === "pending").length;
  const inProgressCount = maintenanceRequests.filter(r => r.status === "in-progress").length;
  const completedCount = maintenanceRequests.filter(r => r.status === "completed").length;
  const urgentCount = maintenanceRequests.filter(r => r.priority === "urgent" && r.status !== "completed").length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Maintenance Requests</h2>
          <p className="text-muted-foreground">Track and manage property maintenance</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Request
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create Maintenance Request</DialogTitle>
              <DialogDescription>
                Add a new maintenance request for tracking.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="request-title">Title</Label>
                <Input
                  id="request-title"
                  value={newRequest.title}
                  onChange={(e) => setNewRequest({...newRequest, title: e.target.value})}
                  placeholder="Brief description of the issue"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="request-description">Description</Label>
                <Textarea
                  id="request-description"
                  value={newRequest.description}
                  onChange={(e) => setNewRequest({...newRequest, description: e.target.value})}
                  placeholder="Detailed description of the maintenance issue"
                  rows={3}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="request-tenant">Tenant</Label>
                <Input
                  id="request-tenant"
                  value={newRequest.tenant}
                  onChange={(e) => setNewRequest({...newRequest, tenant: e.target.value})}
                  placeholder="Tenant name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="request-property">Property</Label>
                <Input
                  id="request-property"
                  value={newRequest.property}
                  onChange={(e) => setNewRequest({...newRequest, property: e.target.value})}
                  placeholder="Property name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="request-unit">Unit</Label>
                <Input
                  id="request-unit"
                  value={newRequest.unit}
                  onChange={(e) => setNewRequest({...newRequest, unit: e.target.value})}
                  placeholder="Unit number"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="request-priority">Priority</Label>
                <Select value={newRequest.priority} onValueChange={(value) => setNewRequest({...newRequest, priority: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={handleAddRequest} className="w-full">
              Create Request
            </Button>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount}</div>
            <p className="text-xs text-muted-foreground">Awaiting assignment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Wrench className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressCount}</div>
            <p className="text-xs text-muted-foreground">Being worked on</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedCount}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Urgent</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{urgentCount}</div>
            <p className="text-xs text-muted-foreground">Need immediate attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search requests..."
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
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterPriority} onValueChange={setFilterPriority}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle>Maintenance Requests</CardTitle>
          <CardDescription>
            All maintenance requests across your properties
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Tenant/Property</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(request.status)}
                      <Badge className={getStatusColor(request.status)}>
                        {request.status}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{request.title}</div>
                      <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                        {request.description}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="flex items-center text-sm">
                        <User className="h-3 w-3 mr-1" />
                        {request.tenant}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {request.property} - Unit {request.unit}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPriorityColor(request.priority)}>
                      {request.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(request.dateCreated).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    {request.assignedTo || <span className="text-muted-foreground">Unassigned</span>}
                  </TableCell>
                  <TableCell>
                    {request.cost ? `$${request.cost}` : <span className="text-muted-foreground">-</span>}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setEditingRequest(request);
                          setIsEditDialogOpen(true);
                        }}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      {request.status === "pending" && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => assignRequest(request.id, "Technician")}
                        >
                          Assign
                        </Button>
                      )}
                      {request.status === "in-progress" && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => updateRequestStatus(request.id, "completed")}
                        >
                          Complete
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Request Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Maintenance Request</DialogTitle>
            <DialogDescription>
              Update the request details.
            </DialogDescription>
          </DialogHeader>
          {editingRequest && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={editingRequest.title}
                  onChange={(e) => setEditingRequest({...editingRequest, title: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editingRequest.description}
                  onChange={(e) => setEditingRequest({...editingRequest, description: e.target.value})}
                  rows={3}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-assigned">Assigned To</Label>
                <Input
                  id="edit-assigned"
                  value={editingRequest.assignedTo || ""}
                  onChange={(e) => setEditingRequest({...editingRequest, assignedTo: e.target.value})}
                  placeholder="Assign to technician"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-cost">Cost</Label>
                <Input
                  id="edit-cost"
                  type="number"
                  value={editingRequest.cost?.toString() || ""}
                  onChange={(e) => setEditingRequest({...editingRequest, cost: parseFloat(e.target.value) || 0})}
                  placeholder="Enter cost"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select 
                  value={editingRequest.status} 
                  onValueChange={(value) => setEditingRequest({...editingRequest, status: value as MaintenanceRequest['status']})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <Button onClick={handleEditRequest} className="w-full">
            Update Request
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MaintenanceTab;
