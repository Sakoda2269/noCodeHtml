import ElementsContext from "@/contexts/elementsContext";
import EventContext from "@/contexts/event/eventContext";
import EventDraggingContext from "@/contexts/event/eventDraggingContext";
import EventSelectingContext from "@/contexts/event/eventSelectingContext";
import VariableContext from "@/contexts/event/variableContext";
import EventsContext from "@/contexts/eventsContext";
import { useContext, useEffect, useRef, useState } from "react";
import Arrow from "../arrow";
import EventMouseOverContext from "@/contexts/event/EventMouseOverContext";


function EventList({eventsId}) {
    return(
        <div style={{display: "flex", justifyContent: "center"}}>
            <div className="row" style={{ width: '50%', margin: '0 auto'}}>
                <StartItem />
                <p></p>
                <GetItem />
                <p></p>
                <SetItem />
            </div>
        </div>
    );
}

function Base({children, id_in, selector_in, confirm}) {

    const {selecting, setSelecting} = useContext(EventSelectingContext);
    const {event, setEvent} = useContext(EventContext);
    const {mouseOver, setMouseOver} = useContext(EventMouseOverContext);
    const [id, setId] = useState(id_in);
    const [mousePos, setMousePos] = useState({x: 0, y: 0});
    const [selectNum, setSelectNum] = useState(0);
    const [isArrowDragStarted, setIsArrowDragStarted] = useState(false);
    const [arrowEndPos, setArrowEndPos] = useState({x: 0, y: 0});

    const ref = useRef(null)
    const ref2 = useRef(null);

    useEffect(() => {
        if(ref.current && ref2.current) {
            let rect = ref.current.getBoundingClientRect();
            let rect2 = ref2.current.getBoundingClientRect();
            if(event.event[id].parent != "") {
                let parent = event.event[id].parent;
                let parentx = (event.event[parent].bounds.left - (event.event[id].bounds.left + (rect.left - rect2.left)));
                let parenty = event.event[parent].bounds.top - (event.event[id].bounds.top + (rect.top - rect2.top));
                setArrowEndPos({x: parentx, y: parenty})
            }
        }
        if(id == selecting){
            setSelectNum(1);
        }else{
            if(selectNum == 1){
                setSelectNum(0);
                if(confirm){
                    confirm();
                }
            }
        }
    }, [selecting, event])

    const onClick = (e) => {
        e.stopPropagation();
        setSelecting(id);
    }

    const dragStart = (e) => {
        setMousePos({
            x: e.pageX,
            y: e.pageY
        });
    }

    const dragEnd = (e) => {
        let x = event.event[id].bounds.left;
        let y = event.event[id].bounds.top;
        let dx = e.pageX - mousePos.x;
        let dy = e.pageY - mousePos.y;

        setEvent({
            ...event,
            ["event"]: {
                ...event.event,
                [id]: {
                    ...event.event[id],
                    ["bounds"]:{
                        left: x + dx,
                        top: y + dy
                    }
                }
            }
        })
    }

    const circle = {
        backgroundColor: "blue",
        borderRadius: "50%",
        marginLeft: `calc(50% - 8px)`,
        marginTop: "-8px",
        width: "16px",
        height: "16px",
        position: "relative",
    }

    const onMouseOver = (e) => {
        setMouseOver(id);
    }

    const arrowDragStart = (e) => {
        e.dataTransfer.setData("text/plain", "aaa");
        setIsArrowDragStarted(true)
        setMousePos({
            x: e.pageX,
            y: e.pageY
        })
    }

    const arrowDragging = (e) => {
        let dx = e.pageX - mousePos.x;
        let dy = e.pageY - mousePos.y;
        setArrowEndPos({x: dx, y: dy});
    }
    
    const arrowDragEnd = (e) => {
        if(mouseOver != id) {
            if(event.event[mouseOver]) {
                setEvent({
                    ...event,
                    ["event"]:{
                        ...event.event,
                        [id]: {
                            ...event.event[id],
                            ["parent"]: mouseOver
                        }
                    }
                })
            }
        } else {
            setArrowEndPos({x: 0, y: 0})
        }
    }


    return(
        <div>
            <div style={{border: `${{true: 3, false: 1}[selecting == id]}px solid black`, textAlign: "center", backgroundColor: "yellow"}}
                onClick={onClick} onDragStart={dragStart} onDragEnd={dragEnd} draggable="true" onMouseOver={onMouseOver} ref={ref2}
            >
                <h3 style={{paddingLeft: "10px", paddingRight: "10px"}}>{children}</h3>
                {selecting == id && (
                <div>
                    {selector_in}
                </div>
                )}
            </div>
            <div style={circle} onDragStart={arrowDragStart} onDrag={arrowDragging} onDragEnd={arrowDragEnd} draggable="true" ref={ref}>
                {isArrowDragStarted && <Arrow start={{x: 0, y: 0}} end={{x: 8 + arrowEndPos.x, y: 8 + arrowEndPos.y}} />}
            </div>
        </div>
    )
}

function Start({id}) {
    return (
        <Base id_in={id}>
            start
        </Base>
    )
}

const valueMap = {
    textInput:["value"],
    label: ["text"],
    button: ["text"],
    "": []
}

