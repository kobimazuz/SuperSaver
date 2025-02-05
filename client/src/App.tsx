import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import BottomNav from "./components/layout/bottom-nav";
import NotFound from "./pages/not-found";
import Home from "./pages/home";
import Compare from "./pages/compare";
import ShoppingList from "./pages/shopping-list";
import Stores from "./pages/stores";
import Profile from "./pages/profile";
import { useTranslation } from "react-i18next";

function Router() {
  const { i18n } = useTranslation();

  return (
    <div className={`min-h-screen pb-16 ${i18n.language === 'he' ? 'rtl' : 'ltr'}`}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/compare" component={Compare} />
        <Route path="/list" component={ShoppingList} />
        <Route path="/stores" component={Stores} />
        <Route path="/profile" component={Profile} />
        <Route component={NotFound} />
      </Switch>
      <BottomNav />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="supersaver-theme">
        <Router />
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;