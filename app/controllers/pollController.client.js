'use strict';

(function () {
  window.onload = function () {
    let resultStr = document.getElementById("resultStr");
    let poll = JSON.parse(resultStr.textContent);
    let ctx = document.getElementById("myChart");

    let ul = document.querySelector("#options-list-myPolls"),
      li_elements = ul.getElementsByTagName("li"),
      voteAddedURL = window.location.origin + '/voteAdded';

    // drawing chart
    function drawChart(poll) {
      ctx.width = '400';
      ctx.height = '400';
      let myChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: poll.options,
          datasets: [{
            label: '# of Votes',
            data: poll.votes,
            backgroundColor:
            'rgba(0,75,84, 1)'
            ,
            borderColor:
            'rgba(0,75,84, 1)'
            ,
            borderWidth: 1
          }]
        },

        options: {
          scales: {
            xAxes: [{
              gridLines: {
                display: false
              }
            }],
            yAxes: [{
              ticks: {
                beginAtZero: true,
                stepSize: 5
              },
              gridLines: {
                display: false
              }
            }]
          },
          layout: {
            padding: 10
          },
          legend: {
            position: 'bottom',
            labels: {
              fontSize: 16
            }
          } 
        }
      });
      Chart.defaults.global.defaultFontSize = 16;
      Chart.defaults.global.maintainAspectRatio = false;
    }

    drawChart(poll);
    let newLi;
    if (poll.options.length === 0) {
      newLi = document.createElement("li");
      newLi.className += "li-myPolls";
      newLi.innerHTML = "There are no votes for this poll.";
    } else {
      for (let i = 0; i < poll.options.length; i++) {
        newLi = document.createElement("li");
        newLi.className += "li-myPolls";
        newLi.innerHTML = poll.options[i];
        newLi.onclick = function (e) {
          ajaxFunctions.ajaxRequest('GET', voteAddedURL + '/' + poll._id + '/' + i, function (result) {
            if (result != 'false') {
              drawChart(JSON.parse(result));
              console.log('Chart updated');
            } else {
              alert('You already voted!');
              console.log('User already voted.');
            }
          });
        }
        ul.appendChild(newLi);
      }
    }

  }
})();
