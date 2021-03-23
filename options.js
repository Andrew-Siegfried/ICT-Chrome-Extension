/*
	Works with options.html to render the options page
*/

// Saves options to chrome.storage
function save_options() 
{
	var rborderColor = document.getElementById('reservedBorderColor').value;
	var rInsideColor = document.getElementById('reservedInsideColor').value;

	var lborderColor = document.getElementById('lessonBorderColor').value;
	var lInsideColor = document.getElementById('lessonInsideColor').value;

	var sborderColor = document.getElementById('seasonBorderColor').value;
	var sInsideColor = document.getElementById('seasonInsideColor').value;
	
	var teamCheck = document.getElementById('excellenceCheck').checked;
	
	var groupClassArray = [];
	var programArray = [];
	
	var groupTable = document.getElementById('groupClassTable');
	var groupSpans = groupTable.getElementsByTagName('span');
	
	var programTable = document.getElementById('programTable');
	var programSpans = programTable.getElementsByTagName('span');
	
	var count = 0;
	var build = [];
	var name = "";
	var border = "";
	var inside = "";
	var texta = "";
	for (let group of groupSpans) 
	{
		if (count%4 === 0)
		{
			if (count > 0)
			{
				build = [name,texta,border,inside];
				groupClassArray.push(build);
				build = [];
				name = "";
				border = "";
				inside = "";
				texta = "";
			}
		}
		
		switch(group.id) 
		{
			case "name-span":
				name = group.firstChild.data;
				break;
			case "border-span":
				border = group.firstChild.value;
				break;
			case "inside-span":
				inside = group.firstChild.value;
				break;
			case "text-span":
				texta = group.firstChild.value;
				break;
			default:
		}
		
		count++;
	}
	build = [name,texta,border,inside];
	groupClassArray.push(build);
	build = [];
	name = "";
	border = "";
	inside = "";
	texta = "";
	count = 0;
	
	for (let program of programSpans) 
	{
		if (count%4 === 0)
		{
			if (count > 0)
			{
				build = [name,texta,border,inside];
				programArray.push(build);
				build = [];
			}
		}
		
		switch(program.id) 
		{
			case "name-span":
				name = program.firstChild.data;
				break;
			case "border-span":
				border = program.firstChild.value;
				break;
			case "inside-span":
				inside = program.firstChild.value;
				break;
			case "text-span":
				texta = program.firstChild.value;
				break;
			default:
		}
		
		count++;
	}
	build = [name,texta,border,inside];
	programArray.push(build);
	build = [];
	name = "";
	border = "";
	inside = "";
	texta = "";
  
	groupClassArray.reverse();
	programArray.reverse();
  
	chrome.storage.sync.set({

		reservedBorderColor: rborderColor,
		reservedInsideColor: rInsideColor,

		lessonBorderColor: lborderColor,
		lessonInsideColor: lInsideColor,

		seasonBorderColor: sborderColor,
		seasonInsideColor: sInsideColor,
		
		excellenceTeam: teamCheck,

		groupClassType: groupClassArray,
		programType: programArray

	}, function() {
	// Update status to let user know options were saved.
	var status = document.getElementById('status');
	status.textContent = 'Options saved.';
	setTimeout(function() {
	  status.textContent = '';
	}, 750);
	display_Tables();
	});
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() 
{
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
    document.getElementById('reservedBorderColor').value = items.reservedBorderColor;
	document.getElementById('reservedBorderColor').jscolor.valueElement.style.backgroundColor = HEX_rgb(items.reservedBorderColor);
    document.getElementById('reservedInsideColor').value = items.reservedInsideColor;
	document.getElementById('reservedInsideColor').jscolor.valueElement.style.backgroundColor = HEX_rgb(items.reservedInsideColor);
	
	document.getElementById('lessonBorderColor').value = items.lessonBorderColor;
	document.getElementById('lessonBorderColor').jscolor.valueElement.style.backgroundColor = HEX_rgb(items.lessonBorderColor);
    document.getElementById('lessonInsideColor').value = items.lessonInsideColor;
	document.getElementById('lessonInsideColor').jscolor.valueElement.style.backgroundColor = HEX_rgb(items.lessonInsideColor);
	
	document.getElementById('seasonBorderColor').value = items.seasonBorderColor;
	document.getElementById('seasonBorderColor').jscolor.valueElement.style.backgroundColor = HEX_rgb(items.seasonBorderColor);
    document.getElementById('seasonInsideColor').value = items.seasonInsideColor;
	document.getElementById('seasonInsideColor').jscolor.valueElement.style.backgroundColor = HEX_rgb(items.seasonInsideColor);
	
	document.getElementById('excellenceCheck').checked = items.excellenceTeam;

	display_Tables();
  });
}

