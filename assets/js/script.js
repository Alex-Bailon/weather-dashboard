$(document).ready(function(){
    let historyArray = []
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
            let iconimg = response.list[0].weather[0].icon
            let iconURL = `http://openweathermap.org/img/w/${iconimg}.png`
            $( '#city' ).html(`${ response.city.name } (${ response.list[0].dt_txt.split(' ')[0] }) <img src='${ iconURL }'/>`)
            $( '#temp').text(`Temperature: ${ response.list[0].main.temp } °F`)
            $( '#humidity' ).text(`Humidity: ${ response.list[0].main.humidity }%`)
            $( '#wind' ).text(`Wind Speed: ${ response.list[0].wind.speed } MPH`)
            let cord = {
                lat: response.city.coord.lat,
                lon: response.city.coord.lon,
                appid: '4c56e5acd3376fa64faa9d6655738d01'
            }
            let uvURL = 'http://api.openweathermap.org/data/2.5/uvi?' + $.param(cord)
            $.ajax({
                url: uvURL,
                method: "GET"
            }).then(function(res){
                uvIndex = res.value
                $( '#uv' ).html(`UV index: <span id="uvIndex">${ uvIndex }</span>`)
                if ( uvIndex < 3 ){
                    $( '#uvIndex' ).css('background-color', 'green')
                }
                else if ( uvIndex >= 3 && uvIndex <= 6 ){
                    $( '#uvIndex' ).css('background-color', 'orange')
                }
                else{
                    $( '#uvIndex' ).css('background-color', 'red')
                }
            })
            historyArray.unshift(options.q)
            $( '#history' ).html('')
            console.log(historyArray)
            historyArray.forEach((item) => {
                console.log(item)
                let historyDiv = $( `<p> ${ item} </p>`)
                $( '#history' ).append(historyDiv)
        })
        })
    })
})