import { createBrowserRouter } from "react-router";
import MainMenuPage from "./pages/main_menu_page";

import Result_page from "./pages/result_page";
import ProtectedRoute from "./components/layout/l_protectedRoute"; 
import Leaderboard_page from "./pages/leaderboard_page";
import QuizBoardPage from "./pages/quiz_board_page";

export const router = createBrowserRouter([
  // 🔓 Public Routes: Anyone can visit these anytime
  {
    path: "/",
    element: <MainMenuPage />,
  },
  {
    path: "/leaderboard",
    element: <Leaderboard_page />, // Moved out here so it's fully public!
  },

  // 🔒 Protected Routes Group: Restricts unauthorized access
  {
    element: <ProtectedRoute />, 
    children: [
      {
        path: "/quiz",
        element: <QuizBoardPage />,
      },
      {
        path: "/score",
        element: <Result_page />,
      },
    ],
  },
]);