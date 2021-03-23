/*
	Runs when a user opens a group class attendance page
	It will create a label next to their name stating their current membership status.
	Statuses include member, non-member, expired or staff.
	
	Helps with staff being able to see their status quickly compared to opening up their profile and checking there to verify drill/class eligibility 
	Checks all users from user report once per day.
*/

window.addEventListener('load', function () 
{
	var standaloneTable = document.getElementById('stand-alone-roster');
	var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
	var observer = new MutationObserver(tableLoop);
	observer.observe(standaloneTable, { childList: true, subtree: true });
	let currentURL = "";
	var handledInfo = [];
	chrome.storage.local.get({
	memberDataStorage: []
	}, function(items) 
	{
		handledInfo = items.memberDataStorage;
		tableLoop();
	})
	
	function tableLoop() //loop through the attendance roster
	{
		var rosterTable = document.getElementById('ca-roster-table');
		if (typeof(rosterTable) != 'undefined' && rosterTable != null)
		{
			var rosterRows = rosterTable.rows;
			observer.disconnect(); //prevent infinate loop from observer. Don't move!
			for (var i = 0; i<rosterRows.length; i++) 
			{
				if (i > 1)
				{
					if (rosterRows[i].childNodes.length > 1) //filter out invisible rows
					{
						var userID = rosterRows[i].childNodes.item(3).childNodes.item(1).childNodes.item(1).getAttribute("data-user-id");
						var nameElement = document.getElementById("user_name_"+userID);
						if (nameElement.innerHTML.indexOf("label") < 0) //check to see if we have already labeled this user otherwise infinite label loop
						{
							getStatus(userID,nameElement); 
						}
					}
				}
			}
			observer.observe(standaloneTable, { childList: true, subtree: true });
			currentURL = window.location.href;
		}
	}
	
	async function getStatus(userID,nameElement)
	{
		var original = nameElement.innerHTML;
		if (handledInfo.length >= parseInt(userID))
		{
			if (handledInfo[userID] != null) //check their status and update the content label next to the username.. with colors!
			{
				var statusType = handledInfo[userID];
				if(statusType == "Member")
				{
					nameElement.innerHTML = original + "<span class='label label-success'>"+statusType+"</span>";
				}
				else
				{
					if(statusType == "Non-member")
					{
						nameElement.innerHTML = original + "<span class='label label-warning'>"+statusType+"</span>";
					}
					else
					{
						nameElement.innerHTML = original + "<span class='label label-danger'>"+statusType+"</span>";
					}
				}
			}
		}
	}
})