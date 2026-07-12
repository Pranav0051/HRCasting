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
    try {
      const productsData = await getProducts();
      const categoriesData = await getCategories();
      setProducts(productsData);
      setCategories(categoriesData);
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
      category: "",
      badge: "",
    });
    setShowForm(true);
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
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
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(id, token);
        setProducts(products.filter((p) => p.id !== id));
      } catch (error) {
        console.error("Failed to delete product:", error);
        alert("Unable to delete product. Please try again.");
      }
    }
  };

  const handleSave = async () => {
    if (!formData.name || !formData.category || !formData.image) {
      alert("Please fill in all required fields.");
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
          setProducts(products.map((p) => (p.id === editingId ? updated : p)));
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
        setProducts([...products, newProduct]);
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-[#0F0F10] border border-white/10 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col"
      >
        <div className="bg-gradient-to-r from-[#D4AF37] to-[#E5E4E2] p-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#0F0F10]">Admin Dashboard</h1>
            <p className="text-sm text-[#0F0F10]/80">Signed in as {username}</p>
          </div>
          <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0F0F10]/80 px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0F0F10]"
            >
              <Eye className="w-4 h-4" />
              View Website
            </button>
            <button
              onClick={() => setChangePasswordOpen(!changePasswordOpen)}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0F0F10]/80 px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0F0F10]"
            >
              <Lock className="w-4 h-4" />
              Change Password
            </button>
            <button
              onClick={onLogout}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0F0F10]/80 px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0F0F10]"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {changePasswordOpen && (
            <div className="rounded-3xl border border-white/10 bg-[#121214]/80 p-6 shadow-xl">
              <div className="flex items-center justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-xl font-bold text-white">Change Password</h2>
                  <p className="text-sm text-gray-400">Update your credentials securely.</p>
                </div>
                <button
                  onClick={() => setChangePasswordOpen(false)}
                  className="rounded-full bg-white/10 p-2 text-gray-300 hover:bg-white/20"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                  }
                  placeholder="Current password"
                  className="w-full rounded-2xl border border-white/10 bg-[#0F0F10]/70 px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]"
                />
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                  }
                  placeholder="New password"
                  className="w-full rounded-2xl border border-white/10 bg-[#0F0F10]/70 px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]"
                />
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                  }
                  placeholder="Confirm new password"
                  className="w-full rounded-2xl border border-white/10 bg-[#0F0F10]/70 px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
              {passwordMessage && (
                <p className="mt-4 text-sm text-amber-300">{passwordMessage}</p>
              )}
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  onClick={handlePasswordChange}
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#E5E4E2] px-5 py-3 text-sm font-semibold text-[#0F0F10]"
                >
                  <Key className="w-4 h-4" />
                  Update Password
                </button>
                <button
                  onClick={() => setChangePasswordOpen(false)}
                  className="inline-flex items-center rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-gray-300 hover:bg-white/5"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-gray-400">Loading products...</div>
            </div>
          ) : showForm ? (
            <div className="space-y-6">
              <div className="flex items-center gap-4 mb-8">
                <button
                  onClick={handleCancel}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h2 className="text-xl font-bold text-white">
                  {editingId ? "Edit Product" : "Add New Product"}
                </h2>
              </div>

              <div className="bg-[#1A1A1C]/60 backdrop-blur-xl border border-white/5 rounded-3xl p-8 space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full rounded-3xl border border-white/10 bg-[#0F0F10]/70 px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]"
                      placeholder="Enter product name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Category *
                    </label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      list="categories"
                      className="w-full rounded-3xl border border-white/10 bg-[#0F0F10]/70 px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]"
                      placeholder="Enter or select category"
                    />
                    <datalist id="categories">
                      {categories.map((category) => (
                        <option key={category} value={category} />
                      ))}
                    </datalist>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Badge (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.badge}
                      onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                      className="w-full rounded-3xl border border-white/10 bg-[#0F0F10]/70 px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]"
                      placeholder="Top Selling, Featured, etc."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Image *
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
                      className="w-full rounded-3xl border border-white/10 bg-[#0F0F10]/70 px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={4}
                      className="w-full rounded-3xl border border-white/10 bg-[#0F0F10]/70 px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]"
                      placeholder="Enter product description"
                    />
                  </div>
                </div>

                {formData.image && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Image Preview
                    </label>
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-full max-w-xs rounded-3xl object-cover border border-white/10"
                    />
                  </div>
                )}

                <div className="flex flex-wrap gap-4 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSave}
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#E5E4E2] px-6 py-3 font-semibold text-[#0F0F10]"
                  >
                    <Save className="w-5 h-5" />
                    Save Product
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCancel}
                    className="inline-flex items-center justify-center rounded-full border border-white/10 px-6 py-3 text-sm font-semibold text-gray-300 hover:bg-white/5"
                  >
                    Cancel
                  </motion.button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-white">Manage Products</h2>
                  <p className="text-sm text-gray-400">Create, edit, and remove products from the admin panel.</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAddNew}
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#E5E4E2] px-6 py-3 font-semibold text-[#0F0F10]"
                >
                  <Plus className="w-5 h-5" />
                  Add Product
                </motion.button>
              </div>

              <div className="overflow-x-auto rounded-3xl border border-white/10 bg-[#121214]/80">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-white/10 text-sm uppercase tracking-[0.08em] text-gray-400">
                      <th className="py-4 px-4">Image</th>
                      <th className="py-4 px-4">Name</th>
                      <th className="py-4 px-4">Category</th>
                      <th className="py-4 px-4">Description</th>
                      <th className="py-4 px-4">Badge</th>
                      <th className="py-4 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product, index) => (
                      <motion.tr
                        key={product.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-white/10 hover:bg-white/5 transition-colors"
                      >
                        <td className="py-4 px-4">
                          <img src={product.image} alt={product.name} className="h-12 w-12 rounded-lg object-cover" />
                        </td>
                        <td className="py-4 px-4 text-white font-medium">{product.name}</td>
                        <td className="py-4 px-4 text-gray-300">{product.category}</td>
                        <td className="py-4 px-4 text-gray-300 max-w-[28rem] truncate">{product.description}</td>
                        <td className="py-4 px-4">
                          {product.badge ? (
                            <span className="inline-flex rounded-full bg-[#D4AF37]/15 px-3 py-1 text-xs font-semibold text-[#D4AF37]">
                              {product.badge}
                            </span>
                          ) : (
                            <span className="text-gray-500 text-sm">—</span>
                          )}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="inline-flex items-center gap-2">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleEdit(product)}
                              className="rounded-full p-2 text-blue-300 hover:bg-blue-500/10"
                            >
                              <Edit2 className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleDelete(product.id)}
                              className="rounded-full p-2 text-rose-300 hover:bg-rose-500/10"
                            >
                              <Trash2 className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {products.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-400 mb-4">No products yet. Add your first product now.</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAddNew}
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#E5E4E2] px-6 py-3 font-semibold text-[#0F0F10]"
                  >
                    <Plus className="w-5 h-5" />
                    Create Product
                  </motion.button>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
