import express, {Request, Response, NextFunction} from 'express'


export class EventController{
    public registerEvent(req: Request, res:Response, next:NextFunction){
        return res.status(200).json({ message: "Event Register" });
    }
}