document.addEventListener("DOMContentLoaded", function () {
  document.querySelector("#profile-header").style.display = "none";

  // set pages
  document
    .querySelector("#allPosts-button")
    .addEventListener("click", () => load_page("allPosts"));
  document
    .querySelector("#following-button")
    .addEventListener("click", () => load_page("following"));

  load_page("allPosts");

  document
    .querySelector("#submit-post")
    .addEventListener("submit", () => newPost());
});

function load_page(page, profileID) {
  if (page != "profile") {
    document.querySelector("#profile-header").style.display = "none";
  } else {
    document.querySelector("#profile-header").style.display = "block";
  }

  if (profileID) {
    fetch(`/profile/${profileID}`)
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
        if (response.isFollowing) {
          document.querySelector("#follow-button").innerHTML = "Unfollow";
        } else {
          document.querySelector("#follow-button").innerHTML = "Follow";
        }
        if (!response.profile.canFollow) {
          document.querySelector("#follow-button").style.display = "none";
        } else {
          document.querySelector("#follow-button").style.display = "block";
        }
        response.posts.forEach((element) => {
          showPosts(element);
        });
      })
      .then((response) => {
        document.querySelector("#follow-button").onclick = function () {
          handleFollow(profileID);
        };
      });
  } else {
    fetch(`/load/${page}`)
      .then((response) => response.json())
      .then((response) => {
        document.querySelector("#posts").innerHTML = "";
        response.posts.forEach((element) => {
          showPosts(element);
        });
      });
  }
}

function showPosts(post) {
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

  // post content
  const content = document.createElement("p");
  content.className = "card-text";
  content.innerHTML = post.content;
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
      console.log(response);
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
      console.log(response);
      document.querySelector(
        `#likes-${post.id}`
      ).innerHTML = ` ${response.likesCount}`;
    });
}
