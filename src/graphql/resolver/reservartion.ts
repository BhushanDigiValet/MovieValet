import { ReservationService } from "../../services/reservation";

const reservationResolver={
    Query:{
        getReservations:ReservationService.getReservations,
    },
    Mutation:{
        createReservation:ReservationService.createReservation,
        cancelReservation:ReservationService.cancelReservation,
    }
};
export default reservationResolver;
