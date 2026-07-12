import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import pool from "./db.js";

const DEFAULT_ADMIN_PASSWORD = "Admin@123";

const DEFAULT_PRODUCTS = [
  {
    id: "1",
    name: "Premium Chains",
    description: "Exquisite 925 silver chains with German precision",
    image: "/assets/SilverChain.jpeg",
    category: "Chains",
    badge: "Top Selling",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Designer Kada",
    description: "Elegant kadas crafted with traditional methods",
    image: "/assets/kada2.jpeg",
    category: "Kada",
    badge: "Popular",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Elegant Mani",
    description: "Traditional mani in pure silver",
    image: "/assets/banglles.jpeg",
    category: "Bangles",
    badge: "Top Selling",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "4",
    name: "Classic Ganthan",
    description: "Classic ganthan designs with intricate detailing",
    image: "/assets/GoldChainn.jpeg",
    category: "Ganthan",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "5",
    name: "Traditional Payal",
    description: "Traditional payals for festive occasions",
    image: "/assets/painjanss.jpeg",
    category: "Payal",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "6",
    name: "Exquisite Rings",
    description: "Premium rings with German precision",
    image: "/assets/Bangles.jpeg",
    category: "Rings",
    badge: "Top Selling",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "7",
    name: "Luxury Bangles",
    description: "Luxury bangle collection for special occasions",
    image: "/assets/Bangglee.jpeg",
    category: "Bangles",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "8",
    name: "Bridal Collection",
    description: "Exquisite bridal jewelry collection",
    image: "/assets/neclase3.jpeg",
    category: "Bridal",
    badge: "Premium",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "9",
    name: "Earring Collection",
    description: "Beautiful earring designs for all occasions",
    image: "/assets/EarFlow.jpeg",
    category: "Earrings",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

let dbInitialized = false;

async function initDb() {
  if (dbInitialized) return;

  try {
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
      console.log("Default admin seeded successfully.");
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
      console.log("Default products seeded successfully.");
    }

    dbInitialized = true;
  } catch (error) {
    console.error("Error initializing database:", error);
  }
}

// Middleware to ensure database is initialized on every request
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
    const resAdmin = await pool.query(
      "SELECT * FROM admin WHERE session_token = $1 AND session_expires > $2",
      [token, Date.now()]
    );
    const admin = resAdmin.rows[0];

    if (!admin) {
      return res.status(401).json({ message: "Invalid or expired session token." });
    }

    req.admin = admin;
    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    return res.status(500).json({ message: "Internal server authentication error." });
  }
}

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  try {
    const resAdmin = await pool.query("SELECT * FROM admin WHERE username = $1", [username]);
    const admin = resAdmin.rows[0];

    if (!admin || !bcrypt.compareSync(password, admin.password_hash)) {
      return res.status(401).json({ message: "Invalid username or password." });
    }

    const sessionToken = createToken();
    const sessionExpires = Date.now() + 1000 * 60 * 60 * 4;

    await pool.query(
      "UPDATE admin SET session_token = $1, session_expires = $2 WHERE username = $3",
      [sessionToken, sessionExpires, username]
    );

    res.json({ token: sessionToken, username: admin.username });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Database error during login." });
  }
});

app.post("/api/forgot-password", async (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ message: "Username is required." });
  }

  try {
    const resAdmin = await pool.query("SELECT * FROM admin WHERE username = $1", [username]);
    if (resAdmin.rows.length === 0) {
      return res.status(400).json({ message: "Admin account not found." });
    }

    const resetToken = Math.random().toString(36).slice(2, 10).toUpperCase();
    const resetExpires = Date.now() + 1000 * 60 * 15;

    await pool.query(
      "UPDATE admin SET reset_token = $1, reset_expires = $2 WHERE username = $3",
      [resetToken, resetExpires, username]
    );

    res.json({
      message: "Reset code generated. Use it to set a new password.",
      resetCode: resetToken,
    });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ message: "Database error generating reset code." });
  }
});