//get that new group into the group class saved information
function addNew_Group() 
{
	chrome.storage.sync.get({
	groupClassType: []
	
	}, function(items) {
		var tempinputName = document.getElementById('inputName').value;
		var tempinputFlags = document.getElementById('inputFlags').value;

		var tempinputBorder = document.getElementById('inputBorder').value;
		var tempinputInside = document.getElementById('inputInside').value;
		
		var tempArr = [tempinputName,tempinputFlags,tempinputBorder,tempinputInside];
		
		var tempGroupClassType = items.groupClassType;
		
		tempGroupClassType.push(tempArr);
		
		chrome.storage.sync.set({
			groupClassType: tempGroupClassType
		}, function() {
			display_Tables();
			setTimeout(function() {
				document.getElementById('inputName').value = '';
				document.getElementById('inputFlags').value = '';
				document.getElementById('inputBorder').value = 'FFFFFF';
				document.getElementById('inputInside').value = 'FFFFFF';
			}, 500);
		});
  });
} 

//get that new program into the program saved information
function addNew_Program() 
{
	chrome.storage.sync.get({
	programType: []
	
	}, function(items) {
		var tempinputName = document.getElementById('inputNameProgram').value;
		var tempinputFlags = document.getElementById('inputFlagsProgram').value;

		var tempinputBorder = document.getElementById('inputBorderProgram').value;
		var tempinputInside = document.getElementById('inputInsideProgram').value;
		
		var tempArr = [tempinputName,tempinputFlags,tempinputBorder,tempinputInside];
		
		var tempProgramType = items.programType;
		
		tempProgramType.push(tempArr);
		chrome.storage.sync.set({
			programType: tempProgramType
		}, function() {
			display_Tables();
			setTimeout(function() {
				document.getElementById('inputNameProgram').value = '';
				document.getElementById('inputFlagsProgram').value = '';
				document.getElementById('inputBorderProgram').value = 'FFFFFF';
				document.getElementById('inputInsideProgram').value = 'FFFFFF';
			}, 500);
		});
  });
} 

