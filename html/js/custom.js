// Custom JS
var contactArray = [{"firstName":"Tim","lastName":"Berners-Lee","phoneNumber":"001-234-5678","emailAddress":"inventor@www.com","dateOfBirth":"1955-06-07T23:00:00.000Z","notes":"Inventor of the World Wide Web","addToFavourites":true},{"firstName":"Brendan","lastName":"Eich","phoneNumber":"001-234-5678","emailAddress":"creater@javascript.com","dateOfBirth":false,"notes":"Creator of the JavaScript programming language.","addToFavourites":true},{"firstName":"James","lastName":"Gosling","phoneNumber":"001-234-5678","emailAddress":"creator@java.com","dateOfBirth":"1955-05-19T23:00:00.000Z","notes":"Creator of the Java programming language","addToFavourites":true},{"firstName":"Gary","lastName":"Grossman","phoneNumber":"001-234-5678","emailAddress":"developer@actionscript.com","dateOfBirth":false,"notes":"Primary developer of the ActionScript programming language","addToFavourites":true},{"firstName":"Steve","lastName":"Jobs","phoneNumber":"001-234-5678","emailAddress":"co-founder@apple.com","dateOfBirth":"1955-02-24T00:00:00.000Z","notes":"Co-founder of Apple & CEO of Pixar","addToFavourites":true},{"firstName":"Larry","lastName":"Page","phoneNumber":"001-234-5678","emailAddress":"co-founder@google.com","dateOfBirth":"1973-03-25T23:00:00.000Z","notes":"Co-founder of Google","addToFavourites":true},{"firstName":"Laura","lastName":"Pigott","phoneNumber":"0863331636","emailAddress":"pigottlaura@gmail.com","dateOfBirth":"1987-09-24T23:00:00.000Z","notes":"Passionate about web development, programming and particularly JavaScript","addToFavourites":true},{"firstName":"John","lastName":"Resig","phoneNumber":"001-234-5678","emailAddress":"creator@jQuery.com","dateOfBirth":"1984-05-07T23:00:00.000Z","notes":"Creator of the jQuery JavaScript library","addToFavourites":true}];

var searchResults = [];
var searching = false;
var contactListSettings = {
	"currentContactIndex": -1,
	"editContact": false,
	"sortByFirstName": false,
}
getSavedContactListData();

// Month Array
var monthValues = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

window.onload = function () {
	// Click Event Listener
	document.body.addEventListener("click", pageClickHandler);
	
	// UPDATE PAGE INFORMATION BASED ON PRESCENE OF THE RELEVANT BODY TAG
	// Home Page
	if(document.getElementById("homePage") != null)
	{
		updateContactList();
		
		// Input Event Listener
		document.getElementById("searchBar").addEventListener("input", searchBarInputEventHandler);
		
		// Sort Contacts Select Option
		if(contactListSettings.sortByFirstName == true)
		{
			document.getElementById("alphaOrder").value = "by First Name";
		}
		else
		{
			document.getElementById("alphaOrder").value = "by Last Name";
		}
		
		// Add Title to Sort Contacts Button
		document.getElementById("sortContactsButton").setAttribute("title", "Currently Sorted by " + (contactListSettings.sortByFirstName ? "First Name" : "Last Name"));
	}
	
	// Contact Details Page
	if(document.getElementById("contactDetailsPage") != null)
	{
		updateContactDetailsSection();
	}
	
	// Add Edit Page
	if(document.getElementById("addEditPage") != null)
	{
		// Dynamically generate the dates for the Date of Birth Select Options
		generateDates();
		
		// If Editing Existing Contact or Adding New Contact
		if(contactListSettings.editContact)
		{
			editCurrentContact();
			
			// Show Delete Contact Button
			document.getElementById("removeContactButton").style.display = "block";
		}
		else
		{
			clearInputFields();
			
			// Hide Delete Contact Button
			document.getElementById("removeContactButton").style.display = "none";
		}
	}
}

