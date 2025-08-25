export class SeatAssignmentService {
    
   async assignSeatsToPassengers(passengers, allSeats) {
  let seatAssignments = allSeats
  let setPassengers = passengers
  let reserveSeatPassangers = setPassengers.filter(p => p.seat_id !== null)

  const groupBypurchase = (id) => setPassengers.filter(p => p.purchase_id === id)
  const seatType = (list, money) => list.filter(e => e.seat_type_id === money)

// Funciones auxiliares para manejar letras de columnas
const getNextColumn = (column) => {
  return String.fromCharCode(column.charCodeAt(0) + 1);
};

const getPrevColumn = (column) => {
  return String.fromCharCode(column.charCodeAt(0) - 1);
};

const getAdjacentColumns = (column) => {
  const next = getNextColumn(column);
  const prev = getPrevColumn(column);
  return [next, prev];
};

const toReserve = (money, r) => {
  let newKid = groupBypurchase(r.purchase_id).find(p => 
    (p.age < 18) && (p.seat_id === null) && (p.seat_type_id === money)
  );
  
  let adultSeat = seatAssignments.find(s => 
    (s.seat_id === r.seat_id) && (s.seat_type_id === money)
  );
  
  if (adultSeat && newKid) {
    if (adultSeat.seat_id !== null) {
      seatAssignments = seatAssignments.filter(s => s.seat_id !== adultSeat.seat_id);
      setPassengers = setPassengers.filter(s => s.passenger_id !== r.passenger_id)
    }
    
    // Obtener columnas adyacentes
    const [nextCol, prevCol] = getAdjacentColumns(adultSeat.seat_column);
    
    let newSeat = seatType(seatAssignments, money).find(n => 
      n.seat_row === adultSeat.seat_row && 
      ((n.seat_column === nextCol) || (n.seat_column === prevCol))
    );
    // Si no se encuentra asiento adyacente, newKid.seat_id será null
    newKid.seat_id = newSeat ? newSeat.seat_id : null;
    
    if (newKid.seat_id !== null) {
      seatAssignments = seatAssignments.filter(s => s.seat_id !== newKid.seat_id);
      reserveSeatPassangers.push(newKid);
      setPassengers = setPassengers.filter(s => s.passenger_id !== newKid.passenger_id)

    }
  }
};
    setPassengers.sort((a, b) => a.boarding_pass_id - b.boarding_pass_id);
    setPassengers.map(r => {
        toReserve(3, r)
        toReserve(2, r)
        toReserve(1, r)
    })

const seatAssignmentsAfter = (money, r) => {
  let adultSeat = seatAssignments.find(s => (r.seat_id === null) && (r.seat_type_id === money));
  
  // Solo continuar si existe el asiento del adulto
  if (!adultSeat) return;
  
  r.seat_id = adultSeat.seat_id;
  reserveSeatPassangers.push(r);
  setPassengers = setPassengers.filter(s => s.passenger_id !== r.passenger_id)
  
  let newKid = groupBypurchase(r.purchase_id).find(p => 
    (p.age < 18) && (p.seat_id === null) && (p.seat_type_id === money)
  );
  
  if (adultSeat.seat_id !== null) {
    seatAssignments = seatAssignments.filter(s => s.seat_id !== adultSeat.seat_id);
  }
  
  if (newKid) {
    // Obtener columnas adyacentes usando las funciones auxiliares
    const [nextColumn, prevColumn] = getAdjacentColumns(adultSeat.seat_column);
    
    let newSeat = seatType(seatAssignments, money).find(n => 
      n.seat_row === adultSeat.seat_row && 
      (n.seat_column === nextColumn || n.seat_column === prevColumn)
    );
    
    // Si no se encuentra asiento adyacente, newKid.seat_id será null
    newKid.seat_id = newSeat ? newSeat.seat_id : null;
    
    if (newKid.seat_id !== null) {
      seatAssignments = seatAssignments.filter(s => s.seat_id !== newKid.seat_id);
      reserveSeatPassangers.push(newKid);
      setPassengers = setPassengers.filter(s => s.passenger_id !== newKid.passenger_id)
    }
  }
};
   setPassengers.map(r => {
         seatAssignmentsAfter(3, r)
         seatAssignmentsAfter(2, r)
         seatAssignmentsAfter(1, r)
    })

  return reserveSeatPassangers;
}
} 