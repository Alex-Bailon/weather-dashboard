let h = 0
let historyArray = []
let weatherResponse = []
let UVResponse = []
init()
inith()
initUV()
initHis()
$(document).ready(function(){
    if (h != 0){
        h = 0
        historyArray.forEach((item) => {
            let historyDiv = $( `<p id="${ h }" class="hisItem"> ${ item } </p>`)
            $( '#history' ).append(historyDiv)
            h++
        })
    }
    $( '.hisItem' ).on('click', function(){
        let clickedVal = +($(this).attr('id'))
        let uvClicked = UVResponse[clickedVal]
        $( '#uv ').html('')
        $( '#uv' ).html(`UV index: <span id="uvIndex">${ uvClicked }</span>`)
        if ( uvClicked < 3 ){
            $( '#uvIndex' ).css('background-color', 'green')
        }
        else if ( uvClicked >= 3 && uvClicked <= 6 ){
            $( '#uvIndex' ).css('background-color', 'orange')
        }
        else{
            $( '#uvIndex' ).css('background-color', 'red')
        }
        renderCurrentDay(weatherResponse[clickedVal]) 
    })
    $( '#input' ).on('submit', function(){
        event.preventDefault()
        let options = {
            q: $( '#cityInput' ).val(),
            units: 'imperial',
            appid: '4c56e5acd3376fa64faa9d6655738d01'
        }
        let queryURL = 'https://api.openweathermap.org/data/2.5/forecast?' + $.param(options)
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response){
            historyArray.unshift(options.q)
            localStorage.setItem('historyArray', JSON.stringify(historyArray))
            $( '#history' ).html('')
            h = 0
            historyArray.forEach((item) => {
                let historyDiv = $( `<p id="${ h }" class="hisItem"> ${ item } </p>`)
                $( '#history' ).append(historyDiv)
                h++
                localStorage.setItem('h', h)
            })
            $( '.hisItem' ).on('click', function(){
                let clickedVal = +($(this).attr('id'))
                let uvClicked = UVResponse[clickedVal]
                $( '#uv ').html('')
                $( '#uv' ).html(`UV index: <span id="uvIndex">${ uvClicked }</span>`)
                if ( uvClicked < 3 ){
                    $( '#uvIndex' ).css('background-color', 'green')
                }
                else if ( uvClicked >= 3 && uvClicked <= 6 ){
                    $( '#uvIndex' ).css('background-color', 'orange')
                }
                else{
                    $( '#uvIndex' ).css('background-color', 'red')
                }
                renderCurrentDay(weatherResponse[clickedVal]) 
            })    
            weatherResponse.unshift(response)
            localStorage.setItem('weatherResponse', JSON.stringify(weatherResponse))
            let cord = {
                lat: response.city.coord.lat,
                lon: response.city.coord.lon,
                appid: '4c56e5acd3376fa64faa9d6655738d01'
            }
            let uvURL = 'https://api.openweathermap.org/data/2.5/uvi?' + $.param(cord)
            console.log(uvURL)
            $.ajax({
                url: uvURL,
                method: "GET"
            }).then(function(res){
                let uvIndex = res.value
                UVResponse.unshift(uvIndex)
                localStorage.setItem('UVResponse', JSON.stringify(UVResponse))
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
            renderCurrentDay(response)  
        })
    })
})

function init(){
    var retrive = JSON.parse(localStorage.getItem('weatherResponse'))
    if (retrive !== null){
        weatherResponse = retrive
    }
}

function inith(){
    var retrive = JSON.parse(localStorage.getItem('h'))
    if (retrive !== null){
        h = retrive
    }
}

function initUV(){
    var retrive = JSON.parse(localStorage.getItem('UVResponse'))
    if (retrive !== null){
        UVResponse = retrive
    }
}

function initHis(){
    var retrive = JSON.parse(localStorage.getItem('historyArray'))
    if (retrive !== null){
        historyArray = retrive
    }
}

function renderCurrentDay(response){
    $( '#fiveDayText' ).css('display', 'block')
    let iconimg = response.list[0].weather[0].icon
    let iconURL = `http://openweathermap.org/img/w/${iconimg}.png`
    $( '#city' ).html(`${ response.city.name } (${ response.list[0].dt_txt.split(' ')[0] }) <img src='${ iconURL }'/>`)
    $( '#temp').text(`Temperature: ${ response.list[0].main.temp } °F`)
    $( '#humidity' ).text(`Humidity: ${ response.list[0].main.humidity }%`)
    $( '#wind' ).text(`Wind Speed: ${ response.list[0].wind.speed } MPH`)
    $( '#fiveDay' ).text('')
    for ( let i = 7; i < 40; i+=8 ){
        let fiveDayIcon = response.list[i].weather[0].icon
        let fiveDayURL = `http://openweathermap.org/img/w/${fiveDayIcon}.png`
        let card = $( 
            `<div class="col s12 m2">
            <div class="card-panel light-blue">
            <span class="white-text" id="spanDate">${ response.list[i].dt_txt.split(' ')[0] }</span>
            <img src='${ fiveDayURL }'/>
            <p>Temp: ${ response.list[i].main.temp } °F</p>
            <p>Humidity: ${ response.list[i].main.humidity }%</p>
            </div>
            </div>`
        )
        $( '#fiveDay' ).append(card)
    }
}
