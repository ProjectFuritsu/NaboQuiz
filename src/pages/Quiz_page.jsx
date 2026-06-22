import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import quizData from "../data/questions.json";

export default function Quiz_page() {
  const navigate = useNavigate();
  const timerRef = useRef(null);

  const questionsList = Array.isArray(quizData) ? quizData : quizData.questions || [];
  const questionsPerGame = quizData?.quiz?.questions_per_game || 15;

  // 1. CHOSEN QUESTION IDS IN LOCAL STORAGE
  // We only track the IDs of the active game session to track order and persistence
  const [gameQuestionIds] = useState(() => {
    const savedIds = localStorage.getItem("active_game_question_ids");
    if (savedIds) {
      return JSON.parse(savedIds);
    }

    const freshPoolIds = [...questionsList]
      .sort(() => Math.random() - 0.5)
      .slice(0, questionsPerGame)
      .map((q) => q.id); // Save ONLY the IDs, keeping secrets out of local storage!

    localStorage.setItem("active_game_question_ids", JSON.stringify(freshPoolIds));
    return freshPoolIds;
  });

  // 2. RESUME TRACKING
  const [currentIndex, setCurrentIndex] = useState(() => {
    const savedIndex = localStorage.getItem("current_index");
    return savedIndex ? parseInt(savedIndex, 10) : 0;
  });

  const [score, setScore] = useState(() => {
    const savedScore = localStorage.getItem("quiz_score");
    return savedScore ? parseInt(savedScore, 10) : 0;
  });

  // UI state handlers
  const [selectedKey, setSelectedKey] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

  // 3. SECURE LOCAL DATA SEPARATION
  // We locate the raw question from our local bundle to evaluate answers securely.
  const currentQuestionId = gameQuestionIds[currentIndex];
  const secureQuestionSource = questionsList.find((q) => q.id === currentQuestionId);

  // Generate a sanitized clone for rendering to prevent DOM/State tree leaking
  const currentQuestionRender = secureQuestionSource
    ? {
        id: secureQuestionSource.id,
        category: secureQuestionSource.category,
        question: secureQuestionSource.question,
        options: secureQuestionSource.options,
      }
    : null;

  const handleOptionSelect = (key) => {
    if (isAnswered || !secureQuestionSource) return;

    setSelectedKey(key);
    setIsAnswered(true);

    let currentCalculatedScore = score;
    
    // Evaluates against the secure source file kept out of client state tree maps
    if (key === secureQuestionSource.correct_option) {
      currentCalculatedScore = score + 1;
      setScore(currentCalculatedScore);
      localStorage.setItem("quiz_score", currentCalculatedScore.toString());
    }

    timerRef.current = setTimeout(() => {
      const nextIndex = currentIndex + 1;
      if (nextIndex < gameQuestionIds.length) {
        setCurrentIndex(nextIndex);
        setSelectedKey(null);
        setIsAnswered(false);
        localStorage.setItem("current_index", nextIndex.toString());
      } else {
        localStorage.removeItem("current_index");
        localStorage.removeItem("active_game_question_ids");
        localStorage.removeItem("quiz_score");

        navigate("/score", {
          state: {
            score: currentCalculatedScore,
            total: gameQuestionIds.length,
          },
        });
      }
    }, 2500);
  };

  useEffect(() => {
    window.history.pushState(null, null, window.location.pathname);
    const handlePopState = () => {
      window.history.pushState(null, null, window.location.pathname);
    };
    window.addEventListener("popstate", handlePopState);
    
    return () => {
      window.removeEventListener("popstate", handlePopState);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  if (!currentQuestionRender) {
    return (
      <div className="flex items-center justify-center min-h-60 text-sm text-gray-500">
        No questions available.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 max-w-sm mx-auto w-full my-10 px-4">
      <div className="flex flex-col p-6 bg-white/80 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl w-full">
        <div className="flex justify-between items-center mb-4 text-[11px] text-gray-400 font-semibold tracking-wider uppercase">
          <span className="bg-gray-100 px-2.5 py-1 rounded-full text-gray-600">
            {currentQuestionRender.category}
          </span>
          <span className="font-mono">
            {currentIndex + 1} / {gameQuestionIds.length}
          </span>
        </div>

        <h2 className="text-lg font-bold text-gray-800 mb-6 leading-snug min-h-[3.5rem]">
          {currentQuestionRender.question}
        </h2>

        <div className="flex flex-col gap-3">
          {Object.entries(currentQuestionRender.options).map(([key, value]) => {
            let buttonStyles = "border-gray-200 bg-white/50 hover:border-blue-500 hover:bg-blue-50/50 text-gray-700";

            if (isAnswered) {
              // We pull the key securely only AFTER a click validation has gone through
              if (key === secureQuestionSource.correct_option) {
                buttonStyles = "border-emerald-500 bg-emerald-50 text-emerald-800 shadow-sm shadow-emerald-100";
              } else if (key === selectedKey && selectedKey !== secureQuestionSource.correct_option) {
                buttonStyles = "border-rose-400 bg-rose-50 text-rose-700";
              } else {
                buttonStyles = "border-gray-100 opacity-40 grayscale-[20%]";
              }
            }

            return (
              <button
                key={key}
                disabled={isAnswered}
                onClick={() => handleOptionSelect(key)}
                className={`w-full text-left px-4 py-3.5 rounded-xl border font-medium transition-all duration-200 flex items-start text-sm ${buttonStyles}`}
              >
                <span className={`font-bold mr-3 ${isAnswered && key === secureQuestionSource.correct_option ? 'text-emerald-600' : 'text-gray-400'}`}>
                  {key}.
                </span>
                <span className="flex-1">{value}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Exposes notes/explainer links only after user completes selection logic */}
      {isAnswered && secureQuestionSource.context_note && (
        <div className="p-4 bg-blue-50/90 backdrop-blur-sm border border-blue-100 rounded-2xl shadow-md transition-all duration-300 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-base leading-none">💡</span>
            <h4 className="text-xs font-bold text-blue-800 uppercase tracking-wider">
              Context & Source
            </h4>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed mb-2">
            {secureQuestionSource.context_note}
          </p>
          {secureQuestionSource.source_url && (
            <a 
              href={secureQuestionSource.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-[11px] font-medium text-blue-600 hover:underline gap-1 mt-1 bg-white/60 px-2 py-0.5 rounded-md border border-blue-100"
            >
              Verify via: {secureQuestionSource.source_title || "Reference Link"} ↗
            </a>
          )}
        </div>
      )}
    </div>
  );
}