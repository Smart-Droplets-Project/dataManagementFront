import { useState, useEffect, useRef } from "react";
import { Box, IconButton, Typography, Grid, Paper, Chip, Skeleton } from "@mui/material";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import GenericSnackbar from "@/components/GenericSnackbar";
import { WeatherForecast } from "@/lib/interfaces";
import { colors } from "@/theme/colors";

const getDateString = (baseDate: string, daysOffset: number) => {
  const d = new Date(baseDate);
  d.setDate(d.getDate() + daysOffset);
  return d.toISOString().split('T')[0];
};

const formatDisplayDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

const extractValue = (property: any) => {
  if (!property) return 'N/A';
  if (typeof property === 'object' && 'value' in property) {
    return property.value;
  }
  return property;
};

const TemperatureDisplay = ({ value, label, color }: { value: string | number, label: string, color?: string }) => (
  <Paper sx={{ 
    p: 1.5, 
    textAlign: 'center', 
    borderRadius: '0.5rem',
    backgroundColor: "white"
  }}>
    <Typography variant="body2" color="text.secondary">
      {label}
    </Typography>
    <Typography variant="h6" sx={{ 
      color: color || colors.primary.main, 
      fontWeight: 600 
    }}>
      {typeof value === 'number' ? `${value.toFixed(1)}°C` : value}
    </Typography>
  </Paper>
);

const WeatherDataCard = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <Paper elevation={0} sx={{ 
    p: 2, 
    borderRadius: '0.5rem',
    backgroundColor: colors.other.lightgrey
  }}>
    <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>{title}</Typography>
    {children}
  </Paper>
);

