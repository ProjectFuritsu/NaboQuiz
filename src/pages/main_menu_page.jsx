import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function MainMenuPage() {
  const navigate = useNavigate();
  const [hasSavedProgress, setHasSavedProgress] = useState(false);

  useEffect(() => {
    const existingUserId = localStorage.getItem("userID");
    const currentIndex = localStorage.getItem("current_index");
    if (existingUserId && currentIndex !== null) {
      setHasSavedProgress(true);
    }
  }, []);

  const handleStartQuiz = () => {
    let userId = localStorage.getItem("userID");
    if (!userId) {
      userId = typeof crypto.randomUUID === "function" 
        ? crypto.randomUUID() 
        : `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("userID", userId);
    }

    if (!hasSavedProgress) {
      localStorage.setItem("quiz_score", "0");
      localStorage.setItem("current_index", "0");
      localStorage.setItem("quiz_started_at", new Date().toISOString());
    }
    navigate("/quiz");
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-white rounded-3xl shadow-xl max-w-sm mx-auto my-10 border border-gray-100 relative overflow-hidden">
      
      {/* Live Badge */}
      <span className="absolute top-4 right-4 bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
        🔥 Live
      </span>

      {/* Visual Icon Anchor */}
      <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-3xl mb-5 shadow-inner">
        🧠
      </div>

      {/* Persuasive Header */}
      <h1 className="text-2xl font-extrabold text-gray-900 mb-2 tracking-tight">
        How sharp is your brain today?
      </h1>

      {/* Social Proof Subtitle */}
      <p className="text-gray-500 text-sm mb-6 px-2 leading-relaxed">
        Join over 10,000 players tackling today's trivia. Only 12% manage to land a perfect score. Ready to test your limits?
      </p>
     

      {/* Dynamic Action Button */}
      <button
        onClick={handleStartQuiz}
        className={`w-full text-white font-bold py-4 px-6 rounded-2xl shadow-lg transition-all duration-300 ease-in-out transform hover:scale-[1.02] active:scale-[0.98] mb-5 ${
          hasSavedProgress 
            ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20" 
            : "bg-blue-600 hover:bg-blue-700 shadow-blue-600/20"
        }`}
      >
        {hasSavedProgress ? "Resume Your Challenge" : "Accept the Challenge"}
      </button>

      {/* Centered Navigation Link */}
      <div className="flex items-center justify-center w-full border-t border-gray-100 pt-4 text-xs font-bold text-gray-500">
        <button onClick={() => navigate("/leaderboard")} className="flex items-center gap-1.5 hover:text-blue-600 transition-colors py-1 px-4 rounded-xl hover:bg-slate-50">
          🏆 View Global Rankings
        </button>
      </div>

      {/* Friction Reduction Footer */}
      <p className="text-[10px] text-gray-400 mt-4">
        No signup required • Results instantly shared
      </p>
    </div>
  );
}