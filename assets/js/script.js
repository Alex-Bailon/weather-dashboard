let h = 0 // var h is used to add id for each history items
let historyArray = []
let weatherResponse = []
let UVResponse = []
init() //function used to get any weather response from local storage
inith() //function used to get h from local storage
initUV() //function used to get the UV Response from local storage
initHis() //function used to get history array from loacl storage
$(document).ready(function(){
    //if statement to check if there is anything stored in local storage. If ture print out history array.
    if (h != 0){
        h = 0
        historyArray.forEach((item) => {
            let historyDiv = $( `<p id="${ h }" class="hisItem"> ${ item } </p>`)
            $( '#history' ).append(historyDiv)
            h++
        })
    }
    //on click event for history items, once click will get id and use that as an index to get the info from weather and UV response.
    $( '.hisItem' ).on('click', function(){
        let clickedVal = +($(this).attr('id'))
        let uvClicked = UVResponse[clickedVal]
        $( '#uv ').html('')
        $( '#uv' ).html(`UV index: <span id="uvIndex">${ uvClicked }</span>`)
        // if statement to check value of UV index so that it can change background color.
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
    // on click event for clear history btn. Will reset all var to 0/empty and set it to local stotage
    $( '#clearBtn' ).on('click', function(){
        $( '#history' ).html('')
        h = 0
        historyArray = []
        weatherResponse = []
        UVResponse = []
        localStorage.setItem('h', h)
        localStorage.setItem('historyArray', JSON.stringify(historyArray))
        localStorage.setItem('weatherResponse', JSON.stringify(weatherResponse))
        localStorage.setItem('UVResponse', JSON.stringify(UVResponse))
    })
    // Submit event for user input
    $( '#input' ).on('submit', function(){
        event.preventDefault()
        //all vals needed to make URL to call ajax from API
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
            // after getting response from API, add user  input to history array and to local storage
            historyArray.unshift(options.q)
            localStorage.setItem('historyArray', JSON.stringify(historyArray))
            //empty the html for the div #history and display history items 
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
            // add response from API to weather response array and store in local storage 
            weatherResponse.unshift(response)
            localStorage.setItem('weatherResponse', JSON.stringify(weatherResponse))
            // setting cord from the response to get lat and lon for url to get UV index
            let cord = {
                lat: response.city.coord.lat,
                lon: response.city.coord.lon,
                appid: '4c56e5acd3376fa64faa9d6655738d01'
            }
            let uvURL = 'https://api.openweathermap.org/data/2.5/uvi?' + $.param(cord)
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
// function to retrive weather response from local storage
function init(){
    var retrive = JSON.parse(localStorage.getItem('weatherResponse'))
    if (retrive !== null){
        weatherResponse = retrive
    }
}
// function to retrive h from local storage
function inith(){
    var retrive = JSON.parse(localStorage.getItem('h'))
    if (retrive !== null){
        h = retrive
    }
}
// function to retrive UV response from local storage
function initUV(){
    var retrive = JSON.parse(localStorage.getItem('UVResponse'))
    if (retrive !== null){
        UVResponse = retrive
    }
}
// function to retrive history array from local storage
function initHis(){
    var retrive = JSON.parse(localStorage.getItem('historyArray'))
    if (retrive !== null){
        historyArray = retrive
    }
}
// function to show info of the current day and 5 day forecast to the HTML
function renderCurrentDay(response){
    $( '#fiveDayText' ).css('display', 'block')
    let iconimg = response.list[0].weather[0].icon
    let iconURL = `https://openweathermap.org/img/w/${iconimg}.png`
    $( '#city' ).html(`${ response.city.name } (${ response.list[0].dt_txt.split(' ')[0] }) <img src='${ iconURL }'/>`)
    $( '#temp').text(`Temperature: ${ response.list[0].main.temp } °F`)
    $( '#humidity' ).text(`Humidity: ${ response.list[0].main.humidity }%`)
    $( '#wind' ).text(`Wind Speed: ${ response.list[0].wind.speed } MPH`)
    $( '#fiveDay' ).text('')
    for ( let i = 7; i < 40; i+=8 ){
        let fiveDayIcon = response.list[i].weather[0].icon
        let fiveDayURL = `https://openweathermap.org/img/w/${fiveDayIcon}.png`
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
