document.addEventListener("DOMContentLoaded", function () {
  load_page("allPosts");
  // set pages
  if (window.location.href.indexOf("profile") > -1) {
    document
      .querySelector("#allPosts-button")
      .addEventListener("click", () =>
        window.location.replace("http://127.0.0.1:8000")
      );
    document
      .querySelector("#following-button")
      .addEventListener("click", function () {
        window.location.replace("http://127.0.0.1:8000");
      });
  } else {
    document
      .querySelector("#allPosts-button")
      .addEventListener("click", () => load_page("allPosts"));
    document
      .querySelector("#following-button")
      .addEventListener("click", () => load_page("following"));
  }

  document
    .querySelector("#submit-post")
    .addEventListener("submit", () => newPost());
});

function load_page(page) {
  fetch(`/load/${page}`)
    .then((response) => response.json())
    .then((response) => {
      console.log(response);
      document.querySelector("#posts").innerHTML = "";
      response.posts.forEach((element) => {
        showPosts(element);
      });
    });
}

function handleLike() {
  const actualClass = document.querySelector("#like").className;
  if (actualClass == "fa fa-heart-o") {
    document.querySelector("#like").className = "fa fa-heart";
  } else {
    document.querySelector("#like").className = "fa fa-heart-o";
  }
}

function showPosts(post, mailbox) {
  // create post div
  const postItem = document.createElement("div");
  postItem.className = "card";
  postItem.id = "post";

  // post body
  const postBody = document.createElement("div");
  postBody.className = "card-body";

  // post title
  const a = document.createElement("a");
  a.href = `http://127.0.0.1:8000/profile/${post.creatorID}`;
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
  icon.className = "fa fa-heart-o";
  icon.id = "like";
  postBody.appendChild(icon);
  icon.addEventListener("click", function () {
    handleLike("post");
    event.stopPropagation();
  });

  const likes = document.createElement("a");
  likes.innerHTML = post.likes;
  postBody.appendChild(likes);

  // post timestamp
  const timestamp = document.createElement("p");
  timestamp.className = "card-text";
  const small = document.createElement("small");
  small.className = "text-muted";
  small.innerHTML = post.timestamp;
  timestamp.appendChild(small);
  postBody.appendChild(timestamp);

  // if (post.read === false) {
  //   postItem.style.backgroundColor = "#fff";
  // } else {
  //   postItem.style.backgroundColor = "#ddd";
  // }

  // if (mailbox != "sent") {
  //   // create archive button
  //   const postButton = document.createElement("img");
  //   postButton.id = "archive-button";
  //   postButton.style.width = "30px";
  //   postButton.title = "Archive";
  //   postButton.src = "static/mail/archive_icon_128534.png";
  //   postItem.append(postButton);

  //   postButton.addEventListener("click", function () {
  //     changeArchived(post);
  //     event.stopPropagation();
  //   });
  // }

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

function handleFollow(actualState) {
  fetch(`/handleFollow/10`, {
    method: "PUT",
    body: JSON.stringify({
      userID: document.getElementById("profileID").value,
    }),
  }).then((response) => console.log(response));
}
