/**
 * Service to handle event registration submissions to Google Sheets via Google Apps Script Web App.
 */

const DEFAULT_INTERNAL_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyByMWe9XeaeSeVJDTgfy-td-d3mmGjPrIhNUyvQFD1XNDNtk6brFAwG_LODwwCrFVX/exec';
const DEFAULT_EXTERNAL_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz-6D59vesZTj6XyzWG_r-cBxbZA_msHE9m742S8C9dkq6MYALZSKt62e0fbEqSYXOI/exec';

/**
 * Compresses an image file using an HTML5 canvas and converts it to a lightweight Base64 string.
 * Reduces 5MB-10MB phone camera photos down to crisp ~60KB-80KB JPEGs so Google Drive can decode them instantly.
 */
function compressAndEncodeImage(file, maxDimension = 1200, quality = 0.75) {
  return new Promise((resolve, reject) => {
    // If not an image, fallback to standard FileReader
    if (!file.type || !file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => {
        // Fallback to raw base64 if image decoding fails
        resolve(e.target.result);
      };
      img.onload = () => {
        try {
          let width = img.width;
          let height = img.height;

          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            } else {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          
          // White background for transparency safety
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);

          // Compress to clean JPEG
          const dataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(dataUrl);
        } catch (canvasErr) {
          console.warn('Canvas compression fallback:', canvasErr);
          resolve(e.target.result);
        }
      };
      img.src = e.target.result;
    };
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
    academicYear: formData.academicYear || '',
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
 * Submits external delegate registration details to Google Sheet, including the compressed payment screenshot.
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

  // Compress screenshot to lightweight Base64 for instant, reliable Google Drive upload
  let screenshotBase64 = null;
  try {
    screenshotBase64 = await compressAndEncodeImage(paymentScreenshot, 1200, 0.75);
  } catch (convErr) {
    console.warn('Could not compress screenshot to base64:', convErr);
  }

  const payload = {
    participantName: (formData.participantName || '').trim(),
    fullName: (formData.participantName || '').trim(),
    contactNo: (formData.contactNo || '').trim(),
    emailId: (formData.emailId || '').trim(),
    collegeName: (formData.collegeName || '').trim(),
    academicYear: formData.academicYear || '',
    branch: (formData.branch || '').trim(),
    screenshotName: paymentScreenshot.name || 'payment_screenshot.jpg',
    screenshotMimeType: 'image/jpeg',
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
