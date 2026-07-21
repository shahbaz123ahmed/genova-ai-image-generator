"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface HistoryItem {
  _id: string;
  image_url: string;
  prompt: string;
  style?: string;
  created_at: string;
}

interface CurrentImage {
  image_url: string;
  prompt: string;
  style?: string;
}

const ART_STYLES = [
  "Photorealistic",
  "Anime",
  "Fantasy",
  "Watercolour",
  "Cartoon",
  "Cinematic",
  "Oil Painting",
];

export default function Dashboard() {
  const [prompt, setPrompt] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("Photorealistic");
  const [showStyles, setShowStyles] = useState(false);

  const [imageUrl, setImageUrl] = useState<string>("");
  const [currentImage, setCurrentImage] = useState<CurrentImage | null>(null);

  const [loading, setLoading] = useState(false);
  const [imageGenerating, setImageGenerating] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showLogout, setShowLogout] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  
  const [credits, setCredits] = useState<number | null>(null);
  const [currentPlan, setCurrentPlan] = useState<string>("Free");
  const [planMonths, setPlanMonths] = useState<number>(0);
  
  const [userProfile, setUserProfile] = useState<{
    first_name: string;
    email: string;
    phone?: string;
    profile_pic?: string;
  } | null>(null);
  
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
      return;
    }
    // Fetch credits and profile from backend
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/me`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCredits(res.data.credits);
        setCurrentPlan(res.data.current_plan || "Free");
        setPlanMonths(res.data.plan_months || 0);
        setUserProfile({
          first_name: res.data.first_name,
          email: res.data.email,
          phone: res.data.phone,
          profile_pic: res.data.profile_pic,
        });
      } catch {
        setCredits(0);
        setCurrentPlan("Free");
        setPlanMonths(0);
        setUserProfile(null);
      }
    };
    fetchProfile();
  }, [router]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
      return;
    }
    const fetchHistory = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/history`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setHistory(res.data.images);
      } catch {
        // handle error
      }
    };
    fetchHistory();
  }, [router]);

  const generateImage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim()) return alert("Please enter a prompt!");
    if (credits === null || credits <= 0) {
      router.push("/buy"); // <-- Redirect to buy page
      return;
    }
    setCredits(credits - 1); // Decrement credits for demo
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Session expired. Please login again.");
      router.push("/");
      return;
    }
    setImageUrl("");
    setCurrentImage(null);
    setImageLoaded(false);
    setImageGenerating(true);
    setLoading(true);

    const startTime = Date.now();
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/generate`,
        { prompt, style: selectedStyle },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setImageUrl(res.data.image_url);
      setCurrentImage(res.data);
      setLoading(false);

      // After successful image generation:
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/decrement-credit`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const creditsRes = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/me`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCredits(creditsRes.data.credits);
    } catch (err: unknown) {
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, 3000 - elapsedTime);
      await new Promise((resolve) => setTimeout(resolve, remainingTime));
      setLoading(false);
      setImageGenerating(false);
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 503) {
          alert("Model is loading. Please wait 20 seconds and try again.");
        } else if (err.response?.status === 401) {
          alert("Session expired. Please login again.");
          localStorage.removeItem("token");
          router.push("/");
        } else {
          const errorMessage =
            err.response?.data?.detail || "Generation failed";
          alert(errorMessage);
        }
      }
    }
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
    setTimeout(() => {
      setImageGenerating(false);
    }, 500);
  };

  const saveImage = async () => {
    if (!currentImage) return;
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/save-image`,
        currentImage,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/history`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setHistory(res.data.images);
      alert("Image saved to history!");
    } catch {
      alert("Failed to save image");
    }
  };

  const deleteCurrentImage = () => {
    setImageUrl("");
    setCurrentImage(null);
    setImageLoaded(false);
  };

  const deleteFromHistory = async (imageId: string) => {
    if (!confirm("Delete this image from history?")) return;
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/delete-image/${imageId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/history`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setHistory(res.data.images);
    } catch {
      alert("Failed to delete image");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    router.push("/"); // Redirect to landing page
  };

  const handleProfilePicUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/profile-pic`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (userProfile) {
        setUserProfile({
          ...userProfile,
          profile_pic: res.data.profile_pic,
        });
      }
    } catch (err) {
      console.error("Failed to upload profile picture:", err);
      alert("Failed to upload profile picture. Please try again.");
    }
  };

  const handleSaveProfile = async () => {
    if (!userProfile) return;
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/profile`,
        {
          first_name: userProfile.first_name,
          phone: userProfile.phone || "",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Profile updated successfully!");
      setShowProfileModal(false);
    } catch (err) {
      console.error("Failed to update profile:", err);
      alert("Failed to update profile.");
    }
  };

  const downloadImage = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Failed to download image:", error);
      // Fallback
      const link = document.createElement("a");
      link.href = url;
      link.target = "_blank";
      link.download = filename;
      link.click();
    }
  };

  return (
    <>
      <div className="min-h-screen bg-[#181e27] flex flex-col">
        {/* Navbar */}
        <header className="fixed top-0 w-full bg-black/40 backdrop-blur-xl z-50 border-b border-green-400/30">
          <div className="container mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
            {/* Logo + Text */}
            <div className="flex items-center gap-2 sm:gap-3 animate-fade-pulse">
              <div className="h-9 w-9 sm:h-12 sm:w-12 relative flex-shrink-0">
                <Image
                  src="/icon.png"
                  alt="Genova Logo"
                  fill
                  className="rounded-lg object-contain"
                />
              </div>
              <span className="text-2xl sm:text-3xl md:text-4xl font-black tracking-wider genova-outline">
                Genova
              </span>
            </div>
            {/* Hi, Welcome + Icon + Logout Popup */}
            <div className="relative flex items-center">
              {/* Hi, Welcome (desktop only) */}
              <span className="hidden md:inline-block text-green-400 font-semibold text-lg mr-2">
                Your profile
              </span>
              <div className="relative">
                <button
                  className="flex items-center gap-2 focus:outline-none transition-all duration-200"
                  aria-label="User menu"
                  onClick={() => setShowLogout((prev) => !prev)}
                >
                  {userProfile?.profile_pic ? (
                    <div className={`w-9 h-9 rounded-full overflow-hidden border-2 border-green-400 transition-all duration-200 ${
                      showLogout ? "scale-110 border-green-300 shadow-lg" : ""
                    }`}>
                      <img 
                        src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${userProfile.profile_pic}`}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <svg
                      className={`w-9 h-9 text-green-400 bg-green-900/30 rounded-full p-1 border-2 border-green-400 transition-all duration-200 ${
                        showLogout ? "scale-110 border-green-300 shadow-lg" : ""
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  )}
                </button>
                {showLogout && (
                  <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-green-400 z-50">
                    <button
                      onClick={() => { setShowProfileModal(true); setShowLogout(false); }}
                      className="w-full px-4 py-3 text-gray-700 hover:bg-green-50 rounded-t-xl text-left font-semibold border-b border-gray-100"
                    >
                      Profile
                    </button>
                    <button
                      onClick={() => { setShowPlanModal(true); setShowLogout(false); }}
                      className="w-full px-4 py-3 text-gray-700 hover:bg-green-50 text-left font-semibold border-b border-gray-100"
                    >
                      Your Plan
                    </button>
                    <button
                      onClick={logout}
                      className="w-full px-4 py-3 text-red-600 hover:bg-green-50 rounded-b-xl text-left font-semibold"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <style jsx>{`
            @keyframes fade-pulse {
              0%,
              100% {
                opacity: 1;
              }
              50% {
                opacity: 0.4;
              }
            }
            .animate-fade-pulse {
              animation: fade-pulse 3s ease-in-out infinite;
            }
            .genova-outline {
              color: transparent;
              -webkit-text-stroke: 0.5px #22c55e;
              text-stroke: 0.5px #22c55e;
              text-shadow: none;
              font-family: inherit;
              font-weight: 900;
            }
          `}</style>
        </header>

        {/* Loading Popup */}
        {imageGenerating && (
          <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center pointer-events-auto">
            <div className="bg-gray-900/95 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-green-400/30 max-w-md text-center">
              <div className="relative mb-6">
                <div className="w-24 h-24 border-4 border-gray-700 border-t-green-400 rounded-full animate-spin mx-auto"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-green-400/20 rounded-full animate-ping"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-6 h-6 bg-green-400 rounded-full"></div>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                🎨 Creating Magic...
              </h3>
              <p className="text-green-400 text-lg">
                {imageLoaded
                  ? "Almost ready..."
                  : "Your image is generating... please wait"}
              </p>
              <div className="mt-6 flex justify-center gap-1">
                <div
                  className="w-2 h-2 bg-green-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-green-400 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-green-400 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                ></div>
              </div>
            </div>
          </div>
        )}

        <main className="flex-1 max-w-3xl mx-auto px-3 sm:px-4 py-6 sm:py-10 pt-20 sm:pt-24 w-full">
          {/* Prompt Input */}
          <form onSubmit={generateImage}>
            <div className="bg-[#232b39] rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 shadow-lg border border-green-400/40 focus-within:border-green-400 transition-all duration-200">
              <div className="flex items-center gap-3">
                {/* Palette Icon for style selection */}
                <button
                  type="button"
                  onClick={() => setShowStyles((v) => !v)}
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-transparent hover:bg-green-900 transition border border-green-400 text-green-400"
                  tabIndex={-1}
                  aria-label="Select Art Style"
                >
                  {/* Palette SVG */}
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path
                      d="M12 3C7.03 3 3 7.03 3 12c0 3.87 3.13 7 7 7h1a2 2 0 002-2v-1a1 1 0 011-1h1a4 4 0 000-8h-1a1 1 0 01-1-1V5a2 2 0 00-2-2zm-2 7a1 1 0 110-2 1 1 0 010 2zm6 6a1 1 0 110-2 1 1 0 010 2zm-6 2a1 1 0 110-2 1 1 0 010 2zm8-8a1 1 0 110-2 1 1 0 010 2z"
                      stroke="#94a3b8"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <input
                  type="text"
                  className="flex-1 bg-transparent outline-none text-base sm:text-lg text-white placeholder-gray-400 min-w-0"
                  placeholder="Enter prompt."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && generateImage(e)}
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading || !prompt.trim()}
                  className={`
                    ml-3 bg-green-500 hover:bg-green-600 text-white
                    px-4 py-2 rounded-full transition-all duration-200
                    text-2xl flex items-center justify-center
                    ${loading ? "opacity-50 cursor-not-allowed" : ""}
                    sm:px-4 sm:py-2 px-2 py-2
                  `}
                  style={{ minWidth: 0, width: "40px", height: "40px" }}
                  aria-label="Generate"
                >
                  <span className="font-bold" style={{ fontSize: "1.5rem" }}>
                    →
                  </span>
                </button>
              </div>
              {/* Styles Dropdown */}
              {showStyles && (
                <div className="mt-3 p-3 sm:p-4 bg-gray-900/95 backdrop-blur-sm border-2 border-gray-700 rounded-xl absolute z-20 left-0 right-0 w-full sm:w-auto max-h-[50vh] overflow-y-auto">
                  <h3 className="text-sm font-semibold mb-3 text-gray-300">
                    Select Art Style
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {ART_STYLES.map((style) => (
                      <button
                        key={style}
                        type="button"
                        onClick={() => {
                          setSelectedStyle(style);
                          setShowStyles(false);
                        }}
                        className={`text-left p-3 rounded-lg transition-all ${
                          selectedStyle === style
                            ? "bg-green-500/20 border-2 border-green-400 text-green-400"
                            : "bg-gray-800/50 border-2 border-transparent hover:border-gray-600 text-gray-300"
                        }`}
                      >
                        {style}
                        {selectedStyle === style && (
                          <span className="float-right">✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {/* Show selected style as a badge inside the input area */}
              <div className="mt-4 flex justify-end">
                <span className="inline-block bg-green-900/60 text-green-300 px-3 py-1 rounded-full text-xs font-semibold mr-4">
                  Plan: {currentPlan}
                </span>
                <span className="inline-block bg-green-900/60 text-green-300 px-3 py-1 rounded-full text-xs font-semibold">
                  {selectedStyle}
                </span>
              </div>
            </div>
          </form>

          {/* Generated Image */}
          {imageUrl && (
            <div className="bg-[#202736] rounded-2xl p-4 sm:p-6 mb-8 shadow-lg relative group">
              <div className="flex justify-center">
                <div className="relative w-full max-w-[380px] sm:max-w-[400px] aspect-square rounded-xl overflow-hidden mx-auto">
                  <Image
                    src={imageUrl}
                    alt="Generated"
                    fill
                    className="object-cover rounded-xl"
                    unoptimized
                    onLoad={handleImageLoad}
                  />
                  {imageLoaded && (
                    <button
                      onClick={deleteCurrentImage}
                      className="absolute top-3 right-3 bg-red-600 hover:bg-red-700 text-white rounded-full p-2 z-20 shadow-lg"
                      aria-label="Delete"
                      style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}
                    >
                      {/* Trash Icon */}
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-between items-center mt-6">
                <button
                  onClick={saveImage}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white transition"
                >
                  <svg width="20" height="20" fill="none">
                    <circle
                      cx="10"
                      cy="10"
                      r="10"
                      fill="#fff"
                      fillOpacity="0.15"
                    />
                    <path
                      d="M7 10l3 3 3-3M10 13V7"
                      stroke="#fff"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                  Save to History
                </button>
                <button
                  onClick={() => downloadImage(imageUrl, "ai-image.png")}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-semibold bg-green-600 hover:bg-green-700 text-white transition"
                >
                  <svg width="20" height="20" fill="none">
                    <rect
                      width="20"
                      height="20"
                      rx="10"
                      fill="#fff"
                      fillOpacity="0.15"
                    />
                    <path
                      d="M10 5v8m0 0l-3-3m3 3l3-3M5 15h10"
                      stroke="#fff"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                  Download
                </button>
              </div>
              {currentImage && (
                <div className="mt-4 text-gray-400 text-sm">
                  <div>Prompt: {currentImage.prompt}</div>
                  <div>Style: {currentImage.style}</div>
                </div>
              )}
            </div>
          )}

          {/* History */}
          {history.length > 0 && (
            <div className="mt-10 w-full">
              <h2 className="text-lg font-bold text-white mb-4 text-center">
                Your Generated Images
              </h2>
              <div
                className="
                  w-full
                  grid
                  grid-cols-1
                  sm:grid-cols-2
                  md:grid-cols-3
                  lg:grid-cols-4
                  gap-8
                  px-0
                  mx-0
                "
                style={{
                  maxWidth: "100vw",
                }}
              >
                {history.map((img) => (
                  <div
                    key={img._id}
                    className={`
                      relative group rounded-3xl overflow-hidden
                      border border-[#222c3a] bg-[#202736]
                      transition-all duration-300
                      hover:border-green-400
                      shadow-lg
                    `}
                    style={{
                      aspectRatio: "5 / 3", // Increased breadth (width) for a wider rectangle
                      minHeight: "300px",
                      width: "100%",
                    }}
                  >
                    <Image
                      src={img.image_url}
                      alt={img.prompt}
                      fill
                      unoptimized
                      className={`
                        object-cover
                        transition-all duration-500
                        group-hover:opacity-60 group-hover:scale-105
                      `}
                    />
                    {/* Green outline accent */}
                    <span className="pointer-events-none absolute inset-0 rounded-3xl border-2 border-green-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {/* Buttons */}
                    <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
                      <button
                        onClick={() =>
                          downloadImage(
                            img.image_url,
                            `${img.prompt.substring(0, 20)}.png`
                          )
                        }
                        className="p-2 bg-green-500/80 hover:bg-green-600 rounded-lg backdrop-blur-sm"
                        title="Download Image"
                      >
                        <svg
                          className="w-4 h-4 text-white"
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
                      </button>
                      <button
                        onClick={() => deleteFromHistory(img._id)}
                        className="p-2 bg-red-500/80 hover:bg-red-600 rounded-lg backdrop-blur-sm"
                        title="Delete Image"
                      >
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                    {/* Only show style name on hover */}
                    {img.style && (
                      <div className="absolute bottom-0 left-0 right-0 bg-black/70 rounded-b-3xl px-4 py-2 flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                        <span className="text-green-400 text-base font-semibold">
                          {img.style}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="relative z-10 border-t border-green-400/20 bg-black/40 backdrop-blur-xl">
          <div className="max-w-2xl mx-auto px-6 py-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              {/* Left */}
              <div className="flex items-center gap-3">
                {/* Logo */}
                <div className="h-8 w-8 relative flex-shrink-0">
                  <Image
                    src="/icon.png"
                    alt="Genova Logo"
                    fill
                    className="rounded-md object-contain"
                  />
                </div>

                {/* Brand */}
                <h3
                  className="text-xl font-black tracking-wider"
                  style={{
                    color: "#000",
                    textShadow: `
                      0.5px 0.5px 0 #22c55e,
                      -0.5px -0.5px 0 #22c55e,
                      0.5px -0.5px 0 #22c55e,
                      -0.5px 0.5px 0 #22c55e
                    `,
                  }}
                >
                  Genova
                </h3>

                {/* Divider */}
                <div className="hidden md:block w-px h-6 bg-green-400/30"></div>

                {/* Copyright */}
                <p className="hidden md:block text-gray-400 text-xs">
                  © Genova.ai — All rights reserved 2025
                </p>
              </div>

              {/* Right - Socials */}
              <div className="flex items-center gap-3">
                {/* Facebook */}
                <a
                  href="https://www.facebook.com/login/"
                  className="w-8 h-8 rounded-full border border-gray-600 hover:border-green-400 flex items-center justify-center transition-all hover:scale-110 group"
                >
                  <svg
                    className="w-4 h-4 text-gray-400 group-hover:text-green-400 transition-colors"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                {/* X (Twitter) */}
                <a
                  href="https://x.com/"
                  className="w-8 h-8 rounded-full border border-gray-600 hover:border-green-400 flex items-center justify-center transition-all hover:scale-110 group"
                >
                  <svg
                    className="w-4 h-4 text-gray-400 group-hover:text-green-400 transition-colors"
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
                  className="w-8 h-8 rounded-full border border-gray-600 hover:border-green-400 flex items-center justify-center transition-all hover:scale-110 group"
                >
                  <svg
                    className="w-4 h-4 text-gray-400 group-hover:text-green-400 transition-colors"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Mobile Copyright */}
            <div className="md:hidden text-center mt-3">
              <p className="text-gray-400 text-xs">
                © Genova.ai — All rights reserved
              </p>
            </div>
          </div>
        </footer>

        {/* Profile Modal */}
        {showProfileModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-[#181e27] border border-green-400/30 rounded-3xl shadow-2xl p-5 sm:p-8 w-[94vw] sm:w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setShowProfileModal(false)}
                className="absolute top-5 right-5 text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <h2 className="text-2xl font-bold text-white mb-8">Your Profile</h2>
              
              <div className="flex flex-col md:flex-row gap-8 mb-8">
                {/* Left: Profile Picture */}
                <div className="flex flex-col items-center justify-center md:border-r border-white/10 md:pr-8">
                  <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-[#131b2c] shadow-lg bg-green-900/30 group">
                    {userProfile?.profile_pic ? (
                      <img 
                        src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${userProfile.profile_pic}`}
                        alt="Profile Picture"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-green-400">
                        <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    )}
                    {/* Hover Overlay for Upload */}
                    <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                      <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleProfilePicUpload} 
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 mt-3 text-center">Click to change picture</p>
                </div>

                {/* Right: Active Plan Details */}
                <div className="flex-1 flex flex-col justify-center space-y-4">
                  <div className="bg-[#131b2c] border border-white/5 rounded-2xl p-5 flex justify-between items-center">
                    <span className="text-gray-400 font-medium">Current Plan</span>
                    {currentPlan.toLowerCase() === "free" ? (
                      <span className="text-sm font-bold text-red-400 bg-red-500/10 px-3 py-1 rounded-lg border border-red-500/20">No Active Plan</span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-green-400">{currentPlan}</span>
                        <span className="bg-green-500/10 text-green-400 border border-green-500/20 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">
                          Active
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {currentPlan.toLowerCase() !== "free" ? (
                    <>
                      <div className="bg-[#131b2c] border border-white/5 rounded-2xl p-5 flex justify-between items-center">
                        <span className="text-gray-400 font-medium">Available Credits</span>
                        <span className="text-lg font-bold text-white">{credits}</span>
                      </div>
                      {planMonths > 0 && (
                        <div className="bg-[#131b2c] border border-white/5 rounded-2xl p-5 flex justify-between items-center">
                          <span className="text-gray-400 font-medium">Duration</span>
                          <span className="text-lg font-bold text-white">{planMonths} {planMonths === 1 ? 'Month' : 'Months'}</span>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="bg-[#131b2c] border border-white/5 rounded-2xl p-5 flex justify-between items-center">
                      <span className="text-gray-400 font-medium">Trial Credits</span>
                      <span className="text-lg font-bold text-white">{credits}</span>
                    </div>
                  )}
                  {currentPlan.toLowerCase() === "free" && (
                    <button
                      onClick={() => { setShowProfileModal(false); router.push("/buy"); }}
                      className="w-full text-sm bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/30 rounded-xl py-2.5 font-semibold transition-all mt-2"
                    >
                      Upgrade Plan
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#131b2c] border border-white/5 rounded-2xl p-5 md:col-span-2">
                  <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">Email (Read Only)</p>
                  <p className="text-white font-medium">{userProfile?.email || "N/A"}</p>
                </div>

                <div className="bg-[#131b2c] border border-white/5 rounded-2xl p-5 focus-within:border-green-400/50 transition-colors">
                  <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1 block">Name</label>
                  <input
                    type="text"
                    value={userProfile?.first_name || ""}
                    onChange={(e) => userProfile && setUserProfile({ ...userProfile, first_name: e.target.value })}
                    className="w-full bg-transparent text-white font-medium text-lg focus:outline-none"
                    placeholder="Enter your name"
                  />
                </div>
                
                <div className="bg-[#131b2c] border border-white/5 rounded-2xl p-5 focus-within:border-green-400/50 transition-colors">
                  <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1 block">Mobile Number</label>
                  <input
                    type="tel"
                    value={userProfile?.phone || ""}
                    onChange={(e) => userProfile && setUserProfile({ ...userProfile, phone: e.target.value })}
                    className="w-full bg-transparent text-white font-medium text-lg focus:outline-none"
                    placeholder="Enter your mobile number"
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={handleSaveProfile}
                  className="w-full md:w-auto px-8 bg-green-500 hover:bg-green-600 text-white rounded-xl py-3 font-semibold shadow-lg shadow-green-500/20 transition-all"
                >
                  Save Profile
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Plan Details Modal */}
        {showPlanModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-[#181e27] border border-green-400/30 rounded-3xl shadow-2xl p-5 sm:p-8 w-[94vw] sm:w-full max-w-md relative max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setShowPlanModal(false)}
                className="absolute top-5 right-5 text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <h2 className="text-2xl font-bold text-white mb-6">Your Plan Details</h2>
              
              <div className="space-y-4">
                <div className="bg-[#131b2c] border border-white/5 rounded-2xl p-5 flex justify-between items-center">
                  <span className="text-gray-400 font-medium">Current Plan</span>
                  {currentPlan.toLowerCase() === "free" ? (
                    <span className="text-xl font-bold text-red-400 bg-red-500/10 px-3 py-1 rounded-lg border border-red-500/20">No Active Plan</span>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-green-400">{currentPlan}</span>
                      <span className="bg-green-500/10 text-green-400 border border-green-500/20 text-xs px-2.5 py-0.5 rounded-full font-semibold">
                        Active
                      </span>
                    </div>
                  )}
                </div>
                
                {currentPlan.toLowerCase() !== "free" ? (
                  <>
                    <div className="bg-[#131b2c] border border-white/5 rounded-2xl p-5 flex justify-between items-center">
                      <span className="text-gray-400 font-medium">Available Credits</span>
                      <span className="text-xl font-bold text-white">{credits}</span>
                    </div>
                    {planMonths > 0 && (
                      <div className="bg-[#131b2c] border border-white/5 rounded-2xl p-5 flex justify-between items-center">
                        <span className="text-gray-400 font-medium">Duration</span>
                        <span className="text-xl font-bold text-white">{planMonths} {planMonths === 1 ? 'Month' : 'Months'}</span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="bg-[#131b2c] border border-white/5 rounded-2xl p-5 flex justify-between items-center">
                    <span className="text-gray-400 font-medium">Trial Credits</span>
                    <span className="text-xl font-bold text-white">{credits}</span>
                  </div>
                )}
              </div>

              <div className="mt-8">
                <button
                  onClick={() => { setShowPlanModal(false); router.push("/buy"); }}
                  className="w-full bg-green-500 hover:bg-green-600 text-white rounded-xl py-3 font-semibold shadow-lg shadow-green-500/20 transition-all"
                >
                  {currentPlan.toLowerCase() === "free" ? "Choose a Plan" : "Upgrade Plan"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
