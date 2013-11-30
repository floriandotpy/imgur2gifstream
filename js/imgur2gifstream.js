var gifstream = gifstream || (function($){

    var settings;

    var init = function(args) {
        settings = $.extend({
            client_id: 'ab36a6d401c176d',
            stream_version: 1,
            stream_title: 'GifStream Teststream',
            stream_identifier: 'com.example.gifstream-teststream',
            stream_base: '', // empty when using absolute urls
            stream_license: 'Very important license information',
            callback_success: function(str) {},
            callback_error: function(msg) {}
        }, args);
    };

    var parseResponse = function(json) {
        if (!json.data) {
            json = $.parseJSON(json);
        }

        var stream = {
            "version": settings.stream_version,
            "title": settings.stream_title,
            "identifier": settings.stream_identifier,
            "base": settings.stream_base,
            "license": settings.stream_license,
            files: []
        };
        var images = json.data.images;
        for (var i = 0; i<images.length; i++) {
            var img = images[i];
            if (img.link.match(/.gif$/i)) {
                stream.files.push({
                    title: img.description || '',
                    src: img.link // strip slashes?
                });
            }
        }

        settings.callback_success(JSON.stringify(stream));
    };
    var getAlbum = function(album_id) {
        var url = 'https://api.imgur.com/3/album/'+album_id;
        $.ajax({
            url: 'https://api.imgur.com/3/album/'+album_id,
            method: 'GET',
            headers: {
              Authorization: 'Client-ID ' + settings.client_id,
              Accept: 'application/json'
            },
            success: parseResponse,
            error: settings.callback_error
        });
    };
    var idFromUrl = function(url) {
        matches = url.match(/(\w+)\/?$/);
        if (matches === null)
            return null;
        return matches[0];
    }

    return {
        init: init,
        idFromUrl: idFromUrl,
        getAlbum: getAlbum
    }
})(jQuery);