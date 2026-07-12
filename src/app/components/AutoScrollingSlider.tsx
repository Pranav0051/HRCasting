import { useEffect, useState } from "react";
import { motion } from "motion/react";

interface AutoScrollingSliderProps {
  images: string[];
  title?: string;
  autoScrollInterval?: number;
}

export function AutoScrollingSlider({
  images,
  title = "Gallery",
  autoScrollInterval = 50000,
}: AutoScrollingSliderProps) {
  const [displayImages, setDisplayImages] = useState<string[]>([]);

  // Create a long chain of images for seamless infinite scrolling
  useEffect(() => {
    if (images.length > 0) {
      // Duplicate images multiple times for a long seamless loop
      const multiplied = Array(5).fill(null).flatMap(() => images);
      setDisplayImages(multiplied);
    }
  }, [images]);

  if (images.length === 0) {
    return (
      <div className="w-full h-96 bg-gradient-to-br from-[#1A1A1C] to-[#0F0F10] rounded-3xl flex items-center justify-center border border-white/10">
        <p className="text-gray-400">No images to display</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-[#E5E4E2] via-[#D4AF37] to-[#C0C0C0] bg-clip-text text-transparent">
          {title}
        </h2>
      </div>

      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1A1A1C] to-[#0F0F10] border border-white/5">
        {/* Slider Container */}
        <div className="relative h-[280px] md:h-[360px] lg:h-[420px] overflow-hidden">
          <motion.div
  className="flex h-full"
  animate={{ x: ["0%", "-50%"] }}
  transition={{
    duration: 50, // slow speed
    ease: "linear",
    repeat: Infinity,
  }}
>
  {[...images, ...images].map((image, index) => (
    <div
      key={index}
      className="h-full flex-shrink-0 px-2"
      style={{ width: "300px" }} // FIXED WIDTH (important)
    >
      <div className="w-full h-full rounded-2xl overflow-hidden bg-[#0F0F10]">
        <img
          src={image}
          alt="slide"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  ))}
</motion.div>

          {/* Gradient Fade Edges */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-y-0 left-0 w-48 bg-gradient-to-r from-[#0F0F10] via-[#0F0F10]/20 to-transparent" />
            <div className="absolute inset-y-0 right-0 w-48 bg-gradient-to-l from-[#0F0F10] via-[#0F0F10]/20 to-transparent" />
          </div>
        </div>
      </div>
    </div>
  );
}

