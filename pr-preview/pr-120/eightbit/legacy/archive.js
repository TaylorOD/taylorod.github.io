document.querySelectorAll('.filter-button').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.filter').forEach(card => {
      card.hidden = button.dataset.filter !== 'all' && !card.classList.contains(button.dataset.filter);
    });
  });
});
