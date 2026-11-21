(() => {
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const sections = $$('.track');
  const hero = $('.hero'), space = $('.space'), people = $('.people'), film = $('.film');
  const profiles = $$('.profile-slide');
  const profileButtons = $$('.profile-controls button');
  const header = $('.header'), nav = $('.chapter-nav');
  const links = $$('.chapter-nav a');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const clamp = x => Math.max(0, Math.min(1, x));
  const range = (p,a,b) => { let x = clamp((p-a)/(b-a)); return x*x*(3-2*x); };
  const lerp = (a,b,t) => a+(b-a)*t;
  const progress = el => clamp(-el.getBoundingClientRect().top / Math.max(1, el.offsetHeight - innerHeight));
  const css = (el,key,val) => el.style.setProperty(key, val);
  const videos = $$('.film video');
  const seekers = videos.map(video => {
    let wanted = 0;
    const seek = () => {
      if (!Number.isFinite(video.duration) || video.duration <= 0 || video.readyState < 1 || video.seeking) return;
      const target = Math.max(0, Math.min(video.duration - .08, wanted));
      if (Math.abs(video.currentTime-target) > .08) { try { video.currentTime=target; } catch (_) {} }
    };
    video.addEventListener('seeked', seek);
    video.addEventListener('loadedmetadata', seek);
    return p => { if (!Number.isFinite(video.duration)) return; wanted=p*video.duration; seek(); };
  });
  const danceVideo = $('.dance-video'), danceScene = $('.dance');
  danceVideo.addEventListener('loadeddata', () => { danceScene.classList.add('has-video'); schedule(); });
  danceVideo.addEventListener('error', () => danceScene.classList.remove('has-video'));
  let scheduled = false;
  function update() {
    scheduled = false;
    const mobile = innerWidth <= 750;
    const h = progress($('#intro'));
    const depart=range(h,.1,.47), zoom=range(h,.18,.8), narrative=range(h,.62,.87);
    css(hero,'--hero-text',1-range(h,.14,.4));
    css(hero,'--hero-text-y',`${-60*range(h,.14,.4)}px`);
    css(hero,'--left-x',`${-innerWidth*(mobile?.26:.20)*depart}px`);
    css(hero,'--right-x',`${innerWidth*(mobile?.2:.19)*depart}px`);
    css(hero,'--side-opacity', .6*(1-range(h,.14,.55)));
    css(hero,'--side-scale', 1+.2*depart);
    css(hero,'--center-x',`${-innerWidth*(mobile?.135:.265)*zoom}px`);
    css(hero,'--center-y',`${(mobile ? innerHeight*.24 : innerHeight*.70)*zoom}px`);
    css(hero,'--center-scale',1+(mobile?2.6:3.5)*zoom);
    css(hero,'--left-blur',`${3-3*range(h,0,.16)+5*range(h,.17,.37)}px`);
    css(hero,'--right-blur',`${3-3*range(h,.1,.28)+5*range(h,.3,.47)}px`);
    css(hero,'--center-blur',`${3*range(h,.03,.11)*(1-range(h,.2,.4))}px`);
    css(hero,'--hero-dark',narrative);
    css(hero,'--hero-transition',range(h,.7,.9));
    css(hero,'--transition-y',`${24*(1-range(h,.7,.9))}px`);
    const s=progress($('#space'));
    css(space,'--space-scale',1+.2*s);
    css(space,'--space-copy',1-range(s,.52,.85)*.6);
    css(space,'--space-y',`${-30*s}px`);
    css(space,'--space-detail',range(s,.28,.6));
    css(space,'--space-detail-y',`${25*(1-range(s,.28,.6))}px`);
    for (const id of ['room','city','oils','music']) {
      const el=$('#'+id), scene=el.querySelector('.pin'), v=progress(el);
      css(scene,'--scene-progress',v);
      css(scene,'--scene-zoom',1 + .28*range(v,.08,.95));
      css(scene,'--scene-shift',`${-45*range(v,.05,.9)}px`);
      css(scene,'--scene-copy-opacity',1-.72*range(v,.58,.92));
      css(scene,'--scene-reveal',range(v,.30,.62));
      css(scene,'--scene-reveal-y',`${30*(1-range(v,.30,.62))}px`);
      css(scene,'--map-scale',.78+.5*range(v,.08,.92));
      css(scene,'--map-rotate',`${-10+20*v}deg`);
      css(scene,'--music-rotate',`${100*v}deg`);
      css(scene,'--wave-scale',.35+.65*range(v,.05,.7));
    }
    const galleryTrack = $('#room-gallery'), galleryProgress = progress(galleryTrack);
    const galleryFocus = Math.min(galleryProgress * 4, 3.9999);
    const galleryPart = Math.floor(galleryFocus), galleryFraction = galleryFocus - galleryPart;
    const gallerySelection = Math.min(3, galleryPart + (galleryPart < 3 ? range(galleryFraction,.62,1) : 0));
    $$('.gallery-slide').forEach((slide,i) => {
      const distance = Math.abs(i-gallerySelection);
      css(slide,'--gallery-opacity',clamp(1-distance));
      css(slide,'--gallery-caption',distance < .5 ? 1 : 0);
      css(slide,'--gallery-zoom',1.02 + .11 * range(galleryFraction,0,1));
      slide.setAttribute('aria-hidden', motion.matches ? 'false' : (distance < .5 ? 'false' : 'true'));
    });
    css(galleryTrack,'--gallery-reveal',range(galleryProgress,0,.18));
    css(galleryTrack,'--gallery-progress',galleryProgress);
    $('.gallery-number').textContent = String(Math.min(4,Math.round(gallerySelection)+1)).padStart(2,'0')+' / 04';
    const q=progress($('#people'));
    const phase=Math.min(q*4,3.9999), part=Math.floor(phase), fraction=phase-part;
    const selection=Math.min(3, part + (part<3 ? range(fraction,.64,1) : 0));
    profiles.forEach((profile,i) => {
      const delta=i-selection, weight=clamp(1-Math.abs(delta));
      css(profile,'--profile-opacity',weight);
      css(profile,'--profile-y',`${delta*55}px`);
      css(profile,'--profile-scale',1+Math.max(0,1-Math.abs(delta))*(.025+.055*range(fraction,0,.7)));
      profile.style.zIndex=String(Math.round(weight*10));
      profile.setAttribute('aria-hidden', motion.matches ? 'false' : (Math.abs(delta)<.5 ? 'false' : 'true'));
    });
    profileButtons.forEach((button,i)=>{const on=Math.round(selection)===i; button.classList.toggle('active',on); button.setAttribute('aria-pressed',String(on));});
    const f=progress($('#film'));
    css(film,'--film-scale',1+range(f,.2,.82)*(mobile?.23:.3));
    css(film,'--film-x',`${-innerWidth*(mobile?.02:.05)*range(f,.2,.82)}px`);
    css(film,'--film-copy',1-range(f,.68,.95)*.65);
    if (!motion.matches && $('#film').getBoundingClientRect().top < innerHeight && $('#film').getBoundingClientRect().bottom > 0) seekers.forEach(seek => seek(f));
    const danceTrack = $('#dance'), danceProgress = progress(danceTrack);
    css(danceScene,'--dance-scale',1 + .1*range(danceProgress,0,1));
    css(danceScene,'--dance-shift',`${-25*range(danceProgress,0,1)}px`);
    const danceVisible = !motion.matches && danceTrack.getBoundingClientRect().top < innerHeight*.8 && danceTrack.getBoundingClientRect().bottom > innerHeight*.2;
    if (danceVisible && danceVideo.paused && danceVideo.readyState >= 2) danceVideo.play().catch(() => {});
    if (!danceVisible && !danceVideo.paused) danceVideo.pause();
    const wordProgress = progress($('#details'));
    const wordFocus = wordProgress * 3;
    $$('.words-line').forEach((line, i) => {
      const distance = Math.abs(i - wordFocus);
      const shade = Math.round(25 + 180 * clamp(distance));
      line.style.setProperty('--word-y', `${(i-wordFocus)*innerHeight*.30}px`);
      line.style.setProperty('--word-color', `rgb(${shade},${shade},${shade})`);
      line.style.setProperty('--word-opacity', Math.max(0, 1-Math.max(0,distance-1.1)*1.5));
    });
    const all = ['intro','space','room','room-gallery','city','oils','music','people','film','dance','programs','details','booking'];
    let active = 'intro';
    all.forEach(id => { const el=document.getElementById(id); if(el.getBoundingClientRect().top <= innerHeight*.5) active=id; });
    links.forEach(a => {const on=a.getAttribute('href')==='#'+active; a.classList.toggle('active',on); if(on)a.setAttribute('aria-current','true'); else a.removeAttribute('aria-current');});
    const dark=['space','room','music','film','dance','booking'].includes(active);
    header.classList.toggle('on-dark', dark); nav.classList.toggle('on-dark', dark);
  }
  function schedule(){ if(!scheduled){ scheduled=true; requestAnimationFrame(update); } }
  profileButtons.forEach((button,i) => button.addEventListener('click', () => { const track=$('#people'); const span=Math.max(1,track.offsetHeight-innerHeight); const progress=i===0 ? 0 : (i+.15)/4; scrollTo({top:track.offsetTop + progress*span, behavior:motion.matches?'auto':'smooth'}); }));
  addEventListener('scroll',schedule,{passive:true}); addEventListener('resize',schedule,{passive:true});
  motion.addEventListener?.('change', schedule); update();
})();
