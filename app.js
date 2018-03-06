// Storage Controller

// Item Controller
const itemCtrl = (function() {
    // Item Constructor
    const Item = function(id, name, calories) {
        this.id = id;
        this.name = name;
        this.calories = calories;
    };

    //Data Structure (State)
    const data = {
        items: [
            // { id: 0, name: 'Stake Dinner', calories: 1200 },
            // { id: 1, name: 'Cookie', calories: 400 },
            // { id: 2, name: 'Eggs', calories: 300 }
        ],
        currentItem: null,
        totalCalories: 0
    };

    // Public Methods
    return {
        getItems: function() {
            return data.items;
        },
        addItem: function(name, calories) {
            let ID;
            // Create ID
            if (data.items.length > 0) {
                ID = data.items[data.items.length - 1].id + 1;
            } else {
                ID = 0;
            }
            //Calories to numbers
            calories = parseInt(calories);
            // Create new item
            newItem = new Item(ID, name, calories);
            data.items.push(newItem);
            // update calories count
            this.addCalories(newItem);
            return newItem;
        },
        getItemById: function(id) {
            let found = null;
            data.items.forEach(item => {
                if (item.id === id) {
                    found = item;
                }
            });
            return found;
        },
        setCurentItem: function(item) {
            data.currentItem = item;
        },
        getCurrentItem: function() {
            return data.currentItem;
        },
        logData: function() {
            return data;
        },
        addCalories: function(item) {
            data.totalCalories += item.calories;
        },
        getTotalCalories: function() {
            let total = 0;
            data.items.forEach(item => {
                total += item.calories;
            });
            data.totalCalories = total;
            return total;
        }
    };
})();

// UI Controller
const UICtrl = (function() {
    // obj to centralize selector names
    const UISelectors = {
        itemList: '#item-list',
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        totalCalories: '.total-calories'
    };

    // Public Methods
    return {
        populateItemList: function(items) {
            let html = '';
            items.forEach(item => {
                html += `
                        <li class="collection-item" id="item-${item.id}">
                            <strong>${item.name}: </strong>
                            <em>${item.calories} Calories</em>
                            <a href="#" class="secondary-content">
                                <i class="edit-item fa fa-pencil"></i>
                            </a>
                        </li>
                        `;
            });
            // insert list items
            document.querySelector(UISelectors.itemList).innerHTML = html;
        },
        getItemInput: function() {
            return {
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories: document.querySelector(UISelectors.itemCaloriesInput)
                    .value
            };
        },
        addListItem: function(item) {
            document.querySelector(UISelectors.itemList).style.display =
                'block';
            const li = document.createElement('li');
            li.className = 'collection-item';
            li.id = `item-${item.id}`;
            li.innerHTML = `
                            <strong>${item.name}: </strong>
                            <em>${item.calories} Calories</em>
                            <a href="#" class="secondary-content">
                                <i class="edit-item fa fa-pencil"></i>
                            </a>
                        `;
            document
                .querySelector(UISelectors.itemList)
                .insertAdjacentElement('beforeend', li);
        },
        showTotalCalories: function(totalCalories) {
            document.querySelector(
                UISelectors.totalCalories
            ).textContent = totalCalories;
        },
        clearFields: function() {
            document.querySelector('form').reset();
        },
        addItemToForm: function() {
            document.querySelector(
                UISelectors.itemNameInput
            ).value = itemCtrl.getCurrentItem().name;
            document.querySelector(
                UISelectors.itemCaloriesInput
            ).value = itemCtrl.getCurrentItem().calories;
            UICtrl.showEditState();
        },
        getSelectors: function() {
            return UISelectors;
        },
        hideList: function() {
            document.querySelector(UISelectors.itemList).style.display = 'none';
        },
        clearEditState: function() {
            UICtrl.clearFields();
            // hide update and delete buttons
            document.querySelector(UISelectors.updateBtn).style.display =
                'none';
            document.querySelector(UISelectors.deleteBtn).style.display =
                'none';
            document.querySelector(UISelectors.backBtn).style.display = 'none';
            document.querySelector(UISelectors.addBtn).style.display = 'inline';
        },
        showEditState:function() {
            // hide update and delete buttons
            document.querySelector(UISelectors.updateBtn).style.display =
                'inline';
            document.querySelector(UISelectors.deleteBtn).style.display =
                'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
            document.querySelector(UISelectors.addBtn).style.display = 'none';
        },
    };
})();

// App Controller
const App = (function(itemCtrl, UICtrl) {
    // Load event listeners
    const loadEventListeners = function() {
        const UISelectors = UICtrl.getSelectors();
        // Add item event
        document
            .querySelector(UISelectors.addBtn)
            .addEventListener('click', itemAddSubmit);
        // edit icon click event with event delegation
        document
            .querySelector(UISelectors.itemList)
            .addEventListener('click', itemUpdateSubmit);
    };
    // Add item Submit
    const itemAddSubmit = function(e) {
        // get form input from ui controller
        const input = UICtrl.getItemInput();
        // check for correct input
        if (input.name !== '' && input.calories !== '') {
            // add item to data model
            const newItem = itemCtrl.addItem(input.name, input.calories);
            // add item to ui list
            UICtrl.addListItem(newItem);
            // get total calories
            const totalCalories = itemCtrl.getTotalCalories();
            // update calories count
            UICtrl.showTotalCalories(totalCalories);
            // clean form
            UICtrl.clearFields();
        }
        e.preventDefault();
    };
    // update item submit
    const itemUpdateSubmit = function(e) {
        if (e.target.classList.contains('edit-item')) {
            //get the list item id
            const listId = e.target.parentNode.parentNode.id;
            // brake into an array
            const listIdArr = listId.split('-');
            const id = parseInt(listIdArr[1]);
            // get item
            const itemToEdit = itemCtrl.getItemById(id);
            console.log(id);
            console.log(itemToEdit);

            itemCtrl.setCurentItem(itemToEdit);
            UICtrl.addItemToForm();
        }
        e.preventDefault();
    };

    // Public Methods
    return {
        // the initialization of the app
        init: function() {
            // set initial state
            UICtrl.clearEditState();
            // Fetch items from data structure
            const items = itemCtrl.getItems();

            //check if any items
            if (items.length === 0) {
                UICtrl.hideList();
            } else {
                // populate list with items
                UICtrl.populateItemList(items);
            }
            // get total calories
            const totalCalories = itemCtrl.getTotalCalories();
            // update calories count
            UICtrl.showTotalCalories(totalCalories);
            // load event listeners
            loadEventListeners();
        }
    };
})(itemCtrl, UICtrl);

App.init();
