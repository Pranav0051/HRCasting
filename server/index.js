import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, "data.json");
const DEFAULT_ADMIN_PASSWORD = "Admin@123";
const PORT = process.env.PORT || 4000;

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


async function loadData() {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    const data = JSON.parse(raw);

    if (!data.admin || !data.admin.passwordHash) {
      const passwordHash = bcrypt.hashSync(DEFAULT_ADMIN_PASSWORD, 10);
      data.admin = {
        username: "admin",
        passwordHash,
        resetToken: null,
        resetExpires: null,
        sessionToken: null,
        sessionExpires: null,
      };
      await saveData(data);
    }

    if (!Array.isArray(data.products)) {
      data.products = DEFAULT_PRODUCTS;
      await saveData(data);
    }

    return data;
  } catch (error) {
    const data = {
      admin: {
        username: "admin",
        passwordHash: bcrypt.hashSync(DEFAULT_ADMIN_PASSWORD, 10),
        resetToken: null,
        resetExpires: null,
        sessionToken: null,
        sessionExpires: null,
      },
      products: DEFAULT_PRODUCTS,
    };
    await saveData(data);
    return data;
  }
}

async function saveData(data) {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
}

function createToken() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Authorization token required." });
  }

  const data = await loadData();
  const admin = data.admin;
  if (!admin.sessionToken || admin.sessionToken !== token || admin.sessionExpires < Date.now()) {
    return res.status(401).json({ message: "Invalid or expired session token." });
  }

  req.admin = admin;
  next();
}

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  const data = await loadData();

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  const admin = data.admin;
  if (admin.username !== username || !bcrypt.compareSync(password, admin.passwordHash)) {
    return res.status(401).json({ message: "Invalid username or password." });
  }

  const sessionToken = createToken();
  admin.sessionToken = sessionToken;
  admin.sessionExpires = Date.now() + 1000 * 60 * 60 * 4;
  await saveData(data);

  res.json({ token: sessionToken, username: admin.username });
});

app.post("/api/forgot-password", async (req, res) => {
  const { username } = req.body;
  const data = await loadData();

  if (!username) {
    return res.status(400).json({ message: "Username is required." });
  }

  if (data.admin.username !== username) {
    return res.status(400).json({ message: "Admin account not found." });
  }

  const resetToken = Math.random().toString(36).slice(2, 10).toUpperCase();
  data.admin.resetToken = resetToken;
  data.admin.resetExpires = Date.now() + 1000 * 60 * 15;
  await saveData(data);

  res.json({
    message: "Reset code generated. Use it to set a new password.",
    resetCode: resetToken,
  });
});

app.post("/api/reset-password", async (req, res) => {
  const { username, resetToken, newPassword } = req.body;
  const data = await loadData();

  if (!username || !resetToken || !newPassword) {
    return res.status(400).json({ message: "Username, reset code, and new password are required." });
  }

  if (data.admin.username !== username) {
    return res.status(400).json({ message: "Admin account not found." });
  }

  if (!data.admin.resetToken || data.admin.resetToken !== resetToken || data.admin.resetExpires < Date.now()) {
    return res.status(400).json({ message: "Reset token is invalid or expired." });
  }

  data.admin.passwordHash = bcrypt.hashSync(newPassword, 10);
  data.admin.resetToken = null;
  data.admin.resetExpires = null;
  await saveData(data);

  res.json({ message: "Password has been reset successfully." });
});

app.post("/api/change-password", requireAuth, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const data = await loadData();

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: "Current password and new password are required." });
  }

  if (!bcrypt.compareSync(currentPassword, data.admin.passwordHash)) {
    return res.status(400).json({ message: "Current password is incorrect." });
  }

  data.admin.passwordHash = bcrypt.hashSync(newPassword, 10);
  await saveData(data);

  res.json({ message: "Password updated successfully." });
});

app.get("/api/products", async (req, res) => {
  const data = await loadData();
  res.json(data.products);
});

app.get("/api/categories", async (req, res) => {
  const data = await loadData();
  const categories = [...new Set(data.products.map((product) => product.category))];
  res.json(categories);
});

app.post("/api/products", requireAuth, async (req, res) => {
  const product = req.body;
  const data = await loadData();

  if (!product.name || !product.category || !product.image) {
    return res.status(400).json({ message: "Name, category, and image are required." });
  }

  const newProduct = {
    ...product,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  data.products.push(newProduct);
  await saveData(data);
  res.json(newProduct);
});

app.put("/api/products/:id", requireAuth, async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const data = await loadData();
  const productIndex = data.products.findIndex((item) => item.id === id);

  if (productIndex === -1) {
    return res.status(404).json({ message: "Product not found." });
  }

  data.products[productIndex] = {
    ...data.products[productIndex],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  await saveData(data);
  res.json(data.products[productIndex]);
});

app.delete("/api/products/:id", requireAuth, async (req, res) => {
  const { id } = req.params;
  const data = await loadData();
  const productIndex = data.products.findIndex((item) => item.id === id);

  if (productIndex === -1) {
    return res.status(404).json({ message: "Product not found." });
  }

  data.products.splice(productIndex, 1);
  await saveData(data);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
