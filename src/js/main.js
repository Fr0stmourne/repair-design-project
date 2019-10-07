let video = document.querySelector(`#static-video`);
let playBtn = document.querySelector(`#play-btn`);
let iframe = document.querySelector(`#iframe`);
let videoBlock = document.querySelector(`.video`);


playBtn.addEventListener(`click`, () => {
  video.classList.add(`video__video--hide`);
  playBtn.classList.add(`video__play-btn--hide`);
  iframe.classList.add(`video__iframe--show`);

});
