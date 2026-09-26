/*
  catalog.js — data/catalog.json を読み込み、リリース一覧を描画する。
  使い方:
    <ul class="song-list" id="song-list"
        data-catalog="data/catalog.json"
        data-target="#song-list"
        data-artist=""      置き場所からの相対パス。artist_slug を指定すると絞り込む（空なら全件）
        data-limit="10"
        data-artist-link="artists/%s/"  リンク先テンプレート（%sをslugに置換。トップページ用）
    ></ul>
    <script src="assets/catalog.js" defer></script>
  日付が新しい順に並べる。audio_url が空の曲は「音源・映像は準備中です」のプレースホルダーを出す。
*/
(function(){
  'use strict';

  function escapeHtml(s){
    return String(s).replace(/[&<>"']/g, function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  }

  function renderSong(song, opts){
    var lyrics = (song.lyrics_excerpt || []).map(escapeHtml).join('\n');
    var hasMedia = !!(song.audio_url || song.video_url);
    var statusLabel = hasMedia ? '公開中' : '音源・映像 準備中';
    var artistLink = '';
    if (opts.showArtistLink && opts.artistLinkTemplate) {
      var href = opts.artistLinkTemplate.replace('%s', song.artist_slug);
      artistLink = '<p class="s-artist"><a href="' + href + '">' + escapeHtml(song.artist_name) + '</a></p>';
    }
    var dayLabel = song.day ? ('Day ' + String(song.day).padStart(3, '0')) : '';
    return (
      '<li class="song-card">' +
        '<div class="s-day">' + escapeHtml(song.date || '') + (dayLabel ? '<br>' + escapeHtml(dayLabel) : '') + '</div>' +
        '<div>' +
          '<p class="s-title">' + escapeHtml(song.title) +
            (song.title_reading ? '<span class="section-note">（' + escapeHtml(song.title_reading) + '）</span>' : '') +
          '</p>' +
          artistLink +
          '<p class="s-lyrics">' + lyrics + '</p>' +
        '</div>' +
        '<div class="s-status">' + statusLabel + '</div>' +
      '</li>'
    );
  }

  function init(container){
    var catalogPath = container.getAttribute('data-catalog') || 'data/catalog.json';
    var artistFilter = container.getAttribute('data-artist') || '';
    var limit = parseInt(container.getAttribute('data-limit') || '0', 10);
    var artistLinkTemplate = container.getAttribute('data-artist-link') || '';
    var showArtistLink = !artistFilter;

    fetch(catalogPath)
      .then(function(res){ return res.json(); })
      .then(function(data){
        var songs = (data.songs || []).slice();
        if (artistFilter) {
          songs = songs.filter(function(s){ return s.artist_slug === artistFilter; });
        }
        songs.sort(function(a, b){ return (b.date || '').localeCompare(a.date || ''); });
        if (limit > 0) songs = songs.slice(0, limit);

        if (!songs.length) {
          container.innerHTML = '<li class="song-card"><div></div><div><p class="s-lyrics">まだ曲がありません。まもなく最初の曲を届けます。</p></div><div></div></li>';
          return;
        }
        container.innerHTML = songs.map(function(s){
          return renderSong(s, { showArtistLink: showArtistLink, artistLinkTemplate: artistLinkTemplate });
        }).join('');
        if (window.insertPhraseBreaks) window.insertPhraseBreaks(container);
      })
      .catch(function(err){
        container.innerHTML = '<li class="song-card"><div></div><div><p class="s-lyrics">リリース一覧を読み込めませんでした。</p></div><div></div></li>';
        console.error('catalog.js load error:', err);
      });
  }

  document.querySelectorAll('[data-catalog]').forEach(init);
})();
