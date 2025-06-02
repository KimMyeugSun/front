const form = document.getElementById('diaryForm');
const input = document.getElementById('diaryInput');
const postitWrapper = document.getElementById('postit-wrapper');
const modal = document.getElementById('diaryModal');
const modalText = document.getElementById('modalText');
const modalClose = document.getElementById('modalClose');

// 날짜 키 (YYYY/MM/DD)와 시간 (HH:MM)
function getNow() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const hh = String(now.getHours()).padStart(2, '0');
  const mi = String(now.getMinutes()).padStart(2, '0');
  return {
    date: `${yyyy}/${mm}/${dd}`,
    time: `${hh}:${mi}`
  };
}

// 포스트잇 생성 및 그룹화
function createPostIt(dateKey, time, content) {
  let group = document.querySelector(`[data-date="${dateKey}"]`);

  if (!group) {
    group = document.createElement('div');
    group.className = 'date-group';
    group.dataset.date = dateKey;

    const header = document.createElement('h3');
    header.textContent = dateKey;
    group.appendChild(header);
    postitWrapper.prepend(group);
  }

  const post = document.createElement('div');
  post.className = 'postit';
  post.textContent = time;
  post.dataset.key = `${dateKey} ${time}`;
  post.addEventListener('click', () => {
    const saved = localStorage.getItem(post.dataset.key);
    if (saved) {
      modalText.textContent = saved;
      modal.classList.remove('hidden');
    }
  });

  group.appendChild(post);
}

// 폼 제출
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const content = input.value.trim();
  if (!content) return;

  const { date, time } = getNow();
  const key = `${date} ${time}`;

  localStorage.setItem(key, content);
  createPostIt(date, time, content);
  input.value = '';
});

// 초기 로딩: localStorage에서 데이터 불러오기
window.addEventListener('DOMContentLoaded', () => {
  const keys = Object.keys(localStorage)
    .filter(k => /^\d{4}\/\d{2}\/\d{2} \d{2}:\d{2}$/.test(k))
    .sort()
    .reverse();

  keys.forEach(key => {
    const [date, time] = key.split(' ');
    const content = localStorage.getItem(key);
    createPostIt(date, time, content);
  });
});

// 모달 닫기
modalClose.addEventListener('click', () => {
  modal.classList.add('hidden');
});
