document.addEventListener("DOMContentLoaded", function () {
  document.querySelector("#profile-header").style.display = "none";

  // set pages
  document
    .querySelector("#allPosts-button")
    .addEventListener("click", () => load_page("allPosts"));
  document
    .querySelector("#following-button")
    .addEventListener("click", () => load_page("following"));

  document
    .querySelector("#submit-post")
    .addEventListener("submit", () => newPost());
});

window.onload = function () {
  document.querySelector("#allPosts-button").click();
};

function load_page(page, profileID, page_number) {
  const pageNumber = page_number ? page_number : 1;
  if (page != "profile") {
    document.querySelector("#profile-header").style.display = "none";
  } else {
    document.querySelector("#profile-header").style.display = "block";
  }

  if (profileID) {
    fetch(`/profile/${profileID}/${pageNumber}`)
      .then((response) => response.json())
      .then((response) => {
        document.querySelector("#posts").innerHTML = "";
        document.querySelector("#profile-username").innerHTML =
          response.profile.username;
        document.getElementById(
          "following"
        ).innerHTML = `Following - ${response.profile.following}`;
        document.getElementById(
          "followers"
        ).innerHTML = `Following - ${response.profile.followers}`;
        if (response.profile.isFollowing) {
          document.querySelector("#follow-button").innerHTML = "Unfollow";
        } else {
          document.querySelector("#follow-button").innerHTML = "Follow";
        }
        if (response.profile.canFollow) {
          document.querySelector("#follow-button").style.display = "block";
        } else {
          document.querySelector("#follow-button").style.display = "none";
        }
        response.posts.forEach((element) => {
          showPosts(element, response.user);
        });
        buildPaginator(
          "profile",
          response.numberOfPages,
          profileID,
          pageNumber
        );
      })
      .then((response) => {
        document.querySelector("#follow-button").onclick = function () {
          handleFollow(profileID);
        };
      });
  } else {
    fetch(`/load/${page}/${pageNumber}`)
      .then((response) => response.json())
      .then((response) => {
        document.querySelector("#posts").innerHTML = "";
        response.posts.forEach((element) => {
          showPosts(element, response.user);
        });
        buildPaginator(page, response.numberOfPages, null, pageNumber);
      });
  }
  window.scrollTo(0, 0);
}

function showPosts(post, user) {
  // create post div
  const postItem = document.createElement("div");
  postItem.className = "card";
  postItem.id = "post";

  // post body
  const postBody = document.createElement("div");
  postBody.className = "card-body";

  // post title
  const a = document.createElement("a");
  a.onclick = function () {
    load_page("profile", post.creatorID);
    document.querySelector("#profile-header").style.display = "block";
  };
  a.href = "javascript:void(0);";

  const title = document.createElement("h5");
  title.className = "card-title";
  title.innerHTML = post.creator;
  a.appendChild(title);
  postBody.appendChild(a);

  // post - edit
  if (post.creator == user) {
    const editDiv = document.createElement("div");
    editDiv.style.display = "none";
    editDiv.id = `edit-form-${post.id}`;
    const editInput = document.createElement("textarea");
    editInput.className = "form-control";
    editInput.value = post.content;
    editDiv.appendChild(editInput);

    const editButton = document.createElement("button");
    editButton.innerHTML = "Save";
    editButton.className = "btn btn-info";
    editButton.onclick = function () {
      document.querySelector(`#post-content-${post.id}`).innerHTML =
        editInput.value;
      document.querySelector(`#post-content-${post.id}`).style.display =
        "block";
      document.querySelector(`#edit-button-${post.id}`).style.display = "block";
      document.querySelector(`#edit-form-${post.id}`).style.display = "none";

      fetch(`/editPost`, {
        method: "PUT",
        body: JSON.stringify({
          postID: post.id,
          content: editInput.value,
        }),
      });
    };
    editDiv.appendChild(editButton);

    const edit = document.createElement("a");
    edit.href = "javascript:void(0);";
    edit.id = `edit-button-${post.id}`;
    edit.className = "card-text";
    edit.innerHTML = "edit";
    edit.onclick = function () {
      document.querySelector(`#post-content-${post.id}`).style.display = "none";
      document.querySelector(`#edit-button-${post.id}`).style.display = "none";
      document.querySelector(`#edit-form-${post.id}`).style.display = "block";
    };
    postBody.appendChild(editDiv);
    postBody.appendChild(edit);
  }

  // post content
  const content = document.createElement("p");
  content.className = "card-text";
  content.innerHTML = post.content;
  content.id = `post-content-${post.id}`;
  postBody.appendChild(content);

  // post icon
  const icon = document.createElement("i");
  icon.className = post.liked ? "fa fa-heart" : "fa fa-heart-o";
  icon.id = `like-${post.id}`;
  postBody.appendChild(icon);
  icon.addEventListener("click", function () {
    handleLike(post);
    event.stopPropagation();
  });

  const likes = document.createElement("a");
  likes.id = `likes-${post.id}`;
  likes.innerHTML = ` ${post.likes}`;
  postBody.appendChild(likes);

  // post timestamp
  const timestamp = document.createElement("p");
  timestamp.className = "card-text";
  const small = document.createElement("small");
  small.className = "text-muted";
  small.innerHTML = post.timestamp;
  timestamp.appendChild(small);
  postBody.appendChild(timestamp);

  postItem.appendChild(postBody);
  document.querySelector("#posts").append(postItem);
}

