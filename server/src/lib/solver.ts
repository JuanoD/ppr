import { exec } from "child_process";
import path from "path";

const model_1 = path.join(__dirname, "proyecto_pt1.mzn");
const model_2 = path.join(__dirname, "proyecto_pt2.mzn");

export function solve(params: string, complex: boolean): Promise<string> {
    let model: string;
    complex ? model = model_2 : model = model_1;
        
    return new Promise((resolve, reject) => {
        exec(`minizinc ${model} -D"${params}" --time-limit 300000`, (error, stdout, stderr) => {
            resolve(stdout ? stdout : stderr);
        })
    });    
}
