// coded by @Mikezpo

const toggleButton = document.getElementsByClassName('navButton')[0];
const navbarLinks = document.getElementsByClassName('navLinks')[0];

// Add click event listener to each menu item
const menuItems = document.querySelectorAll('.menu-list a');
for (const item of menuItems) {
  item.addEventListener('click', () => {
    // If the clicked item is NOT the loginLink
    if(item.id !== 'loginLink') {
      // Close the menu when an item is clicked
      navbarLinks.classList.remove('active');
      toggle.checked = false;
    }
  });
}

toggleButton.addEventListener('click', (event) => {
  navbarLinks.classList.toggle('active');
  event.stopPropagation();
});


// Close the menu when clicking outside of it
document.addEventListener('click', (event) => {
  const isClickInsideMenu = navbarLinks.contains(event.target);
  const isClickOnButton = event.target === toggleButton;

  if (!isClickInsideMenu && !isClickOnButton) {
    navbarLinks.classList.remove('active');
    // toggleButton.checked = false;
  }
});

// Sign in Form

function showModal(modalId) {
  document.getElementById(modalId).style.display = 'block';
}

function hideModal(modalId) {
  document.getElementById(modalId).style.display = 'none';
}

const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

signUpButton.addEventListener('click', () => {
	container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
	container.classList.remove("right-panel-active");
});

// Mobile Sign in Form

const mobileSignUpButton = document.getElementById('mobileSignUp');
const mobileSignInButton = document.getElementById('mobileSignIn');
const signUpContainer = document.querySelector('.sign-up-container');
const signInContainer = document.querySelector('.sign-in-container');

mobileSignUpButton.addEventListener('click', () => {
    signUpContainer.style.display = 'block';
    signInContainer.style.display = 'none';
});

mobileSignInButton.addEventListener('click', () => {
    signUpContainer.style.display = 'none';
    signInContainer.style.display = 'block';
});

// Event listener to close the form upon click on 'Escape'
document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape' && document.getElementById('loginModal').style.display === 'block') {
    hideModal('loginModal');
  }
});

// Hide/Show password Sign in Form

document.getElementById('togglePassword').addEventListener('click', function() {
  const passwordField = document.getElementById('passwordField');
  const icon = this.querySelector('i');
  
  // Check the current type of the input field
  if (passwordField.type === 'password') {
      passwordField.type = 'text';  
      icon.classList.remove('fa-eye');  // Remove the "fa-eye" class
      icon.classList.add('fa-eye-slash');  // Add the "fa-eye-slash" class
  } else {
      passwordField.type = 'password';  
      icon.classList.remove('fa-eye-slash');  // Remove the "fa-eye-slash" class
      icon.classList.add('fa-eye');  // Add the "fa-eye" class
  }
});

// Recipes Images

// Assigned variables
const breakfastBtn = document.querySelector('#breakfastBtn');
const lunchBtn = document.querySelector('#lunchBtn');
const dinnerBtn = document.querySelector('#dinnerBtn');
const dessertBtn = document.querySelector('#dessertBtn');
const shakeBtn = document.querySelector('#shakeBtn');

const imageOne = document.querySelector('#imageOne');
const imageTwo = document.querySelector('#imageTwo');
const imageThree = document.querySelector('#imageThree');
const imageFour = document.querySelector('#imageFour');


// Defining the images to be shown
const breakfastImages = [
  'https://images.unsplash.com/photo-1455099229380-7b52707e356a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1738&q=80',
  'https://plus.unsplash.com/premium_photo-1663855531434-e827a964a35e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1325&q=80',
  'https://images.unsplash.com/photo-1553358961-37aa918d326a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=930&q=80',
  'https://images.unsplash.com/photo-1546554137-f86b9593a222?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80'
]

const lunchImages = [
  'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bWVhbHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60',
  'https://images.unsplash.com/photo-1516901121982-4ba280115a36?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwcm9maWxlLWxpa2VkfDM0fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60',
  'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80'
]

const dinnerImages = [
  'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80',
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=962&q=80',
  'https://plus.unsplash.com/premium_photo-1663853052087-9d4f1d70d23e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
  'https://images.unsplash.com/photo-1585238342070-61e1e768b1ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1160&q=80'
]

const dessertImages = [
  'https://images.unsplash.com/photo-1543573852-1a71a6ce19bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
  'https://images.unsplash.com/photo-1575561524285-ad2a1f748fcf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80',
  'https://images.unsplash.com/photo-1456014673271-90b7fddf2eea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1738&q=80',
  'https://images.unsplash.com/photo-1560180474-e8563fd75bab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80'
]

const shakeImages = [
  'https://images.unsplash.com/photo-1628557044797-f21a177c37ec?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80',
  'https://plus.unsplash.com/premium_photo-1669687173644-21c1381f9183?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80',
  'https://images.unsplash.com/photo-1600718374662-0483d2b9da44?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=770&q=80',
  'https://plus.unsplash.com/premium_photo-1675011652850-747fbcd962af?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80'
]


// Adding Event listeners

breakfastBtn.addEventListener('click', function() {
  updateImages(breakfastImages);
});

lunchBtn.addEventListener('click', function() {
  updateImages(lunchImages);
});

dinnerBtn.addEventListener('click', function() {
  updateImages(dinnerImages);
});

dessertBtn.addEventListener('click', function() {
  updateImages(dessertImages);
});

shakeBtn.addEventListener('click', function() {
  updateImages(shakeImages);
});


// Defining function to change images

function updateImages(images) {
  imageOne.src = images[0];
  imageTwo.src = images[1];
  imageThree.src = images[2];
  imageFour.src = images[3];
}
