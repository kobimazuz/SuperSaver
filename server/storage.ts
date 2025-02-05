import { eq } from "drizzle-orm";
import { db } from "./db";
import {
  users, products, prices, stores, shoppingLists, favorites,
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
  updatePrice(id: number, newPrice: number): Promise<Price>;

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

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  // Products
  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async getProducts(category?: string): Promise<Product[]> {
    if (category) {
      return db.select().from(products).where(eq(products.category, category));
    }
    return db.select().from(products);
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db.insert(products).values(product).returning();
    return newProduct;
  }

  // Prices
  async getPrice(id: number): Promise<Price | undefined> {
    const [price] = await db.select().from(prices).where(eq(prices.id, id));
    return price;
  }

  async getPricesForProduct(productId: number): Promise<Price[]> {
    return db.select().from(prices).where(eq(prices.productId, productId));
  }

  async createPrice(price: InsertPrice): Promise<Price> {
    const [newPrice] = await db.insert(prices).values(price).returning();
    return newPrice;
  }

  async updatePrice(id: number, newPrice: number): Promise<Price> {
    const [updatedPrice] = await db
      .update(prices)
      .set({ price: newPrice })
      .where(eq(prices.id, id))
      .returning();
    return updatedPrice;
  }

  // Stores
  async getStore(id: number): Promise<Store | undefined> {
    const [store] = await db.select().from(stores).where(eq(stores.id, id));
    return store;
  }

  async getStores(): Promise<Store[]> {
    return db.select().from(stores);
  }

  async createStore(store: InsertStore): Promise<Store> {
    const [newStore] = await db.insert(stores).values(store).returning();
    return newStore;
  }

  // Shopping Lists
  async getShoppingList(id: number): Promise<ShoppingList | undefined> {
    const [list] = await db.select().from(shoppingLists).where(eq(shoppingLists.id, id));
    return list;
  }

  async getShoppingListsForUser(userId: number): Promise<ShoppingList[]> {
    return db.select().from(shoppingLists).where(eq(shoppingLists.userId, userId));
  }

  async createShoppingList(list: InsertShoppingList): Promise<ShoppingList> {
    const [newList] = await db.insert(shoppingLists).values(list).returning();
    return newList;
  }

  async updateShoppingList(id: number, items: any[]): Promise<ShoppingList> {
    const [updatedList] = await db
      .update(shoppingLists)
      .set({ items })
      .where(eq(shoppingLists.id, id))
      .returning();
    return updatedList;
  }

  // Favorites
  async getFavorite(id: number): Promise<Favorite | undefined> {
    const [favorite] = await db.select().from(favorites).where(eq(favorites.id, id));
    return favorite;
  }

  async getFavoritesForUser(userId: number): Promise<Favorite[]> {
    return db.select().from(favorites).where(eq(favorites.userId, userId));
  }

  async createFavorite(favorite: InsertFavorite): Promise<Favorite> {
    const [newFavorite] = await db.insert(favorites).values(favorite).returning();
    return newFavorite;
  }

  async deleteFavorite(id: number): Promise<void> {
    await db.delete(favorites).where(eq(favorites.id, id));
  }
}

export const storage = new DatabaseStorage();