export const DEFAULT_ANNOUNCEMENTS = [
  {
    title: 'Boardroom Billionaires',
    tag: 'Entrepreneurship Event',
    subtext: 'The ultimate entrepreneurial showdown. Pitch your business models, negotiate with mock venture capitalists, and navigate critical boardroom crises to claim the crown.',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    date: '30th Sept & 1st Oct',
    time: '11:00 AM',
    venue: 'ACE Auditorium',
    btnText: 'Register Now',
    btnUrl: '/boardroom-billionaires'
  },
  {
    title: 'CiiA-4 Innovations Showcase',
    tag: 'Milestone',
    subtext: 'Our student teams represented the cell at the prestigious CiiA-4 exhibition, showcasing smart mobility projects like M-Park and AI-driven Traffic Control.',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
    date: 'Feb 5-7, 2025',
    time: '-',
    venue: 'Exhibition Ground',
    btnText: 'Read Highlights',
    btnUrl: '/initiatives'
  },
  {
    title: 'Finnoverse Hackathon',
    tag: 'Tech Innovation',
    subtext: 'A finance and web3 innovation event combining blockchain, modern finance, and decentralization ideation, leading to awesome projects built by ACE students.',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    date: '2024-25',
    time: '-',
    venue: 'iLab',
    btnText: 'See Projects',
    btnUrl: '/gallery'
  }
];

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

export async function fetchAnnouncements() {
  const sheetUrl = import.meta.env.VITE_ANNOUNCEMENTS_SHEET_URL;
  
  if (!sheetUrl) {
    console.log('No Google Sheets URL defined in environment. Using default local announcements.');
    return DEFAULT_ANNOUNCEMENTS;
  }
  
  try {
    const response = await fetch(sheetUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const text = await response.text();
    
    // Split by newlines (handling both \r\n and \n)
    const lines = text.split(/\r?\n/).map(line => line.trim()).filter(line => line);
    if (lines.length < 2) {
      return DEFAULT_ANNOUNCEMENTS;
    }
    
    // Header parsing
    const headers = parseCSVLine(lines[0]);
    
    // Map rows to objects
    const data = lines.slice(1).map(line => {
      const values = parseCSVLine(line);
      const obj = {};
      headers.forEach((header, index) => {
        const val = values[index];
        obj[header] = val ? val.replace(/^"|"$/g, '') : '';
      });
      return obj;
    });
    
    // Reverse the data so that the bottom of the sheet (newest entries) shows first,
    // and slice the top 3 items
    const latestThree = data.reverse().slice(0, 3);
    
    return latestThree.length > 0 ? latestThree : DEFAULT_ANNOUNCEMENTS;
  } catch (error) {
    console.error('Failed to fetch announcements from Google Sheets. Falling back to defaults.', error);
    return DEFAULT_ANNOUNCEMENTS;
  }
}
