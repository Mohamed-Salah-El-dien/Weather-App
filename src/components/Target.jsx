/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';
// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//Material-Ui
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import Input from '@mui/material/Input';
import FormControl from '@mui/material/FormControl';
import KeyboardDoubleArrowRightOutlinedIcon from '@mui/icons-material/KeyboardDoubleArrowRightOutlined';
import KeyboardDoubleArrowLeftOutlinedIcon from '@mui/icons-material/KeyboardDoubleArrowLeftOutlined';
// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//Api-Calls
import {
  useLazyGetWeatherQuery,
  useLazyGetForecastQuery,
  useLazyGetTimeQuery,
  useLazyGetSearchQuery,
} from '../services/weatherApi';
// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//images&components
import Loading from './Loading';
import img1 from '../images/clearday.jpg';
import img2 from '../images/partlyday2.jpg';
import img3 from '../images/cloudyday.jpg';
import img4 from '../images/fog.jpg';
import img5 from '../images/clearnight.jpg';
import img6 from '../images/snow.jpg';
// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

const Target = ({ coords, setCoords }) => {
  //Normal-app-states
  const [active, setActive] = useState(false);
  const [input, setInput] = useState(false);
  const [location, setLocation] = useState('');
  const [term, setTerm] = useState('');

  //Api-realated-states
  const [weather, setWeather] = useState([]);
  const [text, setText] = useState('');
  const [foreCast, setForeCast] = useState([]);
  const [time, setTime] = useState('');

  //Api-Calls
  const [getWeather, { isFetching: weatherFetch }] =
    useLazyGetWeatherQuery(coords);
  const [getForecast, { isFetching: forecastFetch }] =
    useLazyGetForecastQuery(coords);
  const [getTime, { isFetching: timeFetch }] = useLazyGetTimeQuery(coords);

  useEffect(() => {
    if (coords.length > 0) {
      const fetch = async () => {
        getWeather(coords).then(({ data }) => setWeather(data?.current));
        getWeather(coords).then(({ data }) =>
          setText(data?.current?.condition.text)
        );
        getWeather(coords).then(({ data }) =>
          setLocation(data?.location?.name)
        );
        getForecast(coords).then(({ data }) =>
          setForeCast(data?.forecast?.forecastday)
        );
        getTime(coords).then(({ data }) => setTime(data?.location?.localtime));
      };

      fetch();
    } else {
      console.log('oopsie');
    }
  }, [coords]);

  // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
  // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
  // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
  // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

  //Search-states
  const [options, setOptions] = useState([]);
  const [debouncedValue] = useDebounce(term, 300);

  //Auto-Complete-Call
  const [getSearch] = useLazyGetSearchQuery(debouncedValue);

  useEffect(() => {
    if (debouncedValue) {
      getSearch(debouncedValue).then((data) => setOptions(data.data));
    } else {
      setOptions([]);
    }
  }, [debouncedValue]);

  //Pick-one-handle
  const handleOption = (name) => {
    setCoords(name);
    setTerm('');
  };

  //toggle-input-On/Off
  const handleInput = () => {
    setTerm('');
    setInput(!input);
  };

  //During-fetch
  if (weatherFetch || forecastFetch || timeFetch) return <Loading />;

  // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
  // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
  // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

  return (
    <div className="container">
      {text === 'Sunny' ? (
        <img src={img1} alt="sunny" className="img" />
      ) : text === 'Clear' ? (
        <img src={img5} alt="Clear" className="img" />
      ) : text === 'Moderate snow' || text === 'Light snow' ? (
        <img src={img6} alt="Snow" className="img" />
      ) : text === 'Partly cloudy' ? (
        <img src={img2} alt="Partly cloudy" className="img" />
      ) : text === 'Fog' || text === 'Mist' ? (
        <img src={img4} alt="Fog" className="img" />
      ) : (
        <img src={img3} alt="cloudy" className="img" />
      )}

      <div className="main">
        <h1>{weather.temp_c}°c</h1>

        <div className="name">
          <h2>{location}</h2>
          <h4>{time}</h4>
        </div>

        <div className="weather">
          <h4>{text}</h4>
        </div>
      </div>

      <div className={active ? 'side active' : 'side'}>
        {active ? (
          <KeyboardDoubleArrowRightOutlinedIcon
            className="icon"
            onClick={() => setActive(!active)}
          />
        ) : (
          <KeyboardDoubleArrowLeftOutlinedIcon
            className="icon"
            onClick={() => setActive(!active)}
          />
        )}

        <div className="menu">
          <FormControl
            className="form"
            variant="outlined"
            color="error"
            sx={{
              hight: '2rem',
            }}
          >
            <Input
              color="error"
              className={input ? 'input active' : 'input'}
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="Search For A City"
            />
            <Box
              sx={{
                width: '100%',
                zIndex: '10',
                top: '2.6rem',
                position: 'absolute',
                backdropFilter: 'blur(4px)',
              }}
            >
              {term &&
                options?.map(({ id, name, region, country }) => (
                  <Box
                    key={id}
                    onClick={() => handleOption(name)}
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      bgcolor: 'rgba(0, 0, 0, .3)',
                      cursor: 'pointer',
                      padding: '3px 1rem',
                      transition: '.5s ease',
                      '&:hover': {
                        bgcolor: 'rgba(0, 0, 0, .9)',
                      },
                    }}
                  >
                    <Typography
                      color="white"
                      sx={{
                        width: '100%',
                        fontSize: { xs: '.72rem', sm: '.85rem' },
                      }}
                    >
                      {name} -- {region} -- {country}
                    </Typography>
                  </Box>
                ))}
            </Box>
            <SearchOutlinedIcon className="search-icon" onClick={handleInput} />
          </FormControl>
          <div className="info">
            <h1>More Info</h1>
            <h3>
              Feels like:<span>{weather.feelslike_c}°c</span>
            </h3>
            <h3>
              Humidity: <span>{weather.humidity}%</span>
            </h3>
            <h3>
              Wind: <span>{weather.wind_kph}kph</span>
            </h3>
            <h3>
              Pressure: <span>{weather.pressure_in}psi</span>
            </h3>
          </div>

          <div className="forecast">
            <h1>Forecast</h1>
            {foreCast?.map((day, index) => (
              <div className="day" key={index}>
                <h2>{day.date} </h2>
                <h3>
                  feels like: <span>{day.day.avgtemp_c}°c</span>
                </h3>
                <h3>
                  humidity: <span>{day.day.avghumidity}%</span>
                </h3>
                <h3>
                  wind: <span>{day.day.maxwind_kph}kphh</span>
                </h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Target;
