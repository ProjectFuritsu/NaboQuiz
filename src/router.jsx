import { createBrowserRouter } from "react-router";
import Menu_page from "./pages/menu_page";
import Quiz_page from "./pages/quiz_page";
import Result_page from "./pages/result_page";
import ProtectedRoute from "./components/layout/l_protectedRoute"; // Adjust the import path as needed

export const router = createBrowserRouter([
  // Public Route: Anyone can visit the menu
  {
    path: "/",
    element: <Menu_page />,
  },
  
  // Protected Routes Group
  {
    element: <ProtectedRoute />, // Wraps everything below
    children: [
      {
        path: "/quiz",
        element: <Quiz_page />,
      },
      {
        path: "/score",
        element: <Result_page />,
      },
    ],
  },
]);