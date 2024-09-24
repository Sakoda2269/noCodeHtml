"use client"
import styles from "./page.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState } from "react";

import ItemList from "./itemList";
import DraggingElementContext from "./contexts/draggingElementContext";
import ElementsContext from "./contexts/elementsContext";
import SelectingElementContext from "./contexts/selectingElementContext";
import DropArea from "./dropArea";
import PropertyArea from "./propertyArea";

export default function Home() {

  const [dragging, setDragging] = useState({});
  const [elements, setElements] = useState({});
  const [selecting, setSelecting] = useState({});
  
  return (
    <div>
      <DraggingElementContext.Provider value={{dragging, setDragging}}>
        <ElementsContext.Provider value={{elements, setElements}}>
          <SelectingElementContext.Provider value={{selecting, setSelecting}}>
            <div className={"row"} style={{height: "100vh"}}>
              <div className={`${styles.border} col-2`}>
                <ItemList />
              </div>
              <div className={`${styles.border} col-7`}>
                <DropArea />
              </div>
              <div className={`${styles.border} col-3`}>
                <PropertyArea />
              </div>
            </div>
          </SelectingElementContext.Provider>
        </ElementsContext.Provider>
      </DraggingElementContext.Provider>
    </div>
  );
}