app.post("/api/reset-password", async (req, res) => {
  const { username, resetToken, newPassword } = req.body;

  if (!username || !resetToken || !newPassword) {
    return res.status(400).json({ message: "Username, reset code, and new password are required." });
  }

  try {
    const resAdmin = await pool.query("SELECT * FROM admin WHERE username = $1", [username]);
    const admin = resAdmin.rows[0];

    if (!admin) {
      return res.status(400).json({ message: "Admin account not found." });
    }

    if (!admin.reset_token || admin.reset_token !== resetToken || Number(admin.reset_expires) < Date.now()) {
      return res.status(400).json({ message: "Reset token is invalid or expired." });
    }

    const passwordHash = bcrypt.hashSync(newPassword, 10);
    await pool.query(
      "UPDATE admin SET password_hash = $1, reset_token = NULL, reset_expires = NULL WHERE username = $2",
      [passwordHash, username]
    );

    res.json({ message: "Password has been reset successfully." });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ message: "Database error resetting password." });
  }
});

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
    await pool.query(
      "UPDATE admin SET password_hash = $1 WHERE username = $2",
      [passwordHash, req.admin.username]
    );

    res.json({ message: "Password updated successfully." });
  } catch (err) {
    console.error("Change password error:", err);
    res.status(500).json({ message: "Database error updating password." });
  }
});

app.get("/api/products", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM products ORDER BY created_at ASC");
    const products = result.rows.map(row => ({
      id: row.id,
      name: row.name,
      description: row.description,
      image: row.image,
      category: row.category,
      badge: row.badge,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }));
    res.json(products);
  } catch (err) {
    console.error("Get products error:", err);
    res.status(500).json({ message: "Database error retrieving products." });
  }
});

app.get("/api/categories", async (req, res) => {
  try {
    const result = await pool.query("SELECT DISTINCT category FROM products");
    const categories = result.rows.map(row => row.category).filter(Boolean);
    res.json(categories);
  } catch (err) {
    console.error("Get categories error:", err);
    res.status(500).json({ message: "Database error retrieving categories." });
  }
});

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
    updatedAt: new Date().toISOString()
  };

  try {
    await pool.query(
      "INSERT INTO products (id, name, description, image, category, badge, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
      [newProduct.id, newProduct.name, newProduct.description, newProduct.image, newProduct.category, newProduct.badge, newProduct.createdAt, newProduct.updatedAt]
    );
    res.json(newProduct);
  } catch (err) {
    console.error("Create product error:", err);
    res.status(500).json({ message: "Database error creating product." });
  }
});

app.put("/api/products/:id", requireAuth, async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const resProduct = await pool.query("SELECT * FROM products WHERE id = $1", [id]);
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
      updatedAt: new Date().toISOString()
    };

    await pool.query(
      "UPDATE products SET name = $1, description = $2, image = $3, category = $4, badge = $5, updated_at = $6 WHERE id = $7",
      [updatedProduct.name, updatedProduct.description, updatedProduct.image, updatedProduct.category, updatedProduct.badge, updatedProduct.updatedAt, id]
    );

    res.json({
      id,
      ...updatedProduct,
      createdAt: product.created_at
    });
  } catch (err) {
    console.error("Update product error:", err);
    res.status(500).json({ message: "Database error updating product." });
  }
});

app.delete("/api/products/:id", requireAuth, async (req, res) => {
  const { id } = req.params;

  try {
    const resDelete = await pool.query("DELETE FROM products WHERE id = $1", [id]);
    if (resDelete.rowCount === 0) {
      return res.status(404).json({ message: "Product not found." });
    }
    res.json({ success: true });
  } catch (err) {
    console.error("Delete product error:", err);
    res.status(500).json({ message: "Database error deleting product." });
  }
});

// Run server locally when executed directly
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server running locally on http://localhost:${PORT}`);
  });
}

export default app;
