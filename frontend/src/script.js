const uploadButton = document.getElementById('uploadButton');
const finalizeButton = document.getElementById('finalizeButton');
const fileInput = document.getElementById('fileInput');
let uploadedFile = null;

// Handle file upload
uploadButton.addEventListener('click', async () => {
  const file = fileInput.files[0];
  if (!file) {
    alert('Please select a file to upload.');
    return;
  }

  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const { headers } = await response.json();
    uploadedFile = file;
    displayColumns(headers);
    document.getElementById('cleanse-section').style.display = 'block';
  } catch (error) {
    console.error('Error uploading file:', error);
    alert('Failed to upload file. Please try again.');
  }
});

// Display column headers for rule selection
function displayColumns(headers) {
  const container = document.getElementById('columnsPreview');
  container.innerHTML = '';
  headers.forEach((header) => {
    const div = document.createElement('div');
    div.innerHTML = `
      <label>${header}</label>
      <select name="${header}">
        <option value="">No Action</option>
        <option value="trim">Trim</option>
        <option value="capitalizeWords">Capitalize Words</option>
        <option value="emailFix">Fix Emails</option>
        <option value="phoneFormat">Format Phone Numbers</option>
      </select>
    `;
    container.appendChild(div);
  });
}

// Handle finalize cleansing
finalizeButton.addEventListener('click', async () => {
  const rules = {};
  document.querySelectorAll('#columnsPreview select').forEach((select) => {
    if (select.value) {
      rules[select.name] = select.value;
    }
  });

  const formData = new FormData();
  formData.append('file', uploadedFile);
  formData.append('approvedChanges', JSON.stringify(rules));

  try {
    const response = await fetch('/api/cleanse', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'cleaned_data.csv';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert('Error cleansing data. Please try again.');
    }
  } catch (error) {
    console.error('Error finalizing cleansing:', error);
    alert('Failed to cleanse data. Please try again.');
  }
});
