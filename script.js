// Get references to HTML elements
const recipeNameInput = document.getElementById('recipeName');
const ingredientsInput = document.getElementById('ingredientsInput');
const submitRecipeBtn = document.getElementById('submitRecipeBtn');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const recipeList = document.getElementById('recipeList');

// Function to save recipes to local storage
function saveRecipesToLocalStorage(recipes) {
    localStorage.setItem('recipes', JSON.stringify(recipes));
}

// Function to load recipes from local storage
function loadRecipesFromLocalStorage() {
    const recipesString = localStorage.getItem('recipes');
    return recipesString ? JSON.parse(recipesString) : [];
}

// Load recipes from local storage when the page loads
document.addEventListener('DOMContentLoaded', function() {
    displayAllRecipes();
});

// Event listener for submitting recipe
submitRecipeBtn.addEventListener('click', function() {
    const recipeName = recipeNameInput.value.trim();
    const ingredients = ingredientsInput.value.trim();

    if (recipeName && ingredients) {
        const ingredientsArray = ingredients.split(',').map(item => item.trim());

        // Create a new recipe object
        const newRecipe = {
            name: recipeName,
            ingredients: ingredientsArray
        };

        // Load existing recipes from local storage
        let recipes = loadRecipesFromLocalStorage();

        // Add the new recipe to the recipes array
        recipes.push(newRecipe);

        // Save the updated recipes array back to local storage
        saveRecipesToLocalStorage(recipes);

        // Display the new recipe
        displayRecipe(newRecipe, recipes.length - 1);

        // Clear inputs
        recipeNameInput.value = '';
        ingredientsInput.value = '';

        // Focus on recipe name input
        recipeNameInput.focus();
    } else {
        alert('Please enter a recipe name and list the ingredients.');
    }
});

// Event listener for deleting recipe
recipeList.addEventListener('click', function(event) {
    if (event.target.classList.contains('delete-btn')) {
        const index = event.target.getAttribute('data-index');
        let recipes = loadRecipesFromLocalStorage();
        recipes.splice(index, 1); // Remove the recipe from the array
        saveRecipesToLocalStorage(recipes); // Save the updated array to local storage
        displayAllRecipes(); // Update the UI to reflect the change
    }
});

// Event listener for searching recipes
searchBtn.addEventListener('click', function() {
    const searchIngredients = searchInput.value.trim().toLowerCase().split(',').map(item => item.trim());
    if (searchIngredients.length > 0) {
        searchRecipesByIngredients(searchIngredients);
    } else {
        alert('Please enter the ingredients you have.');
    }
});

// Function to display all recipes
function displayAllRecipes() {
    recipeList.innerHTML = ''; // Clear the existing recipes
    const recipes = loadRecipesFromLocalStorage();
    recipes.forEach((recipe, index) => {
        displayRecipe(recipe, index);
    });
}

// Function to display recipe
function displayRecipe(recipe, index) {
    const recipeCard = document.createElement('div');
    recipeCard.classList.add('recipe-card');

    const recipeHTML = `
        <h2>${recipe.name}</h2>
        <p><strong>Ingredients:</strong></p>
        <ul>
            ${recipe.ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
        </ul>
        <button class="delete-btn" data-index="${index}">Delete</button>
    `;

    recipeCard.innerHTML = recipeHTML;
    recipeList.appendChild(recipeCard);
}

// Function to search recipes by ingredients
function searchRecipesByIngredients(searchIngredients) {
    const recipes = loadRecipesFromLocalStorage();

    const filteredRecipes = recipes.map(recipe => {
        const hasIngredientCount = recipe.ingredients.filter(ingredient => searchIngredients.includes(ingredient.toLowerCase())).length;
        const missingIngredientsCount = recipe.ingredients.length - hasIngredientCount;
        return { ...recipe, hasIngredientCount, missingIngredientsCount };
    }).filter(recipe => recipe.hasIngredientCount > 0) // Filter out recipes with no matching ingredients
      .sort((a, b) => {
        // Sort by the number of matching ingredients (descending) and then by the number of missing ingredients (ascending)
        if (b.hasIngredientCount === a.hasIngredientCount) {
            return a.missingIngredientsCount - b.missingIngredientsCount;
        }
        return b.hasIngredientCount - a.hasIngredientCount;
    });

    recipeList.innerHTML = ''; // Clear the existing recipes
    filteredRecipes.forEach((recipe, index) => {
        displayRecipe(recipe, index);
    });
}
