import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import pool from "./db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, "..", "data");
const LOCAL_DB_PATH = path.join(DATA_DIR, "db.json");

const DEFAULT_ADMIN_PASSWORD = "Admin@123";

const ALL_ASSETS = [
  { img: "/assets/SilverChain.jpeg", name: "Premium 925 Silver Chain", category: "Chains", badge: "Top Selling" },
  { img: "/assets/kada2.jpeg", name: "Designer Kada", category: "Kada", badge: "Popular" },
  { img: "/assets/banglles.jpeg", name: "Elegant Mani Bangles", category: "Bangles", badge: "Top Selling" },
  { img: "/assets/GoldChainn.jpeg", name: "Classic Ganthan Chain", category: "Chains", badge: "Featured" },
  { img: "/assets/painjanss.jpeg", name: "Festive Payal Set", category: "Payal", badge: "Popular" },
  { img: "/assets/Bangles.jpeg", name: "Classic Silver Bangles", category: "Bangles", badge: "Top Selling" },
  { img: "/assets/Bangglee.jpeg", name: "Luxury Bangles", category: "Bangles", badge: "New" },
  { img: "/assets/neclase3.jpeg", name: "Exquisite Bridal Set", category: "Bridal Collection", badge: "Premium" },
  { img: "/assets/EarFlow.jpeg", name: "Floral Drop Earrings", category: "Earrings", badge: "Top Selling" },
  { img: "/assets/bangales.jpeg", name: "Bangles Collection", category: "Bangles" },
  { img: "/assets/bangl.jpeg", name: "Designer Silver Bangles", category: "Bangles" },
  { img: "/assets/bengal1.jpeg", name: "Traditional Bengal Bangle", category: "Bangles" },
  { img: "/assets/BigKadda.jpeg", name: "Royal Heavy Kada", category: "Kada", badge: "Hot" },
  { img: "/assets/chain.jpeg", name: "Silver Chain", category: "Chains" },
  { img: "/assets/CrownEar.jpeg", name: "Crown Diamond Earrings", category: "Earrings" },
  { img: "/assets/DimondEar.jpeg", name: "Diamond Sparkle Earrings", category: "Earrings" },
  { img: "/assets/ear ring.jpeg", name: "Classic Ear Ring", category: "Earrings" },
  { img: "/assets/EarFool.jpeg", name: "Full Bloom Earrings", category: "Earrings" },
  { img: "/assets/FloewrEar.jpeg", name: "Flower Cluster Earrings", category: "Earrings" },
  { img: "/assets/FlowerEar.jpeg", name: "Botanical Silver Earrings", category: "Earrings" },
  { img: "/assets/golC.jpeg", name: "Gold Tone Chain", category: "Chains" },
  { img: "/assets/GoldChain.jpeg", name: "Premium Gold Plated Chain", category: "Chains" },
  { img: "/assets/HeartEar.jpeg", name: "Heart Silver Earrings", category: "Earrings" },
  { img: "/assets/JayJalaJA.jpeg", name: "Jay Jalaram Silver Kada", category: "Kada" },
  { img: "/assets/JAyMAhakal.jpeg", name: "Jay Mahakal Antique Kada", category: "Kada", badge: "Trending" },
  { img: "/assets/Kada.jpeg", name: "Traditional Silver Kada", category: "Kada" },
  { img: "/assets/kada1.jpeg", name: "Engraved Kada", category: "Kada" },
  { img: "/assets/KaddaNamo.jpeg", name: "Namo Engraved Kada", category: "Kada" },
  { img: "/assets/Nec4.jpeg", name: "Bridal Necklace Set 4", category: "Bridal Collection" },
  { img: "/assets/Necalase.jpeg", name: "Royal Silver Necklace", category: "Bridal Collection" },
  { img: "/assets/necc.jpeg", name: "Intricate Silver Choker", category: "Bridal Collection" },
  { img: "/assets/neclase.jpeg", name: "Traditional Silver Necklace", category: "Bridal Collection" },
  { img: "/assets/neclase2.jpeg", name: "Luxury Statement Necklace", category: "Bridal Collection" },
  { img: "/assets/necSilver.jpeg", name: "Silver Pendant Necklace", category: "Bridal Collection" },
  { img: "/assets/paijan.jpeg", name: "Traditional Payal", category: "Payal" },
  { img: "/assets/Painjan.jpeg", name: "Silver Painjan", category: "Payal" },
  { img: "/assets/PAyal.jpeg", name: "Classic Anklet Payal", category: "Payal" },
  { img: "/assets/RadheKada.jpeg", name: "Radhe Krishna Kada", category: "Kada" },
  { img: "/assets/ring.jpeg", name: "Silver Ring", category: "Rings" },
  { img: "/assets/SilverChainss.jpeg", name: "Dual Strand Silver Chain", category: "Chains" },
  { img: "/assets/SilverGold.jpeg", name: "Silver & Gold Fusion Chain", category: "Chains" },
  { img: "/assets/WhatsApp Image 2026-04-19 at 7.41.24 PM.jpeg", name: "Special Edition Bridal Set", category: "Bridal Collection" }
];

