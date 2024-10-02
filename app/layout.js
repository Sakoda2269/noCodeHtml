"use client"
import localFont from "next/font/local";
import "./globals.css";
import "bootstrap/dist/css/bootstrap.min.css";

import React, { useState } from "react";

import PageContext from "@/contexts/pageContext";
import ElementsContext from "../contexts/elementsContext";
import EventsContext from "@/contexts/eventsContext";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({ children }) {

  const [elements, setElements] = useState({});
	const [events, setEvents] = useState({});

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
				<ElementsContext.Provider value={{ elements, setElements }}>
					<EventsContext.Provider value={{events, setEvents}}>
            {children}
          </EventsContext.Provider>
				</ElementsContext.Provider>
      </body>
    </html>
  );
}
