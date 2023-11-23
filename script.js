// Get DOM elements
const itemForm = document.getElementById("item-form"); // Form element
const itemInput = document.getElementById("item-input"); // Input field for items
const itemList = document.getElementById("item-list"); // List to display items
const clearBtn = document.getElementById("clear"); // Button to clear all items
const itemFilter = document.getElementById("filter"); // Input field for filtering items
const formBtn = itemForm.querySelector("button"); // Button inside the form
let isEditMode = false; // Flag to track edit mode

// Function to display items from local storage on page load
function displayItems() {
  const itemsFromStorage = getItemsFromStorage();
  // Loop through stored items and add them to the DOM
  itemsFromStorage.forEach((item) => addItemToDOM(item));
  checkUI(); // Check and update UI elements
}

// Function to handle form submission when adding or updating an item
function onAddItemSubmit(e) {
  e.preventDefault(); // Prevent default form submission behavior

  const newItem = itemInput.value; // Get the value from the input field

  // Validate Input
  if (newItem === "") {
    alert("Please add an item");
    return;
  }

  // Check for edit mode
  if (isEditMode) {
    // If in edit mode, update the item
    const itemToEdit = itemList.querySelector(".edit-mode");

    removeItemFromStorage(itemToEdit.textContent);
    itemToEdit.classList.remove("edit-mode");
    itemToEdit.remove();
    isEditMode = false;
  } else {
    // If not in edit mode, check if the item already exists
    if (checkIfItemExists(newItem)) {
      alert("That item already exists!");
      return;
    }
  }

  // Create item DOM element
  addItemToDOM(newItem);

  // Add item to local storage
  addItemToStorage(newItem);

  checkUI(); // Check and update UI elements
  itemInput.value = ""; // Clear the input field after adding an item
}

// Function to create and append a new item to the DOM
function addItemToDOM(item) {
  // Create list item
  const li = document.createElement("li");
  li.appendChild(document.createTextNode(item));

  // Create remove button for the item
  const button = createButton("remove-item btn-link text-red");
  li.appendChild(button);

  // Add list item to the DOM
  itemList.appendChild(li);
}

// Function to create a button element with specified classes
function createButton(classes) {
  const button = document.createElement("button");
  button.className = classes;
  const icon = createIcon("fa-solid fa-xmark");
  button.appendChild(icon);
  return button;
}

// Function to create an icon element with specified classes
function createIcon(classes) {
  const icon = document.createElement("i");
  icon.className = classes;
  return icon;
}

// Function to add an item to local storage
function addItemToStorage(item) {
  const itemsFromStorage = getItemsFromStorage();

  // Add new item to the array
  itemsFromStorage.push(item);

  // Convert to JSON string and set to local storage
  localStorage.setItem("items", JSON.stringify(itemsFromStorage));
}

// Function to retrieve items from local storage
function getItemsFromStorage() {
  let itemsFromStorage;

  if (localStorage.getItem("items") === null) {
    itemsFromStorage = [];
  } else {
    itemsFromStorage = JSON.parse(localStorage.getItem("items"));
  }

  return itemsFromStorage;
}

// Function to handle click events on items or remove buttons
function onClickItem(e) {
  if (e.target.parentElement.classList.contains("remove-item")) {
    removeItem(e.target.parentElement.parentElement);
  } else {
    setItemToEdit(e.target);
  }
}

// Function to check if an item already exists in local storage
function checkIfItemExists(item) {
  const itemsFromStorage = getItemsFromStorage();
  return itemsFromStorage.includes(item);
}

// Function to set an item to edit mode
function setItemToEdit(item) {
  isEditMode = true;

  itemList
    .querySelectorAll("li")
    .forEach((i) => i.classList.remove("edit-mode"));

  item.classList.add("edit-mode");
  formBtn.innerHTML = '<i class="fa-solid fa-pen"></i>   Update Item';
  formBtn.style.backgroundColor = "#228B22";
  itemInput.value = item.textContent;
}

// Function to remove an item from the list and local storage
function removeItem(item) {
  if (confirm("Are you sure?")) {
    // Remove item from the DOM
    item.remove();

    // Remove item from local storage
    removeItemFromStorage(item.textContent);

    checkUI(); // Check and update UI elements
  }
}

// Function to remove an item from local storage
function removeItemFromStorage(item) {
  let itemsFromStorage = getItemsFromStorage();

  // Filter out item to be removed
  itemsFromStorage = itemsFromStorage.filter((i) => i !== item);

  // Re-set items to local storage
  localStorage.setItem("items", JSON.stringify(itemsFromStorage));
}

// Function to clear all items from the list and local storage
function clearItems() {
  if (confirm("Are you sure?")) {
    while (itemList.firstChild) {
      itemList.removeChild(itemList.firstChild);
    }
  }

  // Clear items from local storage
  localStorage.removeItem("items");

  checkUI(); // Check and update UI elements
}

// Function to filter items based on user input
function filterItems(e) {
  const items = itemList.querySelectorAll("li");
  const text = e.target.value.toLowerCase();

  // Loop through items and hide/display based on filter text
  items.forEach((item) => {
    const itemName = item.firstChild.textContent.toLowerCase();

    if (itemName.indexOf(text) != -1) {
      item.style.display = "flex";
    } else {
      item.style.display = "none";
    }
  });
}

// Function to check and update UI elements based on item list
function checkUI() {
  itemInput.value = "";

  const items = itemList.querySelectorAll("li");

  // Hide/show clear button and filter input based on item list length
  if (items.length === 0) {
    clearBtn.style.display = "none";
    itemFilter.style.display = "none";
  } else {
    clearBtn.style.display = "block";
    itemFilter.style.display = "block";
  }

  // Reset form button to add mode
  formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
  formBtn.style.backgroundColor = "#333";

  isEditMode = false; // Reset edit mode flag
}

// Initialize app
function init() {
  // Event Listeners
  itemForm.addEventListener("submit", onAddItemSubmit);
  itemList.addEventListener("click", onClickItem);
  clearBtn.addEventListener("click", clearItems);
  itemFilter.addEventListener("input", filterItems);
  document.addEventListener("DOMContentLoaded", displayItems);

  checkUI();
}

init();
