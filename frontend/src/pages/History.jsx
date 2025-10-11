import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Zap, Loader2, Calendar, TrendingUp, Eye } from "lucide-react";
import { useAuth } from "../AuthContext";
import API_URL from "../config";

export default function History() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const response = await fetch(
        `${API_URL}/campaigns?user_id=${user.id}`
      );
      const data = await response.json();

      if (data.success) {
        setCampaigns(data.campaigns);
      } else {
        setError("Failed to load campaigns");
      }
    } catch (err) {
      setError("Error connecting to server");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const viewCampaign = (campaign) => {
    // Parse the posts JSON and navigate to results
    const postsData = JSON.parse(campaign.posts);
    navigate("/results", {
      state: {
        posts: postsData.content,
        businessName: campaign.business_name,
      },
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getCampaignTypeColor = (type) => {
    const colors = {
      "Save Our Shop": "bg-red-100 text-red-700",
      "Product Launch": "bg-purple-100 text-purple-700",
      "Grand Opening": "bg-green-100 text-green-700",
      "Membership Drive": "bg-blue-100 text-blue-700",
      "Event Promotion": "bg-yellow-100 text-yellow-700",
      "Seasonal Campaign": "bg-orange-100 text-orange-700",
      "Community Engagement": "bg-teal-100 text-teal-700",
      Other: "bg-gray-100 text-gray-700",
    };
    return colors[type] || colors["Other"];
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
              className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
            >
              Generate
            </button>
            <button
              onClick={() => navigate("/history")}
              className="text-blue-600 font-medium"
            >
              History
            </button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Campaign History
          </h1>
          <p className="text-lg text-gray-600">
            View and reuse your past campaigns
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600">{error}</p>
          </div>
        ) : campaigns.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
            <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No campaigns yet
            </h3>
            <p className="text-gray-600 mb-6">
              Create your first campaign to get started!
            </p>
            <button
              onClick={() => navigate("/generate")}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Create Campaign
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {campaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {campaign.business_name}
                    </h3>
                    <div className="flex items-center gap-3 mb-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getCampaignTypeColor(
                          campaign.campaign_type
                        )}`}
                      >
                        {campaign.campaign_type}
                      </span>
                      <span className="flex items-center gap-1 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        {formatDate(campaign.created_at)}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {campaign.story}
                    </p>
                  </div>
                  <button
                    onClick={() => viewCampaign(campaign)}
                    className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    View Posts
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
