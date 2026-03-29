'use strict'

const catalog = document.getElementById('catalog')

const cartProductCounter = document.getElementById("card-product-counter")

const isCart = window.location.pathname.endsWith('cart.html')

fetch("./data/products.json").then( uploadProducts )

function uploadProducts(data) {
    data.json().then( getProducts )
}

let productsData = {}

function recalculateOrderSum() {
    let sum = 0

    for (let productName in order) {
        const count = Number(order[productName])
        const price = Number(productsData[productName]?.price)

        if (!isNaN(price) && !isNaN(count)) {
            sum += price * count
        }
    }

    const orderTotalSum = document.getElementById('order-total-sum')
    if (orderTotalSum) {
        orderTotalSum.innerText = sum + ' $'
    }
}

function getProducts(data) {
    productsData = data
    for (let comName in data) {
        if (isCart === true) {
            if (comName in order) {
                const comData = data[comName]
                const comCard = getProductCard(comName, comData)
                catalog.append(comCard)
            } 
        } else {
            const comData = data[comName]
            const comCard = getProductCard(comName, comData)
            catalog.append(comCard)            
        }
    
    }

    recalculateOrderSum()
}

function getImage(imageName) {
    const imageBox = document.createElement('div')
    imageBox.className = "image-box"
    
    const image = new Image()
    image.src = './imgs/' + imageName
    image.className = "slide-image visible"
    imageBox.append(image)

    return imageBox
}

function getProductCard(comName, comData) {
    const comCard = document.createElement('div')
    comCard.className = 'computer-card'

    const cardTitle = document.createElement('h4')
    cardTitle.innerText = comName
    comCard.append(cardTitle)

    const cardImage = getImage(comData.image[0])
    comCard.append(cardImage)

    const descriptionDiv = getDescriptionDiv(comData)
    comCard.append(descriptionDiv)

    const priceDiv = document.createElement('div')
    priceDiv.className = 'price'

    const priceSpan = document.createElement('span')
    priceSpan.innerText = 'Цена: ' + comData.price + '₸'

    priceDiv.append(priceSpan)
    comCard.append(priceDiv)

    const productOrderDiv = getProductOrderDiv(comName)
    comCard.append(productOrderDiv)

    return comCard
}

function getProductOrderDiv(comName) {
    const orderDiv = document.createElement('div')
    orderDiv.className = 'order'

    const firstButton = document.createElement('button')
    firstButton.className = 'add-to-cart'
    firstButton.innerText = 'В КОРЗИНУ'
    firstButton.onclick = () => {
        const counter = orderAdd(comName)
        updateProductOrderDiv(firstButton, removeButton, counterSpan, counter, addButton)
    }
    orderDiv.append(firstButton)

    const removeButton = document.createElement('button')
    removeButton.className = 'change-order-button'
    removeButton.innerText = '-'
    removeButton.onclick = () => {
        const counter = orderRemove(comName)
        updateProductOrderDiv(firstButton, removeButton, counterSpan, counter, addButton)
    }

    orderDiv.append(removeButton)

    const counterSpan = document.createElement('span')
    counterSpan.className = 'order-counter'
    counterSpan.innerText = 0
    orderDiv.append(counterSpan)

    const addButton = document.createElement('button')
    addButton.className = 'change-order-button'
    addButton.innerText = '+'
    addButton.onclick = () => {
        const counter =  orderAdd(comName)
        updateProductOrderDiv(firstButton, removeButton, counterSpan, counter, addButton)
    }

    orderDiv.append(addButton)


    let counter = 0
    if (comName in order) {
        counter = order[comName]
    }
    updateProductOrderDiv(firstButton, removeButton, counterSpan, counter, addButton)

    return orderDiv
}

function updateProductOrderDiv(firstButton, removeButton, counterSpan, counter, addButton) {
    counterSpan.innerText = counter

    if (counter > 0) {
        firstButton.style.display = 'none'
        removeButton.style.display = 'flex'
        counterSpan.style.display = 'flex'
        addButton.style.display = 'flex'
    } else {
        firstButton.style.display = 'flex'
        removeButton.style.display = 'none'
        counterSpan.style.display = 'none'
        addButton.style.display = 'none'        
    }

    if (isCart === true) {
    recalculateOrderSum()
    }
}

function getDescriptionDiv(data) {
    const div1 = document.createElement('div')

    for (let key in data) {
        if (typeof data[key] === 'object') continue
        if (key === 'price') continue

        const p = document.createElement('p')
        p.textContent = `${key}: ${data[key]}`
        div1.append(p)
    }

    return div1
}

let order = {}
let storageData = localStorage.getItem('order')
if (storageData) {
    order = JSON.parse(storageData)
    let count = 0
    for(let productName in order) {
        count += order[productName]
    }
    cartProductCounter.innerText = count
}

function updateLocalStorage() {
    const storageData = JSON.stringify(order)
    localStorage.setItem('order', storageData)
}

function updateCartCounter(value) {
    if (isCart === true) {
        return
    }

    const count = +cartProductCounter.innerText
    cartProductCounter.innerText = count + value
}

function orderAdd(productKey) {
    if (productKey in order) {
        order[productKey]++
    } else {
        order[productKey] = 1
    }
    updateLocalStorage()
    updateCartCounter(1)
    return order[productKey]
}

function orderRemove(productKey) {
    if (productKey in order === false) {
        return
    }
    
    order[productKey]--
    updateCartCounter(-1)

    const count = order[productKey]
    if (count === 0) {
        delete order[productKey]
    }

    updateLocalStorage()
    return count
}