import React, { useLayoutEffect } from 'react';

import './App.css';
import { useEffect } from 'react';
import GetCurrentWeather from './services/use.get.current.weather';
import GetForecastWeather from './services/use.get.forecast.weather';

import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import * as am5radar from "@amcharts/amcharts5/radar";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";


function App() {

  const { data: currentWeather, loading: loadingCurrentWeather } = GetCurrentWeather();
  const { data: forecastWeather } = GetForecastWeather();



  useEffect(() => {

    console.log('useEffect', loadingCurrentWeather);

  }, [loadingCurrentWeather]);

  useLayoutEffect(() => {

    let root = am5.Root.new("chartdiv");
    root.setThemes([
      am5themes_Animated.new(root)
    ]);



    // Create chart
    // https://www.amcharts.com/docs/v5/charts/radar-chart/
    var chart = root.container.children.push(am5radar.RadarChart.new(root, {
      panX: false,
      panY: false
    }));


    // Create axis and its renderer
    // https://www.amcharts.com/docs/v5/charts/radar-chart/gauge-charts/#Axes
    var axisRenderer = am5radar.AxisRendererCircular.new(root, {
      innerRadius: -15,
      strokeOpacity: 0,
      strokeWidth: 0,
      minGridDistance: 360,

    });

    var xAxis = chart.xAxes.push(am5xy.ValueAxis.new(root, {
      maxDeviation: 0,
      min: 0,
      max: 360,
      strictMinMax: true,
      renderer: axisRenderer,

      maxPrecision: 0
    }));

    axisRenderer.grid.template.setAll({
      forceHidden: true
    });
    axisRenderer.labels.template.setAll({
      forceHidden: true
    });


    // second axis
    // https://www.amcharts.com/docs/v5/charts/radar-chart/gauge-charts/#Axes
    var secondAxisRenderer = am5radar.AxisRendererCircular.new(root, {
      innerRadius: -10,
      radius: am5.percent(95),
      strokeOpacity: 0,
      minGridDistance: 10
    });

    var secondXAxis = chart.xAxes.push(am5xy.ValueAxis.new(root, {
      maxDeviation: 0,
      min: 0,
      max: 360,
      strictMinMax: true,
      renderer: secondAxisRenderer,
      maxPrecision: 0
    }));


    // hides 0 value
    axisRenderer.labels.template.setAll({
      minPosition: 0.02,
      // textType: "adjusted",
      inside: true,
      radius: 25
    });
    axisRenderer.grid.template.set("strokeOpacity", 1);


    secondAxisRenderer.labels.template.setAll({
      forceHidden: true
    });
    secondAxisRenderer.grid.template.setAll({
      forceHidden: true
    });
    secondAxisRenderer.ticks.template.setAll({
      strokeOpacity: 1,
      minPosition: 0.01,
      visible: true,
      inside: true,
      length: 20
    });


    // seconds
    var secondsDataItem = xAxis.makeDataItem({});
    var secondsHand = am5radar.ClockHand.new(root, {
      radius: am5.percent(98),
      innerRadius: -50,
      topWidth: 5,
      bottomWidth: 5,
      pinRadius: 0,
      layer: 5
    })

    secondsHand.hand.set("fill", am5.color(0xff0000));
    secondsHand.pin.set("fill", am5.color(0xff0000));

    secondsDataItem.set("bullet", am5xy.AxisBullet.new(root, {
      sprite: secondsHand
    }));

    xAxis.createAxisRange(secondsDataItem);

    
    secondsDataItem.get("grid")?.set("visible", false);
    

    // week label
    var label = chart.radarContainer.children.push(am5.Label.new(root, {
      fontSize: "4em",
      centerX: am5.p50,
      centerY: am5.p50
    }));

    // secondsDataItem.animate({
    //     key: "value",
    //     from: 0,
    //     to: 18,
    //     duration: duration
    //   });


    if( loadingCurrentWeather === false ) {
      //////////////////////////////////////////////////////////////////
      label.set("text", currentWeather?.current?.wind_dir)
      secondsDataItem.set("value", currentWeather?.current?.wind_degree);
      ////////////////////////////////////////////////////////////////////

    }

    



    // seconds
    var secondsDataItem2 = xAxis.makeDataItem({});
    var secondsHand2 = am5radar.ClockHand.new(root, {
      radius: am5.percent(98),
      innerRadius: -50,
      topWidth: 5,
      bottomWidth: 5,
      pinRadius: 0,
      layer: 5
    })

    var positiveColor = root.interfaceColors.get("positive");
    var negativeColor = root.interfaceColors.get("negative");
    if(negativeColor){
      secondsHand2.hand.set("fill", am5.Color.lighten(negativeColor, 0.5));
    }
    secondsHand2.pin.set("fill", am5.color('#cecece'));

    secondsDataItem2.set("bullet", am5xy.AxisBullet.new(root, {
      sprite: secondsHand2
    }));

    xAxis.createAxisRange(secondsDataItem2);

    secondsDataItem2.get("grid")?.set("visible", false);
    secondsDataItem2.set("value", 90);




    // seconds
    var secondsDataItem3 = xAxis.makeDataItem({});
    var secondsHand3 = am5radar.ClockHand.new(root, {
      radius: am5.percent(98),
      innerRadius: -120,
      topWidth: 12,
      bottomWidth: 5,
      pinRadius: 0,
      layer: 5
    })

    var positiveColor = root.interfaceColors.get("positive");
    var negativeColor = root.interfaceColors.get("negative");
    if(negativeColor){
      secondsHand3.hand.set("fill", am5.Color.lighten(negativeColor, 0.8));
    }
    secondsHand3.pin.set("fill", am5.color('#cecece'));

    secondsDataItem3.set("bullet", am5xy.AxisBullet.new(root, {
      sprite: secondsHand3
    }));

    xAxis.createAxisRange(secondsDataItem3);

    secondsDataItem3.get("grid")?.set("visible", false);

    secondsDataItem3.set("value", 145);





    return () => {
      root.dispose();
    };
  }, [loadingCurrentWeather]);


  return (

    <div className="flex justify-between  flex-col h-screen ">
      <div>
        <h1 className='text-4xl text-center m-5'>
          {loadingCurrentWeather === true ? 'Loading...' : currentWeather?.location?.name}
        </h1>
      </div>
      <div className="bg-slate-200 grow ">
        <div id="chartdiv" style={{ width: "100%", height: "500px" }} className="h-1/4"></div>
        <div className="flex justify-center  flex-col h-1/4 ">

          <div className="">
            <h2 className="text-9xl text-center">
              <b>{currentWeather?.current?.temp_c}°</b>
            </h2>
          </div>
          <div className="">
            <h2 className="text-5xl text-center">
              {currentWeather?.current?.feelslike_c}°St
            </h2>
          </div>
          <div className="">
            <h2 className="text-7xl text-center text-slate-700">
              <b>{currentWeather?.current?.wind_dir}</b>

            </h2>
          </div>

        </div>





      </div>
      <div className='bg-slate-600 w-screen '>

        <div className='overflow-visible'>
          {forecastWeather?.forecast?.forecastday?.map((item: any, index: any) => {

            return (
              <div key={index} className='bg-amber-200 ' >

                <div className="flex flex-row text-xs mb-1">
                  <div className='w-32 flex items-center justify-center text-base font-bold'>

                    {item.date}

                  </div>


                  {forecastWeather?.forecast?.forecastday[index]?.hour.map((itemHour: any, indexHour: any) => {
                    return (
                      <div className='w-14 bg-amber-50 p-1 drop-shadow-xl'>
                        {new Date(itemHour.time).getHours()}<br />
                        {itemHour.temp_c}°<br />
                        <i>{itemHour.wind_dir}</i><br />

                      </div>
                    )
                  })}

                </div>


              </div>
            )
          }
          )}
        </div>


      </div>
      <div className="bg-slate-400  text-center text-xs p-2">Meteo | {currentWeather?.current?.last_updated}</div>
    </div>

  );
}

export default App;
