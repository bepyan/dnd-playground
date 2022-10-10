const confettiFrequency = 40;
const confettiColors = ['#B1B2FF', '#AAC4FF', '#2D87B0', '#D2DAFF', '#EEF1FF'];
const confettiAnimations = ['slow', 'medium', 'fast'];

const getRandomListItem = (list: any[]) => list[Math.floor(Math.random() * list.length)];

const Confettiful = function () {
  const el = document.createElement('div');
  el.style.position = 'fixed';
  el.style.pointerEvents = 'none';
  el.style.width = '100%';
  el.style.height = '100%';

  const containerEl = document.createElement('div');
  containerEl.style.position = 'absolute';
  containerEl.style.overflow = 'hidden';
  containerEl.style.top = '0';
  containerEl.style.right = '0';
  containerEl.style.bottom = '0';
  containerEl.style.left = '0';
  el.appendChild(containerEl);

  const confettiInterval = setInterval(() => {
    const confettiEl = document.createElement('div');
    confettiEl.style.position = 'absolute';
    confettiEl.style.zIndex = '1';
    confettiEl.style.top = '-10px';
    confettiEl.style.borderRadius = '0%';

    const confettiSize = Math.floor(Math.random() * 3) + 7 + 'px';
    const confettiLeft = Math.floor(Math.random() * el.offsetWidth) + 'px';
    const confettiBackground = getRandomListItem(confettiColors);
    const confettiAnimation = getRandomListItem(confettiAnimations);

    confettiEl.classList.add('confetti', `confetti--animation-${confettiAnimation}`);
    confettiEl.style.left = confettiLeft;
    confettiEl.style.width = confettiSize;
    confettiEl.style.height = confettiSize;
    confettiEl.style.backgroundColor = confettiBackground;

    setTimeout(function () {
      confettiEl.parentNode?.removeChild(confettiEl);
    }, 3000);

    containerEl.appendChild(confettiEl);
  }, 1000 / confettiFrequency);

  document.querySelector('#__next')?.prepend(el);

  return () => {
    clearInterval(confettiInterval);
    setTimeout(function () {
      el.remove();
    }, 3000);
  };
};

export default Confettiful;
