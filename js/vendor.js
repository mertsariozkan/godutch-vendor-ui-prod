$(document).ready(function() { 
    var token = window.localStorage.token;
    var name = window.localStorage.name;
    var surname = window.localStorage.surname;
    var userId = window.localStorage.userId;

    if(token == null || token == undefined || token == ""){
      window.location = window.location.origin + "/index.html";
    }

  $.ajax({
      type: "GET",
      url: "https://frozen-forest-81678.herokuapp.com/api/restaurant/" + userId,
      headers: { "Authorization": "Bearer " + window.localStorage.getItem("token") },
      contentType: "application/json",
      success: function(response) {
          window.localStorage.setItem("restaurantId", response["id"]);

          $("#user-info-box").html(name + " " + surname + "<br>" + response["name"]);
          $("#menu-link").click();
      },
      error: function(error) {
          console.log(error);
      }
  });

    $("#menu-toggle").click(function(e) {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
    })

    $("#category-button").mouseenter(function(){
        $(this).animate({ width: "+=140" }, 300, function() {
          $("#category-hover-text").fadeIn(300);
        });
    });

    $("#category-button").mouseleave(function(){
        $("#category-hover-text").fadeOut(100);
        $(this).animate({ width: "-=140" });
    });

    $("#menu-link").click(function(){
      $("#all-container").load('menu.html');
    });

    $("#table-link").click(function() {
      $("#all-container").load('table.html');
    })

    $("#waiters-link").click(function() {
      $("#all-container").load('waiters.html');
    })

    $("#logout-link").click(function() {
      $.confirm({
        title: 'Proceed?',
        content: 'If you say YES, you will be logged out.',
        buttons: {
            Yes: {
                action: function () {
                    window.localStorage.clear();
                    window.location = window.location.origin + "/index.html";
                },
                text: 'Yes',
                btnClass: 'btn-green',
            },
            No: {
                text: 'No',
                btnClass: 'btn-blue',
            },
        }
    });
    })
})