// копирование тега
document.querySelectorAll('[data-copy]').forEach(function (btn) {
  btn.addEventListener('click', function () {
    var text = btn.getAttribute('data-copy');
    var done = function () {
      var old = btn.textContent;
      btn.textContent = 'скопировано ✓';
      setTimeout(function () { btn.textContent = old; }, 1400);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, function () { fallback(text); done(); });
    } else { fallback(text); done(); }
  });
});

function fallback(text) {
  var ta = document.createElement('textarea');
  ta.value = text; document.body.appendChild(ta); ta.select();
  try { document.execCommand('copy'); } catch (e) {}
  document.body.removeChild(ta);
}

// чеклист с сохранением прогресса в браузере
document.querySelectorAll('.checklist').forEach(function (list) {
  var key = 'fabrika2:' + list.getAttribute('data-key');
  var boxes = list.querySelectorAll('input[type=checkbox]');
  var bar = document.querySelector('.progress[data-for="' + list.getAttribute('data-key') + '"]');
  var saved = [];
  try { saved = JSON.parse(localStorage.getItem(key) || '[]'); } catch (e) {}

  function update() {
    var state = [], n = 0;
    boxes.forEach(function (b, i) { state[i] = b.checked; if (b.checked) n++; });
    try { localStorage.setItem(key, JSON.stringify(state)); } catch (e) {}
    if (bar) {
      bar.querySelector('span').textContent = n + ' / ' + boxes.length;
      bar.querySelector('i').style.width = (boxes.length ? n / boxes.length * 100 : 0) + '%';
    }
  }
  boxes.forEach(function (b, i) {
    if (saved[i]) b.checked = true;
    b.addEventListener('change', update);
  });
  update();
});
