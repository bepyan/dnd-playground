const confettiFrequency = 3;
const confettiColors = ['#B1B2FF', '#AAC4FF', '#2D87B0', '#D2DAFF', '#EEF1FF'];

const confettiAnimations = ['slow', 'medium', 'fast'];

const getRandomItem = (list: any[]) => list[Math.floor(Math.random() * list.length)];

const Confettiful = function () {
  const el = document.createElement('div');
  el.style.position = 'fixed';
  el.style.pointerEvents = 'none';
  el.style.width = '100%';
  el.style.height = '100%';

  const containerEl = document.createElement('div');
  containerEl.classList.add('confetti-container');
  el.appendChild(containerEl);

  const confettiInterval = setInterval(() => {
    const confettiEl = document.createElement('div');
    const confettiSize = Math.floor(Math.random() * confettiFrequency) + 7 + 'px';
    const confettiLeft = Math.floor(Math.random() * el.offsetWidth) + 'px';
    const confettiBackground = getRandomItem(confettiColors);
    const confettiAnimation = getRandomItem(confettiAnimations);

    confettiEl.classList.add('confetti', `confetti--animation-${confettiAnimation}`);
    confettiEl.style.left = confettiLeft;
    confettiEl.style.width = confettiSize;
    confettiEl.style.height = confettiSize;
    confettiEl.style.backgroundColor = confettiBackground;

    setTimeout(function () {
      confettiEl.parentNode?.removeChild(confettiEl);
    }, 3000);

    containerEl.appendChild(confettiEl);
  }, 25);

  document.querySelector('#__next')?.prepend(el);

  return () => {
    clearInterval(confettiInterval);
    setTimeout(function () {
      el.remove();
    }, 3000);
  };
};

export default Confettiful;
