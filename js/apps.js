/* ===== apps.js — Application Definitions ===== */
const Apps = (() => {

  /* ==============================
     App Registry
     ============================== */
  const REGISTRY = {};

  /* ==============================
     XP Window Chrome Helper
     Creates standard XP Explorer chrome: menubar, toolbar, addressbar, sidebar+content, statusbar
     ============================== */
  function createXPChrome(body, cfg) {
    body.classList.add('no-scroll');
    body.innerHTML = '';

    // Menu Bar
    const menubar = document.createElement('div');
    menubar.className = 'xp-menubar';
    const menuItems = cfg.menus || ['\u6587\u4EF6(F)', '\u7F16\u8F91(E)', '\u67E5\u770B(V)', '\u6536\u85CF(A)', '\u5DE5\u5177(T)', '\u5E2E\u52A9(H)'];
    menuItems.forEach(m => {
      const s = document.createElement('span');
      s.textContent = m;
      menubar.appendChild(s);
    });

    // Toolbar
    const toolbar = document.createElement('div');
    toolbar.className = 'xp-toolbar';
    const tbBtns = cfg.toolbar || [
      { label: '\u540E\u9000', icon: '\u25C0', disabled: true },
      { label: '\u524D\u8FDB', icon: '\u25B6', disabled: true },
      { label: '\u5411\u4E0A', icon: '\u25B2' },
      { sep: true },
      { label: '\u641C\u7D22', icon: '\uD83D\uDD0D' },
      { label: '\u6587\u4EF6\u5939', icon: '\uD83D\uDCC1' },
      { label: '\u89C6\u56FE(V)', icon: '\u25BC' },
    ];
    tbBtns.forEach(b => {
      if (b.sep) {
        const sep = document.createElement('div');
        sep.className = 'xp-toolbar-sep';
        toolbar.appendChild(sep);
        return;
      }
      const btn = document.createElement('button');
      btn.className = 'xp-toolbar-btn' + (b.disabled ? ' disabled' : '');
      btn.innerHTML = '<span>' + b.icon + '</span><span>' + b.label + '</span>';
      toolbar.appendChild(btn);
    });

    // Address Bar
    const addrbar = document.createElement('div');
    addrbar.className = 'xp-addressbar';
    addrbar.innerHTML =
      '<span class="xp-addressbar-label">\u5730\u5740(D)</span>' +
      '<input class="xp-addressbar-input" type="text" value="' + (cfg.address || '') + '" readonly>' +
      '<button class="xp-addressbar-go">\u25B6 \u8F6C\u5230(G)</button>';

    // Explorer Body
    const explorer = document.createElement('div');
    explorer.className = 'xp-explorer';

    const sidebar = document.createElement('div');
    sidebar.className = 'xp-sidebar';

    const content = document.createElement('div');
    content.className = 'xp-content';

    explorer.append(sidebar, content);

    // Status Bar
    const statusbar = document.createElement('div');
    statusbar.className = 'window-statusbar';
    statusbar.textContent = cfg.statusText || '';

    body.append(menubar, toolbar, addrbar, explorer, statusbar);

    return { sidebar, content, statusbar };
  }

  /* Helper: create a sidebar section panel */
  function createSidebarSection(title, links) {
    const section = document.createElement('div');
    section.className = 'xp-sidebar-section';
    section.innerHTML =
      '<div class="xp-sidebar-header"><span class="arrow">\u25BC</span> ' + title + '</div>' +
      '<div class="xp-sidebar-links">' +
        links.map(l => '<a class="xp-sidebar-link" data-app="' + (l.app || '') + '"><img src="' + (l.icon || '') + '"> ' + l.label + '</a>').join('') +
      '</div>';
    return section;
  }

  function register(appDef) {
    REGISTRY[appDef.id] = appDef;
  }

  function openApp(appId) {
    const app = REGISTRY[appId];
    if (!app) {
      console.warn('Unknown app:', appId);
      return;
    }
    WindowManager.openWindow(app);
  }

  /* ==============================
     Article Data
     ============================== */
  const ARTICLES = [
    {
      id: 'art-1', title: '2007 年的夏天，似乎一直没有结束',
      date: '2024-08-12', category: '日常记录', tags: ['回忆', '夏天'],
      content: `<p>有些夏天是特别的。不是因为它发生了什么大事，而是因为它什么都没发生。</p>
<p>2007 年的夏天，我住在一个小镇上。每天下午，阳光会从西边的窗户斜斜地照进来，在地板上画出一个金色的长方形。我会躺在那个长方形里，看着天花板上的裂纹，想象它们是一张地图。</p>
<p>那时候没有智能手机，没有社交媒体。时间走得很慢，慢到你可以听到蝉鸣的每一个节拍。</p>
<p>后来我离开了那个小镇，去了很多地方。但每当夏天来临，我总会想起那个房间，那个地板上的金色长方形，和那些没有尽头的下午。</p>
<p>也许那个夏天一直没有结束。它只是被保存在了某个地方，像一张旧照片，等待着被重新翻开。</p>`
    },
    {
      id: 'art-2', title: '记录一次没有目的地的散步',
      date: '2024-07-03', category: '生活随笔', tags: ['散步', '安静'],
      content: `<p>今天出门的时候，没有想好要去哪里。只是觉得应该走走。</p>
<p>沿着一条不认识的路一直走。路边有老房子，墙上爬满了藤蔓。有一扇窗户开着，窗帘被风吹得轻轻摆动。我想象里面住着什么样的人。</p>
<p>走到一个十字路口，不知道该往哪边。于是选了左边。左边有一条小路，通向一片草地。草地上没有人，只有风。</p>
<p>我在那里站了很久。没有拍照，没有记录。只是站着。</p>
<p>回来的时候，天已经暗了。路灯亮起来，把街道染成了温暖的橙色。</p>
<p>没有目的地的散步，也许才是最好的散步。</p>`
    },
    {
      id: 'art-3', title: '我保存的几个奇怪梦境',
      date: '2024-06-18', category: '梦境日志', tags: ['梦', '超现实'],
      content: `<p><b>梦境一：无限走廊</b></p>
<p>我在一条走廊里走着。走廊两边都是门，每扇门都一模一样。我打开一扇门，里面是另一条同样的走廊。再打开一扇门，还是同样的走廊。就这样一直走，一直开门，一直走进同样的走廊。</p>
<p><b>梦境二：倒流的河</b></p>
<p>一条河从大海流向山丘。河水是透明的，可以看到河底的石头。我站在河边，看着水往上游流去。远处有一个人也在看，但我们没有说话。</p>
<p><b>梦境三：旧电脑</b></p>
<p>我打开一台旧电脑，屏幕上显示着一个文档。文档里写着："你终于回来了。"我试图打字回复，但键盘上没有字母，只有数字。我按下了几个数字，屏幕变黑了。然后我醒了。</p>`
    },
    {
      id: 'art-4', title: '关于旧电脑和旧互联网的记忆',
      date: '2024-05-22', category: '日常记录', tags: ['怀旧', '互联网'],
      content: `<p>我有一台旧的台式电脑。米黄色的机箱，CRT 显示器，机械键盘。</p>
<p>那时候的互联网很慢。打开一个网页需要等很久。但等待本身就是一种体验。你会看着进度条一点点前进，想象着远方的服务器正在把数据发送过来。</p>
<p>那时候的网站都很简单。没有复杂的动画，没有追踪代码，没有弹窗广告。只有一些文字、几张图片，和一个访客计数器。</p>
<p>我喜欢那种简单。喜欢打开一个网页，看到一个人的想法，然后关掉浏览器，回到现实。</p>
<p>现在的互联网很快，但好像少了些什么。也许少的就是那种等待的感觉。</p>`
    },
    {
      id: 'art-5', title: '一个安静的下午',
      date: '2024-04-15', category: '生活随笔', tags: ['安静', '日常'],
      content: `<p>今天下午，什么都没有发生。</p>
<p>我坐在窗边，看着外面的树。风把树叶吹得沙沙响。远处有孩子在玩，声音传过来，很模糊。</p>
<p>我泡了一杯茶，慢慢地喝。茶凉了，我又泡了一杯。</p>
<p>时间就这样过去了。没有做什么有意义的事，但感觉很好。</p>
<p>有时候，最好的下午就是这样的下午。安静的，没有计划的，不被打扰的。</p>`
    },
    {
      id: 'art-6', title: '最近在做的 WebGIS 小项目',
      date: '2024-03-28', category: '技术笔记', tags: ['WebGIS', 'OpenLayers'],
      content: `<p>最近在做一个 WebGIS 的小项目，用 OpenLayers 和 Vue 搭建。</p>
<p>主要功能是在地图上显示一些自定义的数据层，支持缩放、平移和属性查询。</p>
<pre style="background:#F0F0E8;border:1px solid #D5D2C5;padding:12px;font-family:var(--font-mono);font-size:12px;overflow:auto;margin:8px 0;">import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';

const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({ source: new OSM() })
  ],
  view: new View({
    center: [0, 0],
    zoom: 2
  })
});</pre>
<p>下一步想加入 Cesium 的 3D 地球支持，让地图可以在 2D 和 3D 之间切换。</p>`
    },
    {
      id: 'art-7', title: '那些不再访问的网站',
      date: '2024-02-14', category: '日常记录', tags: ['互联网', '回忆'],
      content: `<p>我收藏了一些网站，已经很多年没有访问过了。</p>
<p>有些是个人博客，作者最后更新是在 2010 年。有些是论坛，现在已经关闭了。有些是小型的在线社区，曾经很热闹，现在只剩下一片空白。</p>
<p>我偶尔会试着打开它们。有些还能访问，页面停留在多年前的样子。有些已经变成了 404。有些被转卖给了其他人，内容完全变了。</p>
<p>互联网上的东西，消失得比现实中的东西更快。一本书可以保存几百年，但一个网站可能只存在几年。</p>
<p>所以我开始保存一些东西。不是全部，只是一些我觉得重要的。像这个博客一样。</p>`
    },
    {
      id: 'art-8', title: '关于时间与记忆的一些想法',
      date: '2024-01-07', category: '生活随笔', tags: ['思考', '记忆'],
      content: `<p>时间是什么？记忆又是什么？</p>
<p>我觉得时间不是一条直线，而是一片空间。过去、现在和未来同时存在，只是我们只能感知到其中的一个切片。</p>
<p>记忆是我们在这片空间中标记位置的方式。有些标记很清晰，有些很模糊。有些标记会随着时间褪色，有些反而会变得更加鲜明。</p>
<p>我写这个博客，就是为了做标记。在时间的空间里，标记一些我觉得重要的位置。</p>
<p>也许有一天，我会回到这些位置，重新看看当时的自己。</p>`
    },
  ];

  /* ==============================
     Article Reading Window
     ============================== */
  function openArticle(article) {
    const appDef = {
      id: 'article-reader-' + article.id,
      title: article.title,
      icon: 'assets/icons/xp/32/notepad-file.png',
      width: 720, height: 560,
      renderContent(body) {
        body.innerHTML = `
          <div style="display:flex;flex-direction:column;height:100%;">
            <div style="padding:16px 28px 8px;border-bottom:1px solid #E8E8D8;">
              <div style="font-size:11px;color:var(--text-secondary);margin-bottom:4px;">\uD83D\uDCC2 ${article.category} \u00B7 ${article.date}</div>
              <h1 style="font-size:var(--fs-heading);color:var(--text-primary);line-height:1.4;margin:0;">${article.title}</h1>
              <div style="font-size:12px;color:var(--text-secondary);margin-top:6px;">\u6807\u7B7E: ${article.tags.join(' \u00B7 ')}</div>
            </div>
            <div style="flex:1;overflow:auto;padding:20px 28px;font-size:var(--fs-article);line-height:1.9;color:var(--text-primary);">
              ${article.content}
            </div>
            <div style="padding:8px 28px;border-top:1px solid #D5D2C5;background:var(--win-bg);display:flex;justify-content:space-between;align-items:center;">
              <span style="font-size:11px;color:var(--text-secondary);">\u5B57\u6570: ${article.content.replace(/<[^>]*>/g,'').length} \u00B7 \u9605\u8BFB\u65F6\u95F4\u7EA6 ${Math.ceil(article.content.replace(/<[^>]*>/g,'').length / 300)} \u5206\u949F</span>
              <div style="display:flex;gap:6px;">
                <button class="xp-btn" data-nav="archive">\u8FD4\u56DE\u6863\u6848</button>
              </div>
            </div>
          </div>
        `;
        body.querySelector('[data-nav="archive"]').addEventListener('click', () => {
          openApp('article-archive');
        });
      }
    };
    WindowManager.openWindow(appDef);
  }

  /* ==============================
     Welcome Window
     ============================== */
  register({
    id: 'welcome',
    title: 'Welcome to my little world',
    icon: 'assets/icons/xp/32/notepad-file.png',
    width: 540, height: 370,
    renderContent(body) {
      const { content, statusbar } = createXPChrome(body, {
        address: 'Welcome',
        statusText: 'Welcome to my little world'
      });

      statusbar.textContent = 'Somewhere.exe v1.0.0';
      content.style.cssText = 'display:flex;flex-direction:column;height:100%;';
      content.innerHTML = `
        <div class="welcome-content" style="flex:1;">
          <div class="welcome-left">\uD83C\uDF3F</div>
          <div class="welcome-right">
            <h2>Somewhere.exe</h2>
            <p class="welcome-subtitle">Somewhere between yesterday and a dream.</p>
            <p class="welcome-msg">\u6B22\u8FCE\u56DE\u6765\u3002\u8FD9\u91CC\u4FDD\u5B58\u7740\u4E00\u4E9B\u8BB0\u5FC6\u3001\u7167\u7247\u3001\u6587\u5B57\u548C\u6CA1\u6709\u5B8C\u6210\u7684\u4E8B\u60C5\u3002<br>\u6709\u4E9B\u8BB0\u5FC6\u6CA1\u6709\u6D88\u5931\uFF0C\u53EA\u662F\u5B89\u9759\u5730\u4FDD\u5B58\u5728\u8FD9\u91CC\u3002</p>
            <p class="welcome-meta">\u7248\u672C 1.0.0 \u00B7 \u6700\u540E\u66F4\u65B0: 2026-10-16</p>
          </div>
        </div>
        <div class="welcome-actions">
          <button class="xp-btn primary" data-nav="article-archive">Open my archive</button>
          <button class="xp-btn" data-action="close-welcome">Explore desktop</button>
          <button class="xp-btn" data-action="close-self">Close</button>
        </div>
      `;

      content.querySelector('[data-nav]').addEventListener('click', () => {
        openApp('article-archive');
      });
      content.querySelectorAll('[data-action]').forEach(btn => {
        btn.addEventListener('click', () => {
          const w = DesktopState.findWindowByApp('welcome');
          if (w) WindowManager.closeWindow(w.id);
        });
      });
    }
  });

  /* ==============================
     Article Archive
     ============================== */
  register({
    id: 'article-archive',
    title: '\u6587\u7AE0\u6863\u6848',
    icon: 'assets/icons/xp/32/folder-documents.png',
    width: 760, height: 520,
    renderContent(body) {
      const categories = ['\u5168\u90E8\u6587\u7AE0','\u65E5\u5E38\u8BB0\u5F55','\u68A6\u5883\u65E5\u5FD7','\u751F\u6D3B\u968F\u7B14','\u6280\u672F\u7B14\u8BB0','\u6444\u5F71\u8BB0\u5F55','\u65C5\u884C\u8BB0\u5FC6','\u672A\u5206\u7C7B'];
      let currentCategory = 0;
      let searchQuery = '';

      const { sidebar, content, statusbar } = createXPChrome(body, {
        address: '\u6587\u7AE0\u6863\u6848',
        statusText: '\u6587\u7AE0\u6863\u6848'
      });

      // Sidebar: Categories as XP Common Tasks panel
      function renderSidebar() {
        sidebar.innerHTML = '';
        const catSection = createSidebarSection('\u6587\u7AE0\u5206\u7C7B',
          categories.map((c, i) => ({
            label: c,
            icon: i === 0 ? 'assets/icons/xp/16/folder-documents.png' : 'assets/icons/xp/16/folder-closed.png',
            app: '',
            catIdx: i
          }))
        );
        sidebar.appendChild(catSection);

        // Category link clicks
        catSection.querySelectorAll('.xp-sidebar-link').forEach((link, i) => {
          link.addEventListener('click', (e) => {
            e.preventDefault();
            currentCategory = i;
            render();
          });
        });
      }

      function render() {
        const filtered = ARTICLES.filter(a => {
          const matchCat = currentCategory === 0 || a.category === categories[currentCategory];
          const matchSearch = !searchQuery ||
            a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            a.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
          return matchCat && matchSearch;
        });

        renderSidebar();
        statusbar.textContent = '\u5171 ' + filtered.length + ' \u7BC7\u6587\u7AE0';

        content.innerHTML = '';

        // Search bar
        const searchBar = document.createElement('div');
        searchBar.style.cssText = 'display:flex;align-items:center;gap:8px;padding:6px 10px;background:#F5F4EF;border-bottom:1px solid #D5D2C5;';
        searchBar.innerHTML =
          '<input type="text" id="archive-search" placeholder="\u641C\u7D22\u6587\u7AE0..." value="' + searchQuery + '" style="flex:1;padding:3px 6px;border:1px solid #7F9DB9;font-size:12px;font-family:var(--font-system);">' +
          '<span style="font-size:11px;color:var(--text-secondary);white-space:nowrap;">\u5171 ' + filtered.length + ' \u7BC7</span>';
        content.appendChild(searchBar);

        // Article list
        const listArea = document.createElement('div');
        listArea.style.cssText = 'overflow:auto;flex:1;';

        if (filtered.length === 0) {
          listArea.innerHTML = '<div style="padding:20px;text-align:center;color:var(--text-secondary);font-size:13px;">\u6CA1\u6709\u627E\u5230\u5339\u914D\u7684\u6587\u7AE0</div>';
        } else {
          const table = document.createElement('table');
          table.style.cssText = 'width:100%;border-collapse:collapse;font-size:12px;';
          table.innerHTML =
            '<thead><tr style="background:#E8ECF4;border-bottom:1px solid #C8C8B8;">' +
              '<th style="text-align:left;padding:4px 8px;font-weight:normal;">\u540D\u79F0</th>' +
              '<th style="text-align:left;padding:4px 8px;font-weight:normal;width:110px;">\u4FEE\u6539\u65E5\u671F</th>' +
              '<th style="text-align:left;padding:4px 8px;font-weight:normal;width:70px;">\u7C7B\u578B</th>' +
              '<th style="text-align:left;padding:4px 8px;font-weight:normal;width:90px;">\u6807\u7B7E</th>' +
            '</tr></thead>' +
            '<tbody>' +
              filtered.map(a => '<tr class="article-row" style="border-bottom:1px solid #E8E8D8;cursor:default;" data-id="' + a.id + '" onmouseover="this.style.background=\'#E8ECF4\'" onmouseout="this.style.background=\'\'">' +
                '<td style="padding:3px 8px;">\uD83D\uDCC4 ' + a.title + '</td>' +
                '<td style="padding:3px 8px;color:var(--text-secondary);">' + a.date + '</td>' +
                '<td style="padding:3px 8px;color:var(--text-secondary);">' + a.category + '</td>' +
                '<td style="padding:3px 8px;color:var(--text-secondary);">' + a.tags.join(', ') + '</td>' +
              '</tr>').join('') +
            '</tbody>';
          listArea.appendChild(table);
        }
        content.appendChild(listArea);

        // Event listeners
        const searchInput = content.querySelector('#archive-search');
        if (searchInput) {
          searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value;
            render();
          });
        }

        content.querySelectorAll('.article-row').forEach(el => {
          el.addEventListener('dblclick', () => {
            const article = ARTICLES.find(a => a.id === el.dataset.id);
            if (article) openArticle(article);
          });
        });
      }

      render();
    }
  });

  /* ==============================
     My Blog
     ============================== */
  register({
    id: 'my-blog', title: '\u6211\u7684\u535A\u5BA2', icon: 'assets/icons/xp/32/notepad-file.png', width: 640, height: 480,
    renderContent(body) {
      const { content, statusbar } = createXPChrome(body, {
        address: '\u6211\u7684\u535A\u5BA2',
        statusText: '\u6211\u7684\u535A\u5BA2'
      });

      statusbar.textContent = '\u6211\u7684\u535A\u5BA2';
      content.style.cssText = 'padding:24px;line-height:1.8;font-size:14px;';
      content.innerHTML =
        '<h2 style="font-size:20px;color:var(--xp-blue);margin-bottom:12px;">\u6211\u7684\u535A\u5BA2</h2>' +
        '<p>\u8FD9\u91CC\u662F Somewhere.exe \u7684\u4E3B\u9875\u3002</p>' +
        '<p style="margin-top:8px;color:var(--text-secondary);">\u4E00\u4E2A\u5B89\u9759\u7684\u89D2\u843D\uFF0C\u4FDD\u5B58\u7740\u8BB0\u5FC6\u3001\u6587\u5B57\u548C\u4E00\u4E9B\u672A\u5B8C\u6210\u7684\u60F3\u6CD5\u3002</p>' +
        '<p style="margin-top:16px;font-size:13px;color:var(--text-secondary);">\u53CC\u51FB\u684C\u9762\u300C\u6587\u7AE0\u6863\u6848\u300D\u56FE\u6807\u6D4F\u89C8\u5168\u90E8\u6587\u7AE0\u3002</p>';
    }
  });

  /* ==============================
     Photo Data
     ============================== */
  const PHOTOS = [
    { id:'p1', title:'蓝天与远山', date:'2024-06-15', category:'天空与草地', mood:'宁静', gradient:'linear-gradient(135deg,#5B9BD5 0%,#8EC8EB 40%,#B9D9A0 70%,#6DAF5C 100%)', desc:'无边的蓝天，远处的山丘像是梦境的边界。' },
    { id:'p2', title:'草地与云层', date:'2024-06-10', category:'天空与草地', mood:'空旷', gradient:'linear-gradient(180deg,#A8D3E8 0%,#C8E6D8 50%,#8DC07A 70%,#4E9144 100%)', desc:'云很低，草很绿，风很轻。' },
    { id:'p3', title:'空旷的学校走廊', date:'2024-05-20', category:'空旷空间', mood:'孤独', gradient:'linear-gradient(90deg,#D5D2C5 0%,#ECE9D8 30%,#F5F4EF 50%,#ECE9D8 70%,#D5D2C5 100%)', desc:'走廊很长，窗户透进来的光把地面分成了明暗相间的条纹。' },
    { id:'p4', title:'旧房间与窗户', date:'2024-05-08', category:'旧数码相机', mood:'怀旧', gradient:'linear-gradient(135deg,#FFF2CC 0%,#ECE9D8 40%,#A8D3E8 70%,#7D93AC 100%)', desc:'窗帘被风吹得轻轻摆动，桌上还有一本没有写完的笔记本。' },
    { id:'p5', title:'黄昏的城市', date:'2024-04-22', category:'日常碎片', mood:'温暖', gradient:'linear-gradient(180deg,#FFB347 0%,#FF8C69 30%,#7D93AC 60%,#303846 100%)', desc:'太阳快要落山了，城市被染成了橙色。' },
    { id:'p6', title:'没有人的街道', date:'2024-04-10', category:'空旷空间', mood:'安静', gradient:'linear-gradient(180deg,#A8D3E8 0%,#D5D2C5 40%,#ECE9D8 60%,#B0ADA0 100%)', desc:'街道很宽，两旁的树把阳光剪成了碎片。' },
    { id:'p7', title:'童年的游乐场', date:'2024-03-18', category:'童年记忆', mood:'怀念', gradient:'linear-gradient(135deg,#B9D9A0 0%,#A7C5B2 30%,#A8D3E8 60%,#7D93AC 100%)', desc:'秋千还在，但已经没有人推了。' },
    { id:'p8', title:'早晨的露水', date:'2024-03-05', category:'日常碎片', mood:'清新', gradient:'linear-gradient(135deg,#E8F4E8 0%,#A8D3E8 40%,#7D93AC 80%,#5B7A96 100%)', desc:'草叶上的露水像小小的镜子，映着整个天空。' },
    { id:'p9', title:'旧数码相机拍的天空', date:'2024-02-14', category:'旧数码相机', mood:'复古', gradient:'linear-gradient(180deg,#5B9BD5 0%,#8EC8EB 30%,#BFE4E8 60%,#FFF2CC 100%)', desc:'用一台十年前的数码相机拍的，画面有点模糊，但很真实。' },
    { id:'p10', title:'雨后的花园', date:'2024-01-28', category:'天空与草地', mood:'平静', gradient:'linear-gradient(135deg,#A7C5B2 0%,#B9D9A0 30%,#A8D3E8 60%,#7D93AC 100%)', desc:'雨刚停，空气里有泥土的味道。' },
    { id:'p11', title:'午夜的灯光', date:'2024-01-10', category:'日常碎片', mood:'孤独', gradient:'linear-gradient(180deg,#303846 0%,#4A5568 30%,#FFB347 60%,#FF8C69 100%)', desc:'路灯把夜晚染成了暖暖的橙色。' },
    { id:'p12', title:'记忆中的房子', date:'2023-12-20', category:'童年记忆', mood:'怀念', gradient:'linear-gradient(135deg,#FFF2CC 0%,#ECE9D8 30%,#A8D3E8 60%,#5B9BD5 100%)', desc:'房子已经不在了，但记忆还在。' },
  ];

  /* ==============================
     Photo Viewer
     ============================== */
  function openPhotoViewer(photo, allPhotos, currentIndex) {
    const appDef = {
      id: 'photo-viewer-' + photo.id,
      title: photo.title,
      icon: 'assets/icons/xp/32/camera.png',
      width: 600, height: 480,
      renderContent(body) {
        let idx = currentIndex;

        const { content, statusbar } = createXPChrome(body, {
          address: photo.title,
          statusText: '照片查看器'
        });

        function renderPhoto() {
          const p = allPhotos[idx];
          statusbar.textContent = p.title + ' (' + (idx+1) + '/' + allPhotos.length + ')';

          content.style.cssText = 'display:flex;flex-direction:column;height:100%;background:#2A2A2A;';
          content.innerHTML =
            '<div style="flex:1;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;">' +
              '<div style="width:100%;height:100%;background:' + p.gradient + ';display:flex;align-items:center;justify-content:center;">' +
                '<div style="font-size:72px;opacity:0.3;color:white;">\uD83C\uDF3F</div>' +
              '</div>' +
              '<button class="xp-btn" id="photo-prev" style="position:absolute;left:12px;top:50%;transform:translateY(-50%);font-size:18px;padding:4px 10px;">\u25C0</button>' +
              '<button class="xp-btn" id="photo-next" style="position:absolute;right:12px;top:50%;transform:translateY(-50%);font-size:18px;padding:4px 10px;">\u25B6</button>' +
            '</div>' +
            '<div style="padding:10px 16px;background:var(--win-bg);border-top:1px solid #D5D2C5;">' +
              '<div style="font-size:13px;font-weight:bold;color:var(--text-primary);">' + p.title + '</div>' +
              '<div style="font-size:11px;color:var(--text-secondary);margin-top:2px;">' + p.date + ' \u00B7 ' + p.category + ' \u00B7 ' + p.mood + '</div>' +
              '<div style="font-size:12px;color:var(--text-secondary);margin-top:4px;font-style:italic;">' + p.desc + '</div>' +
            '</div>';

          content.querySelector('#photo-prev').addEventListener('click', () => {
            idx = (idx - 1 + allPhotos.length) % allPhotos.length;
            renderPhoto();
          });
          content.querySelector('#photo-next').addEventListener('click', () => {
            idx = (idx + 1) % allPhotos.length;
            renderPhoto();
          });
        }
        renderPhoto();

        // Keyboard navigation
        body._keyHandler = (e) => {
          if (e.key === 'ArrowLeft') { idx = (idx - 1 + allPhotos.length) % allPhotos.length; renderPhoto(); }
          if (e.key === 'ArrowRight') { idx = (idx + 1) % allPhotos.length; renderPhoto(); }
          if (e.key === 'Escape') {
            const w = DesktopState.findWindowByApp('photo-viewer-' + photo.id);
            if (w) WindowManager.closeWindow(w.id);
          }
        };
        document.addEventListener('keydown', body._keyHandler);
        body._cleanup = () => { document.removeEventListener('keydown', body._keyHandler); };
      }
    };
    WindowManager.openWindow(appDef);
  }

  /* ==============================
     Photo Memory
     ============================== */
  register({
    id: 'photo-memory', title: '\u7167\u7247\u8BB0\u5FC6', icon: 'assets/icons/xp/32/folder-pictures.png', width: 820, height: 560,
    renderContent(body) {
      const categories = ['\u6240\u6709\u7167\u7247','\u7AE5\u5E74\u8BB0\u5FC6','\u5929\u7A7A\u4E0E\u8349\u5730','\u7A7A\u65F7\u7A7A\u95F4','\u65E5\u5E38\u788E\u7247','\u65E7\u6570\u7801\u76F8\u673A'];
      let currentCat = 0;

      const { sidebar, content, statusbar } = createXPChrome(body, {
        address: '\u7167\u7247\u8BB0\u5FC6',
        statusText: '\u7167\u7247\u8BB0\u5FC6'
      });

      function renderSidebar() {
        sidebar.innerHTML = '';
        const catSection = createSidebarSection('\u7167\u7247\u5206\u7C7B',
          categories.map((c, i) => ({
            label: c,
            icon: i === 0 ? 'assets/icons/xp/16/folder-pictures.png' : 'assets/icons/xp/16/folder-closed.png',
            app: ''
          }))
        );
        sidebar.appendChild(catSection);

        catSection.querySelectorAll('.xp-sidebar-link').forEach((link, i) => {
          link.addEventListener('click', (e) => {
            e.preventDefault();
            currentCat = i;
            render();
          });
        });
      }

      function render() {
        const filtered = currentCat === 0 ? PHOTOS : PHOTOS.filter(p => p.category === categories[currentCat]);

        renderSidebar();
        statusbar.textContent = '\u5171 ' + filtered.length + ' \u5F20\u7167\u7247';

        content.innerHTML = '';
        content.style.cssText = 'overflow:auto;padding:12px;display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:10px;align-content:start;';

        filtered.forEach((p, i) => {
          const thumb = document.createElement('div');
          thumb.className = 'photo-thumb photo-vintage';
          thumb.style.cssText = 'text-align:center;cursor:pointer;padding:4px;border-radius:3px;border:2px solid transparent;';
          thumb.dataset.idx = i;
          thumb.innerHTML =
            '<div style="width:100%;height:90px;background:' + p.gradient + ';border:2px solid #D5D2C5;border-radius:2px;display:flex;align-items:center;justify-content:center;font-size:24px;color:rgba(255,255,255,0.6);">\uD83C\uDF3F</div>' +
            '<div style="font-size:11px;color:var(--text-primary);margin-top:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + p.title + '</div>' +
            '<div style="font-size:10px;color:var(--text-secondary);">' + p.date + '</div>';
          thumb.addEventListener('mouseover', () => { thumb.style.background = '#E8ECF4'; });
          thumb.addEventListener('mouseout', () => { thumb.style.background = ''; });
          thumb.addEventListener('dblclick', () => {
            openPhotoViewer(filtered[i], filtered, i);
          });
          content.appendChild(thumb);
        });
      }

      render();
    }
  });

  /* ==============================
     Music Data
     ============================== */
  const TRACKS = [
    { id:'t1', title:'Somewhere', artist:'Dreamcore Ambient', album:'Memories', duration:'3:42', gradient:'linear-gradient(135deg,#7D93AC,#A8D3E8)' },
    { id:'t2', title:'Blue Sky Dream', artist:'Liminal Sounds', album:'Spaces', duration:'4:15', gradient:'linear-gradient(135deg,#5B9BD5,#BFE4E8)' },
    { id:'t3', title:'Empty Hallway', artist:'Nostalgic Internet', album:'Memories', duration:'2:58', gradient:'linear-gradient(135deg,#D5D2C5,#ECE9D8)' },
    { id:'t4', title:'Old Computer', artist:'Retro Wave', album:'Spaces', duration:'5:03', gradient:'linear-gradient(135deg,#FFF2CC,#A8D3E8)' },
    { id:'t5', title:'Quiet Afternoon', artist:'Dreamcore Ambient', album:'Memories', duration:'3:27', gradient:'linear-gradient(135deg,#A7C5B2,#B9D9A0)' },
    { id:'t6', title:'Faded Photograph', artist:'Liminal Sounds', album:'Spaces', duration:'4:44', gradient:'linear-gradient(135deg,#7D93AC,#5B7A96)' },
    { id:'t7', title:'Midnight Light', artist:'Nostalgic Internet', album:'Memories', duration:'3:56', gradient:'linear-gradient(135deg,#303846,#FFB347)' },
    { id:'t8', title:'Between Yesterday and a Dream', artist:'Dreamcore Ambient', album:'Spaces', duration:'6:12', gradient:'linear-gradient(135deg,#A8D3E8,#B9D9A0,#7D93AC)' },
  ];

  /* ==============================
     Music Collection
     ============================== */
  register({
    id: 'music-collection', title: '\u97F3\u4E50\u6536\u85CF', icon: 'assets/icons/xp/32/folder-music.png', width: 420, height: 460,
    renderContent(body) {
      let currentTrack = 0;
      let isPlaying = false;
      let progress = 0;
      let volume = 70;
      let progressInterval = null;

      const { content, statusbar } = createXPChrome(body, {
        address: '\u97F3\u4E50\u6536\u85CF',
        statusText: '\u97F3\u4E50\u6536\u85CF'
      });

      function parseDuration(dur) {
        const parts = dur.split(':');
        return parseInt(parts[0]) * 60 + parseInt(parts[1]);
      }

      function formatTime(seconds) {
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return m + ':' + String(s).padStart(2, '0');
      }

      function render() {
        const track = TRACKS[currentTrack];
        const totalSec = parseDuration(track.duration);
        const currentSec = Math.floor(progress / 100 * totalSec);

        statusbar.textContent = track.title + ' - ' + track.artist;

        content.innerHTML = '';
        content.style.cssText = 'display:flex;flex-direction:column;height:100%;background:linear-gradient(180deg,#E8ECF4,#F5F4EF);';

        const playerHTML =
          '<div style="padding:16px 16px 8px;display:flex;align-items:center;gap:14px;">' +
            '<div style="width:72px;height:72px;background:' + track.gradient + ';border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:32px;flex-shrink:0;border:2px solid #D5D2C5;">\uD83C\uDFB6</div>' +
            '<div style="flex:1;min-width:0;">' +
              '<div style="font-size:14px;font-weight:bold;color:var(--text-primary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + track.title + '</div>' +
              '<div style="font-size:12px;color:var(--text-secondary);margin-top:2px;">' + track.artist + '</div>' +
              '<div style="font-size:11px;color:var(--text-secondary);margin-top:1px;">\uD83D\uDCC0 ' + track.album + '</div>' +
            '</div>' +
          '</div>' +
          '<div style="padding:4px 16px;">' +
            '<div style="width:100%;height:6px;background:#D5D2C5;border-radius:3px;cursor:pointer;position:relative;" id="progress-bar">' +
              '<div style="width:' + progress + '%;height:100%;background:var(--xp-blue);border-radius:3px;transition:width 0.3s;"></div>' +
            '</div>' +
            '<div style="display:flex;justify-content:space-between;font-size:10px;color:var(--text-secondary);margin-top:2px;">' +
              '<span>' + formatTime(currentSec) + '</span><span>' + track.duration + '</span>' +
            '</div>' +
          '</div>' +
          '<div style="display:flex;justify-content:center;gap:8px;padding:8px 16px;">' +
            '<button class="xp-btn" id="btn-prev" style="font-size:14px;padding:4px 12px;">\u23EE</button>' +
            '<button class="xp-btn primary" id="btn-play" style="font-size:16px;padding:4px 16px;min-width:60px;">' + (isPlaying ? '\u23F8' : '\u25B6') + '</button>' +
            '<button class="xp-btn" id="btn-next" style="font-size:14px;padding:4px 12px;">\u23ED</button>' +
          '</div>' +
          '<div style="padding:4px 16px 8px;display:flex;align-items:center;gap:8px;">' +
            '<span style="font-size:14px;">\uD83D\uDD0A</span>' +
            '<div style="flex:1;height:4px;background:#D5D2C5;border-radius:2px;cursor:pointer;" id="volume-bar">' +
              '<div style="width:' + volume + '%;height:100%;background:var(--xp-blue);border-radius:2px;"></div>' +
            '</div>' +
            '<span style="font-size:10px;color:var(--text-secondary);min-width:28px;">' + volume + '%</span>' +
          '</div>' +
          '<div style="flex:1;border-top:1px solid #D5D2C5;overflow:auto;padding:4px 0;">' +
            '<div style="padding:4px 16px;font-size:11px;font-weight:bold;color:var(--text-secondary);border-bottom:1px solid #E8E8D8;">\u64AD\u653E\u5217\u8868 (' + TRACKS.length + ' \u9996)</div>' +
            TRACKS.map((t, i) =>
              '<div class="track-item" style="padding:5px 16px;font-size:12px;cursor:default;display:flex;align-items:center;gap:8px;' + (i===currentTrack?'background:#316AC5;color:white;':'') + '" data-idx="' + i + '" onmouseover="if(' + i + '!==' + currentTrack + ')this.style.background=\'#E8ECF4\'" onmouseout="if(' + i + '!==' + currentTrack + ')this.style.background=\'\'">' +
                '<span style="font-size:11px;min-width:18px;color:' + (i===currentTrack?'white':'var(--text-secondary)') + ';">' + (i+1) + '.</span>' +
                '<span style="flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + t.title + '</span>' +
                '<span style="font-size:10px;color:' + (i===currentTrack?'rgba(255,255,255,0.7)':'var(--text-secondary)') + ';">' + t.duration + '</span>' +
              '</div>'
            ).join('') +
          '</div>' +
          '<div style="padding:4px 16px 8px;font-size:10px;color:var(--text-secondary);text-align:center;border-top:1px solid #E8E8D8;">\u2014 \u6F14\u793A\u6A21\u5F0F \u00B7 \u672A\u914D\u7F6E\u97F3\u9891\u8D44\u6E90 \u2014</div>';

        content.innerHTML = playerHTML;

        // Play/Pause
        content.querySelector('#btn-play').addEventListener('click', () => {
          isPlaying = !isPlaying;
          if (isPlaying) {
            progressInterval = setInterval(() => {
              progress += 0.5;
              if (progress >= 100) { progress = 0; nextTrack(); }
              render();
            }, 500);
          } else {
            clearInterval(progressInterval);
          }
          render();
        });

        // Prev/Next
        content.querySelector('#btn-prev').addEventListener('click', () => { prevTrack(); });
        content.querySelector('#btn-next').addEventListener('click', () => { nextTrack(); });

        // Progress bar click
        content.querySelector('#progress-bar').addEventListener('click', (e) => {
          const rect = e.target.getBoundingClientRect();
          progress = Math.max(0, Math.min(100, (e.clientX - rect.left) / rect.width * 100));
          render();
        });

        // Volume bar click
        content.querySelector('#volume-bar').addEventListener('click', (e) => {
          const rect = e.target.getBoundingClientRect();
          volume = Math.round(Math.max(0, Math.min(100, (e.clientX - rect.left) / rect.width * 100)));
          render();
        });

        // Playlist item click
        content.querySelectorAll('.track-item').forEach(el => {
          el.addEventListener('dblclick', () => {
            currentTrack = parseInt(el.dataset.idx);
            progress = 0;
            if (!isPlaying) { isPlaying = true; }
            clearInterval(progressInterval);
            progressInterval = setInterval(() => {
              progress += 0.5;
              if (progress >= 100) { progress = 0; nextTrack(); }
              render();
            }, 500);
            render();
          });
        });
      }

      function nextTrack() {
        clearInterval(progressInterval);
        currentTrack = (currentTrack + 1) % TRACKS.length;
        progress = 0;
        render();
        if (isPlaying) {
          progressInterval = setInterval(() => {
            progress += 0.5;
            if (progress >= 100) { progress = 0; nextTrack(); }
            render();
          }, 500);
        }
      }

      function prevTrack() {
        clearInterval(progressInterval);
        if (progress > 10) {
          progress = 0;
        } else {
          currentTrack = (currentTrack - 1 + TRACKS.length) % TRACKS.length;
          progress = 0;
        }
        render();
        if (isPlaying) {
          progressInterval = setInterval(() => {
            progress += 0.5;
            if (progress >= 100) { progress = 0; nextTrack(); }
            render();
          }, 500);
        }
      }

      // Cleanup on close
      body._cleanup = () => { clearInterval(progressInterval); };

      render();
    }
  });

  /* ==============================
     Tech Notes
     ============================== */
  register({
    id: 'tech-notes', title: '\u6280\u672F\u7B14\u8BB0', icon: 'assets/icons/xp/32/notepad-config.png', width: 760, height: 540,
    renderContent(body) {
      const { sidebar, content, statusbar } = createXPChrome(body, {
        address: '\u6280\u672F\u7B14\u8BB0',
        statusText: '\u6280\u672F\u7B14\u8BB0'
      });

      const categories = ['WebGIS','Vue \u524D\u7AEF','Cesium','OpenLayers','\u6570\u636E\u5904\u7406','\u670D\u52A1\u5668\u90E8\u7F72','\u5F00\u53D1\u968F\u7B14'];
      let currentCat = 0;

      function renderSidebar() {
        sidebar.innerHTML = '';
        const catSection = createSidebarSection('\u7B14\u8BB0\u5206\u7C7B',
          categories.map((c, i) => ({
            label: c,
            icon: 'assets/icons/xp/16/notepad-config.png',
            app: ''
          }))
        );
        sidebar.appendChild(catSection);
        catSection.querySelectorAll('.xp-sidebar-link').forEach((link, i) => {
          link.addEventListener('click', (e) => {
            e.preventDefault();
            currentCat = i;
            renderContent_area();
          });
        });
      }

      function renderContent_area() {
        statusbar.textContent = categories[currentCat] + ' \u7B14\u8BB0';
        content.innerHTML =
          '<h3 style="font-size:16px;margin-bottom:12px;">' + categories[currentCat] + ' \u6280\u672F\u7B14\u8BB0</h3>' +
          '<p style="font-size:13px;line-height:1.7;">\u8FD9\u91CC\u5C06\u6536\u5F55 ' + categories[currentCat] + ' \u76F8\u5173\u7684\u6280\u672F\u7B14\u8BB0\u548C\u4EE3\u7801\u7247\u6BB5\u3002</p>' +
          '<pre style="margin-top:12px;padding:12px;background:#F0F0E8;border:1px solid #D5D2C5;font-family:var(--font-mono);font-size:12px;overflow:auto;">// \u793A\u4F8B\u4EE3\u7801\nimport { Map, View } from \'ol\';\nconst map = new Map({ target: \'map\' });</pre>';
      }

      renderSidebar();
      renderContent_area();
    }
  });

  /* ==============================
     About Me
     ============================== */
  register({
    id: 'about-me', title: '\u5173\u4E8E\u6211', icon: 'assets/icons/xp/32/user-key.png', width: 560, height: 500,
    renderContent(body) {
      const { content, statusbar } = createXPChrome(body, {
        address: '\u5173\u4E8E\u6211',
        statusText: '\u5173\u4E8E\u6211'
      });

      statusbar.textContent = '\u5173\u4E8E\u6211';
      content.style.cssText = 'display:flex;flex-direction:column;height:100%;';
      content.innerHTML =
        '<div style="display:flex;gap:20px;padding:20px;background:linear-gradient(135deg,#E8ECF4,#F5F4EF);border-bottom:1px solid #D5D2C5;">' +
          '<div style="width:90px;height:90px;background:linear-gradient(135deg,var(--dream-blue),var(--dream-teal));border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:44px;border:3px solid #D5D2C5;flex-shrink:0;box-shadow:2px 2px 6px rgba(0,0,0,0.15);">\uD83D\uDC64</div>' +
          '<div style="flex:1;">' +
            '<h2 style="font-size:20px;color:var(--xp-blue);margin:0 0 4px;">\u67D0\u4E2A\u4EBA</h2>' +
            '<div style="font-size:12px;color:var(--text-secondary);">\u524D\u7AEF\u5F00\u53D1\u8005 \u00B7 WebGIS \u7231\u597D\u8005 \u00B7 \u68A6\u6838\u7F8E\u5B66\u6536\u85CF\u5BB6</div>' +
            '<div style="font-size:12px;color:var(--text-secondary);margin-top:4px;">\uD83D\uDCCD \u67D0\u4E2A\u5B89\u9759\u7684\u89D2\u843D</div>' +
          '</div>' +
        '</div>' +
        '<div style="flex:1;overflow:auto;padding:20px;font-size:13px;line-height:1.8;">' +
          '<div style="margin-bottom:16px;">' +
            '<h3 style="font-size:14px;color:var(--xp-blue);border-bottom:1px solid #D5D2C5;padding-bottom:4px;margin-bottom:8px;">\uD83D\uDCDD \u7B80\u4ECB</h3>' +
            '<p>\u4E00\u4E2A\u559C\u6B22\u5B89\u9759\u7A7A\u95F4\u7684\u4EBA\u3002\u70ED\u7231\u524D\u7AEF\u5F00\u53D1\uFF0C\u5C24\u5176\u5173\u6CE8 WebGIS \u548C\u5730\u56FE\u53EF\u89C6\u5316\u3002\u559C\u6B22\u5728\u95F2\u6687\u65F6\u5149\u6563\u6B65\u3001\u62CD\u7167\uFF0C\u6536\u96C6\u90A3\u4E9B\u88AB\u9057\u5FD8\u7684\u7F51\u7AD9\u548C\u65E7\u4E92\u8054\u7F51\u7684\u8BB0\u5FC6\u3002</p>' +
            '<p style="margin-top:6px;">\u8FD9\u4E2A\u535A\u5BA2\u5C31\u50CF\u4E00\u53F0\u65E7\u7535\u8111\uFF0C\u4FDD\u5B58\u7740\u4E00\u4E9B\u8BB0\u5FC6\u3001\u6587\u5B57\u548C\u6CA1\u6709\u5B8C\u6210\u7684\u60F3\u6CD5\u3002</p>' +
          '</div>' +
          '<div style="margin-bottom:16px;">' +
            '<h3 style="font-size:14px;color:var(--xp-blue);border-bottom:1px solid #D5D2C5;padding-bottom:4px;margin-bottom:8px;">\uD83D\uDCBB \u6280\u672F\u6808</h3>' +
            '<div style="display:flex;flex-wrap:wrap;gap:6px;">' +
              ['Vue.js','OpenLayers','Cesium','WebGIS','Node.js','TypeScript','PostGIS','Python'].map(t =>
                '<span style="padding:2px 10px;background:#E8ECF4;border:1px solid #C8C8B8;border-radius:2px;font-size:11px;">' + t + '</span>'
              ).join('') +
            '</div>' +
          '</div>' +
          '<div style="margin-bottom:16px;">' +
            '<h3 style="font-size:14px;color:var(--xp-blue);border-bottom:1px solid #D5D2C5;padding-bottom:4px;margin-bottom:8px;">\u2728 \u5174\u8DA3\u7231\u597D</h3>' +
            '<div style="display:flex;flex-wrap:wrap;gap:6px;">' +
              ['\u65E7\u4E92\u8054\u7F51','\u68A6\u6838\u7F8E\u5B66','\u6444\u5F71','\u6563\u6B65','\u97F3\u4E50','\u9605\u8BFB','\u6E38\u620F','\u5929\u6587'].map(t =>
                '<span style="padding:2px 10px;background:#E8ECF4;border:1px solid #C8C8B8;border-radius:2px;font-size:11px;">' + t + '</span>'
              ).join('') +
            '</div>' +
          '</div>' +
          '<div style="margin-bottom:16px;">' +
            '<h3 style="font-size:14px;color:var(--xp-blue);border-bottom:1px solid #D5D2C5;padding-bottom:4px;margin-bottom:8px;">\uD83C\uDFB5 \u559C\u6B22\u7684\u97F3\u4E50</h3>' +
            '<p style="font-size:12px;color:var(--text-secondary);">Dreamcore Ambient \u00B7 Liminal Sounds \u00B7 Nostalgic Internet \u00B7 Retro Wave</p>' +
          '</div>' +
          '<div style="margin-bottom:16px;">' +
            '<h3 style="font-size:14px;color:var(--xp-blue);border-bottom:1px solid #D5D2C5;padding-bottom:4px;margin-bottom:8px;">\uD83C\uDF0D \u559C\u6B22\u7684\u7A7A\u95F4</h3>' +
            '<p style="font-size:12px;color:var(--text-secondary);">\u7A7A\u65F7\u7684\u8D70\u5ECA \u00B7 \u65E5\u843D\u65F6\u7684\u8857\u9053 \u00B7 \u96E8\u540E\u7684\u82B1\u56ED \u00B7 \u65E7\u623F\u95F4\u7684\u7A97\u53E3</p>' +
          '</div>' +
          '<div>' +
            '<h3 style="font-size:14px;color:var(--xp-blue);border-bottom:1px solid #D5D2C5;padding-bottom:4px;margin-bottom:8px;">\uD83D\uDD17 \u94FE\u63A5</h3>' +
            '<div style="font-size:12px;color:var(--text-secondary);line-height:2;">' +
              '<div>\uD83D\uDCE7 Email: somewhere@example.com</div>' +
              '<div>\uD83D\uDCBB GitHub: github.com/somewhere</div>' +
              '<div>\uD83D\uDC26 Twitter: @somewhere_exe</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div style="padding:10px 20px;border-top:1px solid #D5D2C5;background:var(--win-bg);text-align:center;">' +
          '<div style="font-size:12px;font-style:italic;color:var(--dream-gray-blue);">"Somewhere, between memory and reality."</div>' +
        '</div>';
    }
  });

  /* ==============================
     Guestbook
     ============================== */
  register({
    id: 'guestbook', title: '\u7559\u8A00\u677F', icon: 'assets/icons/xp/32/document-edit.png', width: 640, height: 520,
    renderContent(body) {
      const { content, statusbar } = createXPChrome(body, {
        address: '\u7559\u8A00\u677F',
        statusText: '\u7559\u8A00\u677F'
      });

      statusbar.textContent = '\u7559\u8A00\u677F';
      content.style.cssText = 'padding:16px;display:flex;flex-direction:column;height:100%;';
      content.innerHTML =
        '<h3 style="font-size:15px;color:var(--xp-blue);margin-bottom:12px;">\u7559\u8A00\u677F</h3>' +
        '<div style="flex:1;overflow:auto;border:1px solid #D5D2C5;background:white;padding:12px;margin-bottom:12px;">' +
          '<div style="border-bottom:1px solid #E8E8D8;padding-bottom:8px;margin-bottom:8px;">' +
            '<div style="font-size:12px;"><b>\u8BBF\u5BA2A</b> <span style="color:var(--text-secondary);">2024-08-10</span></div>' +
            '<div style="font-size:13px;margin-top:4px;">\u5F88\u6F02\u4EAE\u7684\u7F51\u7AD9\uFF0C\u6709\u90A3\u79CD\u65E7\u7535\u8111\u7684\u611F\u89C9\u3002</div>' +
          '</div>' +
          '<div style="border-bottom:1px solid #E8E8D8;padding-bottom:8px;margin-bottom:8px;">' +
            '<div style="font-size:12px;"><b>\u8DEF\u8FC7\u7684\u4EBA</b> <span style="color:var(--text-secondary);">2024-07-22</span></div>' +
            '<div style="font-size:13px;margin-top:4px;">Somewhere between yesterday and a dream. \u559C\u6B22\u8FD9\u53E5\u8BDD\u3002</div>' +
          '</div>' +
          '<div style="font-size:11px;color:var(--text-secondary);text-align:center;margin-top:12px;">\u2014 \u6F14\u793A\u6570\u636E\uFF0C\u4FDD\u5B58\u5728\u672C\u5730\u6D4F\u89C8\u5668\u4E2D \u2014</div>' +
        '</div>' +
        '<div style="display:flex;gap:6px;flex-wrap:wrap;">' +
          '<input type="text" placeholder="\u6635\u79F0" style="width:120px;padding:3px 6px;border:1px solid #7F9DB9;font-size:12px;font-family:var(--font-system);">' +
          '<input type="text" placeholder="\u5199\u4E0B\u4F60\u7684\u7559\u8A00..." style="flex:1;min-width:200px;padding:3px 6px;border:1px solid #7F9DB9;font-size:12px;font-family:var(--font-system);">' +
          '<button class="xp-btn primary">\u63D0\u4EA4</button>' +
        '</div>';
    }
  });

  /* ==============================
     My Computer
     ============================== */
  register({
    id: 'my-computer', title: '\u6211\u7684\u7535\u8111', icon: 'assets/icons/xp/32/my-computer.png', width: 750, height: 500,
    renderContent(body) {
      body.classList.add('no-scroll');

      // ---- Menu Bar ----
      const menubar = document.createElement('div');
      menubar.className = 'xp-menubar';
      ['\u6587\u4EF6(F)', '\u7F16\u8F91(E)', '\u67E5\u770B(V)', '\u6536\u85CF(A)', '\u5DE5\u5177(T)', '\u5E2E\u52A9(H)'].forEach(m => {
        const s = document.createElement('span');
        s.textContent = m;
        menubar.appendChild(s);
      });

      // ---- Toolbar ----
      const toolbar = document.createElement('div');
      toolbar.className = 'xp-toolbar';

      const tbBtns = [
        { label: '\u540E\u9000', icon: '\u25C0', disabled: true },
        { label: '\u524D\u8FDB', icon: '\u25B6', disabled: true },
        { label: '\u5411\u4E0A', icon: '\u25B2' },
        { sep: true },
        { label: '\u641C\u7D22', icon: '\uD83D\uDD0D' },
        { label: '\u6587\u4EF6\u5939', icon: '\uD83D\uDCC1' },
        { label: '\u89C6\u56FE(V)', icon: '\u25BC' },
      ];
      tbBtns.forEach(b => {
        if (b.sep) {
          const sep = document.createElement('div');
          sep.className = 'xp-toolbar-sep';
          toolbar.appendChild(sep);
          return;
        }
        const btn = document.createElement('button');
        btn.className = 'xp-toolbar-btn' + (b.disabled ? ' disabled' : '');
        btn.innerHTML = '<span>' + b.icon + '</span><span>' + b.label + '</span>';
        toolbar.appendChild(btn);
      });

      // ---- Address Bar ----
      const addrbar = document.createElement('div');
      addrbar.className = 'xp-addressbar';
      addrbar.innerHTML =
        '<span class="xp-addressbar-label">\u5730\u5740(D)</span>' +
        '<input class="xp-addressbar-input" type="text" value="\u6211\u7684\u7535\u8111" readonly>' +
        '<button class="xp-addressbar-go">\u25B6 \u8F6C\u5230(G)</button>';

      // ---- Explorer Body ----
      const explorer = document.createElement('div');
      explorer.className = 'xp-explorer';

      // -- Left Sidebar --
      const sidebar = document.createElement('div');
      sidebar.className = 'xp-sidebar';

      // System Tasks
      const sysSection = document.createElement('div');
      sysSection.className = 'xp-sidebar-section';
      sysSection.innerHTML =
        '<div class="xp-sidebar-header"><span class="arrow">\u25BC</span> \u7CFB\u7EDF\u4EFB\u52A1</div>' +
        '<div class="xp-sidebar-links">' +
          '<a class="xp-sidebar-link" data-app="about-me"><img src="assets/icons/xp/16/computer-tower.png"> \u67E5\u770B\u6709\u5173\u672C\u673A\u7684\u57FA\u672C\u4FE1\u606F</a>' +
          '<a class="xp-sidebar-link" data-app="settings"><img src="assets/icons/xp/16/settings-gear.png"> \u6DFB\u52A0\u6216\u5220\u9664\u7A0B\u5E8F</a>' +
          '<a class="xp-sidebar-link" data-app="settings"><img src="assets/icons/xp/16/folder-settings.png"> \u66F4\u6539\u4E00\u4E2A\u8BBE\u7F6E</a>' +
        '</div>';

      // Other Places
      const otherSection = document.createElement('div');
      otherSection.className = 'xp-sidebar-section';
      otherSection.innerHTML =
        '<div class="xp-sidebar-header"><span class="arrow">\u25BC</span> \u5176\u4ED6\u4F4D\u7F6E</div>' +
        '<div class="xp-sidebar-links">' +
          '<a class="xp-sidebar-link" data-app="article-archive"><img src="assets/icons/xp/16/folder-documents.png"> \u6587\u7AE0\u6863\u6848</a>' +
          '<a class="xp-sidebar-link" data-app="photo-memory"><img src="assets/icons/xp/16/folder-pictures.png"> \u7167\u7247\u8BB0\u5FC6</a>' +
          '<a class="xp-sidebar-link" data-app="music-collection"><img src="assets/icons/xp/16/folder-music.png"> \u97F3\u4E50\u6536\u85CF</a>' +
          '<a class="xp-sidebar-link" data-app="tech-notes"><img src="assets/icons/xp/16/notepad-config.png"> \u6280\u672F\u7B14\u8BB0</a>' +
        '</div>';

      sidebar.append(sysSection, otherSection);

      // -- Right Content Area --
      const content = document.createElement('div');
      content.className = 'xp-content';

      const grid = document.createElement('div');
      grid.className = 'xp-content-grid';

      const items = [
        { icon: 'assets/icons/xp/32/hard-drive.png', label: '\u672C\u5730\u78C1\u76D8 (C:)', app: 'article-archive' },
        { icon: 'assets/icons/xp/32/folder-documents.png', label: '\u6587\u7AE0\u6863\u6848', app: 'article-archive' },
        { icon: 'assets/icons/xp/32/folder-pictures.png', label: '\u7167\u7247\u8BB0\u5FC6', app: 'photo-memory' },
        { icon: 'assets/icons/xp/32/folder-music.png', label: '\u97F3\u4E50\u6536\u85CF', app: 'music-collection' },
        { icon: 'assets/icons/xp/32/notepad-config.png', label: '\u6280\u672F\u7B14\u8BB0', app: 'tech-notes' },
        { icon: 'assets/icons/xp/32/settings-gear.png', label: '\u7CFB\u7EDF\u8BBE\u7F6E', app: 'settings' },
      ];

      items.forEach(item => {
        const el = document.createElement('div');
        el.className = 'xp-content-item';
        el.dataset.app = item.app;
        el.innerHTML = '<img src="' + item.icon + '"><span class="xp-item-label">' + item.label + '</span>';
        el.addEventListener('click', () => {
          grid.querySelectorAll('.xp-content-item').forEach(i => i.classList.remove('selected'));
          el.classList.add('selected');
        });
        el.addEventListener('dblclick', () => {
          openApp(item.app);
        });
        grid.appendChild(el);
      });

      content.appendChild(grid);
      explorer.append(sidebar, content);

      // ---- Status Bar ----
      const statusbar = document.createElement('div');
      statusbar.className = 'window-statusbar';
      statusbar.textContent = '\u6211\u7684\u7535\u8111 \u00B7 ' + items.length + ' \u4E2A\u9879\u76EE';

      // Sidebar link clicks
      sidebar.querySelectorAll('.xp-sidebar-link').forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          if (link.dataset.app) openApp(link.dataset.app);
        });
      });

      // ---- Assemble ----
      body.append(menubar, toolbar, addrbar, explorer, statusbar);
    }
  });

  /* ==============================
     Recycle Bin
     ============================== */
  register({
    id: 'recycle-bin', title: '\u56DE\u6536\u7AD9', icon: 'assets/icons/xp/32/recycle-bin.png', width: 550, height: 380,
    renderContent(body) {
      const files = [
        ['unfinished_dream.txt','C:\\Documents','2024-06-01'],
        ['old_memory.jpg','C:\\Pictures','2024-03-15'],
        ['untitled_note.txt','C:\\Documents','2023-12-20'],
      ];

      const { content, statusbar } = createXPChrome(body, {
        address: '\u56DE\u6536\u7AD9',
        statusText: '\u56DE\u6536\u7AD9'
      });

      statusbar.textContent = '\u56DE\u6536\u7AD9 \u00B7 ' + files.length + ' \u4E2A\u6587\u4EF6';
      content.style.cssText = 'padding:12px;';
      content.innerHTML =
        '<table style="width:100%;border-collapse:collapse;font-size:12px;">' +
          '<thead><tr style="background:#E8ECF4;border-bottom:1px solid #C8C8B8;">' +
            '<th style="text-align:left;padding:4px 8px;font-weight:normal;">\u540D\u79F0</th>' +
            '<th style="text-align:left;padding:4px 8px;font-weight:normal;width:120px;">\u539F\u59CB\u4F4D\u7F6E</th>' +
            '<th style="text-align:left;padding:4px 8px;font-weight:normal;width:110px;">\u5220\u9664\u65E5\u671F</th>' +
          '</tr></thead>' +
          '<tbody>' +
            files.map(r=>'<tr class="recycle-row" style="border-bottom:1px solid #E8E8D8;cursor:default;" data-file="' + r[0] + '" onmouseover="this.style.background=\'#E8ECF4\'" onmouseout="this.style.background=\'\'">' +
              '<td style="padding:3px 8px;">\uD83D\uDCC4 ' + r[0] + '</td>' +
              '<td style="padding:3px 8px;color:var(--text-secondary);">' + r[1] + '</td>' +
              '<td style="padding:3px 8px;color:var(--text-secondary);">' + r[2] + '</td>' +
            '</tr>').join('') +
          '</tbody>' +
        '</table>' +
        '<div style="margin-top:12px;display:flex;gap:8px;">' +
          '<button class="xp-btn" id="recycle-empty">\u6E05\u7A7A\u56DE\u6536\u7AD9</button>' +
          '<button class="xp-btn" id="recycle-restore">\u8FD8\u539F\u6240\u6709\u6587\u4EF6</button>' +
        '</div>' +
        '<div style="margin-top:8px;font-size:11px;color:var(--text-secondary);">\u2014 \u53CC\u51FB\u6587\u4EF6\u67E5\u770B\u8BB0\u5FC6\u5185\u5BB9 \u2014</div>';

      // Double-click file to view memory
      content.querySelectorAll('.recycle-row').forEach(el => {
        el.addEventListener('dblclick', () => {
          Atmosphere.showRecycleMemory(el.dataset.file);
        });
      });

      // Empty recycle bin
      content.querySelector('#recycle-empty').addEventListener('click', () => {
        Atmosphere.playClick();
        Atmosphere.showSystemDialog({
          icon: '\uD83D\uDDD1\uFE0F', title: '\u56DE\u6536\u7AD9',
          text: '\u8FD9\u4E9B\u8BB0\u5FC6\u5DF2\u7ECF\u88AB\u6C38\u4E45\u5220\u9664\u4E86\u3002<br>\u2026\u2026\u5F53\u7136\uFF0C\u53EA\u662F\u6F14\u793A\u6570\u636E\u3002'
        }, 10000);
      });

      // Restore files
      content.querySelector('#recycle-restore').addEventListener('click', () => {
        Atmosphere.playClick();
        Atmosphere.showSystemDialog({
          icon: '\u2705', title: '\u56DE\u6536\u7AD9',
          text: '\u6587\u4EF6\u5DF2\u8FD8\u539F\u3002<br>\u8BB0\u5FC6\u53C8\u56DE\u6765\u4E86\u3002'
        }, 8000);
      });
    }
  });

  /* ==============================
     Settings
     ============================== */
  register({
    id: 'settings', title: '\u7CFB\u7EDF\u8BBE\u7F6E', icon: 'assets/icons/xp/32/settings-gear.png', width: 580, height: 500,
    renderContent(body) {
      const s = DesktopState.state.settings;
      const wps = Atmosphere.WALLPAPERS;

      const { content, statusbar } = createXPChrome(body, {
        address: '\u7CFB\u7EDF\u8BBE\u7F6E',
        statusText: '\u7CFB\u7EDF\u8BBE\u7F6E'
      });

      statusbar.textContent = '\u7CFB\u7EDF\u8BBE\u7F6E';
      content.style.cssText = 'padding:20px;font-size:13px;overflow:auto;height:100%;';

      function render() {
        const cur = DesktopState.state.settings;
        content.innerHTML =
          '<h3 style="font-size:16px;color:var(--xp-blue);margin-bottom:14px;">\u7CFB\u7EDF\u8BBE\u7F6E</h3>' +

          // Wallpaper section
          '<div class="settings-section">' +
            '<h4>\u684C\u9762\u58C1\u7EB8</h4>' +
            '<div style="display:flex;flex-wrap:wrap;gap:10px;">' +
              Object.entries(wps).map(([key, wp]) =>
                '<div style="text-align:center;cursor:pointer;" data-wp="' + key + '">' +
                  '<div class="wallpaper-preview ' + wp.gradient + (cur.wallpaper === key ? ' active' : '') + '"></div>' +
                  '<div style="font-size:11px;margin-top:3px;' + (cur.wallpaper === key ? 'color:var(--xp-blue);font-weight:bold;' : 'color:var(--text-secondary);') + '">' + wp.label + '</div>' +
                '</div>'
              ).join('') +
            '</div>' +
          '</div>' +

          // Toggle section
          '<div class="settings-section">' +
            '<h4>\u663E\u793A\u4E0E\u6548\u679C</h4>' +
            '<div class="settings-row"><input type="checkbox" id="set-anim" ' + (cur.animationsEnabled ? 'checked' : '') + '> <label for="set-anim">\u542F\u7528\u80CC\u666F\u52A8\u753B\u4E0E\u7C92\u5B50\u6548\u679C</label></div>' +
            '<div class="settings-row"><input type="checkbox" id="set-sound" ' + (cur.soundEnabled ? 'checked' : '') + '> <label for="set-sound">\u542F\u7528\u7CFB\u7EDF\u97F3\u6548</label></div>' +
            '<div class="settings-row"><input type="checkbox" id="set-icons" ' + (cur.iconsVisible ? 'checked' : '') + '> <label for="set-icons">\u663E\u793A\u684C\u9762\u56FE\u6807</label></div>' +
          '</div>' +

          // Actions
          '<div style="margin-top:16px;display:flex;gap:8px;">' +
            '<button class="xp-btn" id="set-reset">\u6062\u590D\u9ED8\u8BA4\u5E03\u5C40</button>' +
            '<button class="xp-btn" id="set-clear">\u6E05\u9664\u672C\u5730\u6570\u636E</button>' +
          '</div>' +

          // Info
          '<div style="margin-top:16px;padding:10px;background:#F0F0E8;border:1px solid #D5D2C5;font-size:11px;color:var(--text-secondary);line-height:1.6;">' +
            '\uD83D\uDCA1 \u8BBE\u7F6E\u4F1A\u81EA\u52A8\u4FDD\u5B58\u5728\u6D4F\u89C8\u5668\u672C\u5730\u3002<br>' +
            '\u201C\u6E05\u9664\u672C\u5730\u6570\u636E\u201D\u4F1A\u5220\u9664\u7559\u8A00\u677F\u6F14\u793A\u6570\u636E\u548C\u684C\u9762\u8BBE\u7F6E\u3002' +
          '</div>';

        // Wallpaper click
        content.querySelectorAll('[data-wp]').forEach(el => {
          el.addEventListener('click', () => {
            DesktopState.state.settings.wallpaper = el.dataset.wp;
            Atmosphere.applyWallpaper();
            Atmosphere.saveSettings();
            Atmosphere.playClick();
            render();
          });
        });

        // Animation toggle
        const animCb = content.querySelector('#set-anim');
        if (animCb) animCb.addEventListener('change', () => {
          DesktopState.state.settings.animationsEnabled = animCb.checked;
          Atmosphere.applyAnimations();
          Atmosphere.saveSettings();
        });

        // Sound toggle
        const soundCb = content.querySelector('#set-sound');
        if (soundCb) soundCb.addEventListener('change', () => {
          DesktopState.state.settings.soundEnabled = soundCb.checked;
          Atmosphere.saveSettings();
          // Update tray icon
          const volIcon = document.getElementById('tray-volume');
          if (volIcon) {
            const img = volIcon.querySelector('img');
            if (img) img.src = soundCb.checked ? 'assets/icons/xp/16/volume.png' : 'assets/icons/xp/16/error.png';
          }
          if (soundCb.checked) Atmosphere.playClick();
        });

        // Icons toggle
        const iconCb = content.querySelector('#set-icons');
        if (iconCb) iconCb.addEventListener('change', () => {
          DesktopState.state.settings.iconsVisible = iconCb.checked;
          Atmosphere.applyIconsVisible();
          Atmosphere.saveSettings();
        });

        // Reset layout
        const resetBtn = content.querySelector('#set-reset');
        if (resetBtn) resetBtn.addEventListener('click', () => {
          Atmosphere.resetSettings();
          Atmosphere.playClick();
          render();
        });

        // Clear data
        const clearBtn = content.querySelector('#set-clear');
        if (clearBtn) clearBtn.addEventListener('click', () => {
          try { localStorage.removeItem('somewhere-settings'); } catch(e) {}
          Atmosphere.resetSettings();
          Atmosphere.playClick();
          Atmosphere.showSystemDialog({
            icon: '\u2705', title: '\u64CD\u4F5C\u5B8C\u6210',
            text: '\u672C\u5730\u6570\u636E\u5DF2\u6E05\u9664\u3002<br>\u684C\u9762\u5DF2\u6062\u590D\u9ED8\u8BA4\u8BBE\u7F6E\u3002'
          }, 8000);
          render();
        });
      }

      render();
    }
  });

  return { openApp, register };
})();
