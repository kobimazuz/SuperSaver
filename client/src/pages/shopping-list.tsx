import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { ShoppingList, Product } from "@shared/schema";

interface ListItem {
  productId: number;
  quantity: number;
}

export default function ShoppingListPage() {
  const { toast } = useToast();
  const [newListName, setNewListName] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: lists, isLoading } = useQuery<ShoppingList[]>({
    queryKey: ["/api/users/1/shopping-lists"] // Using hardcoded user ID for demo
  });

  const { data: products } = useQuery<Product[]>({
    queryKey: ["/api/products"]
  });

  const createMutation = useMutation({
    mutationFn: async (name: string) => {
      await apiRequest("POST", "/api/shopping-lists", {
        userId: 1, // Hardcoded for demo
        name,
        items: []
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users/1/shopping-lists"] });
      setDialogOpen(false);
      setNewListName("");
      toast({
        title: "Success",
        description: "Shopping list created successfully",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, items }: { id: number; items: ListItem[] }) => {
      await apiRequest("PATCH", `/api/shopping-lists/${id}`, { items });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users/1/shopping-lists"] });
    },
  });

  const handleCreateList = () => {
    if (!newListName.trim()) return;
    createMutation.mutate(newListName);
  };

  return (
    <div className="container p-4 space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Shopping Lists</h1>
          <p className="text-muted-foreground mt-1">
            Manage your shopping lists and compare prices
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New List</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="name">List Name</Label>
                <Input
                  id="name"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  placeholder="e.g., Weekly Groceries"
                />
              </div>
              <Button 
                className="w-full" 
                onClick={handleCreateList}
                disabled={createMutation.isPending}
              >
                Create List
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </header>

      <div className="space-y-4">
        {isLoading ? (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              Loading shopping lists...
            </CardContent>
          </Card>
        ) : lists?.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              No shopping lists yet. Create one to get started!
            </CardContent>
          </Card>
        ) : (
          lists?.map((list) => (
            <Card key={list.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold">{list.name}</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  {(list.items as ListItem[]).map((item, index) => {
                    const product = products?.find(p => p.id === item.productId);
                    return (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg"
                      >
                        <GripVertical className="h-4 w-4 text-muted-foreground" />
                        <span className="flex-1">{product?.name}</span>
                        <span className="text-muted-foreground">
                          x{item.quantity}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <Button 
                  variant="secondary" 
                  className="w-full mt-4"
                  onClick={() => {
                    // Open product selector dialog
                  }}
                >
                  Add Item
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
