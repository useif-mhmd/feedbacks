import { Settings, Customer, Feedback } from "@shared/types";

// In-memory storage for development when MongoDB is not available
class MockStorage {
  private settings: Settings = {
    whatsappConnected: false,
    smtpConfig: {
      email: "",
      password: "",
      host: "smtp.gmail.com",
      port: 587,
    },
    smsMessage: "من فضلك قيم زيارتك من 1 إلى 5 عبر الرد على الرسالة. شكراً!",
    googleMapsLink: "https://maps.google.com/your-business-location",
  };

  private customers: Customer[] = [];
  private feedback: Feedback[] = [
    {
      _id: "1",
      customerId: "1",
      customerPhone: "+201234567890",
      customerName: "أحمد محمد",
      rating: 2,
      reason: "الخدمة بطيئة جداً",
      source: "whatsapp",
      status: "processed",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: "2",
      customerId: "2",
      customerPhone: "+201234567891",
      customerName: "فاطمة علي",
      rating: 3,
      reason: "المكان غير نظيف",
      source: "email",
      status: "processed",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  // Settings methods
  getSettings(): Settings {
    return { ...this.settings };
  }

  updateSettings(updates: Partial<Settings>): Settings {
    this.settings = { ...this.settings, ...updates };
    return { ...this.settings };
  }

  updateSmtpConfig(smtpConfig: Settings["smtpConfig"]): Settings {
    this.settings.smtpConfig = { ...smtpConfig };
    return { ...this.settings };
  }

  updateSmsMessage(message: string): Settings {
    this.settings.smsMessage = message;
    return { ...this.settings };
  }

  // Customer methods
  getCustomers(): Customer[] {
    return [...this.customers];
  }

  addCustomers(newCustomers: Omit<Customer, "_id">[]): Customer[] {
    const addedCustomers: Customer[] = [];

    newCustomers.forEach((customerData) => {
      // Check if customer already exists
      const existingIndex = this.customers.findIndex(
        (c) => c.phone === customerData.phone,
      );

      if (existingIndex >= 0) {
        // Update existing customer
        this.customers[existingIndex] = {
          ...this.customers[existingIndex],
          ...customerData,
          _id: this.customers[existingIndex]._id,
        };
        addedCustomers.push(this.customers[existingIndex]);
      } else {
        // Add new customer
        const newCustomer: Customer = {
          ...customerData,
          _id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        this.customers.push(newCustomer);
        addedCustomers.push(newCustomer);
      }
    });

    return addedCustomers;
  }

  findCustomersByIds(ids: string[]): Customer[] {
    return this.customers.filter((c) => ids.includes(c._id!));
  }

  findCustomersWithEmail(ids: string[]): Customer[] {
    return this.customers.filter(
      (c) => ids.includes(c._id!) && c.email && c.email.trim() !== "",
    );
  }

  // Feedback methods
  getFeedback(): Feedback[] {
    return [...this.feedback];
  }

  getNegativeFeedback(): Feedback[] {
    return this.feedback.filter((f) => f.rating < 4);
  }

  addFeedback(
    feedbackData: Omit<Feedback, "_id" | "createdAt" | "updatedAt">,
  ): Feedback {
    const newFeedback: Feedback = {
      ...feedbackData,
      _id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.feedback.push(newFeedback);
    return newFeedback;
  }

  updateFeedbackStatus(
    id: string,
    status: "pending" | "processed",
  ): Feedback | null {
    const feedbackIndex = this.feedback.findIndex((f) => f._id === id);
    if (feedbackIndex >= 0) {
      this.feedback[feedbackIndex].status = status;
      this.feedback[feedbackIndex].updatedAt = new Date().toISOString();
      return this.feedback[feedbackIndex];
    }
    return null;
  }

  // Find customer by phone
  findCustomerByPhone(phone: string): Customer | null {
    return this.customers.find((c) => c.phone === phone) || null;
  }

  // Add or update customer
  upsertCustomer(customerData: Omit<Customer, "_id">): Customer {
    const existingIndex = this.customers.findIndex(
      (c) => c.phone === customerData.phone,
    );

    if (existingIndex >= 0) {
      this.customers[existingIndex] = {
        ...this.customers[existingIndex],
        ...customerData,
        updatedAt: new Date().toISOString(),
      };
      return this.customers[existingIndex];
    } else {
      const newCustomer: Customer = {
        ...customerData,
        _id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      this.customers.push(newCustomer);
      return newCustomer;
    }
  }
}

export const mockStorage = new MockStorage();
