import 'bootstrap/dist/css/bootstrap.css';
import Datetime from './Datetime';

function App() {
  return (
    <div className='App'>
      <Datetime minDate='today' maxDate='2023-06-05' />
    </div>
  );
}

export default App;
