import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { SolutionResponse } from "../models/responses";
import { isNull } from 'util';

@Injectable({
  providedIn: "root",
})
export class SchedulesService {
  API_URI = "http://localhost:3000/api";
  solution = "";
  solParsed: any[];

  constructor(private http: HttpClient) {}

  solve(params: string, complex: boolean): Observable<SolutionResponse> {
    return this.http.post<SolutionResponse>(`${this.API_URI}/schedules`, {
      params,
      complex,
    });
  }

  parse(solution: SolutionResponse): void {
    const { data } = solution;
    const re = /(?:\{|\[)(.*)(?:\}|\])/;
    const re2 = /(?:=\s)(?![\[|\{]+\s)([0-9]*)/;
    const items = data.split(";").map((item, i) => {
      const regres = re.exec(item) || re2.exec(item);
      if (isNull(regres)) {return "";} else
      if (i === 3) {
        return regres[1].split(", ");
      } else if (i >= 8) {
        return Number(regres[1]);
      } else {
        return regres[1].split(", ").map((e) => Number(e));
      }
    });
    this.solParsed = items;
  }
}
