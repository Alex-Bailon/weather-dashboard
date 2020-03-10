$(document).ready(function(){
    $( '#searchBtn' ).on('click', function(){
        let options = {
            q: $( '#cityInput' ).val(),
            units: 'imperial',
            appid: '4c56e5acd3376fa64faa9d6655738d01'
        }
            let queryURL = 'https://api.openweathermap.org/data/2.5/forecast?' + $.param(options)
            console.log(queryURL)
            $.ajax({
                url: queryURL,
                method: "GET"
            }).then(function(response){
                $( '#city' ).text(`${ response.city.name } (${ response.list[0].dt_txt.split(' ')[0] })`)
                $( '#temp').text(`Temperature: ${ response.list[0].main.temp } °F`)
                $( '#humidity' ).text(`Humidity: ${ response.list[0].main.humidity }%`)
                $( '#wind' ).text(`Wind Speed: ${ response.list[0].wind.speed } MPH`)
            })
    })


})