const DEFAULT_PRODUCTS = ALL_ASSETS.map((item, index) => ({
  id: String(index + 1),
  name: item.name,
  description: `Handcrafted 925 pure silver ${item.name.toLowerCase()} with German precision finishing.`,
  image: item.img,
  category: item.category,
  badge: item.badge || null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}));

// Local JSON DB Helper
function ensureLocalDbFile() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(LOCAL_DB_PATH)) {
      const initialDb = {
        admin: {
          username: "admin",
          password_hash: bcrypt.hashSync(DEFAULT_ADMIN_PASSWORD, 10),
          reset_token: null,
          reset_expires: null,
          session_token: null,
          session_expires: null,
        },
        products: DEFAULT_PRODUCTS,
      };
      fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(initialDb, null, 2), "utf8");
    }
  } catch (err) {
    console.error("Error creating local JSON database file:", err);
  }
}

function readLocalDb() {
  ensureLocalDbFile();
  try {
    const raw = fs.readFileSync(LOCAL_DB_PATH, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading local DB, returning default state:", err);
    return {
      admin: {
        username: "admin",
        password_hash: bcrypt.hashSync(DEFAULT_ADMIN_PASSWORD, 10),
        reset_token: null,
        reset_expires: null,
        session_token: null,
        session_expires: null,
      },
      products: DEFAULT_PRODUCTS,
    };
  }
}

function writeLocalDb(data) {
  ensureLocalDbFile();
  try {
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.error("Error writing to local DB:", err);
  }
}

let isPgAvailable = false;
let dbInitialized = false;

async function initDb() {
  if (dbInitialized) return;

  try {
    // Check postgres connection
    if (process.env.DATABASE_URL || process.env.POSTGRES_URL) {
      await pool.query("SELECT 1");
      isPgAvailable = true;

      // 1. Create admin table
      await pool.query(`
        CREATE TABLE IF NOT EXISTS admin (
          username VARCHAR(255) PRIMARY KEY,
          password_hash VARCHAR(255) NOT NULL,
          reset_token VARCHAR(255),
          reset_expires BIGINT,
          session_token VARCHAR(255),
          session_expires BIGINT
        )
      `);

      // 2. Create products table
      await pool.query(`
        CREATE TABLE IF NOT EXISTS products (
          id VARCHAR(255) PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          description TEXT NOT NULL,
          image TEXT NOT NULL,
          category VARCHAR(255) NOT NULL,
          badge VARCHAR(255),
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL
        )
      `);

      // 3. Seed default admin if empty
      const adminCheck = await pool.query("SELECT * FROM admin");
      if (adminCheck.rows.length === 0) {
        const passwordHash = bcrypt.hashSync(DEFAULT_ADMIN_PASSWORD, 10);
        await pool.query(
          "INSERT INTO admin (username, password_hash, reset_token, reset_expires, session_token, session_expires) VALUES ($1, $2, $3, $4, $5, $6)",
          ["admin", passwordHash, null, null, null, null]
        );
      }

      // 4. Seed default products if empty
      const productCheck = await pool.query("SELECT * FROM products LIMIT 1");
      if (productCheck.rows.length === 0) {
        for (const prod of DEFAULT_PRODUCTS) {
          await pool.query(
            "INSERT INTO products (id, name, description, image, category, badge, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
            [prod.id, prod.name, prod.description, prod.image, prod.category, prod.badge || null, prod.createdAt, prod.updatedAt]
          );
        }
      }
    } else {
      ensureLocalDbFile();
    }
  } catch (error) {
    console.warn("PostgreSQL not accessible, falling back to local JSON database:", error.message);
    isPgAvailable = false;
    ensureLocalDbFile();
  } finally {
    dbInitialized = true;
  }
}

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use(async (req, res, next) => {
  await initDb();
  next();
});

function createToken() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Authorization token required." });
  }

  try {
    if (isPgAvailable) {
      const resAdmin = await pool.query(
        "SELECT * FROM admin WHERE session_token = $1 AND session_expires > $2",
        [token, Date.now()]
      );
      const admin = resAdmin.rows[0];
      if (!admin) {
        return res.status(401).json({ message: "Invalid or expired session token." });
      }
      req.admin = admin;
    } else {
      const localDb = readLocalDb();
      const admin = localDb.admin;
      if (!admin.session_token || admin.session_token !== token || Number(admin.session_expires) < Date.now()) {
        return res.status(401).json({ message: "Invalid or expired session token." });
      }
      req.admin = admin;
    }
    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    return res.status(500).json({ message: "Internal server authentication error." });
  }
}