// Click Event Handler
function pageClickHandler(nsEvent)
{
	var theEvent = nsEvent ? nsEvent: window.event;
	
	// CLICK TARGETS CATAGORISED BY PAGE
	// Home Page
	if(theEvent.target.id == "addNewContact")
	{
		window.location = "html/addEditContact.html";
	}
	if(theEvent.target.id == "sortContacts")
	{
		sortContactsBy();
		window.location = "index.html";
	}
	for(var i = 0; i< contactArray.length; i++)
	{	
		// Loop to check if the user clicked on one of the contacts in the list
		if(theEvent.target.id == "contactIdNum" + i)
		{
			contactListSettings.currentContactIndex = i;
			saveContactListData();
			window.location = "html/contactDetails.html";			
		}
	}
	if(theEvent.target.id == "removeAllContacts")
	{
		clearSavedContactList();
	}
	
	// Add Edit Contact Page
	if(theEvent.target.id == "cancelAddContact")
	{
		// If the user was editing an existing contact
		if(contactListSettings.editContact)
		{
			contactListSettings.editContact = false;
			saveContactListData();
			window.location = "contactDetails.html";
		}
		else
		{
			window.location = "../index.html";
		}
	}
	if(theEvent.target.id == "addContact")
	{
		createContact();
	}
	if(theEvent.target.id == "dobValue")
	{
		showDateOfBirthValue();
	}
	if(theEvent.target.id == "deleteBirthday")
	{
		clearDateInputFields();
	}
	if(theEvent.target.id == "saveNote")
	{
		showContactNote();
	}
	if(theEvent.target.id == "removeContactButton")
	{
		// Adding the contacts first name into the header of the modal confirmation box that pops up
		document.getElementById("currentFirstName").innerHTML = contactArray[contactListSettings.currentContactIndex].firstName;
	}
	if(theEvent.target.id == "removeContact")
	{
		removeCurrentContact();
		saveContactListData();
		window.location = "../index.html";
	}
	
	// Contact Details Page
	if(theEvent.target.id == "viewAllContacts")
	{
		window.location = "../index.html";
	}
	if(theEvent.target.id == "editContact")
	{
		contactListSettings.editContact = true;
		saveContactListData();
		window.location = "addEditContact.html";
	}
}

// Input Event Handler - Used for the search bar
function searchBarInputEventHandler()
{
	var	searchBarId = document.getElementById("searchBar");
	searchResults = [];
	var searchFor = searchBarId.value.toLowerCase();
	
	// If there is actually something typed in the searchbar
	if(searchFor.length > 0)
	{
		searching = true;
		
		contactObjectLoop: for(contactObject in contactArray)
		{
			// If First and Last Name Both Match
			if((contactArray[contactObject].firstName.toLowerCase() + " " + contactArray[contactObject].lastName.toLowerCase()).search(searchFor) > -1)
			{
				searchResults.push(contactArray[contactObject]);
			}
			else
			{
				// If Only One Property Matches
				contactPropertyLoop: for(contactProperty in contactArray[contactObject])
				{
					if(typeof contactArray[contactObject][contactProperty] === "string")
					{
						if(contactArray[contactObject][contactProperty].toLowerCase().search(searchFor) > -1 && contactProperty != "notes")
						{
							// Add the contact that contained the property to the searchResults Array
							// as long as that property is of type string, and is not the "notes" property
							searchResults.push(contactArray[contactObject]);
							break contactPropertyLoop;
						}
					}
				}
			}
		}
	}
	else
	{
		searching = false;
	}
	updateContactList();
}

