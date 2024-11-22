(function ($) {
    var $window = $(window),
        $body = $('body'),
        $wrapper = $('#wrapper'),
        $header = $('#header'),
        $nav = $('#nav'),
        $main = $('#main'),
        $navPanelToggle, $navPanel, $navPanelInner;

    // SEO Improvements: Ensure semantic HTML in the main document (not JavaScript).
    // Example: Replace divs with <nav>, <main>, <header> where applicable.

    // Breakpoints.
    breakpoints({
        default: ['1681px', null],
        xlarge: ['1281px', '1680px'],
        large: ['981px', '1280px'],
        medium: ['737px', '980px'],
        small: ['481px', '736px'],
        xsmall: ['361px', '480px'],
        xxsmall: [null, '360px']
    });

    // Parallax Scrolling.
    $.fn._parallax = function (intensity) {
        var $window = $(window),
            $this = $(this);

        if (this.length == 0 || intensity === 0) return $this;
        if (this.length > 1) {
            for (var i = 0; i < this.length; i++) $(this[i])._parallax(intensity);
            return $this;
        }

        if (!intensity) intensity = 0.25;

        $this.each(function () {
            var $t = $(this),
                $bg = $('<div class="bg"></div>').appendTo($t),
                on, off;

            on = function () {
                $bg.removeClass('fixed').css('transform', 'matrix(1,0,0,1,0,0)');
                $window.on('scroll._parallax', function () {
                    var pos = parseInt($window.scrollTop()) - parseInt($t.position().top);
                    $bg.css('transform', 'matrix(1,0,0,1,0,' + pos * intensity + ')');
                });
            };

            off = function () {
                $bg.addClass('fixed').css('transform', 'none');
                $window.off('scroll._parallax');
            };

            // Disable parallax on specific devices for performance.
            if (
                browser.name === 'ie' ||
                browser.name === 'edge' ||
                window.devicePixelRatio > 1 ||
                browser.mobile
            )
                off();
            else {
                breakpoints.on('>large', on);
                breakpoints.on('<=large', off);
            }
        });

        // Trigger resize and scroll to ensure parallax activation.
        $window
            .off('load._parallax resize._parallax')
            .on('load._parallax resize._parallax', function () {
                $window.trigger('scroll');
            });

        return $this;
    };

    // Initial animations on page load.
    $window.on('load', function () {
        window.setTimeout(function () {
            $body.removeClass('is-preload');
        }, 100);
    });

    // Lazy load background images for better performance.
    $('[data-bg]').each(function () {
        var $t = $(this);
        $t.css('background-image', 'url(' + $t.data('bg') + ')');
    });

    // Accessibility Improvement: Scrolly links.
    $('.scrolly').scrolly({
        speed: 1000,
        offset: function () {
            return $header.height();
        }
    });

    // Parallax background.
    $wrapper._parallax(0.925);

    // Navigation Panel.
    $navPanelToggle = $(
        '<a href="#navPanel" id="navPanelToggle" aria-label="Menu Toggle">Menu</a>'
    ).appendTo($wrapper);

    // Change toggle styling once we've scrolled past the header.
    $header.scrollex({
        bottom: '5vh',
        enter: function () {
            $navPanelToggle.removeClass('alt');
        },
        leave: function () {
            $navPanelToggle.addClass('alt');
        }
    });

    // Navigation Panel.
    $navPanel = $(
        '<div id="navPanel" role="navigation" aria-hidden="true">' +
            '<nav></nav>' +
            '<a href="#navPanel" class="close" aria-label="Close Menu"></a>' +
            '</div>'
    )
        .appendTo($body)
        .panel({
            delay: 500,
            hideOnClick: true,
            hideOnSwipe: true,
            resetScroll: true,
            resetForms: true,
            side: 'right',
            target: $body,
            visibleClass: 'is-navPanel-visible'
        });

    $navPanelInner = $navPanel.children('nav');
    var $navContent = $nav.children();

    // Move nav content between panel and main nav on breakpoints.
    breakpoints.on('>medium', function () {
        $navContent.appendTo($nav);
    });

    breakpoints.on('<=medium', function () {
        $navContent.appendTo($navPanelInner);
    });

    // Intro Section Behavior.
    var $intro = $('#intro');
    if ($intro.length > 0) {
        breakpoints.on('>small', function () {
            $main.unscrollex();
            $main.scrollex({
                mode: 'bottom',
                top: '25vh',
                bottom: '-50vh',
                enter: function () {
                    $intro.addClass('hidden');
                },
                leave: function () {
                    $intro.removeClass('hidden');
                }
            });
        });

        breakpoints.on('<=small', function () {
            $main.unscrollex();
            $main.scrollex({
                mode: 'middle',
                top: '15vh',
                bottom: '-15vh',
                enter: function () {
                    $intro.addClass('hidden');
                },
                leave: function () {
                    $intro.removeClass('hidden');
                }
            });
        });
    }
})(jQuery);
