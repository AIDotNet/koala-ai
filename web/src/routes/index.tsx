

import { createBrowserRouter } from "react-router-dom";
import Welcome from "../app/welcome";
import About from "../app/welcome/about";
import Docs from "../app/welcome/docs";
import Faq from "@/app/welcome/faq";
import Terms from "@/app/welcome/terms";
import Contact from "@/app/welcome/contact";
import PanelLayout from "@/app/panel/_layout";
import WelcomePanel from "@/app/panel/welcome";
import LoginPage from "@/app/login";
import Knowledge from "@/app/panel/knowledge";
import Application from "@/app/panel/application";


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
            },
            {
                path: 'knowledge',
                element: <Knowledge />
            },
            {
                path: 'application',
                element: <Application />
            }
        ]
    },
    {
        path:'/login',
        element: <LoginPage />
    }
];


const BrowserRouter = createBrowserRouter(routes);

export default BrowserRouter;