$(document).ready(function () {

//map.js

//Set up some of our variables.
var map; //Will contain map object.
var marker = false; ////Has the user plotted their location marker? 
        
//Function called to initialize / create the map.
//This is called when the page has loaded.
function initMap() {

    //The center location of our map.
    var centerOfMap = new google.maps.LatLng(38.4581186,27.195756);

    //Map options.
    var options = {
      center: centerOfMap, //Set center.
      zoom: 12 //The zoom value.
    };

    //Create the map object.
    map = new google.maps.Map(document.getElementById('map'), options);

    //Listen for any clicks on the map.
    google.maps.event.addListener(map, 'click', function(event) {                
        //Get the location that the user clicked.
        var clickedLocation = event.latLng;
        //If the marker hasn't been added.
        if(marker === false){
            //Create the marker.
            marker = new google.maps.Marker({
                position: clickedLocation,
                map: map,
                draggable: true //make it draggable
            });
            //Listen for drag events!
            google.maps.event.addListener(marker, 'dragend', function(event){
                markerLocation();
            });
        } else{
            //Marker has already been added, so just change its location.
            marker.setPosition(clickedLocation);
        }
        debugger;
        console.log(marker.getPosition());
    });
}

initMap();
        
//This function will get the marker's current location and then add the lat/long
//values to our textfields so that we can save the location.
function markerLocation(){
    //Get location.
    var currentLocation = marker.getPosition();
    //Add lat and lng values to a field that we can save.
    document.getElementById('lat').value = currentLocation.lat(); //latitude
    document.getElementById('lng').value = currentLocation.lng(); //longitude
}


    var isMatch = false;
    //#region functions 
    var isAuthenticated = function () {
        var token = window.localStorage.getItem("token");
        console.log(token);
        if (token !== null && token !== undefined) {
            window.location = window.location.origin + "/views/vendor.html";
        }
    }

    var isEmail = function (email) {
        var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        return regex.test(email);
    }


    var blockElement = function (elementName) {
        $(elementName).block({
            message: '<img src="../assets/images/loader-svg.svg"></img>',
            css: {
                padding: 0,
                margin: 0,
                width: '30%',
                top: '10%',
                left: '35%',
                textAlign: 'center',
                color: '#000',
                border: 'none',
                backgroundColor: 'none',
                cursor: 'wait'
            },
            overlayCSS: {
                backgroundColor: '#000',
                opacity: 0.0,
                cursor: 'wait'
            },
        });
    }

    var unblockElement = function (elementName) {
        $(elementName).unblock();
    }
    //#endregion functions

    //#region events
    $("#toggle-btn").change(function () {
        if ($(this).is(":checked")) {
            $(".hidden-input").toggle(300);
            $("#sign-in-btn").show();
        }
        else {
            $(".hidden-input").toggle(300);
            $("#sign-in-btn").hide();
        }
    })

    $("#inputPasswordConfirmation").keyup(function () {
        if ($(this).val() === $("#inputPassword").val()) {
            $(this).removeClass("border-class");
            isMatch = true;
        } else {
            $(this).addClass("border-class");
            isMatch = false;
        }
    });

    $("#sign-in-btn").click(function () {
        var mail = $("#inputEmail").val();
        var pass = $("#inputPassword").val();
        console.log(mail);
        if (mail == "" || pass == "") {
            toastr.warning("All fields are mandatory.");
        }
        else if (!isEmail(mail)) {
            toastr.warning("Provided mail is not a valid email address.");
        }
        else {
            blockElement(".container");
            mail = mail.split("@")[0];

            var signInRequest = {
                username: mail,
                password: pass
            }

            console.log(signInRequest);
            $.ajax({
                type: "POST",
                url: "https://frozen-forest-81678.herokuapp.com/api/auth/signin",
                data: JSON.stringify(signInRequest),
                contentType: "application/json",
                success: function (response) {
                    // Check if token exists.
                    var token = response["accessToken"];
                    if (token == null || token == undefined || token == "") {
                        toastr.error("User could not be authenticated.");
                    }
                    else {
                        window.localStorage.setItem("token", response["accessToken"]);
                        window.localStorage.setItem("userId", response["id"]);
                        window.localStorage.setItem("name", response["name"]);
                        window.localStorage.setItem("surname", response["surname"]);

                        window.location = window.location.origin + "/views/vendor.html";
                    }
                    unblockElement(".container");
                },
                error: function (error) {
                    toastr.error("Login failed.");
                    unblockElement(".container");
                }
            });
        }
    });

    $("#sign-up-btn").click(function () {
        var mail = $("#inputEmail").val();
        var name = $("#inputName").val();
        var surname = $("#inputSurname").val();
        var pass = $("#inputPassword").val();
        var restaurantName = $("#inputRestaurantName").val();

        if (mail == "" || pass == "" || name == "" || surname == "" || restaurantName == "") {
            toastr.warning("All fields are mandatory");
        }
        else if (!isEmail(mail)) {
            toastr.warning("Provided mail is not a valid email address.");
        }
        else if (!isMatch) {
            toastr.warning("Passwords do not match.");
        }
        else {
            blockElement(".container");
            var username = mail.split("@")[0];

            var signUpRequest = {
                username: username,
                email: mail,
                name: name,
                surname: surname,
                password: pass,
                roles: ["vendor"]
            }

            $.ajax({
                type: "POST",
                url: "https://frozen-forest-81678.herokuapp.com/api/auth/signup",
                data: JSON.stringify(signUpRequest),
                contentType: "application/json",
                success: function (response) {
                    // Check if token exists.
                    var token = response["accessToken"];
                    if (token == null || token == undefined || token == "") {
                        toastr.error("User could not be authenticated.");
                    }
                    else {
                        window.localStorage.setItem("token", response["accessToken"]);
                        window.localStorage.setItem("userId", response["id"]);
                        window.localStorage.setItem("name", response["name"]);
                        window.localStorage.setItem("surname", response["surname"]);

                        saveRestaurant();
                    }
                },
                error: function (error) {
                    toastr.error("Login failed.");
                    unblockElement(".container");
                }
            })
        }
    });

    //#endregion events


    var saveRestaurant = function() {
        var token = window.localStorage.getItem("token");
        var userId = window.localStorage.getItem("userId");
        var restaurantName = $("#inputRestaurantName").val();

        var lat = marker.getPosition().lat();
        var lng = marker.getPosition().lng();

        var saveRestaurantRequest = {
            name: restaurantName,
            vendorId: userId,
            address: {
                latitude: lat,
                longitude: lng,
                cityName: "İzmir"
            }
        }

        $.ajax({
            type: "POST",
                url: "https://frozen-forest-81678.herokuapp.com/api/restaurant",
                headers: { "Authorization": "Bearer " + token },
                data: JSON.stringify(saveRestaurantRequest),
                contentType: "application/json",
                success: function (response) {
                    console.log(response);
                    unblockElement(".container");
                    window.localStorage.setItem("restaurantId", response["id"]);
                    window.location = window.location.origin + "/views/vendor.html";
                },
                error: function (error) {
                    toastr.error("Registration failed.");
                    unblockElement(".container");
                }
        });
    };

    // Check if user has a token generated before
    isAuthenticated();
});