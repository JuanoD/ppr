import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { User } from "../../models/User";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  register: boolean = false;
  user: User = {
    // id: number,
    user_name: '',
    password: '',
    email: '',
  };
  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    const { path } = this.activatedRoute.snapshot.url[0];
    this.register = path === 'signup';
  }

  signUp() {
    console.log(this.user)
  }

  signIn() {
    console.log(this.user)
  }

}
