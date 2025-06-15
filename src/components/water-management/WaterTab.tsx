
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WaterSettings from "./WaterSettings";
import WaterBilling from "./WaterBilling";
import WaterReports from "./WaterReports";

const WaterTab = () => {
  const [activeSubTab, setActiveSubTab] = useState("settings");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Water Management</h2>
        <p className="text-muted-foreground">Manage water billing and pricing for your properties</p>
      </div>

      <Tabs value={activeSubTab} onValueChange={setActiveSubTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="settings">Pricing Settings</TabsTrigger>
          <TabsTrigger value="billing">Bills & Invoices</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="settings">
          <WaterSettings />
        </TabsContent>

        <TabsContent value="billing">
          <WaterBilling />
        </TabsContent>

        <TabsContent value="reports">
          <WaterReports />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WaterTab;
