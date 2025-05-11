import Modal from 'react-bootstrap/Modal';
import { Button } from 'react-bootstrap';
import Select from 'react-select';
import { useEffect, useState } from 'react';
import './tripModal.css';

import GetVehicles from '../../../API/GetVehicles';
import GetStates from '../../../API/GetStates';
import AddTripApi from '../../../API/AddTrip';
import EditTripApi from '../../../API/EditTrip';
import CalculateProfitApi from '../../../API/CalculateProfit';

function TripModalConfigure({show, setShow, trip, setTrips}) {
    const [states, setStates] = useState([{
        value: null,
        label: null
    }]);
    const [vehicles, setVehicles] = useState([{
        value: null,
        label: null
    }]);
    useEffect(() => {
        async function fetchData() {
            const [vehiclesResponse, statesResponse] = await Promise.all([GetVehicles(), GetStates()]);
    
            const formattedVehicles = vehiclesResponse.map(vehicle => ({
                value: vehicle.id,
                label: vehicle.name
            }));
    
            const formattedStates = statesResponse.map(state => ({
                value: state.id,
                label: state.state
            }));
    
            setVehicles(formattedVehicles);
            setStates(formattedStates);
        }
    
        if (show) {
            fetchData();
        }
    }, [trip, show]);

    return (
        vehicles !== null && states !== null &&
        (
        trip === null ? 
        <AddTrip show={show} setShow={setShow} vehicles={vehicles} states={states}
        setTrips={setTrips}/> 
        : 
        <EditTrip show={show} setShow={setShow} trip={trip} vehicles={vehicles} states={states}
        setTrips={setTrips} />
        )
    )
}

function AddTrip({show, setShow, vehicles, states, setTrips}) {
    const [tripToAdd, setTripToAdd] = useState({
        date: '',
        pickupStateId: 0,
        dropoffStateId: 0,
        vehicleId: 0,
        mileage: 0,
        amount: 0,
        fuelprice: 0
    });

    const [profit, setProfit] = useState(null);

    async function handleSubmit() {
        if(tripToAdd.date.trim() === '' ||
        tripToAdd.pickupStateId === null || tripToAdd.pickupStateId <= 0 ||
        tripToAdd.dropoffStateId === null || tripToAdd.dropoffStateId <= 0 ||
        tripToAdd.vehicleId === null || tripToAdd.vehicleId <= 0 ||
        tripToAdd.mileage === null || tripToAdd.mileage <= 0  ||
        tripToAdd.fuelprice === null || tripToAdd.fuelprice <= 0  ||
        tripToAdd.amount === null || tripToAdd.amount <= 0 
        )
            return;
        
        const resp = await AddTripApi(tripToAdd)
        ;
        setTrips(prev => [...prev, resp]);

        setShow(false);
    }

    async function CalculateProfit() {
        var model = {
            vehicle_id: tripToAdd.vehicleId,
            mileage: tripToAdd.mileage,
            amount: tripToAdd.amount,
            fuel_cost: tripToAdd.fuelprice
        }

        if(model.vehicle_id <= 0 || model.vehicle_id == null ||
            model.mileage <= 0 || model.mileage == null ||
            model.amount <= 0 || model.amount == null ||
            model.fuel_cost <= 0 || model.fuel_cost == null
        )
            return;
        
        const resp = await CalculateProfitApi(model)

        setProfit(resp.profit);
    }

    return (
        <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Trip</Modal.Title>
        </Modal.Header>
        <Modal.Body className='scrollabe-body'>
        <div class="mb-3">
            <label for="trip-date" class="form-label">Trip Date:</label>
            <br />
            <input onChange={(e) => setTripToAdd(trip => ({...trip, date: e.target.value}))} 
            type="date" class="form-control" id="trip-date" placeholder="Trip Date" />
        </div>
        <div class="mb-3">
            <label for="trip-pickup" class="form-label">Pick Up State:</label>
            <Select
            onChange={(selected) => setTripToAdd(trip => ({...trip, pickupStateId: selected.value}))} 
            placeholder="Select Pick Up State"
            options={states}
            isClearable
            />
        </div>
        <div class="mb-3">
            <label for="trip-dropoff" class="form-label">Drop Off State:</label>
            <Select
            onChange={(selected) => setTripToAdd(trip => ({...trip, dropoffStateId: selected.value}))} 
            placeholder="Select Drop Off Up State"
            options={states}
            isClearable
            />
        </div>
        <label for="trip-mileage" class="form-label">Mileage:</label>
        <div class="mb-3 input-group">
            <input onChange={(e) => setTripToAdd(trip => ({...trip, mileage: e.target.value}))}  
            type="number" class="form-control" id="trip-mileage" placeholder="Mileage" />
            <span class="input-group-text">mi</span>
        </div>
        <div class="mb-3">
            <label for="trip-vehicle" class="form-label">Vehicle To Transport:</label>
            <Select
            onChange={(selected) => setTripToAdd(trip => ({...trip, vehicleId: selected.value}))} 
            placeholder="Select Vehicle"
            options={vehicles}
            isClearable
            />
        </div>
        <label for="trip-price" class="form-label">Fuel Price per Gallon:</label>
        <div class="mb-3 input-group">
            <span class="input-group-text">$</span>
            <input onChange={(e) => setTripToAdd(trip => ({...trip, fuelprice: e.target.value}))}
            type="number" id="trip-price" class="form-control" placeholder="Fuel Price" />
        </div>
        <label for="trip-amount" class="form-label">Amount You are Being Paid:</label>
        <div class="mb-3 input-group">
            <span class="input-group-text">$</span>
            <input  onChange={(e) => setTripToAdd(trip => ({...trip, amount: e.target.value}))}
            type="number" id="trip-amount" class="form-control" placeholder="Amount" />
            <span class="input-group-text">.00</span>
        </div>

        {profit && <p>Estimated Profit: ${Number(profit).toFixed(2)}</p>}
        </Modal.Body>
        <Modal.Footer>
            <Button variant="success" onClick={() => CalculateProfit()}>
            Calculate Profit
          </Button>
          <Button variant="primary" onClick={() => handleSubmit()}>
            Add Trip!
          </Button>
        </Modal.Footer>
      </Modal> 
    )
}

