document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

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
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
}

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
  .then(response => response.json())
  // below line generated with assistance from cs50 chatbot
  .then(result => {let sendButton = document.querySelector('input[type="submit"]');
  sendButton.addEventListener('click', send_email); result = console.log("send_email function working hopefully")})
  .catch(error => console.log('Error, Please try again:', error));
}

