"use client"
import React, {useState, useEffect, uesContext, useContext, useRef} from "react";
import styles from "./page.module.css";
import DraggingElementContext from "./contexts/draggingElementContext";
import SelectingElementContext from "./contexts/selectingElementContext";
import ElementsContext from "./contexts/elementsContext";
import UndoContext from "./contexts/undoContext";


function ItemList(props) {
    return (
        <div className={`${styles.center}`}>
            <div className="row" style={{ width: '80%', margin: '0 auto'}}>
                <ButtonItem />
                <p></p>
                <TextInputItem />
                <p></p>
                <TextLabelItem />
            </div>
        </div>
    )
}

function Base({id_in, bounds_in, children}) {

    const {selecting, setSelecting} = useContext(SelectingElementContext);
    const {elements, setElements} = useContext(ElementsContext);
    const {undoStack, setUndoStack} = useContext(UndoContext);
    const [btnId, setBtnId] = useState(id_in);
    const [mousePos, setMousePos] = useState({x: 0, y: 0})
    
    const bounds = bounds_in;
    
    const [sizeSq1, setSizeSq1] = useState({x: 0, y: 0});
    const [sizeSq2, setSizeSq2] = useState({x: 0, y: 0});
    const [sizeSq3, setSizeSq3] = useState({x: 0, y: 0});
    const [sizeSq4, setSizeSq4] = useState({x: 0, y: 0});
    const [mainPos, setMainPos] = useState({x: 0, y: 0});
    let topStyle = {
        true: {
            position: "relative",
            left: "1px",
            top: "1px",
            cursor: "move"
        },
        false: {
            position: "relative",
            left: "1px",
            top: "1px",
        }
    }

    useEffect(() => {
        setElements(elements => ({
            ...elements,
            [btnId]: {
                ...elements[btnId],
                ["changeId"]: setBtnId
            }
        }))
        setSizeSq1({x: Number(bounds["left"].slice(0, -2)) - 5, y: Number(bounds["top"].slice(0, -2)) - 5})
        setSizeSq2({x: Number(bounds["left"].slice(0, -2)) + Number(bounds["width"].slice(0, -2)), y: Number(bounds["top"].slice(0, -2)) - 5})
        setSizeSq3({x: Number(bounds["left"].slice(0, -2)) - 5, y: Number(bounds["top"].slice(0, -2)) + Number(bounds["height"].slice(0, -2))})
        setSizeSq4({x: Number(bounds["left"].slice(0, -2)) + Number(bounds["width"].slice(0, -2)), y: Number(bounds["top"].slice(0, -2)) + Number(bounds["height"].slice(0, -2))})
        setMainPos({x: Number(bounds["left"].slice(0, -2)), y: bounds["top"].slice(0, -2)});
    }, [btnId, bounds]);

    const onClick = (event) => {
        event.preventDefault();
        event.stopPropagation()
        setSelecting(btnId);
    }

    const onDragStart = (event) => {
        setMousePos({
            x: event.pageX,
            y: event.pageY
        })
    }

    const onDragEnd = (event) => {
        let nowx = Number(bounds["left"].slice(0, -2));
        let nowy = Number(bounds["top"].slice(0, -2));
        let dx = event.pageX - mousePos.x;
        let dy = event.pageY - mousePos.y;
        setElements({
            ...elements,
            [btnId]:{
                ...elements[btnId],
                ["bounds"]:{
                    ...elements[btnId]["bounds"],
                    ["left"]: `${nowx + dx}px`,
                    ["top"]: `${nowy + dy}px`
                }
            }
        })
        console.log(undoStack);
        setUndoStack([...undoStack, {
            action: "posChange",
            id: btnId,
            prevPos: {x: nowx, y: nowy},
            nowPos: {x: nowx + dx, y: nowy + dy}
        }]);
    }

    const onSizeChangeStart = (event) => {
        setMousePos({x: event.pageX, y: event.pageY})
    }

    const onSizeChangeDragging1 = (event) => {
        let dx = event.pageX - mousePos.x;
        let dy = event.pageY - mousePos.y;
        setMousePos({
            x: event.pageX,
            y: event.pageY
        })
        let sq1x = sizeSq1.x;
        let sq1y = sizeSq1.y;
        let sq2x = sizeSq2.x;
        let sq3y = sizeSq3.y;
        setSizeSq1({x: sq1x + dx, y: sq1y + dy})
        setSizeSq2({x: sq2x, y: sq1y + dy})
        setSizeSq3({x: sq1x + dx, y: sq3y})
        
    }

    const onSizeChangeEnd1 = (event) => {
        let mouseX = event.pageX;
        let mouseY = event.pageY;
        let dx = mouseX - mousePos.x;
        let dy = mouseY - mousePos.y;
        let x = sizeSq1.x;
        let y = sizeSq1.y;
        let w = sizeSq4.x - sizeSq1.x;
        let h = sizeSq4.y - sizeSq1.y;
        setElements({
            ...elements,
            [selecting]:{
                ...elements[selecting],
                ["bounds"]:{
                    ["left"]: `${x + dx}px`,
                    ["top"]: `${y + dy}px`,
                    ["width"]: `${w - dx}px`,
                    ["height"]: `${h - dy}px`
                }
            }
        })
        let prevx = Number(bounds.left.slice(0, -2));
        let prevy = Number(bounds.top.slice(0, -2));
        let prevw = Number(bounds.width.slice(0, -2));
        let prevh = Number(bounds.height.slice(0, -2));
        setUndoStack([...undoStack, {
            action:"sizeChange",
            id: btnId,
            prevBounds: {x: prevx, y: prevy, w: prevw, h: prevh},
            nowBounds: {x: x, y: y, w: w, h: h}
        }])
    }

    const onSizeChangeDragging2 = (event) => {
        let dx = event.pageX - mousePos.x;
        let dy = event.pageY - mousePos.y;
        setMousePos({
            x: event.pageX,
            y: event.pageY
        })
        let sq2x = sizeSq2.x;
        let sq2y = sizeSq2.y;
        let sq1x = sizeSq1.x;
        let sq4y = sizeSq4.y;

        setSizeSq2({x: sq2x + dx, y: sq2y + dy});
        setSizeSq1({x: sq1x, y: sq2y + dy});
        setSizeSq4({x: sq2x + dx, y: sq4y});
        
    }

    const onSizeChangeEnd2 = (event) => {
        let mouseX = event.pageX;
        let mouseY = event.pageY;
        let dx = mouseX - mousePos.x;
        let dy = mouseY - mousePos.y;
        let x = sizeSq1.x;
        let y = sizeSq1.y;
        let w = sizeSq4.x - sizeSq1.x;
        let h = sizeSq4.y - sizeSq1.y;
        setElements({
            ...elements,
            [selecting]:{
                ...elements[selecting],
                ["bounds"]:{
                    ...elements[selecting]["bounds"],
                    ["top"]: `${y + dy}px`,
                    ["width"]: `${w + dx}px`,
                    ["height"]: `${h - dy}px`
                }
            }
        })
        let prevx = Number(bounds.left.slice(0, -2));
        let prevy = Number(bounds.top.slice(0, -2));
        let prevw = Number(bounds.width.slice(0, -2));
        let prevh = Number(bounds.height.slice(0, -2));
        setUndoStack([...undoStack, {
            action:"sizeChange",
            id: btnId,
            prevBounds: {x: prevx, y: prevy, w: prevw, h: prevh},
            nowBounds: {x: x, y: y, w: w, h: h}
        }])
    }

    const onSizeChangeDragging3 = (event) => {
        let dx = event.pageX - mousePos.x;
        let dy = event.pageY - mousePos.y;
        setMousePos({
            x: event.pageX,
            y: event.pageY
        })
        let sq3x = sizeSq3.x;
        let sq3y = sizeSq3.y;
        let sq1y = sizeSq1.y;
        let sq4x = sizeSq4.x;

        setSizeSq3({x: sq3x + dx, y: sq3y + dy});
        setSizeSq1({x: sq3x + dx, y: sq1y});
        setSizeSq4({x: sq4x, y: sq3y + dy});
    }

    const onSizeChangeEnd3 = (event) => {
        let mouseX = event.pageX;
        let mouseY = event.pageY;
        let dx = mouseX - mousePos.x;
        let dy = mouseY - mousePos.y;
        let x = sizeSq1.x;
        let y = sizeSq1.y;
        let w = sizeSq4.x - sizeSq1.x;
        let h = sizeSq4.y - sizeSq1.y;
        setElements({
            ...elements,
            [selecting]:{
                ...elements[selecting],
                ["bounds"]:{
                    ...elements[selecting]["bounds"],
                    ["left"]: `${x + dx}px`,
                    ["width"]: `${w - dx}px`,
                    ["height"]: `${h + dy}px`
                }
            }
        })
        let prevx = Number(bounds.left.slice(0, -2));
        let prevy = Number(bounds.top.slice(0, -2));
        let prevw = Number(bounds.width.slice(0, -2));
        let prevh = Number(bounds.height.slice(0, -2));
        setUndoStack([...undoStack, {
            action:"sizeChange",
            id: btnId,
            prevBounds: {x: prevx, y: prevy, w: prevw, h: prevh},
            nowBounds: {x: x, y: y, w: w, h: h}
        }])
    }

    const onSizeChangeDragging4 = (event) => {
        let dx = event.pageX - mousePos.x;
        let dy = event.pageY - mousePos.y;
        setMousePos({
            x: event.pageX,
            y: event.pageY
        })
        let sq4x = sizeSq4.x;
        let sq4y = sizeSq4.y;
        let sq3x = sizeSq3.x;
        let sq2y = sizeSq2.y;

        setSizeSq4({x: sq4x + dx, y: sq4y + dy});
        setSizeSq3({x: sq3x, y: sq4y + dy});
        setSizeSq2({x: sq4x + dx, y: sq2y});
    }

    const onSizeChangeEnd4 = (event) => {
        let mouseX = event.pageX;
        let mouseY = event.pageY;
        let dx = mouseX - mousePos.x;
        let dy = mouseY - mousePos.y;
        let x = sizeSq1.x;
        let y = sizeSq1.y;
        let w = sizeSq4.x - sizeSq1.x;
        let h = sizeSq4.y - sizeSq1.y;
        setElements({
            ...elements,
            [selecting]:{
                ...elements[selecting],
                ["bounds"]:{
                    ...elements[selecting]["bounds"],
                    ["width"]: `${w + dx}px`,
                    ["height"]: `${h + dy}px`
                }
            }
        })
        let prevx = Number(bounds.left.slice(0, -2));
        let prevy = Number(bounds.top.slice(0, -2));
        let prevw = Number(bounds.width.slice(0, -2));
        let prevh = Number(bounds.height.slice(0, -2));
        setUndoStack([...undoStack, {
            action:"sizeChange",
            id: btnId,
            prevBounds: {x: prevx, y: prevy, w: prevw, h: prevh},
            nowBounds: {x: x, y: y, w: w, h: h}
        }])
    }

    return (
        <span>
            <span style={{position: "absolute", left:`${mainPos.x}px`, top: `${mainPos.y}px`}}>
                <div onClick={onClick} id={btnId} style={topStyle[selecting == btnId]} onDragStart={onDragStart} 
                onDragEnd={onDragEnd} draggable={`${selecting==btnId}`}>
                    {children}
                </div>
            </span>
            {selecting==btnId ? (
                <span>
                    <div style={{position: "absolute", left: `${sizeSq1["x"] + 3}px`, top: `${sizeSq1["y"] + 4}px`, width: `${sizeSq4["x"] - sizeSq1["x"]}px`,
                         height: `${2}px`, backgroundColor: "black" 
                    }}></div>
                    <div style={{position: "absolute", left: `${sizeSq1["x"] + 3}px`, top: `${sizeSq4["y"] + 3}px`, width: `${sizeSq4["x"] - sizeSq1["x"]}px`,
                         height: `${2}px`, backgroundColor: "black" 
                    }}></div>
                    <div style={{position: "absolute", left: `${sizeSq1["x"] + 4}px`, top: `${sizeSq1["y"] + 4}px`, width: `${2}px`,
                         height: `${sizeSq4["y"] - sizeSq1["y"]}px`, backgroundColor: "black" 
                    }}></div>
                    <div style={{position: "absolute", left: `${sizeSq2["x"] + 3}px`, top: `${sizeSq2["y"] + 4}px`, width: `${2}px`,
                         height: `${sizeSq4["y"] - sizeSq1["y"]}px`, backgroundColor: "black" 
                    }}></div>
                    <div onDragStart={onSizeChangeStart} onDragEnd={onSizeChangeEnd1} onDrag={onSizeChangeDragging1} draggable="true" 
                        style={{position: "absolute", left:`${sizeSq1["x"]}px`, top:`${sizeSq1["y"]}px`, width: "10px", height: "10px",
                        backgroundColor:"blue", cursor: "nwse-resize"}}></div>
                    <div onDragStart={onSizeChangeStart} onDragEnd={onSizeChangeEnd2} onDrag={onSizeChangeDragging2} draggable="true" 
                        style={{position: "absolute", left:`${sizeSq2["x"]}px`, top:`${sizeSq2["y"]}px`, width: "10px", height: "10px",
                         backgroundColor:"blue", cursor: "nesw-resize"}}></div>
                    <div onDragStart={onSizeChangeStart} onDragEnd={onSizeChangeEnd3} onDrag={onSizeChangeDragging3} draggable="true" 
                        style={{position: "absolute", left:`${sizeSq3["x"]}px`, top:`${sizeSq3["y"]}px`, width: "10px", height: "10px",
                        backgroundColor:"blue", cursor: "nesw-resize"}}></div>
                    <div onDragStart={onSizeChangeStart} onDragEnd={onSizeChangeEnd4} onDrag={onSizeChangeDragging4} draggable="true" 
                        style={{position: "absolute", left:`${sizeSq4["x"]}px`, top:`${sizeSq4["y"]}px`, width: "10px", height: "10px",
                        backgroundColor:"blue", cursor: "nwse-resize"}}></div>
                </span>
            ) : (
                <></>
            )}
        </span>
    )

}

