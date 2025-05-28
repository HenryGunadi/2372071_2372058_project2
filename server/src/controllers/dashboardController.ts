import express, {Request, Response, NextFunction} from 'express'


export class DashboardController{
    public getOverview(req: Request, res:Response, next:NextFunction){
        return res.status(200).json({ message: "Success Getting Dashboard Overview" });
    }
}