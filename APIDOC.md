
# Shopping for Stuffed Animals API Documentation

## Logging In to Account
**Request Format:** /stuffies/login

**Request Type:** POST

**Returned Data Format**: Plain Text

**Description:** Takes in username and password inputted by user. Figures out whether if the username and password combination inputted by user exists in the JSON array of each personal information or not.

**Example Request:** /stuffies/login

**Example Response:**

```
Success!
```
The server will redirect the user to the home shopping page afterwards.

**Error Handling:**
- Possible 400 (invalid request) errors (all plain text):
  - If passed in an invalid parameter, such as a username and/or password that does not exists, returns an error with message `incorrect username or password`

## Creating an Account
**Request Format:** /stuffies/signup

**Request Type:** POST

**Returned Data Format**: Plain Text

**Description:** Takes in name, email, username, and password inputted by user. Figures out if the email and username are already taken in the JSON array of each personal information or not.

**Example Request:** /stuffies/signup

**Example Response:**

```
Successfully made a new account!
```
The server will redirect the user to the home shopping page afterwards.

**Error Handling:**
- Possible 400 (invalid request) errors (all plain text):
  - If passed in an invalid parameter, specifically if an email has already been used, returns an error with message `email is already being used`
  - If passed in an invalid parameter, specifically if a username has already been used, returns an error with message `username is already being used`

## Searching for stuffed animal
**Request Format:** /stuffies/search

**Request Type:** GET

**Returned Data Format**: json

**Description:** returns information according to given search


**Example Request:** query parameters of name=ABC'S

**Example Response:**
```json
{
  "id": 2,
  "name": "1997 Teddy (Holiday)",
  "category": "Bear",
  "sub_category": "NF New Face",
  "generation": "4",
  "description": "Beanie Babies are special no doubt\nAll filled with love – inside and out\nWishes for fun times filled with\njoy Ty’s holiday teddy is a magical toy!",
  "img": "https://beaniebabiespriceguide.com/wp-content/uploads/2021/01/1997_Holiday_Teddy_ty_beanie_baby.jpg",
  "price": 27.96,
  "stock": 50
},
```
**Error Handling:**
- Possible 400 (invalid request) errors (all plain text):
  - If passed in an invalid stuffies name, returns an error with message `Stuffy {stuff} is not available. Please try again.`
- Possible 500 errors (all plain text):
  - If something goes wrong on the server, returns error with `Something went wrong; please try again.`

## Filtering items by category
**Request Format:** /stuffies/search?category= + category

**Request Type:** GET

**Returned Data Format**: json

**Description:** returns items by respective category for user when choosing a category.

**Example Request:** /stuffies/filtering?category=  *** FIX PLS ***

**Example Response:**
```json
{
  "id": 2,
  "name": "1997 Teddy (Holiday)",
  "category": "Bear",
  "sub_category": "NF New Face",
  "generation": "4",
  "description": "Beanie Babies are special no doubt\nAll filled with love – inside and out\nWishes for fun times filled with\njoy Ty’s holiday teddy is a magical toy!",
  "img": "https://beaniebabiespriceguide.com/wp-content/uploads/2021/01/1997_Holiday_Teddy_ty_beanie_baby.jpg",
  "price": 27.96,
  "stock": 50
}
```
**Error Handling:**
- Possible 400 (invalid request) errors (all plain text):
  - If passed in an invalid stuffies name, returns an error with message `Stuffy {stuff} is not available. Please try again.`
- Possible 500 errors (all plain text):
  - If something goes wrong on the server, returns error with `Something went wrong; please try again.`

## Loading homepage
**Request Format:**  /stuffies/beanies

**Request Type:** GET

**Returned Data Format**: json

**Description:** returns a list of all beanies and their information

**Example Request:** query parameters of name=ABC'S

