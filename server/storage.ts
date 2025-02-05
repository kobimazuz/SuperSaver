import {
  type User, type Product, type Price, type Store,
  type ShoppingList, type Favorite,
  type InsertUser, type InsertProduct, type InsertPrice,
  type InsertStore, type InsertShoppingList, type InsertFavorite
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Products
  getProduct(id: number): Promise<Product | undefined>;
  getProducts(category?: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  
  // Prices
  getPrice(id: number): Promise<Price | undefined>;
  getPricesForProduct(productId: number): Promise<Price[]>;
  createPrice(price: InsertPrice): Promise<Price>;
  
  // Stores
  getStore(id: number): Promise<Store | undefined>;
  getStores(): Promise<Store[]>;
  createStore(store: InsertStore): Promise<Store>;
  
  // Shopping Lists
  getShoppingList(id: number): Promise<ShoppingList | undefined>;
  getShoppingListsForUser(userId: number): Promise<ShoppingList[]>;
  createShoppingList(list: InsertShoppingList): Promise<ShoppingList>;
  updateShoppingList(id: number, items: any[]): Promise<ShoppingList>;
  
  // Favorites
  getFavorite(id: number): Promise<Favorite | undefined>;
  getFavoritesForUser(userId: number): Promise<Favorite[]>;
  createFavorite(favorite: InsertFavorite): Promise<Favorite>;
  deleteFavorite(id: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private products: Map<number, Product>;
  private prices: Map<number, Price>;
  private stores: Map<number, Store>;
  private shoppingLists: Map<number, ShoppingList>;
  private favorites: Map<number, Favorite>;
  private currentId: { [key: string]: number };

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.prices = new Map();
    this.stores = new Map();
    this.shoppingLists = new Map();
    this.favorites = new Map();
    this.currentId = {
      users: 1,
      products: 1,
      prices: 1,
      stores: 1,
      shoppingLists: 1,
      favorites: 1
    };

    // Add some sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Add sample stores
    const sampleStores: InsertStore[] = [
      {
        name: "Super-Sal",
        address: "123 Main St, Tel Aviv",
        lat: "32.0853",
        lng: "34.7818",
        openingHours: { mon: "9-21", tue: "9-21", wed: "9-21", thu: "9-21", fri: "9-14", sat: "closed", sun: "9-21" }
      },
      {
        name: "Rami Levy",
        address: "456 King St, Jerusalem",
        lat: "31.7683",
        lng: "35.2137",
        openingHours: { mon: "9-22", tue: "9-22", wed: "9-22", thu: "9-22", fri: "9-14", sat: "closed", sun: "9-22" }
      }
    ];

    sampleStores.forEach(store => this.createStore(store));

    // Add sample products
    const sampleProducts: InsertProduct[] = [
      {
        name: "Milk 3%",
        description: "Fresh milk",
        category: "Dairy",
        imageUrl: "https://placehold.co/100x100"
      },
      {
        name: "White Bread",
        description: "Fresh bread",
        category: "Bakery",
        imageUrl: "https://placehold.co/100x100"
      }
    ];

    sampleProducts.forEach(product => this.createProduct(product));

    // Add sample prices
    const samplePrices: InsertPrice[] = [
      {
        productId: 1,
        storeId: 1,
        price: 649, // 6.49 ILS
        lastUpdated: new Date()
      },
      {
        productId: 1,
        storeId: 2,
        price: 599, // 5.99 ILS
        lastUpdated: new Date()
      }
    ];

    samplePrices.forEach(price => this.createPrice(price));
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.currentId.users++;
    const newUser = { ...user, id };
    this.users.set(id, newUser);
    return newUser;
  }

  // Products
  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProducts(category?: string): Promise<Product[]> {
    const products = Array.from(this.products.values());
    return category ? products.filter(p => p.category === category) : products;
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const id = this.currentId.products++;
    const newProduct = { ...product, id };
    this.products.set(id, newProduct);
    return newProduct;
  }

  // Prices
  async getPrice(id: number): Promise<Price | undefined> {
    return this.prices.get(id);
  }

  async getPricesForProduct(productId: number): Promise<Price[]> {
    return Array.from(this.prices.values()).filter(p => p.productId === productId);
  }

  async createPrice(price: InsertPrice): Promise<Price> {
    const id = this.currentId.prices++;
    const newPrice = { ...price, id };
    this.prices.set(id, newPrice);
    return newPrice;
  }

  // Stores
  async getStore(id: number): Promise<Store | undefined> {
    return this.stores.get(id);
  }

  async getStores(): Promise<Store[]> {
    return Array.from(this.stores.values());
  }

  async createStore(store: InsertStore): Promise<Store> {
    const id = this.currentId.stores++;
    const newStore = { ...store, id };
    this.stores.set(id, newStore);
    return newStore;
  }

  // Shopping Lists
  async getShoppingList(id: number): Promise<ShoppingList | undefined> {
    return this.shoppingLists.get(id);
  }

  async getShoppingListsForUser(userId: number): Promise<ShoppingList[]> {
    return Array.from(this.shoppingLists.values()).filter(list => list.userId === userId);
  }

  async createShoppingList(list: InsertShoppingList): Promise<ShoppingList> {
    const id = this.currentId.shoppingLists++;
    const newList = { ...list, id };
    this.shoppingLists.set(id, newList);
    return newList;
  }

  async updateShoppingList(id: number, items: any[]): Promise<ShoppingList> {
    const list = this.shoppingLists.get(id);
    if (!list) throw new Error("Shopping list not found");
    const updatedList = { ...list, items };
    this.shoppingLists.set(id, updatedList);
    return updatedList;
  }

  // Favorites
  async getFavorite(id: number): Promise<Favorite | undefined> {
    return this.favorites.get(id);
  }

  async getFavoritesForUser(userId: number): Promise<Favorite[]> {
    return Array.from(this.favorites.values()).filter(f => f.userId === userId);
  }

  async createFavorite(favorite: InsertFavorite): Promise<Favorite> {
    const id = this.currentId.favorites++;
    const newFavorite = { ...favorite, id };
    this.favorites.set(id, newFavorite);
    return newFavorite;
  }

  async deleteFavorite(id: number): Promise<void> {
    this.favorites.delete(id);
  }
}

export const storage = new MemStorage();
