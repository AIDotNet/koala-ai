import { memo } from "react";
import { Flexbox } from "react-layout-kit";
import Workspace from "@/features/Workspace";


const Knowledge = memo(() => {
    return <Flexbox horizontal>
        <Workspace />
        <Flexbox style={{
            flex: 1,
        }}>
            应用
        </Flexbox>
    </Flexbox>
})

Knowledge.displayName = 'Knowledge';

export default Knowledge;
