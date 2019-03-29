(function() {
  var form = document.querySelector('form');
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    document.querySelector('.flip-card').classList.add('flipped');
    var inputValue = document.querySelector('.form-input').value;
    var googleSheetsUrl =
      'https://script.google.com/macros/s/AKfycbw6w7sjS99e8OWTotYJcCqcLJ5HsYk-x3Au4zs8kUCo9BW42Bbg/exec';
    fetch(`${googleSheetsUrl}?email=${encodeURIComponent(inputValue)}`);
  });
})();
