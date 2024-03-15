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
        console.log("Group creation successful")
		location.href = "home.html";
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

