document.addEventListener('DOMContentLoaded', () => {
  const diaryForm = document.querySelector('form');
  const diaryEntries = document.querySelector('#diary_entries');

  function showSavedMessage() {
    const message = document.createElement('div');
    message.textContent = 'Päiväkirja tallennettu';
    message.style.backgroundColor = 'green';
    message.style.color = 'white';
    message.style.padding = '12px';
    message.style.borderRadius = '15px';
    message.style.marginTop = '12px';
    message.style.width = 'fit-content';

    const container = document.querySelector('.diary');
    container.appendChild(message);

    setTimeout(() => {
      container.removeChild(message);
    }, 5000);
  }

  diaryForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const date = document.querySelector('#diary_date').value;
    const content = document.querySelector('textarea').value;
    const activeEmoji = document.querySelector('.emoji-active');
    const emojiClass = activeEmoji ? activeEmoji.className : '';

    console.log('Emoji class:', emojiClass);

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ diary_date: date, body: content, emojiClass: emojiClass }),
    };

    try {
      const response = await fetch('/diaryEntries', requestOptions);

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
  });

  const activitiesButton = document.querySelector('#activities');
  const activitiesList = document.querySelector('.activities');

  activitiesButton.addEventListener('click', () => {
    activitiesList.toggleAttribute('hidden');
  });
});
