/*
	Base for the extension. Modifies the experience of the scheduler from a few shades of blues and greens to any color for any program.
	Used to improve the speed of the staff to be able to quickly recognize what is infront of them on the screen.
	Other features include a toggle on/off edit button to move around reservations. Previously edit button only allowed one item to move and it had to be turned back on each time.
	Quick buttons to open up rosters, eliminating the use of the drop down menu. Speeds up the use of the program.
	Checks if the report for all member data needs to be updated. 
	Adds a button to download all child program rosters for that date.
*/

window.addEventListener('load', function () 
{
	var courtService = document.getElementById('court-service');
	
	var path = window.location.pathname;
	var moveable = false;
	var found = path.search("schedule");
	var openedPop = false;
	var closedPop = false;
	if (found)
	{
		courtService = document.getElementById('tennis_page');
		changeColors();
	}
	var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
	var observer = new MutationObserver(callback);
	var observerCourt = new MutationObserver(changeColors);
	
	observer.observe(courtService, { childList: true, subtree: true });
	//for the button on the pop up info menu
	function waitForAddedNode(params) 
	{
		new MutationObserver(function(mutations) 
		{
			var el = document.getElementById(params.id);
			if (el) 
			{
				this.disconnect();
				popUpMenu();
				params.done(el);
			}
		}).observe(params.parent || document, {
			subtree: !!params.recursive,
			childList: true,
		});
	}
	
	function popUpMenu()
	{
		waitForAddedNode({
			id: 'court-info-div',
			parent: document.getElementsByClassName('ca-layout')[0],
			recursive: false,
			done: function(el) 
			{
				var eventActions = document.getElementById("eventActions");
				if (typeof(eventActions) != 'undefined' && eventActions != null)
				{
					var options = eventActions.options;
					for (let item of options) 
					{
						if(item.outerText == "ROSTER")
						{
							var dblClick = item.getAttribute("ondblclick");
							var end = dblClick.slice(-40);
							var snip = dblClick.slice(19,-43);
							var URL = "https://innercitytennis.clubautomation.com" + snip;
							var rosterButton = document.createElement("Button");
							rosterButton.innerHTML = "Open Roster";
							rosterButton.style.fontSize = '8px';
							rosterButton.style.cssText = "border: 1px solid black;height: 20px;width: 100px;color:black; float:left; display: flex;align-items: center;justify-content: center;";
							rosterButton.setAttribute("onclick", "window.open('"+URL+"', '_blank'); "+end);
							eventActions.parentNode.insertBefore(rosterButton, eventActions.nextSibling.nextSibling.nextSibling);
						}
					}
				}
			}
		})
	}
	popUpMenu();

	//edit button. Pink == toggled on
	var editBtn = document.getElementById('edit-button');
	var observerButton = new MutationObserver(function() 
	{
		if (editBtn.style.display != 'none') 
		{
			editBtn.style.display = "none";
			showEdit();
		}
	});
	observerButton.observe(editBtn, { 
		attributes: true, 
		childList: true 
	});
	
	var buttons = document.getElementById('buttons');
	var newEdit = document.createElement("button");
	saveEdit = editBtn.cloneNode(true);
	newEdit.innerHTML = "<span id='edit-span' style='display:inline-block'>&nbsp;</span>Edit";
	editBtn.removeAttribute("onclick");
	newEdit = editBtn.cloneNode(true);
	
	newEdit.innerHTML = "<span id='edit-span'>&nbsp;</span>Edit";
	newEdit.id = "edit-button2";
	buttons.insertBefore(newEdit, editBtn);
	var editSpan = document.getElementById("edit-span");
	editSpan.style.background = "url(https://d2ere2cfovy9ll.cloudfront.net/l_cfe41d7c4ae381aa672f2ed5afdd0701/resources/v_1505005914/public/images/themes/cpac/court_button_edit_small.png) 0 -1px";
	editSpan.style.background.repeat = "no-repeat";

	document.getElementById('edit-button2').onclick = function() 
	{
		var edit = document.getElementById('edit-button2');
		if (( (edit.offsetWidth > 0) || (edit.offsetHeight > 0) || (edit.getClientRects().length > 0) ) === true)
		{
			moveable = moveable ? false : true;
			if(moveable)
			{
				newEdit.style.backgroundColor = "#f8b9cb";
				newEdit.style.backgroundImage = "url(" + chrome.runtime.getURL("images/pink.gif") +")";
				newEdit.style.background.repeat = "repeat-x";
			}
			else
			{
				newEdit.style.backgroundColor = "#eeedea";
				newEdit.style.backgroundImage = "url(https://d2ere2cfovy9ll.cloudfront.net/l_cfe41d7c4ae381aa672f2ed5afdd0701/resources/v_1505005897/public/images/button-bg.gif)";
				newEdit.style.background.repeat = "repeat-x";
			}
			editBtn.click();
		}
	}
	
	document.getElementById('reserve-permanent-member-button').addEventListener("click",hideEdit);
	document.getElementById('reserve-permanent-staff-button').addEventListener("click",hideEdit);
	document.getElementById('reserve-block-button').addEventListener("click",hideEdit);
	
	newEdit.style.display = "none";	
	
	function showEdit() 
	{
		newEdit.style.display = "block";
	}
	
	function hideEdit() 
	{
		newEdit.style.display = "none";
		if(moveable)
		{
			moveable = false;
			newEdit.style.backgroundColor = "#eeedea";
			newEdit.style.backgroundImage = "url(https://d2ere2cfovy9ll.cloudfront.net/l_cfe41d7c4ae381aa672f2ed5afdd0701/resources/v_1505005897/public/images/button-bg.gif)";
			newEdit.style.background.repeat = "repeat-x";
			editBtn.click();
		}
	}
	//roster button for downloading
	var printButton = document.getElementsByClassName('btn-print');
	printButton = printButton[0];
	var downloadRosters = document.createElement("button");
	printButton.removeAttribute("onclick");
	downloadRosters = printButton.cloneNode(true);
	
	downloadRosters.id = "roster-button2";
	downloadRosters.className = "left-oriented";
	downloadRosters.style.background = "url(" + chrome.runtime.getURL("images/down-arrow.png") +") -2px -2px";
	downloadRosters.style.height = "25px";
	downloadRosters.style.width = "25px";
	downloadRosters.style.border = "1px solid #9ea2a6";
	downloadRosters.style.cursor = "pointer";
	downloadRosters.style.marginLeft = "5px";
	downloadRosters.style.backgroundColor = "#eeedea";
	
	printButton.parentElement.style = "width: 91px;"
	
	printButton.parentElement.insertBefore(downloadRosters, printButton);
	
	document.getElementById('roster-button2').onclick= function() {var run = confirm("Download all Junior Rosters for today?"); if (run) {downloadAllRosters()}};
	
	function getRandomInt(max) 
	{
		return Math.floor(Math.random() * Math.floor(max));
	}
	//load saved report, run it and get user data, save user data. Wipe if we are reading it. CLEAN READS ONLY!
	async function runMemberCheck() 
	{
		chrome.storage.local.set({
		memberDataStorage: []
		}, function() {
		});
		var memberData = [];
		
		var service = document.getElementById('court-service');
		var caFrame = document.createElement("IFRAME");
		caFrame.setAttribute("src", "https://innercitytennis.clubautomation.com/report/user-report/?id=47");
		var randomNum = getRandomInt(10000);
		var frameID = "ca-frame" + randomNum;
		caFrame.setAttribute('id', frameID);
		caFrame.setAttribute("width", 0);
		caFrame.setAttribute("height", 0);
		service.appendChild(caFrame);
		var iframe = document.getElementById(frameID);
		var runButton = iframe.contentWindow.document.getElementById('blueButton');
		while (typeof(runButton) == 'undefined' || runButton == null) 
		{
			await sleep(500);
			runButton = iframe.contentWindow.document.getElementById('blueButton');
		}
		runButton.click();
		var pageContainer = document.getElementsByClassName('container-paginate');
		var loopCount = 0;
		
		while (pageContainer.length < 1 || loopCount > 50) 
		{
			loopCount = loopCount + 1;
			await sleep(500);
			pageContainer = iframe.contentWindow.document.getElementsByClassName('container-paginate');
		}
		
		if (pageContainer.length > 0)
		{
			pageContainer = pageContainer[0];
		}
		
		var memberPagesRemain = true;
		var reportParent = iframe.contentWindow.document.getElementById('report-parent-container');
		loopCount = 0;
		
		while( memberPagesRemain )
		{
			var resultTable = reportParent.childNodes.item(1).childNodes.item(1);
			
			var active = iframe.contentWindow.document.getElementsByClassName('active');
			var items = active[0].parentNode.getElementsByTagName("li");
			
			for (var i = 0, row; row = resultTable.rows[i]; i++) 
			{
				let memberNumber = row.cells[1].childNodes.item(1).getAttribute("user-id");
				let memberStatus = row.cells[2].innerText;
				memberStatus = memberStatus == "Active" ? memberStatus = "Member" : memberStatus = memberStatus;
				
				memberData[memberNumber] = memberStatus;
			}
			
			for (var i = 0; i < items.length; ++i) 
			{
				if(items[i].classList.contains("active"))
				{
					var next = i+1;
					if(next <= items.length)
					{
						if(items[next].classList.contains("disabled"))
						{
							memberPagesRemain = false;
						}
						else
						{
							let counter = iframe.contentWindow.document.getElementsByClassName('counter');
							let currentPageText = counter[0].innerText;
							items[next].firstChild.click();
							while (counter[0].innerText == currentPageText) 
							{
								await sleep(500);
								counter = iframe.contentWindow.document.getElementsByClassName('counter');
							}
							break;
						}
					}
				}
			}
			loopCount = loopCount + 1;
		}
		document.getElementById(frameID).remove();
		chrome.storage.local.set({
		memberDataStorage: memberData
		}, function() {
		});
	}

	function updateSeen() 
	{
		var sec = Math.round(Date.now()/1000);
		chrome.storage.local.set({
		seenTime: sec
		}, function() {
		});
		return sec;
	}

	function checkSeen() 
	{
		chrome.storage.local.get({
		seenTime: 0
		}, function(items) 
		{
			
			var seen = items.seenTime;
			var now = Math.round(Date.now()/1000);
			var week = 86400; //once per week = 604800
			
			if ((now - seen) >= week) 
			{
				updateSeen();
				runMemberCheck();
			}
		})
	}

	checkSeen();
	
	async function downloadAllRosters() 
	{
		var list = document.getElementsByClassName('wrapEvent');
		var handlededEvents = [];
		var focusTab = window.location;
		for (let item of list) 
		{
			if (item.childElementCount > 0) 
			{
				var child = item.firstChild;
				
				if (child.classList.contains("event-type-2")) //programs
				{
					var programPrintList = ["6U","8U","10U","12U","18U"];
					for (let programAgeItem of programPrintList)
					{
						var found = child.firstChild.firstChild.innerText.indexOf(programAgeItem);
						if (found >= 0)
						{
							var eventID = "";
							child.classList.forEach(name => {
								if(name.indexOf("event-") == 0)
								{
									var res = name.split("-");
									if(res.length < 3)
									{
										eventID = res[1];
									}
								}
							})
							
							if (!(handlededEvents.includes(eventID)))
							{
								handlededEvents.push(eventID);
								var url = "https://innercitytennis.clubautomation.com/event/event-action?doAction=attendance&ajax=1&id="+eventID+"&csv=1";
								var handle = window.open(url, '_blank');
								await sleep(800);
							};
							break;
						}
					}
				}
			}
		}
	}
	
	function sleep(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}
	
	function callback(mutationList, observer) 
	{
		mutationList.forEach((mutation) => {
			if (mutation.target.id === "courtsInfo")
			{
				var courtInfo = document.getElementById('courtsInfo');
				changeColors();
				observerCourt.observe(courtInfo, { childList: true, subtree: true });
				observer.disconnect();
			}
		});
	}
	
	function editMode() 
	{
		if(moveable)
		{
			editBtn.click();
		}
	}

	function changeColors() 
	{
		editMode();
		chrome.storage.sync.get({
		reservedBorderColor: 'ff1fff',
		reservedInsideColor: 'ffccff',
		
		lessonBorderColor: '808080',
		lessonInsideColor: 'cccccc',
		
		seasonBorderColor: 'D6AC81',
		seasonInsideColor: 'FFCC99',
		
		excellenceTeam: true,
		
		colorModVersionNo: "1.0",
		
		groupClassType: [["Adult Drills","90 Min,60 Min,Dbls Drill,Drill &amp; Play,Invitational,Jellison,Foster,Buchmeier Drill,Jones Drill","1E7CD9","99CCFF"],["50+ Drills","50\\+ Drill","82D9AE","99FFCC"],["Senior PCT","Seniors,SPCT","A9D4A9","CCFFCC"],["Leagues","Mixed,Men Eve,Women's Doubles, EBL,LG ","00B2DE","00CCFF"],["WDL","4.5 Buchmeier,3.0 Anderson,3.0 Buchmeier,4.0 Buchmeier,3.5 Buchmeier,3.5 Anderson,WDL","8383A3","CCCCFF"],["Outreach","SS -,Volunteer,Super Saturday","822BD9","9933FF"],["USTA","USTA","0057D9","0066FF"],["Events","Events","D68100","FF9900"],["School","School","E0E0B4","FFFFCC"],["XTeam","XTeam","D68181","FF9999"],["Scramble Event","Scramble","782e40","AA6677"]],
		programType: [["PCT Semi Annual","PCT - Semi Annual","D6AC81","FFCC99"],["Jr 10 and Under","Red Rockets,Orange Crushers","D68181","FF9999"],["Adv 10 and Under","Orange Advanced,Red Advanced","D47F55","FF9966"],["Jr 10 and Over","18U Fast Track,Green Machines","28A150","33CC66"],["Adv 10 and Over","Yellow Transition,Green Advanced","00D154","00FF66"],["Varsity","Yellow Acers","5AE087","66FF99"],["High Performance","High Performance","2BD6AB","33FFCC"],["Adult Lesson","Adult Lesson","2DC7B4","33E1CC"],["Outreach Programs","Volunteer Courts,Super Saturday","822BD9","9933FF"]]
		
		}, function(items) {
			
			var currentVersionNo = "1.4"; //Set this to the most recent version. If it is different from the version in storage then it will wipe and update the version.
			//If you want to update new global colors for everyone using this extension 
			//update groupClassType and programType in the following places:
			//colormod.js lines 131 and 132 in the function changeColors()
			//options.js lines 159 and 160 in the function restore_options()
			//options.js lines 247 and 248 in the function display_Tables()
			//simply copy paste across all three locations and then save all files.
			//Each [] indicates the group class/program title, identifiers, boarder color, and inside color (comma separated) 
			//match to number in manifest.json (both must be changed when version updates on chrome)
			
			var list = document.getElementsByClassName('wrapEvent');
			
			for (let item of list) 
			{
				if (item.childElementCount > 0) 
				{
					var child = item.firstChild;
					if (child.classList.contains("event-type-1")) //group class
					{
						var handle = false;
						
						for (let groupClassInfo of items.groupClassType)
						{
							var groupClassInfoList = groupClassInfo[1].split(",");
							for (let groupClassInfoItem of groupClassInfoList)
							{
								var found = child.innerHTML.search(groupClassInfoItem);
								if (found > 0)
								{
									handle = true;
									child.style.borderColor = "#".concat(groupClassInfo[2]);
									child.style.backgroundColor = "#".concat(groupClassInfo[3]);
									child.firstChild.style.background = "#".concat(groupClassInfo[2]);
								}
							}
							if (handle) {
								break;
							}
						}
					}
					
					if (child.classList.contains("event-type-2")) //programs
					{
						var handle = false;
						
						for (let programInfo of items.programType)
						{
							var programInfoList = programInfo[1].split(",");
							for (let programInfoItem of programInfoList)
							{
								var found = child.innerHTML.search(programInfoItem);
								if (found > 0)
								{
									handle = true;
									child.style.borderColor = "#".concat(programInfo[2]);
									child.style.backgroundColor = "#".concat(programInfo[3]);
									child.firstChild.style.background = "#".concat(programInfo[2]);
								}
							}
							if (handle) {
								break;
							}
						}
					}
					
					if (child.classList.contains("event-type-4-recurring")) //pct court time
					{
						child.style.borderColor = "#".concat(items.seasonBorderColor);
						child.style.backgroundColor = "#".concat(items.seasonInsideColor);
						child.lastChild.style.color = "#000000";
						child.firstChild.style.background = "#".concat(items.seasonBorderColor);
					}
					
					if (child.classList.contains("event-type-4")) //court time
					{
						child.style.borderColor = "#".concat(items.reservedBorderColor);
						child.style.backgroundColor = "#".concat(items.reservedInsideColor);
						child.firstChild.style.background = "#".concat(items.reservedBorderColor);
						
						if(items.excellenceTeam) 
						{
							var found = child.innerHTML.search("Team");
							if (found > 0)
							{
								child.style.borderColor = "#".concat("D68181");
								child.style.backgroundColor = "#".concat("FF9999");
								child.firstChild.style.background = "#".concat("D68181");
							}
						}
					}
					
					if (child.classList.contains("event-type-3")) //private lesson
					{
						child.style.borderColor = "#".concat(items.lessonBorderColor);
						child.style.backgroundColor = "#".concat(items.lessonInsideColor);
						child.firstChild.style.background = "#".concat(items.lessonBorderColor);
						
						if(items.excellenceTeam) 
						{
							var found = child.innerHTML.search("Team");
							if (found > 0)
							{
								child.style.borderColor = "#".concat("D68181");
								child.style.backgroundColor = "#".concat("FF9999");
								child.firstChild.style.background = "#".concat("D68181");
							}
						}
					}
					
					if (child.classList.contains("event-type-5")) //pct court time
					{
						child.style.borderColor = "#".concat(items.seasonBorderColor);
						child.style.backgroundColor = "#".concat(items.seasonInsideColor);
						child.firstChild.style.background = "#".concat(items.seasonBorderColor);
					}
				}
			}
			
			if(items.colorModVersionNo != currentVersionNo)
			{
				console.log("New Version Loaded!");
				chrome.storage.sync.remove(["reservedBorderColor","reservedInsideColor","lessonBorderColor","lessonInsideColor","seasonBorderColor","seasonInsideColor","excellenceTeam","groupClassType","programType"],function(){
					var error = chrome.runtime.lastError;
					if (error) {
						console.error(error);
					}
				})
				chrome.storage.sync.set({
				colorModVersionNo: currentVersionNo
				}, function() {
				});
			}
		})
	}

})