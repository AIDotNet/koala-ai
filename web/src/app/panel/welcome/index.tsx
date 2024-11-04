import { memo } from "react";

const WelcomePanel = memo(() => {
    return (
        <div>
            <h1>Welcome Panel</h1>
        </div>
    )
})

WelcomePanel.displayName = "WelcomePanel";

export default WelcomePanel;

