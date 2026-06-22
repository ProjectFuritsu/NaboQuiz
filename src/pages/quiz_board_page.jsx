import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import quizData from "../data/questions.json";

export default function QuizBoardPage() {
  const navigate = useNavigate();
  const countdownRef = useRef(null);

  const questionsList = Array.isArray(quizData)
    ? quizData
    : quizData.questions || [];
  const questionsPerGame = quizData?.quiz?.questions_per_game || 15;
  const AUTO_NEXT_SECONDS = 6;

  const [gameQuestionIds] = useState(() => {
    const savedIds = localStorage.getItem("active_game_question_ids");
    if (savedIds) return JSON.parse(savedIds);

    const freshPoolIds = [...questionsList]
      .sort(() => Math.random() - 0.5)
      .slice(0, questionsPerGame)
      .map((q) => q.id);

    localStorage.setItem(
      "active_game_question_ids",
      JSON.stringify(freshPoolIds),
    );
    return freshPoolIds;
  });

  const [currentIndex, setCurrentIndex] = useState(() => {
    const savedIndex = localStorage.getItem("current_index");
    return savedIndex ? parseInt(savedIndex, 10) : 0;
  });

  const [score, setScore] = useState(() => {
    const savedScore = localStorage.getItem("quiz_score");
    return savedScore ? parseInt(savedScore, 10) : 0;
  });

  const [scoreHistory, setScoreHistory] = useState(() => {
    const savedHistory = localStorage.getItem("quiz_score_history");
    return savedHistory
      ? JSON.parse(savedHistory)
      : Array(gameQuestionIds.length).fill(null);
  });

  const [selectedKey, setSelectedKey] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [currentCalculatedScore, setCurrentCalculatedScore] = useState(score);
  const [timeLeft, setTimeLeft] = useState(AUTO_NEXT_SECONDS);

  const currentQuestionId = gameQuestionIds[currentIndex];
  const secureQuestionSource = questionsList.find(
    (q) => q.id === currentQuestionId,
  );

  const currentQuestionRender = secureQuestionSource
    ? {
        id: secureQuestionSource.id,
        category: secureQuestionSource.category,
        question: secureQuestionSource.question,
        options: secureQuestionSource.options,
      }
    : null;

  const handleProceedNext = () => {
    if (countdownRef.current) clearInterval(countdownRef.current);

    const nextIndex = currentIndex + 1;
    if (nextIndex < gameQuestionIds.length) {
      setCurrentIndex(nextIndex);
      setSelectedKey(null);
      setIsAnswered(false);
      setTimeLeft(AUTO_NEXT_SECONDS);
      localStorage.setItem("current_index", nextIndex.toString());
    } else {
      localStorage.removeItem("current_index");
      localStorage.removeItem("active_game_question_ids");
      localStorage.removeItem("quiz_score");
      localStorage.removeItem("quiz_score_history");

      navigate("/score", {
        state: {
          score: currentCalculatedScore,
          total: gameQuestionIds.length,
        },
      });
    }
  };

  const handleOptionSelect = (key) => {
    if (isAnswered || !secureQuestionSource) return;

    setSelectedKey(key);
    setIsAnswered(true);

    const isCorrect = key === secureQuestionSource.correct_option;
    let nextScore = score;

    const updatedHistory = [...scoreHistory];
    updatedHistory[currentIndex] = isCorrect;
    setScoreHistory(updatedHistory);
    localStorage.setItem("quiz_score_history", JSON.stringify(updatedHistory));

    if (isCorrect) {
      nextScore = score + 1;
      setScore(nextScore);
      localStorage.setItem("quiz_score", nextScore.toString());
    }

    setCurrentCalculatedScore(nextScore);

    setTimeLeft(AUTO_NEXT_SECONDS);
    countdownRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(countdownRef.current);
          handleProceedNext();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    window.history.pushState(null, null, window.location.pathname);
    const handlePopState = () => {
      window.history.pushState(null, null, window.location.pathname);
    };
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [currentIndex]);

  if (!currentQuestionRender) {
    return (
      <div className="flex items-center justify-center min-h-60 text-sm text-gray-500">
        No questions available.
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 max-w-5xl mx-auto w-full my-6 md:my-12 px-4 items-start">
      {/* ─── LEFT COLUMN: MAIN QUIZ INTERFACE ─── */}
      <div className="flex-1 w-full bg-white border border-gray-100 rounded-3xl shadow-xl p-6 md:p-8 flex flex-col justify-between min-h-[520px] relative overflow-hidden">
        {/* Top Accent Outline Progress Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-slate-100">
          <div
            className="bg-emerald-600 h-full transition-all duration-500 ease-out"
            style={{
              width: `${((currentIndex + 1) / gameQuestionIds.length) * 100}%`,
            }}
          />
        </div>

        <div>
          {/* Metadata Header Row */}
          <div className="flex justify-between items-center mb-6 text-xs font-bold tracking-wider uppercase mt-2">
            <span className="bg-slate-100 text-slate-700 border border-slate-200 px-3 py-1 rounded-full">
              {currentQuestionRender.category}
            </span>
            <span className="font-mono bg-slate-50 border border-slate-100 px-3 py-1 rounded-lg text-gray-400">
              Question {currentIndex + 1} of {gameQuestionIds.length}
            </span>
          </div>

          {/* Question Text matching the reference header style */}
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-8 leading-snug min-h-[80px]">
            {currentQuestionRender.question}
          </h2>

          {/* Stacked Vertical Option Rows (Single column grid layout matching reference image) */}
          <div className="flex flex-col gap-4">
            {Object.entries(currentQuestionRender.options).map(
              ([key, value]) => {
                // Default UI values before an action occurs
                let containerStyles =
                  "border-slate-200 bg-white hover:border-slate-400 text-slate-700 hover:shadow-sm";
                let keyBoxStyles =
                  "bg-slate-50 border-r border-slate-200 text-slate-500";
                let checkBadge = null;

                if (isAnswered) {
                  if (key === secureQuestionSource.correct_option) {
                    // Clean Emerald Accent Theme for Correct state
                    containerStyles =
                      "border-emerald-600 bg-emerald-50/40 text-slate-800 font-medium ring-1 ring-emerald-600";
                    keyBoxStyles =
                      "bg-emerald-100/70 border-r border-emerald-200 text-emerald-800";
                    checkBadge = (
                      <div className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-600 text-white text-[11px] font-bold shrink-0 shadow-sm ml-auto">
                        ✓
                      </div>
                    );
                  } else if (
                    key === selectedKey &&
                    selectedKey !== secureQuestionSource.correct_option
                  ) {
                    // Rose Accent Theme for Misclicked state
                    containerStyles =
                      "border-rose-400 bg-rose-50/40 text-slate-800";
                    keyBoxStyles =
                      "bg-rose-100/70 border-r border-rose-200 text-rose-800";
                    checkBadge = (
                      <div className="flex items-center justify-center w-5 h-5 rounded-full bg-rose-500 text-white text-[11px] font-bold shrink-0 shadow-sm ml-auto">
                        ✕
                      </div>
                    );
                  } else {
                    // Unselected options are faded back cleanly
                    containerStyles =
                      "border-slate-100 opacity-50 pointer-events-none";
                    keyBoxStyles = "bg-slate-50 text-slate-400";
                  }
                }

                return (
                  <button
                    key={key}
                    disabled={isAnswered}
                    onClick={() => handleOptionSelect(key)}
                    className={`w-full text-left rounded-xl border transition-all duration-150 flex items-center text-base p-0 overflow-hidden group ${containerStyles}`}
                  >
                    {/* Left-hand Letter Plate Segment */}
                    <div
                      className={`w-12 h-12 flex items-center justify-center font-bold tracking-wide shrink-0 transition-colors ${keyBoxStyles}`}
                    >
                      {key.toUpperCase()}
                    </div>

                    {/* Option Body Copy Content */}
                    <span className="flex-1 px-4 py-3 tracking-tight font-medium text-slate-700 leading-normal">
                      {value}
                    </span>

                    {/* Right side check status badge container */}
                    {checkBadge && (
                      <div className="pr-4 flex items-center">{checkBadge}</div>
                    )}
                  </button>
                );
              },
            )}
          </div>

          {/* Action Footer Button Layout */}
          {isAnswered ? (
            <div className="mt-8 text-sm text-gray-500 font-medium w-full animate-in fade-in slide-in-from-bottom-2 duration-200">
              <button
                onClick={handleProceedNext}
                className="w-full bg-slate-800 hover:bg-slate-900 active:scale-[0.99] text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition-all text-sm flex items-center justify-center gap-2 cursor-pointer group"
              >
                <span>
                  {currentIndex + 1 === gameQuestionIds.length
                    ? "View Final Results"
                    : "Next Question"}
                </span>
                <span className="text-xs bg-slate-700 text-slate-300 font-mono font-bold px-2 py-0.5 rounded-md">
                  {timeLeft}s
                </span>
              </button>
            </div>
          ) : (
            <div className="mt-8 text-sm text-slate-400 font-medium italic text-center py-2">
              Select an option above to test your skills!
            </div>
          )}
        </div>
      </div>

      {/* ─── RIGHT COLUMN: DASHBOARD SIDEBAR ─── */}
      <div className="w-full lg:w-80 flex flex-col gap-4 shrink-0">
        

        {/* Context Drawer Panel */}
        {/* ─── RIGHT COLUMN: MINIMAL SIDEBAR ─── */}
        <div className="w-full lg:w-72 flex flex-col gap-5 shrink-0 text-left">
          {/* Minimal Score Tracker */}
          <div className="p-6 bg-white border border-slate-100 rounded-2xl shadow-sm">
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
              Current Score
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-slate-800 tracking-tight">
                {score}
              </span>
              <span className="text-sm font-medium text-slate-400">
                / {gameQuestionIds.length} correct
              </span>
            </div>
          </div>

          {/* Clean Context Drawer Panel */}
          {isAnswered && (
            <div className="p-6 bg-white border border-slate-100 rounded-2xl shadow-sm flex flex-col gap-4 animate-in fade-in duration-200">
              {secureQuestionSource.context_note ? (
                <div>
                  <div className="flex items-center gap-1.5 mb-2 text-slate-700">
                    <span className="text-sm">💡</span>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Explanation
                    </h4>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed font-medium">
                    {secureQuestionSource.context_note}
                  </p>
                </div>
              ) : (
                <div className="text-sm text-slate-400 italic py-1">
                  Reviewing question details...
                </div>
              )}

              {secureQuestionSource.context_note &&
                secureQuestionSource.source_url && (
                  <a
                    href={secureQuestionSource.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-xs font-bold text-blue-600 hover:text-blue-700 gap-1 mt-1 transition-colors"
                  >
                    Verify Reference Source ↗
                  </a>
                )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
