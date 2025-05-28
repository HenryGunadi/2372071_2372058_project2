import express, {Request, Response, NextFunction} from 'express'


export class StaffController{
    public getOverview(req: Request, res:Response, next:NextFunction){
        return res.status(200).json({ message: "Staff" });
    }
}