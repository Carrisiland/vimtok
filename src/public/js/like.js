function likeStart() {

  $(document).ready(function(){

    $(".likeUp").on('click', function(e) {
      // console.log(e.target.attr('id'));
      e.preventDefault();
      likeUp(jQuery(this).attr('id'));
    });

    $(".likeDown").on('click', function(e) {
      // console.log(e.target.attr('id'));
      e.preventDefault();
      likeDown(jQuery(this).attr('id'));
    });


    $(".likeUpComment").on('click', function(e) {
      // console.log(e.target.attr('id'));
      e.preventDefault();
      likeUpComment(jQuery(this).attr('id'));
    });

    $(".likeDownComment").on('click', function(e) {
      // console.log(e.target.attr('id'));
      e.preventDefault();
      likeDownComment(jQuery(this).attr('id'));
    });


  });

}


async function likeUp(id) {

  let realId = id.substr(0, id.length - 6)
  let likeDownId = realId + "likedown";
  let res = await doJSONRequest('PATCH', '/like/post/up/'+realId, undefined, {});

  let buttonUp = document.getElementById(id);
  let numUp = buttonUp.querySelector('.num');
  numUp.innerHTML = res.upvotes;


  let buttonDown = document.getElementById(likeDownId);
  let numDown = buttonDown.querySelector('.num');
  numDown.innerHTML = res.downvotes;

}

async function likeDown(id) {

  let realId = id.substr(0, id.length - 8);
  let likeUpId = realId + "likeup";
  let res = await doJSONRequest('PATCH', '/like/post/down/'+realId, undefined, {});

  let buttonDown = document.getElementById(id);
  let numDown = buttonDown.querySelector('.num');
  numDown.innerHTML = res.downvotes;

  let buttonUp = document.getElementById(likeUpId);
  let numUp = buttonUp.querySelector('.num');
  numUp.innerHTML = res.upvotes;
}



async function likeUpComment(id) {

  console.log(id);

  let realId = id.substr(0, id.length - 6)
  let likeDownId = realId + "likedown";
  let res = await doJSONRequest('PATCH', '/like/comment/up/'+realId, undefined, {});


  let buttonUp = document.getElementById(id);
  let numUp = buttonUp.querySelector('.num');
  numUp.innerHTML = res.upvotes;


  let buttonDown = document.getElementById(likeDownId);
  let numDown = buttonDown.querySelector('.num');
  numDown.innerHTML = res.downvotes;
}


async function likeDownComment(id) {

  let realId = id.substr(0, id.length - 8);
  let likeUpId = realId + "likeup";
  let res = await doJSONRequest('PATCH', '/like/comment/down/'+realId, undefined, {});

  let buttonDown = document.getElementById(id);
  let numDown = buttonDown.querySelector('.num');
  numDown.innerHTML = res.downvotes;

  let buttonUp = document.getElementById(likeUpId);
  let numUp = buttonUp.querySelector('.num');
  numUp.innerHTML = res.upvotes;
}
