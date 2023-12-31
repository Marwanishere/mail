document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  document.querySelector('#compose-form').addEventListener("submit", function(occurance){occurance.preventDefault(); send_email();});
  // the above line adds an event listener to the submit button so that when it gets clicked, the default response is 
  // overwritten and instead the function send_email is imposed. made with the help of cs50.ai

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  inbox(mailbox);

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
  .then (() => load_mailbox('sent'))
  .catch(er => console.log('error with regards to sending the email', er));
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
  mail.innerHTML = `<h6>From: ${email.sender}<br>To:${email.recipients}</h6> <br>Subject: ${email.subject}<br>${email.body}`;
  mail.addEventListener('click',()=>{ view_email(email.id);});
  // above two lines made using cs50 chatbot assistance
  document.querySelector('#emails-view').append(mail);
  console.log("this message means the inbox function is being called.")
  })
  })
  .catch(er => console.log('error with regards to getting mail in the mailbox', er))
}

function view_email(email_id) {
  // syntax for this function corrected by cs50.ai chatbot
  fetch(`/emails/${email_id}`, {method : "GET"})
  .then(c2json)
  .then(email => {
    document.querySelector('#emails-view').innerHTML = '';
    const mail = document.createElement('div');
    mail.className = 'mail';
    mail.innerHTML = `<h6>From: ${email.sender} To: ${email.recipients}</h6><br><h3>Subject: ${email.subject}</h3><br>${email.body}<br>`;
    document.querySelector('#emails-view').appendChild(mail);
    console.log("message opened");
    const archiveClick = document.createElement('button');
    archiveClick.textContent = 'archive';
    //above method for relabelling button acquired through cs50 chatbot
    archiveClick.addEventListener('click',() => archive(email_id));
    // above method ()=> ammended using cs50 chatbot advise.
    mail.appendChild(archiveClick)
    //above method for appending button acquired through cs50 chatbot
    const replyClick = document.createElement('button');
    replyClick.textContent = "reply";
    replyClick.addEventListener('click', () => reply(email_id));
    mail.appendChild(replyClick)
  })
  .then(() => {
    fetch(`/emails/${email_id}`, {method : "PUT", body : JSON.stringify({opened: true})});
  });
}

function archive(email_id) {
  fetch(`/emails/${email_id}`, {method : "GET"})
  .then(c2json)
  .then(email => {
    fetch(`/emails/${email_id}`,{method :"PUT", body: JSON.stringify({
      archived: !email.archived
    })})
    .then(emails => {document.querySelector('#emails-view').innerHTML = '';
    load_mailbox('inbox');})
    .catch(er => console.log('error with regards to archiving an email', er))
  })
}

function reply (email_id) {
  fetch(`/emails/${email_id}`, {method: "GET"})
  .then(c2json)
  //the above line handles the respnonse and converts it to js object notation
  .then(email => {
  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  //fill out composition fields
  document.querySelector('#compose-recipients').value = email.sender;
  document.querySelector('#compose-subject').value = `Re: ${email.subject}`;
  document.querySelector('#compose-body').value = `On ${email.timestamp}   ${email.sender} wrote:\n ${email.body}`;
  })
}
