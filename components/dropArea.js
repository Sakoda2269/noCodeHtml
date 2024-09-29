"use client"
import {useContext, useState, useRef, useEffect} from "react";
import DraggingElementContext from "../contexts/draggingElementContext";
import ElementsContext from "../contexts/elementsContext";
import SelectingElementContext from "../contexts/selectingElementContext";
import UndoContext from "../contexts/undoContext";

function DropArea(props) {

    const {dragging, setDragging} = useContext(DraggingElementContext);
    const {selecting, setSelecting} = useContext(SelectingElementContext)
    const {elements, setElements} = useContext(ElementsContext);
    const {undoStack, setUndoStack} = useContext(UndoContext);

    const ref = useRef(null);
    const [pos, setPos] = useState({top: 0, left: 0});

    useEffect(() => {
        if (ref.current) {
            const rect = ref.current.getBoundingClientRect();
            setPos({top: rect.top, left: rect.left});
        }
    }, []);

    const onDrop = (event) => {
        event.preventDefault();
        if (Object.keys(dragging).length !== 0) {
            let element= dragging.elem;
            let props = dragging.props;
            let text = dragging.text;
            let id = dragging.id;
            let bounds = dragging.bounds;
            let mouseX = event.pageX;
            let mouseY = event.pageY;
            let offsetX = dragging.x;
            let offsetY = dragging.y;
            let x = mouseX - offsetX - pos.left;
            let y = mouseY - offsetY - pos.top;

            bounds["left"] = `${x}px`;
            bounds["top"] = `${y}px`;

            setElements( elements => (
                {
                    ...elements,
                    [id]:{
                        element: element,
                        props: props,
                        text: text,
                        bounds: bounds
                    }
                }
            ));
            setUndoStack([
                ...undoStack,
                {
                    action: "addElement",
                    id: id,
                    data: {
                        element: element,
                        props: props,
                        text: text,
                        bounds: bounds
                    }
                }
            ])
            setDragging({});
        }
        

    }

    const dragOver = (event) => {
        event.preventDefault();
    }

    const onClick = (event) => {
        setSelecting("");
    }

    return (
        <div style={{ width: '100%', height: '100%', backgroundColor: 'lightblue', position: "relative"}}
            onDrop={onDrop}
            onDragOver={dragOver}
            onClick={onClick}
            ref={ref}
        > 
            {Object.entries(elements).map(([id, Component]) => (
                <span key={id}>
                    <Component.element props={Component.props} text={Component.text} bounds={Component.bounds} id={id}/>
                </span>
            ))}

        </div>
    )
} 

export default DropArea;