//display everything saved... with defaults if needed!
function display_Tables() 
{
	chrome.storage.sync.get({
	groupClassType: [["Adult Drills","90 Min,60 Min,Dbls Drill,Drill &amp; Play,Invitational,Jellison,Foster,Buchmeier Drill,Jones Drill","1E7CD9","99CCFF"],["50+ Drills","50\\+ Drill","82D9AE","99FFCC"],["Senior PCT","Seniors,SPCT","A9D4A9","CCFFCC"],["Leagues","Mixed,Men Eve,Women's Doubles, EBL,LG ","00B2DE","00CCFF"],["WDL","4.5 Buchmeier,3.0 Anderson,3.0 Buchmeier,4.0 Buchmeier,3.5 Buchmeier,3.5 Anderson,WDL","8383A3","CCCCFF"],["Outreach","SS -,Volunteer,Super Saturday","822BD9","9933FF"],["USTA","USTA","0057D9","0066FF"],["Events","Events","D68100","FF9900"],["School","School","E0E0B4","FFFFCC"],["XTeam","XTeam","D68181","FF9999"],["Scramble Event","Scramble","782e40","AA6677"]],
	programType: [["PCT Semi Annual","PCT - Semi Annual","D6AC81","FFCC99"],["Jr 10 and Under","Red Rockets,Orange Crushers","D68181","FF9999"],["Adv 10 and Under","Orange Advanced,Red Advanced","D47F55","FF9966"],["Jr 10 and Over","18U Fast Track,Green Machines","28A150","33CC66"],["Adv 10 and Over","Yellow Transition,Green Advanced","00D154","00FF66"],["Varsity","Yellow Acers","5AE087","66FF99"],["High Performance","High Performance","2BD6AB","33FFCC"],["Adult Lesson","Adult Lesson","2DC7B4","33E1CC"],["Outreach Programs","Volunteer Courts,Super Saturday","822BD9","9933FF"]]
	
	}, function(items) {
		var groupTable = document.getElementById('groupClassTable');
		var programTable = document.getElementById('programTable');
		groupTable.innerHTML = "";
		programTable.innerHTML = "";
		var count = 0;
		var countProgram = 0;
		items.groupClassType.forEach((entry) => {
				var row = groupTable.insertRow(0);
				row.outerHTML = '<td valign="top" style="padding:1px 9px;"><table align="left" width="100%" border="0" cellpadding="0" cellspacing="0" style="min-width:100%;border-collapse:collapse"><tbody><tr><td valign="top" style="padding-right:9px;padding-left:9px;padding-top:0;padding-bottom:0;text-align:center"><table align="center" style="width: 100%;"><tr><td style="color:#000000; font-family:tahoma,verdana,segoe,sans-serif;font-size:14px;text-align:left;"><b><span id="name-span">'+entry[0]+'</span>:<b></td></tr></table></td></tr> <tr><td valign="top" style="padding-right:9px;padding-left:9px;padding-top:0;padding-bottom:0;text-align:center"><table align="center" style="width: 100%;"><tr><td style="color:#000000; font-family:tahoma,verdana,segoe,sans-serif;font-size:14px;text-align:left;">Border:</td><td><span id="border-span"><input class="jscolor" id="idBorder'+count+'" value='+entry[2]+'></span></td><td style="color:#000000; font-family:tahoma,verdana,segoe,sans-serif;font-size:14px;text-align:right;">Inside:</td><td style="text-align:right;"><span id="inside-span"><input class="jscolor" id="idInside'+count+'" value='+entry[3]+'></span></td></tr></table></td></tr><tr><td valign="top" style="padding-right:9px;padding-left:9px;padding-top:0;padding-bottom:0;text-align:center;"><table align="center" style="width: 100%;"><tr><td style="text-align:left;padding-top:15px;padding-bottom:15px;"><span id="text-span"><textarea title="Comma Separated Values Only!!" rows="4" style="resize: none;width:99%;">'+entry[1]+'</textarea></span></td></tr></table></td></tr></tbody></table></td>';
				var tempBorder = document.getElementById(('idBorder'+count));
				var tempInside = document.getElementById(('idInside'+count));
				count = count + 1;
			});
			
		items.programType.forEach((entryProgram) => {
				var row = programTable.insertRow(0);
				row.outerHTML = '<td valign="top" style="padding:1px 9px;"><table align="left" width="100%" border="0" cellpadding="0" cellspacing="0" style="min-width:100%;border-collapse:collapse"><tbody><tr><td valign="top" style="padding-right:9px;padding-left:9px;padding-top:0;padding-bottom:0;text-align:center"><table align="center" style="width: 100%;"><tr><td style="color:#000000; font-family:tahoma,verdana,segoe,sans-serif;font-size:14px;text-align:left;"><b><span id="name-span">'+entryProgram[0]+'</span>:<b></td></tr></table></td></tr> <tr><td valign="top" style="padding-right:9px;padding-left:9px;padding-top:0;padding-bottom:0;text-align:center"><table align="center" style="width: 100%;"><tr><td style="color:#000000; font-family:tahoma,verdana,segoe,sans-serif;font-size:14px;text-align:left;">Border:</td><td><span id="border-span"><input class="jscolor" id="idBorderProgram'+count+'" value='+entryProgram[2]+'></span></td><td style="color:#000000; font-family:tahoma,verdana,segoe,sans-serif;font-size:14px;text-align:right;">Inside:</td><td style="text-align:right;"><span id="inside-span"><input class="jscolor" id="idInsideProgram'+count+'" value='+entryProgram[3]+'></span></td></tr></table></td></tr><tr><td valign="top" style="padding-right:9px;padding-left:9px;padding-top:0;padding-bottom:0;text-align:center;"><table align="center" style="width: 100%;"><tr><td style="text-align:left;padding-top:15px;padding-bottom:15px;"><span id="text-span"><textarea title="Comma Separated Values Only!!" rows="4" style="resize: none;width:99%;">'+entryProgram[1]+'</textarea></span></td></tr></table></td></tr></tbody></table></td>';
				var tempBorder = document.getElementById(('idBorderProgram'+countProgram));
				var tempInside = document.getElementById(('idInsideProgram'+countProgram));
				countProgram = countProgram + 1;
			});
			jscolor.installByClassName("jscolor");
  });

}

