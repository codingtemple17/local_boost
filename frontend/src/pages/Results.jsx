import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Zap, Copy, CheckCheck, ArrowLeft } from "lucide-react";
import { useState } from "react";

export default function Results() {
  const navigate = useNavigate();
  const location = useLocation();
  const { posts, businessName } = location.state || {};

  const [copiedIndex, setCopiedIndex] = useState(null);

  // Split posts by double newlines and numbers to separate them
  // Also filter out any intro text before the numbered posts
  const postArray = posts
    ? posts
        .split(/\n\n(?=\d+\.)/)
        .filter((p) => p.trim())
        .filter((p) => /^\d+\./.test(p.trim())) // Only keep items that start with numbers
    : [];

  const copyToClipboard = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  if (!posts) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            No results found
          </h2>
          <button
            onClick={() => navigate("/generate")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Generate a Campaign
          </button>
        </div>
      </div>
    );
  }

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
              className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
            >
              History
            </button>
          </div>
        </div>
      </nav>

      {/* Results Section */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/generate")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Generate Another Campaign
          </button>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Your Campaign is Ready! 🎉
          </h1>
          <p className="text-lg text-gray-600">
            {businessName
              ? `Campaign for ${businessName}`
              : "Here are your 5 ready-to-use social media posts"}
          </p>
        </div>

        {/* Posts */}
        <div className="space-y-6">
          {postArray.map((post, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <span className="text-sm font-semibold text-blue-600">
                  Post {index + 1}
                </span>
                <button
                  onClick={() => copyToClipboard(post, index)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  {copiedIndex === index ? (
                    <>
                      <CheckCheck className="w-4 h-4 text-green-600" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy Post
                    </>
                  )}
                </button>
              </div>
              <div className="prose prose-gray max-w-none">
                <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                  {post.trim()}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <button
            onClick={() => navigate("/generate")}
            className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium"
          >
            Generate Another Campaign
          </button>
        </div>
      </section>
    </div>
  );
}
