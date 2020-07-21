var taiwanWeather;
var targetWeather = {
    "locationName": "",
    "weatherElement": {}
};


class Title extends React.Component {
    render() {
        return <h1>台灣地區明日氣象預報</h1>;
    }
}
class CitySelector extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isWeathData: {},
            selectInput: ""
        };
    }
    componentWillMount() {
        var weathData;
        var req = new XMLHttpRequest();
        req.ref = this;//req新增屬性ref來綁定react物件
        req.onload = function () {
            // console.log(this.responseText);
            var data = JSON.parse(this.responseText);
            weathData = data.cwbopendata.dataset.location;
            taiwanWeather = weathData;
            this.ref.setState({ isWeathData: weathData });
        }
        req.open("get", "https://opendata.cwb.gov.tw/fileapi/v1/opendataapi/F-C0032-001?Authorization=CWB-99D208FE-4E2E-4CB2-B60A-5C46C480A556&format=JSON");
        req.send();
    }
    handleSelectChange(e) {
        //若有更新,透過setState進行: 保持state中的資料是唯一可信的來源
        this.setState({ selectInput: e.currentTarget.value });
        console.log(e.currentTarget.value + ", " + this.state.selectInput);
        // targetWeather.locationName= e.currentTarget.value;
        for (let i = 0; i < taiwanWeather.length; i++) {
            if (taiwanWeather[i].locationName == e.currentTarget.value) {
                targetWeather = taiwanWeather[i];
                this.props.update(taiwanWeather[i]);
            }
        }
    }
    render() {
        let optInit = <option value='' data-index='-1'>請選擇縣市</option>;
        let opt;
        let opts = [];
        opts.push(optInit);
        for (let i = 0; i < this.state.isWeathData.length; i++) {
            opt = <option value={this.state.isWeathData[i].locationName} data-index={i}> {this.state.isWeathData[i].locationName} </option>;
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
                    <p className="weather_info_ct">{this.props.ct}</p>
                    <p className="weather_info_pop">降雨機率{this.props.pop}%</p>
                    <a className="weather_link" href={this.props.location}>more...</a>
                </div>
            </div>
        </div>;
    }
}

class WeatherContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            location: "weather2_react.html",
            bg: "",
            wxsrc: "",
            wx: "",
            maxT: "",
            minT: "",
            ct: "",
            pop: "",
            opWrap: 0,
            opCnt: 0
        }
    }
    update = (temp) => {
        console.log(temp);
        //天氣描述
        var wxVal = temp.weatherElement[0].time[1].parameter.parameterValue;
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
        for (let i = 0; i < temp.weatherElement[1].time.length; i++) {
            if (temp.weatherElement[1].time[i].parameter.parameterName > new_maxT) {
                new_maxT = temp.weatherElement[1].time[i].parameter.parameterName;
            }
        }
        var new_minT = 100;
        for (let i = 0; i < temp.weatherElement[2].time.length; i++) {
            if (temp.weatherElement[2].time[i].parameter.parameterName < new_minT) {
                new_minT = temp.weatherElement[2].time[i].parameter.parameterName;
            }
        }
        this.setState({
            location: "weather2_react.html?" + temp.locationName,
            bg: new_bgSrc,
            wxsrc: new_wxSrc,
            wx: temp.weatherElement[0].time[1].parameter.parameterName,
            maxT: new_maxT,
            minT: new_minT,
            ct: temp.weatherElement[3].time[1].parameter.parameterName,
            pop: temp.weatherElement[4].time[1].parameter.parameterName,
            opWrap: .6,
            opCnt: 1,
        });
        console.log(this.state);

    }

    render() {
        console.log(this.state);
        return <div className="weather_container" style={{ "background-image": this.state.bg }}>
            <Title />
            <CitySelector update={this.update} />
            <WeatherInfo
                wxsrc={this.state.wxsrc}
                wx={this.state.wx}
                maxT={this.state.maxT}
                minT={this.state.minT}
                ct={this.state.ct}
                pop={this.state.pop}
                opWrap={this.state.opWrap}
                opCnt={this.state.opCnt}
                location={this.state.location}
            />
        </div>;
    }
}
window.addEventListener("load", () => {
    let myComoonent = <div><WeatherContainer /><h4>資料來源：中央氣象局</h4></div>;
    ReactDOM.render(myComoonent, document.body);
});