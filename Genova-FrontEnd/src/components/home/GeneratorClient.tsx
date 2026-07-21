"use client";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [currentAIImage, setCurrentAIImage] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [buttonPos, setButtonPos] = useState<{ x: number; y: number } | null>(null);
  const [dragging, setDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [touchDragging, setTouchDragging] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const authParam = params.get("auth");
      if (authParam === "signup") {
        setIsSignup(true);
        setShowModal(true);
      } else if (authParam === "login") {
        setIsSignup(false);
        setShowModal(true);
      }
    }
  }, []);

  // ✅ 48 Beautiful Images - 12 Slides × 4 Images
  const imageGallery = [
    // Slide 1 - Animation/Cartoon
    {
      src: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400",
      alt: "Anime Art",
      label: "Animation",
    },
    {
      src: "https://images.unsplash.com/photo-1613310023042-ad79320c00ff?w=400",
      alt: "Cartoon Style",
      label: "Cartoon",
    },
    {
      src: "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=400",
      alt: "3D Character",
      label: "3D Art",
    },
    {
      src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400",
      alt: "Digital Art",
      label: "Digital",
    },

    // Slide 2 - Animals
    {
      src: "https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=400",
      alt: "Majestic Lion",
      label: "Wildlife",
    },
    {
      src: "https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=400",
      alt: "Fox Portrait",
      label: "Animals",
    },
    {
      src: "https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?w=400",
      alt: "Tiger Close-up",
      label: "Big Cats",
    },
    {
      src: "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=400",
      alt: "Elephant",
      label: "Mammals",
    },

    // Slide 3 - Art Gallery
    {
      src: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400",
      alt: "Abstract Art",
      label: "Abstract",
    },
    {
      src: "https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=400",
      alt: "Painting",
      label: "Fine Art",
    },
    {
      src: "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=400",
      alt: "Modern Art",
      label: "Contemporary",
    },
    {
      src: "https://images.unsplash.com/photo-1577083165633-14ebcdb0f658?w=400",
      alt: "Gallery Wall",
      label: "Exhibition",
    },

    // Slide 4 - Food
    {
      src: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400",
      alt: "Gourmet Dish",
      label: "Cuisine",
    },
    {
      src: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400",
      alt: "Pizza",
      label: "Italian",
    },
    {
      src: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400",
      alt: "Salad Bowl",
      label: "Healthy",
    },
    {
      src: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400",
      alt: "Burger",
      label: "Fast Food",
    },

    // Slide 5 - Birds
    {
      src: "https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=400",
      alt: "Colorful Parrot",
      label: "Tropical",
    },
    {
      src: "https://images.unsplash.com/photo-1444464666168-49d633b86797?w=400",
      alt: "Eagle Flight",
      label: "Raptors",
    },
    {
      src: "https://images.unsplash.com/photo-1551244072-5d12893278ab?w=400",
      alt: "Flamingo",
      label: "Exotic",
    },
    {
      src: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400",
      alt: "Hummingbird",
      label: "Small Birds",
    },

    // Slide 6 - Cities
    {
      src: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=400",
      alt: "New York",
      label: "Urban",
    },
    {
      src: "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=400",
      alt: "Tokyo Night",
      label: "Neon City",
    },
    {
      src: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400",
      alt: "Paris",
      label: "Europe",
    },
    {
      src: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400",
      alt: "Dubai",
      label: "Modern",
    },

    // Slide 7 - Nature
    {
      src: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400",
      alt: "Forest Path",
      label: "Woods",
    },
    {
      src: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400",
      alt: "Ocean Waves",
      label: "Seascape",
    },
    {
      src: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400",
      alt: "Lake Reflection",
      label: "Water",
    },
    {
      src: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400",
      alt: "Meadow",
      label: "Grasslands",
    },

    // Slide 8 - Hills/Mountains
    {
      src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
      alt: "Mountain Peak",
      label: "Peaks",
    },
    {
      src: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400",
      alt: "Alpine View",
      label: "Alps",
    },
    {
      src: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400",
      alt: "Himalayan Range",
      label: "Himalayas",
    },
    {
      src: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=400",
      alt: "Rolling Hills",
      label: "Valleys",
    },

    // Slide 9 - Snowfall/Winter
    {
      src: "https://images.unsplash.com/photo-1491002052546-bf38f186af56?w=400",
      alt: "Snowy Forest",
      label: "Winter",
    },
    {
      src: "https://images.unsplash.com/photo-1483664852095-d6cc6870702d?w=400",
      alt: "Snowflakes",
      label: "Snow",
    },
    {
      src: "https://images.unsplash.com/photo-1477601263568-180e2c6d046e?w=400",
      alt: "Icy Lake",
      label: "Frozen",
    },
    {
      src: "https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=400",
      alt: "Snowy Peaks",
      label: "Ice",
    },

    // Slide 10 - Space/Sci-Fi
    {
      src: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400",
      alt: "Space View",
      label: "Cosmos",
    },
    {
      src: "https://images.unsplash.com/photo-1614854262318-831574f15f1f?w=400",
      alt: "Nebula",
      label: "Galaxy",
    },
    {
      src: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400",
      alt: "Sci-Fi Scene",
      label: "Future",
    },
    {
      src: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=400",
      alt: "Stars",
      label: "Universe",
    },

    // Slide 11 - Architecture
    {
      src: "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?w=400",
      alt: "Modern Building",
      label: "Modern",
    },
    {
      src: "https://images.unsplash.com/photo-1503174971373-b1f69850bded?w=400",
      alt: "Glass Tower",
      label: "Skyscraper",
    },
    {
      src: "https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=400",
      alt: "Bridge",
      label: "Engineering",
    },
    {
      src: "https://images.unsplash.com/photo-1512100356356-de1b84283e18?w=400",
      alt: "Temple",
      label: "Historic",
    },

    // Slide 12 - Sunset/Sky
    {
      src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
      alt: "Sunset",
      label: "Golden Hour",
    },
    {
      src: "https://images.unsplash.com/photo-1511884642898-4c92249e20b6?w=400",
      alt: "Aurora",
      label: "Northern Lights",
    },
    {
      src: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400",
      alt: "Milky Way",
      label: "Night Sky",
    },
    {
      src: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400",
      alt: "Beach Sunset",
      label: "Dusk",
    },
  ];

  const totalSlides = Math.ceil(imageGallery.length / 4);

  // ✅ Auto-scroll every 3.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 3500);
    return () => clearInterval(interval);
  }, [totalSlides]);

  // ✅ Open modal and switch auth type
  const handleAuthSwitch = (signup: boolean) => {
    setIsSignup(signup);
    setShowModal(true);
  };

  // ✅ Close modal
  const closeModal = () => {
    setShowModal(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const endpoint = isSignup ? "/auth/signup" : "/auth/token";
      const body = isSignup
        ? { first_name: firstName, email, password }
        : { username: email, password };
      const headers = isSignup
        ? { "Content-Type": "application/json" }
        : { "Content-Type": "application/x-www-form-urlencoded" };

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}${endpoint}`,
        body,
        { headers }
      );

      // Save token and redirect for both signup and login
      const token = res.data.access_token;
      if (token) {
        localStorage.setItem("token", token);
        router.push("/dashboard");
      } else {
        // fallback for legacy signup API that doesn't return token
        if (isSignup) {
          alert("Signup successful! Please login.");
          setIsSignup(false);
        }
      }
    } catch (err: unknown) {
      console.log("Full Error Object:", err);
      let message = "Error occurred";
      if (axios.isAxiosError(err) && err.response?.data) {
        const detail = err.response.data.detail;
        message = typeof detail === "string" ? detail : JSON.stringify(detail);
      }
      alert(message);
    }
    setLoading(false);
  };

  // ✅ AI Images for rotation (add your image names from public folder)
  const aiImages = [
    "/ai-image-1.jpg",
    "/ai-image-2.jpg",
    "/ai-image-3.jpg",
    "/ai-image-4.jpg",
    "/ai-image-5.jpg",
  ];

  // ✅ Auto-rotate AI images every 3.5 seconds
  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        setCurrentAIImage((prev) => (prev + 1) % aiImages.length);
      }, 3500);
      return () => clearInterval(interval);
    }
  }, [isPaused, aiImages.length]);

  // ✅ NEW: Track scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;

      // Calculate scroll percentage
      const scrolled = (scrollTop / (documentHeight - windowHeight)) * 100;
      setScrollProgress(Math.min(Math.round(scrolled), 100));

      // Show button after scrolling 200px
      setShowScrollButton(scrollTop > 200);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ✅ NEW: Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Desktop drag handlers
  const handleDragStart = (e: React.MouseEvent<HTMLButtonElement>) => {
    setDragging(true);
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleDrag = useCallback(
    (e: MouseEvent) => {
      if (!dragging) return;
      setButtonPos({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      });
    },
    [dragging, dragOffset]
  );

  const handleDragEnd = useCallback(() => {
    setDragging(false);
  }, []);

  // Mobile/touch drag handlers
  const handleTouchStart = (e: React.TouchEvent<HTMLButtonElement>) => {
    setTouchDragging(true);
    const rect = e.currentTarget.getBoundingClientRect();
    const touch = e.touches[0];
    setDragOffset({
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
    });
  };

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!touchDragging) return;
      const touch = e.touches[0];
      setButtonPos({
        x: touch.clientX - dragOffset.x,
        y: touch.clientY - dragOffset.y,
      });
    },
    [touchDragging, dragOffset]
  );

  const handleTouchEnd = useCallback(() => {
    setTouchDragging(false);
  }, []);

  useEffect(() => {
    if (dragging) {
      window.addEventListener("mousemove", handleDrag);
      window.addEventListener("mouseup", handleDragEnd);
    } else {
      window.removeEventListener("mousemove", handleDrag);
      window.removeEventListener("mouseup", handleDragEnd);
    }
    return () => {
      window.removeEventListener("mousemove", handleDrag);
      window.removeEventListener("mouseup", handleDragEnd);
    };
  }, [dragging, dragOffset, handleDrag, handleDragEnd]);

  useEffect(() => {
    if (touchDragging) {
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("touchend", handleTouchEnd);
    } else {
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    }
    return () => {
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
    
  }, [touchDragging, dragOffset, handleTouchMove, handleTouchEnd]);

  return (
    <div className="min-h-screen flex flex-col gradient-bg relative overflow-hidden">
      {/* ✨ Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-purple-400/10 rounded-full blur-3xl animate-pulse-slower"></div>
      </div>

      {/* Header */}
      <header className="fixed top-0 w-full bg-black/40 backdrop-blur-xl z-50 border-b border-green-400/30">
        <div className="container mx-auto px-6 py-3 flex justify-between items-center">
          {/* ✅ Logo + Text with Fade Animation */}
          <div className="flex items-center gap-3 animate-fade-pulse">
            <div className="h-12 w-12 relative flex-shrink-0">
              <Image
                src="/icon.png"
                alt="Genova Logo"
                fill
                className="rounded-lg object-contain"
              />
            </div>
            <h1
              className="text-3xl md:text-4xl font-black tracking-wider"
              style={{
                color: "#000",
                textShadow: `
                  0.5px 0.5px 0 #22c55e,
                  -0.5px -0.5px 0 #22c55e,
                  0.5px -0.5px 0 #22c55e,
                  -0.5px 0.5px 0 #22c55e,
                  0.5px 0 0 #22c55e,
                  -0.5px 0 0 #22c55e,
                  0 0.5px 0 #22c55e,
                  0 -0.5px 0 #22c55e
                `,
              }}
            >
              Genova
            </h1>
          </div>

          {/* ✅ Button opens modal */}
          <button
            onClick={() => handleAuthSwitch(false)}
            className="px-6 py-2.5 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-full transition-all duration-300 text-sm font-semibold border border-green-400/30 backdrop-blur-sm hover:scale-105"
          >
            Get Started →
          </button>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <div className="container mx-auto px-6 pt-36 pb-24 text-center max-w-7xl relative z-10">
          {/* Main Heading */}
          <div className="mb-8 animate-fade-in">
            <h2 className="text-6xl md:text-8xl font-black mb-4 leading-tight">
              <span className="text-white">Create </span>
              <span
                className="inline-block animate-glow"
                style={{
                  color: "#000",
                  textShadow: `
                  0.5px 0.5px 0 #22c55e,
                  -0.5px -0.5px 0 #22c55e,
                  0.5px -0.5px 0 #22c55e,
                  -0.5px 0.5px 0 #22c55e,
                  0.5px 0 0 #22c55e,
                  -0.5px 0 0 #22c55e,
                  0 0.5px 0 #22c55e,
                  0 -0.5px 0 #22c55e,
                  1px 0 0 #22c55e,
                  -1px 0 0 #22c55e,
                  0 1px 0 #22c55e,
                  0 -1px 0 #22c55e
                `,
                }}
              >
                Stunning Visuals
              </span>
            </h2>
            <p className="text-2xl md:text-3xl font-black text-white mb-6">
              In <span className="text-green-400">Seconds</span>, Not Hours
            </p>
          </div>

          <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
            AI-powered image generation for your projects. Free, unlimited, and
            lightning-fast.
          </p>

          {/* Feature Badges */}
          <div className="flex flex-wrap justify-center gap-3 mb-16">
            {["⚡ Instant", "🎨 Unlimited", "🔒 Secure", "✨ HD Quality"].map(
              (badge, i) => (
                <span
                  key={i}
                  className="px-5 py-2.5 bg-gray-800/60 backdrop-blur-sm border border-green-400/30 rounded-full text-sm text-gray-200 font-medium hover:bg-gray-800/80 transition-all duration-300 hover:scale-105"
                >
                  {badge}
                </span>
              )
            )}
          </div>

          {/* Carousel - Keep existing code */}
          <div className="relative mb-16">
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-1000 ease-in-out"
                style={{
                  transform: `translateX(-${currentSlide * 100}%)`,
                }}
              >
                {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                  <div key={slideIndex} className="w-full flex-shrink-0">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 px-4">
                      {imageGallery
                        .slice(slideIndex * 4, slideIndex * 4 + 4)
                        .map((img, i) => (
                          <div
                            key={i}
                            className="group relative overflow-hidden rounded-3xl shadow-2xl transition-all duration-500 hover:scale-105 hover:shadow-green-400/30"
                          >
                            <Image
                              src={img.src}
                              alt={img.alt}
                              width={400}
                              height={500}
                              className="w-full h-72 md:h-96 object-cover transition-transform duration-700 group-hover:scale-110"
                              unoptimized
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                              <div>
                                <p className="text-white font-bold text-xl mb-1">
                                  {img.label}
                                </p>
                                <p className="text-green-400 text-sm">
                                  AI Generated ✨
                                </p>
                              </div>
                            </div>
                            <div className="absolute inset-0 border-4 border-green-400/0 group-hover:border-green-400/50 rounded-3xl transition-all duration-500"></div>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Slide Indicators */}
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: totalSlides }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === currentSlide
                      ? "w-8 bg-green-400"
                      : "w-2 bg-gray-600 hover:bg-gray-400"
                  }`}
                ></button>
              ))}
            </div>
          </div>

          {/* CTA Button */}
          <button
            onClick={() => handleAuthSwitch(false)}
            className="px-10 py-5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-2xl font-bold text-xl shadow-2xl hover:shadow-green-500/50 transition-all duration-300 transform hover:scale-105 active:scale-95"
          >
            🚀 Start Creating Now - It&apos;s Free!
          </button>
        </div>
      </main>

      {/* ✅ NEW SECTION 1: HOW IT WORKS */}
      <section className="py-24 relative z-10">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black text-white mb-4">
              How it <span className="text-green-400">Works</span>
            </h2>
            <p className="text-xl text-gray-300">
              Transform Words into Stunning Images
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-gray-900/60 backdrop-blur-sm border border-green-400/30 rounded-3xl p-8 hover:border-green-400/60 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-green-400/20">
              <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-green-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                Describe Your Vision
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Type a phrase, sentence, or paragraph that describes the image
                you want to create.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-gray-900/60 backdrop-blur-sm border border-green-400/30 rounded-3xl p-8 hover:border-green-400/60 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-green-400/20">
              <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-green-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                Watch the Magic
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Our AI-powered engine will transform your text into a
                high-quality, unique image in seconds.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-gray-900/60 backdrop-blur-sm border border-green-400/30 rounded-3xl p-8 hover:border-green-400/60 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-green-400/20">
              <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-green-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                Download & Share
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Instantly download your creation or share it with the world
                directly from our platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ✅ NEW SECTION 2: CREATE AI IMAGES */}
      <section className="py-24 relative z-10">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black text-white mb-4">
              Generate <span className="text-green-400"> AI Images</span>
            </h2>
            <p className="text-xl text-gray-300">
              Let your imagination take shape
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            {/* Left - Image Carousel */}
            <div
              className="relative group max-w-lg mx-auto w-full"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
              <div className="relative bg-gray-900/60 backdrop-blur-sm border border-green-400/30 rounded-3xl p-4 overflow-hidden">
                {/* Image Container */}
                <div className="relative w-full h-[400px] md:h-[450px]">
                  {aiImages.map((img, index) => (
                    <Image
                      key={index}
                      src={img}
                      alt={`AI Generated Image ${index + 1}`}
                      fill
                      className={`rounded-2xl object-cover transition-all duration-700 ${
                        index === currentAIImage
                          ? "opacity-100 scale-100"
                          : "opacity-0 scale-95"
                      }`}
                      unoptimized
                    />
                  ))}
                </div>

                {/* Progress Indicators */}
                <div className="flex justify-center gap-2 mt-4">
                  {aiImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentAIImage(index)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        index === currentAIImage
                          ? "w-8 bg-green-400"
                          : "w-1.5 bg-gray-600 hover:bg-gray-400"
                      }`}
                    />
                  ))}
                </div>

                {/* Pause Indicator */}
                {isPaused && (
                  <div className="absolute top-8 right-8 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full text-white text-xs font-medium">
                    ⏸️ Paused
                  </div>
                )}
              </div>
            </div>

            {/* Right - Text Content */}
            <div className="space-y-5 max-w-xl">
              <h3 className="text-3xl md:text-4xl font-black text-white leading-tight">
                Generate High-Quality{" "}
                <span className="text-green-400"> Images With AI</span>
              </h3>

              <p className="text-base text-gray-300 leading-relaxed">
                Unlock your imagination with our advanced AI image generator!
                Turn your concepts into eye-catching visuals with ease. Whether
                you&apos;re a creator, designer, or casual user, our
                user-friendly tool helps you produce high-quality, customizable
                images for any project.
              </p>

              <p className="text-base text-gray-300 leading-relaxed">
                With AI-powered accuracy and limitless creativity, bring your
                ideas to life instantly!
              </p>

              <p className="text-base text-gray-300 leading-relaxed">
                Step into the next era of design with our AI-backed image
                creation system. From vivid illustrations to ultra-realistic
                artwork, our platform delivers visuals perfectly aligned with
                your vision. Just enter your idea, and let the AI generate
                unique, professional images crafted to perfection.
              </p>

              <p className="text-base text-gray-300 leading-relaxed">
                Great for design, marketing, and inspiration—effortless
                creation.
              </p>

              <button
                onClick={() => router.push("/dashboard")}
                className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-green-500/50 transition-all duration-300 transform hover:scale-105 mt-2"
              >
                Start Creating →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ✅ NEW SECTION: FEATURES GRID (REPLACES THE REVERSED LAYOUT SECTION) */}
      <section className="py-24 relative z-10">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black text-white mb-4">
              Powerful <span className="text-green-400">Features</span>
            </h2>
            <p className="text-xl text-gray-300">
              Everything you need to create stunning visuals
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1: Lightning-Fast Generation */}
            <div className="bg-gray-900/60 backdrop-blur-sm border border-green-400/30 rounded-3xl p-8 hover:border-green-400/60 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-green-400/20 group">
              <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-green-500/30 transition-all duration-300">
                <svg
                  className="w-8 h-8 text-green-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Lightning-Fast Generation
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Create stunning images in seconds, not hours. Our AI processes
                your requests instantly.
              </p>
            </div>

            {/* Feature 2: Multiple Art Styles */}
            <div className="bg-gray-900/60 backdrop-blur-sm border border-green-400/30 rounded-3xl p-8 hover:border-green-400/60 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-green-400/20 group">
              <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-green-500/30 transition-all duration-300">
                <svg
                  className="w-8 h-8 text-green-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Multiple Art Styles
              </h3>
              <p className="text-gray-400 leading-relaxed">
                From photorealistic to anime, abstract to 3D. Choose from dozens
                of artistic styles.
              </p>
            </div>

            {/* Feature 3: HD Quality Exports */}
            <div className="bg-gray-900/60 backdrop-blur-sm border border-green-400/30 rounded-3xl p-8 hover:border-green-400/60 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-green-400/20 group">
              <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-green-500/30 transition-all duration-300">
                <svg
                  className="w-8 h-8 text-green-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                HD Quality Exports
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Download high-resolution images perfect for print, web, and
                professional use.
              </p>
            </div>

            {/* Feature 4: Batch Processing */}
            <div className="bg-gray-900/60 backdrop-blur-sm border border-green-400/30 rounded-3xl p-8 hover:border-green-400/60 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-green-400/20 group">
              <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-green-500/30 transition-all duration-300">
                <svg
                  className="w-8 h-8 text-green-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Single-Shot Image Rendering
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Optimized to produce one perfect image at a time with reliable
                output.
              </p>
            </div>

            {/* Feature 5: Commercial License */}
            <div className="bg-gray-900/60 backdrop-blur-sm border border-green-400/30 rounded-3xl p-8 hover:border-green-400/60 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-green-400/20 group">
              <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-green-500/30 transition-all duration-300">
                <svg
                  className="w-8 h-8 text-green-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Commercial License
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Use generated images for personal and commercial projects
                without restrictions.
              </p>
            </div>

            {/* Feature 6: No Watermarks */}
            <div className="bg-gray-900/60 backdrop-blur-sm border border-green-400/30 rounded-3xl p-8 hover:border-green-400/60 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-green-400/20 group">
              <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-green-500/30 transition-all duration-300">
                <svg
                  className="w-8 h-8 text-green-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                No Watermarks
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Clean, professional images without any branding or watermarks.
                100% yours.
              </p>
            </div>

            {/* Feature 7: Advanced Customization */}
            <div className="bg-gray-900/60 backdrop-blur-sm border border-green-400/30 rounded-3xl p-8 hover:border-green-400/60 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-green-400/20 group">
              <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-green-500/30 transition-all duration-300">
                <svg
                  className="w-8 h-8 text-green-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Advanced Customization
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Fine-tune every aspect with advanced controls for colors,
                composition, and details.
              </p>
            </div>

            {/* Feature 8: 24/7 Cloud Access */}
            <div className="bg-gray-900/60 backdrop-blur-sm border border-green-400/30 rounded-3xl p-8 hover:border-green-400/60 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-green-400/20 group">
              <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-green-500/30 transition-all duration-300">
                <svg
                  className="w-8 h-8 text-green-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                24/7 Cloud Access
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Access your creations anytime, anywhere. All images stored
                securely in the cloud.
              </p>
            </div>

            {/* Feature 9: Priority Support */}
            <div className="bg-gray-900/60 backdrop-blur-sm border border-green-400/30 rounded-3xl p-8 hover:border-green-400/60 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-green-400/20 group">
              <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-green-500/30 transition-all duration-300">
                <svg
                  className="w-8 h-8 text-green-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Priority Support
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Get help when you need it with our dedicated support team
                available 24/7.
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <div className="text-center mt-12">
            <button
              onClick={() => router.push("/dashboard")}
              className="px-10 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-green-500/50 transition-all duration-300 transform hover:scale-105"
            >
              Try All Features Free →
            </button>
          </div>
        </div>
      </section>

      {/* ✅ UPDATED SECTION 3: ALL TESTIMONIALS WITH FACE IMAGES */}
      <section className="py-24 relative z-10">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black text-white mb-4">
              User <span className="text-green-400"> Testimonials</span>
            </h2>
            <p className="text-xl text-gray-300">
              Trusted by Creators Worldwide
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Testimonial 1 - Liam Scott */}
            <div className="bg-gray-900/60 backdrop-blur-sm border border-green-400/30 rounded-3xl p-8 hover:border-green-400/60 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-green-400/20">
              <div className="flex flex-col items-center text-center">
                {/* ✅ Custom Face Image */}
                <div className="w-20 h-20 relative rounded-full overflow-hidden mb-4 ring-2 ring-green-400/50">
                  <Image
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200"
                    alt="Liam Scott"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <h4 className="text-xl font-bold text-white mb-1">
                  Liam Scott
                </h4>
                <p className="text-gray-400 text-sm mb-4">Graphic Designer</p>

                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-green-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                <p className="text-gray-300 leading-relaxed">
                  I&apos;ve been using Genova for nearly two years, primarily
                  for Instagram, and it has been incredibly user-friendly,
                  making my work much easier.
                </p>
              </div>
            </div>

            {/* Testimonial 2 - Samy Marine ✅ UPDATED WITH IMAGE */}
            <div className="bg-gray-900/60 backdrop-blur-sm border border-green-400/30 rounded-3xl p-8 hover:border-green-400/60 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-green-400/20">
              <div className="flex flex-col items-center text-center">
                {/* ✅ Custom Face Image */}
                <div className="w-20 h-20 relative rounded-full overflow-hidden mb-4 ring-2 ring-blue-400/50">
                  <Image
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200"
                    alt="Samie Marine"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <h4 className="text-xl font-bold text-white mb-1">
                  Samie Marine
                </h4>
                <p className="text-gray-400 text-sm mb-4">Content Creator</p>

                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-green-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                <p className="text-gray-300 leading-relaxed">
                  The AI-powered generation is mind-blowing! I create stunning
                  visuals for my YouTube channel in seconds. Absolute
                  game-changer!
                </p>
              </div>
            </div>

            {/* Testimonial 3 - Charles Lois ✅ UPDATED WITH IMAGE */}
            <div className="bg-gray-900/60 backdrop-blur-sm border border-green-400/30 rounded-3xl p-8 hover:border-green-400/60 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-green-400/20">
              <div className="flex flex-col items-center text-center">
                {/* ✅ Custom Face Image */}
                <div className="w-20 h-20 relative rounded-full overflow-hidden mb-4 ring-2 ring-purple-400/50">
                  <Image
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200"
                    alt="Charles Ben"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <h4 className="text-xl font-bold text-white mb-1">
                  Charles Ben
                </h4>
                <p className="text-gray-400 text-sm mb-4">Digital Marketer</p>

                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-green-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                <p className="text-gray-300 leading-relaxed">
                  Genova has transformed my marketing campaigns. The quality and
                  speed are unmatched. My clients are always impressed!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ✅ NEW SECTION 4: FINAL CTA */}
      <section className="py-32 relative z-10">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <h2 className="text-5xl md:text-6xl font-black text-white mb-8">
            Smarter with AI. <span className="text-green-400"> Try now.</span>
          </h2>

          <button
            onClick={() => router.push("/dashboard")}
            className="px-10 py-5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-full font-bold text-xl shadow-2xl hover:shadow-green-500/50 transition-all duration-300 transform hover:scale-105 active:scale-95 inline-flex items-center gap-3"
          >
            Generate Images ✨
          </button>
        </div>
      </section>

      {/* ✅ FOOTER */}
      <footer className="relative z-10 border-t border-green-400/20 bg-black/40 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-2">
          <div className="flex flex-col md:flex-row justify-center items-center gap-x-8 gap-y-4">
            {/* Left - Logo + Text + Copyright */}
            <div className="flex items-center gap-4">
              {/* Logo */}
              <div className="h-10 w-10 relative flex-shrink-0">
                <Image
                  src="/icon.png"
                  alt="Genova Logo"
                  fill
                  className="rounded-lg object-contain"
                />
              </div>
              {/* Genova Text */}
              <h3
                className="text-2xl font-black tracking-wider"
                style={{
                  color: "#000",
                  textShadow: `
                    0.5px 0.5px 0 #22c55e,
                    -0.5px -0.5px 0 #22c55e,
                    0.5px -0.5px 0 #22c55e,
                    -0.5px 0.5px 0 #22c55e,
                    0.5px 0 0 #22c55e,
                    -0.5px 0 0 #22c55e,
                    0 0.5px 0 #22c55e,
                    0 -0.5px 0 #22c55e
                  `,
              }}
              >
                Genova
              </h3>
              {/* Divider */}
              <div className="hidden md:block w-px h-8 bg-green-400/30"></div>
              {/* Copyright */}
              <p className="text-gray-400 text-sm">
                © Genova.ai — All rights reserved 2025
              </p>
            </div>
            {/* Social Media Icons */}
            <div className="flex items-center gap-4">
              {/* Facebook */}
              <a
                href="https://www.facebook.com/login/"
                className="w-10 h-10 rounded-full border-2 border-gray-600 hover:border-green-400 flex items-center justify-center transition-all duration-300 hover:scale-110 group"
              >
                <svg
                  className="w-5 h-5 text-gray-400 group-hover:text-green-400 transition-colors"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              {/* Twitter/X */}
              <a
                href="https://x.com/"
                className="w-10 h-10 rounded-full border-2 border-gray-600 hover:border-green-400 flex items-center justify-center transition-all duration-300 hover:scale-110 group"
              >
                <svg
                  className="w-5 h-5 text-gray-400 group-hover:text-green-400 transition-colors"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                  />
                </svg>
              </a>
              {/* Instagram */}
              <a
                href="https://www.instagram.com/accounts/login/?hl=en"
                className="w-10 h-10 rounded-full border-2 border-gray-600 hover:border-green-400 flex items-center justify-center transition-all duration-300 hover:scale-110 group"
              >
                <svg
                  className="w-5 h-5 text-gray-400 group-hover:text-green-400 transition-colors"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.645.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Mobile Copyright */}
          <div className="md:hidden text-center mt-6">
            <p className="text-gray-400 text-sm">
              Copyright ©Genova.ai | All rights reserved
            </p>
          </div>
        </div>
      </footer>

      {/* ✅ MODAL POPUP - Appears on button click with blur background */}
      {showModal && (
        <>
          {/* Blur Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60] animate-fade-in"
            onClick={closeModal}
          ></div>

          {/* Modal Container */}
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 animate-scale-in">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-10 relative">
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              {/* Modal Header */}
              <div className="text-center mb-8">
                <h2 className="text-3xl font-black text-gray-900 mb-2">
                  {isSignup ? "Create Account" : "Welcome Back!"}
                </h2>
                <p className="text-gray-600">
                  {isSignup
                    ? "Start creating AI art today"
                    : "Please login to continue"}
                </p>
              </div>

              {/* Tab Switcher */}
              <div className="flex gap-2 mb-6 bg-gray-100 p-1.5 rounded-xl">
                <button
                  onClick={() => setIsSignup(false)}
                  className={`flex-1 py-2.5 rounded-lg font-semibold transition-all duration-300 ${
                    !isSignup
                      ? "bg-white text-gray-900 shadow-md"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Login
                </button>
                <button
                  onClick={() => setIsSignup(true)}
                  className={`flex-1 py-2.5 rounded-lg font-semibold transition-all duration-300 ${
                    isSignup
                      ? "bg-white text-gray-900 shadow-md"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Sign Up
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* First Name - only for signup, at the top */}
                {isSignup && (
                  <div className="relative">
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="First Name"
                      className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 focus:border-green-400 rounded-xl text-gray-900 placeholder-gray-500 outline-none transition-all duration-300"
                      required
                    />
                    {/* You can add an icon here if you want, matching your style */}
                  </div>
                )}

                {/* Email Field (always visible) */}
                <div className="relative">
                  <svg
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 12a4 4 0 10-8 0 4 4 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address"
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 focus:border-green-400 rounded-xl text-gray-900 placeholder-gray-500 outline-none transition-all duration-300"
                    required
                  />
                </div>

                {/* Password Field (always visible) */}
                <div className="relative">
                  <svg
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 focus:border-green-400 rounded-xl text-gray-900 placeholder-gray-500 outline-none transition-all duration-300"
                    required
                  />
                </div>

                {/* ...rest of your form (forgot password, submit button, etc.) */}
                {!isSignup && (
                  <div className="text-right">
                    <button
                      type="button"
                      className="text-sm text-green-600 hover:text-green-700 font-medium"
                    >
                      Forgot Password?
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-green-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-3">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    <span>{isSignup ? "✨ Create Account" : "🚀 Login"}</span>
                  )}
                </button>
              </form>

              {/* Footer Text */}
              <p className="text-center text-sm text-gray-600 mt-6">
                {isSignup
                  ? "Already have an account? "
                  : "Don't have an account? "}
                <button
                  onClick={() => setIsSignup(!isSignup)}
                  className="text-green-600 hover:text-green-700 font-semibold"
                >
                  {isSignup ? "Login" : "Sign Up"}
                </button>
              </p>
            </div>
          </div>
        </>
      )}

      {/* ✅ NEW: SCROLL PROGRESS BUTTON */}
      {showScrollButton && (
        <button
          onClick={scrollToTop}
          onMouseDown={handleDragStart}
          onTouchStart={handleTouchStart}
          style={
            buttonPos
              ? {
                  position: "fixed",
                  left: buttonPos.x,
                  top: buttonPos.y,
                  zIndex: 100,
                  cursor: dragging || touchDragging ? "grabbing" : "grab",
                  touchAction: "none",
                  transition: (dragging || touchDragging) ? "none" : "box-shadow 0.3s, transform 0.3s",
                }
              : {
                  position: "fixed",
                  bottom: "2rem",
                  right: "2rem",
                  zIndex: 100,
                  cursor: dragging || touchDragging ? "grabbing" : "grab",
                  touchAction: "none",
                  transition: (dragging || touchDragging) ? "none" : "box-shadow 0.3s, transform 0.3s",
                }
          }
          className="group animate-fade-in"
          aria-label="Scroll to top"
        >
          {/* Outer glow ring */}
          <div className="absolute inset-0 bg-green-400/20 rounded-full blur-xl group-hover:bg-green-400/30 transition-all duration-300"></div>

          {/* Main button */}
          <div className="relative w-16 h-16 bg-gray-900/90 backdrop-blur-md border-2 border-green-400/50 rounded-full flex items-center justify-center group-hover:border-green-400 group-hover:scale-110 transition-all duration-300 shadow-2xl shadow-green-400/20">
            {/* Progress ring */}
            <svg className="absolute inset-0 w-16 h-16 -rotate-90">
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="rgba(34, 197, 94, 0.2)"
                strokeWidth="3"
                fill="none"
              />
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="#22c55e"
                strokeWidth="3"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 28}`}
                strokeDashoffset={`${
                  2 * Math.PI * 28 * (1 - scrollProgress / 100)
                }`}
                className="transition-all duration-300"
                strokeLinecap="round"
              />
            </svg>

            {/* Percentage text */}
            <div className="flex flex-col items-center">
              <span className="text-green-400 text-sm font-black">
                {scrollProgress}%
              </span>
            </div>

            {/* Up arrow (shows on hover) */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <svg
                className="w-6 h-6 text-green-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 10l7-7m0 0l7 7m-7-7v18"
                />
              </svg>
            </div>
          </div>

          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 px-3 py-1.5 bg-gray-900/90 backdrop-blur-sm text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            Back to top
          </div>
        </button>
      )}

      {/* ✅ ANIMATION STYLES */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.92) translateY(-20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        @keyframes glow {
          0%,
          100% {
            filter: brightness(1);
          }
          50% {
            filter: brightness(1.2);
          }
        }
        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.05);
          }
        }
        @keyframes pulse-slower {
          0%,
          100% {
            opacity: 0.2;
            transform: scale(1);
          }
          50% {
            opacity: 0.4;
            transform: scale(1.08);
          }
        }
        @keyframes fade-pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.4;
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        .animate-scale-in {
          animation: scale-in 0.7s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .animate-glow {
          animation: glow 3s ease-in-out infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        .animate-pulse-slower {
          animation: pulse-slower 6s ease-in-out infinite;
        }
        .animate-fade-pulse {
          animation: fade-pulse 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
