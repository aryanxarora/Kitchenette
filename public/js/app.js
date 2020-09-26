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

var count = 0
function changeAvailability(){
  //var property = document.getElementById('btn_isAvail');
  var property = document.getElementsByClassName("ing__button");
    if(count == 1){
        property.style.backgroundColor = "white";
        property.style.color = "rgba(0, 0, 0, 0.425)"
        count = 0;
    } else {
        property.style.backgroundColor = "#9ec1a6c9";
        property.style.color = "white"
        count = 1;
    }
}
