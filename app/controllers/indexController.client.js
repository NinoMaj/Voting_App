'use strict';

(function () {

	let addOption = document.querySelector(".btn-add-option"),
		pollName = document.querySelector('.pollName'),
		btnSubmit = document.querySelector('.btnSubmit'),
		deleteButton = document.querySelector('.btn-delete'),
		ulIndex = document.querySelector("#options-list"),
		myPolls = document.querySelector(".my-polls");

	addOption.addEventListener('click', function () {
		let li = document.createElement("li"),
			  input = document.createElement("input"),
				optionNumber = ulIndex.getElementsByTagName("li").length + 1,
			  optionName = "option" + optionNumber;
		li.className += "li-option";
		input.type = "text";
		input.name = optionName;
		input.placeholder = "...";
		li.appendChild(input);
		ulIndex.appendChild(li);
	}, false);

	deleteButton.addEventListener('click', function () {
		let optionNumber = ulIndex.getElementsByTagName("li").length,
				li = ulIndex.getElementsByTagName("li")[optionNumber - 1];
		if (optionNumber > 2) {
			ulIndex.removeChild(li);
		} else {
			alert("You need at least 2 options.");
		}		
	}, false);

})();