// Create Contact
function createContact()
{
	// Contact will only be created if the user has entered some form of a name (first, last or both)
	if((document.getElementById("fName").value != "") || (document.getElementById("lName").value != ""))
	{
		// If Contact Already Exists the Remove from Contact Array
		if(contactListSettings.editContact == true)
		{
			removeCurrentContact();
		}
		
		// Create New Contact Object
		var contactObject = new Object;
		contactObject.firstName = document.getElementById("fName").value;
		contactObject.lastName = document.getElementById("lName").value;
		contactObject.phoneNumber = document.getElementById("phoneNum").value;
		contactObject.emailAddress = document.getElementById("email").value;
		contactObject.dateOfBirth = getDateObject();
		contactObject.notes = document.getElementById("contactNote").value;

		// Favourite Contact
		if(document.getElementById("favContact").checked)
		{
			contactObject.addToFavourites = true;
		}
		else
		{
			contactObject.addToFavourites = false;
		}
		
		// Add To Contact Array
		contactArray.push(contactObject);	
		
		// Sort Contact Array
		if(contactListSettings.sortByFirstName == true)
		{
			sortContactsByFirstName();
		}
		else
		{
			sortContactsByLastName();
		}
		
		// Save Contact List Data
		contactListSettings.currentContactIndex = contactArray.indexOf(contactObject);
		saveContactListData();
		
		// Return to Contact Details Page
		window.location = "contactDetails.html";
	}
	else
	{
		alert("You need to give your contact a name");
	}
}

// Remove Current Contact
function removeCurrentContact()
{	
	contactListSettings.editContact = false;
	contactArray.splice(contactListSettings.currentContactIndex, 1);
}

// Update Contact List
function updateContactList()
{
	// Clearing the Current Contact List
	var contactListId = document.getElementById("contactList");
	contactListId.innerHTML = "";
		
	// Searching or Viewing all Contacts
	var theArray = [];
	if(searching == true)
	{
		theArray = searchResults;
	}
	else
	{
		theArray = contactArray;
	}
	
	// Creating a Button for Each Contact
	if(theArray.length > 0)
	{
		for(var i = 0; i< theArray.length; i++)
		{
			var contactName = document.createElement("button");
			contactName.innerHTML = theArray[i].firstName + " " + theArray[i].lastName;
			contactName.setAttribute("id", "contactIdNum" + i);
			contactName.setAttribute("type", "button"); 
			contactListId.appendChild(contactName);	
			
			if(theArray[i].addToFavourites == true)
			{
				contactName.setAttribute("class", "favouriteContact btn btn-default");
			}
			else
			{
				contactName.setAttribute("class", "btn btn-default");
			}
		}
	}
	else
	{
		// If the Array is Empty
		if(searching)
		{
			contactListId.innerHTML = "There are no contacts that match your search";
		}
		else
		{
			contactListId.innerHTML = "You Have No Contacts";
		}
	}
}

