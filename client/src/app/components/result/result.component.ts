import { Component, OnInit } from "@angular/core";
import { SchedulesService } from "src/app/services/schedules.service";
import { Router } from "@angular/router";
// Check https://stackoverflow.com/questions/34489916/how-to-load-external-scripts-dynamically-in-angular

@Component({
  selector: "app-result",
  templateUrl: "./result.component.html",
  styleUrls: ["./result.component.scss"],
})
export class ResultComponent implements OnInit {
  solution = "";
  chart = {
    // https://github.com/FERNman/angular-google-charts
    title: "Result",
    type: "Timeline",
    data: [
      ["1", "Test 1", "This is a test tooltip", 0, 1],
      ["2", "Test 2", "This is a test tooltip", 1, 2],
      ["3", "Test 3", "This is a test tooltip", 2, 3],
      ["4", "Test 4", "This is a test tooltip", 3, 4],
      ["5", "Test 5", "This is a test tooltip", 4, 5],
      ["6", "Test 6", "This is a test tooltip", 5, 6],
    ],
    // columnNames: ["Actor", "Name", "Start", "End"],
    columns: [
      { type: "string", id: "Actor" },
      { type: "string", id: "Name" },
      { type: "string", role: "tooltip" },
      { type: "number", id: "Start" },
      { type: "number", id: "End" },
    ],
    options: {
      hAxis: {
        minValue: 0,
      },
      chartArea:{left:0,top:0,width:"100%",height:"100%"},
      legend: {
        position: "top",
      },
      width: "100%",
    },
  };

  constructor(
    private schedulesService: SchedulesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.schedulesService.solution === "") {
      this.router.navigate(["ci"]);
      return;
    }
    this.solution = this.schedulesService.solution;
    if (!(this.schedulesService.solParsed === undefined)) {
      this.chart.data = Array.from(
        this.schedulesService.solParsed[0],
        (v: number, i) => [
          "Escenas",
          String(v),
          `This scene (${v}) lasts for ${
            this.schedulesService.solParsed[2][v-1] -
            this.schedulesService.solParsed[1][v-1]
          } time units. Starts at time ${
            this.schedulesService.solParsed[1][v-1]
          } and ends at ${this.schedulesService.solParsed[2][v-1]}.`,
          this.schedulesService.solParsed[1][v-1] * 1000 * 60 * 60,
          this.schedulesService.solParsed[2][v-1] * 1000 * 60 * 60,
        ]
      ).concat(
        Array.from(this.schedulesService.solParsed[3], (v, i) => [
          String(v),
          String(v),
          `${v} stays in set from ${this.schedulesService.solParsed[4][i]} to ${this.schedulesService.solParsed[5][i]}. That's ${this.schedulesService.solParsed[6][i]} time units. It costs ${this.schedulesService.solParsed[7][i]}`,
          this.schedulesService.solParsed[4][i] * 1000 * 60 * 60,
          this.schedulesService.solParsed[5][i] * 1000 * 60 * 60,
        ])
      );
    }
  }

  test() {}
}
