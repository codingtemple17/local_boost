import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Zap, Loader2, AlertCircle } from "lucide-react";

export default function Generate() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    businessName: "",
    campaignType: "",
    story: "",
  });

  const handlePanicClick = () => {
    setFormData({
      businessName: formData.businessName || "",
      campaignType: "Save Our Shop",
      story: formData.story || "",
    });
    document.getElementById("campaignForm").scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5001/generate-campaign", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          business_name: formData.businessName,
          campaign_type: formData.campaignType,
          story: formData.story,
          user_id: JSON.parse(localStorage.getItem("localboost_user")).id,
          session_token: localStorage.getItem("localboost_session"),
        }),
      });

      const data = await response.json();

      if (data.success) {
        navigate("/results", {
          state: { posts: data.posts, businessName: formData.businessName },
        });
      } else {
        setError(
          data.error || "Failed to generate campaign. Please try again."
        );
      }
    } catch (err) {
      setError(
        "Error connecting to backend. Make sure Flask is running on port 5001!"
      );
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-gray-900">
              LocalBoost
            </span>
          </div>
          <div className="flex gap-6">
            <button
              onClick={() => navigate("/")}
              className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => navigate("/generate")}
              className="text-blue-600 font-medium"
            >
              Generate
            </button>
            <button
              onClick={() => navigate("/history")}
              className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
            >
              History
            </button>
          </div>
        </div>
      </nav>

      {/* Generator Form */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Create Your Campaign
          </h1>
          <p className="text-lg text-gray-600">
            Tell us about your business and we'll generate 5 ready-to-use social
            media posts in 30 seconds.
          </p>
        </div>

        {/* PANIC BUTTON */}
        <div className="mb-8">
          <button
            onClick={handlePanicClick}
            className="w-full py-6 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-2xl font-bold text-xl hover:from-red-700 hover:to-red-800 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3 group"
          >
            <AlertCircle className="w-6 h-6 group-hover:animate-pulse" />
            🚨 Save Our Shop - Emergency Campaign
          </button>
          <p className="text-center text-sm text-gray-500 mt-2">
            Facing closure? Rent increase? Click here for urgent community rally
            posts
          </p>
        </div>

        <form
          id="campaignForm"
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-gray-200 p-8"
        >
          <div className="mb-6">
            <label
              htmlFor="businessName"
              className="block text-sm font-semibold text-gray-900 mb-2"
            >
              Business Name *
            </label>
            <input
              type="text"
              id="businessName"
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              placeholder="Buddie's Coffee"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="campaignType"
              className="block text-sm font-semibold text-gray-900 mb-2"
            >
              Campaign Type *
            </label>
            <select
              id="campaignType"
              name="campaignType"
              value={formData.campaignType}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
            >
              <option value="">-- Select Campaign Type --</option>
              <option value="Save Our Shop">Save Our Shop (Crisis)</option>
              <option value="Product Launch">Product Launch</option>
              <option value="Grand Opening">Grand Opening</option>
              <option value="Membership Drive">Membership Drive</option>
              <option value="Event Promotion">Event Promotion</option>
              <option value="Seasonal Campaign">Seasonal Campaign</option>
              <option value="Community Engagement">Community Engagement</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="mb-6">
            <label
              htmlFor="story"
              className="block text-sm font-semibold text-gray-900 mb-2"
            >
              Campaign Details & Target Audience *
            </label>
            <textarea
              id="story"
              name="story"
              value={formData.story}
              onChange={handleChange}
              placeholder="Example: A coffee shop facing closure due to a 40% rent increase and a new chain opening next door. Need community support to stay open. Target: Local residents, professionals, people who value independent businesses over chains."
              required
              rows="6"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all resize-none"
            />
            <p className="mt-2 text-sm text-gray-500">
              Describe your campaign, target audience, and what makes your
              business special.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-blue-600 text-white rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating Your Campaign...
              </>
            ) : (
              "Generate Campaign"
            )}
          </button>
        </form>
      </section>
    </div>
  );
}
