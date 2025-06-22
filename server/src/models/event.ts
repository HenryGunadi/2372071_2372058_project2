import mongoose, { Schema, Document, Model } from "mongoose";

export interface IEventDay {
    date: Date;
    start_time: Date;
    status: boolean;
    end_time: Date;
    location: string;
    speaker: string;
}

export interface IEvent extends Document {
    title: string;
    poster_uri: string;
    deskripsi: string;
    status: boolean;
    max_participants: number;
    total_registered?: number;
    price: number;
    event_days: IEventDay[];
    created_at: Date;
    updated_at: Date;
}

const EventDaySchema: Schema<IEventDay> = new Schema({
    date: { type: Date, required: true },
    start_time: { type: Date, required: true },
    end_time: { type: Date, required: true },
    location: { type: String, required: true },
    speaker: { type: String, required: true },
    status: { type: Boolean, required: true },
});

const EventSchema: Schema<IEvent> = new Schema({
    title: { type: String, required: true },
    poster_uri: { type: String, required: true },
    deskripsi: {type: String, required: true}, 
    status: { type: Boolean, required: true },
    max_participants: { type: Number, required: true },
    total_registered: { type: Number, default: 0 },
    price: { type: Number, required: true },
    event_days: { type: [EventDaySchema], required: true },
    created_at: { type: Date, required: true },
    updated_at: { type: Date, required: true },
});

const Event: Model<IEvent> = mongoose.model<IEvent>("Event", EventSchema);

export default Event;
