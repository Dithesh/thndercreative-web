// All site content lives here — edit projects without touching layout code.
//
// media blocks (rendered top-to-bottom inside the project popup):
//   full('name')                 → one image, full column width (best for landscape images)
//   panel('#bg', 'a', 'b', ...)  → images side by side on a coloured panel, all at equal height
//   vid('file', 'poster')        → a muted, looping video (use inside panel() or on its own)
// Image names refer to assets/img/<name>.jpg, videos to assets/video/<file>.mp4
(function () {
  const img = (n) => `assets/img/${n}.jpg`;
  const vid = (file, poster) => ({ video: `assets/video/${file}.mp4`, poster: img(poster) });
  const full = (item) => ({ type: 'full', items: [typeof item === 'string' ? img(item) : item] });
  const panel = (bg, ...items) => ({ type: 'panel', bg, items: items.map((i) => (typeof i === 'string' ? img(i) : i)) });

  window.TC_PROJECTS = [
    {
      id: 'ion', name: 'I-ON Always On', client: 'I-ON Broadband', year: 2026,
      category: 'Brand campaign', cover: img('ion-cover'), pos: '50% 22%', video: 'assets/video/ion-reel.mp4',
      role: ['Campaign concept', 'Art direction', 'Social & print design'],
      deliverables: ['Key visual', 'Print half-page ad', 'Social posts', 'Reel'],
      desc: 'A loud, orange-first campaign for I-ON Broadband — “A lot can happen with a good connecti-on” — carried across print, social posts and reels.',
      media: [full('ion-halfpage'), panel('#fbe4d8', 'ion-cover', 'ion-361'), panel('#1c1c1c', vid('ion-reel', 'ion-reel'), 'ion-post-04', 'ion-post-05')],
    },
    {
      id: 'hangyo', name: 'Hangyo Gourmet Select', client: 'Hangyo Ice Creams', year: 2026,
      category: 'Social media creatives', cover: img('hangyo-hazelnut'), pos: '50% 45%',
      role: ['Art direction', 'Product CGI', 'Social design'],
      deliverables: ['Product posts', 'Festive creatives', 'Delivery-app banners'],
      desc: 'Indulgent, colour-drenched social creatives for Hangyo’s gourmet range — from Berry & Cream bars to Diwali specials.',
      media: [panel('#f3d9dc', 'hangyo-main', 'hangyo-hazelnut'), panel('#2b0f1d', 'hangyo-berry', 'hangyo-diwali')],
    },
    {
      id: 'indigo', name: 'IndiGo Honeymoon Travellers', client: 'IndiGo', year: 2026,
      category: 'Digital campaign', cover: img('indigo-hm-1'), pos: '50% 60%', video: 'assets/video/indigo-dest.mp4',
      role: ['Campaign design', 'Social', 'Motion design'],
      deliverables: ['Social creatives', 'Website hero banners', 'Destination film'],
      desc: '“Begin forever, beautifully.” Romantic-destination creatives for couples flying goIndiGo — Srinagar, Goa and beyond — alongside web banners and a window-seat destination film.',
      media: [panel('#0f1a5c', 'indigo-hm-1', 'indigo-hm-2', 'indigo-hm-3'), full(vid('indigo-dest', 'indigo-dest')), full('indigo-wide'), panel('#e8ecff', 'indigo-carry', 'indigo-banner'), panel('#0f1a5c', 'indigo-honeymoon', 'indigo-media')],
    },
    {
      id: 'lulu', name: 'LuLu Money App', client: 'LuLu Money', year: 2026,
      category: 'Social media creatives', cover: img('lulu-cover'), pos: '50% 40%',
      role: ['Art direction', 'Social design', 'Copy'],
      deliverables: ['Key visual', 'App promotion posts'],
      desc: '“Your money transfer, right on your phone.” Bright, people-first creatives that make sending money home feel effortless.',
      media: [full('lulu-cover'), panel('#2a63d8', 'lulu-post-1', 'lulu-post-2', 'lulu-post-4')],
    },
    {
      id: 'locolane', name: 'Loco Lane Brand Film', client: 'Loco Lane', year: 2026,
      category: 'Video', cover: img('locolane-facade'), pos: '50% 50%', video: 'assets/video/locolane-facade.mp4',
      role: ['Direction', 'Shoot', 'Edit & motion'],
      deliverables: ['Front-facade brand film', 'Social reels'],
      desc: 'Bowling, craft cocktails and food — a wide-format brand film for Loco Lane’s front facade, plus a “Midweek Madness” reel for social.',
      media: [full(vid('locolane-facade', 'locolane-facade')), panel('#16110d', vid('locolane-bowling', 'locolane-bowling'))],
    },
    {
      id: 'ultrahuman', name: 'Ultrahuman Ring Air', client: 'Ultrahuman', year: 2026,
      category: 'Product CGI & motion', cover: img('ultrahuman-ad3'), pos: '50% 50%', video: 'assets/video/ultrahuman-ad3.mp4',
      role: ['3D product animation', 'Motion design', 'Edit'],
      deliverables: ['3 × video ads'],
      desc: '“Don’t just track your health. Understand it.” A set of CGI product ads for the Ultrahuman Ring Air.',
      media: [full(vid('ultrahuman-ad3', 'ultrahuman-ad3')), panel('#efeeea', vid('ultrahuman-ad1', 'ultrahuman-ad1'), vid('ultrahuman-ad2', 'ultrahuman-ad2'))],
    },
    {
      id: 'vrindaam', name: 'Vrindaam Organics', client: 'Vrindaam', year: 2026,
      category: 'Product photography', cover: img('vrindaam-cover'), pos: '50% 50%',
      role: ['Set design', 'Product shoot', 'Post-production'],
      deliverables: ['Gift-box hero', 'Product range images'],
      desc: 'Natural, ingredient-led product sets for Vrindaam Organics’ fragrance range — Braj, Ojus and Jaypore.',
      media: [full('vrindaam-cover'), panel('#e9e1d4', 'vrindaam-braj', 'vrindaam-ojus'), panel('#3a2a1c', 'vrindaam-jaypore')],
    },
  ];
})();
