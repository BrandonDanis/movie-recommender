var api = new Api();

logout = function () {
    api.logout();
};

$('#search-box').autocomplete({
    serviceUrl: '/search',
    onSelect: function (suggestion) {
        alert('You selected: ' + suggestion.value + ', ' + suggestion.data);
    }
});
