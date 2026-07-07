import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Projects Completed',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: '#F59E0B',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: 'Monthly Projects' },
    },
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Dashboard Summary</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[{ title: 'Total Projects', count: '150+', icon: '🏢' },
          { title: 'Total Layanan', count: '8', icon: '🛠️' },
          { title: 'Testimoni', count: '45', icon: '💬' },
          { title: 'Pesan Masuk', count: '12', icon: '📬' }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">{stat.title}</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{stat.count}</h3>
            </div>
            <div className="text-3xl">{stat.icon}</div>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 max-w-3xl">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default Dashboard;
