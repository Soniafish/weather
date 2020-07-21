var weathData;
var req = new XMLHttpRequest();
req.onload = function () {
    // console.log(this.responseText);
    var data = JSON.parse(this.responseText);
    weathData = data.cwbopendata.dataset.location;
    drawCitySelect(weathData);
}
req.open("get", "https://opendata.cwb.gov.tw/fileapi/v1/opendataapi/F-C0032-001?Authorization=CWB-99D208FE-4E2E-4CB2-B60A-5C46C480A556&format=JSON");
req.send();

$(document).ready(function () {
    $("#citySelect").change(function () {
        var city = $(this).val();
        var cityIdx = $(this).find("option:selected").data("index");
        // console.log($(this).val() +", "+ $(this).find("option:selected").data("index"));
        drawCityWeather(cityIdx);
    })
});

function drawCitySelect(data) {
    var html = "<option value='' data-index='-1'>請選擇縣市</option>";
    for (var i = 0; i < data.length; i++) {
        var option = "<option value='" + data[i].locationName + "' data-index='" + i + "'>" + data[i].locationName + "</option>";
        html = html + option;
    }
    $("#citySelect").html("");
    $("#citySelect").html(html);
}

function drawCityWeather(i) {
    $(".weather_info_wrap").css("opacity", 0);
    $(".weather_info").css("opacity", 0);
    // $(".weather_info").animate({ "opacity": 0 }, 400);
    //天氣描述
    var wxVal = weathData[i].weatherElement[0].time[1].parameter.parameterValue;
    var wxSrc = "";
    var bgSrc = "";
    if (wxVal == "1") {
        //晴天
        wxsrc = "images/sun.png";
        bgSrc = "url('images/206-1000x500.jpg')";
        // bgSrc = "url('https://picsum.photos/1000/500?image=206')";
    } else if (wxVal == "2" || wxVal == "3" || wxVal == "44") {
        //多雲/陰天
        wxsrc = "images/cloud.png";
        bgSrc = "url('images/228-1000x500.jpg')";
        // bgSrc = "url('https://picsum.photos/1000/500?image=228')";
    } else if (wxVal == "7" || wxVal == "8" || wxVal == "43") {
        //晴有雲 
        wxsrc = "images/sun_cloudy.png";
        bgSrc = "url('images/54-1000x500.jpg')";
        // bgSrc = "url('https://picsum.photos/1000/500?image=54')";
    } else if (wxVal == "24" || wxVal == "34" || wxVal == "45" || wxVal == "46") {
        //晴午後陣雨
        wxsrc = "images/sun-and-rain.png";
        bgSrc = "url('images/41-1000x500.jpg')";
        // bgSrc = "url('https://picsum.photos/1000/500?image=41')";
    } else {
        //陰天有雨
        wxsrc = "images/rain-cloud.png";
        bgSrc = "url('images/178-1000x500.jpg')";
        // bgSrc = "url('https://picsum.photos/1000/500?image=178')";

    }
    $(".weather_info img").attr("src", wxsrc);
    $(".weather_container").css("background-image", bgSrc);

    var wx = weathData[i].weatherElement[0].time[1].parameter.parameterName;
    console.log("wx: " + wx);
    $(".weather_info_wx").text(wx);

    //最高溫
    var maxT = weathData[i].weatherElement[1].time[1].parameter.parameterName + " - ";
    console.log("maxT: " + maxT);
    $(".weather_info_maxT").html(maxT);

    //最低溫
    var minT = weathData[i].weatherElement[2].time[1].parameter.parameterName + "<sup>。</sup>C ";
    console.log("minT: " + minT);
    $(".weather_info_minT").html(minT);

    //體感溫度
    var ct = weathData[i].weatherElement[3].time[1].parameter.parameterName;
    console.log("ct: " + ct);
    $(".weather_info_ct").text(ct);

    //下雨機率
    var pop = "降雨機率 " + weathData[i].weatherElement[4].time[1].parameter.parameterName + "%";
    console.log("pop: " + pop);
    $(".weather_info_pop").text(pop);


    $(".weather_info").animate({ "opacity": 1 }, 500);
    $(".weather_info_wrap").animate({ "opacity": .6 }, 500);
}