// Update Contact Details Section
function updateContactDetailsSection()
{	
	// Contact Name
	document.getElementById("contactFullName").innerHTML = contactArray[contactListSettings.currentContactIndex].firstName + " " + contactArray[contactListSettings.currentContactIndex].lastName;
	
	// If the Contact is a Favourite
	if(contactArray[contactListSettings.currentContactIndex].addToFavourites == true)
	{
		document.getElementById("favContactStar").style.display = "inline";
	}
	else
	{
		document.getElementById("favContactStar").style.display = "none";
	}
	
	// If Contact Has a Note
	if(contactArray[contactListSettings.currentContactIndex].notes.length > 0 && typeof contactArray[contactListSettings.currentContactIndex].notes !== "undefined")
	{
		document.getElementById("contactNotes").innerHTML = contactArray[contactListSettings.currentContactIndex].notes;
	}
	else
	{
		document.getElementById("contactNotes").parentNode.parentNode.style.display = "none";
	}
	
	// If Contact Has a Date of Birth
	if(contactArray[contactListSettings.currentContactIndex].dateOfBirth != false)
	{
		// Pass the date values into the returnReadableDateString to get back a string in the format of dd monthName yyyy
		document.getElementById("contactDateOfBirth").innerHTML = returnReadableDateString(contactArray[contactListSettings.currentContactIndex].dateOfBirth.getDate(), contactArray[contactListSettings.currentContactIndex].dateOfBirth.getMonth(), contactArray[contactListSettings.currentContactIndex].dateOfBirth.getFullYear());
	}
	else
	{
		// Hide Row
		document.getElementById("contactDateOfBirth").parentNode.parentNode.style.display = "none";
	}
	
	// If the Contact Has a Phone Number
	if(contactArray[contactListSettings.currentContactIndex].phoneNumber != "")
	{
		// Add Info to the Page
		document.getElementById("contactPhoneNumber").innerHTML = contactArray[contactListSettings.currentContactIndex].phoneNumber;
		
		// Create Links
		document.getElementById("sendTextIcon").setAttribute("href", "sms:" + (contactArray[contactListSettings.currentContactIndex].phoneNumber).toString());
		document.getElementById("callPhoneNum").setAttribute("href", "tel:" + (contactArray[contactListSettings.currentContactIndex].phoneNumber).toString());
		document.getElementById("callPhoneIcon").setAttribute("href", "tel:" + (contactArray[contactListSettings.currentContactIndex].phoneNumber).toString());
	}
	else
	{
		// Hide Row
		document.getElementById("callPhoneIcon").parentNode.parentNode.style.display = "none";
	}
	
	// If the Contact Has An Email Address
	if(contactArray[contactListSettings.currentContactIndex].emailAddress != "")
	{
		// Add Information to the Page
		document.getElementById("sendEmail").innerHTML = contactArray[contactListSettings.currentContactIndex].emailAddress;
		
		// Create Links
		document.getElementById("sendEmail").setAttribute("href", "mailto:" + (contactArray[contactListSettings.currentContactIndex].emailAddress).toString());
		document.getElementById("sendEmailIcon").setAttribute("href", "mailto:" + (contactArray[contactListSettings.currentContactIndex].emailAddress).toString());
	}
	else
	{
		// Hide Rows
		document.getElementById("sendEmail").parentNode.parentNode.style.display = "none";
	}
	
}

// Edit Current Contact
function editCurrentContact()
{
	// Input Field Data
	document.getElementById("fName").value = contactArray[contactListSettings.currentContactIndex].firstName;
	document.getElementById("lName").value = contactArray[contactListSettings.currentContactIndex].lastName;
	document.getElementById("phoneNum").value = contactArray[contactListSettings.currentContactIndex].phoneNumber;
	document.getElementById("email").value = contactArray[contactListSettings.currentContactIndex].emailAddress;
	document.getElementById("contactNote").value = contactArray[contactListSettings.currentContactIndex].notes;

	// Date of Birth
	if(contactArray[contactListSettings.currentContactIndex].dateOfBirth != false)
	{
		// Change addBirthday button to editBirthday
		swapBirthdayButton(true);
		
		// Set the values of the options in the Date of Birth select element to be equal to those of the current contact
		document.getElementById("dobDate").value = contactArray[contactListSettings.currentContactIndex].dateOfBirth.getDate();
		// Passing the index of the month into the monthValues array to get back the months name as a string
		document.getElementById("dobMonth").value = monthValues[contactArray[contactListSettings.currentContactIndex].dateOfBirth.getMonth()];
		document.getElementById("dobYear").value = contactArray[contactListSettings.currentContactIndex].dateOfBirth.getFullYear();
		
		// Displaying the Birthday date as a string on the page
		document.getElementById("dob").innerHTML = returnReadableDateString(contactArray[contactListSettings.currentContactIndex].dateOfBirth.getDate(), contactArray[contactListSettings.currentContactIndex].dateOfBirth.getMonth(), contactArray[contactListSettings.currentContactIndex].dateOfBirth.getFullYear());
	}
	else
	{
		// Change editBirthday button to addBirthday
		swapBirthdayButton(false);
		clearDateInputFields();

		// Show Hide Elements
		document.getElementById("dob").innerHTML = "";
		document.getElementById("dob").style.display = "none";
	}
	
	// If Contact is already a Favourite
	if(contactArray[contactListSettings.currentContactIndex].addToFavourites == true)
	{
		// Set the checkbox value to checked, so that the css will style the star
		document.getElementById("favContact").checked = true;
	}
}

