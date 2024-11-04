import { Footer, } from "@lobehub/ui";
import { memo } from "react";
import { GITEE, GITHUB } from "@/const/url";



const Bottom = memo(() => {
    const columns = [
        {
            title: "关于",
            items: [
                {
                    title: "关于我们",
                    description: "关于我们的故事",
                    url: "/about"
                },
                {
                    title: "联系我们",
                    url: "/contact",
                    description: "商务合作"
                }
            ]
        },
        {
            title: "帮助",
            items: [
                {
                    title: "常见问题",
                    url: "/faq",
                    description: "常见问题解答"
                },
                {
                    title: "服务条款",
                    url: "/terms",
                    description: "服务条款和隐私政策"
                }
            ]
        },
        {
            title: "社区",
            items: [
                {
                    title: "GitHub",
                    url: GITHUB,
                    description: "GitHub 仓库"
                },
                {
                    title: "Gitee",
                    url: GITEE,
                    description: "Gitee 仓库"
                }
            ]
        }
    ]

    return (<Footer columns={columns}>

    </Footer>)
});

Bottom.displayName = "Bottom";

export default Bottom;