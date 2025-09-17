import { useState } from 'react'
import './App.css'
import InitialScreen from './components/InitialScreen'
import MeetingRoom from './components/MeetingRoom'

function App() {
  const [currentScreen, setCurrentScreen] = useState('initial'); // 'initial' or 'meeting'
  const [meetingData, setMeetingData] = useState(null);

  const handleMeetingStart = (data) => {
    setMeetingData(data);
    setCurrentScreen('meeting');
  };

  const handleLeaveMeeting = () => {
    setMeetingData(null);
    setCurrentScreen('initial');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {currentScreen === 'initial' && (
        <InitialScreen onMeetingStart={handleMeetingStart} />
      )}
      {currentScreen === 'meeting' && (
        <MeetingRoom 
          meetingData={meetingData} 
          onLeaveMeeting={handleLeaveMeeting} 
        />
      )}
    </div>
  )
}

export default App