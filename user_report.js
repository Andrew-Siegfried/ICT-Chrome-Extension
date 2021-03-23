/*
	Usage: Open Expired member status report and run the report. Use this to help clean out the expired members back to guests. There is no way to batch run anything, this will help.
*/


window.addEventListener('load', function () 
{
	cleanExpiredMembers();
	
	let collectedIDs = [];
	
	function cleanExpiredMembers()
	{
		var reportType = document.getElementsByClassName("chosen-single");
		reportType = reportType[1];
		var showButton = reportType.firstChild.innerText == "Expired Member Status Report";
		if (showButton)
		{ //enable button
			
			var expiredButton = document.createElement("button");
			var saveButton = document.getElementById("grayButton");
			saveButton.removeAttribute("onclick");
			expiredButton = saveButton.cloneNode(true);
			expiredButton.id = "expired-button";
			expiredButton.className = "btn btn-sm btn-primary";
			expiredButton.innerText = "Remove Expired";
			expiredButton.style.border = "1px solid #810000";
			expiredButton.style.cursor = "pointer";
			expiredButton.style.backgroundColor = "#B30000";
			
			saveButton.parentElement.parentElement.insertBefore(expiredButton,saveButton.parentElement.parentElement.childNodes.item(2));
			
			var expiredSpan = document.createElement("span");
			expiredSpan.className = "ca-pro-ui";
			expiredSpan.innerHTML = "&nbsp;&nbsp;";
			var parentE = expiredButton.parentNode;
			parentE.replaceChild(expiredSpan, expiredButton);
			expiredSpan.appendChild(expiredButton);
			expiredButton.onclick= function() {var run = confirm("Clear Expired Members? NOTE - Manually Click Edit then Remove Membership on profiles."); if (run) {removeExpired()}};
		}
	}
	
	function getRandomInt(max) 
	{
		return Math.floor(Math.random() * Math.floor(max));
	}
	
	function sleep(ms) 
	{
		return new Promise(resolve => setTimeout(resolve, ms));
	}
	
	function removeExpired() 
	{
		var reportTable = document.getElementById('report-parent-container');
		
		if (typeof(reportTable) != 'undefined' && reportTable != null && reportTable.childNodes.length > 1)
		{
			var rosterRows = reportTable.childNodes.item(1).childNodes.item(1).rows;

			for (var i = 0; i<rosterRows.length; i++) 
			{
				if (i > 0)
				{
					if (rosterRows[i].childNodes.length > 1)
					{
						collectedIDs.push(rosterRows[i].childNodes.item(1).value);
					}
				}
			}
			if (collectedIDs.length > 0)
			{
				removeExpiredUsers(collectedIDs);
			}
		}
		else
		{
			alert("Make sure you run the report first!");
		}
	}
	
	async function removeExpiredUsers(collectedIDs) //this just goes through the users and lowers the clicks you do.. you have 10s to click!
	{
		for (var j = 0; j<collectedIDs.length; j++) 
		{
			var caFrame = document.createElement("IFRAME");
			var topBar = document.getElementById("report-filters-container");
			caFrame.setAttribute("src", "https://innercitytennis.clubautomation.com/user/edit?id="+collectedIDs[j]+"&cid=memberships");
			var randomNum = getRandomInt(10000);
			var frameID = "ca-frame" + randomNum;
			caFrame.setAttribute('id', frameID);
			caFrame.setAttribute("width", 1200);
			caFrame.setAttribute("height", 800);
			topBar.appendChild(caFrame);
			var iframe = document.getElementById(frameID);
			var membershipView = iframe.contentWindow.document.getElementById('membershipView');
			while (typeof(membershipView) == 'undefined' || membershipView == null) 
			{
				await sleep(500);
				membershipView = iframe.contentWindow.document.getElementById('membershipView');
			}
			var iw = document.getElementById(frameID).contentWindow;
			var addButton = iw.document.getElementById("addMembershipButton");
			addButton.click();
			var addonMenu = iw.document.getElementById("clickable-1");
			while (typeof(addonMenu) == 'undefined' || addonMenu == null) 
			{
				await sleep(200);
				addonMenu = iframe.contentWindow.document.getElementById('clickable-1');
			}
			var lis = iw.document.getElementById("clickable-1").firstChild.firstChild.firstChild.getElementsByTagName("li");

			if(lis[1].innerText == "Guest")
			{
				lis[1].firstChild.click();
				var submitButton = iw.document.getElementById("submitButton");
				submitButton.click();
				var saveButton = iw.document.getElementById("membership-8-saveButton");
				while (typeof(saveButton) == 'undefined' || saveButton == null) 
				{
					await sleep(200);
					saveButton = iframe.contentWindow.document.getElementById('membership-8-saveButton');
				};
				saveButton.click();
				
				var membershipTabs = iw.document.getElementsByClassName("memberships-tabs");
				var membershipTab = membershipTabs[0];
				console.log("membershipTab ",membershipTab.childNodes.item(7));
				membershipTab.childNodes.item(7).click();
				await sleep(10000);
				document.getElementById(frameID).remove();
			}
			else
			{
				await sleep(1000);
				document.getElementById(frameID).remove();
			}
		}
	}
})