const inputFieldEl = document.getElementById('input-field');
const allBtnEL = document.querySelectorAll('.btn');
const ulEl = document.getElementById('ul-el')
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js'
import { getDatabase, ref, push, onValue, remove} from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js'

// Setting up firebase database for storage and snapshots 
const leadTrackerDatabaseUrl = {
    databaseURL: 'https://leadtracker-5c649-default-rtdb.firebaseio.com/'
}

const app = initializeApp(leadTrackerDatabaseUrl)
const database = (getDatabase(app))

const leadsInDB = ref(database, 'leads')

onValue(leadsInDB, function(snapshots) {
    if (snapshots.exists()) {
      let leadsInStorage = Object.entries(snapshots.val());
      ulEl.innerHTML = ''
      leadsInStorage.forEach(leads =>{
          let currentLeads = leads
          creatElement(currentLeads)
      });
  }else{
    ulEl.innerHTML = `<h1>No items here... yet</h1>`
  }
})

//for adding click event to the buttons .........................

allBtnEL.forEach(function(btn){
    btn.addEventListener('click', function(event){
        const btnClass = event.target.classList
//button for getting input value from inputfield .........................
       if (btnClass.contains('save-btn')) {
            if (inputFieldEl.value) {
                let inputValue = inputFieldEl.value 
                push(leadsInDB, inputValue)
                clearInputField()
            }
       }
//button for getting chrome tab url .........................

       if (btnClass.contains('tab-btn')) {
        const tabs = [{
            url:'www.scrimba.com'
        }]
        let lead = tabs[0].url
         push(leadsInDB, lead)
        // chrome.tabs.query({active: true, currentWindow: true}, (tabs) =>{
        // })
 }

//button for deleting all items ......................... 

       if (btnClass.contains('delete-btn')) {
        clearLeads()
       }
    })
})
// addeventlistner ends here *****************************************************

//for clearing of inputfield text .........................

function clearInputField() {
    inputFieldEl.value = ''
}

function clearLeads() {
    ulEl.innerHTML = ''
    let exactLocationOfItemInDb = ref(database, `leads`)
        remove(exactLocationOfItemInDb)
}


//for li and anchor tags creation .........................

function creatElement(item) {
        let itemId = item[0]
        let itemValue = item[1]
    // span tag section
    const newSpanEl = document.createElement('span')
    newSpanEl.textContent = 'X'
    newSpanEl.classList ='span'
    
    // anchor tag section
    const newAnchorTag = document.createElement('a')
    newAnchorTag.href = `https://${itemValue}`
    newAnchorTag.target = `_blank`
    newAnchorTag.innerHTML = `${itemValue}`;
    
    //li section 
    const newLiEl = document.createElement('li');
    newLiEl.appendChild(newAnchorTag);
    newLiEl.appendChild(newSpanEl)
    ulEl.appendChild(newLiEl);

    //Removing item from database
    newSpanEl.addEventListener('click', function(){
        let exactLocationOfItemInDb = ref(database, `leads/${itemId}`)
        remove(exactLocationOfItemInDb)
    })
}

