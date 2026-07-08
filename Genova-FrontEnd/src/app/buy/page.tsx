"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { SiGooglepay, SiPaytm, SiPhonepe, SiAmazonpay } from "react-icons/si";
import { IoClose } from "react-icons/io5";

const PLANS = [
  {
    name: "Lite",
    price: 50,
    credits: 100,
    desc: "Best for personal use.",
  },
  {
    name: "Standard",
    price: 250,
    credits: 550,
    desc: "Best for business use.",
  },
  {
    name: "Premium",
    price: 250,
    credits: 5000,
    desc: "Best for enterprise use.",
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

  // Dummy purchase handler
  const handlePurchase = (planIdx: number) => {
    setSelectedPlan(planIdx);
    setShowPayment(true);
    setPaymentStep("select");
    setSelectedMethod("UPI");
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

      <main className="flex-1 flex flex-col items-center justify-center px-4 pt-32 pb-10">
        <h1 className="text-4xl font-bold mb-12 text-center text-green-400">
          Choose the plan
        </h1>
        <div
          className={`flex flex-col md:flex-row gap-8 w-full max-w-5xl justify-center transition-all duration-300 ${
            hovered !== null ? "opacity-60 scale-95" : "opacity-100"
          }`}
        >
          {PLANS.map((plan, idx) => (
            <div
              key={plan.name}
              className={`bg-[#232b39] rounded-2xl shadow-lg border border-green-400/20 flex flex-col items-center px-10 py-10 min-w-[300px] max-w-[350px] mx-auto transition-all duration-300 ${
                hovered === idx ? "scale-105 shadow-2xl opacity-100 z-10" : ""
              }`}
              onMouseEnter={() => setHovered(idx)}
              onMouseLeave={() => setHovered(null)}
              style={{ cursor: "pointer" }}
            >
              <div className="mb-6">
                <Image src="/icon.png" alt="Plan Icon" width={56} height={56} />
              </div>
              <h2 className="text-xl font-bold mb-1 text-green-400">
                {plan.name}
              </h2>
              <p className="text-gray-400 mb-4">{plan.desc}</p>
              <div className="text-3xl font-bold text-white mb-2">
                ₹{plan.price}
                <span className="text-lg font-normal text-gray-400">
                  {" "}
                  / {plan.credits} credits
                </span>
              </div>
              <button
                className="mt-6 w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition-all duration-200"
                onClick={() => handlePurchase(idx)}
              >
                Purchase
              </button>
            </div>
          ))}
        </div>
      </main>

      {/* Payment Modal */}
      {showPayment && selectedPlan !== null && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="relative bg-[#232b39] rounded-2xl shadow-2xl p-0 max-w-2xl w-full flex flex-col md:flex-row overflow-hidden border border-green-400/30 mx-2">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-3xl z-10"
              onClick={() => setShowPayment(false)}
              aria-label="Close"
            >
              <IoClose />
            </button>
            {/* Left: Plan Summary */}
            <div className="bg-[#181e27] flex flex-col items-center justify-between p-6 w-full md:w-72 min-w-[220px] border-b md:border-b-0 md:border-r border-green-400/10">
              <div className="flex flex-col items-center w-full">
                <Image
                  src="/icon.png"
                  alt="Plan Icon"
                  width={36}
                  height={36}
                  className="mb-2"
                />
                <div className="text-lg font-bold text-green-400 mb-1">
                  {PLANS[selectedPlan].name} Plan
                </div>
                <div className="text-2xl font-extrabold text-white mb-1">
                  ₹{PLANS[selectedPlan].price}
                </div>
                <div className="text-gray-400 text-sm mb-4">
                  {PLANS[selectedPlan].credits} credits
                </div>
              </div>
              <div className="w-full mt-4">
                <div className="flex items-center gap-2 bg-[#232b39] rounded-lg px-3 py-2 border border-green-400/10">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                    <circle
                      cx="12"
                      cy="12"
                      r="12"
                      fill="#22c55e"
                      fillOpacity="0.15"
                    />
                    <path
                      d="M12 7v5l3 3"
                      stroke="#22c55e"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="text-xs text-green-400">
                    Instant Activation
                  </span>
                </div>
              </div>
            </div>
            {/* Right: Payment Options */}
            <div className="flex-1 p-6 flex flex-col max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold mb-4 text-green-400">
                Payment Options
              </h2>
              <div className="flex flex-col md:flex-row gap-6">
                {/* Payment Methods List */}
                <div className="flex flex-row md:flex-col gap-2 w-full md:w-36 mb-4 md:mb-0">
                  {["UPI", "Cards", "Netbanking", "Wallet"].map((method) => (
                    <button
                      key={method}
                      className={`px-4 py-2 rounded-lg text-left transition font-semibold w-full ${
                        selectedMethod === method
                          ? "bg-green-500 text-white"
                          : "bg-[#181e27] border border-green-400/20 text-green-400 hover:bg-green-900"
                      }`}
                      onClick={() => {
                        setSelectedMethod(method);
                        if (method === "Netbanking") {
                          setShowBankModal(true);
                        }
                      }}
                    >
                      {method}
                    </button>
                  ))}
                </div>
                {/* Payment Details */}
                <div className="flex-1">
                  {/* UPI Method */}
                  {selectedMethod === "UPI" && (
                    <div>
                      <div className="font-semibold mb-2 text-green-400">
                        UPI QR
                      </div>
                      <div className="flex flex-col items-center gap-2 mb-2">
                        <Image
                          src="/qr.png"
                          alt="UPI QR"
                          width={110}
                          height={110}
                          className="rounded-lg border"
                        />
                        <span className="text-gray-400 text-xs">
                          Scan the QR using any UPI app:
                        </span>
                        <div className="flex gap-2 text-2xl">
                          <SiGooglepay
                            className="text-[#4285F4] bg-white rounded"
                            title="GPay"
                          />
                          <SiPaytm
                            className="text-[#00baf2] bg-white rounded"
                            title="Paytm"
                          />
                          <SiPhonepe
                            className="text-[#5f259f] bg-white rounded"
                            title="PhonePe"
                          />
                          <SiAmazonpay
                            className="text-[#ff9900] bg-white rounded"
                            title="AmazonPay"
                          />
                        </div>
                      </div>
                      <div className="mt-2">
                        <label className="block text-green-400 mb-1 font-semibold">
                          Or pay with UPI ID / Number
                        </label>
                        <input
                          type="text"
                          placeholder="example@okhdfcbank"
                          value={upiId}
                          onChange={(e) => {
                            setUpiId(e.target.value);
                            setUpiError("");
                          }}
                          className="w-full p-2 rounded border border-green-400 bg-[#181e27] text-white mb-2"
                        />
                        {upiError && (
                          <div className="text-red-400 text-xs mb-2">
                            {upiError}
                          </div>
                        )}
                        <button
                          className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg transition-all duration-200"
                          onClick={() => {
                            // UPI ID validation: must be like "name@bank"
                            const upiRegex = /^[\w.\-]{2,}@[a-zA-Z]{3,}$/;
                            if (!upiRegex.test(upiId)) {
                              setUpiError(
                                "Please enter a valid UPI ID (e.g. example@okhdfcbank)"
                              );
                              return;
                            }
                            setUpiError("");
                            setPaymentStep("processing");
                            setTimeout(() => setPaymentStep("success"), 1800);
                          }}
                        >
                          Verify and Pay
                        </button>
                      </div>
                    </div>
                  )}
                  {/* Cards Method */}
                  {selectedMethod === "Cards" && (
                    <div>
                      <label className="block text-green-400 mb-1 font-semibold">
                        Card Number
                      </label>
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        className="w-full p-2 rounded border border-green-400 bg-[#181e27] text-white mb-2"
                      />
                      <div className="flex gap-2 mb-2">
                        <input
                          type="text"
                          placeholder="MM/YY"
                          className="w-1/2 p-2 rounded border border-green-400 bg-[#181e27] text-white"
                        />
                        <input
                          type="text"
                          placeholder="CVV"
                          className="w-1/2 p-2 rounded border border-green-400 bg-[#181e27] text-white"
                        />
                      </div>
                      <button
                        className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg transition-all duration-200"
                        onClick={() => {
                          setPaymentStep("processing");
                          setTimeout(() => setPaymentStep("success"), 1800);
                        }}
                      >
                        Pay Now
                      </button>
                    </div>
                  )}

                  {/* Netbanking Method */}
                  {selectedMethod === "Netbanking" && (
                    <div>
                      <button
                        className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg transition-all duration-200"
                        onClick={() => setShowBankModal(true)}
                      >
                        Choose Bank
                      </button>
                    </div>
                  )}

                  {/* Wallet Method */}
                  {selectedMethod === "Wallet" && (
                    <div>
                      <label className="block text-green-400 mb-1 font-semibold">
                        Select Wallet
                      </label>
                      <select className="w-full p-2 rounded border border-green-400 bg-[#181e27] text-white mb-2">
                        <option>Paytm</option>
                        <option>Mobikwik</option>
                        <option>PhonePe</option>
                        <option>Amazon Pay</option>
                        <option>JioMoney</option>
                      </select>
                      <button
                        className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg transition-all duration-200"
                        onClick={() => {
                          setPaymentStep("processing");
                          setTimeout(() => setPaymentStep("success"), 1800);
                        }}
                      >
                        Pay Now
                      </button>
                    </div>
                  )}
                  {/* Processing and Success steps as before */}
                  {paymentStep === "processing" && (
                    <div className="flex flex-col items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-500 border-b-4 mb-6"></div>
                      <div className="text-xl font-semibold text-white mb-2">
                        Processing Payment...
                      </div>
                      <div className="text-gray-400">
                        Please wait, do not refresh.
                      </div>
                    </div>
                  )}
                  {paymentStep === "success" && (
                    <div className="flex flex-col items-center justify-center py-12">
                      <div className="mb-4 animate-bounceIn">
                        <svg
                          width="64"
                          height="64"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            cx="12"
                            cy="12"
                            r="12"
                            fill="#22c55e"
                            fillOpacity="0.15"
                          />
                          <path
                            d="M7 13l3 3 7-7"
                            stroke="#22c55e"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            fill="none"
                          />
                        </svg>
                      </div>
                      <div className="text-2xl font-bold text-green-500 mb-2">
                        Payment Successful!
                      </div>
                      <div className="text-gray-400 mb-6">
                        Credits added to your account.
                      </div>
                      <button
                        className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2 rounded-lg"
                        onClick={() => {
                          setShowPayment(false);
                          setPaymentStep("select");
                          resetNetbanking();
                          router.push("/dashboard");
                        }}
                      >
                        Go to Dashboard
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Netbanking: Bank Selection Modal */}
      {showBankModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#232b39] rounded-2xl shadow-2xl p-6 w-full max-w-md mx-2 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-green-400">
                Select Your Bank
              </h3>
              <button
                className="text-gray-400 hover:text-red-500 text-2xl"
                onClick={() => setShowBankModal(false)}
              >
                <IoClose />
              </button>
            </div>
            <input
              type="text"
              placeholder="Search bank..."
              value={bankSearch}
              onChange={(e) => setBankSearch(e.target.value)}
              className="w-full p-2 rounded border border-green-400 bg-[#181e27] text-white mb-4"
            />
            <div className="flex-1 overflow-y-auto max-h-64">
              {BANKS.flat()
                .filter((b) =>
                  b.name.toLowerCase().includes(bankSearch.toLowerCase())
                )
                .map((bank) => (
                  <div
                    key={bank.name}
                    className={`flex items-center gap-3 p-3 rounded-lg mb-2 cursor-pointer transition ${
                      bank.issue
                        ? "bg-red-900/30 border border-red-500"
                        : "hover:bg-green-900/30 border border-green-400/10"
                    }`}
                    onClick={() => {
                      if (bank.issue) return;
                      setSelectedBank(bank);
                      setShowBankModal(false);
                      setShowConfirmModal(true);
                    }}
                  >
                    {bank.icon ? (
                      typeof bank.icon === "string" ? (
                        <Image
                          src={bank.icon}
                          alt={bank.name}
                          width={32}
                          height={32}
                        />
                      ) : (
                        bank.icon
                      )
                    ) : (
                      <span className="text-2xl">🏦</span>
                    )}
                    <div className="flex items-center gap-3">
                      <div>{bank.name}</div>
                      {bank.desc && (
                        <span className="ml-2 text-xs text-gray-400">
                          {bank.desc}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Netbanking: Confirm/Decline Modal */}
      {showConfirmModal && selectedBank && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#232b39] rounded-2xl shadow-2xl p-6 w-full max-w-xs mx-2 flex flex-col items-center">
            {selectedBank.icon ? (
              <Image
                src={selectedBank.icon}
                alt={selectedBank.name}
                width={40}
                height={40}
                className="mb-2"
              />
            ) : (
              <span className="text-3xl mb-2">🏦</span>
            )}
            <div className="text-lg font-bold text-green-400 mb-2">
              {selectedBank.name}
            </div>
            <div className="text-white mb-4">Proceed with this bank?</div>
            <div className="flex gap-4">
              <button
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold"
                onClick={() => {
                  setShowConfirmModal(false);
                  setProcessing(true);
                  setTimeout(() => {
                    setProcessing(false);
                    setPaymentResult("success");
                  }, 1800);
                }}
              >
                Confirm
              </button>
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold"
                onClick={() => {
                  setShowConfirmModal(false);
                  setShowExitConfirm(true);
                }}
              >
                Decline
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Netbanking: Processing Animation */}
      {processing && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#232b39] rounded-2xl shadow-2xl p-8 w-full max-w-xs mx-2 flex flex-col items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-500 border-b-4 mb-6"></div>
            <div className="text-xl font-semibold text-white mb-2">
              Processing Payment...
            </div>
            <div className="text-gray-400">Please wait, do not refresh.</div>
          </div>
        </div>
      )}

      {/* Netbanking: Payment Success Animation */}
      {paymentResult === "success" && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#232b39] rounded-2xl shadow-2xl p-8 w-full max-w-xs mx-2 flex flex-col items-center">
            <div className="mb-4 animate-bounceIn">
              <svg width="64" height="64" fill="none" viewBox="0 0 24 24">
                <circle
                  cx="12"
                  cy="12"
                  r="12"
                  fill="#22c55e"
                  fillOpacity="0.15"
                />
                <path
                  d="M7 13l3 3 7-7"
                  stroke="#22c55e"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
            </div>
            <div className="text-2xl font-bold text-green-500 mb-2">
              Payment Successful!
            </div>
            <button
              className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2 rounded-lg"
              onClick={() => {
                setShowPayment(false);
                setPaymentResult(null);
                setSelectedBank(null);
                resetNetbanking();
                router.push("/dashboard");
              }}
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      )}

      {/* Netbanking: Exit Confirmation */}
      {showExitConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#232b39] rounded-2xl shadow-2xl p-6 w-full max-w-xs mx-2 flex flex-col items-center">
            <div className="text-white mb-4">
              Are you sure you want to exit payment?
            </div>
            <div className="flex gap-4">
              <button
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold"
                onClick={() => {
                  setShowExitConfirm(false);
                  setPaymentResult("declined");
                }}
              >
                Exit
              </button>
              <button
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold"
                onClick={() => {
                  setShowExitConfirm(false);
                  setShowConfirmModal(true);
                }}
              >
                Continue Payment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Netbanking: Declined Message */}
      {paymentResult === "declined" && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#232b39] rounded-2xl shadow-2xl p-6 w-full max-w-xs mx-2 flex flex-col items-center">
            <div className="text-red-400 text-lg font-bold mb-2">
              Payment cannot be processed
            </div>
            <div className="text-gray-400 mb-4">
              You have declined the payment.
            </div>
            <button
              className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2 rounded-lg"
              onClick={() => {
                setPaymentResult(null);
                setSelectedBank(null);
                resetNetbanking();
              }}
            >
              Close
            </button>
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
