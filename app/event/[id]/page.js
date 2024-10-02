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
 
    return(
        <div>
            <EventSelectingContext.Provider value={{selecting, setSelecting}}>
                <EventDraggingContext.Provider value={{dragging, setDragging}}>
                    <EventContext.Provider value={{event, setEvent}}>
                        <EventMouseOverContext.Provider value={{mouseOver, setMouseOver}}>
                            <div className="row" style={{ height: "100vh" }}>
                                <div className={`col-2 ${styles.border}`}>
                                    <EventList eventsId={params.id}/>
                                </div>
                                <div className={`col-10 ${styles.border}`}>
                                    <EventDropArea eventsId={params.id}/>
                                </div>

                            </div>
                        </EventMouseOverContext.Provider>
                    </EventContext.Provider>
                </EventDraggingContext.Provider>
            </EventSelectingContext.Provider>
        </div>
    )
}

export default EventPage;

