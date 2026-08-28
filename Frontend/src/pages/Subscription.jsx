import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../../contex/UserContext.jsx";


export default function Subscription() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [showPayment, setShowPayment] = useState(false);
    const { user, handleChangePlan } = useContext(UserContext);
  const plans = [
    {
      name: "Basic Plan",
      price: "₹199/month",
      features: [
        "480p Streaming Quality",
        "1 Screen at a Time",
        "Ad-Supported",
      ],
      gradient: "from-gray-700 to-gray-900",
    },
    {
      name: "Standard Plan",
      price: "₹499/month",
      features: [
        "1080p Full HD Quality",
        "2 Screens at a Time",
        "No Ads",
        "Offline Download",
      ],
      gradient: "from-purple-500 to-indigo-600",
    },
    {
      name: "Premium Plan",
      price: "₹799/month",
      features: [
        "4K Ultra HD + HDR",
        "4 Screens at a Time",
        "No Ads",
        "Offline Download",
        "Exclusive Releases",
      ],
      gradient: "from-pink-500 to-orange-500",
    },
  ];

  const handleSubscribe = (plan) => {
    setSelectedPlan(plan);
    setShowPayment(true);
  };

  const handlePayment = () => {
    if (!paymentMethod) {
      alert("⚠️ Please select a payment method!");
      return;
    }
    // alert(`✅ Payment successful for ${selectedPlan.name} using ${paymentMethod}!\nEnjoy streaming 🎬`);
    // navigate("/home");
    
  if (selectedPlan) {
    // ✅ Update the user's subscription in the global context
    handleChangePlan(selectedPlan.name);

    alert(`✅ Payment successful for ${selectedPlan.name} using ${paymentMethod}!\nEnjoy streaming 🎬`);
    setShowPayment(false);
    navigate("/profile"); // redirect after payment
  } else {
    alert("⚠️ No plan selected!");
  }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white px-6 py-12 relative">
      {/* 🔙 Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-full font-semibold shadow-lg hover:shadow-[0_0_20px_rgba(236,72,153,0.6)] transition-all duration-300"
      >
        ⬅ Back
      </button>

      {/* 🏷️ Header */}
      <div className="text-center mb-10 mt-8">
        <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 drop-shadow-lg">
          Choose Your Subscription Plan
        </h1>
        <p className="text-gray-400 mt-4 text-lg">
          Unlock unlimited access to all premium movies and shows.
        </p>
      </div>

      {/* 💎 Plans Grid */}
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`rounded-2xl p-8 bg-gradient-to-br ${plan.gradient} shadow-[0_0_30px_rgba(0,0,0,0.6)] hover:shadow-[0_0_50px_rgba(236,72,153,0.4)] transform hover:-translate-y-3 transition-all duration-500`}
          >
            <h2 className="text-3xl font-bold mb-4">{plan.name}</h2>
            <p className="text-2xl font-semibold text-yellow-300 mb-6">
              {plan.price}
            </p>

            <ul className="space-y-3 mb-8">
              {plan.features.map((f, i) => (
                <li key={i} className="text-gray-200 flex items-center gap-2">
                  ✅ {f}
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleSubscribe(plan)}
              className="w-full py-3 bg-black/30 border border-white/30 rounded-full text-white font-semibold hover:bg-white/20 transition-all duration-300"
            >
              Subscribe Now
            </button>
          </div>
        ))}
      </div>

      {/* 💰 Payment Modal */}
      {showPayment && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-2xl p-8 max-w-md w-full shadow-[0_0_30px_rgba(236,72,153,0.4)] border border-gray-700 relative">
            <button
              onClick={() => setShowPayment(false)}
              className="absolute top-3 right-4 text-gray-400 hover:text-white text-2xl"
            >
              ✖
            </button>
            <h2 className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400 mb-6">
              Payment for {selectedPlan.name}
            </h2>

            <p className="text-center text-gray-300 mb-4">
              Amount:{" "}
              <span className="text-yellow-400 font-semibold">
                {selectedPlan.price}
              </span>
            </p>

            <div className="space-y-3 mb-6">
              <label className="block text-gray-300 text-sm mb-2">
                Choose Payment Method:
              </label>
              {["UPI", "Credit/Debit Card", "Net Banking", "PayPal"].map(
                (method, i) => (
                  <label
                    key={i}
                    className="flex items-center gap-3 bg-gray-800/60 hover:bg-gray-700/70 p-3 rounded-lg transition-all duration-300 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={method}
                      checked={paymentMethod === method}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span className="text-gray-200">{method}</span>
                  </label>
                )
              )}
            </div>

            <button
              onClick={handlePayment}
              className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold rounded-full hover:shadow-[0_0_20px_rgba(236,72,153,0.6)] transition-all duration-300"
            >
              Confirm Payment
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
