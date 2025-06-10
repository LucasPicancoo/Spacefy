import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { rentalService } from '../services/rentalService';

// Registra os componentes necessários do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const RentalChart = ({ spaceId }) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await rentalService.getRentedDatesBySpace(spaceId);
        const dates = response.dates;

        // Agrupa os dados por data e conta a quantidade de aluguéis
        const rentalsByDate = dates.reduce((acc, curr) => {
          const date = new Date(curr.date);
          const formattedDate = date.toLocaleDateString('pt-BR');
          acc[formattedDate] = (acc[formattedDate] || 0) + curr.times.length;
          return acc;
        }, {});

        // Prepara os dados para o gráfico
        const labels = Object.keys(rentalsByDate);
        const data = Object.values(rentalsByDate);

        setChartData({
          labels,
          datasets: [
            {
              label: 'Quantidade de Aluguéis',
              data,
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1
            }
          ]
        });
      } catch (error) {
        console.error('Erro ao buscar dados para o gráfico:', error);
      }
    };

    if (spaceId) {
      fetchData();
    }
  }, [spaceId]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Quantidade de Aluguéis por Dia',
        font: {
          size: 16
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  };

  return (
    <div style={{ width: '100%', height: '400px', padding: '20px' }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default RentalChart; 