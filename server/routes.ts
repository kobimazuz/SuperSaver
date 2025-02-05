import { Express } from "express";
import { createServer } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertUserSchema, insertShoppingListSchema } from "@shared/schema";
import { z } from "zod";
import { prices } from "@shared/schema";
import { getPersonalizedRecommendations, analyzeShoppingTrends } from "./services/ai";

// Keep track of connected clients
const clients = new Set<WebSocket>();

export function registerRoutes(app: Express) {
  const httpServer = createServer(app);

  // Initialize WebSocket server
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  wss.on('connection', (ws) => {
    clients.add(ws);

    ws.on('close', () => {
      clients.delete(ws);
    });
  });

  // Broadcast price updates to all connected clients
  function broadcastPriceUpdate(productId: number, storeId: number, newPrice: number) {
    const message = JSON.stringify({
      type: 'PRICE_UPDATE',
      data: { productId, storeId, price: newPrice }
    });

    clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }

  // Products
  app.get("/api/products", async (req, res) => {
    const category = req.query.category as string | undefined;
    const products = await storage.getProducts(category);
    res.json(products);
  });

  app.get("/api/products/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const product = await storage.getProduct(id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  });

  // Prices
  app.get("/api/products/:id/prices", async (req, res) => {
    const id = parseInt(req.params.id);
    const prices = await storage.getPricesForProduct(id);
    res.json(prices);
  });

  app.patch("/api/prices/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const newPrice = parseInt(req.body.price);

    try {
      const price = await storage.getPrice(id);
      if (!price) {
        return res.status(404).json({ message: "Price not found" });
      }

      const updatedPrice = await storage.updatePrice(id, newPrice);

      // Broadcast the price update to all connected clients
      broadcastPriceUpdate(updatedPrice.productId, updatedPrice.storeId, updatedPrice.price);

      res.json(updatedPrice);
    } catch (error) {
      res.status(400).json({ message: "Invalid price data" });
    }
  });


  // Stores
  app.get("/api/stores", async (req, res) => {
    const stores = await storage.getStores();
    res.json(stores);
  });

  // Shopping Lists
  app.get("/api/users/:userId/shopping-lists", async (req, res) => {
    const userId = parseInt(req.params.userId);
    const lists = await storage.getShoppingListsForUser(userId);
    res.json(lists);
  });

  app.post("/api/shopping-lists", async (req, res) => {
    try {
      const data = insertShoppingListSchema.parse(req.body);
      const list = await storage.createShoppingList(data);
      res.json(list);
    } catch (error) {
      res.status(400).json({ message: "Invalid shopping list data" });
    }
  });

  app.patch("/api/shopping-lists/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const items = z.array(z.any()).parse(req.body.items);
    try {
      const list = await storage.updateShoppingList(id, items);
      res.json(list);
    } catch (error) {
      res.status(404).json({ message: "Shopping list not found" });
    }
  });

  // Favorites
  app.get("/api/users/:userId/favorites", async (req, res) => {
    const userId = parseInt(req.params.userId);
    const favorites = await storage.getFavoritesForUser(userId);
    res.json(favorites);
  });

  app.post("/api/favorites", async (req, res) => {
    try {
      const favorite = await storage.createFavorite(req.body);
      res.json(favorite);
    } catch (error) {
      res.status(400).json({ message: "Invalid favorite data" });
    }
  });

  app.delete("/api/favorites/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    await storage.deleteFavorite(id);
    res.status(204).send();
  });

  // AI Recommendations
  app.get("/api/users/:userId/recommendations", async (req, res) => {
    const userId = parseInt(req.params.userId);
    try {
      // Get user data
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Get user's shopping history
      const shoppingLists = await storage.getShoppingListsForUser(userId);

      // Get all available products
      const products = await storage.getProducts();

      // Generate recommendations
      const recommendations = await getPersonalizedRecommendations(
        user.preferences,
        shoppingLists,
        products
      );

      res.json(recommendations);
    } catch (error) {
      console.error('Error getting recommendations:', error);
      res.status(500).json({ message: "Failed to generate recommendations" });
    }
  });

  app.get("/api/users/:userId/shopping-analysis", async (req, res) => {
    const userId = parseInt(req.params.userId);
    try {
      // Get user's shopping history
      const shoppingLists = await storage.getShoppingListsForUser(userId);

      // Analyze shopping trends
      const analysis = await analyzeShoppingTrends(shoppingLists);

      res.json({ analysis });
    } catch (error) {
      console.error('Error analyzing shopping trends:', error);
      res.status(500).json({ message: "Failed to analyze shopping trends" });
    }
  });

  return httpServer;
}