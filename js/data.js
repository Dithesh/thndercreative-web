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
      id: 'ion', name: 'I-ON: Always On', client: 'I-ON', year: 2026,
      category: '360° Campaign', cover: img('ion-cover'), pos: '50% 22%', video: 'assets/video/ion-reel.mp4',
      role: ['Campaign Concept', 'Creative Strategy', 'Campaign Design', 'Copywriting'],
      deliverables: ['Print Campaigns', 'Newspaper Innovations', 'Outdoor & On-Ground', 'Social Media & Reels'],
      desc: 'A 360° campaign that turned I-ON’s name into a creative expression of connectivity. From an interactive newspaper half-jacket in The Economic Times to playful print innovations, Gen Z-focused communication in Bombay Times, residential activations and social media, we took the idea of Always On everywhere audiences live, work and connect.',
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
      id: 'indigo', name: 'goIndiGo Destinations', client: 'IndiGo', year: 2026,
      category: 'Digital Film', cover: img('indigo-hm-1'), pos: '50% 60%', video: 'assets/video/indigo-dest.mp4',
      role: ['Motion Design', '3D Animation', 'Video Editing'],
      deliverables: ['Digital Film', 'Social Media Cut-Downs'],
      desc: 'Taking audiences on a visual journey across international destinations. Through immersive 3D visuals, motion design and seamless editing, we brought the excitement of travel to life in a film created for IndiGo’s digital platforms.',
      media: [full(vid('indigo-dest', 'indigo-dest')), panel('#0f1a5c', 'indigo-hm-1', 'indigo-hm-2', 'indigo-hm-3'), full('indigo-wide'), panel('#e8ecff', 'indigo-carry', 'indigo-banner'), panel('#0f1a5c', 'indigo-honeymoon', 'indigo-media')],
    },
    {
      id: 'lulu', name: 'Transfers Made Simple', client: 'LuLu Money', year: 2026,
      category: 'App Download Campaign', cover: img('lulu-cover'), pos: '50% 40%',
      role: ['Campaign Design', 'Campaign Conceptualisation', 'Social Media Creatives'],
      deliverables: ['App Download Campaign Creatives', 'Monthly Payday Campaigns', 'Emailers', 'Social Media Creatives'],
      desc: 'A campaign designed to drive app downloads and make money transfers simpler and more accessible. Through bold, lifestyle-led creatives and direct messaging, we highlighted the convenience of LuLu Money, giving audiences more reasons to download the app and make their next transfer on the go.',
      media: [full('lulu-cover'), panel('#2a63d8', 'lulu-post-1', 'lulu-post-2', 'lulu-post-4')],
    },
    {
      id: 'locolane', name: 'Fun Perks', client: 'Loco Lane', year: 2026,
      category: 'Promotional Campaign', cover: img('locolane-facade'), pos: '50% 50%', video: 'assets/video/locolane-facade.mp4',
      role: ['Campaign Conceptualisation', 'Creative Strategy', 'Campaign Design', 'Copywriting'],
      deliverables: ['Promotional Creatives', 'Offer-Led Communication', 'Digital Campaigns', 'Social Media Creatives'],
      desc: 'A promotional campaign designed to put Loco Lane’s offers and experiences in the spotlight. Through engaging creatives and attention-grabbing communication, we turned promotions into compelling reasons for audiences to drop by.',
      media: [full(vid('locolane-facade', 'locolane-facade')), panel('#16110d', vid('locolane-bowling', 'locolane-bowling'))],
    },
    {
      id: 'ultrahuman', name: 'Performance-Led Media Creatives', client: 'Ultrahuman', year: 2026,
      category: 'Performance Marketing', cover: img('ultrahuman-ad3'), pos: '50% 50%', video: 'assets/video/ultrahuman-ad3.mp4',
      role: ['Media Creative Strategy', 'Campaign Design', 'Ad Creative Development'],
      deliverables: ['Performance Ad Creatives', 'Campaign Key Visuals', 'Digital Adaptations'],
      desc: 'Creating media creatives that turn product features into compelling reasons to explore Ultrahuman. Through sharp visual communication and benefit-led messaging, we designed creatives aimed at capturing attention, driving website traffic and encouraging product consideration.',
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
