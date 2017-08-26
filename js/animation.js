$(function () {

    const url = 'http://jsonplaceholder.typicode.com/comments';
    const data = $('.downloaded-data');
    const dataTable = $('.data-table');
    const tBody = dataTable.find('tbody');

    function insertContent(content) {
        $.each(content, function (index, type) {
            const tr = $('<tr>', {
                class: "type",
                "data-id": type.id
            });
            const thId = $('<td class="id">').text(type.id);
            const thPostId = $('<td class="postId">').text(type.postId);
            const thName = $('<td class="name">').text(type.name);
            const thBody = $('<td class="body">').text(type.body);
            const thEmail = $('<td class="email">').text(type.email);
            const deleteBtn = $('<button>').addClass('remove-btn').text('Usuń');
            const editBtn = $('<button>').addClass('edit-btn').text('Zmodyfikuj');

            tr.append(thId, thPostId, thName, thBody, thEmail, deleteBtn, editBtn);
            tBody.append(tr);

        });
    }

    function loadData() {
        $.ajax({
            url: url
        }).done(function (response) {
            console.log(response);
            console.log('git');
            console.log('POBRANO!');
            insertContent(response);
        }).fail(function (error) {
            console.log(error);
        }).always(function () {
            $('.loader').fadeOut(3000);
        });
    }

    const sendBtn = $('.send-btn');

    function addItems() {
        const form = $('.add-items');
        const name = $('.get-name');
        const email = $('.get-email');
        const desc = $('.get-description');
        const textLabel = $('.text-label');



        function resetBorder() {
            name.css('border', '2px solid #cecece');
            email.css('border', ' 2px solid #cecece');
            desc.css('border', ' 2px solid #cecece');
        }

        function resetInput() {
            name.val('');
            email.val('');
            desc.val('');
        }
        resetBorder();

        form.on('submit', function (event) {
            event.preventDefault();

            const nameVal = name.val();
            const emailVal = email.val();
            const descVal = desc.val();

            const obj = {
                "body": descVal,
                "email": emailVal,
                "id": [],
                "name": nameVal,
                "postId": []
            }

            if (nameVal.length > 5) {
                if (emailVal.indexOf("@") > -1) {
                    if (descVal.length > 3) {
                        textLabel.html('');
                        resetBorder();
                        resetInput();
                        textLabel.html('Dane zostały dodane do tabeli!');
                        $.ajax({
                            url: url,
                            type: 'POST',
                            data: JSON.stringify(obj)
                        }).done(function (response) {
                            console.log(response);
                            console.log('DODANO!');
                            loadData();
                        }).fail(function (error) {
                            console.log(error);
                        });
                    } else {
                        textLabel.html('');
                        textLabel.html('Podana nazwa jest za krótka!');
                        name.css('border', ' 2px solid #cecece');
                        email.css('border', ' 2px solid #cecece');
                        desc.css('border', '2px solid red');
                    }
                } else {
                    textLabel.html('');
                    textLabel.html('Adres mail jest nie prawidłowy!');
                    name.css('border', ' 2px solid #cecece');
                    email.css('border', '2px solid red');
                    desc.css('border', ' 2px solid #cecece');
                }
            } else {
                textLabel.html('');
                textLabel.html('Podany opis jest za krótki!');
                name.css('border', '2px solid red');
                email.css('border', ' 2px solid #cecece');
                desc.css('border', ' 2px solid #cecece');
            }
        });
    }

    function removeItem() {
        dataTable.on('click', '.remove-btn', function () {
            const tr = $(this).closest('tr');
            const id = tr.data('id');

            console.log(tr, id);
            $.ajax({
                url: url + '/' + id,
                type: 'DELETE',
            }).done(function (response) {
                console.log(response);
                console.log('USUNIĘTO!');
                loadData();
            }).fail(function (error) {
                console.log(error);
            });
        })
    }

    function updateItems() {
        dataTable.on('click', '.edit-btn', function () {
            console.log('click');
            const tr = $(this).parent();
            const itemId = tr.find('.id');
            const postId = tr.find('.postId');
            const name = tr.find('.name');
            const email = tr.find('.email');
            const body = tr.find('.body');

            //            console.log(tr, postId);

            if ($(this).hasClass('edited')) {
                $(this).text('Zmodyfikuj').removeClass('edited');
                itemId.removeAttr('contenteditable', true).removeClass('editable');
                postId.removeAttr('contenteditable', true).removeClass('editable');
                name.removeAttr('contenteditable', true).removeClass('editable');
                email.removeAttr('contenteditable', true).removeClass('editable');
                body.removeAttr('contenteditable', true).removeClass('editable');

                const itemIdVal = itemId.val();
                const postIdVal = postId.val();
                const nameVal = name.val();
                const emailVal = email.val();
                const bodyVal = body.val();
                const id = tr.data('id');

                const obj = {
                    "body": bodyVal,
                    "email": emailVal,
                    "id": itemIdVal,
                    "name": nameVal,
                    "postId": postIdVal
                }

                $.ajax({
                    url: url + '/' + id,
                    type: 'PUT',
                    data: JSON.stringify(obj)
                }).done(function (response) {
                    console.log(response);
                    console.log('ZMODYFIKOWANO!');
                    loadData();
                }).fail(function (error) {
                    console.log(error);
                });

            } else {
                itemId.attr('contenteditable', true).addClass('editable');
                postId.attr('contenteditable', true).addClass('editable');
                name.attr('contenteditable', true).addClass('editable');
                email.attr('contenteditable', true).addClass('editable');
                body.attr('contenteditable', true).addClass('editable');


                $(this).text('Zapisz').addClass('edited');
            }
        })
    }






    loadData();
    addItems();
    removeItem();
    updateItems();

});
