import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  Shield,
  Award,
  Gem,
  Users,
  Package,
  Zap,
  CheckCircle,
  Star,
  Phone,
  Mail,
  MapPin,
  Instagram,
  Facebook,
  MessageCircle,
  ChevronRight,
  TrendingUp,
  BadgeCheck,
  Target,
  Palette,
  Settings,
  Camera,
  Menu,
  X,
  Layers,
  Box,
  Eye,
  ArrowRight,
} from "lucide-react";
import { AutoScrollingSlider } from "../components/AutoScrollingSlider";
import { getProducts, Product } from "../../services/api";

interface HomePageProps {
  adminToken: string | null;
  onLogout: () => void;
}

export default function HomePage({ adminToken, onLogout }: HomePageProps) {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const heroRef = useRef(null);

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

  // Load products from DB or static fallback
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await getProducts();
        if (data && data.length > 0) {
          setProducts(data);
        } else {
          throw new Error("No products returned from database");
        }
      } catch (error) {
        console.error("Failed to load products from API, falling back to static:", error);
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
        const staticProducts: Product[] = allImages.map((img, index) => {
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
        setProducts(staticProducts);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const { scrollY } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.5, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);

  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
  const smoothY = useSpring(heroY, springConfig);

  const navItems = [
    { name: "Home", href: "/#home" },
    { name: "About", href: "/#about" },
    { name: "Products", href: "/#products" },
    { name: "Services", href: "/#services" },
    { name: "Portfolio", href: "/#portfolio" },
    { name: "Contact Us", href: "/#contact" },
  ];

  const services = [
    {
      icon: Settings,
      title: "Custom Manufacturing",
      desc: "Tailored jewellery designs crafted to your specifications",
      gradient: "from-amber-500/20 to-yellow-600/20",
    },
    {
      icon: Sparkles,
      title: "Gold Plating",
      desc: "Premium gold plating on 925 silver for luxury finish",
      gradient: "from-purple-500/20 to-pink-600/20",
    },
    {
      icon: Package,
      title: "Bulk Wholesale",
      desc: "Competitive pricing for large volume orders",
      gradient: "from-emerald-500/20 to-teal-600/20",
    },
    {
      icon: Palette,
      title: "Design Customization",
      desc: "Modify existing designs or create new concepts",
      gradient: "from-blue-500/20 to-cyan-600/20",
    },
  ];

  // Get portfolio images from all assets
  const portfolioImages = [
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

  // Get best sellers (top 3 products with badges)
  const bestSellers = products
    .filter((p) => p.badge)
    .slice(0, 3)
    .map((p) => ({
      name: p.name,
      desc: p.description,
      badge: p.badge || "Featured",
      image: p.image,
    }));

  return (
    <div className="min-h-screen bg-[#0F0F10] text-white overflow-x-hidden">
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
              href="#home"
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
                  transition={{ delay: index * 0.1 }}
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
                href="#contact"
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
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="block bg-gradient-to-r from-[#D4AF37] to-[#E5E4E2] text-[#0F0F10] px-6 py-3 rounded-full font-semibold text-center"
              >
                Bulk Inquiry
              </a>
            </motion.div>
          )}
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section
        id="home"
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24"
      >
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0F0F10] via-[#1A1A1C] to-[#0F0F10]" />
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-[#D4AF37]/10 to-[#6B46C1]/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [90, 0, 90],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-[#C0C0C0]/10 to-[#059669]/10 rounded-full blur-3xl"
          />
        </div>

        {/* Floating Jewellery Elements */}
        <motion.div
          style={{ y: smoothY, opacity: heroOpacity }}
          className="absolute inset-0 pointer-events-none"
        >
          <motion.div
            animate={{
              y: [0, -30, 0],
              rotate: [0, 10, 0],
              x: [0, 20, 0],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 right-1/3 w-32 h-32 rounded-full bg-gradient-to-br from-[#D4AF37]/30 to-transparent backdrop-blur-md border border-[#D4AF37]/20"
            style={{ boxShadow: "0 0 60px rgba(212, 175, 55, 0.3)" }}
          />
          <motion.div
            animate={{
              y: [0, 40, 0],
              rotate: [0, -15, 0],
              x: [0, -30, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
            className="absolute bottom-1/3 left-1/4 w-24 h-24 rounded-full bg-gradient-to-br from-[#C0C0C0]/30 to-transparent backdrop-blur-md border border-[#C0C0C0]/20"
            style={{ boxShadow: "0 0 60px rgba(192, 192, 192, 0.3)" }}
          />
          <motion.div
            animate={{
              y: [0, -20, 0],
              rotate: [0, 20, 0],
              x: [0, 15, 0],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
            className="absolute top-1/2 right-1/4 w-20 h-20 rounded-full bg-gradient-to-br from-[#6B46C1]/30 to-transparent backdrop-blur-md border border-[#6B46C1]/20"
            style={{ boxShadow: "0 0 60px rgba(107, 70, 193, 0.3)" }}
          />
        </motion.div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="inline-block relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/20 to-[#C0C0C0]/20 rounded-full blur-xl group-hover:blur-2xl transition-all" />
              <div className="relative px-6 py-3 rounded-full bg-[#1A1A1C]/60 backdrop-blur-xl border border-white/10">
                <span className="text-sm font-medium bg-gradient-to-r from-[#D4AF37] to-[#E5E4E2] bg-clip-text text-transparent">
                  ✦ 30+ Years of Crafting Excellence ✦
                </span>
              </div>
            </motion.div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-none">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="block bg-gradient-to-r from-[#E5E4E2] via-[#D4AF37] to-[#C0C0C0] bg-clip-text text-transparent"
                style={{
                  textShadow: "0 0 60px rgba(212, 175, 55, 0.4)",
                }}
              >
                Crafting Premium
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="block bg-gradient-to-r from-[#D4AF37] via-[#E5E4E2] to-[#D4AF37] bg-clip-text text-transparent"
              >
                925 Silver Jewellery
              </motion.span>
            </h1>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="text-base md:text-lg lg:text-xl text-gray-400 max-w-3xl mx-auto"
            >
              German Precision • Pure Silver • Trusted by Retailers Across India
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8"
            >
              <motion.a
                href="#products"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37] to-[#E5E4E2] rounded-full blur-2xl opacity-50 group-hover:opacity-100 transition-opacity" />
                <div className="relative bg-gradient-to-r from-[#D4AF37] to-[#E5E4E2] text-[#0F0F10] px-8 py-4 rounded-full font-bold text-base flex items-center gap-3">
                  Explore Collection
                  <ChevronRight className="w-5 h-5" />
                </div>
              </motion.a>

              <motion.a
                href="#contact"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#C0C0C0]/20 to-[#D4AF37]/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative bg-[#1A1A1C]/60 backdrop-blur-xl border-2 border-[#D4AF37]/30 text-white px-8 py-4 rounded-full font-bold text-base flex items-center gap-3">
                  Bulk Order
                  <MessageCircle className="w-5 h-5" />
                </div>
              </motion.a>
            </motion.div>
          </motion.div>

          {/* Hero Image with Glow & Responsive Alignment */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 1.2 }}
            className="mt-12 sm:mt-16 md:mt-24 relative"
          >
            <div className="relative max-w-5xl mx-auto">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#D4AF37]/30 via-transparent to-transparent blur-3xl pointer-events-none" />

              <div className="relative rounded-3xl overflow-hidden border border-[#D4AF37]/20 shadow-2xl">
                <motion.img
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.6 }}
                  src={products[0]?.image || "/assets/Bangles.jpeg"}
                  alt="Premium Silver Jewellery"
                  className="w-full h-[220px] sm:h-[320px] md:h-[380px] lg:h-[450px] object-cover"
                  style={{
                    filter: "brightness(0.9) contrast(1.1)",
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F10] via-transparent to-transparent opacity-80 md:opacity-100" />
              </div>

              {/* Responsive Stats: Floating on Desktop, Side-by-side Row on Mobile */}
              <div className="mt-6 md:mt-0 grid grid-cols-2 gap-3 sm:gap-4 md:contents">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.6 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="md:absolute md:top-12 md:-left-8 lg:-left-12"
                >
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/40 to-[#C0C0C0]/40 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
                    <div className="relative bg-[#1A1A1C]/90 backdrop-blur-2xl p-4 sm:p-6 md:p-8 rounded-2xl border border-[#D4AF37]/20 text-center md:text-left">
                      <div className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#D4AF37] to-[#E5E4E2] bg-clip-text text-transparent">
                        30+
                      </div>
                      <div className="text-xs sm:text-sm text-gray-400 mt-1 sm:mt-2 font-medium">Years Experience</div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.8 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="md:absolute md:bottom-12 md:-right-8 lg:-right-12"
                >
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#C0C0C0]/40 to-[#D4AF37]/40 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
                    <div className="relative bg-[#1A1A1C]/90 backdrop-blur-2xl p-4 sm:p-6 md:p-8 rounded-2xl border border-[#C0C0C0]/20 text-center md:text-left">
                      <div className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#E5E4E2] to-[#C0C0C0] bg-clip-text text-transparent">
                        925
                      </div>
                      <div className="text-xs sm:text-sm text-gray-400 mt-1 sm:mt-2 font-medium">Pure Silver</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Products Section with Auto-scrolling Slider */}
      <section id="products" className="relative py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F0F10] via-[#1A1A1C] to-[#0F0F10]" />

        <div className="relative max-w-7xl mx-auto">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-gray-400">Loading products...</div>
            </div>
          ) : (
            <>
              <AutoScrollingSlider
                images={portfolioImages}
                title="Our Exquisite Collection"
                autoScrollInterval={45000}
              />

              {/* Featured Products Grid */}
              <div className="mt-32 space-y-24">
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-center mb-16"
                >
                  <h2 className="text-4xl md:text-5xl font-bold mb-6">
                    <span className="bg-gradient-to-r from-[#E5E4E2] via-[#D4AF37] to-[#C0C0C0] bg-clip-text text-transparent">
                      Our Products
                    </span>
                  </h2>
                  <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base">
                    Explore our hand-crafted masterworks, sorted by category for a seamless browsing experience.
                  </p>
                </motion.div>

                {(() => {
                  const PREFERRED_ORDER = ["Chains", "Kada", "Bangles", "Earrings", "Rings", "Bridal Collection", "Payal"];
                  const categoriesMap = products.reduce((acc, product) => {
                    const category = product.category || "Other";
                    if (!acc[category]) {
                      acc[category] = [];
                    }
                    acc[category].push(product);
                    return acc;
                  }, {} as Record<string, Product[]>);

                  const sortedCategories = Object.keys(categoriesMap).sort((a, b) => {
                    const idxA = PREFERRED_ORDER.indexOf(a);
                    const idxB = PREFERRED_ORDER.indexOf(b);
                    if (idxA === -1 && idxB === -1) return a.localeCompare(b);
                    if (idxA === -1) return 1;
                    if (idxB === -1) return -1;
                    return idxA - idxB;
                  });

                  return sortedCategories.map((categoryName) => {
                    const categoryProducts = categoriesMap[categoryName];
                    return (
                      <div key={categoryName} className="space-y-10">
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          className="border-l-4 border-[#D4AF37] pl-4"
                        >
                          <h3 className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-3">
                            {categoryName}
                            <span className="text-xs bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30 px-3 py-1 rounded-full font-semibold">
                              {categoryProducts.length} {categoryProducts.length === 1 ? "Item" : "Items"}
                            </span>
                          </h3>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                          {categoryProducts.map((product, index) => (
                            <motion.div
                              key={product.id}
                              initial={{ opacity: 0, y: 20 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{ delay: Math.min(index * 0.05, 0.3) }}
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
                                  <h3 className="text-xl font-bold text-white mb-2 truncate">
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
                    );
                  });
                })()}
              </div>
            </>
          )}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="relative py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F0F10] via-[#1A1A1C] to-[#0F0F10]" />

        <div className="relative max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <div className="inline-block px-6 py-3 rounded-full bg-[#1A1A1C]/60 backdrop-blur-xl border border-[#D4AF37]/20 mb-6">
              <span className="text-sm font-medium bg-gradient-to-r from-[#D4AF37] to-[#E5E4E2] bg-clip-text text-transparent">
                Our Legacy
              </span>
            </div>

            <h2 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-[#E5E4E2] via-[#D4AF37] to-[#C0C0C0] bg-clip-text text-transparent">
                Excellence Since 1994
              </span>
            </h2>

            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Located in the heart of Raviwar Peth, Pune, HR Casting has been
              India's trusted name in wholesale 925 silver jewellery
              manufacturing for over three decades.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/20 to-[#6B46C1]/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all" />
              <div className="relative rounded-3xl overflow-hidden border border-[#D4AF37]/20">
                <img
                  src={products[1]?.image || "/assets/ring.jpeg"}
                  alt="Craftsmanship"
                  className="w-full h-[600px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F10]/80 via-transparent to-transparent" />
              </div>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="grid grid-cols-3 gap-6">
                {[
                  { icon: Award, value: "30+", label: "Years" },
                  { icon: Shield, value: "100%", label: "Pure Silver" },
                  { icon: Users, value: "1000+", label: "Clients" },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 }}
                    whileHover={{ y: -8, scale: 1.05 }}
                    className="relative group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/20 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative bg-[#1A1A1C]/60 backdrop-blur-xl border border-white/5 rounded-2xl p-6 text-center">
                      <stat.icon className="w-8 h-8 text-[#D4AF37] mx-auto mb-3" />
                      <div className="text-3xl font-bold bg-gradient-to-r from-[#D4AF37] to-[#E5E4E2] bg-clip-text text-transparent">
                        {stat.value}
                      </div>
                      <div className="text-sm text-gray-400 mt-1">
                        {stat.label}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="space-y-4">
                {[
                  "Pure 925 Silver - No Base Metal",
                  "German Machine Precision",
                  "Trusted by Retailers Across India",
                  "Transparent & Fair Pricing",
                ].map((feature, index) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4 group"
                  >
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#E5E4E2] group-hover:scale-150 transition-transform" />
                    <p className="text-lg text-gray-300">{feature}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="relative py-32 px-6">
        <div className="absolute inset-0 bg-[#0F0F10]" />

        <div className="relative max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <div className="inline-block px-6 py-3 rounded-full bg-[#1A1A1C]/60 backdrop-blur-xl border border-[#D4AF37]/20 mb-6">
              <span className="text-sm font-medium bg-gradient-to-r from-[#D4AF37] to-[#E5E4E2] bg-clip-text text-transparent">
                Our Services
              </span>
            </div>

            <h2 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-[#E5E4E2] via-[#D4AF37] to-[#C0C0C0] bg-clip-text text-transparent">
                Premium Services
              </span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="relative group"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${service.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-300`}
                />
                <div className="relative bg-[#1A1A1C]/60 backdrop-blur-xl border border-white/5 rounded-2xl p-8 text-center h-full flex flex-col items-center justify-center">
                  <service.icon className="w-12 h-12 text-[#D4AF37] mb-4" />
                  <h3 className="text-xl font-bold text-white mb-3">
                    {service.title}
                  </h3>
                  <p className="text-gray-400 text-sm">{service.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="relative py-32 px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F0F10] via-[#1A1A1C] to-[#0F0F10]" />

        <div className="relative max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-[#E5E4E2] via-[#D4AF37] to-[#C0C0C0] bg-clip-text text-transparent">
                Get In Touch
              </span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: Phone,
                title: "Call Us",
                detail: "+91-9999999999",
              },
              {
                icon: Mail,
                title: "Email",
                detail: "info@hrcastingpune.com",
              },
              {
                icon: MapPin,
                title: "Visit Us",
                detail: "Raviwar Peth, Pune, India",
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/20 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative bg-[#1A1A1C]/60 backdrop-blur-xl border border-white/5 rounded-2xl p-8 text-center">
                  <item.icon className="w-12 h-12 text-[#D4AF37] mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-400">{item.detail}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Footer */}
          <div className="border-t border-white/10 pt-12 text-center">
            <p className="text-gray-400 mb-4">
              © 2024 HR Casting Pune. All rights reserved.
            </p>
            <div className="flex justify-center gap-6">
              {[Facebook, Instagram, MessageCircle].map((Icon, index) => (
                <motion.a
                  key={index}
                  href="#"
                  whileHover={{ scale: 1.2, color: "#D4AF37" }}
                  className="text-gray-400 hover:text-[#D4AF37] transition-colors"
                >
                  <Icon className="w-6 h-6" />
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
