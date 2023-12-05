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
  // overwritten and instead the function send_email is imposed.

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
      // document.querySelector('form').elements.recipient.value part of following lines
      // adopted from cs50 chatbot
      // recipients: document.querySelector('form').elements.recipient.value,
      // subject: document.querySelector('form').elements.subject.value,
      // body: document.querySelector('form').elements.body.value

      // The following lines are revisons of previous lines made with the assistance 
      // of cs50 ai chatbot to avoid the problem that can occur when elements do not have 
      // the exact names or there are multiple forms on the page
      recipients: document.getElementById('compose-recipients').value,
      subject: document.getElementById('compose-subject').value,
      body: document.getElementById('compose-body').value
    })
  })
  // res is short for response in js
  .then(res => res.json())
  .then(result => {if (result.status === "pass"){ console.log("passed in send_email");}})

  // err is short for error
  .catch(err => console.log('Error: Please try again', err));
}

