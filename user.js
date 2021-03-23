/*
	Adds a simple feature that allows staff to open events a user is signed up for directly from their profile.
	Eliminating the need to open a new tab and searching for the program/date/time of the session.
*/

window.addEventListener('load', function () 
{
	var registrationWindow = document.getElementById('p-body-registrations');
	
	var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
	var observerRegistration = new MutationObserver(rosterMe);
	observerRegistration.observe(registrationWindow, { childList: true, subtree: true });
	
	function rosterMe() 
	{
		let programTable = document.getElementById('future_active_programs');
		if (typeof(programTable) != 'undefined' && programTable != null)
		{
			var table = programTable.childNodes.item(1);
			var replace = [];
			for (var i = 0, row; row = table.rows[i]; i++) 
			{
				if (row.cells[0].className == "td-num")
				{
					if (row.cells[0].innerText.indexOf("Class") < 0)
					{
						replace.push(row.cells[0]);
					}
				}
			}
			
			if (replace.length > 0) 
			{
				observerRegistration.disconnect(); //DO NOT REMOVE! WILL ENDLESS LOOP AND CRASH PAGE
				for (var i = 0; i < replace.length; i++) 
				{
					let id = replace[i].innerText; //make this clickable!
					replace[i].innerHTML = "<a target='_blank' href='https://innercitytennis.clubautomation.com/event/view-all?eventId="+id+"'>"+id+"</a>"
				}
				observerRegistration.observe(registrationWindow, { childList: true, subtree: true });
			}
		}
	}
})