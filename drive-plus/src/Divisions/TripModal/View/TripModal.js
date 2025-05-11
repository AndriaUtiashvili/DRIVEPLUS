import './tripModal.css'
import { Modal } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';

function TripModalView({show, setShow, trip}) {
    return (
        trip &&
        <Modal show={show} onHide={() => {setShow(false)}}>
        <Modal.Header closeButton>
          <Modal.Title>Trip Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className='trip-details'>
                <div className='base-details'>
                    <div className='trip-detail'>
                        <p>Trip Date:</p> <span>{trip.date}</span>
                    </div>
                    <div className='trip-detail'>
                        <p>Pick Up State:</p> <span>{trip.pickupStateFull}</span>
                    </div>
                    <div className='trip-detail'>
                        <p>Drop Off State:</p> <span>{trip.dropoffStateFull}</span>
                    </div>
                    <div className='trip-detail'>
                        <p>Mileage:</p> <span>{trip.mileage}</span>
                    </div>
                    <div className='trip-detail'>
                        <p>Transported Vehicle:</p> <span>{trip.vehicle}</span>
                    </div>
                </div>
                <div className='profit-details'>
                    <div className='profit-details-column'>
                        <div className='profit-details-element'>
                            <h6>Price</h6>
                            <h7>${trip.amount}.00</h7>
                        </div>
                        <div className='profit-details-element'>
                            <h6>Fuel Cost</h6>
                            <h7>${trip.fuelprice}</h7>
                        </div>
                        <div style={{borderBottom: "0"}} className='profit-details-element'>
                            <h6>Profit</h6>
                            <h7>${Number(trip.profit).toFixed(2)}</h7>
                        </div>
                    </div>
                    <div className='profit-details-column' style={{borderRight: "0"}}>
                        <div className='profit-details-element'>
                            <h6>Price / Mile</h6>
                            <h7>${Number(trip.amount / trip.mileage).toFixed(2)}</h7>
                        </div>
                        <div className='profit-details-element'>
                            <h6>Fuel / Mile</h6>
                            <h7>${Number((trip.amount - trip.profit) / trip.mileage).toFixed(2)}</h7>
                        </div>
                        <div style={{borderBottom: "0"}} className='profit-details-element'>
                            <h6>Profit / Mile</h6>
                            <h7>${Number(trip.profit / trip.mileage).toFixed(2)}</h7>
                        </div>
                    </div>
                </div>
            </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => {setShow(false)}}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    )
}

export default TripModalView;