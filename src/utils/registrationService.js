/**
 * Service to handle event registration submissions to Google Sheets via Google Apps Script Web App.
 */

const DEFAULT_INTERNAL_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyByMWe9XeaeSeVJDTgfy-td-d3mmGjPrIhNUyvQFD1XNDNtk6brFAwG_LODwwCrFVX/exec';
const DEFAULT_EXTERNAL_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz-6D59vesZTj6XyzWG_r-cBxbZA_msHE9m742S8C9dkq6MYALZSKt62e0fbEqSYXOI/exec';

/**
 * Helper to convert File to Base64 string.
 */
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

/**
 * Submits internal ACE student registration details to Google Sheet.
 * 
 * @param {Object} formData
 * @returns {Promise<{success: boolean, message?: string}>}
 */
export async function submitInternalRegistration(formData) {
  const scriptUrl = import.meta.env.VITE_APPS_SCRIPT_INTERNAL_URL || DEFAULT_INTERNAL_SCRIPT_URL;

  const payload = {
    participantName: (formData.participantName || '').trim(),
    contactNo: (formData.contactNo || '').trim(),
    emailId: (formData.emailId || '').trim(),
    academicYear: formData.academicYear || 'SE',
    branch: formData.branch || 'CMPN',
    collegeName: formData.collegeName || 'Atharva College of Engineering',
    mode: 'Website (ACE)',
    track: 'internal',
    timestamp: new Date().toISOString()
  };

  // Local storage auto-backup for 100% data preservation
  try {
    const backupKey = `boardroom_internal_backup_${Date.now()}`;
    localStorage.setItem(backupKey, JSON.stringify(payload));
  } catch (err) {
    console.warn('LocalStorage backup warning:', err);
  }

  // Basic validation check
  if (!payload.participantName || !payload.contactNo || !payload.emailId) {
    throw new Error('Please fill in all required fields (Name, Contact No, and Email).');
  }

  try {
    await fetch(scriptUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    return { success: true };
  } catch (error) {
    console.error('Internal registration submission failed:', error);
    throw new Error('Network error occurred while submitting. Please check your internet connection.');
  }
}

/**
 * Submits external delegate registration details to Google Sheet, including the payment screenshot.
 * 
 * @param {Object} formData
 * @param {File|null} paymentScreenshot
 * @returns {Promise<{success: boolean, message?: string}>}
 */
export async function submitExternalRegistration(formData, paymentScreenshot) {
  const scriptUrl = import.meta.env.VITE_APPS_SCRIPT_EXTERNAL_URL || DEFAULT_EXTERNAL_SCRIPT_URL;

  if (!paymentScreenshot) {
    throw new Error('Please upload your payment screenshot before submitting.');
  }

  // Convert screenshot to Base64 for Google Drive upload
  let screenshotBase64 = null;
  try {
    screenshotBase64 = await fileToBase64(paymentScreenshot);
  } catch (convErr) {
    console.warn('Could not encode screenshot to base64:', convErr);
  }

  const payload = {
    participantName: (formData.participantName || '').trim(),
    fullName: (formData.participantName || '').trim(),
    contactNo: (formData.contactNo || '').trim(),
    emailId: (formData.emailId || '').trim(),
    collegeName: (formData.collegeName || '').trim(),
    academicYear: formData.academicYear || 'SE',
    branch: formData.branch || 'CMPN',
    screenshotName: paymentScreenshot.name || 'payment_screenshot.jpg',
    screenshotMimeType: paymentScreenshot.type || 'image/jpeg',
    screenshotBase64: screenshotBase64,
    mode: 'Website (External)',
    track: 'external',
    timestamp: new Date().toISOString()
  };

  // Local storage auto-backup (excluding large raw base64 to preserve quota)
  try {
    const backupKey = `boardroom_external_backup_${Date.now()}`;
    const backupData = { ...payload, screenshotBase64: '[BASE64_ATTACHED]' };
    localStorage.setItem(backupKey, JSON.stringify(backupData));
  } catch (err) {
    console.warn('LocalStorage backup warning:', err);
  }

  // Basic validation check
  if (!payload.participantName || !payload.contactNo || !payload.emailId || !payload.collegeName) {
    throw new Error('Please fill in all required fields (Name, Contact No, Email, and College Name).');
  }

  try {
    await fetch(scriptUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    return { success: true };
  } catch (error) {
    console.error('External registration submission failed:', error);
    throw new Error('Network error occurred while submitting. Please check your internet connection.');
  }
}
