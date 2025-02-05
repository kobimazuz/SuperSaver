import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translation resources
const resources = {
  en: {
    translation: {
      // General
      appName: "SuperSaver",
      tagline: "Find the best prices in Israeli supermarkets",
      loading: "Loading...",
      search: "Search",
      
      // Navigation
      nav: {
        home: "Home",
        compare: "Compare",
        list: "List",
        stores: "Stores",
        profile: "Profile"
      },
      
      // Home page
      home: {
        deals: "Today's Best Deals",
        searchPlaceholder: "Search for products..."
      },
      
      // Compare page
      compare: {
        title: "Compare Prices",
        subtitle: "Find the best deals across stores",
        selectProduct: "Select a product",
        priceComparison: "Price Comparison"
      },
      
      // Shopping list
      shoppingList: {
        title: "Shopping Lists",
        subtitle: "Manage your shopping lists and compare prices",
        newList: "Create New List",
        listName: "List Name",
        listNamePlaceholder: "e.g., Weekly Groceries",
        createList: "Create List",
        addItem: "Add Item",
        noLists: "No shopping lists yet. Create one to get started!",
        loadingLists: "Loading shopping lists..."
      },
      
      // Stores
      stores: {
        title: "Nearby Stores",
        subtitle: "Find supermarkets in your area",
        searchPlaceholder: "Search by name or address...",
        openingHours: "Opening Hours",
        address: "Address",
        loadingStores: "Loading stores..."
      },
      
      // Profile
      profile: {
        title: "Profile",
        subtitle: "Manage your account and preferences",
        settings: {
          darkMode: "Dark Mode",
          darkModeDesc: "Toggle dark mode theme",
          priceAlerts: "Price Alerts",
          priceAlertsDesc: "Get notified about price drops",
          language: "Language",
          languageDesc: "Change application language"
        },
        menu: {
          history: "Purchase History",
          historyDesc: "View your shopping history and receipts",
          notifications: "Notifications",
          notificationsDesc: "Manage your notification preferences",
          payment: "Payment Methods",
          paymentDesc: "Manage your payment options",
          settings: "Settings",
          settingsDesc: "App settings and preferences"
        },
        signOut: "Sign Out"
      }
    }
  },
  he: {
    translation: {
      // General
      appName: "סופר-סייבר",
      tagline: "מצא את המחירים הטובים ביותר ברשתות המזון",
      loading: "טוען...",
      search: "חיפוש",
      
      // Navigation
      nav: {
        home: "בית",
        compare: "השוואה",
        list: "רשימה",
        stores: "חנויות",
        profile: "פרופיל"
      },
      
      // Home page
      home: {
        deals: "מבצעי היום",
        searchPlaceholder: "חפש מוצרים..."
      },
      
      // Compare page
      compare: {
        title: "השוואת מחירים",
        subtitle: "מצא את המבצעים הטובים ביותר בחנויות",
        selectProduct: "בחר מוצר",
        priceComparison: "השוואת מחירים"
      },
      
      // Shopping list
      shoppingList: {
        title: "רשימות קניות",
        subtitle: "נהל את רשימות הקניות שלך והשווה מחירים",
        newList: "צור רשימה חדשה",
        listName: "שם הרשימה",
        listNamePlaceholder: "לדוגמה: קניות שבועיות",
        createList: "צור רשימה",
        addItem: "הוסף פריט",
        noLists: "אין רשימות קניה עדיין. צור אחת כדי להתחיל!",
        loadingLists: "טוען רשימות קניה..."
      },
      
      // Stores
      stores: {
        title: "חנויות בסביבה",
        subtitle: "מצא סופרמרקטים באזור שלך",
        searchPlaceholder: "חפש לפי שם או כתובת...",
        openingHours: "שעות פתיחה",
        address: "כתובת",
        loadingStores: "טוען חנויות..."
      },
      
      // Profile
      profile: {
        title: "פרופיל",
        subtitle: "נהל את החשבון וההעדפות שלך",
        settings: {
          darkMode: "מצב כהה",
          darkModeDesc: "החלף למצב כהה",
          priceAlerts: "התראות מחיר",
          priceAlertsDesc: "קבל התראות על ירידות מחירים",
          language: "שפה",
          languageDesc: "שנה את שפת האפליקציה"
        },
        menu: {
          history: "היסטוריית קניות",
          historyDesc: "צפה בהיסטוריית הקניות והקבלות שלך",
          notifications: "התראות",
          notificationsDesc: "נהל את העדפות ההתראות שלך",
          payment: "אמצעי תשלום",
          paymentDesc: "נהל את אפשרויות התשלום שלך",
          settings: "הגדרות",
          settingsDesc: "הגדרות ואפשרויות יישום"
        },
        signOut: "התנתק"
      }
    }
  }
};

// Initialize i18next
i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "he", // Default language
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
