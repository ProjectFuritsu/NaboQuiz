import { Link } from "react-router-dom";

export default function Leaderboard_page() {
  // Mock Local Data - Tailored to your active leaderboard session
  const leaderboardData = [
    { rank: 1, name: "Alex M.", score: "15/15", time: "1m 42s", avatar: "🥇", isTop3: true },
    { rank: 2, name: "Sarah K.", score: "15/15", time: "2m 05s", avatar: "🥈", isTop3: true },
    { rank: 3, name: "David L.", score: "14/15", time: "1m 58s", avatar: "🥉", isTop3: true },
    { rank: 4, name: "You", score: "12/15", time: "3m 10s", isUser: true, avatar: "👤" },
    { rank: 5, name: "Emma W.", score: "12/15", time: "2m 40s", avatar: "🔥" },
  ];

  return (
    <div className="flex flex-col gap-4 max-w-sm mx-auto w-full my-10 px-4">
      <div className="p-6 bg-white border border-gray-100 rounded-3xl shadow-xl w-full relative overflow-hidden">
        
        {/* Header Block with Back Button */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-left">
            <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">
              Mga Sweto sa Nabo 🏆
            </h1>
            <p className="text-xs text-gray-400">Live rankings for today</p>
          </div>
          <Link 
            to="/" 
            className="text-xs bg-slate-100 hover:bg-slate-200 text-gray-600 font-bold py-2 px-3 rounded-xl transition duration-200"
          >
            ← Menu
          </Link>
        </div>

        {/* Podiums / Rank Listing Wrapper */}
        <div className="space-y-2.5">
          {leaderboardData.map((player) => (
            <div 
              key={player.rank} 
              className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all duration-200 ${
                player.isUser 
                  ? 'bg-blue-50/70 border-blue-200 shadow-sm shadow-blue-100/50' 
                  : player.isTop3 
                    ? 'bg-slate-50/70 border-slate-100' 
                    : 'bg-white border-transparent hover:bg-slate-50/50'
              }`}
            >
              {/* Left Segment: Position and Identity */}
              <div className="flex items-center gap-3">
                <span className={`w-6 text-center font-black text-sm ${
                  player.isTop3 ? 'text-gray-800' : 'text-gray-400'
                }`}>
                  {player.rank}
                </span>
                <span className="text-xl flex items-center justify-center bg-white w-8 h-8 rounded-xl shadow-sm border border-slate-50">
                  {player.avatar}
                </span>
                <span className={`text-sm tracking-tight ${
                  player.isUser ? 'font-extrabold text-blue-900' : 'font-semibold text-gray-700'
                }`}>
                  {player.name} {player.isUser && "(Ikaw)"}
                </span>
              </div>

              {/* Right Segment: Performance Metrics */}
              <div className="text-right">
                <span className={`block text-sm font-bold ${
                  player.isUser ? 'text-blue-600' : 'text-gray-800'
                }`}>
                  {player.score}
                </span>
                <span className="block text-[10px] text-gray-400 font-medium font-mono">
                  ⏱️ {player.time}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Dynamic Context Prompt */}
        <div className="mt-5 bg-gradient-to-r from-blue-50 to-indigo-50/50 border border-blue-100/70 rounded-2xl p-4 flex items-start gap-3 text-left">
          <span className="text-xl mt-0.5">🚀</span>
          <p className="text-xs text-slate-600 leading-relaxed">
            Gusto nimo malapas si <strong>Sarah K.</strong>? Balik sa main menu, tarunga og tubag, ug paspasi og hurot ang quiz!
          </p>
        </div>

      </div>
    </div>
  );
}