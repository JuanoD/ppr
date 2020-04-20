import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { ScenesActor, scenesActors } from "src/app/models/ScenesActor";
import { SchedulesService } from "src/app/services/schedules.service";

declare var $: any; // To use jquery

@Component({
  selector: "app-constraints-input",
  templateUrl: "./constraints-input.component.html",
  styleUrls: ["./constraints-input.component.scss"],
})
export class ConstraintsInputComponent implements OnInit {
  scenes_actors: ScenesActor[];
  scenes_length: number[];
  dislikes: string[][] = [[undefined, undefined]];
  complex: boolean = true;
  inputString: string;

  constructor(
    private scheduleService: SchedulesService,
    private router: Router
  ) {
    const init_size = 5;
    this.scenes_actors = scenesActors(init_size, init_size);
    this.scenes_length = Array.from({ length: init_size }, () => 1);
  }

  ngOnInit(): void {
    $(function () {
      $('[data-toggle="tooltip"]').tooltip();
    });
  }

  public change_scenes(event): void {
    const newVal = Number(event.target.value);
    if (newVal === 0) return;
    const n_scenes = this.scenes_actors[0].scenes.length;
    const n_actors = this.scenes_actors.length;
    if (newVal < n_scenes) {
      for (let index = 0; index < n_scenes - newVal; index++) {
        this.scenes_actors.forEach((element) => element.scenes.pop());
        this.scenes_length.pop();
      }
    } else {
      for (let index = 0; index < newVal - n_scenes; index++) {
        this.scenes_actors.forEach((element) => element.scenes.push(false));
        this.scenes_length.push(1);
      }
    }
  }

  public change_actors(event): void {
    const newVal = Number(event.target.value);
    if (newVal === 0) return;
    const n_actors = this.scenes_actors.length;
    if (newVal < n_actors) {
      for (let index = newVal; index < n_actors; index++) {
        this.scenes_actors.pop();
      }
    } else {
      const n_scenes = this.scenes_actors[0].scenes.length;
      for (let index = newVal; index > n_actors; index--) {
        let name = "Actor " + (this.scenes_actors.length + 1);
        this.scenes_actors.push(new ScenesActor(name, n_scenes));
      }
    }
  }

  more_dislikes() {
    this.dislikes.push([undefined, undefined]);
  }

  less_dislikes() {
    if (this.dislikes.length === 1) {
      this.dislikes = [[undefined, undefined]];
    } else {
      this.dislikes.pop();
    }
  }

  submit() {
    // ------------ THIS CODE BLOCK PARSES THE INPUT TO SEND TO SERVER ---------
    let dzn = "ACTORES = {"; // Base model contains actors
    let dzn_2 = "\n\nDisponibilidad =\n[|"; // Model 2 contains availability
    let actors_name = Array.from(this.scenes_actors, (e) => {
      return e.name.replace(/ /g, "_"); // Populate an array with the names without spaces
    });
    dzn += actors_name.join(", ") + "};\n\nEscenas =\n[|"; // Add the actor's name, close curly brace, and add next parameter
    this.scenes_actors.forEach((actor, i) => {
      dzn +=
        actor.scenes.join(", ").replace(/true/g, "1").replace(/false/g, "0") +
        ", " +
        actor.payment +
        "\n |"; // Parse the scenes in which actors participate in + the payment per time unit
      dzn_2 += actors_name[i] + ", " + actor.availability + "\n |"; // Parse the availability for model 2 to avoid doing a second loop
    });
    dzn += "];\n\n" + "Duracion = [" + this.scenes_length.join(", ") + "];"; // Close the previous par bracket and add next par
    dzn_2 += "];\n\nEvitar =\n[|"; // Add next par for model 2
    let c = 0;
    this.dislikes.forEach((pair) => {
      if ((pair.includes("undefined") || pair.includes(undefined)) === false) {
        dzn_2 += pair.join(",").replace(/ /g, "_") + "\n |"; // Parse availability for second model
        c++; // Counts if there are valid values
      }
    });
    c == 0 ? (dzn_2 += "|];") : (dzn_2 += "];"); // If no valid values, close with | so it is still valid for minizinc.
    this.complex ? (dzn += dzn_2) : dzn; // If complex model, add model 1 and model 2.
    // ---------------- INPUT PARSED. READY TO SEND TO SERVER ------------------
    this.inputString = dzn;
    this.solve();
  }

  async submitString() {
    // this.inputString = this.inputString.replace(/ /g, "");
    this.inputString = this.inputString.replace(/%.*/g, "");
    this.complex = /Evitar/g.test(this.inputString);
    $("#stringModal").modal("hide");
    this.solve()
  }

  solve() {
    $("#solvingModal").modal("show");
    this.scheduleService.solve(this.inputString, this.complex).subscribe(
      (res) => {
        $("#solvingModal").modal("hide");
        this.scheduleService.solution = res.data;
        this.scheduleService.parse(res);
        this.router.navigate(["result"]); // Remove modal
      },
      (err) => console.error("Algo ha ocurrido", err)
    );
  }

  trackByIndex(index: number, obj: any): any {
    // https://stackoverflow.com/questions/40314732/angular-2-2-way-binding-with-ngmodel-in-ngfor
    return index;
  }
}
