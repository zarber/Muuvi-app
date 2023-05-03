document.addEventListener('DOMContentLoaded', () => {
    const exerciseForm = document.querySelector('form');
    const exerciseEntries = document.querySelector('#exercise_entries');
  
    exerciseEntries.addEventListener('click', (event) => {
      const listItem = event.target.closest('li');
      if (listItem) {
        const exerciseEntryId = listItem.dataset.id;
        showExerciseEntry(exerciseEntryId);
      }
  
    });
    const SaveButton = document.querySelector('#exercise_save')
    const loadMoreButton = document.querySelector('#load-more');
  
    SaveButton.addEventListener('click', async () => {
    const skip = document.querySelectorAll('#exercise_entries li').length;
    await fetchExerciseEntries(skip);
  });
  loadMoreButton.addEventListener('click', async () => {
    const skip = document.querySelectorAll('#exercise_entries li').length;
    await fetchExerciseEntries(skip);
    
  });
    
const fetchPatientId = async () => {
    const urli = window.location.href;
    var idFromUrl = urli.substring(urli.lastIndexOf('/') + 1);
    return idFromUrl;
}


/* const fetchPatientId = async () => {
    const response = await fetch('/api/user/users');
    const users = await response.json();
    const currentUrl = window.location.href;
    const idFromUrl = currentUrl.substring(currentUrl.lastIndexOf('/') + 1);
    const patient = users.find(user => user._id === idFromUrl && user.role === 'patient');
    return patient._id;
  }

    const tulosta = fetchPatientId();
    console.log(tulosta); */
    fetchPatientId();

    fetchExerciseEntries();
    
    function addNewExerciseEntryToDOM(exerciseEntry) {
  
      console.log('Exercise Entry:', exerciseEntry);
  
      const listItem = document.createElement('li');
      listItem.dataset.id = exerciseEntry._id;
    
  
      listItem.textContent = `${exerciseEntry.exercise_duration_hour}h ${exerciseEntry.exercise_duration_minute}min - ${exerciseEntry.exercise_type} - ${exerciseEntry.body}`;
      
      document.addEventListener('DOMContentLoaded', () => {
        // Your existing code goes here
        
        // Call showExerciseEntry when the page loads
        showExerciseEntry();
      });
  
      const deleteButton = document.createElement('button');
      deleteButton.innerText = 'Poista';
      deleteButton.addEventListener('click', () => {
        deleteListItem(exerciseEntry._id);
        listItem.remove(); // Remove the list item from the UI
      });
      listItem.append(deleteButton);
  
      exerciseEntries.prepend(listItem);
    }
    
  
  
    function showSavedMessage() {
      const message = document.createElement('div');
      message.textContent = 'Päiväkirja tallennettu';
      message.style.backgroundColor = 'green';
      message.style.color = 'white';
      message.style.padding = '12px';
      message.style.borderRadius = '15px';
      message.style.marginTop = '12px';
      message.style.width = 'fit-content';
  
      const container = document.querySelector('.exercise');
      container.appendChild(message);
  
      setTimeout(() => {
        container.removeChild(message);
      }, 5000);
    }
  
    exerciseForm.addEventListener('submit', async (event) => {
      event.preventDefault();
  
      console.log("Validation running");
      showExerciseEntry();
  
      const exerciseType = document.querySelector('#exercise_type').value;
      const content = document.querySelector('#exercise_date').value;
      const hour = document.querySelector('#exercise_duration_hour').value;
      const minute = document.querySelector('#exercise_duration_minute').value;
      const time = hour + minute;
  
      if ( time == 0 || content.length < 1) {
        event.preventDefault();
        alert('Unohdit merkitä liikunnankeston ja/tai kuvauksen');
        return;
      }
  
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({exercise_type: exerciseType,exercise_duration_hour: hour,exercise_duration_minute: minute, body: content}),
      };
  
      try {
        const response = await fetch('/exerciseEntries', requestOptions);
        const newExerciseEntry = await response.json();
  
        if (response.ok) {
          showSavedMessage();
          addNewExerciseEntryToDOM(newExerciseEntry);
  
          document.querySelector('#exercise_date').value = '';
          document.querySelector('#exercise_type').value = '';
          document.querySelector('#exercise_duration_hour').value = '';
          document.querySelector('#exercise_duration_minute').value = '';
        } else {
          throw new Error('Virhe tallentaessa päiväkirjaa');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    });
  
    async function fetchExerciseEntries(skip = 0) {
      try {
        const response = await fetch(`/exerciseEntries?skip=${skip}`);
        const exerciseEntriesData = await response.json();
        
        exerciseEntriesData.forEach((entry) => {
          addNewExerciseEntryToDOM(entry);
        });
      } catch (error) {
        console.error('Error fetching exercise entries:', error);
      }
    }
  
    function deleteListItem(exerciseEntryId) {
      const requestOptions = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      };
    
      fetch(`/exerciseEntries_nurse/${exerciseEntryId}`, requestOptions)
        .then((response) => {
          if (response.ok) {
            console.log(`Exercise entry with ID ${exerciseEntryId} deleted successfully`);
          } else {
            throw new Error('Failed to delete exercise entry');
          }
        })
        .catch((error) => {
          console.error('Error deleting exercise entry:', error);
        });
    }
    
  
    const activitiesButton = document.querySelector('#activities');
    const activitiesList = document.querySelector('.activities');
  
    activitiesButton.addEventListener('click', () => {
      activitiesList.toggleAttribute('hidden');
    });
  
  });
  
  async function showExerciseEntry(exerciseEntryId) {
    if (!exerciseEntryId) {
      document.querySelector('#selected_exercise_entry').innerHTML = '';
      return;
    }
  
    try {
      const response = await fetch(`/exerciseEntries/${exerciseEntryId}`);
      const exerciseEntry = await response.json();
  
      const exerciseEntryHtml = `
        
        <p>${exerciseEntry.body}</p>
      `;
  
      document.querySelector('#selected_exercise_entry').innerHTML = exerciseEntryHtml;
    } catch (error) {
      console.error('Error:', error);
    }
  }
  