function EditTrip({show, setShow, trip, vehicles, states, setTrips}) {

    const [selectedPickup, setSelectedPickup] = useState({
        label: 0,
        value: ''
    });

    const [selectedDropoff, setSelectedDropoff] = useState({
        label: 0,
        value: ''
    });

    const [selectedVehicle, setSelectedVehicle] = useState({
        label: 0,
        value: ''
    });

    const [tripToEdit, setTripToEdit] = useState({
        date: '',
        pickupStateId: 0,
        dropoffStateId: 0,
        vehicleId: 0,
        mileage: 0,
        fuelprice: 0,
        amount: 0,
        profit: 0
    })

    async function RecalculateProfit() {
        var model = {
            vehicle_id: selectedVehicle.value,
            mileage: tripToEdit.mileage,
            amount: tripToEdit.amount,
            fuel_cost: tripToEdit.fuelprice
        }

        if(model.vehicle_id <= 0 || model.vehicle_id == null ||
            model.mileage <= 0 || model.mileage == null ||
            model.amount <= 0 || model.amount == null ||
            model.fuel_cost <= 0 || model.fuel_cost == null
        )
            return;
        
        const resp = await CalculateProfitApi(model)

        setTripToEdit(x => ({...x, profit: resp.profit}));
    }

    useEffect(() => {
        setTripToEdit(x => ({
            date: trip.date,
            pickupStateId: trip.pickupStateId,
            dropoffStateId: trip.dropoffStateId,
            vehicleId: trip.vehicleId,
            mileage: trip.mileage,
            fuelprice: trip.fuelprice,
            amount: trip.amount,
            profit: trip.profit
        }))

        setSelectedPickup(x => ({
            label: trip.pickupStateFull,
            value: trip.pickupStateId
        }))

        setSelectedDropoff(x => ({
            label: trip.dropoffStateFull,
            value: trip.dropoffStateId
        }));

        setSelectedVehicle(x => ({
            label: trip.vehicle,
            value: trip.vehicleId
         }));

    }, [trip])

    async function handleEdit() {
        if (
            tripToEdit.date.trim() === '' ||
            tripToEdit.mileage === null || tripToEdit.mileage <= 0 ||
            tripToEdit.fuelprice === null || tripToEdit.fuelprice <= 0 ||
            tripToEdit.amount === null || tripToEdit.amount <= 0
        ) {
            return;
        }
    
        const updatedTrip = {
            ...tripToEdit,
            pickupStateId: selectedPickup.value,
            dropoffStateId: selectedDropoff.value,
            vehicleId: selectedVehicle.value
        };
    
        const resp = await EditTripApi(updatedTrip, trip.id);
        setTrips(prev => 
            prev.map(t => 
              t.id === trip.id ? resp : t
            )
          );
        setShow(false);
    }
    
    return (
        <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Trip</Modal.Title>
        </Modal.Header>
        <Modal.Body className='scrollabe-body'>
        <div class="mb-3">
            <label for="trip-date" class="form-label">Trip Date:</label>
            <br />
            <input value={tripToEdit.date} onChange={(e) => {setTripToEdit(x => ({
                ...x, date: e.target.value
            }))}}
            type="date" class="form-control" id="trip-date" placeholder="Trip Deadline" />
        </div>
        <div class="mb-3">
            <label for="trip-pickup" class="form-label">Pick Up State:</label>
            <Select
            value={selectedPickup}
            options={states}
            onChange={(option) => {
                setSelectedPickup(x => ({
                    ...x,
                    value: option.value,
                    label: option.label
                }));
            }}
            
            placeholder="Select Pick Up State"
            isClearable
            />
        </div>
        <div class="mb-3">
            <label for="trip-dropoff" class="form-label">Drop Off State:</label>
            <Select
            value={selectedDropoff}
            options={states}
            onChange={(option) => {
                setSelectedDropoff(x => ({
                    ...x,
                    value: option.value,
                    label: option.label
                }));
            }}
            
            placeholder="Select Drop Off State"
            isClearable
            />
        </div>
        <label for="trip-mileage" class="form-label">Mileage:</label>
        <div class="mb-3 input-group">
            <input type="number" class="form-control"
            value={tripToEdit.mileage} onChange={(e) => {setTripToEdit(x => ({
                ...x, mileage: e.target.value
            }))}}
             id="trip-mileage" placeholder="Mileage" />
            <span class="input-group-text">mi</span>
        </div>
        <div class="mb-3">
            <label for="trip-vehicle" class="form-label">Vehicle To Transport:</label>
            <Select
            value={selectedVehicle}
            options={vehicles}
            onChange={(option) => {
                setSelectedVehicle(x => ({
                    ...x,
                    value: option.value,
                    label: option.label
                }));
            }}          
            placeholder="Select Vehicle"
            isClearable
            />
        </div>
        <label for="trip-price" class="form-label">Fuel Price per Gallon:</label>
        <div class="mb-3 input-group">
            <span class="input-group-text">$</span>
            <input value={tripToEdit.fuelprice} onChange={(e) => {setTripToEdit(x => ({
                ...x, fuelprice: e.target.value
            }))}}
            type="number" id="trip-price" class="form-control" placeholder="Fuel Price" />
        </div>
        <label for="trip-amount" class="form-label">Amount You are Being Paid:</label>
        <div class="mb-3 input-group">
            <span class="input-group-text">$</span>
            <input type="number" id="trip-amount" value={tripToEdit.amount} onChange={(e) => {setTripToEdit(x => ({
                ...x, amount: e.target.value
            }))}}
            class="form-control" placeholder="Amount" />
            <span class="input-group-text">.00</span>
        </div>
        {tripToEdit.profit && <p>Estimated Profit: ${Number(tripToEdit.profit).toFixed(2)}</p>}
        </Modal.Body>
        <Modal.Footer>
            <Button variant="success" onClick={() => RecalculateProfit()}>
            Recalculate Profit
          </Button>
          <Button variant="primary" onClick={() => handleEdit()}>
            Save Trip!
          </Button>
        </Modal.Footer>
      </Modal> 
    )
}

export default TripModalConfigure;