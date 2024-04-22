let meetingTimesArray = [];

document.querySelector("#createGroupButton").addEventListener("click", async () => {
	console.log("creating study group");

	const url = "https://study-buddy-api.azurewebsites.net/studygroup";

	const h1 = document.querySelector("h1");
	const p = document.querySelector("p");

	const token = localStorage.getItem("token");

	if (!token) {
        h1.innerHTML = "Something went wrong."

        console.log("No token found")
        return
    }

	console.log(token)

    let body = {
		name: document.getElementById("groupName").value,
		is_public: document.getElementById("isPublic").value === 'on' ? true : false,
        description: document.getElementById("description").value,
		school: document.getElementById("school").value,
        course_number: document.getElementById('courseNumber').value,
        max_participants: document.getElementById('maxParticipants').value,
        start_date: document.getElementById('start').value,
        end_date: document.getElementById('end').value,
		meeting_times: [
            ...meetingTimesArray.map((x) => {
                return {
                    day: x.querySelector("#day_"+meetingTimesArray.indexOf(x)).value,
                    time: x.querySelector("#time_"+meetingTimesArray.indexOf(x)).value,
                    location: x.querySelector("#location_"+meetingTimesArray.indexOf(x)).value
                }
            })
        ],
	};

	body = JSON.stringify(body);

    console.log(body)

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
        const userResponse = await waitForResponse("Post to Instagram?");

        if (userResponse) {
          let body = {
            caption:
              'I just created "' +
              document.getElementById("groupName").value +
              '" on Study Buddy!',
            image_url:
              "https://cdn.discordapp.com/attachments/954926822024417331/1231834316854788096/created_image.jpg?ex=6638661b&is=6625f11b&hm=ac39964df4e9995dbf65856861080368d3aa58d9b0fc4143c27a7ddc9abb1ee7&",
          };
  
          body = JSON.stringify(body);
  
          const postURL = `https://study-buddy-api.azurewebsites.net/user/sp/insta-post`;
  
          const options = {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body,
          };
  
          let response = await fetch(postURL, options);
  
          if (response.status == 201) {
            console.log("Instagram post successful!");
          } else {
            console.log("something went wrong");
          }
        }
    }
    else {
        h1.innerHTML = "Something went wrong."
    }
});




document.querySelector("#addMeetingTime").addEventListener('click', async () => {
  
    const meetingTimesDiv = document.getElementById('meetingTimes');
    const meetingTimeTemplate = document.getElementById('meetingTimeTemplate');
  
    const clonedMeetingTime = meetingTimeTemplate.cloneNode(true);
    clonedMeetingTime.style.display = 'block'; 
    meetingTimesDiv.appendChild(clonedMeetingTime);

    const inputElements = clonedMeetingTime.querySelectorAll('input');
    const selectorElements = clonedMeetingTime.querySelectorAll('select');

    inputElements.forEach((input, index) => {
        const currentId = input.id;
        const newId = currentId + '_' + meetingTimesArray.length; 
        input.id = newId;
    });
    selectorElements.forEach((input, index) => {
        const currentId = input.id;
        const newId = currentId + '_' + meetingTimesArray.length; 
        input.id = newId;
    });
  
    meetingTimesArray.push(clonedMeetingTime);


    
  
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
