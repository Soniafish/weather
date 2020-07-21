var weatherData;
var targetWeather = {
    "locationName": "台灣地區",
    "weatherElement": {}
};
var page = 1;
var currentHref = location.href;
console.log(location.href);
var locationCode = "";
if (currentHref.indexOf("?") == -1) {
    page = 1;
    //縣市
    locationCode = dataId_cityWeek;
} else {
    page = 2;
    // 鄉鎮市 
    var locationNameStart = currentHref.indexOf("?") + 1;
    var locationNameEnd = currentHref.length
    var locationNameWord = currentHref.slice(locationNameStart, locationNameEnd);
    var locationName = decodeURIComponent(locationNameWord);
    targetWeather.locationName = locationName;
    // console.log(locationName);
    for (let i = 0; i < dataId_countryWeek.length; i++) {
        if (dataId_countryWeek[i].name == locationName) {
            locationCode = dataId_countryWeek[i].code;
            break;
        }
    }
}
// console.log(locationCode);
var httpSrc = "https://opendata.cwb.gov.tw/api/v1/rest/datastore/" + locationCode + "?Authorization=CWB-99D208FE-4E2E-4CB2-B60A-5C46C480A556&format=JSON";



class Title extends React.Component {
    render() {
        return <h1>{this.props.locationName}明日氣象預報</h1>;
    }
}
class CitySelector extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isWeatherData: {},
            selectInput: ""
        };
    }
    componentWillMount() {
        var req = new XMLHttpRequest();
        req.ref = this;//req新增屬性ref來綁定react物件
        req.onload = function () {
            if (this.status == 200) {
                // console.log("success");
                // console.log(this.responseText);
                var data = JSON.parse(this.responseText);
                weatherData = data.records.locations[0].location;
                console.log(weatherData);
                this.ref.setState({ isWeatherData: weatherData });
            }
        }
        req.open("get", httpSrc);
        req.send();
    }
    handleSelectChange(e) {
        //若有更新,透過setState進行: 保持state中的資料是唯一可信的來源
        this.setState({ selectInput: e.currentTarget.value });
        console.log(e.currentTarget.value + ", " + this.state.selectInput);
        // targetWeather.locationName= e.currentTarget.value;
        for (let i = 0; i < weatherData.length; i++) {
            if (weatherData[i].locationName == e.currentTarget.value) {
                targetWeather = weatherData[i];
                this.props.update(weatherData[i]);
            }
        }
    }
    render() {
        let optInit = <option value='' data-index='-1'>請選擇地區</option>;
        let opt;
        let opts = [];
        opts.push(optInit);
        for (let i = 0; i < this.state.isWeatherData.length; i++) {
            opt = <option value={this.state.isWeatherData[i].locationName} data-index={i}> {this.state.isWeatherData[i].locationName} </option>;
            opts.push(opt);
        }
        return <select name="" id="citySelect"
            value={this.state.selectInput}
            onChange={this.handleSelectChange.bind(this)}
        >{opts}</select>;
    }
}
class WeatherInfo extends React.Component {
    render() {
        return <div className="weather_info_wrap" style={{ "opacity": this.props.opWrap }}>
            <div className="weather_info" style={{ "opacity": this.props.opCnt }}>
                <img src={this.props.wxsrc} alt="" className="weather_info_wx_i" />
                <div>
                    <p className="weather_info_wx">{this.props.wx}</p>
                    <p>
                        <span className="weather_info_maxT">{this.props.maxT}</span>-
                                <span className="weather_info_minT">{this.props.minT}</span><sup>。</sup>C
                            </p>
                    <p className="weather_info_pop">降雨機率:{this.props.pop}%</p>
                    <p className="weather_info_ct">紫外線指數:{this.props.uvi}uvi</p>
                    <a className="weather_link" href={this.props.location} style={{ display: this.props.displayLink }}>more...</a>
                    <a className="weather_link" href={this.props.location2} style={{ display: this.props.displayLink2 }}>Back</a>
                </div>
            </div>
        </div>;
    }
}

class WeatherContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            location: "",
            location2: "",
            displayLink: "none",
            displayLink2: "none",
            bg: "",
            wxsrc: "",
            wx: "",
            maxT: "",
            minT: "",
            uvi: "",
            pop: "",
            opWrap: 0,
            opCnt: 0
        }
    }
    update = (temp) => {
        console.log(temp);
        //天氣現象
        var wxVal = temp.weatherElement[6].time[2].elementValue[0].value;
        var new_wxSrc = "";
        var new_bgSrc = "";
        if (wxVal == "1") {
            //晴天
            new_wxSrc = "images/sun.png";
            new_bgSrc = "url('images/206-1000x500.jpg')";
        } else if (wxVal == "2" || wxVal == "3" || wxVal == "44") {
            //多雲/陰天
            new_wxSrc = "images/cloud.png";
            new_bgSrc = "url('images/228-1000x500.jpg')";
        } else if (wxVal == "7" || wxVal == "8" || wxVal == "43") {
            //晴有雲 
            new_wxSrc = "images/sun_cloudy.png";
            new_bgSrc = "url('images/54-1000x500.jpg')";
        } else if (wxVal == "24" || wxVal == "34" || wxVal == "45" || wxVal == "46") {
            //晴午後陣雨
            new_wxSrc = "images/sun-and-rain.png";
            new_bgSrc = "url('images/41-1000x500.jpg')";
        } else {
            //陰天有雨
            new_wxSrc = "images/rain-cloud.png";
            new_bgSrc = "url('images/178-1000x500.jpg')";
        }
        var new_maxT = 0;
        for (let i = 1; i < 4; i++) {
            if (temp.weatherElement[12].time[i].elementValue[0].value > new_maxT) {
                new_maxT = temp.weatherElement[12].time[i].elementValue[0].value;
            }
        }
        var new_minT = 100;
        for (let i = 1; i < 4; i++) {
            if (temp.weatherElement[8].time[i].elementValue[0].value < new_minT) {
                new_minT = temp.weatherElement[8].time[i].elementValue[0].value;
            }
        }
        //連結
        var locationHref = "";
        var location2Href = "";
        var displayKind: "none";
        var display2Kind: "none";
        if (page == 1) {//首頁
            locationHref = "weather2_react.html?" + temp.locationName,
                location2Href = "";
            displayKind = "inline";
            display2Kind = "none";
        } else {//次頁
            locationHref = "";
            location2Href = "weather_react.html";
            displayKind = "none";
            display2Kind = "inline";
        }
        this.setState({
            location: locationHref,
            location2: location2Href,
            displayLink: displayKind,
            displayLink2: display2Kind,
            bg: new_bgSrc,
            wxsrc: new_wxSrc,
            wx: temp.weatherElement[6].time[2].elementValue[0].value,
            maxT: new_maxT,
            minT: new_minT,
            uvi: temp.weatherElement[9].time[2].elementValue[0].value,
            pop: temp.weatherElement[2].time[2].elementValue[0].value,
            opWrap: .6,
            opCnt: 1,
        });
        // console.log(this.state);

    }

    render() {
        console.log(this.state);
        return <div className="weather_container" style={{ "background-image": this.state.bg }}>
            <Title locationName={targetWeather.locationName} />
            <CitySelector update={this.update} />
            <WeatherInfo
                wxsrc={this.state.wxsrc}
                wx={this.state.wx}
                maxT={this.state.maxT}
                minT={this.state.minT}
                uvi={this.state.uvi}
                pop={this.state.pop}
                opWrap={this.state.opWrap}
                opCnt={this.state.opCnt}
                location={this.state.location}
                location2={this.state.location2}
                displayLink={this.state.displayLink}
                displayLink2={this.state.displayLink2}
            />
        </div>;
    }
}
window.addEventListener("load", () => {
    let myComoonent = <div><WeatherContainer /><h4>資料來源：中央氣象局</h4></div>;
    ReactDOM.render(myComoonent, document.body);
});