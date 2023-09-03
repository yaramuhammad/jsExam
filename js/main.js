let menu = document.querySelector('.menu');
let main = document.getElementById('meals');
let search = document.querySelector('main>div');
searchByName('');

function displayMeals(meals) {
    let mealsDiv = ''
    for (let i = 0; i < meals.length; i++) {
        mealsDiv += `<div class="col-3">
        <div class="position-relative p-0 meal" onclick="displayMealDetails(${meals[i].idMeal})">
        <img src="${meals[i].strMealThumb}" alt="meal" class="w-100">
        <div class="position-absolute px-3 layer w-100 d-flex align-items-center text-dark fs-3 fw-bold">${meals[i].strMeal}</div>
        </div>
        
    </div>`
    }

    main.innerHTML = mealsDiv;
}
async function displayMealDetails(mealID) {
    main.innerHTML = "";
    search.innerHTML = "";

    let respone = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`);
    respone = await respone.json();
    meal = respone.meals[0];

    let ingredients = "";
    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredients += `<li class="alert alert-info m-2 p-1">${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}</li>`
        }
    }
    if (meal.strTags == null) { tags = []; }else { tags = meal.strTags.split(",") }
    let tagsList = ''
    for (let i = 0; i < tags.length; i++) {
        tagsList += `<li class="alert alert-danger m-2 p-1">${tags[i]}</li>`
    }

    let content = `
    <div class="col-md-4">
        <img class="w-100 rounded-3" src="${meal.strMealThumb}"alt="">
        <h2>${meal.strMeal}</h2>
    </div>
    <div class="col-md-8">
        <h2>Instructions</h2>
        <p>${meal.strInstructions}</p>
        <h3>Area: ${meal.strArea}</h3>
        <h3>Category: ${meal.strCategory}</h3>
        <h3>Ingredients: </h3>
        <ul class="list-unstyled d-flex g-3 flex-wrap">
            ${ingredients}
        </ul>
        <h3>Tags: </h3>
        <ul class="list-unstyled d-flex g-3 flex-wrap">
            ${tagsList}
        </ul>
        <a target="_blank" href="${meal.strSource}" class="btn btn-success">Source</a>
        <a target="_blank" href="${meal.strYoutube}" class="btn btn-danger">Youtube</a>
    </div>`
    main.innerHTML = content
}
function displaySearchScreen() {
    openCloseMenu();
    main.innerHTML = '';
    search.innerHTML = `
    <div class="row p-5">
    <div class="col-6">
        <input class="form-control bg-transparent text-white" type="text" placeholder="Search By Name" onkeyup="searchByName(this.value)" >
    </div>
    <div class="col-6">
        <input class="form-control bg-transparent text-white" type="text" placeholder="Search By First Letter" onkeyup="searchByFirstLetter(this.value)">
    </div>
</div>`
}
async function searchByName(term) {

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
    response = await response.json()

    if (response.meals == null) {
        main.innerHTML = 'No Meals Were Found';
    }
    else {
        displayMeals(response.meals)
    }
}
async function searchByFirstLetter(term) {

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${term}`)
    response = await response.json()
    if (response.meals == null) {
        main.innerHTML = 'No Meals Were Found';
    }
    else {
        displayMeals(response.meals)
    }
}
async function displayCategories() {
    openCloseMenu();
    search.innerHTML = '';
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`)
    response = await response.json()
    let categoriesDiv = '';
    for (let i = 0; i < response.categories.length; i++) {
        categoriesDiv += `
            <div class="col-3">
                <div onclick="getMealsByCategory('${response.categories[i].strCategory}')" class="meal position-relative">
                    <img class="w-100" src="${response.categories[i].strCategoryThumb}">
                    <div class="layer position-absolute text-center p-2">
                        <h3>${response.categories[i].strCategory}</h3>
                        <p>${response.categories[i].strCategoryDescription.split(" ").slice(0, 20).join(" ")}</p>
                    </div>
                </div>
            </div>`
    }
    main.innerHTML = categoriesDiv;
}
async function getMealsByCategory(category) {
    main.innerHTML = "";
    search.innerHTML="";
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
    response = await response.json()
    displayMeals(response.meals.slice(0, 20))
}
async function displayArea() {
    openCloseMenu();
    search.innerHTML = '';
    let respone = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`)
    respone = await respone.json()
    let areas = respone.meals
    let areasDiv = "";

    for (let i = 0; i < areas.length; i++) {
        areasDiv += `
        <div class="col-3">
            <div onclick="getMealsByArea('${areas[i].strArea}')" class="text-center" style="cursor:pointer">
                    <i class="fa-solid fa-house-laptop fa-4x"></i>
                    <h3>${areas[i].strArea}</h3>
            </div>
        </div>`
    }
    main.innerHTML = areasDiv
}
async function getMealsByArea(area) {
    main.innerHTML = "";
    search.innerHTML="";
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`)
    response = await response.json()
    displayMeals(response.meals.slice(0, 20))
}
async function displayIngredients() {
    openCloseMenu();
    search.innerHTML = "";
    let respone = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`)
    respone = await respone.json()
    let ingredients = respone.meals.splice(0, 20);
    let ingredientsDiv = "";

    for (let i = 0; i < ingredients.length; i++) {
        ingredientsDiv += `
        <div class="col-3">
            <div onclick="getMealsByIngredients('${ingredients[i].strIngredient}')" class="text-center" style="cursor:pointer">
                <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                <h3>${ingredients[i].strIngredient}</h3>
                <p>${ingredients[i].strDescription.split(" ").slice(0, 20).join(" ")}</p>
            </div>
        </div>`
    }
    main.innerHTML = ingredientsDiv
}
async function getMealsByIngredients(ingredients) {
    main.innerHTML = "";
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredients}`)
    response = await response.json()
    displayMeals(response.meals.slice(0, 20));
}
function openCloseMenu() {
    if (menu.classList.contains('fa-align-justify')) {
        menu.classList.remove('fa-align-justify');
        menu.classList.add('fa-x');
        document.querySelector('aside').style.left = 0;
        list = document.querySelectorAll('ul li');
        for (let i = 0; i < list.length; i++) {
            list[i].classList.remove('pt-5');
        }
    }
    else {
        menu.classList.add('fa-align-justify');
        menu.classList.remove('fa-x');
        document.querySelector('aside').style.left = '-300px';
        list = document.querySelectorAll('ul li');
        for (let i = 0; i < list.length; i++) {
            list[i].classList.add('pt-5');
        }
    }
}
//******************************************************************************************************************************************//

function showContacts() {
    search.innerHTML="";
    openCloseMenu();
    main.innerHTML = `<form class="d-flex justify-content-center align-items-center min-vh-100">
    <div class="container text-center">
        <div class="row g-4">
            <div class="col-6">
                <input required id="nameField" onkeyup="validateName(),checkForm()" type="text" class="form-control" placeholder="Enter Your Name">
                <div id="nameError" class="text-danger w-100 mt-2 d-none">
                    Please Enter a Valid Name, Special characters and numbers are not allowed.
                </div>
            </div>
            <div class="col-6">
                <input required id="emailField" onkeyup="validateEmail(),checkForm()" type="email" class="form-control " placeholder="Enter Your Email">
                <div id="emailError" class="text-danger w-100 mt-2 d-none">
                    Please Enter a Valid Email.
                </div>
            </div>
            <div class="col-md-6">
                <input required id="phoneField" onkeyup="validatePhone(),checkForm()" type="text" class="form-control " placeholder="Enter Your Phone">
                <div id="phoneError" class="text-danger w-100 mt-2 d-none">
                    Please Enter a valid Phone Number.
                </div>
            </div>
            <div class="col-6">
                <input required id="ageField" onkeyup="validateAge(),checkForm()" type="number" class="form-control " placeholder="Enter Your Age">
                <div id="ageError" class="text-danger w-100 mt-2 d-none">
                    Please Enter age between 0 and 200
                </div>
            </div>
            <div class="col-6">
                <input required id="passwordField" onkeyup="validatePassword(),checkForm()" type="password" class="form-control " placeholder="Enter Your Password">
                <div id="passwordError" class="text-danger w-100 mt-2 d-none">
                    Please Enter a Valid Password, Minimum eight characters, at least one letter and one number.
                </div>
            </div>
            <div class="col-6">
                <input required id="repasswordField" onkeyup="validateRePassword(),checkForm()" type="password" class="form-control " placeholder="Repassword">
                <div id="rePasswordError" class="text-danger w-100 mt-2 d-none">
                    Passwords are not identical.
                </div>
            </div>
        </div>
        <button id="submit" disabled class="btn btn-outline-danger px-2 mt-3">Submit</button>
    </div>
