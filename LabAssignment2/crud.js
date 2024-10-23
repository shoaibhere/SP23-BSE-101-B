// Function to fetch and display posts
function displayPosts() {
  $.ajax({
    url: "https://jsonplaceholder.typicode.com/posts?_limit=9",
    method: "GET",
    dataType: "json",
    success: handleResponse,
    error: function (error) {
      console.error("Error fetching posts:", error);
    },
  });
}

// Handle the response and display posts
function handleResponse(data) {
  console.log("Response received"+data);
  var postsList = $("#postsList");
  postsList.empty();

  $.each(data, function (index, post) {
    postsList.append(
      `<div class="d-flex flex-column shadow-lg p-3 rounded">
          <h1>User ID: ${post.userId}</h1>
          <h2 class="text-secondary">${post.title}</h2>
          <p class="text-secondary-emphasis">${post.body}</p>
          <div>
            <button class="edit-btn btn btn-primary" data-id="${post.id}">Edit</button>
            <button class="delete-btn btn btn-danger" data-id="${post.id}">Delete</button>
          </div>
        </div>`
    );
  });
}

// Function to delete a post
function deletePost() {
  let postId = $(this).attr("data-id");
  $.ajax({
    url: "https://jsonplaceholder.typicode.com/posts/" + postId,
    method: "DELETE",
    success: function () {
      displayPosts();  // Refresh the post list
    },
    error: function (error) {
      console.error("Error deleting post:", error);
    },
  });
}

// Handle form submission for create/update
function handleFormSubmission(event) {
  event.preventDefault();
  let postId = $("#createBtn").attr("data-id");
  var title = $("#post-title").val();
  var userId = $("#user-id").val();
  var body = $("#post-content").val();

  if (postId) {
    // Update existing post
    $.ajax({
      url: "https://jsonplaceholder.typicode.com/posts/" + postId,
      method: "PUT",
      data: { id: postId, title: title, body: body, userId: userId },
      success: function () {
        console.log("Post updated");
        displayPosts();
      },
      error: function (error) {
        console.error("Error updating post:", error);
      },
    });
  } else {
    // Create new post
    $.ajax({
      url: "https://jsonplaceholder.typicode.com/posts/",
      method: "POST",
      data: { title: title, body: body, userId: userId },
      success: function () {
        console.log("Post created"+postId);
        displayPosts();  // Refresh the post list
      },
      error: function (error) {
        console.error("Error creating post:", error);
      },
    });
  }
}

// Handle the edit button click
function editBtnClicked(event) {
  event.preventDefault();
  let postId = $(this).attr("data-id");
  $.ajax({
    url: "https://jsonplaceholder.typicode.com/posts/" + postId,
    method: "GET",
    success: function (data) {
      console.log("Edit post data:", data);
      $("#clearBtn").show();
      $("#post-title").val(data.title);
      $("#user-id").val(data.userId);
      $("#post-content").val(data.body);
      $("#createBtn").html("Update").attr("data-id", data.id);
    },
    error: function (error) {
      console.error("Error fetching post for edit:", error);
    },
  });
}

// Document ready function
$(document).ready(function () {
  // Initial display of posts
  displayPosts();

  // Event delegation for dynamically created buttons
  $(document).on("click", ".delete-btn", deletePost);
  $(document).on("click", ".edit-btn", editBtnClicked);

  // Create form submission handler
  $("#createForm").submit(handleFormSubmission);

  // Clear button functionality
  $("#clearBtn").on("click", function (e) {
    e.preventDefault();
    $("#clearBtn").hide();
    $("#createBtn").removeAttr("data-id").html("Create");
    $("#post-title").val("");
    $("#user-id").val("");
    $("#post-content").val("");
  });
});
