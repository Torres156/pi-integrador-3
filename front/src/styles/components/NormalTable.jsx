export function NormalTable({ items, classes }) {
    return (
        <div className={'normal-table ' + (classes ?? '')}>
            {items && items.length > 0 && items.map((item, index) => (
                <div key={index}>
                    {Object.keys(item).map((x, i) => (
                        <span className={Object.keys(item).length > 2 && i == 1 ? "text-center" : ""} key={i}>{item[x]}</span>
                    ))}
                </div>
            ))}
        </div>
    );
}