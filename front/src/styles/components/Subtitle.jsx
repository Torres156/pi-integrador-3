export function Subtitle({texto, classes})
{    
    return (
        <div className={"subtitle " + (classes ? classes : '')}>
            {texto}
        </div>
    )
}