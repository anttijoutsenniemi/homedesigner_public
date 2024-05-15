document.addEventListener('DOMContentLoaded', (event) => {
    const openNavBtn = document.getElementById('openNavBtn');
    if (openNavBtn) {
      openNavBtn.addEventListener('click', openNav);
    }
});

document.addEventListener('DOMContentLoaded', (event) => {
    const closeNavBtn = document.getElementById('closeNavBtn');
    if (closeNavBtn) {
      closeNavBtn.addEventListener('click', closeNav);
    }
});

// document.addEventListener('click', function(event) {
//   if(document.getElementById("mySidenav").style.width = "250px"){
//     var isClickInsideElement = document.getElementById('mySidenav').contains(event.target);
//     if (!isClickInsideElement) {
//         closeNav();
//     }
//   }
// });

function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}