//clear with warning! 
function clear_GroupOptions() 
{
	if (confirm('Are you sure you want to clear your group class data? This cannot be undone!')) {
			chrome.storage.sync.set({
			groupClassType: []
		}, function() {
			display_Tables();
		});
		} else {
		}
}

function clear_ProgramOptions() 
{
	if (confirm('Are you sure you want to clear your program data? This cannot be undone!')) {
			chrome.storage.sync.set({
			programType: []
		}, function() {
			display_Tables();
		});
		} else {
		}
}

//import the array into saved data
function import_GroupOptions() 
{
	if (confirm('Do you want to import group classes? This will override all previous group class data! This cannot be undone!')) {
			var tempData = document.getElementById('optionsGroupClass').value;
			if (tempData.length > 0) {
				var tempObj = JSON.parse(tempData);
				chrome.storage.sync.set({
				groupClassType: tempObj
				}, function() {
					display_Tables();
				});
			} else {
				 alert("Cannot import nothing!");
			}
		} else {
		}
}

function import_ProgramOptions() 
{
	if (confirm('Do you want to import programs? This will override all previous program data! This cannot be undone!')) {
			var tempData = document.getElementById('optionsProgram').value;
			if (tempData.length > 0) {
				var tempObj = JSON.parse(tempData);
				chrome.storage.sync.set({
				programType: tempObj
				}, function() {
					display_Tables();
				});
			} else {
				 alert("Cannot import nothing!");
			}
		} else {
		}
}

//export both.. stringify
function export_GroupOptions() 
{
	if (confirm('Do you want to export group classes?')) {
			chrome.storage.sync.get({
			groupClassType: []
			}, function(items) {
				 document.getElementById('optionsGroupClass').value = JSON.stringify(items.groupClassType);
		  });
		} else {
		}
}

function export_ProgramOptions() 
{
	if (confirm('Do you want to export programs?')) {
			chrome.storage.sync.get({
			programType: []
			}, function(items) {
				 document.getElementById('optionsProgram').value = JSON.stringify(items.programType);
		  });
		} else {
		}
}

function HEX_rgb (hex)
{
    var a = 'rgb(' + parseInt(hex.substring(0,2), 16) + ", " + parseInt(hex.substring(2,4), 16) + ", " + parseInt(hex.substring(4,6), 16) + ')';
    return a;
}
//handle ALL buttons
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
document.getElementById('addNewGroup').addEventListener('click', addNew_Group);
document.getElementById('addNewProgram').addEventListener('click', addNew_Program);
document.getElementById('clearGroup').addEventListener('click', clear_GroupOptions);
document.getElementById('clearProgram').addEventListener('click', clear_ProgramOptions);
document.getElementById('importGroup').addEventListener('click', import_GroupOptions);
document.getElementById('importProgram').addEventListener('click', import_ProgramOptions);
document.getElementById('exportGroup').addEventListener('click', export_GroupOptions);
document.getElementById('exportProgram').addEventListener('click', export_ProgramOptions);

	