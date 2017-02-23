'use strict';

(function () {

  let profilePicture = document.querySelector('#profile-picture') || null;
  let name = document.querySelector('#display-name') || null;
  let email = document.querySelector('#profile-email') || null;
  let gender = document.querySelector('#profile-gender') || null;
  let profileId = document.querySelector('#profile-id') || null;



  let apiUrl = appUrl + '/api/:id';

  function updateHtmlElement(data, element, userProperty) {
    if (data[userProperty]) {
      element.innerHTML = data[userProperty];
    }
  }

  function updateImgElement(data, element, userProperty) {
    element.src = data[userProperty];
  }

  ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, function (data) {
    console.log("in userContoller, here is data from AJAX:", data);
    let userObject = JSON.parse(data);
    if (profilePicture !== null) {
      updateImgElement(userObject.profile, profilePicture, 'picture');
    }

    if (name !== null) {
      updateHtmlElement(userObject.profile, name, 'name');
    } 

    if (email !== null) {
      updateHtmlElement(userObject, email, 'email');
    }

    if (gender !== null) {
      updateHtmlElement(userObject.profile, gender, 'gender');
    }

    if (profileId !== null) {
      updateHtmlElement(userObject.profile, profileId, 'id');
    }

  }));
})();
