import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Settings from "../pages/settings";
import Layout from "../layout";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                index: true,
                element: <App />,
            },
            {
                path: "settings",
                element: <Settings />,
            },
        ],
    },
]);
