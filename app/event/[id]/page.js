"use client"
import EventsContext from "@/contexts/eventsContext";
import { useState, useContext } from "react";
import styles from "./page.module.css"
import EventList from "@/components/event/eventList";
import EventDropArea from "@/components/event/eventDropArea";
import EventSelectingContext from "@/contexts/event/eventSelectingContext";
import EventDraggingContext from "@/contexts/event/eventDraggingContext";
import EventContext from "@/contexts/event/eventContext";
import EventMouseOverContext from "@/contexts/event/EventMouseOverContext";
import EventArrowDraggingContext from "@/contexts/event/eventArrowDraggingContext";
import Link from "next/link";
import styless from "@/app/page.module.css";

function EventPage({params}) {
    const {events, setEvents} = useContext(EventsContext);

    const [selecting, setSelecting] = useState("");
    const [dragging, setDragging] = useState({});
    const [event, setEvent] = useState({
        id: params.id,
        variables: [],
        event: {
        },
    });
    const [mouseOver, setMouseOver] = useState("");
    const [arrowDragging, setArrowDragging] = useState("");
 
    return(
        <div>
            <EventSelectingContext.Provider value={{selecting, setSelecting}}>
                <EventDraggingContext.Provider value={{dragging, setDragging}}>
                    <EventContext.Provider value={{event, setEvent}}>
                        <EventMouseOverContext.Provider value={{mouseOver, setMouseOver}}>
                            <EventArrowDraggingContext.Provider value={{arrowDragging, setArrowDragging}}>
                            <div className={styless.menuBar}>
                                <Link href="/event-hub">
                                    <button id="event_page">event hub</button>
                                </Link>
                                    <button id="save">save</button>
                            </div>
                                <div className="row" style={{ height: "100vh" }}>
                                    <div className={`col-2 ${styles.border}`}>
                                        <EventList eventsId={params.id}/>
                                    </div>
                                    <div className={`col-10 ${styles.border}`}>
                                        <EventDropArea eventsId={params.id}/>
                                    </div>
                                </div>
                            </EventArrowDraggingContext.Provider>
                        </EventMouseOverContext.Provider>
                    </EventContext.Provider>
                </EventDraggingContext.Provider>
            </EventSelectingContext.Provider>
        </div>
    )
}

export default EventPage;

