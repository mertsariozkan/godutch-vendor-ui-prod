$(document).ready(function() {
    var restaurantId = window.localStorage.getItem("restaurantId");

    $.ajax({
        type: "GET",
        url: "https://frozen-forest-81678.herokuapp.com/api/waiter/"+ restaurantId,
        headers: { "Authorization": "Bearer " + window.localStorage.getItem("token") },
        success: function(response) {
            waitersList = response;
            var counter = 0;
            waitersList.forEach(waiter => {
                $("#waiters-container").append("<div class='col' id='"+ waiter.id +"'>"+
                "<div class='waiter-box'>"+
                "<div class='row-md-6'><button id='delete-waiter-button' name='"+waiter.id+"' type='button' class='btn btn-danger icofont-ui-remove ml-1 mb-2'></div>"+
                "<div><img src='../assets/images/dinner-table.png'></div>"+
                "<div class='d-flex justify-content-center'>"+ waiter.name + " " + waiter.surname +"</div>"+
                "</div>"+
                "</div>");
                counter++;
                if(counter == 4) {
                    $("#waiters-container").append("<div class='w-100 waiter-grid-gap'></div>");
                    counter = 0;
                }
            });
           
        },
        error: function(error) {
            console.log(error);
        }
    });


    $("#waiters-container").on("click", "#delete-waiter-button", function(){
        var waiterId = this.name;
        debugger;
        $.confirm({
            title: 'Proceed?',
            content: 'If you say YES, the waiter will be deleted permenantly.',
            buttons: {
                Yes: {
                    action: function () {
                        $.ajax({
                            type: "DELETE",
                            url: "https://frozen-forest-81678.herokuapp.com/api/waiter/" + waiterId,
                            headers: { "Authorization": "Bearer " + window.localStorage.getItem("token") },
                            contentType: "application/json",
                            success: function(response) {
                                $("#all-container").load('waiters.html');
                            },
                            error: function(error) {
                                console.log(error);
                            }
                        });
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
    });

    $("#add-waiter-button").click(function() {
        $.confirm({
            title: 'Add waiter',
            content: '' +
                '<form action="" class="formName">' +
                '<div class="form-group">' +
                '<input type="text" placeholder="E-mail" class="mail form-control" required />' +
                '</div>' +
                '<div class="form-group">' +
                '<input type="text" placeholder="Name" class="name form-control" required />' +
                '</div>' +
                '<div class="form-group">' +
                '<input type="text" placeholder="Surname" class="surname form-control" required />' +
                '</div>' +
                '<div class="form-group">' +
                '<input type="password" placeholder="******" class="pass form-control" required />' +
                '</div>' +
                '</form>',
            buttons: {
                formSubmit: {
                    text: 'Submit',
                    btnClass: 'btn-blue',
                    action: function () {
                        var email = this.$content.find('.mail').val();
                        var name = this.$content.find('.name').val();
                        var surname = this.$content.find('.surname').val();
                        var password = this.$content.find('.pass').val();
                        if (!name || !email || !surname || !password) {
                            $.alert('Provide valid inputs');
                            return false;
                        }

                        var username = email.split('@')[0];
                    
                        var signUpRequest = {
                            username : username,
                            name : name,
                            surname : surname,
                            restaurantId : restaurantId,
                            email : email,
                            password : password,
                            roles : ["waiter"]
                        };
                        $.ajax({
                            type: "POST",
                            url: "https://frozen-forest-81678.herokuapp.com/api/auth/signup",
                            data: JSON.stringify(signUpRequest),
                            contentType: "application/json",
                            success: function(response) {
                                $("#all-container").load('waiters.html');
                            },
                            error: function(error) {
                                console.log(error);
                            }
                        });
                    }
                },
                cancel: function () {
                    //close
                },
            },
            onContentReady: function () {
                // bind to events
                var jc = this;
                this.$content.find('form').on('submit', function (e) {
                    // if the user submits the form by pressing enter in the field.
                    e.preventDefault();
                    jc.$$formSubmit.trigger('click'); // reference the button and click it
                });
            }
        });
    });

});