

  var GuidePanel = class {
    /**
     * @param {HTMLElement} stepsEl  список <ol> для кроків
     * @param {HTMLInputElement} hintsToggle
     */
    constructor(stepsEl, hintsToggle) {
      this.stepsEl = stepsEl;
      this.hintsToggle = hintsToggle;
    }
    /** @param {import('../app/ScenarioTracker.js').ScenarioTracker} scenario */
    render(scenario, hintsEnabled) {
      if (this.stepsEl) this.stepsEl.innerHTML = scenario.renderItems();
      if (this.hintsToggle) this.hintsToggle.checked = hintsEnabled;
    }
  };

export { GuidePanel };
