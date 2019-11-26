// 2. This code loads the IFrame Player API code asynchronously.

  var tag = document.createElement('script');
  tag.src = "https://www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  // 3. This function creates an <iframe> (and YouTube player)
  //    after the API code downloads.
  var startTime = 85;
  var endTime = 95;
  var duration = endTime - startTime;
  var player;

  function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
      height: '480',
      width: '720',
      videoId: 'eCPLDqTosGA',
      events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange
      }
    });
  }

  // 4. The API will call this function when the video player is ready.
  function onPlayerReady(event) {
    player.seekTo(startTime);
    event.target.playVideo();
  }

  // 5. The API calls this function when the player's state changes.
  //    The function indicates that when playing a video (state=1),
  //    the player should play for six seconds and then stop.
  var done = false;
  function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING && !done) {
      setTimeout(stopVideo, duration*1000);
      done = true;
    }
  }
  function stopVideo() {
    player.stopVideo();
  }
