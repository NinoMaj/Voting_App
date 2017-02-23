'use strict';

(function () {

	let addOption = document.querySelector(".btn-add-option"),
		  deleteButton = document.querySelector('.btn-delete'),
		  ul = document.querySelector("#options-list");

	// add option
	addOption.addEventListener('click', function () {
		let li = document.createElement("li"),
			  input = document.createElement("input"),
				optionNumber = ul.getElementsByTagName("li").length + 1,
			  optionName = "option" + optionNumber;
		li.className += "li-option";
		input.type = "text";
		input.name = optionName;
		input.placeholder = "...";
		li.appendChild(input);
		ul.appendChild(li);
	}, false);

	// delete option
	deleteButton.addEventListener('click', function () {
		let optionNumber = ul.getElementsByTagName("li").length,
				li = ul.getElementsByTagName("li")[optionNumber - 1];
		if (optionNumber > 2) {
			ul.removeChild(li);
		} else {
			alert("You need at least 2 options.");
		}		
	}, false);

})();
