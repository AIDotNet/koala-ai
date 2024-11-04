import { memo } from "react";
import WelcomeLayout from "./_layout";



const Welcome = memo(() => {
    return (
        <WelcomeLayout>
            <h1>Welcome</h1>
        </WelcomeLayout>
    );
});

Welcome.displayName = "Welcome";

export default Welcome;