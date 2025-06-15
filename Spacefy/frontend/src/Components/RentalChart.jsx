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
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `Quantidade de aluguéis: ${context.raw}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        },
        title: {
          display: true,
          text: 'Quantidade de Aluguéis'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Data'
        }
      }
    },
    maintainAspectRatio: false
  };

  // Função para gerar uma descrição textual dos dados do gráfico
  const generateChartDescription = () => {
    if (!chartData.labels.length) return 'Nenhum dado disponível para exibição.';
    
    const maxRentals = Math.max(...chartData.datasets[0].data);
    const totalRentals = chartData.datasets[0].data.reduce((a, b) => a + b, 0);
    const dates = chartData.labels.join(', ');
    
    return `Gráfico de barras mostrando a quantidade de aluguéis por dia. 
            Total de ${totalRentals} aluguéis registrados. 
            Maior quantidade de aluguéis em um único dia: ${maxRentals}. 
            Datas registradas: ${dates}.`;
  };

  return (
    <div 
      style={{ width: '100%', height: '400px', padding: '20px' }}
      role="img"
      aria-label="Gráfico de quantidade de aluguéis por dia"
      aria-describedby="chart-description"
    >
      <div id="chart-description" className="sr-only">
        {generateChartDescription()}
      </div>
      <Bar 
        data={chartData} 
        options={options}
        aria-hidden="true"
      />
    </div>
  );
};

export default RentalChart; 