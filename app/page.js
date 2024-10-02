"use client"
import styles from "./page.module.css";
import React, { useContext, useEffect, useState } from "react";
import Link from "next/link";

import ItemList from "../components/itemList";
import DraggingElementContext from "../contexts/draggingElementContext";
import SelectingElementContext from "../contexts/selectingElementContext";
import DropArea from "../components/dropArea";
import PropertyArea from "../components/propertyArea";
import UndoContext from "../contexts/undoContext";


const BASE_URL = "http://localhost:8080/api"

export default function Home() {

	return (
		<div>
			<PlaceArea />
		</div>
	);
}

function PlaceArea() {

	const [dragging, setDragging] = useState({});
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
	
	const exportLayout =  async (event) => {
		let elems = [];
		for(const [key, value] of Object.entries(elements)) {
			let elem = {
				type: value.type,
				id: key,
				className: value.props.className,
				text: value.text,
				style: value.props.style,
				bounds: value.bounds
			};
			elems.push(elem);
		}
		let json = {elements: elems};
		const response = await fetch(`${BASE_URL}/layout_json`,{
			method: "POST",
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(json)
		}).then(response => {
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			return response.blob(); // レスポンスをテキストとして取得
		})
		.then(data => {
			const url = URL.createObjectURL(data);
        
			const a = document.createElement('a');
			a.href = url;
			a.download = 'output.model';
			document.body.appendChild(a);
			a.click();
			
			// クリーンアップ
			URL.revokeObjectURL(url);
			document.body.removeChild(a); // 取得した文字列を表示
		})
		
	}
	
	const preview = (event) => {
		let elems = [];
		for(const [key, value] of Object.entries(elements)) {
			let elem = {
				type: itemType.get(value.element),
				id: key,
				className: value.props.className,
				text: value.text,
				style: value.props.style,
				bounds: value.bounds
			};
			elems.push(elem);
		}
		let json = {elements: elems};
		fetch(`${BASE_URL}/preview`, {
			method:"POST",
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(json)
		})
		.then(response => response.text())
		.then(redirectUrl => {
			console.log(redirectUrl);
			window.open(redirectUrl, '_blank');
		})
		.catch(error => console.error('エラー:', error));
	}

	return (
		<div>
			<DraggingElementContext.Provider value={{ dragging, setDragging }}>
				<UndoContext.Provider value={{ undoStack, appendToStack }}>
					<SelectingElementContext.Provider value={{ selecting, setSelecting }}>
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
							<button onClick={exportLayout} id="export">export</button>
							<button onClick={preview} id="preview">preview</button>
							<Link href="/event-hub">
								<button id="event_page">event</button>
							</Link>
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
					</SelectingElementContext.Provider>
				</UndoContext.Provider>
			</DraggingElementContext.Provider>
		</div>
	);
}