// diaryForm.addEventListener('submit', async (event) => {
//     event.preventDefault();
  
//     const date = new Date(document.querySelector('#diary_date').value);
//     const content = document.querySelector('textarea').value;
//     const activeEmoji = document.querySelector('.emoji-active');
//     const emojiClass = activeEmoji ? activeEmoji.className : '';
  
//     if (!date || content.length < 1 || !emojiClass) {
//       event.preventDefault();
//       alert('Valitse fiilis-hymiö ja/tai kirjoita vähintään 1 merkki ennen tallentamista');
//       return;
//     }
  
//     // Create FormData from the form
//     const formData = new FormData(diaryForm);
  
//     // Send a POST request with the form data
//     try {
//       const response = await fetch('/diaryEntries', {
//         method: 'POST',
//         body: formData,
//       });
  
//       const { diaryEntry: newDiaryEntry } = await response.json();
  
//       if (response.ok) {
//         showSavedMessage();
  
//         document.querySelector('#diary_date').value = '';
//         document.querySelector('textarea').value = '';
//       } else {
//         throw new Error('Virhe tallentaessa päiväkirjaa');
//       }
//     } catch (error) {
//       console.error('Error:', error);
//     }
//   });

diaryForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const date = new Date(document.querySelector('#diary_date').value);
  const content = document.querySelector('textarea').value;
  const activeEmoji = document.querySelector('.emoji-active');
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
}).then(response => {
  if (response.status === 201) {
    return response.json();
  } else {
    throw new Error('An error occurred');
  }
}).then(data => {
  console.log('Diary entry saved:', data);
}).catch(error => {
  console.error('Error:', error);
});
