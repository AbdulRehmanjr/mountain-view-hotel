type RoomProps = {
    roomId: string
    code: string
    roomName: string
    capacity: number
    area: number
    features: string[]
    description: string
    roomType: string
    dp: string
    beds: number
    quantity: number
    price: number
    pictures: string[]
    hotelId: string
}

type RoomHotelProps = {
    roomId: string
    code: string
    roomName: string
    capacity: number
    area: number
    features: string[]
    description: string
    roomType: string
    dp: string
    beds: number
    quantity: number
    price: number
    pictures: string[]
    hotelId: string
    hotel: {
        hotelName: string;
        island: string;
        address:string
        longitude: number;
        latitude: number;
    }
}

type FilteredPricesProps = {
    rrpId: string;
    rateId: string;
    roomId: string;
    quantity: number;
    hotelName: string;
    hotelId: string;
    RoomPrice: {
        startDate: string;
        endDate: string;
        price: number;
        planCode: string;
    }[];
}

type BookingInfoProps = {
    bookingDetailId: string
    city: string
    country: string
    phone: string
    zip: string
    address: string
    firstName: string
    lastName: string
    email: string
    arrivalTime: string
}

type SUErrorProps = {
    Errors: Array<{
        Code: string;
        ShortText: string;
    }>;
    Status: 'Fail';
};
