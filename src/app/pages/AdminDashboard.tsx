import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import {
  X,
  Plus,
  Edit2,
  Trash2,
  Save,
  ArrowLeft,
  Key,
  Lock,
  LogOut,
  Eye,
  Search,
  Filter,
} from "lucide-react";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  changePassword,
  Product,
} from "../../services/api";

interface AdminDashboardProps {
  token: string;
  username: string;
  onLogout: () => void;
}

interface FormData {
  name: string;
  description: string;
  image: string;
  category: string;
  badge: string;
}

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function AdminDashboard({ token, username, onLogout }: AdminDashboardProps) {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    image: "",
    category: "",
    badge: "",
  });
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const productsData = await getProducts();
      const categoriesData = await getCategories();
      setProducts(productsData || []);
      setCategories(categoriesData || []);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setEditingId(null);
    setFormData({
      name: "",
      description: "",
      image: "",
      category: categories[0] || "Chains",
      badge: "",
    });
    setShowForm(true);
  };

  const handleEdit = (product: Product) => {
    setEditingId(String(product.id));
    setFormData({
      name: product.name,
      description: product.description,
      image: product.image,
      category: product.category,
      badge: product.badge || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    const stringId = String(id);
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(stringId, token);
        setProducts((prev) => prev.filter((p) => String(p.id) !== stringId));
      } catch (error) {
        console.error("Failed to delete product:", error);
        alert("Unable to delete product. Please try again.");
      }
    }
  };

  const handleSave = async () => {
    if (!formData.name || !formData.category || !formData.image) {
      alert("Please fill in all required fields (Name, Category, Image).");
      return;
    }

    try {
      if (editingId) {
        const updated = await updateProduct(
          editingId,
          {
            name: formData.name,
            description: formData.description,
            image: formData.image,
            category: formData.category,
            badge: formData.badge || undefined,
          },
          token
        );
        if (updated) {
          setProducts((prev) =>
            prev.map((p) => (String(p.id) === String(editingId) ? updated : p))
          );
        }
      } else {
        const newProduct = await createProduct(
          {
            name: formData.name,
            description: formData.description,
            image: formData.image,
            category: formData.category,
            badge: formData.badge || undefined,
          },
          token
        );
        if (newProduct) {
          setProducts((prev) => [newProduct, ...prev]);
        }
      }
      setShowForm(false);
    } catch (error) {
      console.error("Failed to save product:", error);
      alert("Failed to save product. Please verify your information and try again.");
    }
  };

  const handleCancel = () => {
    setShowForm(false);
  };

  const handlePasswordChange = async () => {
    setPasswordMessage("");

    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      setPasswordMessage("Please fill in both current and new password fields.");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordMessage("New passwords do not match.");
      return;
    }

    try {
      await changePassword(token, passwordForm.currentPassword, passwordForm.newPassword);
      setPasswordMessage("Password updated successfully.");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setChangePasswordOpen(false);
    } catch (error) {
      setPasswordMessage(error instanceof Error ? error.message : "Unable to change password.");
    }
  };

  // Filter products by search query and category
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "ALL" ||
      product.category.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-[#0F0F10] border border-white/10 rounded-3xl max-w-6xl w-full h-[95vh] sm:h-[90vh] overflow-hidden flex flex-col shadow-2xl"
      >
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-[#D4AF37] via-[#E5E4E2] to-[#C0C0C0] p-4 sm:p-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between flex-shrink-0">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#0F0F10]">HR Casting Admin Panel</h1>
            <p className="text-xs sm:text-sm text-[#0F0F10]/80">Signed in as <span className="font-semibold">{username}</span></p>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#0F0F10] px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-white transition hover:bg-[#0F0F10]/80"
            >
              <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D4AF37]" />
              Website
            </button>
            <button
              onClick={() => setChangePasswordOpen(!changePasswordOpen)}
              className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#0F0F10] px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-white transition hover:bg-[#0F0F10]/80"
            >
              <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D4AF37]" />
              Password
            </button>
            <button
              onClick={onLogout}
              className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#0F0F10] px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-rose-300 hover:text-rose-200 transition hover:bg-[#0F0F10]/80"
            >
              <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              Logout
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {changePasswordOpen && (
            <div className="rounded-3xl border border-white/10 bg-[#121214]/90 p-5 sm:p-6 shadow-xl">
              <div className="flex items-center justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white">Change Password</h2>
                  <p className="text-xs sm:text-sm text-gray-400">Update your credentials securely.</p>
                </div>
                <button
                  onClick={() => setChangePasswordOpen(false)}
                  className="rounded-full bg-white/10 p-2 text-gray-300 hover:bg-white/20"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                  }
                  placeholder="Current password"
                  className="w-full rounded-2xl border border-white/10 bg-[#0F0F10]/70 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                />
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                  }
                  placeholder="New password"
                  className="w-full rounded-2xl border border-white/10 bg-[#0F0F10]/70 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                />
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                  }
                  placeholder="Confirm new password"
                  className="w-full rounded-2xl border border-white/10 bg-[#0F0F10]/70 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
              {passwordMessage && (
                <p className="mt-3 text-xs sm:text-sm text-amber-300">{passwordMessage}</p>
              )}
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  onClick={handlePasswordChange}
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#E5E4E2] px-5 py-2.5 text-xs sm:text-sm font-semibold text-[#0F0F10]"
                >
                  <Key className="w-4 h-4" />
                  Update Password
                </button>
                <button
                  onClick={() => setChangePasswordOpen(false)}
                  className="inline-flex items-center rounded-full border border-white/10 px-5 py-2.5 text-xs sm:text-sm font-semibold text-gray-300 hover:bg-white/5"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
              <div className="text-gray-400 text-sm">Loading products dataset...</div>
            </div>
          ) : showForm ? (
            /* CREATE / EDIT FORM */
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleCancel}
                  className="p-2 hover:bg-white/10 rounded-xl transition-colors text-gray-400 hover:text-white"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">
                    {editingId ? "Edit Product" : "Add New Product"}
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-400">
                    {editingId ? `Modifying product ID: ${editingId}` : "Create a new silver jewellery item"}
                  </p>
                </div>
              </div>

              <div className="bg-[#1A1A1C]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-4 sm:p-6 md:p-8 space-y-6">
                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full rounded-2xl border border-white/10 bg-[#0F0F10] px-4 py-3 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                      placeholder="e.g. Premium 925 Silver Chain"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                      Category *
                    </label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      list="categories-list"
                      className="w-full rounded-2xl border border-white/10 bg-[#0F0F10] px-4 py-3 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                      placeholder="Select or enter category (Chains, Kada, Bangles, etc.)"
                    />
                    <datalist id="categories-list">
                      {["Chains", "Kada", "Bangles", "Earrings", "Rings", "Bridal Collection", "Payal", ...categories].map(
                        (cat) => (
                          <option key={cat} value={cat} />
                        )
                      )}
                    </datalist>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                      Badge / Tag (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.badge}
                      onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                      className="w-full rounded-2xl border border-white/10 bg-[#0F0F10] px-4 py-3 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                      placeholder="Top Selling, Popular, New, Premium..."
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                      Image (File Upload or Path) *
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            setFormData({ ...formData, image: event.target?.result as string });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="w-full rounded-2xl border border-white/10 bg-[#0F0F10] px-4 py-2.5 text-xs text-gray-300 focus:outline-none focus:border-[#D4AF37] file:mr-4 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#D4AF37] file:text-[#0F0F10]"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      className="w-full rounded-2xl border border-white/10 bg-[#0F0F10] px-4 py-3 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                      placeholder="Enter detailed description of the product"
                    />
                  </div>
                </div>

                {formData.image && (
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                      Image Preview
                    </label>
                    <div className="relative w-36 h-36 rounded-2xl overflow-hidden border border-white/10 bg-[#0F0F10]">
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-3 pt-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSave}
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#E5E4E2] px-6 py-3 font-semibold text-sm text-[#0F0F10]"
                  >
                    <Save className="w-4 h-4" />
                    Save Product
                  </motion.button>
                  <button
                    onClick={handleCancel}
                    className="inline-flex items-center justify-center rounded-full border border-white/10 px-6 py-3 text-sm font-semibold text-gray-300 hover:bg-white/5"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* PRODUCTS LIST & CONTROLS */
            <div className="space-y-6">
              {/* Header & Controls */}
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">Product Inventory ({filteredProducts.length})</h2>
                  <p className="text-xs sm:text-sm text-gray-400">View, search, edit, or delete silver jewellery products.</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleAddNew}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#E5E4E2] px-5 py-2.5 font-semibold text-sm text-[#0F0F10] shadow-lg shadow-[#D4AF37]/10"
                >
                  <Plus className="w-4 h-4" />
                  Add Product
                </motion.button>
              </div>

              {/* Search & Filter Bar */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name, description, category..."
                    className="w-full rounded-full border border-white/10 bg-[#141416] pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div className="relative w-full sm:w-56">
                  <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full appearance-none rounded-full border border-white/10 bg-[#141416] pl-10 pr-8 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="ALL">All Categories</option>
                    {Array.from(new Set(products.map((p) => p.category))).map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* DESKTOP TABLE VIEW (md+) */}
              <div className="hidden md:block overflow-x-auto rounded-3xl border border-white/10 bg-[#121214]/80">
                <table className="w-full border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-white/10 uppercase tracking-[0.08em] text-xs font-semibold text-gray-400 bg-white/5">
                      <th className="py-4 px-4">Image</th>
                      <th className="py-4 px-4">Name</th>
                      <th className="py-4 px-4">Category</th>
                      <th className="py-4 px-4">Description</th>
                      <th className="py-4 px-4">Badge</th>
                      <th className="py-4 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product, index) => (
                      <tr
                        key={product.id}
                        className="border-b border-white/5 hover:bg-white/5 transition-colors"
                      >
                        <td className="py-3 px-4">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-12 w-12 rounded-xl object-cover border border-white/10 bg-[#0F0F10]"
                          />
                        </td>
                        <td className="py-3 px-4 text-white font-medium max-w-[12rem] truncate">
                          {product.name}
                        </td>
                        <td className="py-3 px-4 text-gray-300">
                          <span className="inline-block rounded-full bg-white/5 px-2.5 py-1 text-xs text-gray-300 border border-white/5">
                            {product.category}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-400 max-w-[20rem] truncate">
                          {product.description}
                        </td>
                        <td className="py-3 px-4">
                          {product.badge ? (
                            <span className="inline-flex rounded-full bg-[#D4AF37]/15 px-2.5 py-1 text-xs font-semibold text-[#D4AF37] border border-[#D4AF37]/20">
                              {product.badge}
                            </span>
                          ) : (
                            <span className="text-gray-600 text-xs">—</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="inline-flex items-center gap-2">
                            <button
                              onClick={() => handleEdit(product)}
                              className="rounded-full p-2 text-blue-400 hover:bg-blue-500/15 transition-colors"
                              title="Edit Product"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="rounded-full p-2 text-rose-400 hover:bg-rose-500/15 transition-colors"
                              title="Delete Product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* MOBILE CARDS VIEW (under md) */}
              <div className="grid grid-cols-1 gap-3 md:hidden">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex gap-3 bg-[#121214]/90 border border-white/10 rounded-2xl p-3 items-center"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-20 h-20 rounded-xl object-cover flex-shrink-0 border border-white/10 bg-[#0F0F10]"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-semibold text-[#D4AF37] uppercase bg-[#D4AF37]/10 px-2 py-0.5 rounded-full truncate">
                          {product.category}
                        </span>
                        {product.badge && (
                          <span className="text-[10px] font-semibold text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded-full truncate">
                            {product.badge}
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm font-bold text-white truncate">{product.name}</h3>
                      <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">{product.description}</p>
                    </div>

                    <div className="flex flex-col gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleEdit(product)}
                        className="p-2 rounded-xl bg-blue-500/10 text-blue-400 hover:bg-blue-500/20"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-2 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {filteredProducts.length === 0 && (
                <div className="text-center py-12 bg-[#121214]/40 border border-white/5 rounded-3xl">
                  <p className="text-gray-400 text-sm mb-4">No products matching your search criteria.</p>
                  <button
                    onClick={handleAddNew}
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#E5E4E2] px-5 py-2.5 font-semibold text-xs text-[#0F0F10]"
                  >
                    <Plus className="w-4 h-4" />
                    Create New Product
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