// LOGIN
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  try {
    let admin = null;
    if (isPgAvailable) {
      const resAdmin = await pool.query("SELECT * FROM admin WHERE username = $1", [username]);
      admin = resAdmin.rows[0];
    } else {
      const localDb = readLocalDb();
      if (localDb.admin && localDb.admin.username === username) {
        admin = localDb.admin;
      }
    }

    if (!admin || !bcrypt.compareSync(password, admin.password_hash)) {
      return res.status(401).json({ message: "Invalid username or password." });
    }

    const sessionToken = createToken();
    const sessionExpires = Date.now() + 1000 * 60 * 60 * 4;

    if (isPgAvailable) {
      await pool.query(
        "UPDATE admin SET session_token = $1, session_expires = $2 WHERE username = $3",
        [sessionToken, sessionExpires, username]
      );
    } else {
      const localDb = readLocalDb();
      localDb.admin.session_token = sessionToken;
      localDb.admin.session_expires = sessionExpires;
      writeLocalDb(localDb);
    }

    res.json({ token: sessionToken, username: admin.username });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: `Error during login: ${err.message}` });
  }
});

// FORGOT PASSWORD
app.post("/api/forgot-password", async (req, res) => {
  const { username } = req.body;
  if (!username) {
    return res.status(400).json({ message: "Username is required." });
  }

  try {
    const resetToken = Math.random().toString(36).slice(2, 10).toUpperCase();
    const resetExpires = Date.now() + 1000 * 60 * 15;

    if (isPgAvailable) {
      const resAdmin = await pool.query("SELECT * FROM admin WHERE username = $1", [username]);
      if (resAdmin.rows.length === 0) {
        return res.status(400).json({ message: "Admin account not found." });
      }
      await pool.query(
        "UPDATE admin SET reset_token = $1, reset_expires = $2 WHERE username = $3",
        [resetToken, resetExpires, username]
      );
    } else {
      const localDb = readLocalDb();
      if (!localDb.admin || localDb.admin.username !== username) {
        return res.status(400).json({ message: "Admin account not found." });
      }
      localDb.admin.reset_token = resetToken;
      localDb.admin.reset_expires = resetExpires;
      writeLocalDb(localDb);
    }

    res.json({
      message: "Reset code generated. Use it to set a new password.",
      resetCode: resetToken,
    });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ message: "Error generating reset code." });
  }
});

