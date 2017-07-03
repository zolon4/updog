$(function(){

  $("#form").animate({ marginTop: 0, opacity: 1 }, 1000, function(){
    var helpers = ['try asking for the "weather in austin"', 'try "hello"', 'try "its dat boi"', 'try "play mac demarco"']
    var helper = helpers[Math.floor(Math.random()*helpers.length)]
    $('.helpers').append('<small class="text-muted">'+ helper + '</small>')
    $('.helpers').animate({opacity: 1},1500)
  })


  var clear = function() {
    $('#r').html('')
    $('#pic').html('')
    $('#meme').html('')
    $('#form').blur();
    $('#weather').html('')
  }

  var getWeather = function(args) {
    var location = args.location
    var day = args.tomorrow
    console.log(day)
    $.ajax({ method: "GET", url: "/geocode/" + location }).done(function(response){
        var lat = response.results[0].geometry.location.lat
        var lng = response.results[0].geometry.location.lng
        var city = response.results[0].formatted_address

        $.ajax({ method: "GET", url: '/forecast/' +lat+ ',' + lng, }).done(function(response){
          if (dat == 0) {
            var temp = response.currently.apparentTemperature
            $('#r').append("It's " + temp + "&deg; in " + city)
          } else {
            var summary = response.daily.data[1].summary
            var max = response.daily.data[1].apparentTemperatureMax
            var min = response.daily.data[1].apparentTemperatureMin
            $('#weather').append('A high of '+ max + '&deg; with a low of ' + min +'&deg;. ' + summary)
          }

        })
    })
  }

 $('#form').keypress(function(e){

  $('body').css('overflow-y','auto')
  $('.wrapper').css('overflow-y','auto')
  var q = $('#form').val()

  if(e.which == 13) {
    $('#pink').animate({ height: '50vh'},800)
    clear()

    $.ajax({
      url: "/wit/" + q ,
      method: "GET",
      success: function(response) {
        console.log(response)
        var entity = response.entities
        if ('meme' in entity) {
          $.ajax({
            method: "GET",
            url: "https://www.reddit.com/r/me_irl.json",
            success: function(response) {
              var memes = response.data.children
              var meme = memes[Math.floor(Math.random()*memes.length)];
              var src = meme.data.url
              $('#meme').append("here's a selection from the frontpage of me_irl")
              $("html, body").animate({ scrollTop: $(document).height() }, 2000);
              $('#r').append('<img src="' + src+ '" class="heboot"/ >')
           }
        })
     } else if ('play' in entity && 'artist' in entity) {
        var artist = response.entities.artist[0].value
        $.ajax({ method: "GET", url:"/spotify/" + artist }).done(function(res){
          var uri = res.uri
          $('#r').css("margin-top", "-20px")
          $('#pic').append('<iframe src="https://embed.spotify.com/?uri=' + uri+ '" width="300" height="380" frameborder="0" allowtransparency="true"></iframe>')
        })
      } else if ('datboi' in entity) {
          $('#r').append('oh shit whaddup')
      } else if ('updog' in entity) {
          $('#r').append('not much, wbu?')
      } else if ('your' in entity) {
          $('#r').append('I am updog')
      } else if ('greeting' in entity) {
          $('#r').append('yes this is updog')
      } else if ('bork' in entity) {
          $('#r').append('jesus you did me the really big frighten')
      } else if ('tomorrow_' in entity && 'location' in entity ) {
          var city = response.entities.location[0].value
          getLocation({location: city, tomorrow: 1})

       } else if ('location' in entity){
          var city = response.entities.location[0].value
          getLocation({location: city, tomorrow: 0})
        } else if ('sup' in entity) {
           var responses = ['just hangin out', 'just chillin', 'not much', 'eh not too much', 'not a lot']
           var reply = responses[Math.floor(Math.random()*responses.length)];
           $('#r').append(reply)
        } else if ('joke' in entity) {
          $("html, body").animate({ scrollTop: $(document).height() }, 1000);
          $('#pic').append('<img class="img-fluid pull-xs-center heboot" src="http://i.imgur.com/zgOt8dH.jpg" /> ')
        } else if ('song' in entity) {
          $('#r').append('I love These')
          $('#pic').append('<iframe src="https://embed.spotify.com/?uri=spotify:user:gorgonzolon:playlist:4T6FSZva3M8nZgHHNeRFi3" width="300" height="380" frameborder="0" allowtransparency="true"></iframe>')
        } else {
          $('#r').append("whooops")
         }
        }
       }
      );
     }

    })


 })
