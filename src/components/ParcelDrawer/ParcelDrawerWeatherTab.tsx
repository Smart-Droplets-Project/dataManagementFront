import { useState, useEffect } from "react";
import { 
  Box, 
  IconButton, 
  Typography, 
  CircularProgress, 
  Grid,
  Paper,
  Divider,
  Chip
} from "@mui/material";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import GenericSnackbar from "@/components/GenericSnackbar";
import { WeatherForecast } from "@/lib/interfaces";

const ParcelDrawerWeatherTab = (props: { selectedParcel: GeoJSON.Feature | null }) => {
    const { selectedParcel } = props;
    const parcelId = selectedParcel?.properties?.id || selectedParcel?.id;
    
    const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [WeatherForecast, setWeatherForecast] = useState<WeatherForecast | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    
    const [snackbarState, setSnackbarState] = useState({
        open: false,
        type: 'info' as 'success' | 'error' | 'info',
        message: '',
    });

    const handleOpenSnackbar = (type: 'success' | 'error' | 'info', message: string) => {
        setSnackbarState({ open: true, type, message });
    };

    const handleDateChange = (direction: 'prev' | 'next') => {
        const currentDate = new Date(date);
        if (direction === 'prev') {
            currentDate.setDate(currentDate.getDate() - 1);
        } else {
            currentDate.setDate(currentDate.getDate() + 1);
        }
        setDate(currentDate.toISOString().split('T')[0]);
    };

    useEffect(() => {
        if (!parcelId) return;

        const fetchWeatherData = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/weather-forecasts/${parcelId}?date=${date}`);
                
                if (!res.ok) {
                    throw new Error(await res.text());
                }
                
                const data = await res.json();
                setWeatherForecast(data);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
                handleOpenSnackbar('error', 'Failed to fetch weather data');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchWeatherData();
    }, [parcelId, date]);

    const formatDisplayDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    const renderWeatherData = () => {
        if (!WeatherForecast) return null;

        const extractValue = (property: any) => {
            if (!property) return 'N/A';
            if (typeof property === 'object' && 'value' in property) {
                return property.value;
            }
            return property;
        };

        // Glavni podaci
        const weatherType = extractValue(WeatherForecast.weatherType);
        const temperature = extractValue(WeatherForecast.temperature);
        const feelsLike = extractValue(WeatherForecast.feelLikesTemperature);
        const humidity = extractValue(WeatherForecast.relativeHumidity);
        const pressure = extractValue(WeatherForecast.atmosphericPressure);
        const windSpeed = extractValue(WeatherForecast.windSpeed);
        const windDirection = extractValue(WeatherForecast.windDirection);
        const visibility = extractValue(WeatherForecast.visibility);
        const precipitation = extractValue(WeatherForecast.precipitation);
        const uvIndex = extractValue(WeatherForecast.uVIndexMax);

        // Max i min temperature
        const maxTempObj = extractValue(WeatherForecast.dayMaximum);
        const minTempObj = extractValue(WeatherForecast.dayMinimum);
        const maxTemp = typeof maxTempObj === 'object' ? maxTempObj?.temperature : 'N/A';
        const minTemp = typeof minTempObj === 'object' ? minTempObj?.temperature : 'N/A';

        return (
            <Box sx={{ mt: 2 }}>
                {/* Weather Type and Date */}
                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    mb: 3
                }}>
                    <Chip
                    label={weatherType}
                    sx={{
                        fontSize: '2rem',
                        fontWeight: 700,
                        color: 'text.primary',
                        backgroundColor: 'rgba(0, 0, 0, 0.05)',
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
                            disabled={loading}
                            size="small"
                            sx={{ mr: 1 }}
                        >
                            <ArrowBackIosIcon fontSize="small" />
                        </IconButton>
                        
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {formatDisplayDate(date)}
                        </Typography>
                        
                        <IconButton 
                            onClick={() => handleDateChange('next')}
                            disabled={loading}
                            size="small"
                            sx={{ ml: 1 }}
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
                                    <Paper sx={{ p: 1.5, textAlign: 'center', borderRadius: '0.5rem' }}>
                                        <Typography variant="body2" color="text.secondary">
                                            Feels Like
                                        </Typography>
                                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                            {typeof feelsLike === 'number' ? `${feelsLike.toFixed(1)}°C` : 'N/A'}
                                        </Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={4}>
                                    <Paper sx={{ p: 1.5, textAlign: 'center', borderRadius: '0.5rem' }}>
                                        <Typography variant="body2" color="text.secondary">
                                            Max Temp
                                        </Typography>
                                        <Typography variant="h6" sx={{ color: 'error.main', fontWeight: 600 }}>
                                            {typeof maxTemp === 'number' ? `${maxTemp.toFixed(1)}°C` : 'N/A'}
                                        </Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={4}>
                                    <Paper sx={{ p: 1.5, textAlign: 'center', borderRadius: '0.5rem' }}>
                                        <Typography variant="body2" color="text.secondary">
                                            Min Temp
                                        </Typography>
                                        <Typography variant="h6" sx={{ color: 'info.main', fontWeight: 600 }}>
                                            {typeof minTemp === 'number' ? `${minTemp.toFixed(1)}°C` : 'N/A'}
                                        </Typography>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Paper>

                {/* Other Weather Data */}
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <Paper elevation={0} sx={{ p: 2, borderRadius: '0.5rem' }}>
                            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>Humidity & Pressure</Typography>
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
                        </Paper>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                        <Paper elevation={0} sx={{ p: 2, borderRadius: '0.5rem' }}>
                            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>Wind</Typography>
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
                        </Paper>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                        <Paper elevation={0} sx={{ p: 2, borderRadius: '0.5rem' }}>
                            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>Visibility & UV</Typography>
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
                        </Paper>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                        <Paper elevation={0} sx={{ p: 2, borderRadius: '0.5rem' }}>
                            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>Precipitation</Typography>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                {typeof precipitation === 'number' ? `${precipitation} mm` : 'N/A'}
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        );
    };

    return (
        <Box sx={{ p: 2 }}>
            {/* Weather Data Display */}
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
                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    height: 300 
                }}>
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Typography color="error">{error}</Typography>
            ) : WeatherForecast ? (
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