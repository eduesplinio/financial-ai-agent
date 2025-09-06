// MongoDB initialization script
db = db.getSiblingDB('financial_ai');

// Create collections
db.createCollection('users');
db.createCollection('transactions');
db.createCollection('goals');

// Create indexes if needed
db.users.createIndex({ email: 1 }, { unique: true });

// Create admin user if needed
const adminExists = db.users.findOne({ role: 'admin' });
if (!adminExists) {
  db.users.insertOne({
    name: 'Admin User',
    email: 'admin@example.com',
    password: '$2b$10$XyDfY2UkUT8gDVPmvOYFCu8sRKvyVSMdRFMPtdSd1UbKJgdOLT9eq', // hashed 'admin123'
    role: 'admin',
    createdAt: new Date(),
    updatedAt: new Date()
  });
}

print('MongoDB initialization completed');
