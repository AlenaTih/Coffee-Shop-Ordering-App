import menuArray from './data.js'

const paymentModal = document.getElementById("payment-modal")

const inputName = document.getElementById("input-name")

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
    } else if (e.target.dataset.more) {
        handleAddButtonClick(e.target.dataset.more)
    }
})

window.addEventListener("click", rootClick)

function handleAddButtonClick(itemId) {
    const [itemIdWithoutSize, size] = itemId.split("-")
    const targetItemObj = menuArray.find( (menuItem) => menuItem.id === itemIdWithoutSize)

    if (targetItemObj) {
        const existingOrderItem = orderArray.find(
            (orderItem) => orderItem.id === itemIdWithoutSize && orderItem.size === size
        )

        if (existingOrderItem) {
            // If the same item and size already exist, increase the quantity
            existingOrderItem.quantity += 1
        } else {
            // Otherwise, create a new order item with quantity 1
            const selectedItem = {
                ...targetItemObj,
                size,
                price: targetItemObj.prices[targetItemObj.sizes.indexOf(size)],
                quantity: 1,
            }

            orderArray.push(selectedItem)
        }

        document.getElementById("checkout-section").style.display = "flex"
        renderOrder()
    }
}

function handleRemoveButtonClick(itemId) {
    const [itemIdWithoutSize, size] = itemId.split("-")
    const targetItemObj = menuArray.find( (menuItem) => menuItem.id === itemIdWithoutSize)

    const existingOrderItem = orderArray.find(
        (orderItem) => orderItem.id === itemIdWithoutSize && orderItem.size === size
    )

    if (existingOrderItem) {
        // If quantity is greater than 1, decrease the quantity
        if (existingOrderItem.quantity > 1) {
            existingOrderItem.quantity -= 1
        } else {
            // If quantity is 1 or less, remove the item from the order array
            orderArray = orderArray.filter(
                (orderItem) => !(orderItem.id === itemIdWithoutSize && orderItem.size === size)
            )
        }

        if (orderArray.length >= 1) {
            renderOrder()
        } else {
            document.getElementById("checkout-section").style.display = "none"
        }
    }
}

function renderOrder() {
    let orderHtml = ""
    let totalPrice = 0
    let totalQuantity = 0

    orderArray.forEach( (orderItem) => {
        orderHtml += `
            <div class="order-item">
                <h3>${orderItem.name} - ${orderItem.size} *${orderItem.quantity}</h3>
                <button
                    class="more-button"
                    data-more="${orderItem.id}-${orderItem.size}">
                    +
                </button>
                <button
                    class="remove-button"
                    data-remove="${orderItem.id}-${orderItem.size}">
                    -
                </button>
                <div class="order-item-price">
                    <h4>$${(orderItem.price * orderItem.quantity).toFixed(2)}</h4>
                </div>
            </div>`

        totalPrice += orderItem.price * orderItem.quantity
        totalQuantity += orderItem.quantity
    })

    document.getElementById("order-items").innerHTML = orderHtml

    if (totalQuantity > 1) {
        // Apply a 15% discount if there are more than 1 item
        const discountedPrice = totalPrice * 0.85
        document.getElementById("order-sum").innerHTML = `<h4>$${discountedPrice.toFixed(2)}</h4>`;
        document.getElementById("order-discount-container").style.display = "flex"
        document.getElementById("order-discount-container").innerHTML = `
            <h4>Your discount:</h4>
            <div class="order-discount" id="order-discount">
                <h4>$${(totalPrice - discountedPrice).toFixed(2)}</h4>
            </div>`
    } else {
        document.getElementById("order-sum").innerHTML = `<h4>$${totalPrice.toFixed(2)}</h4>`
        document.getElementById("order-discount-container").style.display = "none"
    }
}



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
        closePaymentModal()
        }
}

function handlePayButtonClick() {

        const form = document.querySelector("form")

        if(!form.checkValidity()) {
        // If the form is not valid, prevent submission
        alert("Please fill in all the fields")
        } else {
            paymentModal.style.display = "none"

            document.getElementById("checkout-section").innerHTML = `
            <div class="order-complete-message-section"
                id="order-complete-message-section">
                <h8>Thank you, ${inputName.value}! Your order is on its way!</h8>
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
        <div class="menu-item">
            <div class="item-image-container">
                <img class="item-image" src="images/${item.image}">
            </div>
            <div class="menu-details">
                <h3>${item.name}</h3>
                <p>${item.ingredients}</p>
                <div class="prices-container">
                    <h4>$${item.prices[0]}</h4>
                    <h4>$${item.prices[1]}</h4>
                    <h4>$${item.prices[2]}</h4>
                </div>
                <div class="portion-sizes">
                    ${item.sizes.map( size =>
                        `<button
                            class="size-button"
                            data-add="${item.id}-${size}">
                            ${size}
                        </button>`).join("")}
                </div>
            </div>
        </div>`
    }) 

    return menuHtml
}

function renderMenu() {
    document.getElementById("menu-container").innerHTML = getMenuHtml()
}

renderMenu()
