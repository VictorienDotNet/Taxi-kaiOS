import { useState, useEffect } from "react";

export const useNavigation = () => {
	useEffect(() => {
		setNavigation(0);
	}, []);

	const [current, setCurrent] = useState({ type: null, index: null });

	const getAllElements = () => document.querySelectorAll("[nav-selectable]");

	const getTheIndexOfTheSelectedElement = () => {
		const element = document.querySelector("[nav-selected=true]");
		return element ? parseInt(element.getAttribute("nav-index"), 10) : 0;
	};

	const setNavigation = (index) =>
		index === "ArrowLeft" || index === "ArrowRight"
			? onKeyDown(index)
			: selectElement(getAllElements()[index] || document.body);

	const onKeyDown = (key) => {
		if (key !== "ArrowLeft" && key !== "ArrowRight") return;

		const allElements = getAllElements();
		const currentIndex = getTheIndexOfTheSelectedElement();

		let setIndex;
		switch (key) {
			case "ArrowRight":
				const goToFirstElement = currentIndex + 1 > allElements.length - 1;
				setIndex = goToFirstElement ? 0 : currentIndex + 1;
				return selectElement(allElements[setIndex] || allElements[0], setIndex);
			case "ArrowLeft":
				const goToLastElement = currentIndex === 0;
				setIndex = goToLastElement ? allElements.length - 1 : currentIndex - 1;
				return selectElement(allElements[setIndex] || allElements[0], setIndex);
			default:
				break;
		}
	};

	const selectElement = (selectElement, setIndex = 0) => {
		if (selectElement) {
			[].forEach.call(getAllElements(), (element, index) => {
				const selectThisElement = element === selectElement;
				element.setAttribute("nav-selected", selectThisElement);
				element.setAttribute("nav-index", index);
				if (element.nodeName === "INPUT") {
					selectThisElement ? element.focus() : element.blur();
				}
			});
			setCurrent({ type: selectElement.tagName, index: setIndex });
		} else {
			setNavigation(0);
		}
	};

	return [current, setNavigation];
};
