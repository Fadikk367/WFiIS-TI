const modal = document.querySelector('#modal');
const modalCloseBtn = document.querySelector('#modal-close-btn');
const contactForm = document.querySelector('footer form');
const nameInput = document.querySelector('footer input');
const messageInput = document.querySelector('footer textarea');

const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
const emailApiURI = 'https://42zopbdrqe.execute-api.eu-central-1.amazonaws.com/default/sendEmail';


async function handleSendEmail(e) {
  e.preventDefault();

  const author = nameInput.value;
  const message = messageInput.value;


  if (!author || !message || !emailPattern.test(author))
    return;

  const messageData = new FormData();
  messageData.append('author', author);
  messageData.append('message', message);
  

  nameInput.value = '';
  messageInput.value = '';

  try {
    const response = await fetch(emailApiURI, {
      method: 'POST',
      body: JSON.stringify({
        author,
        message,
      })
    });

    const data = await response.json();
  } catch(err) {
    console.log(err);
  }
}


contactForm.addEventListener('submit', handleSendEmail);