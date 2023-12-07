import menuArray from '/data.js'

let orderArray = []

document.addEventListener("click", function(e) {
    if (e.target.dataset.add) {
        console.log(e.target.dataset.add)
        handleAddButtonClick(e.target.dataset.add)
    }
})

function handleAddButtonClick(itemId) {

    const targetItemObj = menuArray.filter( function(menuItem) {
        return menuItem.id === itemId
    })[0]

    orderArray.push(targetItemObj)
    console.log(orderArray)
}

function getMenuHtml() {
     
    let menuHtml = ""

    menuArray.forEach( function(item) {

        menuHtml +=`
        <div class="menu-item"">
            <div class="item-image">
                <h2>${item.emoji}</h2>
            </div>
            <div>
                <h3>${item.name}</h3>
                <p>${item.ingredients.join(", ")}</p>
                <h4>$${item.price}</h4>
            </div>
            <div class="add-btn-container">
                <button class="add-button" data-add="${item.id}">
                    <i class="fa-light fa-plus" data-add="${item.id}"></i>
                </button>
            </div>
        </div>`
    })

    return menuHtml
}

function renderMenu() {
    document.getElementById("menu-container").innerHTML = getMenuHtml()
}

renderMenu()
