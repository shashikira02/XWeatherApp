import { useState } from "react";
import styles from "/src/App.module.css";
const API_URL = "https://api.weatherapi.com/v1/current.json";
const API_KEY = "baee6b3cfa614321b1f230524252007";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);

  const [showAlert, setShowAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");

  function showCustomAlert(msg) {
    setAlertMsg(msg);
    setShowAlert(true);
  }
  function closeAlert() {
    setShowAlert(false);
  }

  const handleInputChange = (e) => {
    setCity(e.target.value);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!city.trim()) return;

    setLoading(true);
    setWeather(null);

    try {
      const url = `${API_URL}?key=${API_KEY}&q=${encodeURIComponent(city)}`;
      const response = await fetch(url);

      if (!response.ok) throw new Error("Error: Not ok");
      const data = await response.json();
      if (!data || !data.current) throw new Error("Invalid data");

      setWeather({
        temp: data.current.temp_c,
        humidity: data.current.humidity,
        condition: data.current.condition.text,
        wind: data.current.wind_kph,
      });
    } catch {
      showCustomAlert("Failed to fetch weather data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.searchBarWrapper}>
          <form onSubmit={handleSearch} className={styles.searchForm}>
            <input
              type="text"
              value={city}
              onChange={handleInputChange}
              placeholder="Enter city name"
              className={styles.input}
            />
            <button type="submit" className={styles.button}>
              Search
            </button>
          </form>
          {loading && <p className={styles.loadingMsg}>Loading data...</p>}
        </div>
        {weather && (
          <div className={styles['weather-cards']}>
            <div className={styles["weather-card"]}>
              <b>Temperature</b>
              <div>{weather.temp}°C</div>
            </div>
            <div className={styles["weather-card"]}>
              <b>Humidity</b>
              <div>{weather.humidity}%</div>
            </div>
            <div className={styles["weather-card"]}>
              <b>Condition</b>
              <div>{weather.condition}</div>
            </div>
            <div className={styles["weather-card"]}>
              <b>Wind Speed</b>
              <div>{weather.wind} kph</div>
            </div>
          </div>
        )}
      </div>
      {showAlert && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(30,40,60,0.16)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "12px",
              minWidth: "320px",
              boxShadow: "0 2px 12px 2px #e9eef1",
              textAlign: "center",
              padding: "32px 8px 24px 8px",
            }}
          >
            <div style={{ fontSize: 18, marginBottom: 24 }}>
              Failed to fetch weather data
            </div>
            <button
              style={{
                background:
                  "linear-gradient(90deg, #005f5fff 0%, #1b7f78ff 100%)",
                color: "#fff",
                fontWeight: 500,
                fontSize: "16px",
                border: "none",
                borderRadius: "8px",
                padding: "8px 32px",
                marginTop: "10px",
                cursor: "pointer",
              }}
              onClick={closeAlert}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
