/**
 * Andy Thai, Thomas Lu
 * 11/4/2023
 * Section AE: Allison Ho, Kevin Wu
 * JS file, showcasing the initialization of various buttons throughout the
 * website, forms for users to add information to login or sign up in, and a
 * search and filtering option for users to minimize results. In terms of each
 * item, users can click on each item in detail. Add to cart features are also
 * added, with results being shown in a cart. Users can remove items, if necessary,
 * before confirming and submitting the transaction with a code generated as
 * receipt. Users can see their transactions history based on their code.
 */

"use strict";

(function() {
  window.addEventListener("load", init);
  const HUNDRED = 100;
  const TWENTYTWO = 22;
  const THIRTYFIVE = 35;
  const COOKIEVALUE = document.cookie
    .split("; ")
    .find((row) => row.startsWith("username="))
    ?.split("=")[1];
  let order = JSON.parse(localStorage.getItem('order')) || [];

  /**
   * Initializes all buttons and toggling of pages throughout the beanie website.
   * No return value.
   */
  function init() {
    loadingHome();
    searchButton();
    determineCookie();
    history();
    loginSignup();
    if (id('confirm-order')) {
      id('confirm-order').addEventListener('click', function() {
        id('cart-page').classList.add('hidden');
        id('checkout-page').classList.remove('hidden');
      });
    }
    categoryFiltering();
    id('home-button').addEventListener('click', function() {
      loadingHome();
      id('cart-display').innerHTML = '';
    });
    if (id('toggle-views')) {
      id('toggle-views').addEventListener('click', function() {
        switchViews();
      });
    }
  }

  /**
   * Initializing the buttons for users to have the option to filter beanie items
   * by category. The three options are either Bear, Rodent, or back to unfiltered
   * items.
   * No return value.
   */
  function categoryFiltering() {
    id('animal').addEventListener('click', function() {
      let category = 'Animal';
      filtering(category);
    });
    id('aquatic').addEventListener('click', function() {
      let category = 'Aquatic';
      filtering(category);
    });
    id('bear').addEventListener('click', function() {
      let category = 'Bear';
      filtering(category);
    });
    id('licensed').addEventListener('click', function() {
      let category = 'Licensed';
      filtering(category);
    });
    id('rodent').addEventListener('click', function() {
      let category = 'Rodent';
      filtering(category);
    });
  }

  /**
   * Initializes the transactions page upon clicking the "Your Transactions"
   * button on the hompage.
   * No return value.
   */
  function history() {
    id('history').addEventListener('click', function() {
      id('detailed-view').innerHTML = "";
      id('homepage').classList.add('hidden');
      id('detailed-view').classList.add('hidden');
      id('confirmation-page').classList.add('hidden');
      id('transaction-page').classList.remove('hidden');
      id('cart-page').classList.add('hidden');
      retrieveTransaction();
    });
  }

  /**
   * Initializing the buttons within the login and sign up page. This includes
   * clicking the button to start loggining in/ signing up, toggling between
   * the login and sign up page, and submitting information to either sign up
   * to create an account or login to their existing account.
   * No return value.
   */
  function loginSignup() {
    id('login-button').addEventListener('click', function() {
      id('homepage').classList.add('hidden');
      id('checkout').classList.add('hidden');
      id('login-page').classList.remove('hidden');
    });
    id('signup-button').addEventListener('click', function() {
      id('homepage').classList.add('hidden');
      id('checkout').classList.add('hidden');
      id('signup-page').classList.remove('hidden');
    });
    id('login').addEventListener('submit', (event) => {
      event.preventDefault();
      makeLoginRequest();
    });
    id('signup').addEventListener('submit', (event) => {
      event.preventDefault();
      makeSignupRequest();
    });
  }

  /**
   * Checks whether a cookie exists or not when user is on the webpage. If so,
   * users can buy the beanie items. Users would only be allowed to just see
   * each item with its respective details, as well as filtering and searching.
   * No return value.
   */
  function determineCookie() {
    if (!(COOKIEVALUE === undefined)) {
      displayCart(order);
      id('cart-container').disabled = false;
      id('history').disabled = false;
      history();
      id('signup').classList.add('hidden');
      id('homepage').classList.remove('hidden');
      id('login-button').classList.add('hidden');
      id('signup-button').classList.add('hidden');
      if (id('cart-container')) {
        id('cart-container').addEventListener('click', function() {
          displayCart(order);
          if (id('clear-order')) {
            id('clear-order').addEventListener('click', function() {
              clearOrder();
              id('clear-message').classList.remove('hidden');
            });
          }
          id('confirm-order').addEventListener('click', function() {
            checkoutPage();
          });
          id('history').disabled = true;
        });
      }
    } else {
      id('cart-container').disabled = true;
      id('history').disabled = true;
    }
  }

  /**
   * Hides certain pages and messages when necessary.
   * No return value.
   */
  function addHidden() {
    id('homepage').classList.add('hidden');
    id('login-page').classList.add('hidden');
    id('signup').classList.add('hidden');
    id('checkout-page').classList.add('hidden');
    id('confirmation-page').classList.add('hidden');
    id('clear-message').classList.add('hidden');
    id('transaction-page').classList.add('hidden');
    id('detailed-view').classList.add('hidden');
    id('cart-page').classList.add('hidden');
  }

  /**
   * Fetches transaction information based on the confirmation codes and cookie to create
   * a transaction history page.
   * No return value.
   */
  async function retrieveTransaction() {
    try {
      let res = await fetch('/stuffies/transaction/history?cookie=' + COOKIEVALUE);
      await statusCheck(res);
      res = await res.json();
      displayHistory(res);

    } catch (err) {
      handleResponse(err);
    }
  }

  /**
   * Displays all the history of transactions in one page. Sorted by the most
   * recent transaction top to bottom.
   * No return value.
   * @param {json} response - array of updated tranasactions made by the user.
   */
  function displayHistory(response) {
    id('list-history').innerHTML = "";
    response.forEach(i => {
      let beanieCard = displayOrder(i);
      id('list-history').appendChild(beanieCard);
    });
  }

  /**
   * Filters items by respective category for user when choosing a category.
   * No return value
   * @param {string} category - name of the category.
   */
  async function filtering(category) {
    try {
      let res = await fetch('/stuffies/filtering?category=' + category);
      res = await res.json();
      displayHome(res);
    } catch (err) {
      handleResponse(err);
    }
  }

  /**
   * Allows users to switch views from grid to list and vice versa.
   * No return value.
   */
  function switchViews() {
    id('list-container').classList.toggle('grid');
    id('list-container').classList.toggle('list');
    let cards = id('list-container').querySelectorAll("article");
    for (let i = 0; i < cards.length; i++) {
      cards[i].classList.toggle('card-style');
      cards[i].classList.toggle('list-style');
    }
  }

  /**
   * Fetches information from a URL of our own, resulting in whether information provided
   * is found or not when logging in.
   * No return value.
   */
  async function makeLoginRequest() {
    let data = new FormData();
    data.append('username', id('username').value);
    data.append('password', id('password').value);
    try {
      let res = await fetch('/stuffies/login', {method: 'POST', body: data});
      await statusCheck(res);
      res = await res.json();
      res = cookieRequest(res);
      id('login-page').classList.add('hidden');
      id('signup').classList.add('hidden');
      id('homepage').classList.remove('hidden');
      id('login-button').classList.add('hidden');
      id('signup-button').classList.add('hidden');
      id('cart-container').disabled = false;
      id('transaction-page').disabled = false;
      searchButton();
      determineCookie();
    } catch (err) {
      id('login_response').textContent = 'incorrect username or password.';
    }
    loadingHome();
  }

  /**
   * Fetches information from a URL of our own to sign up. Checks whether or not
   * email or username are already used.
   * No return value.
   */
  async function makeSignupRequest() {
    let data = new FormData();
    data.append('name', id('name-input').value);
    data.append('email', id('email-input').value);
    data.append('username', id('username-input').value);
    data.append('password', id('password-input').value);
    try {
      let res = await fetch('/stuffies/signup', {method: 'POST', body: data});
      await statusCheck(res);
      res = await res.json();
      res = cookieRequest(res);
      id('login-page').classList.add('hidden');
      id('signup').classList.add('hidden');
      id('login-button').classList.add('hidden');
      id('signup-button').classList.add('hidden');
      id('cart-container').disabled = false;
      id('transaction-page').disabled = false;
      loadingHome();
      searchButton();
      determineCookie();
    } catch (err) {
      id('signup-response').textContent = 'email or username already taken';
    }
  }

  /**
   * Requests for cookie to either be made or retreived.
   * No return value.
   * @param {json} res - information of user's sign up or login input.
   */
  async function cookieRequest(res) {
    try {
      let cookie = await fetch('/storage/' + res['username']);
      await statusCheck(cookie);
      cookie = await cookie.text();
    } catch (err) {
      handleResponse(err);
    }
  }

  /**
   * Fetches information from the third endpoint. Loads all beanie information
   * to main page.
   * No return value.
   */
  async function loadingHome() {
    try {
      let res = await fetch('/stuffies/beanies');
      await statusCheck(res);
      res = await res.json();
      displayHome(res);
    } catch (err) {
      handleResponse(err);
    }
    id('detailed-view').innerHTML = '';
    id('history').disabled = false;
    id('cart-container').disabled = false;
  }

  /**
   * Displays the home page with the array of all beanie objects within the json file.
   * No return value.
   * @param {json} response - json array of all the beanie information
   */
  function displayHome(response) {
    addHidden();
    id('homepage').classList.remove('hidden');
    id('list-container').innerHTML = "";
    response.page.forEach(i => {
      let beanieCard = insertContent(i, order);
      id('list-container').appendChild(beanieCard);
    });
  }

  /**
   * Adding all necessary content from given json file array for users
   * to see. All of the given yip cards will be shown on the home-page.
   * @param {integer} i - element of array of the yip information.
   * @param {array} order - array of items to be ordered
   * @return {array} order - content of all the yip information.
   */
  function insertContent(i, order) {
    let card = gen('article');
    card.classList.add('grid-style');
    let name = gen('h3');
    let add = getPrice(i);
    add.id = i.id;
    add.addEventListener('click', (event) => {
      event.preventDefault();
      addOrder(add.id, order);
    });
    name.textContent = truncate(i.name, THIRTYFIVE);
    let img = genImage(i);
    img.addEventListener('click', function() {
      fetchDetails(i.name);
    });
    card.appendChild(img);
    card.appendChild(name);
    card.appendChild(add);
    return card;
  }

  /**
   * Generates image based off of fetch request and beanie.
   * @param {integer} i - the respective beanie
   * @returns {string} image - the image for the respective beanie.
   */
  function genImage(i) {
    let image = gen('img');
    if (i.img) {
      image.src = i.img;
    } else {
      image.src = 'images/alia.png';
    }
    image.alt = 'a picture of ' + i.name;
    return image;
  }

  /**
   * Generates price based off of fetch request and beanie.
   * @param {integer} i - the respective beanie
   * @returns {string} price - the price for the respective beanie.
   */
  function getPrice(i) {
    let parent = gen('section');
    parent.classList.add('price-details');
    let num = gen('p');
    num.textContent = "$" + i.price;
    let price = gen('button');
    price.classList.add('price');
    let cart = gen('img');
    price.textContent = 'add to cart';
    cart.src = 'images/shopping-cart.png';
    price.id = i.id;
    price.appendChild(cart);
    parent.appendChild(num);
    parent.appendChild(price);
    return parent;
  }

  /**
   * Fetches all of the specific information for chosen beanie to create a detailed
   * information about the beanie. No return value.
   * @param {string} name - name of the beanie.
   */
  async function fetchDetails(name) {
    try {
      let res = await fetch('stuffies/user?name=' + name);
      await statusCheck(res);
      res = await res.json();
      getDetails(res);
    } catch (err) {
      handleResponse(err);
    }
  }

  /**
   * Generates the individual details of the beanie.
   * No return value.
   * @param {object} res - the information of the respective beanie
   */
  function getDetails(res) {
    addHidden();
    let parent = id('detailed-view');
    parent.classList.remove('hidden');
    parent.innerHTML = '';
    let left = gen('section');
    left.classList.add('details');
    let right = gen('section');
    right.classList.add('details');
    let img = genImage(res[0]);
    img.classList.add('large');
    let details = genDetails(res);
    left.appendChild(img);
    right.appendChild(details);
    parent.appendChild(left);
    parent.appendChild(right);
  }

  /**
   * Generates the header of the detailed page of a beanie.
   * @param {object} res - information of the respective beanie
   * @returns {section} parent - header portion of the detailed view.
   */
  function genDetails(res) {
    let parent = gen('ul');
    let name = gen('li');
    name.textContent = 'Item Name: ' + res[0]['name'];
    parent.appendChild(name);
    addDetails(parent, res);
    return parent;
  }

  /**
   * Generates the core details of the beanie information, including
   * stock, beanie description, category and sub category, and generation.
   * No return value.
   * @param {section} parent - header section of the detailed view.
   * @param {object} res - information of the respective beanie
   */
  function addDetails(parent, res) {
    if (res[0]['stock']) {
      let stock = gen('li');
      stock.textContent = 'Stock: ' + res[0]['stock'];
      parent.appendChild(stock);
    }
    if (res[0]['beanie_description']) {
      let description = gen('li');
      description.textContent = 'Description: ' + res[0]['beanie_description'];
      parent.appendChild(description);
    }
    if (res[0]['category']) {
      let category = gen('li');
      category.textContent = 'Category: ' + res[0]['category'];
      parent.appendChild(category);
    }
    if (res[0]['sub-category']) {
      let subCategory = gen('li');
      subCategory.textContent = 'Sub Category: ' + res[0]['sub-category'];
      parent.appendChild(subCategory);
    }
    if (res[0]['generation']) {
      let generation = gen('li');
      generation.textContent = 'Generation: ' + res[0]['generation'];
      parent.appendChild(generation);
    }
  }

  /**
   * Search button for user to search filtered yip results.
   * No return value.
   */
  function searchButton() {
    let button = id('search-btn');
    let input = id('search-term');
    id('search-term').addEventListener('input', function(event) {
      input = event.target.value;
      if (input.trim() === '') {
        button.disabled = true;
      } else {
        button.disabled = false;
      }
      id('search-btn').addEventListener('click', function() {
        button.disabled = true;
        searchEndpoint(input);
      });
    });
  }

  /**
   * Helps user search different informations of beanies by keywords.
   * No return value.
   * @param {string} input - the phrase that the user inputted.
   */
  async function searchEndpoint(input) {
    id('list-container').innerHTML = "";
    try {
      let array = await fetch('/stuffies/beanies');
      array = await array.json();
      try {
        addHidden();
        id('homepage').classList.remove('hidden');
        searchQuery(input);
        let res = await fetch('/stuffies/beanies?search=' + input);
        await statusCheck(res);
        res = await res.json();
        for (let i = 0; i < res.page.length; i++) {
          for (let j = 0; j < array.page.length; j++) {
            if (array['page'][j]['img'] === res['page'][i]['img']) {
              let beanieArticle = insertContent(array['page'][j]);
              id('list-container').appendChild(beanieArticle);
            }
          }
        }
      } catch (error) {
        handleResponse(error);
      }
    } catch (err) {
      handleResponse(err);
    }
  }

  /**
   * Written out what the user is searching for when searching in the search bar.
   * No return value.
   * @param {string} input - input user is search for.
   */
  function searchQuery(input) {
    if (input) {
      id('search-qry').textContent = input;
    } else {
      id('search-qry').textContent = 'All';
    }
  }

  /**
   * Generates individual beanie information that the user is planning to buy.
   * @param {integer} i - the respective beanie
   * @returns {section} card - individual beanie that the user is planning to buy.
   */
  function displayOrder(i) {
    let card = gen('article');
    card.classList.add('cart-style');
    let sub = gen('section');
    let name = gen('h3');
    name.textContent = i.name;
    let img = genImage(i);
    let price = gen('p');
    price.textContent = "$" + i.price;
    card.appendChild(img);
    card.appendChild(name);
    sub.appendChild(price);
    sub.classList.add('sub');
    if (i.code) {
      let code = gen('p');
      code.textContent = i.code;
      sub.appendChild(code);
    }
    card.appendChild(sub);
    return card;
  }

  /**
   * Adding item necessary to the list of orders. No return value.
   * @param {object} id - specific item to be added as part of the order.
   * @param {array} order - array  of items to be added for cart buying
   */
  async function addOrder(id, order) {
    try {
      let res = await fetch('/stuffies/transaction/addItem/?id=' + id);
      await statusCheck(res);
      res = await res.json();
      recordOrder(res, order);
    } catch (err) {
      handleResponse(err);
    }
  }

  /**
   * records beanie information when buying.
   * @param {object} res - information of respective beanie
   * @param {array} order - list of beanies to be bought
   * @returns {order} - updated array of items to be bought
   */
  function recordOrder(res, order) {
    order.push(res);
    order = JSON.stringify(order);
    localStorage.setItem('order', order);
    return order;
  }

  /**
   * Displays the informaiton regarding beanies that user is planning to buy.
   * No return value.
   * @param {json} storage - newly updated array of beanies depending on user input of buying.
   */
  function displayCart(storage) {
    id('cart-display').innerHTML = '';
    id('detailed-view').innerHTML = '';
    addHidden();
    id('cart-page').classList.remove('hidden');
    let sum = 0;
    storage.forEach(i => {
      let beanieCard = displayOrder(i);
      id('cart-display').appendChild(beanieCard);
      sum += i.price;
      sum = Math.round(sum * HUNDRED) / HUNDRED;
    });
    id('total').textContent = "Your total is: $" + sum;
  }

  /**
   * Clears all items in cart when clicked.
   * No return value.
   */
  function clearOrder() {
    localStorage.removeItem('order');
    id("cart-display").innerHTML = "";
    order = [];
    displayCart(order);
  }

  /**
   * Page where user can checkout after confirming transaction.
   * No return value.
   */
  function checkoutPage() {
    id('checkout-display').innerHTML = '';
    order.forEach(i => {
      let beanieCard = displayOrder(i);
      id('checkout-display').appendChild(beanieCard);
    });
    id('submit-order').addEventListener('click', function() {
      addTransaction(order);
      id('checkout-page').classList.add('hidden');
      id('confirmation-page').classList.remove('hidden');
      localStorage.removeItem('order');
      order = [];
    });
  }

  /**
   * Directing user to homepage after clicking "BEANIES.NET".
   * No return value.
   */
  function homePage() {
    addHidden();
    id('homepage').classList.remove('hidden');
    loadingHome();
  }

  /**
   * Fetches request of adding transaction, letting user know if transaction
   * was successful or not. If successful, confirmation code will be
   * generated.
   * No return value.
   */
  function addTransaction() {
    const characters = "abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let confirmCode = '';
    for (let i = 0; i < TWENTYTWO; i++) {
      let index = Math.floor(Math.random() * characters.length);
      confirmCode += characters[index];
    }
    fetchTransaction(confirmCode);
  }

  /**
   * Iterates through all the items in the order with its respective information
   * No return value.
   * @param {string} confirmCode - generated code once transaction is successful.
   */
  function fetchTransaction(confirmCode) {
    for (let i = 0; i < order.length + 1; i++) {
      if (i === order.length + 1) {
        id('error-message').textContent = 'Please redirect yourself to the home page.';
      } else {
        actualFetchTransaction(confirmCode, i);
      }
    }
  }

  /**
   * Determines if transaction is successful, depending on the stock of the item.
   * No return value.
   * @param {string} confirmCode - generated code once transaction is successful.
   * @param {integer} i - each information of the respective beanies.
   */
  async function actualFetchTransaction(confirmCode, i) {
    let data = new FormData();
    data.append('code', confirmCode);
    data.append('id', order[i]['id']);
    data.append('cookie', COOKIEVALUE);
    data.append('category', order[i]['category']);
    data.append('subCategory', order[i]['sub-category']);
    data.append('name', order[i]['name']);
    data.append('generation', order[i]['generation']);
    data.append('description', order[i]['description']);
    data.append('img', order[i]['img']);
    data.append('price', order[i]['price']);
    try {
      let res = await fetch('/stuffies/transaction/success', {method: 'POST', body: data});
      await statusCheck(res);
      res = await res.text();
      id('confirmation-code').textContent = res;
      localStorage.removeItem('order');
      id('home-view').addEventListener('click', function() {
        homePage();
      });
    } catch (err) {
      id('error-message').textContent = '>.<';
    }
  }

  /**
   * shrinks array depending on size of string.
   * @param {string} str - string to be inputted
   * @param {integer} maxlength - length of the array
   * @returns {string} a newly formed truncated string.
   */
  function truncate(str, maxlength) {
    if (str.length > maxlength) {
      return str.slice(0, maxlength - 1) + '…';
    }
    return str;
  }

  /**
   * Provides a message to the user when something goes wrong with any information.
   * @param {object} err - error from either client or server.
   * @returns {string} - string object called 'not found'.
   */
  function handleResponse(err) {
    return 'error: ' + err;
  }

  /**
   * Helper function to return the response's result text if successful, otherwise
   * returns the rejected Promise result with an error status and corresponding text
   * @param {object} res - response to check for success/error
   * @return {object} - valid response if response was successful, otherwise rejected
   *                    Promise result
   */
  async function statusCheck(res) {
    if (!res.ok) {
      throw new Error(await res.text());
    }

    return res;
  }

  /**
   * Returns a new and empty DOM node as an element of a certain type.
   * @param {string} tagName - element of the created node.
   * @returns {object} - DOM object associated with creating an element(s).
   */
  function gen(tagName) {
    return document.createElement(tagName);
  }

  /**
   * Returns element with the id attribute and its respective value.
   * @param {string} id - element of the id.
   * @returns {object} - DOM object associated with the id.
   */
  function id(id) {
    return document.getElementById(id);
  }
})();