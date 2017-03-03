'use strict';

(function () {

	window.onload = function () {
		let deleteButton = document.querySelector('.btn-delete'),
		  	ul = document.querySelector("#options-list-myPolls"),
			  myPollsDataURL = window.location.origin + '/myPollsData',
			  deleteDataURL = window.location.origin + '/deleteData',
			  deleteMode = false;

		function updateMyPolls(data) {
			let polls = JSON.parse(data);
			let newLi;
			if (polls.length === 0) {
				newLi = document.createElement("li");
				newLi.className += "li-myPolls";
				newLi.innerHTML = "You don't have any polls"
			} else {
				for (let i = 0; i < polls.length; i++) {
					newLi = document.createElement("li");
					newLi.className += "li-myPolls";
					newLi.innerHTML = polls[i].pollName;
					newLi.onclick = function (e) {
						if (deleteMode == false) {
							window.location = window.location.origin + '/' + polls[i]._id;
						} else {
							while (ul.firstChild) {
								ul.removeChild(ul.firstChild);
							}
							ajaxFunctions.ajaxRequest('DELETE', deleteDataURL + '/' + polls[i]._id, function () {
								ajaxFunctions.ajaxRequest('GET', myPollsDataURL, function (result) {
									updateMyPolls(result);
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

		//getting data and updating my polls
		ajaxFunctions.ajaxRequest('GET', myPollsDataURL, updateMyPolls);

		function changingDeleteMode() {
			if (deleteMode === false) {
				let allLi = document.getElementsByClassName("li-myPolls");
				let garbageCanIcon;
				for (let i = 0; i < allLi.length; i++) {
					garbageCanIcon = document.createElement("i");
					garbageCanIcon.className = "fa fa-trash-o";
					garbageCanIcon.id = "i" + i;
					garbageCanIcon.ariaHidden = true;
					allLi[i].appendChild(garbageCanIcon);
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

		//changing delete mode - ON / OFF
		deleteButton.addEventListener('click', function (event) {
			changingDeleteMode();
		}, false);

	}
})();
