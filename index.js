import menuArray from '/data.js'

function getMenuHtml() {
     
    let menuHtml = ""

    menuArray.forEach( function(item) {

        menuHtml +=`
        <div class="menu-item" id="${item.id}">
            <div class="item-image">
                <h2>${item.emoji}</h2>
            </div>
            <div>
                <h3>${item.name}</h3>
                <p>${item.ingredients}</p>
                <h4>$${item.price}</h4>
            </div>
            <div class="add-btn-container">
                <button class="add-button">
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
