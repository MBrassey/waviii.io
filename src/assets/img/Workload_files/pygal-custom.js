$(function() {
  function getStyle(el, styleProp) {
    if (el.currentStyle) var y = el.currentStyle[styleProp];
    else if (window.getComputedStyle)
      var y = document.defaultView.getComputedStyle(el, null).getPropertyValue(styleProp);
    return y;
  }

  function styleChart(el) {
    var title = el.innerHTML;
    title = title.replace(
      'wakatime.com',
      '<a xlink:href="https://wakatime.com" target="_blank">wakatime.com</a>',
    );
    el.innerHTML = title;

    if (el.children.length) {
      el.children[0].style['text-decoration'] = 'underline';
      var color = getStyle(el, 'fill');
      el.children[0].style['fill'] = color;
    }
  }

  function main() {
    var el = document.getElementsByClassName('plot_title')[0];
    if (el === undefined) {
      setTimeout(main, 100);
      return;
    }
    styleChart(el);
  }

  if (navigator.userAgent.indexOf('Chrome') != -1 || navigator.userAgent.indexOf('Firefox') != -1) {
    main();
  }
});
