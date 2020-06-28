import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as io from 'socket.io-client';
import { first } from 'rxjs/operators';
import { MessageService } from '../services/message.service';
import { UserService } from '../services/user.service';
import {environment} from './../../environments/environment';
@Component({
  selector: 'app-sender',
  templateUrl: './sender.component.html',
  styleUrls: ['./sender.component.css']
})
export class SenderComponent implements OnInit {
  messageForm: FormGroup;
  loading = false;
  submitted = false;
  socket;
  constructor(
  private formBuilder: FormBuilder,
  private userService: UserService,
  private messageService: MessageService) {
    this.socket = io(environment.SOCKET_ENDPOINT);
  }
  get f() { return this.messageForm.controls; }
  ngOnInit(): void {
    this.messageForm = this.formBuilder.group({
        email: ['', Validators.required],
        message_text: ['', Validators.required]
    });
  }

  sendMessage() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.messageForm.invalid) {
        return;
    }

    this.loading = true;
    this.userService.getUser(this.f.email.value)
    .pipe(first())
    .subscribe(
        data => {
          if(data) {
            this.socket.emit('MSG_SENT', {
              user_id: data.result,
              message_text: this.f.message_text.value
            });
            this.messageService.sendMessage(data.result, this.f.message_text.value)
            .pipe(first())
            .subscribe(
              data => {
                this.loading = false;
              },
              error => {
                  this.loading = false;
              });
           }
        },
        error => {
            this.loading = false;
    });
  }
}
