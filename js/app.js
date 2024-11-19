require('@uswds/uswds');
import AnchorJS from 'anchor-js';
const anchors = new AnchorJS();


function ready(callback) {
  if (document.readyState !== 'loading') { // in case the document is already rendered
    callback();
  } else if (document.addEventListener) { // modern browsers
    document.addEventListener('DOMContentLoaded', callback);
  } else { // IE <= 8
    document.attachEvent('onreadystatechange', function () {
      if (document.readyState === 'complete') {
        callback();
      }
    });
  }
}

ready(function () {

  // Used with anchors.js
  anchors.add('h2').remove('.no-anchor');
  anchors.add('h3').remove('.no-anchor');

  // Main Menu Subnavigation Controls
  function openCurrentSubNav(self) {
    self.setAttribute('aria-expanded', !self.getAttribute('aria-expanded'));
    self.classList.toggle('usa-current');
    const ariaHandled = self.getAttribute('aria-controls');
    // //toggle the subnav
    const controlledElement = document.getElementById(ariaHandled);
    const ariaState = (!controlledElement.getAttribute('aria-hidden')).toString();
    controlledElement.setAttribute('aria-hidden', ariaState);
    controlledElement.classList.toggle('usa-sr-only');
  }

  // Functionality for main nav dropdowns
  const doNav = () => {
    document.querySelectorAll('.bg-primary.radius-pill').forEach(function (el) {
      el.classList.add('text-white');
    });
    document.querySelectorAll('img[src*="-on-blue.svg"]').forEach(function (el) {
      el.src = el.src.replace(/-on-blue/, '-on-white');
    });
    document.querySelectorAll('#main-content > .usa-section:nth-child(2) a[href]:not(.anchorjs-link)').forEach(function (el) {
      el.classList.add('cg-arrow');
    });
  }

  // Migrated functionality from cg-site
  if (location.search === "?b") {
    document.querySelector('#main-content > .usa-section:first-child').classList.add('usa-section--dark');
    document.querySelector('#main-content > .usa-section:nth-child(2)').classList.remove('usa-section--dark');
    doNav();
  } else if (location.search === '?c') {
    document.querySelector('#main-content > .usa-section:first-child').classList.add('usa-section--dark');
    document.querySelector('#main-content > .usa-section:nth-child(2)').classList.remove('usa-section--dark');
    document.querySelector('#main-content > .usa-section:nth-child(2)').classList.add('usa-section--light');
    doNav()
  }

  // Sidenav vars
  const sideNavParents = document.querySelectorAll(".usa-sidenav__item--parent-item");
  const sideNavChild = document.querySelectorAll(".usa-sidenav__sublist--middle-generation");
  const subLists = document.querySelectorAll("ul.usa-sidenav__sublist");
  const middleSubList = document.querySelectorAll(".usa-sidenav__sublist ul");

  // Close Sidenav sections
  function closeAllLists(listArray) {
    listArray.forEach(element => {
      element.setAttribute('aria-hidden', true);
      element.classList.add('usa-sr-only');
    });
  }

  // Sidenav class modification
  function removeAllUSACurrent(listArray) {
    listArray.forEach(element => {
      element.classList.remove('usa-current');
    });
  }

  // Expand Sidenav section
  const sideNavExpansion = function (event) {
    event.preventDefault();
    if (!this.classList.contains('usa-sidenav__sublist--middle-generation')) {
      closeAllLists(subLists);
      removeAllUSACurrent(sideNavParents);
    } else {
      closeAllLists(middleSubList);
      removeAllUSACurrent(sideNavChild);
    }
    openCurrentSubNav(this);
  };

  for (let i = 0; i < sideNavParents.length; i++) {
    sideNavParents[i].addEventListener('click', sideNavExpansion, false);
  }

});