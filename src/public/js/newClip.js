// vim: set ts=2 sw=2 et tw=80:

const youtubeRegex =
  new RegExp('^(?:(?:(?:https?:\\/\\/)?(?:www\\.)?youtube\\.com\\/watch\\?v=)|' +
             '(?:(?:https?:\\/\\/)?(?:www\\.)?youtu\\.be\\/))' +
             '([\\w+]{11})$', '');
const timeRegex = /^(?:(?:(1?\d):)?([0-5]?\d):)?([0-5]\d)$/;

const urlDom = $('input[name=link]');
const startDom = $('input[name=start]');
const endDom = $('input[name=end]');


function parseTime(timeString) {
  const match = timeRegex.exec(timeString);
  if (!match) return null;
  match.shift();
  return match.reduce((sum, e) => sum * 60 + (e ? parseInt(e) : 0), 0);
}

checkVideo();

function checkVideo() {
  const match = youtubeRegex.exec(urlDom.val());
  const start = parseTime(startDom.val());
  const end = parseTime(endDom.val());
  if (!match || (start !== 0) && !start || !end || start >= end) {
    $('#player').replaceWith($('#player-placeholder').html());
    return;
  }

  console.log(match[1], start, end);
  youtubePlayer(match[1], start, end);
}

urlDom.on('keyup', checkVideo);
startDom.on('keyup', checkVideo);
endDom.on('keyup', checkVideo);

// Form validation code for form
$('.ui.form').form({
  fields: {
    name: {
      identifier: 'link',
      rules: [{ type: 'regExp',
        value: youtubeRegex,
        prompt: 'Please enter a valid Youtube/Vimeo link'
      }]
    },
    start: {
      identifier: 'start',
      rules: [{
        type: 'regExp',
        value: /([0-9])([0-9]):([0-9])([0-9])/,
        prompt: 'Please enter a valid timestamp'
      }]
    },
    end: {
      identifier: 'end',
      rules: [{
        type: 'regExp',
        value: /([0-9])([0-9]):([0-9])([0-9])/,
        prompt: 'Please eneter a valid timestamp'
      }]
    },
    title: {
      identifier: 'title',
      rules: [
        {
          type: 'empty',
          prompt: 'Please enter a title'
        },
        {
          type: 'maxLength[20]',
          prompt: 'Please enter a title shorter than 20 characters'
        }
      ]
    },
    visibility: {
      identifier: 'visibility',
      rules: [{ type: 'empty', prompt: 'Please choose a visibility' }]
    },
  }
});