// RESET PASSWORD
app.post("/api/reset-password", async (req, res) => {
  const { username, resetToken, newPassword } = req.body;
  if (!username || !resetToken || !newPassword) {
    return res.status(400).json({ message: "Username, reset code, and new password are required." });
  }

  try {
    const passwordHash = bcrypt.hashSync(newPassword, 10);

    if (isPgAvailable) {
      const resAdmin = await pool.query("SELECT * FROM admin WHERE username = $1", [username]);
      const admin = resAdmin.rows[0];
      if (!admin) return res.status(400).json({ message: "Admin account not found." });
      if (!admin.reset_token || admin.reset_token !== resetToken || Number(admin.reset_expires) < Date.now()) {
        return res.status(400).json({ message: "Reset token is invalid or expired." });
      }
      await pool.query(
        "UPDATE admin SET password_hash = $1, reset_token = NULL, reset_expires = NULL WHERE username = $2",
        [passwordHash, username]
      );
    } else {
      const localDb = readLocalDb();
      const admin = localDb.admin;
      if (!admin || admin.username !== username) {
        return res.status(400).json({ message: "Admin account not found." });
      }
      if (!admin.reset_token || admin.reset_token !== resetToken || Number(admin.reset_expires) < Date.now()) {
        return res.status(400).json({ message: "Reset token is invalid or expired." });
      }
      localDb.admin.password_hash = passwordHash;
      localDb.admin.reset_token = null;
      localDb.admin.reset_expires = null;
      writeLocalDb(localDb);
    }

    res.json({ message: "Password has been reset successfully." });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ message: "Error resetting password." });
  }
});

// CHANGE PASSWORD
app.post("/api/change-password", requireAuth, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: "Current password and new password are required." });
  }

  try {
    if (!bcrypt.compareSync(currentPassword, req.admin.password_hash)) {
      return res.status(400).json({ message: "Current password is incorrect." });
    }

    const passwordHash = bcrypt.hashSync(newPassword, 10);
    if (isPgAvailable) {
      await pool.query(
        "UPDATE admin SET password_hash = $1 WHERE username = $2",
        [passwordHash, req.admin.username]
      );
    } else {
      const localDb = readLocalDb();
      localDb.admin.password_hash = passwordHash;
      writeLocalDb(localDb);
    }

    res.json({ message: "Password updated successfully." });
  } catch (err) {
    console.error("Change password error:", err);
    res.status(500).json({ message: "Error updating password." });
  }
});

// GET PRODUCTS
app.get("/api/products", async (req, res) => {
  try {
    if (isPgAvailable) {
      const result = await pool.query("SELECT * FROM products ORDER BY created_at ASC");
      const products = result.rows.map((row) => ({
        id: String(row.id),
        name: row.name,
        description: row.description,
        image: row.image,
        category: row.category,
        badge: row.badge,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }));
      res.json(products);
    } else {
      const localDb = readLocalDb();
      res.json(localDb.products || []);
    }
  } catch (err) {
    console.error("Get products error:", err);
    res.status(500).json({ message: "Error retrieving products." });
  }
});

// GET CATEGORIES
app.get("/api/categories", async (req, res) => {
  try {
    if (isPgAvailable) {
      const result = await pool.query("SELECT DISTINCT category FROM products");
      const categories = result.rows.map((row) => row.category).filter(Boolean);
      res.json(categories);
    } else {
      const localDb = readLocalDb();
      const categories = Array.from(
        new Set((localDb.products || []).map((p) => p.category).filter(Boolean))
      );
      res.json(categories);
    }
  } catch (err) {
    console.error("Get categories error:", err);
    res.status(500).json({ message: "Error retrieving categories." });
  }
});