// Generate Dates
function generateDates()
{
	// GENERATING DATES FOR THE DAY MONTH AND YEAR OPTIONS OF THE SELECT ELEMENT
	// Add Days
	for(var d = 1; d <= 31; d++)
	{
		var dayOptionElement = document.createElement("option");
		dayOptionElement.innerHTML = d;
		document.getElementById("dobDate").add(dayOptionElement, d);
	}
	
	// Add Months
	for(var m = 0; m < 12; m++)
	{
		var monthOptionElement = document.createElement("option");
		monthOptionElement.innerHTML = monthValues[m];
		document.getElementById("dobMonth").add(monthOptionElement, m + 1);
	}
	
	// Add Years
	var today = new Date();
	var numberOfYears = 115;
	for(var y = today.getFullYear(); y >= today.getFullYear() - numberOfYears; y--)
	{
		var yearOptionElement = document.createElement("option");
		yearOptionElement.innerHTML = y;
		document.getElementById("dobYear").add(yearOptionElement);
	}
}

// Get Date Object
function getDateObject()
{
	// Get Values from the relevant select elements
	var dobDateId = document.getElementById("dobDate").value;
	var dobMonthName = document.getElementById("dobMonth").value;
	var dobYearId = document.getElementById("dobYear").value;
	
	// Checking if the user has entered a full date
	if(dobDateId != "Day" && dobMonthName != "Month" && dobYearId != "Year")
	{
		// As the month value is being passed in as a string, I need to get the
		//index of that string in the monthValues array to get back the index position of that month
		var dobMonthId = monthValues.indexOf(dobMonthName);
		var birthdayDate = new Date(dobYearId, dobMonthId, dobDateId);
	}
	else
	{
		// This was the most efficent option for quick checking of whether a date property of an object exisits or not later on
		birthdayDate = false;
		clearDateInputFields();
	}
	return birthdayDate;
}

// Return Readable Date String
function returnReadableDateString(dayValue, monthValue, yearValue)
{
	// The relevant values are passed in from the date object, and simuarly to above,
	// I pass the month value into the monthValues array to get back the month
	// as a string
	return dayValue + " " + monthValues[monthValue] + " " + yearValue;
}

// Show Date of Birth Value
function showDateOfBirthValue()
{
	// Called when the user clicks save when adding a date of birth to a contact
	var showDateOfBirthValue_date = getDateObject();
	
	if(showDateOfBirthValue_date != false)
	{
		document.getElementById("dob").innerHTML = returnReadableDateString(showDateOfBirthValue_date.getDate(), showDateOfBirthValue_date.getMonth(), showDateOfBirthValue_date.getFullYear());
		
		// Change addBirthday button to editBirthday
		swapBirthdayButton(true);
	}
	else
	{
		// Change editBirthday button to addBirthday
		swapBirthdayButton(false);
	}
}

// Swap Birthday Button
function swapBirthdayButton(birthdayExists)
{
	var dobId = document.getElementById("dob");
	var dobLabelId = document.getElementById("dobLabel");
	var dateOfBirthButtonButtonId = document.getElementById("dateOfBirthButton");
	var birthdayButtonIconId = document.getElementById("birthdayButtonIcon");
	var dateOfBirthButtonSpanId = document.getElementById("dateOfBirthButtonSpan");
	
	// Switching Between editBirthday and addBirthday
	if(birthdayExists)
	{
		// If the Date is not equal to False
		dobId.style.display = "block";
		dobLabelId.style.display = "block";
		dateOfBirthButtonButtonId.setAttribute("class", "btn btn-success btn-lg");
		birthdayButtonIconId.setAttribute("class", "glyphicon glyphicon-pencil");
		dateOfBirthButtonSpanId.innerHTML = "Edit Birthday";
	}
	else
	{
		// If the Date is equal to False
		dobId.innerHTML = "";
		dobId.style.display = "none";
		dobLabelId.style.display = "none";
		dateOfBirthButtonButtonId.setAttribute("class", "btn btn-primary btn-lg");
		birthdayButtonIconId.setAttribute("class", "glyphicon glyphicon-plus");
		dateOfBirthButtonSpanId.innerHTML = "Add Birthday";
	}
}