</form>`
}

function checkForm() {
    if (validateName() && validateEmail() && validatePhone() && validateAge() && validatePassword() && validateRePassword()) {
        document.getElementById("submit").removeAttribute("disabled");
    }
    else {
        document.getElementById("submit").setAttribute('disabled', true);
    }
}

function validateName() {
    if (/^[a-zA-Z ]+$/.test(document.getElementById("nameField").value)) {
        document.getElementById("nameError").classList.replace("d-block", "d-none")
        return true;
    }
    else {
        document.getElementById("nameError").classList.replace("d-none", "d-block")
        return false;
    }
}

function validateEmail() {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(document.getElementById("emailField").value)) {
        document.getElementById("emailError").classList.replace("d-block", "d-none")
        return true;
    }
    else {
        document.getElementById("emailError").classList.replace("d-none", "d-block")
        return false;
    }
}

function validatePhone() {
    if (/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im.test(document.getElementById("phoneField").value)) {
        document.getElementById("phoneError").classList.replace("d-block", "d-none")
        return true;
    }
    else {
        document.getElementById("phoneError").classList.replace("d-none", "d-block")
        return false;
    }

}

function validateAge() {
    if (document.getElementById("ageField").value<200 && document.getElementById("ageField").value>=0 && document.getElementById("ageField").value!="") {
        document.getElementById("ageError").classList.replace("d-block", "d-none")
        return true;
    }
    else {
        document.getElementById("ageError").classList.replace("d-none", "d-block")
        return false;
    }
}

function validatePassword() {
    if (/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(document.getElementById("passwordField").value)) {
        document.getElementById("passwordError").classList.replace("d-block", "d-none")
        return true;
    }
    else {
        document.getElementById("passwordError").classList.replace("d-none", "d-block")
        return false;
    }
}

function validateRePassword() {
    if (document.getElementById("repasswordField").value == document.getElementById("passwordField").value) {
        document.getElementById("rePasswordError").classList.replace("d-block", "d-none")
        return true;
    }
    else {
        document.getElementById("rePasswordError").classList.replace("d-none", "d-block")
        return false;
    }
}

