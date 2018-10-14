$(document).ready(function() {
    $('#showmenu').click(function() {
            $('.progress_menu').slideToggle("fast");
            if($('#showmenu').text() == '연재중 만화 펼치기 '){
              $('#showmenu').html('연재중 만화 접기 <span class="oi oi-chevron-bottom"></span>');
            }else if($('#showmenu').text() == '연재중 만화 접기 '){
              $('#showmenu').html('연재중 만화 펼치기 <span class="oi oi-chevron-top"></span>');
            }
    });
});

$(document).ready(function() {
    $('#showmenu2').click(function() {
            $('.progress_menu2').slideToggle("fast");
            if($('#showmenu2').text() == '완결 만화 펼치기 '){
              $('#showmenu2').html('완결 만화 접기 <span class="oi oi-chevron-bottom"></span>');
            }else if($('#showmenu2').text() == '완결 만화 접기 '){
              $('#showmenu2').html('완결 만화 펼치기 <span class="oi oi-chevron-top"></span>');
            }
    });
});

$(document).ready(function() {

    $('#manga_ing_finish1').click(function() {
              $('#manga_ing_finish1').html('연재만화 √');
              $('#manga_ing_finish2').html('완결만화(클릭!)');
              $('#manga_ing_finish1').attr('class','col-6 ongoingmanga1');
              $('#manga_ing_finish1').attr("disabled" , true);
              $('#manga_ing_finish2').attr("disabled" , false);
              $('#manga_ing_finish2').attr('class','col-6 ongoingmanga2');
    });

    $('#manga_ing_finish2').click(function() {
              $('#manga_ing_finish1').html('연재만화(클릭!)');
              $('#manga_ing_finish2').html('완결만화 √');
              $('#manga_ing_finish2').attr('class','col-6 ongoingmanga1');
              $('#manga_ing_finish2').attr("disabled" , true);
              $('#manga_ing_finish1').attr("disabled" , false);
              $('#manga_ing_finish1').attr('class','col-6 ongoingmanga2');
    });

});

//검색 스크롤이동위해
function fnMove(){
        var offset = $('#nav').offset();
        $('html, body').animate({scrollTop : offset.top}, 400);
      }

//반응형웹 ajax 아닌거에 적용할려고ㅋ 업데이트등
$(window).bind('load', function () {
  var win_width = $(window).width();
  if(win_width < 576){
     $('.upmanlayout').prop('class','col-4 upmanlayout');
  }else if(win_width > 576){
     $('.upmanlayout').prop('class','col-sm-2 upmanlayout');
  }
});

  $(window).resize(function(){
    var win_width = $(window).width();
    if(win_width < 576){
       $('.upmanlayout').prop('class','col-4 upmanlayout');
    }else if(win_width > 576){
       $('.upmanlayout').prop('class','col-sm-2 upmanlayout');
    }
  });
