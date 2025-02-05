import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import StoreMap from "@/components/stores/store-map";
import type { Store } from "@shared/schema";

export default function StoresPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);

  const { data: stores, isLoading } = useQuery<Store[]>({
    queryKey: ["/api/stores"]
  });

  const filteredStores = stores?.filter(store =>
    store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    store.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function formatOpeningHours(hours: Record<string, string>) {
    const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    return days.map((day, index) => (
      <div key={day} className="flex justify-between text-sm">
        <span className="font-medium">{dayNames[index]}</span>
        <span className="text-muted-foreground">{hours[day]}</span>
      </div>
    ));
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="p-4 space-y-4">
        <header>
          <h1 className="text-2xl font-bold tracking-tight">Nearby Stores</h1>
          <p className="text-muted-foreground mt-1">
            Find supermarkets in your area
          </p>
        </header>

        <div className="flex gap-2">
          <Input
            placeholder="Search by name or address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          Loading stores...
        </div>
      ) : (
        <StoreMap
          stores={filteredStores || []}
          onStoreSelect={setSelectedStore}
        />
      )}

      <Sheet open={!!selectedStore} onOpenChange={() => setSelectedStore(null)}>
        <SheetContent side="bottom" className="h-[70vh]">
          {selectedStore && (
            <>
              <SheetHeader>
                <SheetTitle>{selectedStore.name}</SheetTitle>
              </SheetHeader>
              
              <div className="space-y-6 mt-6">
                <div>
                  <h3 className="text-sm font-medium mb-2">Address</h3>
                  <p className="text-muted-foreground">{selectedStore.address}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Opening Hours</h3>
                  <div className="space-y-1">
                    {formatOpeningHours(selectedStore.openingHours)}
                  </div>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
