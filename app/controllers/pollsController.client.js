'use strict';

(function () {

	window.onload = function () {
		let addOption = document.querySelector(".btn-add-option"),
			pollName = document.querySelector('.pollName'),
			btnSubmit = document.querySelector('.btnSubmit'),
			deleteButton = document.querySelector('.btn-delete'),
			ul = document.querySelector("#options-list-myPolls"),
			// a_elem = document.querySelector(".a-myPolls"),
			li_elements = ul.getElementsByTagName("li"),
			myPollsDataURL = window.location.origin + '/myPollsData',
			deleteDataURL = window.location.origin + '/delteData',
			deleteMode = false;

		function updatePolls(data) {
			console.log('data before parse', data);
			let polls = JSON.parse(data);
			// console.log('data after parse', JSONdata);
			if (polls.length === 0) {
				li_elements.innerHTML = "You don't have any polls";
			} else {
				// 	a_elem.href = window.location.origin + "/polls/" + JSONdata.polls[0].pollName;
				// li_elements[0].innerHTML = JSONdata.polls[0].pollName;
				// li_elements[0].onclick = function (e) {
				// 	window.location = window.location.origin + '/polls/' + JSONdata.polls[0].pollName;
				// }
				let newLi;
				// let newA;
				for (let i = 0; i < polls.length; i++) {
					// newA = document.createElement("a");
					// newA.href = window.location.origin + "/polls/" + JSONdata.polls[i].pollName;
					// newA.className += "a-myPolls";
					newLi = document.createElement("li");
					newLi.className += "li-myPolls";
					newLi.innerHTML = polls[i].pollName;
					newLi.onclick = function (e) {
						if (deleteMode == false) {
							window.location = window.location.origin + '/polls/' + polls[i].pollName;
						} else {
							console.log("Delete");
							while (ul.firstChild) {
								ul.removeChild(ul.firstChild);
							}
							ajaxFunctions.ajaxRequest('DELETE', deleteDataURL + '/' + polls[i].pollName, function () {
								ajaxFunctions.ajaxRequest('GET', myPollsDataURL, function (result) {
									updatePolls(result);
									deleteMode = false;
									changingDeleteMode();
								});
							});
						}
					}
					ul.appendChild(newLi);
				}
			}
		}
		ajaxFunctions.ajaxRequest('GET', myPollsDataURL, updatePolls);

		function changingDeleteMode() {
			if (deleteMode === false) {
				let allLi = document.getElementsByClassName("li-myPolls");
				// ls
				let garbageCanIcon;
				for (let i = 0; i < allLi.length; i++) {
					garbageCanIcon = document.createElement("i");
					garbageCanIcon.className = "fa fa-trash-o";
					garbageCanIcon.id = "i" + i;
					garbageCanIcon.ariaHidden = true;
					allLi[i].appendChild(garbageCanIcon);
					// garbageCanIcon.addEventListener('click', function(e) {
					// 	e.parentNode.parentNode.removeChild(e.parentNode);
					// })
				}
				let allI = document.getElementsByClassName("fa-trash-o");
				deleteMode = true;
				deleteButton.innerHTML = "VIEW MODE";
			} else {
				function removeElements(className) {
					var list = document.getElementsByClassName(className);
					for (var i = list.length - 1; 0 <= i; i--) {
						if (list[i] && list[i].parentElement) {
							list[i].parentElement.removeChild(list[i]);
						}
					}
				}
				removeElements("fa-trash-o");
				deleteMode = false;
				deleteButton.innerHTML = "DELETE MODE";
			}
		}

		deleteButton.addEventListener('click', function (event) {
			changingDeleteMode();
		}, false);

		// btnSubmit.addEventListener('click', function () {
		// 	ajaxFunctions.ajaxRequest('POST', apiUrl, function () {
		// 		console.log("Poll submitted");
		// 	});
		// }, false);

		// addOption.addEventListener('click', function () {
		// 	console.log('sam tu');
		// 	let li = document.createElement("li"),
		// 		  input = document.createElement("input"),
		// 			optionNumber = ulIndex.getElementsByTagName("li").length + 1,
		// 		  optionName = "option" + optionNumber;
		// 	li.className += "li-option";
		// 	input.type = "text";
		// 	input.name = optionName;
		// 	input.placeholder = "...";
		// 	li.appendChild(input);
		// 	ulIndex.appendChild(li);
		// }, false);

		// deleteButton.addEventListener('click', function () {

		//   ajaxFunctions.ajaxRequest('DELETE', apiUrl, function () {
		//     ajaxFunctions.ajaxRequest('GET', apiUrl, updateClickCount);
		//   });

		// }, false);
	}
})();
