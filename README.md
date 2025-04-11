# 🎬 Dự Án Đặt Lịch Xem Phim

[![Status](https://img.shields.io/badge/Status-Đang%20Phát%20Triển-brightgreen)](https://github.com/BanhCute/DatLichXemPhim)
[![React](https://img.shields.io/badge/Frontend-React-blue)](https://reactjs.org/)
[![Node.js](https://img.shields advantageously.com/ajax/libs/react/18.2.0/umd/react.production.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/7.23.2/babel.min.js"></script>
<script src="https://unpkg.com/papaparse@latest/papaparse.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/recharts/2.15.0/Recharts.min.js"></script>

<div id="root"></div>

<script type="text/babel">
  const { useState, useEffect } = React;
  const { createRoot } = ReactDOM;
  const { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } = Recharts;

  function App() {
    const [data, setData] = useState([]);

    useEffect(() => {
      // Load CSV data
      const csvData = loadFileData("movies.csv");
      Papa.parse(csvData, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        transformHeader: (header) => header.trim().replace(/^"|"$/g, ''),
        transform: (value, header) => {
          const cleaned = value.trim().replace(/^"|"$/g, '');
          const booleanMap = { "true": true, "false": false };
          const booleanValue = booleanMap[cleaned.toLowerCase()];
          return booleanValue !== undefined ? booleanValue : cleaned;
        },
        complete: (results) => {
          setData(results.data);
        },
        error: (err) => console.error("Error parsing CSV:", err),
      });
    }, []);

    // Aggregate data by genre for visualization
    const genreCount = data.reduce((acc, item) => {
      const genre = item["Genre"] || "Unknown";
      acc[genre] = (acc[genre] || 0) + 1;
      return acc;
    }, {});

    const chartData = Object.keys(genreCount).map((genre) => ({
      genre,
      count: genreCount[genre],
    }));

    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-center mb-6">Movie Booking Data Analysis</h1>

        {/* Summary */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Summary</h2>
          <p className="text-gray-700">
            This report analyzes the movie dataset to uncover trends in movie genres and their popularity.
            The data includes information about movies, such as titles, genres, and other attributes.
            We focus on the distribution of genres to understand which types of movies are most common.
          </p>
        </section>

        {/* Visualization */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Genre Distribution</h2>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="genre" label={{ value: "Genre", position: "insideBottom", offset: -5, fontSize: 12 }} />
              <YAxis label={{ value: "Number of Movies", angle: -90, position: "insideLeft", fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
          <p className="text-gray-600 mt-2">
            This chart shows the number of movies per genre. Hover over the line to see exact counts.
          </p>
        </section>

        {/* Interesting Fact */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Interesting Fact</h2>
          <p className="text-gray-700">
            Did you know? The dataset reveals a surprising diversity in genres, with some niche categories
            having more representation than expected. For example, if horror movies dominate, it might
            reflect a cultural fascination with thrillers during certain seasons!
          </p>
        </section>

        {/* Conclusion */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Conclusion</h2>
          <p className="text-gray-700">
            The analysis highlights the diversity of movie genres in the dataset, providing insights into
            audience preferences. This can guide cinema scheduling and marketing strategies to focus on
            popular genres. Further analysis could explore trends over time or by region to optimize
            movie offerings.
          </p>
        </section>
      </div>
    );
  }

  const container = document.getElementById("root");
  const root = createRoot(container);
  root.render(<App />);
</script>
