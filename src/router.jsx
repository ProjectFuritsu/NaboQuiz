import { createBrowserRouter } from "react-router";
import Menu_page from "./pages/menu_page";
import Quiz_page from "./pages/quiz_page";
import Result_page from "./pages/result_page";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Menu_page />,
  },
  {
    path: "/quiz",
    element: <Quiz_page />, 
  },
  {
    path: "/score",
    element: <Result_page />,
  },

]);
