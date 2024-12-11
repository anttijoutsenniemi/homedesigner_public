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

// // Function to fetch and populate the sidenav
// async function populateSidenav() {
//   try {
//     console.log("juu");
//     const response = await fetch('/modelinforoute/fetchmodeldata');
//     if (!response.ok) {
//       throw new Error('Failed to fetch sidenav data');
//     }
//     const data = await response.json();

//     // Get the sidenav container
//     const sidenav = document.getElementById('mySidenav');

//     // // Clear existing content (if needed)
//     // sidenav.innerHTML = `
//     // 	<a href="javascript:void(0)" class="closebtn" id="closeNavBtn">&times;</a>
//     // `;

//     // Populate the sidenav with fetched data
//     data.forEach(item => {
//       const link = document.createElement('a');
//       link.className = 'ar-object';
//       link.id = item.htmlIdentifier;
//       link.href = '#';
//       link.textContent = item.displayTitle;
//       sidenav.appendChild(link);
//     });

//     // Add event listener to the sidenav for delegation
//     sidenav.addEventListener('click', (event) => {
//       if (event.target && event.target.classList.contains('ar-object')) {
//         // Close the sidenav
//         document.getElementById("mySidenav").style.width = "0";

//         // Load the model
//         const id = event.target.id; // Get the ID of the clicked element
//         loadModel(id); // Call the loadModel function with the ID
//       }
//     });

//     // Add event listener for close button
//     document.getElementById('closeNavBtn').addEventListener('click', () => {
//       sidenav.style.width = "0";
//     });
//   } catch (error) {
//     console.error('Error populating sidenav:', error);
//   }
// }

// // Fetch and populate the sidenav on page load
// window.addEventListener('DOMContentLoaded', populateSidenav);
