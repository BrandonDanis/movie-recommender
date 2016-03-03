var api = new Api();

logout = function () {
    api.logout();
};

$('#search-box').autocomplete({
    source: function (req, res) {
        $.ajax({
            url: '/search?term=' + req.term,
            dataType: 'json',
            type: 'GET',
            success: function (data) {
                console.log(data);
                var objects = data['movies'];
                var list = [];
                for (var key in objects) {
                    if (objects.hasOwnProperty(key)) {
                        var object = objects[key];
                        console.log(objects[key]);
                        console.log(object['title']);
                        var listObject = {label: object['title'], value: object['id']};
                        list.push(listObject);
                    }
                }
                console.log(list);
                res(list);
            }
        });
    }
});
