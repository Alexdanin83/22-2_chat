{
  const loginForm = document.querySelector(`#welcome-form`);
  const messagesSection = document.querySelector(`#messages-section`);
  const messagesList = document.querySelector(`#messages-list`);
  const addMessageForm = document.querySelector(`#add-messages-form`);
  const userNameInput = document.getElementById('username');
  const addMessageInput = document.getElementById('message-content');
  const messageContentInput = addMessageForm.querySelector(`#message-content`);

  let userName='';
  const socket = io();
  //przyjęcie
  //socket.on('message', (event) => addMessage(event.author, event.content))
  socket.on('message', ({ author, content }) => addMessage(author, content));
  socket.on('join', ({ user, content }) => addMessage(user, content));
  socket.on('removeUser', ({ user, content }) => addMessage(user, content));
  //wysłanie
  //socket.emit('message', { author: 'John Doe', content: 'Lorem Ipsum' });

  const loginFormSubmit = (event) =>{
    event.preventDefault();
    if (userNameInput.value !='')
    { userName=userNameInput.value;
      //console.log('nie puste',userName);
       socket.emit('join', { id: socket.id, user: userName,})
      loginForm.classList.remove('show');
      messagesSection.classList.add('show');
  }
    else
    {  alert('pole jest puste, podaj użytkownika');
  }
}
loginForm.addEventListener('submit', loginFormSubmit);

const sendMessage = (event) =>{
  event.preventDefault();
  let messageContent = addMessageInput.value;

  if(messageContent!= '')
  { addMessage(userName, messageContent);
     socket.emit('message', { author: userName, content: messageContent })
    messageContent ='';
    //console.log('nie puste',userName);

}
  else
  {  alert('pole jest puste, wpowadź text');
}
}
addMessageForm.addEventListener('submit', sendMessage);

function addMessage(author, content) {
  const message = document.createElement('li');
  message.classList.add('message');
  message.classList.add('message--received');
  if(author === userName) message.classList.add('message--self');
  message.innerHTML = `
    <h3 class="message__author">${userName === author ? 'You' : author }</h3>
    <div class="message__content">
      ${content}
    </div>
  `;
  messagesList.appendChild(message);
}


}
