const button = document.querySelector("#join-button");

button.addEventListener("click", async (ev) => {
  const modal = document.getElementById("myModal");
  const id = modal.value;
  const mode = button.value;

  const url = `https://study-buddy-api.azurewebsites.net/studygroup/${id}/participants?${mode}`;
  console.log(url);
  const token = localStorage.getItem("token");

  if (!token) {
    console.log("No token found");
    return;
  }

  let body = {
    user: localStorage.getItem("id"),
  };

  body = JSON.stringify(body);

  console.log(body);

  const options = {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body,
  };

  let response = await fetch(url, options);

  if (response.status == 200) {
    console.log(
      "successfully " +
        (mode === "add=true" ? "added " : "removed ") +
        "from group."
    );

    if (mode === "add=true") {
      const userResponse = await waitForResponse("Post to Instagram?");

      if(userResponse) {


        let body = {
          caption: "I just joined " + modal.querySelector("[data-name]").textContent + " on Study Buddy!",
          image_url: "https://cdn.discordapp.com/attachments/954926822024417331/1231823192532979763/joined_image.jpg?ex=66385bbf&is=6625e6bf&hm=07ca5b438dddc7aff54b248a53d5d810b717fa26327c145f935d89d774df3044&"
        }

        const options = {
          method: "POST",
          headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
          },
          body
      }

      let response = await fetch(url, options)

      if (response.status == 201) {
          console.log("Instagram post successful!")
      location.href = "home.html";
      }
      else {
          console.log("something went wrong")
      }
      }
    }
  } else {
    console.log("Something went wrong.");
  }

  location.reload();
});

function waitForResponse(title) {
  return new Promise((resolve) => {
    const modal = document.getElementById("yesno");
    const modalTitle = modal.querySelector("[data-modal-title]");
    modalTitle.textContent = title;
    modal.style.display = "block";

    window.chooseOption = function (option) {
      modal.style.display = "none";
      resolve(option);
    };
  });
}
