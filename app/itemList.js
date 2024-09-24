"use client"
import {useState, useEffect, uesContext, useContext, useRef} from "react";
import styles from "./page.module.css";
import DraggingElementContext from "./contexts/draggingElementContext";
import SelectingElementContext from "./contexts/selectingElementContext";
import ElementsContext from "./contexts/elementsContext";

function ItemList(props) {
    return (
        <div className={`${styles.center}`}>
            <div className="row" style={{ width: '80%', margin: '0 auto'}}>
                <ButtonItem />
            </div>
        </div>
    )
}

function Button(props_in) {

    const {selecting, setSelecting} = useContext(SelectingElementContext);
    const {elements, setElements} = useContext(ElementsContext);
    const [btnId, setBtnId] = useState(props_in.id);
    const text = props_in.text;
    const props = props_in.props;

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

    return (
        <button id={btnId} {...props} onClick={onClick}>
            {text}
        </button>
    )

}

function ButtonItem(props) {

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
            position: "absolute",
            width: `${bound.width}`,
            height: `${bound.height}`,
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

export default ItemList;