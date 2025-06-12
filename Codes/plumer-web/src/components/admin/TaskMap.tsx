import React, { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { useAuth } from '../../contexts/AuthContext';

// Define the task type
interface Task {
  id: string;
  title: string;
  description: string;
  address: string;
  date: string;
  time: string;
  status: 'pending' | 'in-progress' | 'completed';
  location: {
    lat: number;
    lng: number;
  };
}

// Mock data for tasks (replace with actual data from Supabase)
const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Fix Leaking Pipe',
    description: 'Kitchen sink pipe is leaking and needs replacement',
    address: '123 Main St, New York, NY',
    date: '2025-06-12',
    time: '10:00 AM',
    status: 'pending',
    location: { lat: 40.7128, lng: -74.006 }
  },
  {
    id: '2',
    title: 'Bathroom Renovation',
    description: 'Complete bathroom renovation including new fixtures',
    address: '456 Park Ave, New York, NY',
    date: '2025-06-12',
    time: '2:00 PM',
    status: 'in-progress',
    location: { lat: 40.7282, lng: -73.9942 }
  },
  {
    id: '3',
    title: 'Water Heater Installation',
    description: 'Install new water heater in basement',
    address: '789 Broadway, New York, NY',
    date: '2025-06-12',
    time: '4:30 PM',
    status: 'pending',
    location: { lat: 40.7358, lng: -73.9911 }
  }
];

// Map container style
const containerStyle = {
  width: '100%',
  height: '500px',
  borderRadius: '8px',
  overflow: 'hidden'
};

// Default center (New York City)
const defaultCenter = {
  lat: 40.7128,
  lng: -74.0060
};

// Custom marker styles for the pulsing effect
const pulsingDotStyle = `
  @keyframes pulse {
    0% {
      transform: scale(0.5);
      opacity: 1;
    }
    70% {
      transform: scale(1.5);
      opacity: 0;
    }
    100% {
      transform: scale(0.5);
      opacity: 0;
    }
  }

  .map-marker {
    position: relative;
  }

  .map-marker-inner {
    width: 20px;
    height: 20px;
    background-color: #4ade80;
    border-radius: 50%;
    box-shadow: 0 0 10px rgba(74, 222, 128, 0.5);
  }

  .map-marker-pulse {
    position: absolute;
    top: -15px;
    left: -15px;
    width: 50px;
    height: 50px;
    background-color: rgba(74, 222, 128, 0.4);
    border-radius: 50%;
    animation: pulse 2s infinite;
  }
`;

const TaskMap: React.FC = () => {
  const { supabase } = useAuth();
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  // State for loading status
  const [isLoading, setLoading] = useState(true);

  // Load Google Maps API
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''
  });

  // Fetch tasks from Supabase (commented out for now, using mock data)
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        // Uncomment and modify this code when you have a tasks table in Supabase
        /*
        const { data, error } = await supabase
          .from('tasks')
          .select('*')
          .eq('date', new Date().toISOString().split('T')[0]);
        
        if (error) throw error;
        
        if (data) {
          setTasks(data);
        }
        */
        
        // For now, just use the mock data
        setTasks(mockTasks);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [supabase]);

  // Custom marker component with pulsing effect
  const PulsingMarker: React.FC<{ position: google.maps.LatLngLiteral; task: Task }> = ({ position, task }) => {
    return (
      <Marker
        position={position}
        onClick={() => setSelectedTask(task)}
        icon={{
          path: google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: '#4ade80',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2,
        }}
      />
    );
  };

  return (
    <div className="task-map-container">
      <style>{pulsingDotStyle}</style>
      
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Task Map</h2>
        <div className="flex items-center space-x-2">
          <span className="inline-block w-3 h-3 bg-green-400 rounded-full"></span>
          <span className="text-sm text-gray-600">Today's Tasks</span>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="h-96 w-full relative">
          {isLoading && <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75 z-10">Loading map...</div>}
          {isLoaded && (
            <>
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={defaultCenter}
                zoom={12}
                options={{
                  streetViewControl: false,
                  mapTypeControl: false,
                  fullscreenControl: false,
                }}
                onLoad={() => setLoading(false)}
              >
                {tasks.map((task) => (
                  <PulsingMarker 
                    key={task.id} 
                    position={task.location}
                    task={task}
                  />
                ))}
              </GoogleMap>
              
              {/* Task info panel */}
              {selectedTask && (
                <div className="absolute bottom-4 left-4 right-4 bg-white p-4 rounded-lg shadow-lg max-w-md">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-gray-900">{selectedTask.title}</h3>
                    <button 
                      onClick={() => setSelectedTask(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    <p>{selectedTask.description}</p>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <div>
                        <span className="block text-xs text-gray-500">Address</span>
                        <span>{selectedTask.address}</span>
                      </div>
                      <div>
                        <span className="block text-xs text-gray-500">Time</span>
                        <span>{selectedTask.time}</span>
                      </div>
                    </div>
                    <div className="mt-3">
                      <span className={`inline-block px-2 py-1 text-xs rounded-full 
                        ${selectedTask.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                          selectedTask.status === 'in-progress' ? 'bg-blue-100 text-blue-800' : 
                          'bg-green-100 text-green-800'}`}
                      >
                        {selectedTask.status === 'pending' ? 'Pending' : 
                         selectedTask.status === 'in-progress' ? 'In Progress' : 
                         'Completed'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      
      <div className="mt-4 text-sm text-gray-500">
        <p>Note: You'll need to add a valid Google Maps API key to your .env file (VITE_GOOGLE_MAPS_API_KEY) for the map to display properly.</p>
      </div>
    </div>
  );
};

export default TaskMap;
