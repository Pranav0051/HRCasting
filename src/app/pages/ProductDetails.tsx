import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Gem,
  MessageCircle,
  Menu,
  X,
  ArrowRight,
  Shield,
  Award,
  Users,
  ChevronRight,
  Sparkles,
  Facebook,
  Instagram,
} from "lucide-react";
import { getProducts, Product } from "../../services/api";

interface ProductDetailsProps {
  adminToken: string | null;
  onLogout: () => void;
}

export default function ProductDetails({ adminToken, onLogout }: ProductDetailsProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const getStaticCategory = (img: string): string => {
    const lower = img.toLowerCase();
    if (lower.includes("chain") || lower.includes("golc")) return "Chains";
    if (lower.includes("kada") || lower.includes("kadda")) return "Kada";
    if (lower.includes("bangle") || lower.includes("bangl") || lower.includes("bengal")) return "Bangles";
    if (lower.includes("ear") || (lower.includes("ring") && lower.includes("ear"))) return "Earrings";
    if (lower.includes("ring")) return "Rings";
    if (lower.includes("nec") || lower.includes("necc") || lower.includes("bridal")) return "Bridal Collection";
    if (lower.includes("paijan") || lower.includes("payal") || lower.includes("painjan")) return "Payal";
    return "Other";
  };

  // Scroll to top on load or ID change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [id]);

  useEffect(() => {
    const loadAllProducts = async () => {
      setLoading(true);
      try {
        let allProducts: Product[] = [];
        try {
          const data = await getProducts();
          if (data && data.length > 0) {
            allProducts = data;
          } else {
            throw new Error("Empty DB products");
          }
        } catch (e) {
          console.warn("API load failed in details page, falling back to static:", e);
          const allImages = [
            "/assets/bangales.jpeg",
            "/assets/Bangglee.jpeg",
            "/assets/bangl.jpeg",
            "/assets/Bangles.jpeg",
            "/assets/banglles.jpeg",
            "/assets/bengal1.jpeg",
            "/assets/BigKadda.jpeg",
            "/assets/chain.jpeg",
            "/assets/CrownEar.jpeg",
            "/assets/DimondEar.jpeg",
            "/assets/ear ring.jpeg",
            "/assets/EarFlow.jpeg",
            "/assets/EarFool.jpeg",
            "/assets/FloewrEar.jpeg",
            "/assets/FlowerEar.jpeg",
            "/assets/golC.jpeg",
            "/assets/GoldChain.jpeg",
            "/assets/GoldChainn.jpeg",
            "/assets/HeartEar.jpeg",
            "/assets/JayJalaJA.jpeg",
            "/assets/JAyMAhakal.jpeg",
            "/assets/Kada.jpeg",
            "/assets/kada1.jpeg",
            "/assets/kada2.jpeg",
            "/assets/KaddaNamo.jpeg",
            "/assets/Nec4.jpeg",
            "/assets/Necalase.jpeg",
            "/assets/necc.jpeg",
            "/assets/neclase.jpeg",
            "/assets/neclase2.jpeg",
            "/assets/neclase3.jpeg",
            "/assets/necSilver.jpeg",
            "/assets/paijan.jpeg",
            "/assets/Painjan.jpeg",
            "/assets/painjanss.jpeg",
            "/assets/PAyal.jpeg",
            "/assets/RadheKada.jpeg",
            "/assets/ring.jpeg",
            "/assets/SilverChain.jpeg",
            "/assets/SilverChainss.jpeg",
            "/assets/SilverGold.jpeg",
            "/assets/WhatsApp Image 2026-04-19 at 7.41.24 PM.jpeg",
          ];
          allProducts = allImages.map((img, index) => {
            const category = getStaticCategory(img);
            const name = img.split("/").pop()?.split(".")[0] || `Product ${index + 1}`;
            const formattedName = name
              .replace(/[_\-]/g, " ")
              .replace(/\b\w/g, (c) => c.toUpperCase());

            return {
              id: (index + 1).toString(),
              name: formattedName,
              description: `Elegant handcrafted ${category.toLowerCase()} design in pure 925 silver.`,
              image: img,
              category,
              badge: index < 3 ? "Top Selling" : null,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
          });
        }

        setProducts(allProducts);

        const found = allProducts.find((p) => p.id === id);
        if (found) {
          setCurrentProduct(found);
          const related = allProducts.filter(
            (p) => p.category === found.category && p.id !== found.id
          );
          setSimilarProducts(related.slice(0, 3));
        } else {
          setCurrentProduct(null);
        }
      } catch (error) {
        console.error("Error setting products:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAllProducts();
  }, [id]);

  const navItems = [
    { name: "Home", href: "/#home" },
    { name: "About", href: "/#about" },
    { name: "Products", href: "/#products" },
    { name: "Services", href: "/#services" },
    { name: "Portfolio", href: "/#portfolio" },
    { name: "Contact Us", href: "/#contact" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F0F10] text-white flex items-center justify-center font-semibold text-lg">
        Loading product details...
      </div>
    );
  }

  if (!currentProduct) {
    return (
      <div className="min-h-screen bg-[#0F0F10] text-white flex flex-col items-center justify-center p-6 text-center">
        <Gem className="w-16 h-16 text-[#D4AF37] mb-4 opacity-50" />
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <p className="text-gray-400 mb-8 max-w-md">
          The jewelry piece you are looking for does not exist or may have been deleted.
        </p>
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#E5E4E2] px-6 py-3 font-semibold text-[#0F0F10]"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Collection
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F0F10] text-white overflow-x-hidden pt-24">
      {/* Premium Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[#0F0F10]/80 border-b border-white/5"
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.a
              href="/#home"
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-3 group"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37] to-[#C0C0C0] rounded-full blur-lg opacity-50 group-hover:opacity-100 transition-opacity" />
                <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#C0C0C0] flex items-center justify-center">
                  <Gem className="w-6 h-6 text-[#0F0F10]" />
                </div>
              </div>
              <div>
                <div className="font-bold text-lg bg-gradient-to-r from-[#D4AF37] via-[#E5E4E2] to-[#C0C0C0] bg-clip-text text-transparent">
                  HR Casting Pune
                </div>
                <div className="text-xs text-gray-400">Est. 1994</div>
              </div>
            </motion.a>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-8">
              {navItems.map((item, index) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="relative text-sm font-medium text-gray-300 hover:text-[#D4AF37] transition-colors group"
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#D4AF37] to-[#C0C0C0] group-hover:w-full transition-all duration-300" />
                </motion.a>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="hidden lg:flex items-center gap-6">
              {adminToken ? (
                <>
                  <motion.button
                    onClick={() => navigate("/admin/dashboard")}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative group text-sm font-semibold text-[#D4AF37] hover:text-[#E5E4E2] transition-colors"
                  >
                    Dashboard
                  </motion.button>
                  <motion.button
                    onClick={onLogout}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative group text-sm font-medium text-gray-400 hover:text-rose-400 transition-colors"
                  >
                    Logout
                  </motion.button>
                </>
              ) : (
                <motion.button
                  onClick={() => navigate("/admin")}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative group text-sm font-medium text-gray-300 hover:text-[#D4AF37] transition-colors"
                >
                  Admin
                </motion.button>
              )}
              <motion.a
                href="/#contact"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37] to-[#E5E4E2] rounded-full blur-xl opacity-50 group-hover:opacity-100 transition-opacity" />
                <div className="relative bg-gradient-to-r from-[#D4AF37] to-[#E5E4E2] text-[#0F0F10] px-6 py-2.5 rounded-full font-semibold flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Bulk Inquiry
                </div>
              </motion.a>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-300 hover:text-[#D4AF37] transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden pt-4 pb-6 space-y-4"
            >
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-gray-300 hover:text-[#D4AF37] transition-colors py-2"
                >
                  {item.name}
                </a>
              ))}
              {adminToken ? (
                <>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate("/admin/dashboard");
                    }}
                    className="block w-full text-left font-semibold text-[#D4AF37] hover:text-[#E5E4E2] transition-colors py-2"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onLogout();
                    }}
                    className="block w-full text-left text-gray-400 hover:text-rose-400 transition-colors py-2"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate("/admin");
                  }}
                  className="block w-full text-left text-gray-300 hover:text-[#D4AF37] transition-colors py-2"
                >
                  Admin
                </button>
              )}
              <a
                href="/#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="block bg-gradient-to-r from-[#D4AF37] to-[#E5E4E2] text-[#0F0F10] px-6 py-3 rounded-full font-semibold text-center"
              >
                Bulk Inquiry
              </a>
            </motion.div>
          )}
        </div>
      </motion.nav>

      {/* Main Details Section */}
      <section className="relative py-12 md:py-20 px-6 max-w-7xl mx-auto">
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 text-gray-400 hover:text-[#D4AF37] transition-colors mb-8 md:mb-12 font-medium group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to Collection
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Side: Product Image Card */}
          <div className="lg:col-span-6 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/20 to-transparent rounded-3xl blur-3xl" />
            <div className="relative bg-[#1A1A1C]/60 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl p-4">
              <img
                src={currentProduct.image}
                alt={currentProduct.name}
                className="w-full h-auto rounded-2xl object-cover max-h-[600px] hover:scale-[1.02] transition-transform duration-500 shadow-lg"
              />
            </div>
          </div>

          {/* Right Side: Product Details Content */}
          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs font-semibold tracking-wider uppercase bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/35 px-4 py-1.5 rounded-full">
                  {currentProduct.category}
                </span>
                {currentProduct.badge && (
                  <span className="relative">
                    <span className="absolute inset-0 bg-gradient-to-r from-[#D4AF37] to-[#E5E4E2] rounded-full blur-md opacity-40" />
                    <span className="relative text-xs font-semibold bg-gradient-to-r from-[#D4AF37] to-[#E5E4E2] text-[#0F0F10] px-4 py-1.5 rounded-full">
                      {currentProduct.badge}
                    </span>
                  </span>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight bg-gradient-to-r from-[#E5E4E2] via-[#D4AF37] to-[#C0C0C0] bg-clip-text text-transparent">
                {currentProduct.name}
              </h1>
            </div>

            <div className="h-px bg-white/10" />

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-200">Product Specifications</h3>
              <p className="text-gray-300 leading-relaxed text-base md:text-lg">
                {currentProduct.description}
              </p>
            </div>

            <div className="bg-[#121214]/60 backdrop-blur-xl border border-white/5 rounded-2xl p-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { icon: Award, title: "925 Pure", detail: "Authentic Pure Silver" },
                { icon: Shield, title: "Machine Cut", detail: "German Precision" },
                { icon: Users, title: "Wholesale", detail: "For Retailers Across India" },
              ].map((item, idx) => (
                <div key={idx} className="space-y-2 text-center sm:text-left">
                  <item.icon className="w-8 h-8 text-[#D4AF37] mx-auto sm:mx-0" />
                  <div className="font-bold text-white text-sm">{item.title}</div>
                  <div className="text-xs text-gray-400">{item.detail}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <a
                href="/#contact"
                className="inline-flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#E5E4E2] text-[#0F0F10] px-8 py-4 font-bold text-base shadow-lg hover:shadow-xl transition group w-full sm:w-auto"
              >
                <MessageCircle className="w-5 h-5" />
                Submit Bulk Inquiry
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Similar Products Section */}
      {similarProducts.length > 0 && (
        <section className="border-t border-white/5 bg-[#121214]/30 py-16 md:py-24 px-6">
          <div className="max-w-7xl mx-auto space-y-12">
            <div className="border-l-4 border-[#D4AF37] pl-4">
              <h2 className="text-2xl md:text-3xl font-extrabold text-white">Similar Products</h2>
              <p className="text-sm text-gray-400 mt-1">
                More exquisite designs under the {currentProduct.category} category.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {similarProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -8 }}
                  onClick={() => navigate(`/product/${product.id}`)}
                  className="relative group cursor-pointer"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/20 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-300" />
                  <div className="relative bg-[#1A1A1C]/60 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden">
                    {/* Image */}
                    <div className="relative overflow-hidden h-56">
                      <motion.img
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.4 }}
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F10] to-transparent" />
                      {product.badge && (
                        <div className="absolute top-4 right-4">
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="relative"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37] to-[#E5E4E2] rounded-full blur-lg opacity-50" />
                            <div className="relative bg-gradient-to-r from-[#D4AF37] to-[#E5E4E2] text-[#0F0F10] px-4 py-2 rounded-full text-xs font-semibold">
                              {product.badge}
                            </div>
                          </motion.div>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-white mb-2 truncate">
                        {product.name}
                      </h3>
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2 min-h-[2.5rem]">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium bg-[#D4AF37]/20 text-[#D4AF37] px-3 py-1 rounded-full">
                          {product.category}
                        </span>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="text-[#D4AF37] hover:text-[#E5E4E2] transition-colors"
                        >
                          <ArrowRight className="w-5 h-5" />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer Contact Section */}
      <section className="relative py-16 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto text-center space-y-6">
          <p className="text-gray-400">
            © 2024 HR Casting Pune. All rights reserved.
          </p>
          <div className="flex justify-center gap-6">
            {[Facebook, Instagram, MessageCircle].map((Icon, idx) => (
              <motion.a
                key={idx}
                href="#"
                whileHover={{ scale: 1.2, color: "#D4AF37" }}
                className="text-gray-400 hover:text-[#D4AF37] transition-colors"
              >
                <Icon className="w-6 h-6" />
              </motion.a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
