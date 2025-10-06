document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("ingredient-form");
  const ingredientsInput = document.getElementById("ingredients");
  const mealScheduleDiv = document.getElementById("meal-schedule");
  const planNameInput = document.getElementById("plan-name");
  const saveButton = document.getElementById("save-named-plan");
  const loadButton = document.getElementById("load-plan");
  const deleteButton = document.getElementById("delete-plan");
  const savedPlansSelect = document.getElementById("saved-plans");

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const mealTypes = ["Breakfast", "Lunch", "Dinner"];

  // Enhanced meal plan generation
  function generateMealPlan(ingredients) {
    const items = ingredients.split(",").map(item => item.trim()).filter(Boolean);
    if (items.length === 0) return [];

    const meals = [
      "stir-fry", "salad", "soup", "bowl", "pasta", "curry", 
      "sandwich", "omelette", "casserole", "skillet"
    ];

    return days.map(day => {
      const dayMeals = mealTypes.map(mealType => {
        const randomIngredients = [...items]
          .sort(() => 0.5 - Math.random())
          .slice(0, Math.min(2, items.length));
        const randomMeal = meals[Math.floor(Math.random() * meals.length)];
        return `${mealType}: ${randomIngredients.join(" & ")} ${randomMeal}`;
      });
      return { day, meals: dayMeals };
    });
  }

  // Enhanced display with proper day elements
  function displayMealPlan(plan) {
    mealScheduleDiv.innerHTML = "";
    
    plan.forEach(dayPlan => {
      const dayElement = document.createElement("div");
      dayElement.className = "day";
      
      const dayHeader = document.createElement("h3");
      dayHeader.textContent = dayPlan.day;
      dayElement.appendChild(dayHeader);
      
      dayPlan.meals.forEach(meal => {
        const mealElement = document.createElement("p");
        mealElement.textContent = meal;
        dayElement.appendChild(mealElement);
      });
      
      mealScheduleDiv.appendChild(dayElement);
    });
  }

  // Save plan to localStorage
  function savePlan(name, plan) {
    if (!name) return alert("Please name your plan before saving.");
    const plans = JSON.parse(localStorage.getItem("savedMealPlans") || "{}");
    plans[name] = plan;
    localStorage.setItem("savedMealPlans", JSON.stringify(plans));
    updateSavedPlans();
    planNameInput.value = "";
    alert(`Plan "${name}" saved successfully!`);
  }

  // Load plan from localStorage
  function loadPlan(name) {
    const plans = JSON.parse(localStorage.getItem("savedMealPlans") || "{}");
    const plan = plans[name];
    if (plan) {
      displayMealPlan(plan);
      alert(`Plan "${name}" loaded successfully!`);
    } else {
      alert("Plan not found!");
    }
  }

  // Delete plan from localStorage
  function deletePlan(name) {
    const plans = JSON.parse(localStorage.getItem("savedMealPlans") || "{}");
    if (plans[name]) {
      delete plans[name];
      localStorage.setItem("savedMealPlans", JSON.stringify(plans));
      updateSavedPlans();
      alert(`Plan "${name}" deleted successfully!`);
    }
  }

  // Update dropdown with saved plans
  function updateSavedPlans() {
    savedPlansSelect.innerHTML = `<option value="">-- Load a Saved Plan --</option>`;
    const plans = JSON.parse(localStorage.getItem("savedMealPlans") || "{}");
    Object.keys(plans).forEach(key => {
      const option = document.createElement("option");
      option.value = key;
      option.textContent = key;
      savedPlansSelect.appendChild(option);
    });
  }

  // Clear current meal plan
  function clearMealPlan() {
    mealScheduleDiv.innerHTML = "";
    ingredientsInput.value = "";
  }

  // Event listeners
  form.addEventListener("submit", e => {
    e.preventDefault();
    const ingredients = ingredientsInput.value;
    if (!ingredients.trim()) {
      alert("Please enter some ingredients!");
      return;
    }
    const plan = generateMealPlan(ingredients);
    displayMealPlan(plan);
  });

  saveButton.addEventListener("click", () => {
    const name = planNameInput.value.trim();
    const dayElements = mealScheduleDiv.querySelectorAll(".day");
    if (dayElements.length === 0) {
      alert("Please generate a meal plan first!");
      return;
    }
    
    const plan = Array.from(dayElements).map(dayElement => {
      const day = dayElement.querySelector("h3").textContent;
      const meals = Array.from(dayElement.querySelectorAll("p")).map(p => p.textContent);
      return { day, meals };
    });
    
    savePlan(name, plan);
  });

  loadButton.addEventListener("click", () => {
    const selected = savedPlansSelect.value;
    if (selected) {
      loadPlan(selected);
    } else {
      alert("Please select a plan to load!");
    }
  });

  deleteButton.addEventListener("click", () => {
    const selected = savedPlansSelect.value;
    if (selected) {
      if (confirm(`Are you sure you want to delete "${selected}"?`)) {
        deletePlan(selected);
      }
    } else {
      alert("Please select a plan to delete!");
    }
  });

  // Add clear button dynamically
  const clearButton = document.createElement("button");
  clearButton.textContent = "Clear Current Plan";
  clearButton.className = "clear-btn";
  clearButton.addEventListener("click", clearMealPlan);
  document.querySelector("#meal-plan").appendChild(clearButton);

  // Initialize
  updateSavedPlans();
});