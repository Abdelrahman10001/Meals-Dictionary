"use strict";

document.addEventListener("DOMContentLoaded", function () {
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
    let mealName;


    // Fade out the loader element
    setTimeout(function () {
      loader.style.transition = 'opacity 1s';
      loader.style.opacity = '0';
    }, 1000);

    // After 1000ms (1 second), fade out the loading element and remove it
    setTimeout(function () {
      loading.style.transition = 'opacity 1s';
      loading.style.opacity = '0';

      setTimeout(function () {
        loading.remove();
      }, 1000);
    }, 1000);

    // Set body overflow to 'auto' after both fade-outs are complete
    setTimeout(function () {
      document.body.style.overflow = 'auto';
    }, 2000);



    lines.addEventListener("click", function () {
        sideNav.style.left = sideNav.style.left === "0px" ? "-240px" : "0px"
        sideNav.style.transition = "left 1s"
    });

    nameSearch.addEventListener("input", function () {
        mealName = nameSearch.value;
        if (mealName) {
            fetchName(mealName);
        }
    });

    letterSearch.addEventListener("input", function () {
        const enteredLetter = letterSearch.value.trim().charAt(0); // Get the first character entered
        if (enteredLetter) {
            fetchMealsByLetter(enteredLetter);
        }
    });


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

    async function fetchMealsByLetter(letter) {
        try {
            const apiResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`);
            const data = await apiResponse.json();
            console.log(data);
            mealList = data.meals;
            displayMeals();
        } catch (error) {
            console.error("Error fetching meal data:", error);
        }
    }


    function displayMeals() {
        let temp = "";
        mealList.forEach((meal) => {
            temp += `
            <div class="col-md-3 col-sm-6 mealItem" >
                <div class="item overflow-hidden  position-relative " >
                    <img src="${meal.strMealThumb}" class="w-100 " />
                    <div  class="layer position-absolute d-flex justify-content-center align-items-center p-3 ">
                        <h3 >${meal.strMeal}</h3>
                    </div>
                </div>
            </div>
            `;

        });
        myRow.innerHTML = temp;
        getItemInfo();
    }



    function getItemInfo() {
        const mealItem = document.querySelectorAll(".mealItem");
        mealItem.forEach((item, index) => {
            item.addEventListener('click', async function (e) {
                const mealId = mealList[index].idMeal; // Assuming you have an 'idMeal' property in your meal data

                try {
                    const apiResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
                    const data = await apiResponse.json();
                    const mealDetails = data.meals[0]; // Assuming API response contains a 'meals' array
                    firstScreen.style.display = 'none'
                    displayInstructions(mealDetails)
                    console.log(mealDetails);


                    // You can use 'mealDetails' as needed here or pass it to another function
                } catch (error) {
                    console.error("Error fetching meal details:", error);
                }
            });
        });
    }




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
                <h4>
                    Area : ${mealDetails.strArea}
                </h4>
                <h4>
                    Category : ${mealDetails.strCategory}
                </h4>
                <h4>
                    Ingredients:
                </h4>
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
    

    fetchName('')

    searchchoice.addEventListener('click', function () {
        firstScreen.style.display = ''
        displayCategories(false)
    })


    // Categories 

    categories.addEventListener('click', async function (e) {
        try {
            const apiResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`);
            const data = await apiResponse.json();
            mealList = data.categories; // Assuming API response contains a 'meals' array
            firstScreen.style.display = 'none'
            displayCategories(true)
            insideCatg(mealList)

        } catch (error) {
            console.error("Error fetching meal details:", error);
        }
    });

    function displayCategories(garb) {

        let temp = "";
      
        if (garb == true) {
            mealList.forEach((meal, index) => {

                temp += `
            <div class="col-md-3 col-sm-6 mealItem " >
                <div class="item overflow-hidden  position-relative " >
                    <img src="${meal.strCategoryThumb}" class="w-100 " />
                    <div  class="layer position-absolute overflow-hidden text-center row justify-content-center align-items-center  ">
                        <h3 >${meal.strCategory}</h3>
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

    function insideCatg(mealList) {
        const mealItem = document.querySelectorAll(".mealItem");
        mealItem.forEach((item, index) => {
            item.addEventListener('click', async function (e) {
                let mealCattt = mealList[index].strCategory
               
                try {
                    const apiResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${mealCattt}`);
                    const data = await apiResponse.json();
                    const sameCategory = data.meals; // Assuming API response contains a 'meals' array
                    
                    console.log(sameCategory);

                    display_Samecatg(sameCategory)
                    

                } catch (error) {
                    console.error("Error fetching meal details:", error);
                }
            });
        });
    }

    function display_Samecatg(sameCategory) {
        let temp = "";
        sameCategory.forEach((meal) => {
            temp += `
            <div class="col-md-3 col-sm-6 mealItem" >
                <div class="item overflow-hidden  position-relative " >
                    <img src="${meal.strMealThumb}" class="w-100 " />
                    <div  class="layer position-absolute d-flex justify-content-center align-items-center p-3 ">
                        <h3 >${meal.strMeal}</h3>
                    </div>
                </div>
            </div>
            `;

        });
        myRow.innerHTML = temp;
        getcatinst(sameCategory);
    }



    function getcatinst(sameCategory) {
        const mealItem = document.querySelectorAll(".mealItem");
        mealItem.forEach((item, index) => {
            item.addEventListener('click', async function (e) {
                let ownMeal = sameCategory[index]; // Assuming you have an 'idMeal' property in your meal data
                console.log(ownMeal);
                display222Instructions(ownMeal)
          
            });
        });
    }


    function display222Instructions(mealDetails) {

        let temp = "";
        let tags = ' ';
        if (mealDetails.strTags !== null) {
            tags = mealDetails.strTags
        }

        temp = `
            <div class="col-md-4 col-sm-6">
            <img src="${mealDetails.strMealThumb}" class="w-100" id="instImg" alt="">
            <h2 class="text-white">${mealDetails.strMeal}</h2>
        </div>
        <div class="col-md-8 col-sm-6 text-white">
            <h2>Instructions</h2>
            <p>${mealDetails.strInstructions}</p>
            <h4>
                Area : ${mealDetails.strArea}
            </h4>
            <h4>
                Category : ${mealDetails.strCategory}
            </h4>
            <h4>
                Recipes :
            </h4>
            <ul>
                <li>
                    1 kg Chicken Thighs
                </li>
                <li>1 tbs Coriander</li>
            </ul>
            <h4>Tags: ${tags}</h4>
            <a href="${mealDetails.strSource}" class="btn btn-success" target="_blank">Source</a>
            <a href="${mealDetails.strYoutube}" class="btn btn-danger" target="_blank">Youtube</a>  
        </div>
            `;

        myRow.innerHTML = temp;
    }

    // End Categories

});

