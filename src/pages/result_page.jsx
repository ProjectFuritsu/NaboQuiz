import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function result_page() {
  const navigate = useNavigate();
  const location = useLocation();

  // Retrieve the final score and total question count passed from the quiz state
  // Default values protect the UI if someone lands on /score directly
  const score = location.state?.score ?? 0;
  const total = location.state?.total ?? 15;

  // Calculate the score percentage
  const percentage = Math.round((score / total) * 100);

  // Generate localized, dynamic feedback messages based on performance tiers
  let feedbackTitle = "Keep Learning!";
  let feedbackSubtitle =
    "Subukan mong mag-ikot uli sa panabocity.gov.ph o magtanong sa mga katatandaan natin dito sa Nabo!";

  if (percentage === 100) {
    feedbackTitle = "Tunay na Taga-Panabo! 🏆";
    feedbackSubtitle =
      "Hala kabalo gyud ka! Bagay kaayo ka maging tour guide sa Museo Panabo!";
  } else if (percentage >= 80) {
    feedbackTitle = "Hapit na Perfect! 🍌";
    feedbackSubtitle =
      "Puno ka og kahibalo mahitungod sa Banana Capital! Kulang na lang og gamay nga pag-review.";
  } else if (percentage >= 50) {
    feedbackTitle = "Swak na Swak! 👌";
    feedbackSubtitle =
      "Kabalo ka sa mga basic facts. Sakto lang ang imong kaalam sa atong pinalanggang siyudad!";
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-white rounded-2xl shadow-xl max-w-sm mx-auto w-full border border-gray-100">
      {/* Trophy or Achievement Banner */}
      <div className="text-5xl mb-4 animate-bounce">
        {percentage >= 80 ? "👑" : percentage >= 50 ? "🎉" : "📚"}
      </div>

      {/* Header Evaluation */}
      <h2 className="text-2xl font-bold text-gray-800 mb-1 tracking-tight">
        {feedbackTitle}
      </h2>
      <p className="text-sm text-gray-400 font-medium uppercase tracking-wider mb-6">
        Quiz Results
      </p>

      {/* Circular Progress Data Point Display */}
      <div className="relative flex items-center justify-center w-36 h-36 bg-blue-50/50 rounded-full border-4 border-blue-500/10 mb-6">
        <div className="flex flex-col items-center">
          <span className="text-4xl font-black text-blue-600">{score}</span>
          <span className="text-xs font-bold text-gray-400 border-t border-gray-200 mt-1 pt-1 px-3">
            out of {total}
          </span>
        </div>
      </div>

      {/* Context Dialogue / Description */}
      <p className="text-gray-600 text-sm leading-relaxed mb-8 px-2">
        "{feedbackSubtitle}"
      </p>

      {/* Navigation Redirect Trigger */}
      <button
        onClick={() => {
          navigate("/");
          localStorage.clear();
        }}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-md shadow-blue-500/10 hover:shadow-blue-500/20 transform hover:scale-[1.01]"
      >
        Try Again
      </button>
    </div>
  );
}