function Button({props, bounds, text, id}){
    const {["style"]: value, ...rect} = props;
    const style = {
        ...value,
        ["position"]: "relative",
        ["left"]: "1px",
        ["top"]: "1px",
        ["width"]: bounds["width"],
        ["height"]: bounds["height"],
        ["cursor"]: "inherit"
    };
    return (
        <Base id_in={id} bounds_in={bounds}>
            <button {...rect} style={style}>{text}</button>
        </Base>
    )
}

function TextInput({props, bounds, text, id}) {
    const {["style"]: value, ...rect} = props;
    const style = {
        ...value,
        ["position"]: "relative",
        ["left"]: "1px",
        ["top"]: "1px",
        ["width"]: bounds["width"],
        ["height"]: bounds["height"],
        ["cursor"]: "inherit"
    };
    return (
        <Base id_in={id} bounds_in={bounds}>
            <input type="text" {...rect} style={style} readOnly="readonly" value={text}/>
        </Base>
    )
}

function TextLabel({props, bounds, text, id}) {
    const {["style"]: value, ...rect} = props;
    const style = {
        ...value,
        ["position"]: "relative",
        ["left"]: "1px",
        ["top"]: "1px",
        ["width"]: bounds["width"],
        ["height"]: bounds["height"],
        ["cursor"]: "inherit"
    };
    return (
        <Base id_in={id} bounds_in={bounds}>
            <label {...rect} style={style}>{text}</label>
        </Base>
    )
}

