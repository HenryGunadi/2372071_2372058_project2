import mongoose, { Schema, Document, Model } from "mongoose";

interface IEvent extends Document {
    title: string;
    time: Date;
    location: string;
    speaker: string;
    poster_uri: string;
    price: number;
    max_participants: number;
    created_at: Date;
    updated_at: Date;
}

const EventSchema: Schema<IEvent> = new Schema({
    title: { type: String, required: true },
    time: { type: Date, required: true },
    location: { type: String, required: true },
    speaker: { type: String, required: true },
    poster_uri: { type: String, required: true },
    price: { type: Number, required: true },
    max_participants: { type: Number, required: true },
    created_at: { type: Date, required: true },
    updated_at: { type: Date, required: true },
});

const Event: Model<IEvent> = mongoose.model<IEvent>("Event", EventSchema);

export default Event;
