let staticMap = document.querySelector(`.map__static-map`);
let yandexMap = document.querySelector(`#map`);

ymaps.ready(init);

function init() {
  staticMap.remove();
  yandexMap.classList.add(`map__interactive-map--show`);
  let map = new ymaps.Map(`map`, {
    center: [47.244729, 39.722810],
    zoom: 17
  }, {
    searchControlProvider: `yandex#search`
  });

  let myPlacemark = new ymaps.Placemark(map.getCenter(), {
    hintContent: `ТЦ Декорум`,
    balloonContent: `г. Ростов-на-Дону, ТЦ Декорум`
  }, {
    iconLayout: `default#image`
  });
  map.geoObjects.add(myPlacemark);
}
