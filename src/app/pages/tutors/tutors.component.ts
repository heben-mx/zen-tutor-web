import { Component } from '@angular/core';
import {MatListModule} from '@angular/material/list';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatExpansionModule } from '@angular/material/expansion';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { Tutor } from '../tutor/tutor';
import { ChangeDetectorRef } from '@angular/core';
import { MessagingComponent } from 'app/components/messaging/messaging.component';
import { ChatRecipient } from 'app/models/chat-recipient';
import { OrderedSet } from 'js-sdsl'

const tutorsURI = `${environment.API_URL}/tutors`

@Component({
  selector: 'app-tutors',
  standalone: true,
  imports: [MatListModule, CommonModule, MatSidenavModule, MatExpansionModule, MatIconModule, MatCardModule, MatButtonModule, RouterModule, MessagingComponent],
  templateUrl: './tutors.component.html',
  styleUrl: './tutors.component.css'
})
export class TutorsComponent {
  tutors: Tutor[] = []; // Placeholder for fetched data
  selectedTutor: Tutor | null = null;
  uploadsFolder = environment.API_URL + '/uploads/';
  openChats: OrderedSet<ChatRecipient> = new OrderedSet([], (a: ChatRecipient, b: ChatRecipient) => a.id! - b.id!);
  closeChat: Function = (chat: ChatRecipient) => {
    console.log('Closing chat', chat);
    this.openChats.eraseElementByKey(chat);
  }

  constructor(private http: HttpClient, private changeDetectorRef: ChangeDetectorRef) { } // Inject HttpClient

  ngOnInit() {
    this.fetchTutors();
  }

  async fetchTutors() {
    this.http.get(tutorsURI)
      .subscribe((tutors: any) => {
        this.tutors = tutors;
        this.selectedTutor = tutors[0];
      });
  }

  selectTutor(tutor: Tutor) {
    this.selectedTutor = tutor;
  }

  openChat() {
    this.openChats.insert({...this.selectedTutor!, messages: []});
  }

  // closeChat(chatID: number) {
  //   console.log('Closing chat', chatID);
  //   this.openChats = this.openChats.filter(openChats => openChats.id !== chatID);
  // }
}
