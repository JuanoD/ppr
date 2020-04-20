import { Request, Response, Router } from "express";
import { BAD_REQUEST, CREATED, OK } from "http-status-codes";
import { ParamsDictionary } from "express-serve-static-core";
import { runQuery } from "../db";
import { QueryResult } from 'pg';
import { solve } from "../lib/solver"
import logger from '@shared/Logger';

// Init shared
const router = Router();

/******************************************************************************
 *                      Get All Users - "GET /api/schedules"
 ******************************************************************************/

router.get("/", async (req: Request, res: Response) => {
    const users: QueryResult = await runQuery("SELECT NOW()");
    return res.status(OK).json(users.rows[0]);
});

/******************************************************************************
 *                      Get A Users - "GET /api/schedules/:id"
 ******************************************************************************/

router.get("/:id", async (req: Request, res: Response) => {
    // const users = await userDao.getAll();
    const { id } = req.params;
    return res.status(OK).json({ id });
});

/******************************************************************************
 *                       Add One - "POST /api/users/
 ******************************************************************************/

router.post("/", async (req: Request, res: Response) => {
    const { params, complex } = req.body;
    const data = await solve(params.replace(/\n/g, ""), complex);
    return res.json({ data: data.replace(/\r\n/g, "\n") });
    /*
    if (!) {
        return res.status(BAD_REQUEST).json({
            error: "Add something to the body"
        });
    }
    return res.status(CREATED).end();
    */
});

/******************************************************************************
 *                       Update - "PUT /api/users/"
 ******************************************************************************/

router.put("/:id", async (req: Request, res: Response) => {
    const { user } = req.body;
    if (!user) {
        return res.status(BAD_REQUEST).json({
            error: "Put something"
        });
    }
    return res.status(OK).end();
});

/******************************************************************************
 *                    Delete - "DELETE /api/users/:id"
 ******************************************************************************/

router.delete("/:id", async (req: Request, res: Response) => {
    const { id } = req.params as ParamsDictionary;
    return res.status(OK).end();
});

/******************************************************************************
 *                                     Export
 ******************************************************************************/

export default router;
