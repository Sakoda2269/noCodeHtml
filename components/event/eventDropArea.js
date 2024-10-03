"use client"
import EventContext from "@/contexts/event/eventContext";
import EventDraggingContext from "@/contexts/event/eventDraggingContext";
import EventSelectingContext from "@/contexts/event/eventSelectingContext";
import VariableContext from "@/contexts/event/variableContext";
import EventsContext from "@/contexts/eventsContext";
import { useContext, useEffect, useRef, useState } from "react";


function EventDropArea({eventsId}){

    const {dragging, setDragging} = useContext(EventDraggingContext);
    const {event, setEvent} = useContext(EventContext);
    const {selecting, setSelecting} = useContext(EventSelectingContext);

    const ref = useRef(null);
    const [areaPos, setAreaPos] = useState({top: 0, left: 0});
    const [variables, setVariables] = useState([]);


    useEffect(() => {
        if(ref.current) {
            const rect = ref.current.getBoundingClientRect();
            setAreaPos({top: rect.top, left: rect.left});
        }
    }, [])

    const drop = (e) => {
        if(Object.keys(dragging).length!==0){
            let id = dragging.id;
            let eventItem = dragging.event;
            let bounds = dragging.bounds;
            let offsetX = bounds.left;
            let offsetY = bounds.top;
            let x = e.pageX - offsetX - areaPos.left;
            let y = e.pageY - offsetY - areaPos.top;
            bounds.top = y;
            bounds.left = x;
            setEvent({
                ...event,
                ["event"]: {
                    ...event.event,
                    [id]:{
                        action: eventItem,
                        bounds: bounds,
                        parent: "",
                        childe: "",
                        selector: []
                    }
                }
                
            });
        }
        setDragging({})
    }

    const dragOver = (e) => {
        e.preventDefault();
    }

    const onClick = (e) => {
        setSelecting("");
    }

    const pos = (bounds, id) => {
        if(selecting == id){
            return {
                position: "absolute",
                top: `${bounds.top}px`,
                left: `${bounds.left}px`,
                zIndex: "10"
            }
        }
        return {
            position: "absolute",
            top: `${bounds.top}px`,
            left: `${bounds.left}px`,
            zIndex: "1"
        }
        
    } 

    const areaStyle = { 
        width: '100%', 
        height: '100%', 
        backgroundColor: 'lightblue', 
        position: "relative",
        overflow: "hidden"
    }

    return(
        <div style={areaStyle} onDrop={drop} onDragOver={dragOver} ref={ref} onClick={onClick}>
            <VariableContext.Provider value={{variables, setVariables}}>
                {Object.keys(event.event) != 0 && Object.entries(event.event).map(([key, value]) => (
                    <span key={key} style={pos(value.bounds, key)}>
                        <value.action bounds={value.bounds} id={key} eventsId={eventsId}/>
                    </span>
                ))}
            </VariableContext.Provider>
        </div>
    );
}

export default EventDropArea;
