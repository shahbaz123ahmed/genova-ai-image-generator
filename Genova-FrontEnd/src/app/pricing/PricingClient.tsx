"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { SiGooglepay, SiPaytm, SiPhonepe, SiAmazonpay } from "react-icons/si";
import { IoClose } from "react-icons/io5";

const PLANS = [
  {
    name: "Lite",
    price: 3,
    credits: 300,
    desc: "Best for hobbyists and beginners.",
    features: [
      "300 Credits",
      "Standard Quality",
      "Commercial Use",
      "Fast Generation",
      "Private Gallery",
      "Email Support",
    ],
  },
  {
    name: "Pro",
    price: 12,
    credits: 1500,
    desc: "Best for professionals.",
    popular: true,
    features: [
      "1500 Credits",
      "HD Images",
      "Priority Generation",
      "Batch Generation",
      "No Watermark",
      "Commercial License",
      "Image History",
      "Priority Support",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    credits: "Unlimited",
    desc: "Best for enterprise teams.",
    features: [
      "Unlimited Credits",
      "API Access",
      "Dedicated GPU",
      "Team Workspace",
      "White Label",
      "Custom AI Models",
      "Unlimited Storage",
      "24/7 Premium Support",
    ],
  },
];

// Example bank icons: place PNGs in /public/banks/ or use emoji fallback
const BANKS = [
  [
    {
      name: "AuBank",
      icon: "https://upload.wikimedia.org/wikipedia/commons/2/28/Aubank.svg",
    },
    {
      name: "Airtel Payments Bank",
      icon: "https://upload.wikimedia.org/wikipedia/commons/9/9c/Airtel_payments_bank_logo.jpg",
      issue: undefined,
    },
    {
      name: "Axis Bank",
      icon: "https://upload.wikimedia.org/wikipedia/commons/1/1a/Axis_Bank_logo.svg",
    },
    {
      name: "Bank of Baroda",
      icon: "https://upload.wikimedia.org/wikipedia/commons/f/f2/Bank_of_Baroda_Ghana_Logo.jpg",
    },
    {
      name: "Bank of India",
      icon: "https://upload.wikimedia.org/wikipedia/commons/a/a4/State-Bank-of-India-Logo.svg",
    },
    {
      name: "Canara Bank",
      icon: "https://upload.wikimedia.org/wikipedia/commons/9/99/Canara_bank_logo.png",
    },
    {
      name: "DCB Bank",
      icon: "https://upload.wikimedia.org/wikipedia/commons/c/c5/DCB_BANK_reverse_logo_June_2011.jpg",
    },
    {
      name: "City Savings Bank",
      icon: "https://upload.wikimedia.org/wikipedia/commons/b/b2/Citysavings_logo.png",
    },
    {
      name: "Federal Bank",
      icon: "https://upload.wikimedia.org/wikipedia/commons/8/86/Federal_Bank_Logo.jpg",
    },
    {
      name: "HDFC Bank",
      icon: "https://upload.wikimedia.org/wikipedia/commons/b/b7/HDFC_LOGO.jpg",
    },
    {
      name: "ICICI Bank",
      icon: "https://upload.wikimedia.org/wikipedia/commons/1/12/ICICI_Bank_Logo.svg",
    },
    {
      name: "IDFC First Bank",
      icon: "https://upload.wikimedia.org/wikipedia/commons/3/36/IDFC_Bank_Logo.svg",
    },
    {
      name: "Indian Overseas Bank",
      icon: "https://upload.wikimedia.org/wikipedia/commons/f/fc/Indian_Overseas_Bank_Logo.svg",
    },
    {
      name: "IndusInd Bank",
      icon: "https://upload.wikimedia.org/wikipedia/commons/4/40/IndusInd_Bank_SVG_Logo.svg",
    },
    {
      name: "Jio Payments Bank",
      icon: "https://upload.wikimedia.org/wikipedia/commons/8/8b/Jio-pay.svg",
    },
    {
      name: "Kotak Mahindra Bank",
      icon: "https://upload.wikimedia.org/wikipedia/commons/f/fa/ATM_of_Kotak_in_Shyambazar_01.jpg",
    },
    {
      name: "Paytm Payments Bank",
      icon: "https://upload.wikimedia.org/wikipedia/commons/9/91/Paytm_payments_bank.svg",
    },
    {
      name: "Punjab National Bank",
      icon: "https://upload.wikimedia.org/wikipedia/commons/b/b2/Punjab_National_Bank_new_logo.svg",
    },
    {
      name: "RBL Bank",
      icon: "https://upload.wikimedia.org/wikipedia/commons/7/70/RBL_Bank_SVG_Logo.svg",
    },
    {
      name: "Union Bank of India",
      icon: "https://upload.wikimedia.org/wikipedia/commons/d/d0/Union_Bank_of_India_Logo.svg",
    },
    {
      name: "Yes Bank",
      icon: "https://upload.wikimedia.org/wikipedia/commons/f/fd/Yes_Bank_Logo_2024.jpg",
      desc: "",
      issue: undefined,
    },
  ],
];

export default function BuyPage() {
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentStep, setPaymentStep] = useState<
    "select" | "processing" | "success"
  >("select");
  const [selectedMethod, setSelectedMethod] = useState<string>("UPI");
  const [hovered, setHovered] = useState<number | null>(null);

  // Netbanking states
  const [showBankModal, setShowBankModal] = useState(false);
  const [bankSearch, setBankSearch] = useState("");
  type Bank = {
    name: string;
    icon?: string;
    desc?: string;
    issue?: string;
  };
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [paymentResult, setPaymentResult] = useState<
    "success" | "declined" | null
  >(null);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const router = useRouter();

  const handlePurchase = (planIdx: number) => {
    setSelectedPlan(planIdx);
    setShowPayment(true);
    setIsFormSubmitted(false);
    setNameForm("");
    setEmailForm("");
    setPhoneForm("");
  };

  const [nameForm, setNameForm] = useState("");
  const [emailForm, setEmailForm] = useState("");
  const [phoneForm, setPhoneForm] = useState("");
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameForm || !emailForm || !phoneForm || selectedPlan === null) return;
    
    setIsSubmittingForm(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000";
      const res = await fetch(`${baseUrl}/auth/requests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: nameForm,
          email: emailForm,
          phone: phoneForm,
          plan_name: PLANS[selectedPlan].name
        }),
      });
      if (res.ok) {
        setIsFormSubmitted(true);
      } else {
        alert("Failed to submit request.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingForm(false);
    }
  };

  // Reset all netbanking modals
  const resetNetbanking = () => {
    setShowBankModal(false);
    setBankSearch("");
    setSelectedBank(null);
    setShowConfirmModal(false);
    setProcessing(false);
    setPaymentResult(null);
    setShowExitConfirm(false);
  };

  const [upiId, setUpiId] = useState("");
  const [upiError, setUpiError] = useState("");

  return (
    <div className="min-h-screen bg-[#181e27] flex flex-col">
      {/* Navbar (copied from dashboard) */}
      <header className="fixed top-0 w-full bg-black/40 backdrop-blur-xl z-50 border-b border-green-400/30">
        <div className="container mx-auto px-6 py-3 flex justify-between items-center">
          {/* Go Back Button */}
          <button
            className="flex items-center gap-2 text-green-400 hover:text-green-300 font-semibold text-lg"
            onClick={() => router.push("/dashboard")}
          >
            {/* Reverse Arrow SVG */}
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path
                d="M15 19l-7-7 7-7"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Go Back
          </button>
          {/* Logo and Brand */}
          <div className="flex items-center gap-3 animate-fade-pulse">
            <div className="h-12 w-12 relative flex-shrink-0">
              <Image
                src="/icon.png"
                alt="Genova Logo"
                fill
                className="rounded-lg object-contain"
              />
            </div>
            <span className="text-3xl md:text-4xl font-black tracking-wider genova-outline">
              Genova
            </span>
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

      <main className="flex-1 flex flex-col items-center justify-center px-4 pt-32 pb-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-green-900/10 via-[#181e27] to-[#181e27]">
        <div className="text-center mb-16 relative">
          <div className="absolute -top-6 -right-12 bg-green-500/20 text-green-400 text-xs font-bold px-3 py-1 rounded-full border border-green-500/30 animate-pulse">
            Save 25%
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-white tracking-tight">
            Simple, transparent <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600">pricing</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Choose the perfect plan for your creative needs. Upgrade, downgrade, or cancel anytime.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 w-full max-w-7xl justify-center items-stretch transition-all duration-300">
          {PLANS.map((plan, idx) => {
            const isPro = plan.name === "Pro";
            return (
              <div
                key={plan.name}
                className={`relative bg-[#131b2c]/80 backdrop-blur-xl rounded-[20px] flex flex-col px-8 py-10 w-full lg:w-1/3 transition-all duration-300 ${
                  isPro 
                    ? "border-green-500/50 shadow-[0_0_30px_rgba(34,197,94,0.15)] scale-105 z-10" 
                    : "border-white/5 hover:-translate-y-2 hover:scale-[1.02] shadow-xl hover:border-white/10"
                }`}
                onMouseEnter={() => setHovered(idx)}
                onMouseLeave={() => setHovered(null)}
              >
                {isPro && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-green-400 to-green-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg whitespace-nowrap">
                    ⭐ MOST POPULAR
                  </div>
                )}
                
                <div className="mb-2 text-xl font-bold text-white">
                  {plan.name}
                </div>
                <p className="text-sm text-gray-400 mb-6 h-10">{plan.desc}</p>
                
                <div className="mb-2">
                  <span className="text-5xl font-extrabold text-white">
                    {plan.price === "Custom" ? plan.price : `$${plan.price}`}
                  </span>
                  {plan.price !== "Custom" && <span className="text-gray-400 font-medium">/month</span>}
                </div>
                <div className="text-green-400 text-sm font-medium mb-8">
                  ≈ Generates up to {plan.credits === "Unlimited" ? "unlimited" : Math.floor(Number(plan.credits) / 2)} AI images/month
                </div>

                <button
                  className={`w-full py-3.5 rounded-xl font-bold text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
                    isPro 
                      ? "bg-gradient-to-r from-green-400 to-green-600 shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_25px_rgba(34,197,94,0.5)]" 
                      : plan.name === "Enterprise"
                      ? "bg-gradient-to-r from-purple-500 to-indigo-600 shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_25px_rgba(168,85,247,0.5)]"
                      : "bg-white/5 hover:bg-white/10 border border-white/10"
                  }`}
                  onClick={() => handlePurchase(idx)}
                >
                  {isPro ? "Upgrade to Pro" : plan.name === "Enterprise" ? "Contact Sales" : "Get Started"}
                </button>

                <div className="mt-8 space-y-4 flex-1">
                  {plan.features.map((feature, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-green-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Comparison Footer */}
        <div className="mt-20 flex flex-wrap justify-center gap-6 md:gap-12 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <span className="text-green-400 text-lg">✅</span> Secure Payments
          </div>
          <div className="flex items-center gap-2">
            <span className="text-blue-400 text-lg">⚡</span> Instant Credit Delivery
          </div>
          <div className="flex items-center gap-2">
            <span className="text-purple-400 text-lg">🔒</span> Commercial License Included
          </div>
        </div>
      </main>

      {/* Contact Sales / Manual Payment Modal */}
      {showPayment && selectedPlan !== null && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="relative bg-[#131b2c] rounded-2xl shadow-2xl p-0 max-w-xl w-full overflow-hidden border border-green-500/30">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
              onClick={() => setShowPayment(false)}
              aria-label="Close"
            >
              <IoClose size={24} />
            </button>
            {isFormSubmitted ? (
              <div className="p-8 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-6 border border-green-500/20">
                  <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Request Submitted!</h2>
                <p className="text-gray-400 mb-8 max-w-md">
                  We have received your request for the {PLANS[selectedPlan].name} plan. Our team will contact you shortly to complete the payment and provision your credits.
                </p>
                <button
                  className="w-full bg-white/5 hover:bg-white/10 text-white font-bold py-3.5 rounded-xl transition-all border border-white/10"
                  onClick={() => setShowPayment(false)}
                >
                  Close
                </button>
              </div>
            ) : (
              <div className="p-8 flex flex-col">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2">Request {PLANS[selectedPlan].name} Plan</h2>
                  <p className="text-gray-400">
                    Fill out the form below and our team will get in touch with you to process your purchase.
                  </p>
                </div>
                
                <form onSubmit={handleFormSubmit} className="space-y-4 text-left">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={nameForm}
                      onChange={(e) => setNameForm(e.target.value)}
                      className="w-full bg-[#181e27] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-400/50"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={emailForm}
                      onChange={(e) => setEmailForm(e.target.value)}
                      className="w-full bg-[#181e27] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-400/50"
                      placeholder="you@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={phoneForm}
                      onChange={(e) => setPhoneForm(e.target.value)}
                      className="w-full bg-[#181e27] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-400/50"
                      placeholder="+91 90607 2546"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Select Plan</label>
                    <div className="relative">
                      <select
                        value={selectedPlan}
                        onChange={(e) => setSelectedPlan(Number(e.target.value))}
                        className="w-full bg-[#181e27] border border-white/10 rounded-xl px-4 py-3 text-white appearance-none focus:outline-none focus:border-green-400/50 cursor-pointer"
                      >
                        {PLANS.map((plan, idx) => (
                          <option key={idx} value={idx}>
                            {plan.name} - {typeof plan.price === 'number' ? `$${plan.price}/mo` : plan.price}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isSubmittingForm}
                      className="w-full bg-gradient-to-r from-green-400 to-green-600 hover:opacity-90 text-white font-bold py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)] disabled:opacity-50"
                    >
                      {isSubmittingForm ? "Submitting..." : "Submit Request"}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer (copied from dashboard) */}
      <footer className="relative z-10 border-t border-green-400/20 bg-black/40 backdrop-blur-xl">
        <div className="max-w-2xl mx-auto px-6 py-2 flex items-center justify-center gap-3">
          <div className="h-8 w-8 relative flex-shrink-0">
            <Image
              src="/icon.png"
              alt="Genova Logo"
              fill
              className="rounded-md object-contain"
            />
          </div>
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
          <span className="text-gray-400 text-xs text-center">
            © Genova.ai — All rights reserved 2025
          </span>
        </div>
      </footer>
    </div>
  );
}
