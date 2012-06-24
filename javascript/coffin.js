/*
 * Coffin.js V1.0.0
 * Copyright 2012, @fat
 * Free to use under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 */

!function ($) {

  /*
   * coffin toggle for mobile
   */

  $(function () {

    var open       = 'coffin-open'
    var $body      = $('body')
    var $stage     = $('.stage')
    var touchstart = 'ontouchstart' in document.documentElement ? 'touchstart' : 'click'

    $body
      .delegate('.coffin-tab', 'click', function (e) { e.preventDefault() })
      .delegate('[data-coffin="click"]', 'click'   , toggleCoffin)
      .delegate('[data-coffin="touch"]', touchstart, toggleCoffin)

    function translate3d (open) {
      return 'translate3d(' + (open  ? '270' : -1 * Math.max(270 - window.scrollX, 270)) + 'px,0,0)'
    }

    function toggleCoffin() {

      var isOpen = $body.hasClass(open)

      function transitionComplete () {

        if (isOpen) $body.removeClass(open)

        $stage.css({
          '-webkit-transform'   : '',
          '-webkit-transition'  : '',
          'left': !isOpen ? 270 : ''
        })

        $stage.unbind('webkitTransitionEnd.coffin')

        if (isOpen) {
          $body
            .unbind('touchstart.coffin')
            .unbind('touchmove.coffin')
            .unbind('touchend.coffin')
        }

      }

      if (!isOpen) $body.addClass(open)

      $stage.bind('webkitTransitionEnd.coffin', transitionComplete)

      $stage.css({
        '-webkit-transform' : translate3d(!isOpen),
        '-webkit-transition': '-webkit-transform .1s linear'
      })

      if (isOpen || touchstart == 'click') return

      setTimeout(function () {

        var xStart
        var yStart

        $body

          .bind('touchstart.coffin', function (e) {
            xStart = e.touches[0].screenX
            yStart = e.touches[0].screenY
          })

          .bind('touchmove.coffin', function (e) {
            var xMovement = Math.abs(e.touches[0].screenX - xStart)
            var yMovement = Math.abs(e.touches[0].screenY - yStart)
            if ((yMovement * 10) > xMovement) {
              e.preventDefault()
            }
          })

          .bind('touchend.coffin', function (e) {

            if (!window.scrollX) return

            var scrollX    = window.scrollX
            var willScroll = (270 - scrollX) >= 0
            var interval   = setInterval(function () {

              if (scrollX != window.scrollX) return scrollX = window.scrollX

              clearInterval(interval)

              isOpen = true

              if (willScroll) $stage.one('webkitTransitionEnd', transitionComplete)

              $stage.css({
                '-webkit-transform' : translate3d(),
                '-webkit-transition': '-webkit-transform .1s linear'
              })

              if (!willScroll) transitionComplete()

            }, 10)

          })

      }, 0)

    }

  })

}(window.Zepto || window.jQuery)