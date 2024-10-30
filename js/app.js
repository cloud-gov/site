require('@uswds/uswds');

const sideNavParents = document.querySelectorAll(".usa-sidenav__item--parent-item");
const sideNavChild = document.querySelectorAll(".usa-sidenav__sublist--middle-generation");
const subLists = document.querySelectorAll("ul.usa-sidenav__sublist");
const middleSubList = document.querySelectorAll(".usa-sidenav__sublist ul");

if (!!anchors) {
  anchors.add('h2').remove('.no-anchor');
  anchors.add('h3').remove('.no-anchor');
}
function openCurrentSubNav(self) {
  self.setAttribute('aria-expanded', !self.getAttribute('aria-expanded'));
  self.classList.toggle('usa-current');
  const ariaHandled = self.getAttribute('aria-controls');
  // //toggle the subnav
  const controlledElement = document.getElementById(ariaHandled);
  controlledElement.setAttribute('aria-hidden', (!controlledElement.getAttribute('aria-hidden')).toString());
  controlledElement.classList.toggle('usa-sr-only');
}

function closeAllLists(listArray) {
  listArray.forEach(element => {
    element.setAttribute('aria-hidden', true);
    element.classList.add('usa-sr-only');
  });
}

function removeAllUSACurrent(listArray) {
  listArray.forEach(element => {
    element.classList.remove('usa-current');
  });
}

const sideNavExpansion = function (event) {
  event.preventDefault();
  //Close all subnavs
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