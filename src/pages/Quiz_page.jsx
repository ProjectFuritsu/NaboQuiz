import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import quizData from "../data/questions.json"; // Direct import of your JSON file

export default function Quiz_page() {
  const navigate = useNavigate();

  const questionsPerGame = quizData.quiz.questions_per_game || 15;

  // 1. Setup the active game pool with randomized/shuffled items right during state initialization
  const [gameQuestions] = useState(() => {
    return [...quizData.questions]
      .sort(() => Math.random() - 0.5)
      .slice(0, questionsPerGame);
  });

  // Core state handlers
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedKey, setSelectedKey] = useState(null); // Tracks the letter code (A, B, C, D)
  const [isAnswered, setIsAnswered] = useState(false);

  const currentQuestion = gameQuestions[currentIndex];

  const handleOptionSelect = (key) => {
    if (isAnswered) return; // Prevent multiple selection clicks

    setSelectedKey(key);
    setIsAnswered(true);

    let currentCalculatedScore = score;
    // If option key matches the letter code in 'answer' field, increment score
    if (key === currentQuestion.answer) {
      currentCalculatedScore = score + 1;
      setScore(currentCalculatedScore);
      // Synchronize updated score directly into local browser storage
      localStorage.setItem("quiz_score", currentCalculatedScore.toString());
    }

    // Short display pause for visual feedback before clearing flags & advancing index
    setTimeout(() => {
      const nextIndex = currentIndex + 1;
      if (nextIndex < gameQuestions.length) {
        setCurrentIndex(nextIndex);
        setSelectedKey(null);
        setIsAnswered(false);
        // Synchronize updated question index progress to local storage
        localStorage.setItem("current_index", nextIndex.toString());
      } else {
        // Clear progress variables at the end of the session, preserving userID
        localStorage.removeItem("current_index");

        // Redirect route cleanly to the score_page view, passing state statistics
        navigate("/score", {
          state: {
            score: currentCalculatedScore,
            total: gameQuestions.length,
          },
        });
      }
    }, 1200);
  };

  // ─── DISABLE BACK BUTTON LOGIC ───────────────────────────────────────
  useEffect(() => {
    // Push an extra state into the browser history stack
    window.history.pushState(null, null, window.location.pathname);

    const handlePopState = (event) => {
      // Re-push the state to lock the user on the current screen
      window.history.pushState(null, null, window.location.pathname);

      // Optional: You can trigger a clean custom alert banner here if you want
      // alert("Bawal bumalik! Tapusin muna ang sinimulang quiz. 💪");
    };

    // Listen for the user attempting to navigate backward
    window.addEventListener("popstate", handlePopState);

    // Clean up the event listener when the component unmounts (e.g., when quiz finishes)
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);
  // ─────────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col p-6 bg-white rounded-2xl shadow-lg max-w-sm mx-auto w-full">
      {/* Quiz Progress & Category */}
      <div className="flex justify-between items-center mb-3 text-xs text-gray-400 font-medium tracking-wide uppercase">
        <span>{currentQuestion.category}</span>
        <span>
          {currentIndex + 1} / {gameQuestions.length}
        </span>
      </div>

      {/* Question Text */}
      <h2 className="text-xl font-bold text-gray-800 mb-6 leading-snug min-h-14">
        {currentQuestion.question}
      </h2>

      {/* Options Stack (Iterating Object Keys A, B, C, D) */}
      <div className="flex flex-col gap-3">
        {Object.entries(currentQuestion.options).map(([key, value]) => {
          // Style feedback evaluation classes
          let buttonStyles =
            "border-gray-100 hover:border-blue-500 hover:bg-blue-50/30";

          if (isAnswered) {
            if (key === currentQuestion.answer) {
              // Highlight the real answer in green
              buttonStyles = "border-green-500 bg-green-50 text-green-700";
            } else if (
              key === selectedKey &&
              selectedKey !== currentQuestion.answer
            ) {
              // Highlight wrong selected option in red
              buttonStyles = "border-red-400 bg-red-50 text-red-600";
            } else {
              buttonStyles = "border-gray-100 opacity-60";
            }
          }

          return (
            <button
              key={key}
              disabled={isAnswered}
              onClick={() => handleOptionSelect(key)}
              className={`w-full text-left px-4 py-3 rounded-xl border-2 font-medium transition-all duration-200 flex items-start ${buttonStyles}`}
            >
              <span className="font-bold mr-3 text-gray-400">{key}.</span>
              <span>{value}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
