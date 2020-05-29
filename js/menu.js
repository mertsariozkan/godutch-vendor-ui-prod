$(document).ready(function () {

    var token = window.localStorage.token;
    var restaurantId = window.localStorage.getItem("restaurantId")
    //#region functions
    var generateJson = function (restaurantId) {
        var jsonData = {};
        // #region I HAVE NO IDEA HOW I DID THIS
        jsonData.id = restaurantId;
        jsonData.menu = {
            "menuCategories": []
        };
        var categoryJson;
        $(".category-header-section").each(function () {
            var catItems = [];
            var catName = $(this).find("h3").html();
            $(this).next().find("tbody > tr").each(function () {
                var menuItem = {}
                $(this).find("td").each(function () {
                    if ($(this).hasClass("item-name")) {
                        menuItem.name = $(this).text();
                    }
                    if ($(this).hasClass("item-price")) {
                        menuItem.price = $(this).text();
                    }
                });
                catItems.push(menuItem);
            });
            categoryJson = {
                "categoryName": catName,
                "items": catItems
            }
            jsonData.menu.menuCategories.push(categoryJson);
        });
        // #endregion I HAVE NO IDEA HOW I DID THIS

        saveMenu(jsonData);
    };

    var saveMenu = function (jsonData) {
        blockElement("#all-container");
        $.ajax({
            type: "POST",
            url: "https://frozen-forest-81678.herokuapp.com/api/menu",
            headers: { "Authorization": "Bearer " + token },
            data: JSON.stringify(jsonData),
            contentType: "application/json",
            success: function (response) {
                if (response.id == null || response.id == undefined || response.id == "") {
                    toastr.error("Menu could not saved.");
                    unblockElement("#all-container");
                }
                else {
                    toastr.success("Menu successfully updated.");
                    unblockElement("#all-container");
                    $("#menu-link").click();
                }
                
            },
            error: function (error) {
                toastr.error("Menu could not saved.");
                unblockElement("#all-container");
            }
        });
    }



    var blockElement = function (elementName) {
        $(elementName).block({
            message: '<img src="../assets/images/loader-svg.svg"></img>',
            css: {
                padding: 0,
                margin: 0,
                width: '30%',
                top: '200%',
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

    var getMenu = function (restaurantId) {
        blockElement("#all-container");
        $.ajax({
            type: "GET",
            url: "https://frozen-forest-81678.herokuapp.com/api/menu/" + restaurantId,
            contentType: "application/json",
            beforeSend: function (xhr) {   //Include the bearer token in header
                xhr.setRequestHeader("Authorization", 'Bearer ' + token);
            },
            success: function (response) {
                if (response.menuCategories == null || response.menuCategories == undefined || response.menuCategories == "") {
                    toastr.error("Menu could not retrieved.");
                }
                else {
                    categoryData = response.menuCategories;
                    var categoryHeaderHtml = "";
                    for (var i = 0; i < categoryData.length; i++) {
                        categoryHeaderHtml = "<div class='row category-header-section' id='category-header-" + i + " '>"
                            + "<div class='col-md-2 offset-md-1'>"
                            + "<h3 class='category-title'>" + categoryData[i].categoryName + "</h3>"
                            + "<hr>"
                            + "</div>"
                            + "</div>"
                            + "<div class='row' id='category-table-" + i + " '>"
                            + "<div class='col-md-4 offset-md-1'>"
                            + "<table class='table table-borderless category-table-section' id='table-" + i + "'>"
                            + "<thead>"
                            + "<th>Name</th>"
                            + "<th>Price</th>"
                            + "</thead>"
                            + "<tbody>"
                            + "</tbody>"
                            + "</table>"
                            + "<hr>"
                            + "</div>"
                            + "</div>"

                        $("#all-container").append(categoryHeaderHtml);

                        var currentItems = categoryData[i].items;
                        for (var j = 0; j < currentItems.length; j++) {
                            $("#table-" + i + " tbody").append("<tr><td class='item-name' placeholder='Input here...' >" + categoryData[i].items[j].name + "</td><td class='item-price' placeholder='Input here...' > " + categoryData[i].items[j].price + "</td></tr>");
                        }
                    }
                }
                unblockElement("#all-container");
            },
            error: function (error) {
                unblockElement("#all-container");
                toastr.error("Menu could not retrieved.");
            }

        });
    }
    //#endregion functions


    //#region events
    $("#edit-btn").click(function () {
        var tableCells = document.getElementsByTagName("td");
        for (var k = 0; k < tableCells.length; k++) {
            tableCells[k].contentEditable = "true";
        }
        $("#category-button").show();
        $("#save-btn").show();
        $("#cancel-btn").show();
        $(this).hide();

        $("<button class='btn btn-sm btn-success add-item-btn'><i class='icofont-ui-add'></i></button>").insertAfter(".category-title");

        var tableBodys = document.getElementsByTagName("tbody")
        for (var t = 0; t < tableBodys.length; t++) {
            var tableRows = tableBodys[t].getElementsByTagName("tr");
            for (var k = 0; k < tableRows.length; k++) {
                tableRows[k].innerHTML += "<td><button class='btn btn-sm btn-danger delete-item-btn'><i class='icofont-ui-close'></i></button><td>";
            }
        }
    });


    $("#category-button").click(function () {
        $.confirm({
            title: 'Add category',
            content: '' +
                '<form action="" class="formName">' +
                '<div class="form-group">' +
                '<label>Enter new category name below.</label>' +
                '<input type="text" placeholder="Input category name" class="name form-control" required />' +
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
                        var categoryCount = document.getElementsByClassName("category-title").length;
                        var categoryHeaderHtml = "<div class='row category-header-section' id='category-header-" + categoryCount + " '>"
                            + "<div class='col-md-2 offset-md-1'>"
                            + "<h3 class='category-title'>" + name + "</h3>"
                            + "<button class='btn btn-sm btn-success add-item-btn'><i class='icofont-ui-add'></i></button>"
                            + "<hr>"
                            + "</div>"
                            + "</div>"
                            + "<div class='row' id='category-table-" + categoryCount + " '>"
                            + "<div class='col-md-4 offset-md-1'>"
                            + "<table class='table table-borderless' id='table-" + categoryCount + "'>"
                            + "<thead>"
                            + "<th>Name</th>"
                            + "<th>Price</th>"
                            + "</thead>"
                            + "<tbody>"
                            + "</tbody>"
                            + "</table>"
                            + "<hr>"
                            + "</div>"
                            + "</div>"

                        $("#all-container").append(categoryHeaderHtml);
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

    // Add menu item button click event.
    $('body').on('click', 'button.add-item-btn', function () {
        var tableId = "#table-" + $(this).index(".add-item-btn");
        $(tableId + " tbody").append("<tr><td class='item-name' placeholder='Input here...' contentEditable='true'></td><td class='item-price' placeholder='Input here...' contentEditable='true'></td><td><button class='btn btn-sm btn-danger delete-item-btn'><i class='icofont-ui-close'></i></button><td></tr>");
    })

    // Delete menu item button click event.
    $('body').on('click', 'button.delete-item-btn', function (e) {
        e.currentTarget.parentNode.parentNode.remove()
    });

    $("#cancel-btn").click(function () {
        $.confirm({
            title: 'Proceed?',
            content: 'If you say YES, all the changes you made will be lost. ',
            buttons: {
                Yes: {
                    action: function () {
                        $("#menu-link").click();
                    },
                    text: 'Yes',
                    btnClass: 'btn-red',
                },
                No: {
                    text: 'No',
                    btnClass: 'btn-blue',
                },
            }
        });
    });

    $("#save-btn").click(function () {
        $.confirm({
            title: 'Proceed?',
            content: 'If you say YES, all the changes you made will be saved.',
            buttons: {
                Yes: {
                    action: function () {
                        generateJson(restaurantId);
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

    //#endregion events

    getMenu(window.localStorage.getItem("restaurantId"));

})