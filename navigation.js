const roomSelect = document.querySelector('#room-select');
const journey = document.querySelector('.journey');

if (roomSelect && journey) {
  // The scene owns the active chapter. Read that state without changing scroll.
  const syncRoom = () => {
    const activeLink = journey.querySelector('[aria-current="location"]');
    const room = activeLink?.hash.slice(1) || location.hash.slice(1) || 'reception';
    if ([...roomSelect.options].some(option => option.value === room)) {
      roomSelect.value = room;
    }
  };

  roomSelect.addEventListener('change', () => {
    // A normal fragment navigation keeps browser history and motion preferences.
    location.hash = roomSelect.value;
    document.getElementById(roomSelect.value)?.scrollIntoView({ behavior: 'auto' });
  });

  new MutationObserver(syncRoom).observe(journey, {
    subtree: true,
    attributes: true,
    attributeFilter: ['aria-current'],
  });
  addEventListener('hashchange', syncRoom);
  document.documentElement.classList.add('has-room-picker');
  syncRoom();
}

// Restore the named room after responsive layout and browser scroll restoration.
addEventListener('load', () => {
  const room = document.getElementById(location.hash.slice(1));
  if (room?.classList.contains('chapter')) requestAnimationFrame(() => room.scrollIntoView({ behavior: 'instant' }));
}, { once: true });
