'use strict';

(function () {

	window.onload = function () {
		let ul = document.querySelector("#options-list-myPolls"),
			  allPollsDataURL = window.location.origin + '/AllPollsData';

		function updateAllPolls(data) {
			let polls = JSON.parse(data);
			let newLi;
			if (polls.length === 0) {
				newLi = document.createElement("li");
				newLi.className += "li-myPolls";
				newLi.innerHTML = "There are no polls created";
			} else {
				for (let i = 0; i < polls.length; i++) {
					newLi = document.createElement("li");
					newLi.className += "li-myPolls";
					newLi.innerHTML = polls[i].pollName;
					newLi.onclick = function (e) {
						window.location = window.location.origin + '/' + polls[i]._id;
					}
					ul.appendChild(newLi);
				}
			}
		}
		
		//getting data and updating all polls
		ajaxFunctions.ajaxRequest('GET', allPollsDataURL, updateAllPolls);

	}
})();
