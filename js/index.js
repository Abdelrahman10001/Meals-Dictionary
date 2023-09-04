"use strict";

document.addEventListener("DOMContentLoaded", function () {
    // DOM element references
    const lines = document.getElementById("lines");
    const sideNav = document.getElementById("sideNav");
    const loader = document.querySelector(".loader");
    const loading = document.getElementById("loading");
    const nameSearch = document.getElementById("nameSearch");
    const myRow = document.getElementById("myRow");
    const letterSearch = document.getElementById("letterSearch");
    const firstScreen = document.getElementById("firstScreen");
    const searchchoice = document.getElementById("searchchoice");
    const categories = document.getElementById("Categories");
    const area = document.getElementById("Area");
    const ingredients = document.getElementById("Ingredients");
    const contactUs = document.getElementById("ContactUs");
    let mealList = [];
    let areaList = [];
    let ingredientList = [];
    let mealName;

    // Event listener for toggling side navigation
    lines.addEventListener("click", function () {
        sideNav.style.left = sideNav.style.left === "0px" ? "-240px" : "0px";
        sideNav.style.transition = "left 1s";
    });

    // Event listener for searching by meal name
    nameSearch.addEventListener("input", function () {
        mealName = nameSearch.value;
        if (mealName) {
            fetchName(mealName);
        }
    });

    // Event listener for searching by first letter
    letterSearch.addEventListener("input", function () {
        const enteredLetter = letterSearch.value.trim().charAt(0);
        if (enteredLetter) {
            fetchMealsByLetter(enteredLetter);
        }
    });

    // Fetch meals by name
    async function fetchName(mealName) {
        try {
            const apiResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${mealName}`);
            const data = await apiResponse.json();
            mealList = data.meals;
            displayMeals();
        } catch (error) {
            console.error("Error fetching meal data:", error);
        }
    }

    fetchName('')

    // Fetch meals by first letter
    async function fetchMealsByLetter(letter) {
        try {
            const apiResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`);
            const data = await apiResponse.json();
            mealList = data.meals;
            displayMeals();
        } catch (error) {
            console.error("Error fetching meal data:", error);
        }
    }

    // Display meals on the screen
    function displayMeals() {
        let temp = "";
        mealList.forEach((meal) => {
            temp += `
                <div class="col-md-3 col-sm-6 mealItem">
                    <div class="item overflow-hidden position-relative">
                        <img src="${meal.strMealThumb}" class="w-100" />
                        <div class="layer position-absolute d-flex justify-content-center align-items-center p-3">
                            <h3>${meal.strMeal}</h3>
                        </div>
                    </div>
                </div>
            `;
        });
        myRow.innerHTML = temp;
        getItemInfo();
    }

    // Get additional meal details when a meal is clicked
    function getItemInfo() {
        const mealItem = document.querySelectorAll(".mealItem");
        mealItem.forEach((item, index) => {
            item.addEventListener('click', async function (e) {
                const mealId = mealList[index].idMeal;
                try {
                    const apiResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
                    const data = await apiResponse.json();
                    const mealDetails = data.meals[0];
                    firstScreen.style.display = 'none';
                    displayInstructions(mealDetails);
                } catch (error) {
                    console.error("Error fetching meal details:", error);
                }
            });
        });
    }

    // Display meal details
    function displayInstructions(mealDetails) {
        let temp = "";
        let tags = ' ';
        
        if (mealDetails.strTags !== null) {
            tags = mealDetails.strTags;
        }

        temp = `
            <div class="col-md-4 col-sm-6">
                <img src="${mealDetails.strMealThumb}" class="w-100" id="instImg" alt="">
                <h2 class="text-white">${mealDetails.strMeal}</h2>
            </div>
            <div class="col-md-8 col-sm-6 text-white">
                <h2>Instructions</h2>
                <p>${mealDetails.strInstructions}</p>
                <h4>Area: ${mealDetails.strArea}</h4>
                <h4>Category: ${mealDetails.strCategory}</h4>
                <h4>Ingredients:</h4>
                <ul>
                    ${getIngredientsList(mealDetails)}
                </ul>
                <h4>Tags: ${tags}</h4>
                <a href="${mealDetails.strSource}" class="btn btn-success" target="_blank">Source</a>
                <a href="${mealDetails.strYoutube}" class="btn btn-danger" target="_blank">Youtube</a>  
            </div>
        `;

        myRow.innerHTML = temp;
    }

    // Generate the list of ingredients
    function getIngredientsList(mealDetails) {
        let ingredientsList = "";
        for (let i = 1; i <= 20; i++) {
            const ingredientKey = `strIngredient${i}`;
            const measureKey = `strMeasure${i}`;
            if (mealDetails[ingredientKey]) {
                ingredientsList += `<li>${mealDetails[measureKey]} ${mealDetails[ingredientKey]}</li>`;
            } else {
                break;
            }
        }
        return ingredientsList;
    }

    // Event listener for category search
    searchchoice.addEventListener('click', function () {
        firstScreen.style.display = '';
        displayCategories(false);
    });

    // Fetch and display meal categories
    categories.addEventListener('click', async function (e) {
        try {
            const apiResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`);
            const data = await apiResponse.json();
            mealList = data.categories;
            firstScreen.style.display = 'none';
            displayCategories(true);
            insideCatg(mealList);
        } catch (error) {
            console.error("Error fetching meal details:", error);
        }
    });

    // Display meal categories
    function displayCategories(garb) {
        let temp = "";

        if (garb == true) {
            mealList.forEach((meal, index) => {
                temp += `
                    <div class="col-md-3 col-sm-6 mealItem">
                        <div class="item overflow-hidden position-relative">
                            <img src="${meal.strCategoryThumb}" class="w-100" />
                            <div class="layer position-absolute overflow-hidden text-center row justify-content-center align-items-center">
                                <h3>${meal.strCategory}</h3>
                                <p class="w-100">${meal.strCategoryDescription}</p>
                            </div>
                        </div>
                    </div>
                `;
            });
            myRow.innerHTML = temp;
        } else {
            myRow.innerHTML = temp;
        }
    }

    // Event listener for category selection
    function insideCatg(mealList) {
        const mealItem = document.querySelectorAll(".mealItem");
        mealItem.forEach((item, index) => {
            item.addEventListener('click', async function (e) {
                let mealCattt = mealList[index].strCategory;

                try {
                    const apiResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${mealCattt}`);
                    const data = await apiResponse.json();
                    const sameCategory = data.meals;
                    display_Same(sameCategory);
                } catch (error) {
                    console.error("Error fetching meal details:", error);
                }
            });
        });
    }

    // Display meals from the same category
    function display_Same(sameCategory) {
        let temp = "";
        sameCategory.forEach((meal) => {
            temp += `
                <div class="col-md-3 col-sm-6 mealItem">
                    <div class="item overflow-hidden position-relative">
                        <img src="${meal.strMealThumb}" class="w-100" />
                        <div class="layer position-absolute d-flex justify-content-center align-items-center p-3">
                            <h3>${meal.strMeal}</h3>
                        </div>
                    </div>
                </div>
            `;
        });
        myRow.innerHTML = temp;
        getInstrctions(sameCategory);
    }

    // Event listener for meal selection from the same category
    function getInstrctions(sameCategory) {
        const mealItem = document.querySelectorAll(".mealItem");
        mealItem.forEach((item, index) => {
            item.addEventListener('click', async function (e) {
                let ownMeal = sameCategory[index];
                display222Instructions(ownMeal);
            });
        });
    }

    // Display meal instructions
    function display222Instructions(mealDetails) {
        let temp = "";
        let tags = ' ';
      

        temp = `
            <div class="col-md-4 col-sm-6">
                <img src="${mealDetails.strMealThumb}" class="w-100" id="instImg" alt="">
                <h2 class="text-white">${mealDetails.strMeal}</h2>
            </div>
            <div class="col-md-8 col-sm-6 text-white">
                <h2>Instructions</h2>
                <p>${mealDetails.strInstructions}</p>
                <h4>Area: ${mealDetails.strArea}</h4>
                <h4>Category: ${mealDetails.strCategory}</h4>
                <h4>Recipes:</h4>
                <ul>
                    <li>1 kg Chicken Thighs</li>
                    <li>1 tbs Coriander</li>
                </ul>
                <h4>Tags: ${tags}</h4>
                <a href="${mealDetails.strSource}" class="btn btn-success" target="_blank">Source</a>
                <a href="${mealDetails.strYoutube}" class="btn btn-danger" target="_blank">Youtube</a>  
            </div>
        `;

        myRow.innerHTML = temp;
    }

    // Event listener for area selection
    area.addEventListener('click', async function () {
        try {
            const apiResponse = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?a=list');
            const data = await apiResponse.json();
            areaList = data.meals;
            firstScreen.style.display = 'none';
            displayArea();
            insideArea(areaList);
        } catch (error) {
            console.error("Error fetching meal details:", error);
        }
    });

    // Display meal areas
    function displayArea() {
        let temp = "";
        areaList.forEach((meal) => {
            temp += `
                <div class="col-md-3 col-sm-6 text-center mealItem">
                    <div class="item overflow-hidden position-relative text-white">
                        <i class="fa-solid fw-bolder fa-house-laptop fa-4x"></i>
                        <p class="areaName">${meal.strArea}</p>
                    </div>
                </div>
            `;
        });
        myRow.innerHTML = temp;
    }

    // Event listener for area selection
    function insideArea(areaList) {
        const mealItem = document.querySelectorAll(".mealItem");
        mealItem.forEach((item, index) => {
            item.addEventListener('click', async function (e) {
                let mealAreaa = areaList[index].strArea;
                
                try {
                    const apiResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${mealAreaa}`);
                    const data = await apiResponse.json();
                    const sameArea = data.meals;
                    display_Same(sameArea)
                } catch (error) {
                    console.error("Error fetching meal details:", error);
                }
            });
        });
    }

    // End Area


    // Ingredients

    ingredients.addEventListener('click', async function () {
        try {
            const apiResponse = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?i=20');
            const data = await apiResponse.json();
            ingredientList = data.meals.slice(0, 20);
            firstScreen.style.display = 'none';
            displayingredients();
            insideIng(ingredientList)
          
        } catch (error) {
            console.error("Error fetching meal details:", error);
        }
    });


    function truncateText(text, numWords) {
        const words = text.split(" ");
        if (words.length <= numWords) {
            return text;
        }
        const truncatedWords = words.slice(0, numWords);
        return truncatedWords.join(" ") + "...";
    }

    function displayingredients() {
        let temp = "";
        ingredientList.forEach((meal) => {
            let truncatedDescription = truncateText(meal.strDescription, 18);
            temp += `
                <div class="col-md-3 col-sm-6 text-center mealItem">
                    <div class="item overflow-hidden position-relative text-white">
                        <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                        <p class="areaName">${meal.strIngredient}</p>
                        <p class="">${truncatedDescription}</p>
                    </div>
                </div>
            `;
        });
        myRow.innerHTML = temp;
    }
    
    function insideIng(ingredientList) {
        const mealItem = document.querySelectorAll(".mealItem");
        mealItem.forEach((item, index) => {
            item.addEventListener('click', async function (e) {
                let mealIngrd = ingredientList[index].strIngredient;
              
                try {
                    const apiResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${mealIngrd}`);
                    const data = await apiResponse.json();
                    const sameIngrd = data.meals;
                    display_Same(sameIngrd)
                } catch (error) {
                    console.error("Error fetching meal details:", error);
                }
            });
        });
    }


    // End Loading
});
