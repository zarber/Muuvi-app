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

  const emojiMapping = {
    'fa-face-laugh-beam': '5',
    'fa-face-smile-beam': '4',
    'fa-face-grimace': '3',
    'fa-face-frown-open': '2',
    'fa-face-frown': '1',
  };
  // MUISTA TEHDÄ SAMA ACTIVITES_AND_DIARY.JS

  const emojiClass = activeEmoji
    ? Object.keys(emojiMapping).find((emojiKey) => activeEmoji.classList.contains(emojiKey))
    : '';

  const emojiValue = emojiClass ? emojiMapping[emojiClass] : '';

  if (!date || content.length < 1 || !emojiValue) {
    event.preventDefault();
    alert('Valitse fiilis-hymiö ja/tai kirjoita vähintään 1 merkki ennen tallentamista');
    return;
  }

  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ diary_date: date, body: content, emojiClass: emojiValue }),
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
});
