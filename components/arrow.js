

export default function Arrow({start, end}){
    let sx = start.x;
    let sy = start.y;
    let ex = end.x;
    let ey = end.y;

    let x1 = Math.max(sx + ex, 0);
    let y1 = Math.max(sy + ey, 0);

    let cx = Math.abs(ex);
    let cy = Math.abs(ey);

    return (
        <svg width={2 * Math.abs(ex - sx) + 10} height={2 * Math.abs(ey - sy) + 10} 
            style={{zIndex:"-1",position: "absolute", top:`${-Math.abs(ey - sy)}px`, left:`${-Math.abs(ex - sx)}px`}}>
            <line x1={cx + 8} y1={cy + 8} x2={cx + ex} y2={cy + ey} stroke="black" strokeWidth="2"/>
        </svg>
    )
}