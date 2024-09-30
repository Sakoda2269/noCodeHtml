"use client"
import styles from "./page.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";

import ItemList from "../components/itemList";
import DraggingElementContext from "../contexts/draggingElementContext";
import ElementsContext from "../contexts/elementsContext";
import SelectingElementContext from "../contexts/selectingElementContext";
import DropArea from "../components/dropArea";
import PropertyArea from "../components/propertyArea";
import UndoContext from "../contexts/undoContext";

export default function Home() {


	return (
		<div>
			<PlaceArea />
		</div>
	);
}

function PlaceArea() {

	const [dragging, setDragging] = useState({});
	const [elements, setElements] = useState({});
	const [selecting, setSelecting] = useState("");
	const [undoStack, setUndoStack] = useState([]);

	const [redoData, setRedoData] = useState({});

	const [canRedo, setCanRedo] = useState(-1);

	useEffect(() => {
		const shortcut = (event) => {
			if (event.ctrlKey && event.key == "z") {
				event.preventDefault();
				document.getElementById("undo").click();
			}
			if (event.ctrlKey && event.key == "y") {
				event.preventDefault();
				document.getElementById("redo").click();
			}
		}
		window.addEventListener("keydown", shortcut);

		return () => {
			window.removeEventListener("keydown", shortcut);
		}

	}, [])


	const undo = (event) => {
		if (undoStack.length > 0) {
			let actionData = undoStack[undoStack.length - 1];
			setUndoStack(undoStack.slice(0, -1));
			setRedoData(actionData);
			setCanRedo(undoStack.length - 1);
			let action = actionData.action;
			if (action == "posChange") {
				let id = actionData.id;
				let prev = actionData.prevPos;
				setElements({
					...elements,
					[id]: {
						...elements[id],
						["bounds"]: {
							...elements[id]["bounds"],
							["left"]: `${prev.x}px`,
							["top"]: `${prev.y}px`
						}
					}
				});
			}
			else if (action == "sizeChange") {
				let id = actionData.id;
				let prev = actionData.prevBounds;
				setElements({
					...elements,
					[id]: {
						...elements[id],
						["bounds"]: {
							["left"]: `${prev.x}px`,
							["top"]: `${prev.y}px`,
							["width"]: `${prev.w}px`,
							["height"]: `${prev.h}px`
						}
					}
				});
			}
			else if(action == "addElement") {
				let id = actionData.id;
				let {[id]: value, ...rect} = elements;
				setElements(rect);
				setSelecting("");
			}
			else if(action == "idChange") {
				let prevId = actionData.prevId;
				let nowId = actionData.nowId;
				const {[nowId]: value, ...rest} = elements;
				setElements({
					...rest,
					[prevId]: value
				});
				elements[nowId]["changeId"](prevId);
        		setSelecting(prevId);
			}
			else if(action == "deleteElement") {
				let id = actionData.id;
				setSelecting(id);
				setElements({
					...elements, 
					[id]: actionData.data
				});
			}
		}
	}

	const redo = (event) => {
		let actionData = redoData;
		let action = actionData.action;
		setUndoStack([...undoStack, actionData]);
		if (action == "posChange") {
			let id = actionData.id;
			let now = actionData.nowPos;
			setElements({
				...elements,
				[id]: {
					...elements[id],
					["bounds"]: {
						...elements[id]["bounds"],
						["left"]: `${now.x}px`,
						["top"]: `${now.y}px`
					}
				}
			});
		}
		else if (action == "sizeChange") {
			let id = actionData.id;
			let now = actionData.nowBounds;
			setElements({
				...elements,
				[id]: {
					...elements[id],
					["bounds"]: {
						["left"]: `${now.x}px`,
						["top"]: `${now.y}px`,
						["width"]: `${now.w}px`,
						["height"]: `${now.h}px`
					}
				}
			});
		}
		else if(action == "addElement") {
			let id = actionData.id;
			setElements(
				{
					...elements,
					[id]:actionData.data
				}
			)
			setSelecting(id);
		}
		else if(action == "idChange") {
			let prevId = actionData.prevId;
			let nowId = actionData.nowId;
			const {[prevId]: value, ...rest} = elements;
			setElements({
				...rest,
				[nowId]: value
			});
			elements[prevId]["changeId"](nowId);
			setSelecting(nowId);
		}
		else if(action == "deleteElement") {
			let id = actionData.id;
			const {[id]: value, ...rect} = elements;
			setElements(rect);
			setSelecting("");
		}
	}

	const appendToStack = (item) => {
		let tmp;
		if(undoStack.length > 100) {
			tmp = undoStack.slice(1, -1);
		} else {
			tmp = undoStack;
		}
		setUndoStack([
			...tmp,
			item
		])
		
	}

	return (
		<div>
			<DraggingElementContext.Provider value={{ dragging, setDragging }}>
				<ElementsContext.Provider value={{ elements, setElements }}>
					<SelectingElementContext.Provider value={{ selecting, setSelecting }}>
						<UndoContext.Provider value={{ undoStack, appendToStack }}>
							<div className={styles.menuBar}>
								{undoStack.length == 0 ? (
									<button onClick={undo} disabled>undo</button>
								) : (
									<button onClick={undo} id="undo">undo</button>
								)}
								
								{canRedo == undoStack.length ? (
									<button onClick={redo} id="redo">redo</button>
								) : (
									<button onClick={redo} disabled>redo</button>
								)}
							</div>
							<div className={"row"} style={{ height: "100vh" }}>
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
						</UndoContext.Provider>
					</SelectingElementContext.Provider>
				</ElementsContext.Provider>
			</DraggingElementContext.Provider>
		</div>
	);
}