"use client"
import {useContext, useState, useRef, useEffect} from "react";
import DraggingElementContext from "./contexts/draggingElementContext";
import ElementsContext from "./contexts/elementsContext";

function DropArea(props) {

    const {dragging, setDragging} = useContext(DraggingElementContext);
    const {elements, setElements} = useContext(ElementsContext);

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
        let element= dragging.elem;
        let props = dragging.props;
        let text = dragging.text;
        let id = dragging.id;
        let mouseX = event.pageX;
        let mouseY = event.pageY;
        let offsetX = dragging.x;
        let offsetY = dragging.y;
        let x = mouseX - offsetX - pos.left;
        let y = mouseY - offsetY - pos.top;

        props.style["left"] = `${x}px`;
        props.style["top"] = `${y}px`;

        setElements( elements => (
            {
                ...elements,
                [id]:{
                    element: element,
                    props: props,
                    text: text,
                }
            }
        ));

    }

    const dragOver = (event) => {
        event.preventDefault();
    }

    return (
        <div style={{ width: '100%', height: '100%', backgroundColor: 'lightblue', position: "relative"}}
            onDrop={onDrop}
            onDragOver={dragOver}
            ref={ref}
        > 
            {Object.entries(elements).map(([id, Component]) => (
                <Component.element props={Component.props} text={Component.text} id={id} key={id}/>
            ))}

        </div>
    )
} 

export default DropArea;