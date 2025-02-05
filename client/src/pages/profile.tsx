import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BellRing,
  CreditCard,
  LogOut,
  Settings,
  ShoppingBag,
  User,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function ProfilePage() {
  const menuItems = [
    {
      icon: ShoppingBag,
      label: "Purchase History",
      description: "View your shopping history and receipts",
    },
    {
      icon: BellRing,
      label: "Notifications",
      description: "Manage your notification preferences",
    },
    {
      icon: CreditCard,
      label: "Payment Methods",
      description: "Manage your payment options",
    },
    {
      icon: Settings,
      label: "Settings",
      description: "App settings and preferences",
    },
  ];

  return (
    <div className="container p-4 space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account and preferences
        </p>
      </header>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-4">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-primary" />
            </div>
            <div>
              <CardTitle>John Doe</CardTitle>
              <CardDescription>john.doe@example.com</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="space-y-4">
        {menuItems.map((item) => (
          <Card key={item.label} className="cursor-pointer hover:bg-muted/50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{item.label}</h3>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="dark-mode">Dark Mode</Label>
              <p className="text-sm text-muted-foreground">
                Toggle dark mode theme
              </p>
            </div>
            <Switch id="dark-mode" />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="price-alerts">Price Alerts</Label>
              <p className="text-sm text-muted-foreground">
                Get notified about price drops
              </p>
            </div>
            <Switch id="price-alerts" defaultChecked />
          </div>
        </CardContent>
      </Card>

      <Button
        variant="destructive"
        className="w-full"
        onClick={() => {
          // Handle logout
        }}
      >
        <LogOut className="w-4 h-4 mr-2" />
        Sign Out
      </Button>
    </div>
  );
}
