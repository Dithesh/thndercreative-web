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
      id: 'toyota', name: 'Toyota Rethink Traffic', client: 'Toyota', year: 2026,
      category: 'Social campaign', cover: img('toyota-ad'), pos: '50% 30%',
      role: ['Campaign concept', 'Key visuals', 'CGI & retouch'],
      deliverables: ['Social posts', 'Carousel series', 'Print ad'],
      desc: 'A wildlife-meets-highway campaign that flips the idea of a traffic jam on its head — buffaloes, elephants and deer become the “traffic” the Fortuner rolls through.',
      media: [panel('#e9e4da', 'toyota-ad', 'toyota-1'), panel('#1d2a22', 'toyota-2', 'toyota-3', 'toyota-4')],
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
      id: 'indigo-saver', name: 'goIndiGo Saver Fare', client: 'IndiGo', year: 2026,
      category: 'Digital campaign', cover: img('indigo-carry'), pos: '50% 35%',
      role: ['Campaign design', 'Web banners', 'Social'],
      deliverables: ['Website hero banners', 'Social posts', 'Media creatives'],
      desc: 'A digital campaign system for goIndiGo — web banners and social creatives that make flying feel like a holiday already.',
      media: [full('indigo-wide'), panel('#0f1a5c', 'indigo-carry', 'indigo-banner'), panel('#e8ecff', 'indigo-honeymoon', 'indigo-media')],
    },
    {
      id: 'vrindaam-surya', name: 'Vrindaam Surya Aikyam', client: 'Vrindaam', year: 2025,
      category: 'Packaging design', cover: img('vrindaam-surya'), pos: '50% 50%',
      role: ['Packaging design', 'Illustration', 'Print production'],
      deliverables: ['Gift box', 'Labels', 'Illustration system'],
      desc: 'Ayurvedic packaging rooted in Indian folk art — a sun-led illustration system across boxes, gift kits and labels.',
      media: [panel('#efe3cf', 'vrindaam-surya'), panel('#2c3b2a', 'vrindaam-vanam')],
    },
    {
      id: 'sushupti', name: 'Sushupti Sleep Reels', client: 'Sushupti', year: 2026,
      category: 'Video & reels', cover: img('sushupti-1'), pos: '50% 25%', video: 'assets/video/sushupti-1.mp4',
      role: ['Script & direction', 'Shoot', 'Edit & grade'],
      deliverables: ['3 × 30s reels', 'Cut-downs', 'Thumbnails'],
      desc: 'A series of short-form reels on rest and recovery — scripted, shot and cut for the vertical screen.',
      media: [panel('#d9d2c8', vid('sushupti-1', 'sushupti-1'), vid('sushupti-2', 'sushupti-2'), vid('sushupti-3', 'sushupti-3'))],
    },
    {
      id: 'chings', name: 'Ching’s Chilli Oil', client: 'Ching’s Secret', year: 2025,
      category: 'Key visual', cover: img('chings'), pos: '50% 50%',
      role: ['Art direction', 'Food CGI', 'Composition'],
      deliverables: ['Key visual', 'Social adaptations'],
      desc: 'A fiery key visual for Ching’s Chilli Oil — heat, splash and spice in one frame.',
      media: [panel('#5c0d08', 'chings')],
    },
    {
      id: 'brand', name: 'Thunder Creatives Identity', client: 'Thunder Creatives', year: 2025,
      category: 'Logo & brand identity', cover: img('brand-red'), pos: '50% 50%',
      role: ['Naming', 'Logo design', 'Identity system'],
      deliverables: ['Wordmark', 'Bolt symbol', 'Stationery'],
      desc: 'Our own storm. A wordmark split by a lightning bolt — loud, red and impossible to scroll past.',
      media: [full('brand-red'), full('brand-black'), full('brand-mark'), full('brand-paper'), panel('#f1efe9', 'brand-letterhead')],
    },
    {
      id: 'jaipore', name: 'Jaipore Perfume', client: 'Jaipore', year: 2025,
      category: 'Packaging design', cover: img('jaipore'), pos: '50% 50%',
      role: ['Packaging design', 'Label', 'Product render'],
      deliverables: ['Bottle label', 'Outer carton', 'Key visual'],
      desc: 'A sunrise-gold perfume pack that carries the warmth of Jaipur onto the shelf.',
      media: [panel('#f2e2c4', 'jaipore')],
    },
    {
      id: 'indigo-film', name: 'goIndiGo Destinations', client: 'IndiGo', year: 2026,
      category: 'Video', cover: img('indigo-dest'), pos: '50% 50%', video: 'assets/video/indigo-dest.mp4',
      role: ['Motion design', '3D', 'Edit'],
      deliverables: ['Destination film', 'Social cut-downs'],
      desc: 'A window-seat film that flies you from one international destination to the next — built for web and social.',
      media: [full(vid('indigo-dest', 'indigo-dest')), panel('#0d0f2e', 'indigo-dest')],
    },
    {
      id: 'vrindaam-oils', name: 'Vrindaam Ayurvedic Oils', client: 'Vrindaam', year: 2026,
      category: 'Content production', cover: img('vrindaam-oils'), pos: '50% 50%',
      role: ['Set design', 'Product shoot', 'Post-production'],
      deliverables: ['Hero images', 'Product range posts'],
      desc: 'Studio-grade product visuals for Vrindaam’s oil range — lush, natural sets that let each bottle breathe.',
      media: [full('vrindaam-oils'), panel('#e7dccb', 'vrindaam-adiyoga', 'vrindaam-kailash'), panel('#3a2a1c', 'vrindaam-awadh', 'vrindaam-chandrakanti')],
    },
    {
      id: 'vi', name: 'Vi Spiral Notebook', client: 'Vi', year: 2025,
      category: 'Print & merchandise', cover: img('vi-notebook'), pos: '50% 50%',
      role: ['Illustration', 'Print design'],
      deliverables: ['Notebook cover', 'Inside pages'],
      desc: 'An everyday-inspiration notebook for the classroom, illustrated with icons who shaped India.',
      media: [panel('#f6d7e1', 'vi-notebook')],
    },
    {
      id: 'vrindaam-skin', name: 'Vrindaam Skincare CGI', client: 'Vrindaam', year: 2026,
      category: 'Product CGI', cover: img('vrindaam-kit'), pos: '50% 50%',
      role: ['Hyper-real CGI', 'Banner design'],
      deliverables: ['Product renders', 'Website banners'],
      desc: 'Hyper-realistic product renders and launch banners for Vrindaam’s skincare range — serums, lip care and more.',
      media: [full('vrindaam-kit'), full('lipcare-banner'), panel('#ead7cf', 'lipcare-1', 'lipcare-2')],
    },
    {
      id: 'melorra', name: 'Melorra Range Focussed', client: 'Melorra', year: 2026,
      category: 'Performance ads', cover: img('melorra'), pos: '50% 50%',
      role: ['Ad design', 'Retouch'],
      deliverables: ['Social ads', 'Carousel'],
      desc: 'Crisp, geometric ad creatives that let Melorra’s diamonds do the talking.',
      media: [panel('#e9e6f2', 'melorra')],
    },
    {
      id: 'annual-report', name: 'Vistaar Annual Report', client: 'Vistaar Finance', year: 2026,
      category: 'Editorial design', cover: img('annual-report'), pos: '50% 40%',
      role: ['Editorial design', 'Infographics', 'Cover art'],
      deliverables: ['Annual report', 'Cover'],
      desc: '“Symphony of Progress” — a corporate annual report with an editorial rhythm: data, story and design in step.',
      media: [panel('#cfe0f2', 'annual-report', 'annual-report-2')],
    },
  ];
})();
