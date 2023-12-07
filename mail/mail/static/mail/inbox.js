document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email(mailbox) {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#compose-form').addEventListener("submit", function(occurance){occurance.preventDefault(); send_email();});
  // the above line adds an event listener to the submit button so that when it gets clicked, the default response is 
  // overwritten and instead the function send_email is imposed. made with the help of cs50.ai

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
  document.querySelector("#emails-view").innerHTML = "";
  inbox(mailbox);
  // above line taken from cs50 chatbot
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
}
const c2json = response => response.json();
// the above line tells the program : when the fetch is requested to take the respnse
// read the JSON content and then give me that JSON content. It is there to resolve 
// promises between programs.
function send_email() {
  console.log("if this message appears send_email is being called"),
  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
      recipients: document.getElementById('compose-recipients').value,
      subject: document.getElementById('compose-subject').value,
      body: document.getElementById('compose-body').value
    })
  })
  .then(c2json)
  // below line generated with assistance from cs50 chatbot
  .then(result => console.log("dont need to repeat querySelector its already being used to summon this thing"))
  .catch(error => console.log('Error, Please try again:', error));
}

function inbox(mailbox){
  fetch(`/emails/${mailbox}`,{method: 'GET'})
  // the above line uses ` to denote that a variable will be used inside of the string.
  .then(c2json)
  .then(emails => {document.querySelector('#emails-view').innerHTML = '';
  // the above line clears the email view.
  emails.forEach(email => {
  const mail = document.createElement('div');
  mail.className = 'mail';
  mail.innerHTML = email.body;
  // the above line sets the mail inner html to the body property of the Email model 
  // however I should use email as that is the object i am looping over in the forEach
  // function and .body will be known by the computer to be taken as the body feild from
  // the Email model defined in models.py
  document.querySelector('#emails-view').append(mail);
  })
  })
  .catch(er => console.log('error with regards to getting mail in the mailbox', er))
}

