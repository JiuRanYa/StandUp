import App from "../App";
import Settings from "../pages/settings";
import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
    },
    {
        path: "/settings",
        element: <Settings />,
    },
]);