function ButtonItem() {

    const {dragging, setDragging} = useContext(DraggingElementContext);
    const [bound, setBound] = useState({width: 0, height: 0, left: 0, top: 0});
    const ref = useRef(null);

    useEffect(() => {
        if (ref.current) {
            const rect = ref.current.getBoundingClientRect();
            setBound({width: rect.width, height: rect.height, left: rect.left, top: rect.top});
        }
    }, []);

    const onDragStart = (event) => {

        let uuid = self.crypto.randomUUID();
        let mouseX = event.pageX - bound.left;
        let mouseY = event.pageY - bound.top;
        let style = {
            color:"white",
            fontSize: "16px"
        }
        let bounds = {
            width: `${bound.width}px`,
            height: `${bound.height}px`,
            top: "0px",
            left: "0px"
        }

        setDragging({
            elem: Button,
            props:{
                className: "btn btn-primary", style: style
            },
            text: "ボタン",
            id: uuid,
            bounds: bounds,
            x: mouseX,
            y: mouseY
        })
    }

    return (
        <button className="btn btn-primary" draggable="true" 
            onDragStart={onDragStart}
            ref={ref}
        >ボタン</button>
    )
}

function TextInputItem() {

    const {dragging, setDragging} = useContext(DraggingElementContext);
    const [bound, setBound] = useState({width: 0, height: 0, left: 0, top: 0});
    const ref = useRef(null);

    useEffect(() => {
        if (ref.current) {
            const rect = ref.current.getBoundingClientRect();
            setBound({width: rect.width, height: rect.height, left: rect.left, top: rect.top});
        }
    }, []);

    const onDragStart = (event) => {

        let uuid = self.crypto.randomUUID();
        let mouseX = event.pageX - bound.left;
        let mouseY = event.pageY - bound.top;
        let style = {
            color:"black",
            fontSize: "16px"
        }
        let bounds = {
            width: `${bound.width}px`,
            height: `${bound.height}px`,
            top: "0px",
            left: "0px"
        }

        setDragging({
            elem: TextInput,
            props:{
                className: "form-control", style: style
            },
            text: "入力欄",
            id: uuid,
            bounds: bounds,
            x: mouseX,
            y: mouseY
        })
    }

    return (
        <input type="text" className="form-control" draggable="true" readOnly="readonly" value="入力欄"
            onDragStart={onDragStart}
            ref={ref}/>
    )
}

function TextLabelItem() {

    const {dragging, setDragging} = useContext(DraggingElementContext);
    const [bound, setBound] = useState({width: 0, height: 0, left: 0, top: 0});
    const ref = useRef(null);

    useEffect(() => {
        if (ref.current) {
            const rect = ref.current.getBoundingClientRect();
            setBound({width: rect.width, height: rect.height, left: rect.left, top: rect.top});
        }
    }, []);

    const onDragStart = (event) => {

        let uuid = self.crypto.randomUUID();
        let mouseX = event.pageX - bound.left;
        let mouseY = event.pageY - bound.top;
        let style = {
            color:"black",
            fontSize: "16px"
        }
        let bounds = {
            width: `${bound.width}px`,
            height: `${bound.height}px`,
            top: "0px",
            left: "0px"
        }

        setDragging({
            elem: TextLabel,
            props:{
                className: "", style: style
            },
            text: "テキストラベル",
            id: uuid,
            bounds: bounds,
            x: mouseX,
            y: mouseY
        })
    }

    return (
        <label className={styles.text_border} draggable="true"
            onDragStart={onDragStart}
            ref={ref}>
            テキストラベル
        </label>
    )
}

export default ItemList;