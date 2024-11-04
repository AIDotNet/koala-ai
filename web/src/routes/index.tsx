

import { createBrowserRouter } from "react-router-dom";
import Welcome from "../app/welcome";
import About from "../app/welcome/about";
import Docs from "../app/welcome/docs";
import Faq from "@/app/welcome/faq";
import Terms from "@/app/welcome/terms";
import Contact from "@/app/welcome/contact";
import PanelLayout from "@/app/panel/_layout";
import WelcomePanel from "@/app/panel/welcome";

const routes = [
    {
        path: "/",
        element: <Welcome />,
    },
    {
        path: "/about",
        element: <About />,
    },
    {
        path: "/docs",
        element: <Docs />,
    },
    {
        path: '/faq',
        element: <Faq />
    },
    {
        path: "/terms",
        element: <Terms />,
    },
    {
        path: "/contact",
        element: <Contact />,
    },
    {
        path: '/panel',
        element: <PanelLayout />,
        children: [
            {
                path: '',
                element: <WelcomePanel />
            }
        ]
    }
];


const BrowserRouter = createBrowserRouter(routes);

export default BrowserRouter;