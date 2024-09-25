"use client"
import React, {useState, useEffect, uesContext, useContext, useRef} from "react";
import styles from "./page.module.css";
import DraggingElementContext from "./contexts/draggingElementContext";
import SelectingElementContext from "./contexts/selectingElementContext";
import ElementsContext from "./contexts/elementsContext";


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
    const [btnId, setBtnId] = useState(id_in);
    const [mousePos, setMousePos] = useState({x: 0, y: 0})
    const bounds = bounds_in;

    let x = Number(bounds["left"].slice(0, -2));
    let y = Number(bounds["top"].slice(0, -2));
    let h = Number(bounds["height"].slice(0, -2));
    let w = Number(bounds["width"].slice(0, -2));


    let topStyle = {
        true: {
            position: "relative",
            left: "-1px",
            top: "-1px",
            border: "2px solid black",
            width: `${w+6}px`,
            height: `${h+6}px`,
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
    }, [btnId]);

    const onClick = (event) => {
        event.preventDefault();
        setSelecting(btnId);
    }

    const onDragStart = (event) => {
        setMousePos({
            x: event.pageX,
            y: event.pageY
        })
    }

    const onDragEnd = (event) => {
        let nowx = x;
        let nowy = y;
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
    }

    const onSizeChangeStart = (event) => {
        setMousePos({x: event.pageX, y: event.pageY})
    }

    const onSizeChangeEnd1 = (event) => {
        let mouseX = event.pageX;
        let mouseY = event.pageY;
        let dx = mouseX - mousePos.x;
        let dy = mouseY - mousePos.y;
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
    }
    const onSizeChangeEnd2 = (event) => {
        let mouseX = event.pageX;
        let mouseY = event.pageY;
        let dx = mouseX - mousePos.x;
        let dy = mouseY - mousePos.y;
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
    }
    const onSizeChangeEnd3 = (event) => {
        let mouseX = event.pageX;
        let mouseY = event.pageY;
        let dx = mouseX - mousePos.x;
        let dy = mouseY - mousePos.y;
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
    }
    const onSizeChangeEnd4 = (event) => {
        let mouseX = event.pageX;
        let mouseY = event.pageY;
        let dx = mouseX - mousePos.x;
        let dy = mouseY - mousePos.y;
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
    }

    return (
        <span>
            <span style={{position: "absolute", left:bounds["left"], top: bounds["top"]}}>
                <div onClick={onClick} id={btnId} style={topStyle[selecting == btnId]} onDragStart={onDragStart} 
                onDragEnd={onDragEnd} draggable={`${selecting==btnId}`}>
                    {children}
                </div>
            </span>
            {selecting==btnId ? (
                <span>
                    <div onDragStart={onSizeChangeStart} onDragEnd={onSizeChangeEnd1} draggable="true" 
                        style={{position: "absolute", left:`${x-5}px`, top:`${y-5}px`, width: "10px", height: "10px",
                        backgroundColor:"blue", cursor: "nwse-resize"}}></div>
                    <div onDragStart={onSizeChangeStart} onDragEnd={onSizeChangeEnd2} draggable="true" 
                        style={{position: "absolute", left:`${x+w}px`, top:`${y-5}px`, width: "10px", height: "10px",
                         backgroundColor:"blue", cursor: "nesw-resize"}}></div>
                    <div onDragStart={onSizeChangeStart} onDragEnd={onSizeChangeEnd3} draggable="true" 
                        style={{position: "absolute", left:`${x-5}px`, top:`${y+h}px`, width: "10px", height: "10px", 
                        backgroundColor:"blue", cursor: "nesw-resize"}}></div>
                    <div onDragStart={onSizeChangeStart} onDragEnd={onSizeChangeEnd4} draggable="true" 
                        style={{position: "absolute", left:`${x+w}px`, top:`${y+h}px`, width: "10px", height: "10px", 
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
            color:"white"
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
            color:"black"
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
            color:"black"
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