document.addEventListener('DOMContentLoaded', () => {
  const uploadForm = document.getElementById('uploadForm');
  const fileInput = document.getElementById('fileInput');
  const previewContainer = document.getElementById('previewContainer');
  const previewSection = document.getElementById('preview-section');

  uploadForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const file = fileInput.files[0];

    if (!file) {
      alert('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      console.log('Uploading file...');
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.statusText}`);
      }

      const { headers, rows } = await response.json(); // Extract headers and rows
      console.log('File uploaded successfully. Headers:', headers, 'Rows:', rows);

      if (headers && headers.length > 0) {
        displayPreview(headers, rows); // Show the preview
        previewSection.style.display = 'block'; // Ensure the section is visible
      } else {
        alert('No headers found in the uploaded file.');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file. Please try again.');
    }
  });

  function displayPreview(headers, rows) {
    // Rules Mapping: Map frontend-friendly labels to backend rule keys
    const rules = {
      "No Action": "",
      "Capitalize": "capitalizeWords",
      "Fix Email": "emailFix",
      "Remove Spaces": "removeSpaces",
    };

    previewContainer.innerHTML = ''; // Clear any existing preview content

    console.log('Displaying preview for headers and rows:', { headers, rows }); // Debugging

    // Create table for headers and rows
    const table = document.createElement('table');

    // Add table headers
    const headerRow = document.createElement('tr');
    headers.forEach((header) => {
      const th = document.createElement('th');
      th.textContent = header;
      headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    // Add table rows
    rows.forEach((row, rowIndex) => {
      const tr = document.createElement('tr');
      headers.forEach((header) => {
        const td = document.createElement('td');
        td.textContent = row[header] || ''; // Show cell value or empty string
        td.dataset.row = rowIndex;
        td.dataset.column = header;
        tr.appendChild(td);
      });
      table.appendChild(tr);
    });

    previewContainer.appendChild(table);

    // Add cleansing rules dropdowns below the table
    const ruleContainer = document.createElement('div');
    headers.forEach((header) => {
      const label = document.createElement('label');
      label.textContent = `${header}:`;

      const select = document.createElement('select');
      select.name = header;

      // Populate dropdown using the rules mapping
      Object.entries(rules).forEach(([label, value]) => {
        const option = document.createElement('option');
        option.value = value; // Backend rule key
        option.textContent = label; // User-friendly label
        select.appendChild(option);
      });

      ruleContainer.appendChild(label);
      ruleContainer.appendChild(select);
      ruleContainer.appendChild(document.createElement('br'));
    });

    previewContainer.appendChild(ruleContainer);

    // Add "Apply Cleansing Rules" button
    const cleanseButton = document.createElement('button');
    cleanseButton.textContent = 'Apply Cleansing Rules';
    cleanseButton.addEventListener('click', () => applyCleansingRules(headers, rows));
    previewContainer.appendChild(cleanseButton);
  }

  async function applyCleansingRules(headers, rows) {
    const rules = {};
    document.querySelectorAll('select').forEach((select) => {
      if (select.value !== '') {
        rules[select.name] = select.value;
      }
    });

    console.log('Applying rules:', rules);

    // Prepare data for cleansing
    const requestData = { headers, rows, rules };

    try {
      const response = await fetch('/api/cleanse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.statusText}`);
      }

      const data = await response.blob();
      const url = window.URL.createObjectURL(data);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'cleaned_data.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      alert('File cleansed and downloaded successfully!');
    } catch (error) {
      console.error('Error applying cleansing rules:', error);
      alert('Failed to apply cleansing rules. Please try again.');
    }
  }
});
