var api = new Api();

logout = function () {
    api.logout();
};

$('#search-box').autocomplete({
    source: '/search',
    response: function (event, ui) {
        console.log(ui['content'][1][0]);
    }
});
