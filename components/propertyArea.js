"use client"

import {useState, useRef, useEffect, useContext} from "react";
import {Tab, Tabs} from "react-bootstrap";
import SelectingElementContext from "../contexts/selectingElementContext";
import ElementsContext from "../contexts/elementsContext";
import UndoContext from "../contexts/undoContext";
import EventsContext from "@/contexts/eventsContext";

function PropertyArea() {
    const {selecting, setSelecting} = useContext(SelectingElementContext);
    const {elements, setElements} = useContext(ElementsContext);
    const {undoStack, appendToStack} = useContext(UndoContext);
    const {events, setEvents} = useContext(EventsContext);
    const [tabKey, setTabKey] = useState("general");
    const [general, setGeneral] = useState({});
    const [styles, setStyles] = useState({});
    const [bounds, setBounds] = useState({});
    const [eventSelects, setEventSelects] = useState({});

    useEffect(() => {
        if (elements[selecting]) {
            setGeneral({
                id: selecting,
                className: elements[selecting]["props"]["className"],
                text: elements[selecting]["text"]
            });
            setStyles(elements[selecting]["props"]["style"]);
            setBounds(elements[selecting]["bounds"]);
            setEventSelects(elements[selecting].events);
        } else {
            setGeneral({});
            setStyles({});
            setBounds({});
        }
    }, [selecting, elements])

    const onChangeTab = (k) => {
        setTabKey(k);
    }

    const onGeneralChange = (event) => {
        setGeneral({
            ...general,
            [event.target.id]: event.target.value
        });
        let propName = event.target.id;
        if(propName == "text") {
            setElements( elements => ({
                ...elements,
                [selecting]:{
                    ...elements[selecting],
                    text: event.target.value
                }
            }))
        } else if(propName == "className") {
            setElements(elements => ({
                ...elements,
                [selecting]: {
                    ...elements[selecting],
                    props:{
                        ...elements[selecting]["props"],
                        ["className"]: event.target.value
                    }
                }
            }))
        }
    }

    const onIdChange = (event) => {
        const {[selecting]: value, ...rest} = elements;
        setElements({
            ...rest,
            [event.target.value]: value
        });
        elements[selecting]["changeId"](event.target.value);
        setSelecting(event.target.value);
        appendToStack(
            {
                action: "idChange",
                id: event.target.value,
                prevId: selecting,
                nowId: event.target.value
            }
        );

    }

    const onStyleChange = (event) => {
        setStyles(styles => ({
            ...styles,
            [event.target.id]: event.target.value
        }));
        setElements({
            ...elements,
            [selecting]: {
                ...elements[selecting],
                ["props"]:{
                    ...elements[selecting]["props"],
                    ["style"]: {
                        ...elements[selecting]["props"]["style"],
                        [event.target.id]: event.target.value 
                    }
                }
            }
        })
    }

    const onBoundsChange = (event) => {
        setBounds({
            ...bounds,
            [event.target.id]: event.target.value
        });
        setElements({
            ...elements,
            [selecting]:{
                ...elements[selecting],
                ["bounds"]:{
                    ...elements[selecting]["bounds"],
                    [event.target.id]: event.target.value
                }
            }
        })
    }

    const deleteElem = (event) => {
        const {[selecting]: value, ...rect} = elements;
        setElements(rect);
        setSelecting("");
        appendToStack( 
            {
                action: "deleteElement",
                id: selecting,
                data: value
            }
        )
    }

    const addStyle = (event) => {
        
    }

    return(
        <div className="container">
            <Tabs id="property-select-tab" activeKey={tabKey} onSelect={(k) => onChangeTab(k)}>
                <Tab eventKey="general" title="一般">
                    {general ? (
                        <div>
                            {Object.entries(general).map(([key, value]) => (
                                <span key={key}>
                                    <label className="form-label">{key}</label>
                                    {key=="id" ? (
                                        <input type="text" id={key} className="form-control" value={value} onChange={onGeneralChange} onBlur={onIdChange}/>
                                    ) : (
                                        <input type="text" id={key} className="form-control" value={value} onChange={onGeneralChange}/>
                                    )}
                                    
                                    <p></p>
                                </span>
                            ))}
                            {selecting != "" ? (
                                <button className="btn btn-danger" onClick={deleteElem} style={{width: "100%"}}>削除</button>
                            ) : (
                                <></>
                            )}
                        </div>
                        ) : (<></>)}
                </Tab>
                <Tab eventKey="bounds" title="配置">
                    {bounds ? (
                        <div>
                            {Object.entries(bounds).map(([key, value]) => (
                                <span key={key}>
                                    <label className="form-label">{key}</label>
                                    <input type="text" id={key} className="form-control" value={value} onChange={onBoundsChange}/>
                                </span>
                            ))}
                        </div>
                    ) : (<>a</>)}
                </Tab>
                <Tab eventKey="style" title="スタイル">
                    {styles ? (
                        <div>
                            {Object.entries(styles).map(([key, value]) => (
                                <span key={key}>
                                    <label className="form-label">{key}</label>
                                    <input type="text" id={key} className="form-control" value={value} onChange={onStyleChange}/>
                                </span>
                            ))}
                        </div>
                    ) : (<></>)}
                </Tab>
                <Tab eventKey="event" title="イベント">
                    {elements[selecting] ? (
                        <div>
                            {Object.keys(elements[selecting].events).map((key) => (
                                <div key={key}>
                                    <label className="form-label">{key}</label>
                                    <select>
                                        <option value="">Select...</option>
                                        {Object.keys(events).map((ekey) => (
                                            <option value={ekey} key={ekey}>{events[ekey].title}</option>
                                        ))}
                                    </select>
                                </div>
                            ))}
                        </div>
                    ) : (<></>)}
                </Tab>
            </Tabs>
        </div>
    )
}

export default PropertyArea;