// CREATE PRODUCT
app.post("/api/products", requireAuth, async (req, res) => {
  const { name, description, image, category, badge } = req.body;
  if (!name || !category || !image) {
    return res.status(400).json({ message: "Name, category, and image are required." });
  }

  const newProduct = {
    id: Date.now().toString(),
    name,
    description: description || "",
    image,
    category,
    badge: badge || null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  try {
    if (isPgAvailable) {
      await pool.query(
        "INSERT INTO products (id, name, description, image, category, badge, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
        [
          newProduct.id,
          newProduct.name,
          newProduct.description,
          newProduct.image,
          newProduct.category,
          newProduct.badge,
          newProduct.createdAt,
          newProduct.updatedAt,
        ]
      );
    } else {
      const localDb = readLocalDb();
      localDb.products.push(newProduct);
      writeLocalDb(localDb);
    }
    res.json(newProduct);
  } catch (err) {
    console.error("Create product error:", err);
    res.status(500).json({ message: "Error creating product." });
  }
});

// UPDATE PRODUCT
app.put("/api/products/:id", requireAuth, async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    if (isPgAvailable) {
      const resProduct = await pool.query("SELECT * FROM products WHERE id = $1", [String(id)]);
      if (resProduct.rows.length === 0) {
        return res.status(404).json({ message: "Product not found." });
      }
      const product = resProduct.rows[0];

      const updatedProduct = {
        name: updates.name !== undefined ? updates.name : product.name,
        description: updates.description !== undefined ? updates.description : product.description,
        image: updates.image !== undefined ? updates.image : product.image,
        category: updates.category !== undefined ? updates.category : product.category,
        badge: updates.badge !== undefined ? updates.badge : product.badge,
        updatedAt: new Date().toISOString(),
      };

      await pool.query(
        "UPDATE products SET name = $1, description = $2, image = $3, category = $4, badge = $5, updated_at = $6 WHERE id = $7",
        [
          updatedProduct.name,
          updatedProduct.description,
          updatedProduct.image,
          updatedProduct.category,
          updatedProduct.badge || null,
          updatedProduct.updatedAt,
          String(id),
        ]
      );

      res.json({
        id: String(id),
        ...updatedProduct,
        createdAt: product.created_at,
      });
    } else {
      const localDb = readLocalDb();
      const index = (localDb.products || []).findIndex((p) => String(p.id) === String(id));
      if (index === -1) {
        return res.status(404).json({ message: "Product not found." });
      }

      const existing = localDb.products[index];
      const updatedProduct = {
        ...existing,
        name: updates.name !== undefined ? updates.name : existing.name,
        description: updates.description !== undefined ? updates.description : existing.description,
        image: updates.image !== undefined ? updates.image : existing.image,
        category: updates.category !== undefined ? updates.category : existing.category,
        badge: updates.badge !== undefined ? updates.badge : existing.badge,
        updatedAt: new Date().toISOString(),
      };

      localDb.products[index] = updatedProduct;
      writeLocalDb(localDb);
      res.json(updatedProduct);
    }
  } catch (err) {
    console.error("Update product error:", err);
    res.status(500).json({ message: "Error updating product." });
  }
});

// DELETE PRODUCT
app.delete("/api/products/:id", requireAuth, async (req, res) => {
  const { id } = req.params;

  try {
    if (isPgAvailable) {
      const resDelete = await pool.query("DELETE FROM products WHERE id = $1", [String(id)]);
      if (resDelete.rowCount === 0) {
        return res.status(404).json({ message: "Product not found." });
      }
      res.json({ success: true, id: String(id) });
    } else {
      const localDb = readLocalDb();
      const initialLength = (localDb.products || []).length;
      localDb.products = (localDb.products || []).filter((p) => String(p.id) !== String(id));

      if (localDb.products.length === initialLength) {
        return res.status(404).json({ message: "Product not found." });
      }

      writeLocalDb(localDb);
      res.json({ success: true, id: String(id) });
    }
  } catch (err) {
    console.error("Delete product error:", err);
    res.status(500).json({ message: "Error deleting product." });
  }
});

if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server running locally on http://localhost:${PORT}`);
  });
}

export default app;