function newPost() {
  fetch("/newPost", {
    method: "POST",
    body: JSON.stringify({
      content: document.getElementById("compose-content").value,
    }),
  })
    .then((response) => response.json())
    .then(() => load_page("allPosts"))
    .catch((error) => {
      console.log("Error:", error);
    });
  return false;
}

function handleFollow(profileID) {
  fetch(`/handleFollow`, {
    method: "PUT",
    body: JSON.stringify({
      profileID: profileID,
    }),
  })
    .then((response) => response.json())
    .then((response) => {
      const actualState = response.actualState;
      followButton = document.getElementById("follow-button");
      followButton.innerHTML = actualState;
      followButton.className =
        actualState === "follow" ? "btn btn-danger" : "btn btn-info";
      document.getElementById(
        "followers"
      ).innerHTML = `Followers - ${response.followers}`;
    });
}

function handleLike(post) {
  const actualClass = document.querySelector(`#like-${post.id}`).className;
  if (actualClass == "fa fa-heart-o") {
    document.querySelector(`#like-${post.id}`).className = "fa fa-heart";
  } else {
    document.querySelector(`#like-${post.id}`).className = "fa fa-heart-o";
  }

  fetch(`/handleLike`, {
    method: "PUT",
    body: JSON.stringify({
      postID: post.id,
    }),
  })
    .then((response) => response.json())
    .then((response) => {
      document.querySelector(
        `#likes-${post.id}`
      ).innerHTML = ` ${response.likesCount}`;
    });
}

function buildPaginator(page, numPages, profileID, pageNumber) {
  const pagination = document.querySelector("#pagination");

  pagination.innerHTML = "";
  if (pageNumber > 1) {
    const li = document.createElement("li");
    li.className = "page-item";
    const a = document.createElement("a");
    a.className = "page-link";
    a.innerHTML = "Previous";
    a.onclick = function () {
      if (profileID) {
        load_page(page, profileID, pageNumber - 1);
      } else {
        load_page(page, null, pageNumber - 1);
      }
    };
    li.appendChild(a);
    pagination.appendChild(li);
  }

  if (numPages > 1) {
    for (let i = 0; i < numPages; i++) {
      const li = document.createElement("li");
      li.className = i + 1 == pageNumber ? "page-item active" : "page-item";
      const a = document.createElement("a");
      a.className = "page-link";
      a.innerHTML = i + 1;
      a.onclick = function () {
        if (profileID) {
          load_page(page, profileID, i + 1);
        } else {
          load_page(page, null, i + 1);
        }
      };
      li.appendChild(a);
      pagination.appendChild(li);
    }
  }

  if (pageNumber < numPages) {
    const li = document.createElement("li");
    li.className = "page-item";
    const a = document.createElement("a");
    a.className = "page-link";
    a.innerHTML = "Next";
    a.onclick = function () {
      if (profileID) {
        load_page(page, profileID, pageNumber + 1);
      } else {
        load_page(page, null, pageNumber + 1);
      }
    };
    li.appendChild(a);
    pagination.appendChild(li);
  }
}
