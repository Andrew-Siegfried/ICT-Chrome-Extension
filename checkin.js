/*
	Used on a stand alone station to allow members to scan in their physical ID tag or phone to check them into the club.
	If they are here for an activity it will go through a created IFRAME and click to mark them attended so they are properly charged.
	Unfortunately the system does not have any API that will get me remotely close to solving this problem sooner.
*/


window.addEventListener('load', function () 
{
	var checkinCount = document.getElementById('checkin-count');
	var checkinField = document.getElementById('checkinmember');
	var checkinMdddle = document.getElementById('checkin-middle');
	var checkinLeft = document.getElementById('checkin-left');
	var checkinRight = document.getElementById('checkin-right');
	var checkinError = document.getElementById('checkin-error');
	var innerHTMLSave = checkinRight.innerHTML;
	var checkinName = "";
	var membersCheckedIn = checkinCount.innerHTML;
	
	var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
	var observerCount = new MutationObserver(updateCheckin);
	observerCount.observe(checkinCount, { childList: true, subtree: true });
	
	var MutationObserverPlayer = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
	var observerPlayer = new MutationObserverPlayer(markPlayer);
	observerPlayer.observe(checkinMdddle, { childList: true});
	
	checkinField.focus();
	checkinField.select();
	
	function sleep(ms) 
	{
		return new Promise(resolve => setTimeout(resolve, ms));
	}
	
	function getRandomInt(max) 
	{
		return Math.floor(Math.random() * Math.floor(max));
	}
	
	function getTimeDifference(date1, date2)
	{
		var difference =(date2.getTime() - date1.getTime());
		return Math.floor((difference/1000)/60);
	}
	
	async function markPlayer() //mark the player attended in their respective event.. handles programs, courts, privates and group class
	{
		var name = "";
		var id = -1;
		var test = document.getElementById("user-info");
		if (typeof(test) != 'undefined' && test != null)
		{
			var names = document.getElementsByClassName("name");
			if(names.length > 0)
			{
				name = names[0].innerText;
			}
			
			var inOutInfo = document.getElementById('in_out_info');
			var time = inOutInfo.childNodes.item(1).innerHTML.split(" ");
			time = time[1] + ":00 " + time[2];
			var difference = getTimeDifference((new Date ((new Date(Date.now()).toLocaleString().split(',')[0]) + " " + time)), (new Date(Date.now())));
			if (difference < 2)
			{
				var events = document.getElementById('user-events');
				
				var dob = document.getElementsByClassName("date-of-birth");
				if(dob.length > 0)
				{
					dob[0].style.display = "none"; //HIDE DOB - customers don't want this on screen
				}
				
				var age = document.getElementsByClassName("age");
				if(age.length > 0)
				{
					age[0].style.display = "none"; //HIDE AGE - customers don't want this on screen
				}
				
				var playerID = document.getElementById("user_id");
				playerID = playerID.value;
				
				var noInfo = events.innerHTML.indexOf("No events for today.");
				if(noInfo == -1)
				{
					var time = events.getElementsByClassName("time");
					var contentList = events.getElementsByClassName("content");
					var content = contentList[0];
					var numEvents = contentList.length;
					for (let item of contentList) 
					{
						item.style.fontSize = "x-large"
					}
					if (numEvents > 1)
					{
						for (var i = 0; i < numEvents; i++) 
						{
							var dayTime = time[i].innerText.slice(-2);
							var courtTime = time[i].innerText;
							courtTime = courtTime.replace("AM","").replace("PM","");
							courtTime = courtTime + ":00 " + dayTime;
							difference = getTimeDifference((new Date ((new Date(Date.now()).toLocaleString().split(',')[0]) + " " + courtTime)), (new Date(Date.now())));

							if (difference > 60) //The current checkin we are looking at is over an hour old..
							{
								if ((i+1) < numEvents)
								{
									content = contentList[(i+1)];
								}
							}
						}
					}
					
					var list = content.getElementsByClassName("attendance not-checked-in");
					if(list.length > 0)
					{
						list[0].click();
						checkinField.focus();
						checkinField.select();
					}
					else
					{
						var eventList = content.getElementsByClassName("event-title");
						var eventName = "";
						var courts = content.innerText.split(/\r?\n/)[1];
						var contentTime = content.parentElement.getElementsByClassName("time");
						contentTime = contentTime[0].innerText;
						courts = courts.slice(10);
						courts = courts.split(",");
						var court = courts[0];
						if(eventList.length > 0)
						{
							eventName = eventList[0].innerText.slice(7);
						}
						eventName = eventName.replace("&","&amp;");
						var caFrame = document.createElement("IFRAME");
						caFrame.setAttribute("src", "https://innercitytennis.clubautomation.com/tennis");
						var randomNum = getRandomInt(10000);
						var frameID = "ca-frame" + randomNum;
						caFrame.setAttribute('id', frameID);
						caFrame.setAttribute("width", 0); //change the height/width if you need to see what is happening with the iframe
						caFrame.setAttribute("height", 0);
						checkinLeft.appendChild(caFrame);
						var iframe = document.getElementById(frameID);
						var courtService = iframe.contentWindow.document.getElementById('court-service');
						var wrapList = [];
						while (typeof(courtService) == 'undefined' || courtService == null) //wait until the content is loaded from the server
						{
							await sleep(500);
							courtService = iframe.contentWindow.document.getElementById('court-service');
						}
						var iw = document.getElementById(frameID).contentWindow;
						while (wrapList.length == 0) 
						{
							await sleep(250);
							wrapList = iw.document.getElementsByClassName('wrapEvent');
						}
						
						var handle = false;
						var child = "";
						var group = false;
						var program = false;
						var courtAndTime = "";
						var dayTime = contentTime.slice(-2);
						var mTime = contentTime.slice(0, -2);
						var splitTime = mTime.split(":");
						var hour = parseInt(splitTime[0]);
						if (dayTime == "AM")
						{
							if (hour < 10)
							{
								hour = "0" + hour;
								mTime = hour + ":" + splitTime[1];
							}
						}
						if (dayTime == "PM")
						{
							if (parseInt(splitTime[0]) < 12)
							{
								hour = parseInt(splitTime[0]) + 12;
								mTime = hour + ":" + splitTime[1];
							}
						}
						
						var courtAndTime = "";
						switch(court) //get the labeled court and time title to find the element
						{
							case "Court 1":
								courtAndTime = "court_45_row_" + mTime;
								break;
							case "Court 2":
								courtAndTime = "court_46_row_" + mTime;
								break;
							case "Court 3":
								courtAndTime = "court_47_row_" + mTime;
								break;
							case "Court 4":
								courtAndTime = "court_48_row_" + mTime;
								break;
							case "Court 5":
								courtAndTime = "court_49_row_" + mTime;
								break;
							case "Court 6":
								courtAndTime = "court_50_row_" + mTime;
								break;
							case "Court 7":
								courtAndTime = "court_51_row_" + mTime;
								break;
							case "Court 8":
								courtAndTime = "court_162_row_" + mTime;
								break;
							case "Court 9":
								courtAndTime = "court_163_row_" + mTime;
								break;
							case "Court 10":
								courtAndTime = "court_164_row_" + mTime;
								break;
							case "Court 11":
								courtAndTime = "court_166_row_" + mTime;
								break;
							case "Mini Court":
								courtAndTime = "court_167_row_" + mTime;
								break;
							case "Fitness":
								courtAndTime = "court_175_row_" + mTime;
								break;
							case "Classroom":
								courtAndTime = "court_180_row_" + mTime;
								break;
							
							default:
								console.log("ERROR WITH PROGRAM TYPE");
								console.log(court);
								console.log(eventName);
								console.log(time);
						}
						var tableData = iw.document.getElementById(courtAndTime);
						child = tableData.firstChild.firstChild.firstChild;

						if (child.classList.contains("event-type-1")) //group class
						{
							var res = child.childNodes.item(1).innerHTML.split("<br>");
							for (var i = 0; i < res.length; ++i) 
							{
								if (res[i] == eventName || (res[i].localeCompare(eventName) == 0)) 
								{
									handle = true;
									group = true;
								}
							}
						}
						
						if (child.classList.contains("event-type-2")) //programs
						{
							if(child.parentElement.parentElement.parentElement.id == courtAndTime)
							{
								handle = false;
								program = true;
							}
						}

						if (group) //Group class - select name, select attended, mark attended
						{
							var cList = child.parentNode.firstChild.classList;
							var eventID = "";
							cList.forEach(name => {
								if(name.indexOf("event-") == 0)
								{
									var res = name.split("-");
									if(res.length < 3)
									{
										eventID = res[1];
									}
								}
							})
							var rosterTable = iw.document.getElementById('ca-roster-table');
							iw.location = '/attendance-roster/?id=' + eventID + ' &date=' + (new Date(Date.now()).toLocaleString().split(',')[0]);
							while (typeof(rosterTable) == 'undefined' || rosterTable == null) 
							{
								await sleep(600);
								iw = document.getElementById(frameID).contentWindow;
								rosterTable = iw.document.getElementById('ca-roster-table');
							}

							iw = document.getElementById(frameID).contentWindow;
							var rosterTable = iw.document.getElementById('ca-roster-table');
							var rosterRows = rosterTable.rows;
						
							var player_action = "roster-action-" + playerID;
							var actionButton = iw.document.getElementById(player_action);
							var items = actionButton.childNodes.item(1).getElementsByTagName("li");
							
							actionButton.childNodes.item(1).click();
							await sleep(500);
							for (var i = 0; i < items.length; ++i) 
							{
								if (items[i].getAttribute("data-value") == "attended") 
								{
									items[i].childNodes.item(0).click();
									await sleep(800);
									document.getElementById(frameID).remove();
								}
							}
					
						}
						else
						{
							if (program) //program - select date/row/player ID to find the cell. At least their table naming scheme makes sense
							{
								var courtEvent = iw.document.getElementById(courtAndTime);
								child = courtEvent.firstChild.firstChild.firstChild;
								var cList = child.parentNode.firstChild.classList;
								var eventID = "";
								var scheduleID = "";
								var cell = "";
								cList.forEach(name => {
									if(name.indexOf("event-") == 0)
									{
										var res = name.split("-");
										if(res.length < 3)
										{
											eventID = res[1];
										}
									}
									if(name.indexOf("schedule-") == 0)
									{
										var res = name.split("-");
										scheduleID = res[1];
									}
								})
								
								cell = "cell_"+eventID+"_"+scheduleID+"_"+playerID;
								
								var eventInfoProgram = iw.document.getElementById('eventInfo');
								iw.location = '/event/view-all?eventId=' + eventID + '&do_action=attendance';
								while (typeof(eventInfoProgram) == 'undefined' || eventInfoProgram == null) 
								{
									await sleep(600);
									iw = document.getElementById(frameID).contentWindow;
									eventInfoProgram = iw.document.getElementById('eventInfo');
								}

								iw = document.getElementById(frameID).contentWindow;
								eventInfoProgram = iw.document.getElementById('eventInfo');
								
								var attendanceRoster = iw.document.getElementsByClassName('attendance_container');
								attendanceRoster = attendanceRoster[0];
								var cell2Check = iw.document.getElementById(cell);
								
								cell2Check.firstChild.click();
								await sleep(500);
								var items = iw.document.getElementById("moveTo").getElementsByTagName("li");
								for (var i = 0; i < items.length; ++i) 
								{
									if (items[i].id == "is_present") 
									{
										items[i].click();
										await sleep(500);
										document.getElementById(frameID).remove();
									}
								}
							}
						}
					}
				}
				await sleep(20000);
				checkinField.focus();
				checkinField.select();
				checkinMdddle.innerHTML = "";
				checkinRight.innerHTML = innerHTMLSave;
				checkinError.innerHTML = "";
				checkinError.style = "";
			}
		}
	}
	
	async function updateCheckin() //reloads page if users are being checked out. Wait 10s first incase someone is checking in!
	{
		if(membersCheckedIn != checkinCount.innerHTML)
		{
			if(membersCheckedIn > checkinCount.innerHTML)
			{
				membersCheckedIn = checkinCount.innerHTML;
				await sleep(10000);
				location.reload();
			}
			else
			{
				membersCheckedIn = checkinCount.innerHTML;
			}
		}
	}

})