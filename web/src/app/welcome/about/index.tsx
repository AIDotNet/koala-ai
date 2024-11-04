import { memo } from "react";
import WelcomeLayout from "../_layout";


const About = memo(() => {
    return (<WelcomeLayout>
        <h1>About</h1>
    </WelcomeLayout>)
})

About.displayName = "About";

export default About;