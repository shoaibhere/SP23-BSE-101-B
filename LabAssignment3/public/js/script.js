$(document).ready(function() {
  // Initialize the load function
  load();
});

function load() {
  // Attach a click event listener to all elements with class "project"
  $(document).on('click', '.project', function() {
      const fileName = $(this).data('file'); // Get the file name from data attribute
      loadDescription(fileName); // Call loadDescription function with the file name
  });
}

function loadDescription(fileName) {
  // AJAX request to load the description
  $.get(fileName, function(data) {
      $('#description').html(data).show(); // Display the fetched description
  }).fail(function() {
      $('#description').html('Unable to load description.').show(); // Handle errors
  });
}
