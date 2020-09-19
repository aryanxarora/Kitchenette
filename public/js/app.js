function dropdown() {
    document.getElementById("myDropdown").classList.toggle("show");
  }
  
  // Close the dropdown if the user clicks outside of it
  window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
      var dropdowns = document.getElementsByClassName("dropdown-content");
      var i;
      for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
  }

function smart_suggestions () {
  document.getElementById("smartSuggestions").style.display = "block";
  document.getElementById("recipes").style.display = "none";
  document.getElementById("ingredients").style.display = "none";
}

function recipes () {
  document.getElementById("smartSuggestions").style.display = "none";
  document.getElementById("recipes").style.display = "block"
  document.getElementById("ingredients").style.display = "none";
}

function ingredients () {
  document.getElementById("smartSuggestions").style.display = "none";
  document.getElementById("recipes").style.display = "none"
  document.getElementById("ingredients").style.display = "block";
}

function addRecipe() {
  alert("Adding new item")
}

$(document).ready(function () {
  $("#modal_recipeIngredients").CreateMultiCheckBox({ width: '230px',
             defaultText : 'Select Below', height:'250px' });
});