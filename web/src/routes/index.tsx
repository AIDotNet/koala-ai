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
import Agent from "@/app/panel/agent";
import AgentInfo from "@/app/panel/agent/info";
import KnowledgeInfo from "@/app/panel/knowledge/info";
import File from "@/app/panel/knowledge/file";
import Workflow from "@/app/panel/workflow";
import WorkflowDesigner from "@/app/panel/workflow/WorkflowDesigner";
import ModelConfigPage from "@/app/panel/model";

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
                path: 'agent',
                element: <Agent />,
            },
            {
                path: 'workflow',
                element: <Workflow />
            },
            {
                path: 'workflow/designer',
                element: <WorkflowDesigner />
            },
            {
                path: 'workflow/designer/register',
                element: <WorkflowDesigner />
            },
            {
                path: 'knowledge/info/:knowledgeId',
                element: <KnowledgeInfo />
            },
            {
                path:'knowledge/file',
                element: <File />
            },
            {
                path: 'model',
                element: <ModelConfigPage />
            }
        ]
    },
    {
        path: '/panel/agent/info/:agentId',
        element: <AgentInfo />
    },
    {
        path: '/login',
        element: <LoginPage />
    }
];

const BrowserRouter = createBrowserRouter(routes);

export default BrowserRouter;