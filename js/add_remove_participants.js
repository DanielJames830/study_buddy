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

    const userResponse = await waitForResponse("Post to Instagram?");
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
