import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
ChartJS.register(ArcElement, Tooltip);


export function Donut({size, classes, color, borderColor, legends, label, cutout, total, value}) {

  total ??= 1;
  value ??= 1; 

  const percentage = ((value / total) * 100).toFixed(0) + '%';
  const isFull = value >= total;

  total -= value;

  const data = {
    labels: isFull ? (legends && legends[0] ? [legends[0]] : []) : legends ?? [],
    datasets: [
      {
        label: label,
        data: isFull ? [value] : [value,total],
        backgroundColor: isFull
          ? [color ?? 'rgba(255, 99, 132, 0.6)']
          : [
              color ?? 'rgba(255, 99, 132, 0.6)',
              'rgba(124, 124, 124, 0.2)',
            ],
        borderColor: isFull
          ? [borderColor ?? 'rgba(255, 99, 132, 1)']
          : [
              borderColor ?? 'rgba(255, 99, 132, 1)',
              'rgba(163, 163, 163, 0.35)',
            ],
        borderWidth: 1,
      },
    ], 
  };

  
const options = {
  devicePixelRatio: 2,
  cutout: cutout,
  plugins: {
    tooltip: {
      mode: 'nearest',
      intersect: false,
    },
    legend: {
      display: true, // Exibe as legendas
      position: 'bottom', // ou 'top', 'left', 'right'
    },
  },
};



  return (<div className={"donut " + classes ?? ""} style={{width: size, height: size}}>
      <Doughnut options={options}  data={data} /> 
      <div className='donut-percent'>
        {value}
      </div>
    </div>);
}