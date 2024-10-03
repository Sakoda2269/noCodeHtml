"use client"
import styles from "@/app/page.module.css";
import EventsContext from "@/contexts/eventsContext";
import PageContext from "@/contexts/pageContext";
import Link from "next/link";
import { useContext, useState } from "react";
import styless from "./page.module.css";

function EventPage() {

    const {events, setEvents} = useContext(EventsContext);

    const [isOpen, setIsOpen] = useState(false);
    const [eventName, setEventName] = useState("");

    const openPopup = () => {
        setIsOpen(true);
    };

    const closePopup = () => {
        setIsOpen(false);
    };

    const onTitleChange = (event) => {
        setEventName(event.target.value);
    }

    const createEvent = (event) => {
        let uuid = self.crypto.randomUUID();
        setEvents({
            ...events,
            [uuid]: {
                title: eventName,
                variables: [],
                event: {
                },
            }
        });
        setIsOpen(false);
    }
    
    const gridStyle = {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
        gridGap: "10px",
        padding: "10px"
    }

    return (
        <div>
            <div className={styles.menuBar}>
                <Link href="/">
                    <button id="event_page">design</button>
                </Link>
            </div>
            <div style={gridStyle}>
                <button className="btn btn-secondary" onClick={openPopup}><p></p>新規作成<p></p></button>
                {Object.entries(events).map(([id, value]) => (
                    <Link href={`/event/${id}`} key={id} >
                        <button className="btn" style={{border: "1px solid black", width: "100%", height:"100%"}}>{value.title}</button>
                    </Link>
                ))}
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>

            <div>
                {isOpen && (
                    <div className={styless.popup}>
                        <div className={styless.popupContent}>
                            <label className="form-label">イベント名</label><br />
                            <input type="text" className="form-control" style={{width: "80%"}} onChange={onTitleChange}/><br />
                            {eventName=="" ? (<p style={{color: "red"}}>一文字以上入力してください</p>) : (<></>)}
                            <button className="btn btn-secondary" onClick={closePopup}>キャンセル</button>
                            {eventName=="" ? (
                                <button className="btn btn-primary" style={{marginLeft: "20px"}} onClick={createEvent} disabled>新規作成</button>
                            ) : (
                                <button className="btn btn-primary" style={{marginLeft: "20px"}} onClick={createEvent}>新規作成</button>
                            )}
                            
                        </div>
                    </div>
                )}
            </div>

        </div>
    )
}

export default EventPage;