**Example Response:**
```json
"page": [
  {
    "id": 1,
    "name": "123’s",
    "category": "Bear",
    "sub_category": "NF Big Feet",
    "generation": "15",
    "description": "1-2-3 and A-B-C\nLearning is such fun, you see\nYou might find out it isn’t hard\nTo get A’s on your report card !",
    "img": "https://beaniebabiespriceguide.com/wp-content/uploads/2015/02/123s_ty_beanie_baby.jpg",
    "price": 12.05,
    "stock": 50
  }
  {
    "id": 2,
    "name": "1997 Teddy (Holiday)",
    "category": "Bear",
    "sub_category": "NF New Face",
    "generation": "4",
    "description": "Beanie Babies are special no doubt\nAll filled with love – inside and out\nWishes for fun times filled with\njoy Ty’s holiday teddy is a magical toy!",
    "img": "https://beaniebabiespriceguide.com/wp-content/uploads/2021/01/1997_Holiday_Teddy_ty_beanie_baby.jpg",
    "price": 27.96,
    "stock": 50
  },
]
```
**Error Handling:**
- Possible 400 (invalid request) errors (all plain text):
  - If passed in an invalid stuffies name, returns an error with message `Stuffy {stuff} is not available. Please try again.`
- Possible 500 errors (all plain text):
  - If something goes wrong on the server, returns error with `Something went wrong; please try again.`

# Getting beanie info by name
**Request Format:**  stuffies/user?name= + name

**Request Type:** GET

**Returned Data Format**: json

**Description:** returns a json object for specified beanie

**Example Request:** stuffies/user?name=123’s

**Example Response:**
```json
{
  "id": 1,
  "name": "123’s",
  "category": "Bear",
  "sub_category": "NF Big Feet",
  "generation": "15",
  "description": "1-2-3 and A-B-C\nLearning is such fun, you see\nYou might find out it isn’t hard\nTo get A’s on your report card !",
  "img": "https://beaniebabiespriceguide.com/wp-content/uploads/2015/02/123s_ty_beanie_baby.jpg",
  "price": 12.05,
  "stock": 50
}
```
**Error Handling:**
- Possible 400 (invalid request) errors (all plain text):
  - If passed in an invalid stuffies name, returns an error with message `Stuffy {stuff} is not available. Please try again.`
- Possible 500 errors (all plain text):
  - If something goes wrong on the server, returns error with `Something went wrong; please try again.`

# Determine successful transaction
**Request Format:**  /stuffies/transaction/success

**Request Type:** POST

**Returned Data Format**: String

**Description:** Determines if transaction is successful, depending on the stock of the item.

**Example Request:** /stuffies/transaction/success

**Example Response:**
```
asaxalksxalkx
```

**Error Handling:**
- Possible 400 (invalid request) errors (all plain text):
  - If passed and item is out of stock, returns an error with message `One of your items are out of stock.`
- Possible 500 errors (all plain text):
  - If something goes wrong on the server, returns error with `Something went wrong; please try again.`


# Adds item to transaction
**Request Format:**  /stuffies/transaction/addItem/?id=

**Request Type:** POST

**Returned Data Format**: JSON

**Description:** Adds items to the respective transaction page.

**Example Request:** /stuffies/transaction/history?cookie=adthai

**Example Response:**
```
{
    "id": 19,
    "cookie": "adthai",
    "code": "kDKaG9q4VLS5CtBsUyQuvB",
    "name": "123’s",
    "price": 12.05,
    "category": "Bear",
    "subCategory": "NF Big Feet",
    "generation": "15",
    "description": "1-2-3 and A-B-C\r\nLearning is such fun, you see\r\nYou might find out it isn’t hard\r\nTo get A’s on your report card !",
    "img": "https://beaniebabiespriceguide.com/wp-content/uploads/2015/02/123s_ty_beanie_baby.jpg"
  }
```
**Error Handling:**
- Possible 400 (invalid request) errors (all plain text):
  - If passed in an invalid cookie or code, returns an error with message `Cookie or confirmation code was not found`
- Possible 500 errors (all plain text):
  - If something goes wrong on the server, returns error with `Something went wrong; please try again.`

# Determine successful transaction
**Request Format:**  /stuffies/transaction/success

**Request Type:** POST

**Returned Data Format**: no return value

**Description:** Determines if transaction is successful, depending on the stock of the item.

**Example Request:**  *************************    pls do       ************************

**Example Response:**


# Adds item to transaction
**Request Format:**  /stuffies/transaction/addItem/?id=

**Request Type:** POST

**Returned Data Format**: no return value

**Description:** Adds item by id to order.

**Example Request:**  *************************    pls do       ************************

**Example Response:**
