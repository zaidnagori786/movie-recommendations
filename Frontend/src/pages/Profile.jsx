import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../contex/UserContext.jsx";
import axios from "axios";

export default function Profile() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);

  const [editName, setEditName] = useState(user.name);
  const [editEmail, setEditEmail] = useState(user.email);

  // Password reset states
  const [step, setStep] = useState(1); // Step 1 = Email
  const [emailForOtp, setEmailForOtp] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSaveInfo = () => {
    setUser({ ...user, name: editName, email: editEmail });
    alert("✅ Profile updated!");
  };

  const getNextBillingDate = () => {
    if (!user.subscriptionDate) return "Not Available";
    const date = new Date(user.subscriptionDate);
    date.setDate(date.getDate() + 30);
    return date.toDateString();
  };

  // Send OTP
  const handleSendOTP = async () => {
    if (!emailForOtp) return alert("Enter your email!");
    try {
      await axios.post("http://localhost:5000/auth/send-otp", { email: emailForOtp });
      setStep(2);
      alert("📩 OTP sent to your email!");
    } catch (err) {
      alert("❌ Failed to send OTP");
    }
  };

  // Update password
  const handleUpdatePassword = async () => {
    if (newPassword !== confirmPassword) return alert("❌ Passwords do not match!");

    try {
      await axios.post("http://localhost:5000/auth/change-password", {
        email: emailForOtp,
        otp,
        newPassword,
      });
      alert("✅ Password updated successfully!");
      setStep(1);
      setOtp("");
      setNewPassword("");
      setConfirmPassword("");
      setEmailForOtp("");
    } catch (err) {
      alert(err.response?.data?.msg || "❌ Error updating password");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12">
      <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
        Profile Settings
      </h1>

      <div className="max-w-2xl mx-auto space-y-8">
        {/* User Info */} edit your name
        <div className="p-6 bg-gray-900/50 rounded-2xl shadow-xl">
          <h2 className="text-2xl font-bold mb-4">User Info</h2>
          <div className="space-y-4">
           
            <input
            placeholder="edit"
              type="email"
              value={editEmail}
              onChange={(e) => setEditEmail(e.target.value)}
              className="w-full bg-black/30 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={handleSaveInfo}
              className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition"
            >
              Save Info
            </button>
          </div>
        </div>

        {/* Subscription */}
        <div className="p-6 bg-gray-900/50 rounded-2xl shadow-xl">
          <h2 className="text-2xl font-bold mb-4">Subscription</h2>
          <div className="space-y-2">
            <p>Plan: <span className="font-semibold text-purple-400">{user.subscription}</span></p>
            <p>Status: <span className="font-semibold text-green-400">Active</span></p>
            <p>Next Billing: <span className="font-semibold text-gray-300">{getNextBillingDate()}</span></p>
            <button
              onClick={() => navigate("/subscription")}
              className="mt-3 bg-purple-600 px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition"
            >
              Manage Subscription
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
