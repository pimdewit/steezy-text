import '../styles/main.scss';

/**
 * @param {HTMLElement} container
 * @param {Array[String]} textToLoop
 * @param {Object} options
 * @param {Number} options.loopDuration The loop interval time in milliseconds.
 * @param {Boolean} options.autoplay
 */
class SteezyText {
  constructor(container, textToLoopThrough, options = {loopDuration: 1000, autoplay: true}) {

    this._CONST = {
      MANDATORY_CLASSNAME: 'steez',
      LOOP_INDEX_CLASSNAME: 'steez__loop',
      LETTER_CLASSNAME: 'steez__letter',
      MODIFIER_ACTIVE_CLASSNAME: 'steez--active',
      MODIFIER_WHITESPACE_CLASSNAME: 'has-whitespace',
      ELEMENT_TYPE: 'span',
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
    this.elements.forEach(element => element.container.classList.remove(this._CONST.MODIFIER_ACTIVE_CLASSNAME));
  }

  _setToActive(index) {
    this.elements[index].container.classList.add(this._CONST.MODIFIER_ACTIVE_CLASSNAME);
  }

  /**
   * @param {HTMLElement} parent
   * @param {Array[String] textNodes
   * @private
   */
  _prepareDOM(parent, textNodes) {
    
    const letterBaseClassname = this._CONST.LETTER_CLASSNAME;
    const letterWhitespaceClassname = `${letterBaseClassname}--${this._CONST.MODIFIER_WHITESPACE_CLASSNAME}`;

    textNodes.forEach((text, i) => {

      const textContainerElement = document.createElement(this._CONST.ELEMENT_TYPE);
      textContainerElement.className = `${this._CONST.MANDATORY_CLASSNAME} ${this._CONST.LOOP_INDEX_CLASSNAME}--${i}`;
      textContainerElement.title = text;

      const letterElements = [];
      const letterStrings = text.split('');

      letterStrings.forEach((character, j) => {
        const letterElement = document.createElement(this._CONST.ELEMENT_TYPE);
        
        const letterIndexClassname = `${letterBaseClassname}--${j}`;
        let elementClassnames = `${letterBaseClassname} ${letterIndexClassname}`;

        // If the character is a whitespace.
        if (character === ' ') elementClassnames = `${elementClassnames} ${letterWhitespaceClassname}`;
        
        letterElement.className = elementClassnames;

        const textNode = document.createTextNode(character);
        letterElement.appendChild(textNode);
        
        textContainerElement.appendChild(letterElement);

        letterElements[j] = letterElement;
      });

      // Store the elements for later.
      this.elements[i] = {
        container: textContainerElement,
        letters: letterElements
      };

      parent.appendChild(textContainerElement);
    });
  }

  /**
   * Render the loop.
   * @private
   */
  _autoplayLoop() {
    if (this.autoplay) setTimeout(() => this._autoplayLoop(), this.loopDuration);

    this.activeIndex = this.activeIndex >= this._CONST.ELEMENT_COUNT ? 0 : this.activeIndex + 1;

  }
}

window.onload = () => {

  const containerElement = document.querySelector('#app');

  const textStrings = [
    'Hello World!',
    'Arizona',
    'three',
    'Lorem ipsum',
    'eiwfj ejwfo eeoij jwefiewofjewi jefj '
  ];

  new SteezyText(containerElement, textStrings);

};
