$(document).ready(function() {
    var tableData;
    var restaurantId = window.localStorage.getItem("restaurantId");

    $.ajax({
        type: "GET",
        url: "https://frozen-forest-81678.herokuapp.com/api/table/"+ restaurantId +"/all",
        headers: { "Authorization": "Bearer " + window.localStorage.getItem("token") },
        success: function(response) {
            tableData = response;
            var counter = 0;
            tableData.restaurantTableDtos.forEach(table => {
                $("#table-container").append("<div class='col' id='table-"+table.name+"'>"+
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
            });
           
        },
        error: function(error) {
            console.log(error);
        }
    });


    $("#table-container").on("click", "#edit-table-button", function(){
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
    });

    $("#table-container").on("click", "#delete-table-button", function(){
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
                            restaurantTable : { name : name}
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


});