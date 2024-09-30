require('@uswds/uswds');

// Add your custom javascript here
console.log("Hi from cloud.gov Pages");

// mermaid.initialize({startOnLoad:true, theme: 'base'}, ".someOtherClass");

const sideNavParents = document.querySelectorAll(".usa-sidenav__item--parent-item");
const sideNavChild = document.querySelectorAll(".usa-sidenav__sublist--middle-generation");
const subLists = document.querySelectorAll("ul.usa-sidenav__sublist");
const middleSubList = document.querySelectorAll(".usa-sidenav__sublist ul");

anchors.add('h2').remove('.no-anchor');
anchors.add('h3').remove('.no-anchor');

console.log(anchors);

function openCurrentSubNav(self){
    //Toggle the attribute
    self.setAttribute('aria-expanded', !self.getAttribute('aria-expanded'));
    self.classList.toggle('usa-current');
    const ariaHandled = self.getAttribute('aria-controls');

    //toggle the subnav
    const controlledElement = document.getElementById(ariaHandled);
    controlledElement.setAttribute('aria-hidden', !controlledElement.getAttribute('aria-hidden'));
    controlledElement.classList.toggle('display-none');
}

function closeAllLists(listArray) {
    listArray.forEach(element => {
        element.setAttribute('aria-hidden', true);
        element.classList.add('display-none');
    });
}

function removeAllUSACurrent (listArray){
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



if (location.search === "?b") {
    document.querySelector('#main-content > .usa-section:first-child').classList.add('usa-section--dark');
    document.querySelector('#main-content > .usa-section:nth-child(2)').classList.remove('usa-section--dark');
    document.querySelectorAll('.bg-primary.radius-pill').forEach(function(el) {
        el.classList.add('text-white');
    });

    document.querySelectorAll('img[src*="-on-blue.svg"]').forEach(function(el) {
        el.src = el.src.replace(/-on-blue/, '-on-white');
    });


    document.querySelectorAll('#main-content > .usa-section:nth-child(2) a[href]:not(.anchorjs-link)').forEach(function(el) {
        el.classList.add('cg-arrow');
    });
} else if (location.search === '?c') {
    document.querySelector('#main-content > .usa-section:first-child').classList.add('usa-section--dark');
    document.querySelector('#main-content > .usa-section:nth-child(2)').classList.remove('usa-section--dark');
    document.querySelector('#main-content > .usa-section:nth-child(2)').classList.add('usa-section--light');
    document.querySelectorAll('.bg-primary.radius-pill').forEach(function(el) {
        el.classList.add('text-white');
    });

    document.querySelectorAll('img[src*="-on-blue.svg"]').forEach(function(el) {
        el.src = el.src.replace(/-on-blue/, '-on-white');
    });

    document.querySelectorAll('#main-content > .usa-section:nth-child(2) a[href]:not(.anchorjs-link)').forEach(function(el) {
        el.classList.add('cg-arrow');
    });

}
