'use strict';

(function () {

	let addOption = document.querySelector('.btn-add-option'),
		pollName = document.querySelector('.pollName'),
		btnSubmit = document.querySelector('.btnSubmit'),
		deleteButton = document.querySelector('.btn-delete'),
		optionsList = document.querySelector('.options-list'),
		apiUrl = appUrl + '/api/:id/pollSubmitted';

	function updatePolls(data) {
		let pollsObject = JSON.parse(data);
		pollName.value = pollsObject.polls.pollName;
	}

	ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, updatePolls));

	btnSubmit.addEventListener('click', function () {
		ajaxFunctions.ajaxRequest('POST', apiUrl, function () {
			ajaxFunctions.ajaxRequest('GET', apiUrl, updatePolls);
		});
	}, false);

	addOption.addEventListener('click', function () {
		let li = document.createElement("li"),
			  input = document.createElement("input"),
			  ul = document.getElementById("options-list"),
			  optionNumber = ul.getElementsByTagName("li").length + 1,
			  optionName = "option" + optionNumber;
		li.className += "li-option";
		input.type = "text";
		input.name = optionName;
		input.placeholder = "...";
		li.appendChild(input);
		ul.appendChild(li);
	}, false);

	deleteButton.addEventListener('click', function () {
		let ul = document.getElementById("options-list"),
			  optionNumber = ul.getElementsByTagName("li").length,
				li = ul.getElementsByTagName("li")[optionNumber - 1];
		if (optionNumber > 2) {
			ul.removeChild(li);
		} else {
			alert("You need at least 2 options.");
		}		
	}, false);

	// deleteButton.addEventListener('click', function () {

	//   ajaxFunctions.ajaxRequest('DELETE', apiUrl, function () {
	//     ajaxFunctions.ajaxRequest('GET', apiUrl, updateClickCount);
	//   });

	// }, false);

})();
