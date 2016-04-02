$('document').ready(function(e) {
    var $input = $('.search-user'),
        token = $('[name=_token]').val();

    $input.select2({
        ajax: {
            type: 'POST',
            url: '/user/search',
            dataType: 'json',
            delay: 250,
            data: function (search) {
                var selectedIds = (function ($selects) {
                    var ids = [];

                    $selects.each(function() {
                        var selectedIds = $(this).val(),
                            id = 0;

                        if (selectedIds instanceof Array) {
                            for (var i = 0; i < selectedIds.length; i++) {
                                id = parseInt(selectedIds[i]);

                                if (!isNaN(id))
                                    ids.push(id);
                            }
                        }
                    });

                    return ids;
                })($('.search-user'));

                return {
                    search: search.term,
                    _token: token,
                    exceptIds: selectedIds
                };
            },
            processResults: function (data, page) {
                var results = [],
                    name = '';

                for (var i = 0; i < data.length; i++) {
                    name = '<b>#' + data[i].id + '</b> ' + '<span class="name">' +
                        data[i].name
                        + '</span>';
                    results.push({id: data[i].id, text: name});
                }

                return {
                    results: results
                };
            },
            cache: false
        },
        escapeMarkup: function (markup) { return markup; }, // let our custom formatter work
        minimumInputLength: 3,
        multiple: true,
        maximumSelectionLength: 2
    });
});