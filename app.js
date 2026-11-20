(function () {
  'use strict';
  var G = window.GUIDE;

  // ---- 小工具 ----
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function rich(s) { return esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>'); }
  // 大標按逗號分段換行，不讓一句話斷在半路
  function phrases(s) {
    return String(s).replace(/([，。：；])/g, '$1\n').split('\n').filter(Boolean).map(function (p) { return '<span class="ph">' + esc(p) + '</span>'; }).join('');
  }
  var ICONS = {
    right: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
    left: '<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>',
    copy: '<rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    play: '<polygon points="6 3 20 12 6 21 6 3"/>',
    down: '<path d="m6 9 6 6 6-6"/>',
    ext: '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3"/>',
    again: '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>'
  };
  function icon(n) { return '<svg class="i" viewBox="0 0 24 24" aria-hidden="true">' + ICONS[n] + '</svg>'; }
  function copyBtn(text, label, cls) {
    return '<button type="button" class="btn ' + (cls || '') + '" data-copy="' + esc(text) + '" data-label="' + esc(label) + '">' + icon('copy') + '<span>' + esc(label) + '</span></button>';
  }
  function list(items, tag) {
    return '<' + (tag || 'ul') + '>' + items.map(function (s) { return '<li>' + rich(s) + '</li>'; }).join('') + '</' + (tag || 'ul') + '>';
  }
  function fold(title, inner, open) {
    return '<details' + (open ? ' open' : '') + '><summary>' + esc(title) + icon('down') + '</summary><div>' + inner + '</div></details>';
  }

  // 依台灣日期判斷「這週」
  function currentWeek() {
    var now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Taipei' }));
    var idx = 0;
    G.step4.weeks.forEach(function (w, i) {
      var p = w.date.split('-');
      var start = new Date(+p[0], +p[1] - 1, +p[2] - 6); // 主日前一週的週一算進同一週
      if (now >= start) idx = i;
    });
    return idx;
  }

  var steps = [G.step1, G.step2, G.step3, G.step4];

  // ---- 每一屏 ----
  var screens = [
    function cover() {
      return '<div class="cover"><div class="k">THERE IS MORE</div>' +
        '<h1>' + phrases(G.oneLine) + '</h1>' +
        '<p class="lead">' + esc(G.why) + '</p>' +
        '<div class="box"><h2>帶小組前，5 分鐘走完這四步</h2><ol class="toc">' +
        steps.map(function (s, i) {
          return '<li><button type="button" data-go="' + (i + 1) + '"><span class="n">' + (i + 1) + '</span><span><b>' + esc(s.label) + '</b><span class="sub">' + esc(s.title) + '</span></span>' + icon('right') + '</button></li>';
        }).join('') + '</ol></div>' +
        '<div class="box">' + fold('我們期待看到', list(G.wins)) + '</div>' +
        '<p class="meta">' + esc(G.audience) + '<br>' + esc(G.series) + '</p></div>';
    },
    function s1() {
      var s = G.step1;
      return head(1, s) +
        '<p class="lead">' + esc(s.intro) + '</p>' +
        '<div class="box"><div class="acts">' + s.acts.map(function (a) {
          return '<div class="act"><span class="en">' + esc(a[0]) + '</span><b>' + esc(a[1]) + '</b><p>' + esc(a[2]) + '</p></div>';
        }).join('') + '</div></div>' +
        '<p class="theme">' + esc(s.theme) + '</p>' +
        '<div class="box"><h2>可以這樣講（1 分鐘）</h2><p class="quote">「' + esc(s.script) + '」</p>' +
        '<div class="actions">' + copyBtn(s.script, '複製講稿', 'solid') + '</div></div>' +
        '<div class="box"><h2>要講到的三個重點</h2>' + list(s.points) + '</div>' +
        '<div class="box">' + fold('FORWARD 奉獻是什麼？', list(s.givingWhat)) + fold('FORWARD 奉獻代表什麼？', list(s.givingMeans)) + '</div>';
    },
    function s2() {
      var s = G.step2;
      return head(2, s) +
        '<p class="lead">' + esc(s.intro) + '</p>' +
        '<a class="video" href="' + esc(s.video.url) + '" target="_blank" rel="noopener"><span class="play">' + icon('play') + '</span><span><b>' + esc(s.video.title) + '</b><span class="sub">' + esc(s.video.meta) + '・參考他怎麼講</span></span><span class="ext">' + icon('ext') + '</span></a>' +
        '<div class="box"><h2>故事可以這樣排（約 1–2 分鐘）</h2><ol>' + s.outline.map(function (o) {
          return '<li><b>' + esc(o[0]) + '</b><br><span class="sub">' + esc(o[1]) + '</span></li>';
        }).join('') + '</ol></div>' +
        '<div class="box"><h2>可以分享的不只有成功</h2>' + list(s.notOnlySuccess) + '<p class="sub" style="margin-top:10px">' + esc(s.notOnlySuccessNote) + '</p></div>';
    },
    function s3() {
      var s = G.step3;
      return head(3, s) +
        '<p class="lead">' + esc(s.intro) + '</p>' +
        '<div class="box"><h2>可以這樣邀請</h2><p class="quote">「' + esc(s.script) + '」</p>' +
        '<div class="actions">' + copyBtn(s.script, '複製講稿', 'solid') + '</div></div>' +
        '<div class="box"><h2>小組裡的三個步驟</h2><ol class="flow">' + s.flow.map(function (f) { return '<li>' + esc(f) + '</li>'; }).join('') + '</ol>' +
        '<p class="sub" style="margin-top:8px">' + esc(s.flowNote) + '</p></div>' +
        '<div class="box"><h2>FORWARD 奉獻怎麼邀請</h2><p>' + esc(s.giving) + '</p></div>' +
        '<div class="box links"><h2>貼進小組群組</h2>' + s.links.map(function (l) {
          return '<div class="link"><span class="t"><b>' + esc(l[0]) + '</b><a href="' + esc(l[1]) + '" target="_blank" rel="noopener">' + esc(l[1].replace(/^https:\/\//, '')) + '</a></span>' + copyBtn(l[1], '複製') + '</div>';
        }).join('') + '</div>' +
        '<div class="box">' + fold('FORWARD 網站怎麼看', '<p>' + esc(s.siteIntro) + '</p><ol style="margin-top:10px">' +
          s.siteParts.map(function (p) { return '<li><b>' + esc(p[0]) + '</b>：' + esc(p[1]) + '</li>'; }).join('') + '</ol><p class="sub" style="margin-top:10px">' + esc(s.siteNote) + '</p>') + '</div>';
    },
    function s4() {
      var s = G.step4, wk = currentWeek();
      return head(4, s) +
        '<div class="box"><h2>三週節奏（線上分部）</h2>' + s.weeks.map(function (w, i) {
          return '<div class="week' + (i === wk ? ' now' : '') + '"><div class="h">' + esc(w.name) + ' ' + esc(w.short) + '｜' + esc(w.theme) + (i === wk ? '<span class="tag">這週</span>' : '') + '</div>' +
            '<p>主日：' + esc(w.sunday) + '</p><p class="g">' + esc(w.group) + '</p></div>';
        }).join('') + '<p class="sub" style="margin-top:10px">' + esc(s.weeksNote) + '</p></div>' +
        '<div class="box"><h2>要做</h2>' + list(s.dos) + '</div>' +
        '<div class="box"><h2>不要做</h2>' + list(s.donts) + '</div>' +
        '<div class="box"><h2>組員常問的問題</h2>' + s.faq.map(function (f) { return fold(f[0], '<p>' + esc(f[1]) + '</p>'); }).join('') + '</div>';
    }
  ];
  function head(n, s) {
    return '<div class="k">STEP ' + n + ' / 4・<b>' + esc(s.label) + '</b></div><h1>' + phrases(s.title) + '</h1>';
  }

  // ---- 畫面切換 ----
  var main = document.getElementById('screen');
  var bar = document.querySelector('.bar');
  var nav = document.querySelector('.nav');
  var cur = -1;

  bar.insertAdjacentHTML('beforeend', steps.map(function (s, i) {
    return '<button type="button" data-go="' + (i + 1) + '"><span>' + (i + 1) + ' ' + esc(s.label) + '</span></button>';
  }).join(''));

  function render(i, fromHash) {
    if (i === cur) return;
    cur = i;
    main.innerHTML = '';
    main.insertAdjacentHTML('beforeend', screens[i]());
    main.classList.remove('in'); void main.offsetWidth; main.classList.add('in');
    [].forEach.call(bar.children, function (b, k) {
      b.classList.toggle('done', k + 1 < i);
      if (k + 1 === i) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current');
    });
    var prev = i === 0 ? '' : '<button type="button" class="prev" data-go="' + (i - 1) + '">' + icon('left') + '上一步</button>';
    var nextLabel = i === 0 ? '開始' : i === 4 ? '回到開頭' : '下一步：' + steps[i].label;
    var nextGo = i === 4 ? 0 : i + 1;
    nav.innerHTML = '';
    nav.insertAdjacentHTML('beforeend', '<div class="in">' + prev + '<button type="button" class="next" data-go="' + nextGo + '">' + esc(nextLabel) + icon(i === 4 ? 'again' : 'right') + '</button></div>');
    if (!fromHash) {
      var h = i === 0 ? location.pathname + location.search : '#step-' + i;
      history.pushState(null, '', h);
    }
    window.scrollTo(0, 0);
    main.focus({ preventScroll: true });
    document.title = (i === 0 ? '' : steps[i - 1].label + '｜') + 'FORWARD 2026 小組長溝通守則';
  }

  function fromHash() {
    var m = /^#step-([1-4])$/.exec(location.hash);
    return m ? +m[1] : 0;
  }

  // ---- 複製 ----
  function copyText(t) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(t);
    return new Promise(function (ok, no) {
      var ta = document.createElement('textarea');
      ta.value = t; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy') ? ok() : no(); } catch (e) { no(e); }
      document.body.removeChild(ta);
    });
  }

  document.addEventListener('click', function (e) {
    var g = e.target.closest('[data-go]');
    if (g) { render(+g.dataset.go); return; }
    var c = e.target.closest('[data-copy]');
    if (c) {
      var label = c.dataset.label;
      copyText(c.dataset.copy).then(function () {
        c.classList.add('copied');
        c.innerHTML = icon('check') + '<span>已複製</span>';
      }, function () {
        c.innerHTML = icon('copy') + '<span>複製失敗，請長按文字</span>';
      }).then(function () {
        setTimeout(function () { c.classList.remove('copied'); c.innerHTML = icon('copy') + '<span>' + esc(label) + '</span>'; }, 1600);
      });
    }
  });
  window.addEventListener('popstate', function () { render(fromHash(), true); });

  render(fromHash(), true);
})();
