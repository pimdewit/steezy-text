/**
 * @param {HTMLElement} container
 * @param {Array[String]} textToLoop
 */
class SteezyText {
  constructor(container, textToLoopThrough, options = {
    loopDuration: 2000,
    autoplay: true
  }) {

    this.CONSTANTS = {
      MANDATORY_CLASSNAME: 'steez',
      LOOP_INDEX_CLASSNAME: 'steez__loop__',
      LETTER_INDEX_CLASSNAME: 'steez__letter',
      ELEMENT_TYPE: 'span',
      ACTIVE_CLASSNAME: 'active',
      ELEMENT_COUNT: textToLoopThrough.length - 1
    };

    this.elements = [];

    this._prepareDOM(container, textToLoopThrough);

    this._activeIndex = 0;

    this.loopDuration = options.loopDuration;
    this.autoplay = options.autoplay;
    this.activeIndex = 0;
  }

  get autoplay() {
    return this._autoplay;
  }

  set autoplay(shouldAutoplay) {
    this._autoplay = shouldAutoplay;

    if (shouldAutoplay) {
      this._autoplayLoop();
    }
  }

  get loopDuration() {
    return this._loopDuration;
  }

  set loopDuration(duration) {
    this._loopDuration = duration;
    this._applyElementTransition(duration / 2);
  }

  get activeIndex() {
    return this._activeIndex;
  }

  set activeIndex(index) {
    this._removeActives();
    this._setToActive(index);
    this._activeIndex = index;
  }

  _applyElementTransition(duration) {
    this.elements.forEach(element => {
      element.container.style.transitionDuration = `${duration}ms`;
      element.letters.forEach((letter, index) => {
        letter.style.transitionDelay = `${Math.round((duration /  element.letters.length) * index)}ms`;
      });
    });
  }

  _removeActives() {
    this.elements.forEach(element => element.container.classList.remove(this.CONSTANTS.ACTIVE_CLASSNAME));
  }

  _setToActive(index) {
    this.elements[index].container.classList.add(this.CONSTANTS.ACTIVE_CLASSNAME);
  }

  /**
   * @param {HTMLElement} parent
   * @param {Array[String] textNodes
   * @private
   */
  _prepareDOM(parent, textNodes) {

    textNodes.forEach((text, i) => {

      const element = document.createElement(this.CONSTANTS.ELEMENT_TYPE);
      element.className = `${this.CONSTANTS.MANDATORY_CLASSNAME} ${this.CONSTANTS.LOOP_INDEX_CLASSNAME}--${i}`;
      element.title = text;

      const letterElements = [];
      const letterStrings = text.split('');
      letterStrings.forEach((letter, j) => {

        const span = document.createElement(this.CONSTANTS.ELEMENT_TYPE);
        span.className = `${this.CONSTANTS.LETTER_INDEX_CLASSNAME} ${this.CONSTANTS.LETTER_INDEX_CLASSNAME}--${j}`;

        const textNode = document.createTextNode(letter);

        span.appendChild(textNode);
        element.appendChild(span);

        letterElements[j] = span;
      });

      this.elements[i] = {
        container: element,
        letters: letterElements
      };

      parent.appendChild(element);
    });
  }

  /**
   * Render the loop.
   * @private
   */
  _autoplayLoop() {

    if (this.autoplay) setTimeout(() => this._autoplayLoop(), this.loopDuration);

    this.activeIndex = this.activeIndex >= this.CONSTANTS.ELEMENT_COUNT ? 0 : this.activeIndex + 1;

  }
}

window.onload = () => {

  const containerElement = document.querySelector('#app');

  const textStrings = [
    'Hello World',
    'Howdy',
    '1234567',
    'asdfghjk',
    'zxcvbnm'
  ];

  new SteezyText(containerElement, textStrings);

};
