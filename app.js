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
            { id: 0, name: 'Stake Dinner', calories: 1200 },
            { id: 1, name: 'Cookie', calories: 400 },
            { id: 2, name: 'Eggs', calories: 300 }
        ],
        currentItem: null,
        totalCalories: 0
    };

    // Public Methods
    return {
        getItems: function(){
            return data.items;
        },
        logData: function() {
            return data;
        }
    };
})();

// UI Controller
const UICtrl = (function() {

    // obj to centralize selector names
    const UISelectors = {
        itemList: '#item-list',
    }

    // Public Methods
    return {
        populateItemList: function(items){
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
        }
    };
})();
// App Controller
const App = (function(itemCtrl, UICtrl) {

    // Public Methods
    return {
        // the initialization of the app
        init: function() {
            console.log('initializing app...');
            // Fetch items from data structure
            const items= itemCtrl.getItems();
            // populate list with items
            UICtrl.populateItemList(items);

        }
    };
})(itemCtrl, UICtrl);

App.init();
