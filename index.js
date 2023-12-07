import menuArray from '/data.js'

let orderArray = []

document.addEventListener("click", function(e) {
    if (e.target.dataset.add) {
        handleAddButtonClick(e.target.dataset.add)
    } else if (e.target.dataset.remove) {
        handleRemoveButtonClick(e.target.dataset.remove)
    } else if (e.target.id === "purchase-button") {
        handlePurchaseButtonClick()
    } else if (e.target.id === "pay-button") {
        handlePayButtonClick()
    }
})

function handleAddButtonClick(itemId) {

    const targetItemObj = menuArray.filter( function(menuItem) {
        return menuItem.id === itemId
    })[0]

    orderArray.push(targetItemObj)

    document.getElementById("checkout-section").style.display = "flex"

    renderOrder()

}

function handleRemoveButtonClick(itemId) {
    console.log("clicked" + itemId)

    const targetItemObj = menuArray.filter( function(menuItem) {
        return menuItem.id === itemId
    })[0]

    orderArray.pop(targetItemObj)

    if (orderArray.length > 0) {
        renderOrder()
    } else {
        document.getElementById("checkout-section").style.display = "none"
    }

}

function renderOrder() {
    
    let orderHtml = ""

    let totalPrice = []

    orderArray.forEach( function(orderItem) {

        orderHtml +=`
        <div class="order-item">
            <h3>${orderItem.name}</h3>
            <button class="remove-button" data-remove="${orderItem.id}">remove</button>
            <div class="order-item-price">
                <h4>$${orderItem.price}</h4>
            </div>
        </div>`

        totalPrice.push(orderItem.price)
    })

    document.getElementById("order-items").innerHTML = orderHtml

    const sumToPay = totalPrice.reduce( function(total, currentPrice) {
        return total + currentPrice
    })

    if (orderArray.length > 1) {
        document.getElementById("order-sum").innerHTML = `<h4>$${Math.floor(sumToPay * 0.85)}</h4>`
    } else {
        document.getElementById("order-sum").innerHTML = `<h4>$${sumToPay}</h4>`
    }

}

function handlePurchaseButtonClick() {
    document.getElementById("payment-modal").style.display = "flex"
}

function handlePayButtonClick() {
    document.getElementById("payment-modal").style.display = "none"

    document.getElementById("checkout-section").innerHTML = `
        <div class="order-complete-message-section"
            id="order-complete-message-section">
            <h8>Thanks, James! Your order is on its way!</h8>
            <h8>Rate your experience</8>
            <button class="rate-button" id="rate-button">⭐️⭐️⭐️⭐️⭐️</button>
        </div>`

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