const ParcelDrawerWeatherTab = (props: { selectedParcel: GeoJSON.Feature | null }) => {
    const { selectedParcel } = props;
    const parcelId = selectedParcel?.properties?.id || selectedParcel?.id;
    let initial = useRef(true);

    const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [weatherForecast, setWeatherForecast] = useState<WeatherForecast | null>(null);
    const [weatherYesterday, setWeatherYesterday] = useState<WeatherForecast | null>(null);
    const [weatherTomorrow, setWeatherTomorrow] = useState<WeatherForecast | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    
    const [snackbarState, setSnackbarState] = useState({
        open: false,
        type: 'info' as 'success' | 'error' | 'info',
        message: '',
    });

    const handleOpenSnackbar = (type: 'success' | 'error' | 'info', message: string) => {
        setSnackbarState({ open: true, type, message });
    };

    useEffect(() => {
      if (!parcelId) return;

      const fetchInitialData = async () => {
        try {
          setLoading(true);
          const [yesterday, today, tomorrow] = await Promise.all([
            fetchWeatherData(getDateString(date, -1)),
            fetchWeatherData(date),
            fetchWeatherData(getDateString(date, 1))
          ]);

          setWeatherYesterday(yesterday);
          setWeatherForecast(today);
          setWeatherTomorrow(tomorrow);
          setError(null);
        } catch (err) {
          handleError(err);
        } finally {
          setLoading(false);
          initial.current = false;
        }
      };

      if (initial.current) {
        fetchInitialData();
      }
    }, );

    const fetchWeatherData = async (date: string) => {
    try {
        const res = await fetch(`/api/weather-forecasts/${parcelId}?date=${date}`);
        if (!res.ok) {
            if (res.status === 404) {
                return null; 
            }
        }
        return await res.json();
    } catch (err) {
        console.error('Fetch error:', err);
        return null;
    }
    };

    const handleError = (err: unknown) => {
      const message = err instanceof Error ? err.message : 'Failed to fetch weather data';
      setError(message);
      handleOpenSnackbar('error', message);
      console.error(err);
    };

    const handleDateChange = async (direction: 'prev' | 'next') => {
      if (!parcelId) return;

      try {
        setLoading(true);
        const newDate = direction === 'prev' ? getDateString(date, -1) : getDateString(date, 1);
        
        if (direction === 'prev' && weatherYesterday) {
            setWeatherTomorrow(weatherForecast);
            setWeatherForecast(weatherYesterday);
            const newYesterdayDate = getDateString(date, -2);
            const res = await fetch(`/api/weather-forecasts/${parcelId}?date=${newYesterdayDate}`);            
            if (res.ok) {
                const data = await res.json();
                setWeatherYesterday(data);
            } else {
                setWeatherYesterday(null);
            }
        } 
        else if (direction === 'next' && weatherTomorrow) {
            setWeatherYesterday(weatherForecast);
            setWeatherForecast(weatherTomorrow);
            const newTomorrowDate = getDateString(date, 2);
            const res = await fetch(`/api/weather-forecasts/${parcelId}?date=${newTomorrowDate}`);

            if (res.ok) {
            const data = await res.json();
                setWeatherTomorrow(data);
            } else {
                setWeatherTomorrow(null);
            }
        }
        
        setDate(newDate);
        setError(null);
        setLoading(false);
      } catch (err) {
        handleError(err);
      }
    };

    const isPreviousDisabled = !weatherYesterday;
    const isNextDisabled = !weatherTomorrow;

    const renderWeatherData = () => {
      if (!weatherForecast) return null;

      const weatherType = extractValue(weatherForecast.weatherType);
      const temperature = extractValue(weatherForecast.temperature);
      const feelsLike = extractValue(weatherForecast.feelLikesTemperature);
      const humidity = extractValue(weatherForecast.relativeHumidity);
      const pressure = extractValue(weatherForecast.atmosphericPressure);
      const windSpeed = extractValue(weatherForecast.windSpeed);
      const windDirection = extractValue(weatherForecast.windDirection);
      const visibility = extractValue(weatherForecast.visibility);
      const precipitation = extractValue(weatherForecast.precipitation);
      const uvIndex = extractValue(weatherForecast.uVIndexMax);

      const maxTempObj = extractValue(weatherForecast.dayMaximum);
      const minTempObj = extractValue(weatherForecast.dayMinimum);
      const maxTemp = typeof maxTempObj === 'object' ? maxTempObj?.temperature : 'N/A';
      const minTemp = typeof minTempObj === 'object' ? minTempObj?.temperature : 'N/A';

      return (
        <Box sx={{ mt: 2 }}>
          {/* Weather Type and Date */}
          <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              mb: 3,
          }}>
            <Chip
            label={weatherType}
            sx={{
                fontSize: '2rem',
                fontWeight: 700,
                color: colors.secondary, 
                backgroundColor: "white", 
                p: 3,
                borderRadius: '8px',
                mb: 3,
                '& .MuiChip-label': {
                p: 1,
                }
            }}
            />
                                      
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <IconButton 
                    onClick={() => handleDateChange('prev')}
                    disabled={loading || isPreviousDisabled}
                    size="small"
                    sx={{ 
                        mr: 1,
                        color: colors.primary.main, 
                        '&:hover': {
                        backgroundColor: colors.other.lightgrey 
                        }
                    }}
                    >
                    <ArrowBackIosIcon fontSize="small" />
                </IconButton>
                  
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {formatDisplayDate(date)}
                  </Typography>
                  
                <IconButton 
                    onClick={() => handleDateChange('next')}
                    disabled={loading || isNextDisabled}
                    size="small"
                    sx={{ 
                        mr: 1,
                        color: colors.primary.main, 
                        '&:hover': {
                        backgroundColor: colors.other.lightgrey 
                        }
                    }}
                    >
                    <ArrowForwardIosIcon fontSize="small" />
                </IconButton>
              </Box>
          </Box>

          {/* Main Temperature */}
          <Paper elevation={0} sx={{ 
              p: 3, 
              mb: 3,
              backgroundColor: 'rgba(0, 0, 0, 0.02)',
              borderRadius: '0.5rem'
          }}>
              <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                      <Typography variant="h4" component="div" sx={{ fontWeight: 700 }}>
                          {typeof temperature === 'number' ? `${temperature.toFixed(1)}°C` : 'N/A'}
                      </Typography>
                      <Typography variant="subtitle1" color="text.secondary">
                          Current Temperature
                      </Typography>
                  </Grid>
                  
                  {/* Temperature Details */}
                  <Grid item xs={12} md={6}>
                      <Grid container spacing={1}>
                          <Grid item xs={4}>
                              <TemperatureDisplay value={feelsLike} label="Feels Like" />
                          </Grid>
                          <Grid item xs={4}>
                              <TemperatureDisplay value={maxTemp} label="Maximum Temp" color="error.main" />
                          </Grid>
                          <Grid item xs={4}>
                              <TemperatureDisplay value={minTemp} label="Minimum Temp" color="info.main" />
                          </Grid>
                      </Grid>
                  </Grid>
              </Grid>
          </Paper>

          {/* Other Weather Data */}
          <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                  <WeatherDataCard title="Humidity & Pressure">
                      <Grid container spacing={1}>
                          <Grid item xs={6}>
                              <Typography variant="body2">Humidity:</Typography>
                              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                  {typeof humidity === 'number' ? `${humidity}%` : 'N/A'}
                              </Typography>
                          </Grid>
                          <Grid item xs={6}>
                              <Typography variant="body2">Pressure:</Typography>
                              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                  {typeof pressure === 'number' ? `${pressure.toFixed(0)} hPa` : 'N/A'}
                              </Typography>
                          </Grid>
                      </Grid>
                  </WeatherDataCard>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                  <WeatherDataCard title="Wind">
                      <Grid container spacing={1}>
                          <Grid item xs={6}>
                              <Typography variant="body2">Speed:</Typography>
                              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                  {typeof windSpeed === 'number' ? `${windSpeed.toFixed(1)} m/s` : 'N/A'}
                              </Typography>
                          </Grid>
                          <Grid item xs={6}>
                              <Typography variant="body2">Direction:</Typography>
                              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                  {typeof windDirection === 'number' ? `${windDirection.toFixed(0)}°` : 'N/A'}
                              </Typography>
                          </Grid>
                      </Grid>
                  </WeatherDataCard>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                  <WeatherDataCard title="Visibility & UV">
                      <Grid container spacing={1}>
                          <Grid item xs={6}>
                              <Typography variant="body2">Visibility:</Typography>
                              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                  {typeof visibility === 'number' ? `${(visibility / 1000).toFixed(1)} km` : 'N/A'}
                              </Typography>
                          </Grid>
                          <Grid item xs={6}>
                              <Typography variant="body2">UV Index:</Typography>
                              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                  {uvIndex !== 'N/A' ? uvIndex : 'N/A'}
                              </Typography>
                          </Grid>
                      </Grid>
                  </WeatherDataCard>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                  <WeatherDataCard title="Precipitation">
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {typeof precipitation === 'number' ? `${precipitation} mm` : 'N/A'}
                      </Typography>
                  </WeatherDataCard>
              </Grid>
          </Grid>
        </Box>
      );
    };

    const renderSkeleton = () => (
      <Box sx={{ p: 2 }}>
        <Skeleton variant="rectangular" height={80} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" height={120} sx={{ mb: 2 }} />
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Skeleton variant="rectangular" height={100} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Skeleton variant="rectangular" height={100} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Skeleton variant="rectangular" height={100} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Skeleton variant="rectangular" height={100} />
          </Grid>
        </Grid>
      </Box>
    );

    return (
      <Box sx={{ p: 2 }}>
        {!parcelId ? (
          <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: 200 
          }}>
              <Typography variant="h6" color="textSecondary">
                  Select a parcel to view weather data
              </Typography>
          </Box>
        ) : loading ? (
          renderSkeleton()
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : weatherForecast ? (
          renderWeatherData()
        ) : (
          <Typography>No weather data available for selected date</Typography>
        )}

        <GenericSnackbar
            type={snackbarState.type}
            message={snackbarState.message}
            open={snackbarState.open}
            setSnackbarState={setSnackbarState}
        />
      </Box>
    );
};

export default ParcelDrawerWeatherTab;