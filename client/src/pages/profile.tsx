import { useTranslation } from "react-i18next";
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
import LanguageSwitcher from "@/components/language-switcher";
import { useTheme } from "@/components/theme-provider";

export default function ProfilePage() {
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme();

  const menuItems = [
    {
      icon: ShoppingBag,
      label: t('profile.menu.history'),
      description: t('profile.menu.historyDesc'),
    },
    {
      icon: BellRing,
      label: t('profile.menu.notifications'),
      description: t('profile.menu.notificationsDesc'),
    },
    {
      icon: CreditCard,
      label: t('profile.menu.payment'),
      description: t('profile.menu.paymentDesc'),
    },
    {
      icon: Settings,
      label: t('profile.menu.settings'),
      description: t('profile.menu.settingsDesc'),
    },
  ];

  return (
    <div className="container p-4 space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">{t('profile.title')}</h1>
        <p className="text-muted-foreground mt-1">
          {t('profile.subtitle')}
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
              <Label htmlFor="dark-mode">{t('profile.settings.darkMode')}</Label>
              <p className="text-sm text-muted-foreground">
                {t('profile.settings.darkModeDesc')}
              </p>
            </div>
            <Switch
              id="dark-mode"
              checked={theme === "dark"}
              onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{t('profile.settings.language')}</Label>
              <p className="text-sm text-muted-foreground">
                {t('profile.settings.languageDesc')}
              </p>
            </div>
            <LanguageSwitcher />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="price-alerts">{t('profile.settings.priceAlerts')}</Label>
              <p className="text-sm text-muted-foreground">
                {t('profile.settings.priceAlertsDesc')}
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
        {t('profile.signOut')}
      </Button>
    </div>
  );
}