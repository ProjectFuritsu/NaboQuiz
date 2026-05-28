import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Menu_page() {
  const navigate = useNavigate();


  const handleStartQuiz = () => {
    // 1. Check if a userID already exists, if not, create a unique one
    let userId = localStorage.getItem("userID");
    if (!userId) {
      // Modern browser native UUID generation, with a clean timestamp fallback
      userId = typeof crypto.randomUUID === "function" 
        ? crypto.randomUUID() 
        : `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      localStorage.setItem("userID", userId);
    }

    // 2. Initialize or reset game state tracking tokens in storage
    localStorage.setItem("quiz_score", "0");
    localStorage.setItem("current_index", "0");
    localStorage.setItem("quiz_started_at", new Date().toISOString());

    // 3. Fire the router transition to your quiz page
    navigate("/quiz");
  };

  // ─── AUTO-REDIRECT LOGIC FOR RETURNING PLAYERS ─────────────────────────
  useEffect(() => {
    const existingUserId = localStorage.getItem("userID");
    const currentIndex = localStorage.getItem("current_index");

    // If they have a user ID and were currently on a question, resume their game
    if (existingUserId && currentIndex !== null) {
      navigate("/quiz");
    }
  }, [navigate]);
  // ───────────────────────────────────────────────────────────────────────

  
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center bg-white rounded-2xl shadow-lg max-w-sm mx-auto my-10">
      {/* Title */}
      <h1 className="text-2xl font-bold text-gray-800 mb-2">
        Welcome to the Quiz!
      </h1>

      {/* Explainer / Description */}
      <p className="text-gray-600 mb-6">
        Test your knowledge! You will face a series of multiple-choice
        questions. Try to get a perfect score.
      </p>

      {/* Quiz Details */}
      <div className="text-sm text-gray-500 mb-6 bg-gray-50 p-3 rounded-lg w-full">
        ⏱️ <strong>Time:</strong> No limit | 📝 <strong>Questions:</strong> 15
      </div>

      {/* Start Button */}
      <button
        onClick={handleStartQuiz}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition duration-200 ease-in-out transform hover:scale-[1.02]"
      >
        Start Quiz
      </button>
    </div>
  );
}