function Get({id}) {

    const {elements, setElements} = useContext(ElementsContext);
    const {variables, setVariables} = useContext(VariableContext);
    const {selecting, setSelecting} = useContext(EventSelectingContext);
    const {event, setEvent} = useContext(EventContext);

    const [selectId, setSelectId] = useState("");
    const [variable, setVariable] = useState("");
    const [selectType, setSelectType] = useState("");

    const idChange = (e) => {
        e.stopPropagation();
        setSelectId(e.target.value);
    }

    const variableChange = (e) => {
        e.stopPropagation();
        setVariable(e.target.value);
    }

    const typeChange = (e) => {
        e.stopPropagation();
        setSelectType(e.target.value);
    }

    const confirm = (e) => {
        if(e){
            e.stopPropagation();
        }
        if(validCheck()) {
            let isExist = false;
            let variables = event.variables;
            for(let v of variables){
                if(variable == v) {
                    isExist = true;
                    break;
                }
            }
            if(isExist == false){
                variables.push(variable);
                setEvent({
                    ...event,
                    ["variables"]: variables
                })
            }
            let selector = [selectId, selectType, variable];
            setEvent({
                ...event,
                ["event"]:{
                    ...event.event,
                    [id]:{
                        ...event.event[id],
                        selector: selector
                    }
                }
            })
            if(selecting == id) { 
                setSelecting("");
            }
        }
    }

    const getType = (elementId) => {
        if(elements[elementId]) {
            return elements[elementId].type
        }
        return "";
    }

    const validCheck = () => {
        return selectId!="" && selectType!="" && variable != "";
    }

    const selector = (<div style={{padding: "5px"}}>
        <p>id<select onChange={idChange} value={selectId}>
                <option value="">Select...</option>
                {Object.keys(elements).map((id) => (
                    <option key={id} value={id}>{id}</option>
                ))}
            </select>
        </p>
        <p>の
        <select onChange={typeChange} value={selectType}>
            <option value="">Select...</option>
            {valueMap[getType(selectId)].map((id) => (
                <option key={id} value={id}>{id}</option>
            ))}
        </select>
        を変数<input type="text" style={{width: "20%"}} onChange={variableChange} value={variable}/>に保存</p>
        {validCheck() ? (
            <button className="btn btn-primary" onClick={confirm}>決定</button>
        ) : (
            <button className="btn btn-primary" disabled>決定</button>
        )}
        
    </div>)
    return (
        <Base id_in={id} selector_in={selector} confirm={confirm}>
            get
        </Base>
    )
}

function Set({id}) {

    const {event, setEvent} = useContext(EventContext);
    const {elements, setElements} = useContext(ElementsContext);
    const {selecting, setSelecting} = useContext(EventSelectingContext);

    const [variable, setVariable] = useState("");
    const [selectId, setSelectId] = useState("");
    const [selectType, setSelectType] = useState("");

    const idChange = (e) => {
        e.stopPropagation();
        setSelectId(e.target.value);
    }

    const variableChange = (e) => {
        e.stopPropagation();
        setVariable(e.target.value);
    }

    const typeChange = (e) => {
        e.stopPropagation();
        setSelectType(e.target.value);
    }

    const getType = (elementId) => {
        if(elements[elementId]) {
            return elements[elementId].type
        }
        return "";
    }

    const confirm = (e) => {
        if(e) {
            e.stopPropagation();
        }
        if(validCheck()) {
            let selector = [selectId, selectType, variable];
            setEvent({
                ...event,
                ["event"]:{
                    ...event.event,
                    [id]:{
                        ...event.event[id],
                        selector: selector
                    }
                }
            })
            if(selecting == id) { 
                setSelecting("");
            }
        }
    }

    const validCheck = () => {
        return selectId!="" && selectType!="" && variable != "";
    }

    const selector = (
        <div style={{padding: "5px"}}>
            <p>変数<select value={variable} onChange={variableChange}>
                <option value="">Select...</option>
                {event.variables.map((v) => (
                    <option key={v} value={v}>{v}</option>
                ))}
            </select>の値を</p>
            <p>id<select value={selectId} onChange={idChange}>
                <option value="">Select...</option>
                {Object.keys(elements).map((id) => (
                    <option key={id} value={id}>{id}</option>
                ))}
            </select>の</p>
            <p><select value={selectType} onChange={typeChange}>
                <option value="">Select...</option>
                {valueMap[getType(selectId)].map((id) => (
                    <option key={id} value={id}>{id}</option>
                ))}
            </select>にセット</p>
            {validCheck() ? (
                <button className="btn btn-primary" onClick={confirm}>決定</button>
            ) : (
                <button className="btn btn-primary" disabled>決定</button>
            )}
        </div>
    )

    return (
        <Base id_in={id} selector_in={selector}>
            set
        </Base>
    )
}

function BaseItem({eventItem, text}) {

    const {dragging, setDragging} = useContext(EventDraggingContext);
    const [bound, setBound] = useState({width: 0, height: 0, left: 0, top: 0});
    const ref = useRef(null);

    useEffect(() => {
        if (ref.current) {
            const rect = ref.current.getBoundingClientRect();
            setBound({width: rect.width, height: rect.height, left: rect.left, top: rect.top});
        }
    }, [])

    const onDragStart = (event) => {
        let id = self.crypto.randomUUID();
        let mouseX = event.pageX - bound.left;
        let mouseY = event.pageY - bound.top;
        let bounds = {
            top: mouseY,
            left: mouseX,
        }
        setDragging({
            id: id,
            event: eventItem,
            bounds: bounds
        });
    }

    return(
        <div style={{border: "1px solid black"}} draggable="true" ref={ref} onDragStart={onDragStart}>
            <h6>{text}</h6>
            <p></p>
        </div>
    )
}

function StartItem() {
    return(
        <BaseItem eventItem={Start} text="start"/>
    )
}

function GetItem() {
    return(
        <BaseItem eventItem={Get} text="get" />
    )
}

function SetItem() {
    return(
        <BaseItem eventItem={Set} text="set" />
    )
}

export default EventList;