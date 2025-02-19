import { ReservationService } from "../../services/reservation";

const reservationResolver={
    Mutation:{
        createReservation:ReservationService.createReservation,
    }
};
export default reservationResolver;
