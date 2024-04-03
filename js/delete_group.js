const button = document.querySelector("#delete-button");

button.addEventListener("click", async (ev) => {
	const modal = document.getElementById("myModal");
	const id = modal.value;

	const url = `https://study-buddy-api.azurewebsites.net/studygroup/${id}`;
	const token = localStorage.getItem("token");

	if (!token) {
		console.log("No token found");
		return;
	}

	const options = {
		method: "DELETE",
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
		},
	};


    console.log('awaiting response')

    const userResponse = await waitForResponse();

    if(!userResponse) {
        console.log('aborted')
        return;
    } else {
        console.log('confirmed')
    }

	let response = await fetch(url, options);

    

	if (response.status == 200) {
        console.log('Study group deleted')
	} else {
		console.log("Something went wrong.");
	}

    location.reload()
});

function waitForResponse() {
    return new Promise(resolve => {
      const modal = document.getElementById('yesno');
      modal.style.display = 'block';
  
      window.chooseOption = function(option) {
        modal.style.display = 'none';
        resolve(option);
      };
    });
  }
