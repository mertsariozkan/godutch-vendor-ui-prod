$(document).ready(function() {
    var tableData;
    var activeTableData;
    var restaurantId = window.localStorage.getItem("restaurantId");
    var counter = 0;
    var getActiveTables = function() {
        $.ajax({
            type: "GET",
            url: "https://frozen-forest-81678.herokuapp.com/api/table/"+ restaurantId +"/allactive",
            headers: { "Authorization": "Bearer " + window.localStorage.getItem("token") },
            success: function(response) {
                activeTableData = response.restaurantTableDtos
                $("#table-container").html("");
                activeTableData.forEach(table => {
                    $("#table-container").append("<div class='col-3' id='"+table.name+"'>"+
                    "<div class='active-table-box'>"+
                    "<div class='row-md-3'><button id='edit-table-button' name='"+table.name+"' type='button' class='btn btn-primary icofont-ui-edit mr-1 mb-2'><button id='delete-table-button' name='"+table.name+"' type='button' class='btn btn-danger icofont-ui-remove ml-1 mb-2'></div>"+
                    "<div><img src='../assets/images/dinner-table.png'></div>"+
                    "<div class='d-flex justify-content-center'>"+ table.name +"</div>"+
                    "</div>"+
                    "</div>");
                    counter++;
                    if(counter == 4) {
                        $("#table-container").append("<div class='w-100 table-grid-gap'></div>");
                        counter = 0;
                    }
                });
                tableData.forEach(table => {
                    if(includesValue(activeTableData, table.name)) {
                        $("#table-container").append("<div class='col-3' id='"+table.name+"'>"+
                        "<div class='table-box'>"+
                        "<div class='row-md-3'><button id='edit-table-button' name='"+table.name+"' type='button' class='btn btn-primary icofont-ui-edit mr-1 mb-2'><button id='delete-table-button' name='"+table.name+"' type='button' class='btn btn-danger icofont-ui-remove ml-1 mb-2'></div>"+
                        "<div><img src='../assets/images/dinner-table.png'></div>"+
                        "<div class='d-flex justify-content-center'>"+ table.name +"</div>"+
                        "</div>"+
                        "</div>");
                        counter++;
                        if(counter == 4) {
                            $("#table-container").append("<div class='w-100 table-grid-gap'></div>");
                            counter = 0;
                        }
                    }
                });
                counter=0;
            },
            error: function(error) {
                console.log(error);
            }
        });

    }
    
    var includesValue = function(arr, propValue) {
        for(var i = 0; i < arr.length; i++) {
            if (arr[i].name == propValue) {
                return false;
            }
        }
        return true;
    }

    var getAllTables = function() {
        activeTableCount = 0;
        $.ajax({
            type: "GET",
            url: "https://frozen-forest-81678.herokuapp.com/api/table/"+ restaurantId +"/all",
            headers: { "Authorization": "Bearer " + window.localStorage.getItem("token") },
            success: function(response) {
                tableData = response.restaurantTableDtos;
                getActiveTables();
            },
            error: function(error) {
                console.log(error);
            }
        });

    }
    getAllTables();

    $("#table-container").on("click", ".table-box, .active-table-box", function(){
        var tableName = $(this).parent().attr('id');
        
        $.ajax({
            type: "GET",
            url: "https://frozen-forest-81678.herokuapp.com/api/table/"+ restaurantId +"/"+tableName,
            headers: { "Authorization": "Bearer " + window.localStorage.getItem("token") },
            contentType: "application/json",
            success: function(response) {
                // Populate data from response to ui using modal.
                $("#table-modal-body")
                var paymentLabel = response.paymentActive ? "(Payment active)" : ""
                $("#exampleModalLabel").text(response.name + " " + paymentLabel);
                var modalHtml = "";
                var totalAmount = 0.0;
                response.users.forEach( user => {
                    var usernameColor = "black";
                    var paidLabel = "";
                    if(response.paymentActive && user.paid) {
                        usernameColor = "green";
                        paidLabel = "(Paid)";
                    }
                    else if(response.paymentActive && !user.paid) {
                        usernameColor = "red";
                        paidLabel = "(Not paid)";
                    }

                    modalHtml += "<h5 style='color:"+ usernameColor +";'>"+user.username+" "+ paidLabel +"</h5>";
                    modalHtml += "<table class='table table-sm table-borderless category-table-section'> <thead><tr><th>Count</th><th>Name</th><th>Price</th></tr></thead><tbody>";
                    user.orders.forEach(order => {
                        totalAmount += order.count * order.item.price;
                        modalHtml += "<tr><td>"+order.count+"</td><td>"+order.item.name+"</td><td>"+order.item.price+" TL</td></tr>";
                    });
                    modalHtml += "</tbody></table>";
                });
                modalHtml += "<h5>Total amount: " + totalAmount + " TL";
                
                $("#table-modal-body").html(modalHtml);
                $('#tableModal').modal('show');
                console.log(response);
            },
            error: function(error) {
                console.log(error);
            }
        });
    });


    $("#table-container").on("click", "#edit-table-button", function(){
        if ($(this).parent().parent().hasClass("active-table-box")) {
            toastr.warning("This operation is not permitted on active tables.");
        } else {
            var tableName = this.name;
            $.confirm({
                title: 'Edit table',
                content: '' +
                    '<form action="" class="formName">' +
                    '<div class="form-group">' +
                    '<label>Enter new table name below.</label>' +
                    '<input type="text" placeholder="Input table name" class="name form-control" required />' +
                    '</div>' +
                    '</form>',
                buttons: {
                    formSubmit: {
                        text: 'Submit',
                        btnClass: 'btn-blue',
                        action: function () {
                            var name = this.$content.find('.name').val();
                            if (!name) {
                                $.alert('Provide a valid name');
                                return false;
                            }
    
                            $.ajax({
                                type: "POST",
                                url: "https://frozen-forest-81678.herokuapp.com/api/table/vendor/"+ restaurantId +"/"+tableName,
                                headers: { "Authorization": "Bearer " + window.localStorage.getItem("token") },
                                data: name,
                                contentType: "application/json",
                                success: function(response) {
                                    $("#all-container").load('table.html');
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
        }
        
    });

    $("#table-container").on("click", "#delete-table-button", function(){
        if ($(this).parent().parent().hasClass("active-table-box")) {
            toastr.warning("This operation is not permitted on active tables.");
        } else {
            var tableRequest = {
                restaurantId : restaurantId,
                restaurantTable : { name : this.name}
            };
    
            $.confirm({
                title: 'Proceed?',
                content: 'If you say YES, the table will be deleted permenantly.',
                buttons: {
                    Yes: {
                        action: function () {
                            $.ajax({
                                type: "DELETE",
                                url: "https://frozen-forest-81678.herokuapp.com/api/table",
                                headers: { "Authorization": "Bearer " + window.localStorage.getItem("token") },
                                data: JSON.stringify(tableRequest),
                                contentType: "application/json",
                                success: function(response) {
                                    $("#all-container").load('table.html');
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
        }
        
    });

    $("#add-table-button").click(function() {
        $.confirm({
            title: 'Add table',
            content: '' +
                '<form action="" class="formName">' +
                '<div class="form-group">' +
                '<label>Enter new table name below.</label>' +
                '<input type="text" placeholder="Input table name" class="name form-control" required />' +
                '</div>' +
                '</form>',
            buttons: {
                formSubmit: {
                    text: 'Submit',
                    btnClass: 'btn-blue',
                    action: function () {
                        var name = this.$content.find('.name').val();
                        if (!name) {
                            $.alert('Provide a valid name');
                            return false;
                        }

                        var tableRequest = {
                            restaurantId : restaurantId,
                            restaurantTable : {
                                name : name,
                                users: [],
                                passCode: ""
                            }
                        };
                        $.ajax({
                            type: "POST",
                            url: "https://frozen-forest-81678.herokuapp.com/api/table",
                            headers: { "Authorization": "Bearer " + window.localStorage.getItem("token") },
                            data: JSON.stringify(tableRequest),
                            contentType: "application/json",
                            success: function(response) {
                                $("#all-container").load('table.html');
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

    $("#refresh-button").click(function() {
        getAllTables();
    })


});