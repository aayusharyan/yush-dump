(function($) {

    "use strict";

    $('html').addClass('progressive-gallery');

    var BATCH_SIZE = 12,
        INITIAL_COUNT = 12,
        $grid,
        $sentinel,
        $status,
        $end,
        manifest = [],
        nextIndex = INITIAL_COUNT,
        isLoading = false,
        observer;

    function makeItem(photo) {
        var src = 'images/hex/' + photo.file,
            $link = $('<a/>', {
                'class': 'item lightbox',
                'href': src,
                'data-caption': photo.hex
            }),
            $image = $('<img/>', {
                'src': src,
                'alt': 'Solid color field in ' + photo.hex,
                'width': photo.width,
                'height': photo.height,
                'loading': 'lazy',
                'decoding': 'async'
            });

        return $link.append($image);
    }

    function revealItems($items) {
        $items.each(function(index) {
            this.style.setProperty('--reveal-delay', (index % BATCH_SIZE) * 35 + 'ms');
        });

        return $items.imagesLoaded().progress(function(_, image) {
            var $item = $(image.img).closest('.item');

            window.requestAnimationFrame(function() {
                window.requestAnimationFrame(function() {
                    $item.addClass('is-visible');
                });
            });
        });
    }

    function finishGallery() {
        if (observer) {
            observer.disconnect();
        }
        $status.hide();
        $end.attr('aria-hidden', 'false').addClass('is-visible');
    }

    function appendNextBatch() {
        if (isLoading || nextIndex >= manifest.length) {
            if (nextIndex >= manifest.length) {
                finishGallery();
            }
            return;
        }

        isLoading = true;
        var batch = manifest.slice(nextIndex, nextIndex + BATCH_SIZE),
            $items = $();

        $.each(batch, function(_, photo) {
            $items = $items.add(makeItem(photo));
        });

        nextIndex += batch.length;
        $grid.append($items).masonry('appended', $items);

        revealItems($items).always(function() {
            $grid.masonry('layout');
            isLoading = false;
            if (nextIndex >= manifest.length) {
                finishGallery();
            } else if ($sentinel[0].getBoundingClientRect().top <= window.innerHeight + 1200) {
                window.setTimeout(appendNextBatch, 0);
            }
        });
    }

    function beginObserving() {
        observer = new IntersectionObserver(function(entries) {
            if (entries[0].isIntersecting) {
                appendNextBatch();
            }
        }, {
            rootMargin: '1200px 0px'
        });
        observer.observe($sentinel[0]);
    }

    $(function() {
        $grid = $('.img-grid');
        $sentinel = $('#gallery-sentinel');
        $status = $('#gallery-status');
        $end = $('#gallery-end');

        revealItems($grid.find('.item'));

        $.getJSON('images/hex/manifest.json')
            .done(function(data) {
                manifest = data;
                if (manifest.length <= INITIAL_COUNT) {
                    finishGallery();
                    return;
                }

                if ('IntersectionObserver' in window) {
                    beginObserving();
                } else {
                    BATCH_SIZE = manifest.length;
                    appendNextBatch();
                }
            })
            .fail(function() {
                $status.text('The archive could not be loaded.').addClass('is-error');
            });
    });

})(jQuery);
