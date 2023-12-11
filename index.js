import menuArray from '/data.js'

const paymentModal = document.getElementById("payment-modal")

let orderArray = []

document.addEventListener("click", function(e) {
    if (e.target.dataset.add) {
        handleAddButtonClick(e.target.dataset.add)
    } else if (e.target.dataset.remove) {
        handleRemoveButtonClick(e.target.dataset.remove)
    } else if (e.target.id === "purchase-button") {
        handlePurchaseButtonClick()
    } else if (e.target.id === "pay-button") {
        e.preventDefault()
        handlePayButtonClick()
    } else if (e.target.id === "payment-modal-close-btn") {
        closePaymentModal()
    }
})

window.addEventListener("click", rootClick)

// paymentModal.addEventListener("click", modalClick)

function handleAddButtonClick(itemId) {

    const targetItemObj = menuArray.filter( function(menuItem) {
        return menuItem.id === itemId
    })[0]

    orderArray.push(targetItemObj)

    document.getElementById("checkout-section").style.display = "flex"

    renderOrder()

}

function handleRemoveButtonClick(itemId) {
    
    const targetItemObj = menuArray.filter( function(menuItem) {
        return menuItem.id === itemId
    })[0]

    orderArray.pop(targetItemObj)

    if (orderArray.length > 1) {
        renderOrder()
    } else if (orderArray.length === 1) {
        renderOrder()
        document.getElementById("order-discount-container").style.display = "none" 
    }
    else {
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
        document.getElementById("order-sum").innerHTML = `<h4>$${(sumToPay * 0.85).toFixed(2)}</h4>`
        document.getElementById("order-discount-container").style.display = "flex"
        document.getElementById("order-discount-container").innerHTML = `
            <h4>Your discount:</h4>
            <div class="order-discount" id="order-discount">
                <h4>$${(sumToPay * 0.15).toFixed(2)}</h4>
            </div>`
    } else {
        document.getElementById("order-sum").innerHTML = `<h4>$${sumToPay}</h4>`
    }

}

// Add here a condition for else if above

function handlePurchaseButtonClick() {
    paymentModal.style.display = "flex"
}

function closePaymentModal() {
    paymentModal.style.display = "none"
}

function rootClick(e) {
    if (paymentModal.style.display === "flex" &&
        e.target.id !== "payment-modal" &&
        e.target.id !== "pay-button" &&
        e.target.id !== "purchase-button" &&
        !paymentModal.contains(e.target)) {
        // Element clicked was not the modal or its children — close the modal
        console.log("clicked")
        closePaymentModal()
        }
}

// function modalClick(e) {
//     e.preventDefault()
//     e.stopPropagation()
//     e.stopImmediatePropagation()
//     return false
// }

function handlePayButtonClick() {

        const form = document.querySelector("form")

        if(!form.checkValidity()) {
        // If the form is not valid, prevent submission
        alert("Please fill in all required fields")
        } else {
            paymentModal.style.display = "none"

            document.getElementById("checkout-section").innerHTML = `
            <div class="order-complete-message-section"
                id="order-complete-message-section">
                <h8>Thank you! Your order is on its way!</h8>
                <h8>Please rate your experience</8>
                <div class="rating-container" id="rating-container"></div>
            </div>`
        }

        // Create a container for the rating stars
        const ratingContainer = document.getElementById("rating-container")

        // Generate 5 starts dynamically
        for (let i = 1; i <= 5; i++) {
            const star = document.createElement("span")
            star.className = "star fa-solid fa-star"
            star.dataset.rating = i
            star.addEventListener("click", handleStarClick)
            ratingContainer.append(star)
        }

}

// Define a function to handle star clicks
function handleStarClick(e) {
    const rating = e.target.dataset.rating
    
    console.log(rating)

    // Clear the rating container
    document.getElementById("rating-container").innerHTML = ""

    // Add gold stars, the quantity of them = the rating a user gives
    for (let i = 1; i <= rating; i++) {
        const goldStar = document.createElement("span")
        goldStar.className = "goldStar fa-solid fa-star"
        document.getElementById("rating-container").append(goldStar)
    }

    // Add gray stars, to show that a user rated it for less than 5 stars
    let notRating = 5 - rating

    for (let i = 1; i <= notRating; i++) {
        const star = document.createElement("span")
        star.className = "star fa-solid fa-star"
        document.getElementById("rating-container").append(star)
    }
    
    // alert(`You rated your experience as ${rating} stars!`)
    
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
                <i class="fa-light fa-plus add-button" data-add="${item.id}"></i>
            </div>
        </div>`
    })

    return menuHtml
}

function renderMenu() {
    document.getElementById("menu-container").innerHTML = getMenuHtml()
}

renderMenu()
