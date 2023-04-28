const diaryForm = document.querySelector('form');

const emojis = document.querySelectorAll('.emoji');
emojis.forEach((emoji) => {
  emoji.addEventListener('click', () => {
    const activeEmoji = document.querySelector('.emoji-active');
    if (activeEmoji) {
      activeEmoji.classList.remove('emoji-active');
    }
    emoji.classList.add('emoji-active');
  });
});

diaryForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const activeEmoji = document.querySelector('.emoji-active');
  const date = new Date(document.querySelector('#diary_date').value);
  const content = document.querySelector('textarea').value;

  const emojiClass = activeEmoji ? activeEmoji.className : '';

  if (!date || content.length < 1 || !emojiClass) {
    event.preventDefault();
    alert('Valitse fiilis-hymiö ja/tai kirjoita vähintään 1 merkki ennen tallentamista');
    return;
  }

  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ diary_date: date, body: content, emojiClass: emojiClass }),
  };

  try {
    const response = await fetch('/diaryEntries', requestOptions);
    const { diaryEntry: newDiaryEntry } = await response.json();

    if (response.ok) {
      showSavedMessage();

      document.querySelector('#diary_date').value = '';
      document.querySelector('textarea').value = '';
    } else {
      throw new Error('Virhe tallentaessa päiväkirjaa');
    }
  } catch (error) {
    console.error('Error:', error);
  }
  function showSavedMessage() {
    const message = document.createElement('div');
    message.classList.add('saved-message');
    message.textContent = 'Päiväkirja tallennettu';
    message.style.backgroundColor = 'green';
    message.style.color = 'white';
    message.style.padding = '12px';
    message.style.borderRadius = '15px';
    message.style.marginTop = '12px';
    message.style.width = 'fit-content';
  
    const container = document.querySelector('.right');
    container.appendChild(message);
  
    const activeEmoji = document.querySelector('.emoji-active');
    if (activeEmoji) {
      activeEmoji.classList.remove('emoji-active');
    }

    setTimeout(() => {
      message.remove();
    }, 5000);
  }
});