// Show Contact Note
function showContactNote()
{
	// Display the contacts note in the specified div
	document.getElementById("contactNoteDisplay").innerHTML = document.getElementById("contactNote").value;
}

// Clear Empty Fields
function clearInputFields()
{
	// Clear Input Fields
	document.getElementById("fName").value = "";
	document.getElementById("lName").value = "";
	document.getElementById("phoneNum").value = "";
	document.getElementById("email").value = "";
	
	// Clear Data Input Fields
	clearDateInputFields();
}
function clearDateInputFields()
{
	// Reset Date Input Fields to their default values
	document.getElementById("dobDate").value = "Day";
	document.getElementById("dobMonth").value = "Month";
	document.getElementById("dobYear").value = "Year";
}

// Sort Contacts By
function sortContactsBy()
{
	// Select element where user says which property they would like to sort by
	var alphaOrderId = document.getElementById("alphaOrder");
	
	if(alphaOrderId.value == "by First Name")
	{
		contactListSettings.sortByFirstName = true;
		sortContactsByFirstName();
		saveContactListData();
		updateContactList();
	}
	else
	{
		contactListSettings.sortByFirstName = false;
		sortContactsByLastName();
		saveContactListData();
		updateContactList();
	}
}

// Sort Contacts By First Name
function sortContactsByFirstName()
{
	contactArray.sort(sortContactsFName);
	function sortContactsFName(a, b)
	{
		var contactFirstNameA = a.firstName.toLowerCase();
		var contactFirstNameB = b.firstName.toLowerCase();
		
		if(contactFirstNameA > contactFirstNameB)
		{
			return 1
		}
		else if(contactFirstNameA < contactFirstNameB)
		{
			return -1
		}
		else
		{
			return 0
		}
	}
}

// Sort Contacts By Last Name
function sortContactsByLastName()
{
	contactArray.sort(sortContactsLName);
	function sortContactsLName(a, b)
	{
		var contactLastNameA = a.lastName.toLowerCase();
		var contactLastNameB = b.lastName.toLowerCase();
		
		if(contactLastNameA > contactLastNameB)
		{
			return 1
		}
		else if(contactLastNameA < contactLastNameB)
		{
			return -1
		}
		else
		{
			return 0
		}
	}
}

// Save Contact List
function saveContactListData()
{
	if(typeof (window.localStorage) != "undefined")
	{
		// Save Contact List
		if(typeof(contactArray) != "undefined")
		{
			window.localStorage.setItem("savedContactList", JSON.stringify(contactArray));
		}
		
		// Save Contact List Settings
		if(typeof(contactListSettings) != "undefined")
		{
			window.localStorage.setItem("savedContactListSettings", JSON.stringify(contactListSettings));
		}
	}
	else
	{
		alert("There is no storage available to save your contact list");
	}
}

// Get Contact List
function getSavedContactListData()
{
	if(typeof (window.localStorage) != "undefined")
	{
		// Saved Contact List
		if(typeof(window.localStorage.savedContactList) != "undefined")
		{
			contactArray = JSON.parse(window.localStorage.savedContactList);
			
			// Date of Birth Loop
			for(var i = 0; i < contactArray.length; i++)
			{
				if(contactArray[i].dateOfBirth != false)
				{
					// Cast back to a date object
					contactArray[i].dateOfBirth = new Date(contactArray[i].dateOfBirth);
				}
				else
				{
					// set the dateOfBirth property to false
					contactArray[i].dateOfBirth = false;
				}
			}
		}
		
		// Saved Contact List Settings
		if(typeof(window.localStorage.savedContactListSettings) != "undefined")
		{
			contactListSettings = JSON.parse(window.localStorage.savedContactListSettings);
		}
	}
	else
	{
		alert("There is no storage available to save your contact list");
	}
}

// Clear Contact List
function clearSavedContactList()
{
	if(typeof(window.localStorage.savedContactList) != "undefined")
	{
		window.localStorage.clear();
	}
	contactArray = [];
	updateContactList();
}
