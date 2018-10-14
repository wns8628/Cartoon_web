  //이건 페이지로드시 바로실행
  function main_ajax_nowload(){
    manga_ajax_func('manga_ing_ajax');                                           //
    //연재중바 표시때문에
    manga_ajax_func_bar('manga_ing_ajax','#floats1');
    //완결바 표시
    manga_ajax_func_bar('manga_finish_ajax','#floats2');
  }

  //연재중 만화표시
  $('#manga_ing_finish1').click(function(){                                     //
      manga_ajax_func('manga_ing_ajax');
    });
  // 완결 만화표시
  $('#manga_ing_finish2').click(function(){
      manga_ajax_func('manga_finish_ajax');
    });

  //만화검색
  $('#search_button').click(function(){
    manga_ajax_func_search('manga_search_ajax','#mangasearchform')
  });
  $('#search_button2').click(function(){
    manga_ajax_func_search('manga_search_ajax','#mangasearchform2')
  });

//함수화시키자 목록보여주는거
  function manga_ajax_func(manga_url){
    $('#manga_finish_ing').html('');                                             //
    $.ajax({
        url:'/manga_ajax/'+manga_url,
        dataType:'json',
        type:'GET',
        data: {}, //데이터 보낼건없다 완결만화만 보여줄거니
        success:function(result){
          if ( result['result'] == true ) {

               var name = new Array();
               for(var i = 0 ; i < result['msg'].length; i++){

                  name[i] = result["msg"][i].name.replace(/ /gi,"%20"); //공백을 %20으로 바꾸기위해!


                 $('#manga_finish_ing').append(

                   '<div class="col-sm-2 upmanlayout"><div class="manhwalist_each"><a class="manhwalist_name" href=/toon/' + name[i] + '>'

                   + '<img src='+ result["msg"][i].photo + ' alt="" class="manhwalist_logo">'

                   + result["msg"][i].name +
                    '</a></div></div>'
                  );
                 }
            }

//모바일화면 반응형위해 에이젝은 비동기라 window 함수에 실행되지않는다.
            var win_width = $(window).width();
            if(win_width < 576){
               $('.upmanlayout').prop('class','col-4 upmanlayout');
            }else if(win_width > 576){
               $('.upmanlayout').prop('class','col-sm-2 upmanlayout');
            }
// -----------------------------------------------------------

        }
    });
  }

  //연재중바 완결바 표시 함수
    function manga_ajax_func_bar(manga_url,id_tag){
      $.ajax({
          url:'/manga_ajax/'+manga_url,
          dataType:'json',
          type:'GET',
          data: {}, //데이터 보낼건없다
          success:function(result){
            if ( result['result'] == true ) {

                 var name = new Array();
                 for(var i = 0 ; i < result['msg'].length; i++){
                    name[i] = result["msg"][i].name.replace(/ /gi,"%20"); //공백을 %20으로 바꾸기위해!
                   $(id_tag).append(
                     '<li><a href=/toon/' + name[i] + '>'
                     + result["msg"][i].name +
                      '</li></a>'
                                            );
                 }
              }
          }
      });
    }

// 만화검색위한 함수
     function manga_ajax_func_search(manga_url,input){
       $('#search_box').html('');
       $.ajax({
           url:'/manga_ajax/'+manga_url,
           dataType:'json',
           type:'POST',
           data: {'msg':$(input).val()},
           success:function(result){
             if ( result['result'] == true ) {

                  var name = new Array();
                  for(var i = 0 ; i < result['msg'].length; i++){

                     name[i] = result["msg"][i].name.replace(/ /gi,"%20"); //공백을 %20으로 바꾸기위해!



                    $('#search_box').append(

                          '<div class="row search_mangabody col-sm-2">' +
                            '<div class="col-sm-12 newupdate">' +
                              '<sup><span class="badge-pill badge-success">!</span></sup><suv class="suv">검색 결과</suv>' +
                              '</div>'+
                              '<center>' +
                              '<a class="manhwalist_name" href=/toon/' + name[i] + '>'
                              + '<img src='+ result["msg"][i].photo + ' alt="" class="manhwasearch_logo">'
                              + result["msg"][i].name +
                              '</a>' +
                              '<center>' +
                        '</div>'

                                        );

                  }
               }else if(result['result'] == false){
                 alert( result['msg'] );
               }
           }
       });
      }
