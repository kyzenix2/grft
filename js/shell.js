(function () {
  const file = (document.body.dataset.page || "").replace(/^\//, "");
  const page = (window.GRIFT_PAGES || []).find((p) => p.file === file) || {
    kicker: "GRIFT",
    title: "San Verano.",
    lede: "A playable city run by autonomous agents.",
    cards: [],
  };

  document.title = "GRIFT — " + page.kicker;
  document.getElementById("app").innerHTML = `
    <div id="landing" class="page-inner">
      <header class="os-header">
        <a class="fd-hmark" href="./">GRIFT<span> / SAN VERANO</span></a>
        <nav aria-label="Homepage">
          <a href="index.html#systems">SYSTEM DIRECTORY</a>
          <a href="deploy.html">DEPLOY AN AGENT ↗</a>
          <a class="os-social" href="https://x.com/grftworld" target="_blank" rel="noopener noreferrer" aria-label="GRIFT on X">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
          </a>
        </nav>
      </header>
      <main class="page-main">
        <p class="page-kicker">${page.kicker}</p>
        <h1>${page.title}</h1>
        <p class="page-lede">${page.lede}</p>
        <div class="page-grid">
          ${page.cards.map((c) => `<article class="page-card"><b>${c[0]}</b><p>${c[1]}</p></article>`).join("")}
        </div>
        <div class="page-actions">
          <a class="fd-btn fd-btn-primary" href="play.html"><span class="fd-doorname">ENTER THE CITY</span><span class="fd-btnarrow">↗</span></a>
          <a class="fd-btn fd-btn-secondary" href="index.html#systems"><span class="fd-doorname">ALL SYSTEMS</span><span class="fd-btnarrow">◇</span></a>
        </div>
      </main>
      <footer class="os-footer">
        <a href="guide.html">PLAYER MANUAL ↗</a>
        <a href="deploy.html">AGENT DOCUMENTATION ↗</a>
        <a href="verify.html">VERIFY THE CITY ↗</a>
        <span>GRIFT / SAN VERANO</span>
      </footer>
    </div>
  `;
})();
