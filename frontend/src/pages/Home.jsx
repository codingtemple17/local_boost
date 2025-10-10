import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Zap, Coffee, LogOut } from "lucide-react";
import { useAuth } from "../AuthContext";

export default function Home() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    // Stay on home page after logout
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-gray-900">
              LocalBoost
            </span>
          </div>

          {/* Nav buttons - show logout if logged in */}
          {user && (
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Log Out
            </button>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-24">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            AI-Powered Marketing
            <br />
            <span className="text-blue-600">for Local Businesses</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 leading-relaxed">
            Generate 5 ready-to-use social media posts in 30 seconds. Use them
            on Instagram, TikTok, X—anywhere you need to reach customers.
          </p>
          <button
            onClick={() => navigate(user ? "/generate" : "/signup")}
            className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium inline-flex items-center gap-2 shadow-lg shadow-blue-600/20"
          >
            {user ? "Create Your Campaign" : "Get Started Free"}
            <ArrowRight className="w-5 h-5" />
          </button>
          {!user && (
            <p className="text-sm text-gray-500 mt-4">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-blue-600 font-semibold hover:text-blue-700"
              >
                Log in
              </button>
            </p>
          )}
        </div>
      </section>

      {/* Buddie's Coffee Story Section */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl p-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <Coffee className="w-6 h-6 text-amber-600" />
            </div>
            <span className="font-semibold text-gray-900">
              Buddie's Coffee, Brooklyn
            </span>
          </div>
          <blockquote className="text-lg text-gray-700 leading-relaxed mb-6 italic">
            "In February 2025, we faced closure. Rising rents, a chain opening
            next door—we were losing our dream."
          </blockquote>
          <p className="text-gray-600 leading-relaxed mb-4">
            One emotional video. One social media post. Their community rallied.
          </p>
          <p className="text-gray-900 font-semibold leading-relaxed">
            Lines wrapped around the block. The business was saved.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-12 text-center shadow-xl">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to boost your local presence?
          </h2>
          <p className="text-blue-100 text-lg mb-8">
            Join businesses like Buddie's Coffee using community-powered
            campaigns to thrive, not just survive.
          </p>
          <button
            onClick={() => navigate(user ? "/generate" : "/signup")}
            className="px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-50 transition-colors text-lg font-medium inline-flex items-center gap-2"
          >
            {user ? "Create Campaign Now" : "Start Creating Free"}
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-600 text-sm">
          © 2025 LocalBoost. Built for local businesses.
        </div>
      </footer>
    </div>
  );
}
