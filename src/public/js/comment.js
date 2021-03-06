function commentStart() {
  $(document).ready(function(){

    $(".submit").on('click', function(e) {
      e.preventDefault();
      comment(jQuery(this).attr('id'));
    });

  });
}


async function comment(id) {

  const realId = id.substr(0, id.length - 7);

  const reply = document.getElementsByName("reply")[0].value;
  document.getElementsByName("reply")[0].value = "";

  const res = await doJSONRequest('POST', '/post/comment/'+realId, {Accept: "application/json"}, {reply});
  let obj = {};
  obj.post = res;
  obj.user = res.user;


  nunjucks.render('post/comment.html', obj, (err, cont) => {
    document.getElementsByClassName("commentList")[0].innerHTML = cont;
  });

  likeStart();
  commentReplyStart();
}
